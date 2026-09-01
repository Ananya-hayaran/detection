import {
  insertVitalsReading,
  getVitalsHistory,
  getLatestVitals,
} from "../vitals.js";

import { vitalsStream } from "./vitalsStream.js";

/**
 * Start a live vitals stream for a patient.
 *
 * Every generated reading is:
 * 1. Sent to the UI through the callback.
 * 2. Stored through the existing vitals data layer.
 *
 * Returns an unsubscribe function.
 */
export function startLiveVitals(
  patientId,
  onReading,
  options = {}
) {
  if (!patientId) {
    throw new Error("patientId is required.");
  }

  if (typeof onReading !== "function") {
    throw new Error(
      "onReading must be a function."
    );
  }

  const unsubscribe =
    vitalsStream.subscribe(
      patientId,
      async (reading) => {
        try {
          // Store the live reading using the existing
          // Supabase/local data layer.
          await insertVitalsReading(reading);

          // Send the reading to the UI.
          onReading(reading);
        } catch (error) {
          console.error(
            "Failed to process live vitals:",
            error
          );
        }
      },
      options
    );

  vitalsStream.start(patientId);

  return () => {
    unsubscribe();
    vitalsStream.stop(patientId);
  };
}

/**
 * Stop a patient's live stream.
 */
export function stopLiveVitals(patientId) {
  if (!patientId) {
    return;
  }

  vitalsStream.stop(patientId);
}

/**
 * Get the stored vitals history.
 */
export async function getLiveVitalsHistory(
  patientId,
  options = {}
) {
  return getVitalsHistory(
    patientId,
    options
  );
}

/**
 * Get the most recent stored vitals reading.
 */
export async function getLiveLatestVitals(
  patientId
) {
  return getLatestVitals(patientId);
}