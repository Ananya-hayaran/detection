import { createVitalsSimulator } from "./vitalsSimulator.js";

/**
 * Manages real-time vitals simulators for patients.
 *
 * Each patient gets an independent simulator.
 */
export class VitalsStreamManager {
  constructor() {
    this.simulators = new Map();
  }

  /**
   * Get an existing simulator or create a new one.
   */
  getSimulator(patientId, options = {}) {
    if (!patientId) {
      throw new Error("patientId is required.");
    }

    if (!this.simulators.has(patientId)) {
      const simulator = createVitalsSimulator({
        patientId,
        ...options,
      });

      this.simulators.set(
        patientId,
        simulator
      );
    }

    return this.simulators.get(patientId);
  }

  /**
   * Subscribe to live readings for a patient.
   *
   * Returns an unsubscribe function.
   */
  subscribe(
    patientId,
    listener,
    options = {}
  ) {
    const simulator =
      this.getSimulator(
        patientId,
        options
      );

    return simulator.subscribe(listener);
  }

  /**
   * Start streaming for one patient.
   */
  start(patientId) {
    const simulator =
      this.getSimulator(patientId);

    simulator.start();
  }

  /**
   * Stop streaming for one patient.
   */
  stop(patientId) {
    const simulator =
      this.simulators.get(patientId);

    if (simulator) {
      simulator.stop();
    }
  }

  /**
   * Start all patient streams.
   */
  startAll() {
    for (const simulator of this.simulators.values()) {
      simulator.start();
    }
  }

  /**
   * Stop all patient streams.
   */
  stopAll() {
    for (const simulator of this.simulators.values()) {
      simulator.stop();
    }
  }

  /**
   * Get the current history for a patient.
   */
  getHistory(patientId) {
    const simulator =
      this.simulators.get(patientId);

    if (!simulator) {
      return [];
    }

    return simulator.getHistory();
  }

  /**
   * Remove a patient's simulator.
   */
  remove(patientId) {
    const simulator =
      this.simulators.get(patientId);

    if (simulator) {
      simulator.stop();
      this.simulators.delete(patientId);
    }
  }

  /**
   * Remove all simulators.
   */
  clear() {
    this.stopAll();
    this.simulators.clear();
  }
}

/**
 * Shared application-level stream manager.
 */
export const vitalsStream =
  new VitalsStreamManager();