import { DEMO_PATIENTS, generateVitalsSeries } from "./demoData.js";
import {
  listPatients,
  createPatient,
} from "./patients.js";
import {
  insertVitalsReadings,
  getVitalsHistory,
} from "./vitals.js";
import { isSupabaseConfigured } from "./supabaseClient.js";

/**
 * Seeds the four fictional MedSense demo patients
 * and their corresponding vitals history.
 *
 * Works in both:
 *   1. Local/demo mode
 *   2. Supabase mode
 *
 * Safe to call multiple times:
 * existing demo patients are reused instead of duplicated.
 */
export async function seedDemoData(options = {}) {
  const {
    points = 48,
    intervalMinutes = 15,
    forceVitals = false,
  } = options;

  const existingPatients = await listPatients({
    limit: 500,
  });

  const patientResults = [];
  let createdPatients = 0;
  let reusedPatients = 0;
  let insertedVitals = 0;
  let skippedVitals = 0;

  for (const demoPatient of DEMO_PATIENTS) {
    let patient = existingPatients.find(
      (existing) =>
        existing.id === demoPatient.id ||
        existing.medical_record_number ===
          demoPatient.medical_record_number
    );

    if (!patient) {
      patient = await createPatient({
        ...demoPatient,
        is_demo: true,
      });

      createdPatients += 1;
    } else {
      reusedPatients += 1;
    }

    const existingVitals = await getVitalsHistory(
      patient.id,
      {
        limit: 500,
      }
    );

    if (
      existingVitals.length > 0 &&
      !forceVitals
    ) {
      skippedVitals += existingVitals.length;

      patientResults.push({
        patient,
        vitalsInserted: 0,
        vitalsExisting: existingVitals.length,
      });

      continue;
    }

    const vitals = generateVitalsSeries(
      demoPatient.id,
      {
        points,
        intervalMinutes,
      }
    ).map((reading) => ({
      ...reading,

      // The database patient ID is used here.
      patient_id: patient.id,
    }));

    if (vitals.length > 0) {
      const inserted = await insertVitalsReadings(
        vitals
      );

      insertedVitals += inserted.length;

      patientResults.push({
        patient,
        vitalsInserted: inserted.length,
        vitalsExisting: existingVitals.length,
      });
    }
  }

  return {
    mode: isSupabaseConfigured
      ? "supabase"
      : "local-demo",

    patients: {
      total: DEMO_PATIENTS.length,
      created: createdPatients,
      reused: reusedPatients,
    },

    vitals: {
      inserted: insertedVitals,
      skipped: skippedVitals,
    },

    results: patientResults,
  };
}

/**
 * Checks whether the demo dataset has already
 * been populated.
 */
export async function isDemoDataSeeded() {
  const patients = await listPatients({
    limit: 500,
  });

  const demoPatientIds = new Set(
    DEMO_PATIENTS.map((patient) => patient.id)
  );

  const demoPatients = patients.filter(
    (patient) =>
      patient.is_demo === true ||
      demoPatientIds.has(patient.id)
  );

  return demoPatients.length === DEMO_PATIENTS.length;
}

/**
 * Seeds only when the demo dataset isn't present.
 */
export async function seedDemoDataIfNeeded(
  options = {}
) {
  const alreadySeeded =
    await isDemoDataSeeded();

  if (alreadySeeded) {
    return {
      seeded: false,
      reason: "already-seeded",
    };
  }

  const result =
    await seedDemoData(options);

  return {
    seeded: true,
    reason: "seeded",
    ...result,
  };
}