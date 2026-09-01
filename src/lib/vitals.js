import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

import {
  readTable,
  insertRow,
  insertRows,
  queryRows,
} from "./localStore.js";

const TABLE_NAME = "vitals";

/**
 * Insert one vitals reading.
 */
export async function insertVitalsReading(reading) {
  if (!reading || typeof reading !== "object") {
    throw new Error("Vitals reading is required.");
  }

  if (!reading.patient_id) {
    throw new Error("patient_id is required.");
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(reading)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to insert vitals reading: ${error.message}`
      );
    }

    return data;
  }

  return insertRow(TABLE_NAME, reading);
}

/**
 * Insert multiple vitals readings at once.
 */
export async function insertVitalsReadings(readings) {
  if (!Array.isArray(readings)) {
    throw new Error("Vitals readings must be an array.");
  }

  if (readings.length === 0) {
    return [];
  }

  readings.forEach((reading) => {
    if (!reading.patient_id) {
      throw new Error("Every vitals reading must have a patient_id.");
    }
  });

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(readings)
      .select();

    if (error) {
      throw new Error(
        `Failed to insert vitals readings: ${error.message}`
      );
    }

    return data ?? [];
  }

  return insertRows(TABLE_NAME, readings);
}

/**
 * Get vitals history for one patient.
 */
export async function getVitalsHistory(
  patientId,
  options = {}
) {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  const {
    limit = 100,
    startTime = null,
    endTime = null,
  } = options;

  if (isSupabaseConfigured) {
    let query = supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("patient_id", patientId)
      .order("recorded_at", { ascending: true })
      .limit(limit);

    if (startTime) {
      query = query.gte("recorded_at", startTime);
    }

    if (endTime) {
      query = query.lte("recorded_at", endTime);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Failed to get vitals history: ${error.message}`
      );
    }

    return data ?? [];
  }

  let readings = queryRows(
    TABLE_NAME,
    (reading) => reading.patient_id === patientId
  );

  if (startTime) {
    readings = readings.filter(
      (reading) =>
        new Date(reading.recorded_at) >=
        new Date(startTime)
    );
  }

  if (endTime) {
    readings = readings.filter(
      (reading) =>
        new Date(reading.recorded_at) <=
        new Date(endTime)
    );
  }

  return readings
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() -
        new Date(b.recorded_at).getTime()
    )
    .slice(-limit);
}

/**
 * Get the latest vitals reading for a patient.
 */
export async function getLatestVitals(patientId) {
  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("patient_id", patientId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to get latest vitals: ${error.message}`
      );
    }

    return data ?? null;
  }

  const readings = queryRows(
    TABLE_NAME,
    (reading) => reading.patient_id === patientId
  );

  if (readings.length === 0) {
    return null;
  }

  return readings.reduce((latest, current) => {
    return new Date(current.recorded_at).getTime() >
      new Date(latest.recorded_at).getTime()
      ? current
      : latest;
  });
}

/**
 * Calculate the trend of a numeric vital.
 *
 * Returns:
 *   increasing
 *   decreasing
 *   stable
 */
export function calculateTrend(
  readings,
  field,
  options = {}
) {
  if (!Array.isArray(readings) || readings.length < 2) {
    return {
      direction: "stable",
      change: 0,
      percentage: 0,
    };
  }

  const {
    window = Math.min(6, readings.length),
  } = options;

  const validReadings = readings
    .filter(
      (reading) =>
        typeof reading[field] === "number" &&
        Number.isFinite(reading[field])
    )
    .slice(-window);

  if (validReadings.length < 2) {
    return {
      direction: "stable",
      change: 0,
      percentage: 0,
    };
  }

  const first = validReadings[0][field];
  const last =
    validReadings[validReadings.length - 1][field];

  const change = last - first;

  const percentage =
    first === 0 ? 0 : (change / Math.abs(first)) * 100;

  // Small variations are considered normal noise.
  const threshold = Math.max(
    Math.abs(first) * 0.02,
    0.5
  );

  let direction = "stable";

  if (change > threshold) {
    direction = "increasing";
  } else if (change < -threshold) {
    direction = "decreasing";
  }

  return {
    direction,
    change,
    percentage,
  };
}

/**
 * Summarize several vital trends together.
 */
export function summarizeTrend(readings) {
  if (!Array.isArray(readings) || readings.length < 2) {
    return {
      heart_rate: {
        direction: "stable",
        change: 0,
        percentage: 0,
      },
      spo2: {
        direction: "stable",
        change: 0,
        percentage: 0,
      },
      respiratory_rate: {
        direction: "stable",
        change: 0,
        percentage: 0,
      },
      temperature: {
        direction: "stable",
        change: 0,
        percentage: 0,
      },
      hrv: {
        direction: "stable",
        change: 0,
        percentage: 0,
      },
    };
  }

  return {
    heart_rate: calculateTrend(
      readings,
      "heart_rate"
    ),

    spo2: calculateTrend(
      readings,
      "spo2"
    ),

    respiratory_rate: calculateTrend(
      readings,
      "respiratory_rate"
    ),

    temperature: calculateTrend(
      readings,
      "temperature"
    ),

    hrv: calculateTrend(
      readings,
      "hrv"
    ),
  };
}

/**
 * Convert individual vital trends into a simple
 * clinical direction.
 *
 * This is NOT the fusion/risk scoring engine.
 * It only describes the direction of the raw vitals.
 */
export function classifyVitalTrend(readings) {
  const trends = summarizeTrend(readings);

  let deteriorationSignals = 0;
  let improvementSignals = 0;

  // Heart rate rising can indicate deterioration.
  if (trends.heart_rate.direction === "increasing") {
    deteriorationSignals += 1;
  }

  if (trends.heart_rate.direction === "decreasing") {
    improvementSignals += 1;
  }

  // SpO2 falling can indicate deterioration.
  if (trends.spo2.direction === "decreasing") {
    deteriorationSignals += 1;
  }

  if (trends.spo2.direction === "increasing") {
    improvementSignals += 1;
  }

  // Respiratory rate rising can indicate deterioration.
  if (
    trends.respiratory_rate.direction === "increasing"
  ) {
    deteriorationSignals += 1;
  }

  if (
    trends.respiratory_rate.direction === "decreasing"
  ) {
    improvementSignals += 1;
  }

  // Temperature rising can indicate deterioration.
  if (
    trends.temperature.direction === "increasing"
  ) {
    deteriorationSignals += 1;
  }

  if (
    trends.temperature.direction === "decreasing"
  ) {
    improvementSignals += 1;
  }

  // HRV generally falling can indicate deterioration.
  if (trends.hrv.direction === "decreasing") {
    deteriorationSignals += 1;
  }

  if (trends.hrv.direction === "increasing") {
    improvementSignals += 1;
  }

  let direction = "stable";

  if (deteriorationSignals >= improvementSignals + 2) {
    direction = "deteriorating";
  } else if (
    improvementSignals >= deteriorationSignals + 2
  ) {
    direction = "improving";
  }

  return {
    direction,
    deteriorationSignals,
    improvementSignals,
    trends,
  };
}