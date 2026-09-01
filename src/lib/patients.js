import { supabase, isSupabaseConfigured } from "./supabaseClient.js";
import {
  readTable,
  insertRow,
  findRow,
  updateRow,
  deleteRow,
} from "./localStore.js";

const TABLE_NAME = "patients";

/**
 * Get all patients.
 *
 * Supabase mode:
 *   Reads from the patients table.
 *
 * Local demo mode:
 *   Reads from localStorage.
 */
export async function listPatients(options = {}) {
  const {
    limit = 100,
    riskLevel = null,
  } = options;

  if (isSupabaseConfigured) {
    let query = supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (riskLevel) {
      query = query.eq("risk_level", riskLevel);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list patients: ${error.message}`);
    }

    return data ?? [];
  }

  let patients = readTable(TABLE_NAME);

  if (riskLevel) {
    patients = patients.filter(
      (patient) => patient.risk_level === riskLevel
    );
  }

  return patients
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

/**
 * Get one patient by ID.
 */
export async function getPatient(id) {
  if (!id) {
    throw new Error("Patient ID is required.");
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get patient: ${error.message}`);
    }

    return data ?? null;
  }

  return findRow(TABLE_NAME, id);
}

/**
 * Create a new patient.
 */
export async function createPatient(patient) {
  if (!patient || typeof patient !== "object") {
    throw new Error("Patient data is required.");
  }

  if (!patient.name) {
    throw new Error("Patient name is required.");
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(patient)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }

    return data;
  }

  return insertRow(TABLE_NAME, patient);
}

/**
 * Update an existing patient.
 */
export async function updatePatient(id, updates) {
  if (!id) {
    throw new Error("Patient ID is required.");
  }

  if (!updates || typeof updates !== "object") {
    throw new Error("Patient updates are required.");
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }

    return data ?? null;
  }

  return updateRow(TABLE_NAME, id, updates);
}

/**
 * Delete a patient.
 */
export async function deletePatient(id) {
  if (!id) {
    throw new Error("Patient ID is required.");
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete patient: ${error.message}`);
    }

    return true;
  }

  return deleteRow(TABLE_NAME, id);
}