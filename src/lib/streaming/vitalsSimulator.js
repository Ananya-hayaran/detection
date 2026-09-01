import { generateVitalsSeries } from "../demoData.js";

/**
 * Synthetic real-time vitals simulator.
 *
 * Uses fictional data only.
 * This is intended for the MedSense AI demo.
 */

export class VitalsSimulator {
  constructor(options = {}) {
    const {
      patientId = "demo-patient-a",
      intervalMs = 3000,
      points = 48,
      intervalMinutes = 15,
    } = options;

    this.patientId = patientId;
    this.intervalMs = intervalMs;
    this.points = points;
    this.intervalMinutes = intervalMinutes;

    this.listeners = new Set();
    this.history = [];

    this.series = generateVitalsSeries(
      patientId,
      {
        points,
        intervalMinutes,
      }
    );

    this.currentIndex = 0;
    this.timer = null;
    this.running = false;
  }

  subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(
        "Vitals simulator listener must be a function."
      );
    }

    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(reading) {
    for (const listener of this.listeners) {
      try {
        listener(reading);
      } catch (error) {
        console.error(
          "Vitals simulator listener error:",
          error
        );
      }
    }
  }

  next() {
    if (this.series.length === 0) {
      return null;
    }

    const reading =
      this.series[
        this.currentIndex % this.series.length
      ];

    this.currentIndex += 1;

    const liveReading = {
      ...reading,
      recorded_at: new Date().toISOString(),
    };

    this.history.push(liveReading);

    if (this.history.length > this.points) {
      this.history.shift();
    }

    this.notify(liveReading);

    return liveReading;
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;

    // Send the first reading immediately.
    this.next();

    this.timer = setInterval(() => {
      this.next();
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.running = false;
  }

  reset() {
    this.stop();

    this.currentIndex = 0;
    this.history = [];

    this.series = generateVitalsSeries(
      this.patientId,
      {
        points: this.points,
        intervalMinutes: this.intervalMinutes,
      }
    );
  }

  setPatient(patientId) {
    this.reset();

    this.patientId = patientId;

    this.series = generateVitalsSeries(
      patientId,
      {
        points: this.points,
        intervalMinutes: this.intervalMinutes,
      }
    );
  }

  getHistory() {
    return [...this.history];
  }

  isRunning() {
    return this.running;
  }
}

export function createVitalsSimulator(options = {}) {
  return new VitalsSimulator(options);
}