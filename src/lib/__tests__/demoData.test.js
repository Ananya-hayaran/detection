import { describe, expect, it } from "vitest";
import {
  DEMO_PATIENTS,
  generateVitalsSeries,
  generateAllDemoVitals,
  getDemoPatient,
} from "../demoData.js";

describe("demoData", () => {
  it("contains four demo patients", () => {
    expect(DEMO_PATIENTS).toHaveLength(4);
  });

  it("creates valid vitals history", () => {
    const readings = generateVitalsSeries("demo-patient-a", {
      points: 48,
      intervalMinutes: 15,
    });

    expect(readings).toHaveLength(48);

    expect(readings[0]).toHaveProperty("patient_id");
    expect(readings[0]).toHaveProperty("heart_rate");
    expect(readings[0]).toHaveProperty("spo2");
    expect(readings[0]).toHaveProperty("respiratory_rate");
    expect(readings[0]).toHaveProperty("temperature");
    expect(readings[0]).toHaveProperty("hrv");
    expect(readings[0]).toHaveProperty("recorded_at");
  });

  it("keeps vitals within plausible demo ranges", () => {
    const readings = generateVitalsSeries("demo-patient-a", {
      points: 48,
    });

    for (const reading of readings) {
      expect(reading.heart_rate).toBeGreaterThanOrEqual(45);
      expect(reading.heart_rate).toBeLessThanOrEqual(150);

      expect(reading.spo2).toBeGreaterThanOrEqual(80);
      expect(reading.spo2).toBeLessThanOrEqual(100);

      expect(reading.respiratory_rate).toBeGreaterThanOrEqual(8);
      expect(reading.respiratory_rate).toBeLessThanOrEqual(40);

      expect(reading.temperature).toBeGreaterThanOrEqual(35);
      expect(reading.temperature).toBeLessThanOrEqual(40.5);

      expect(reading.hrv).toBeGreaterThanOrEqual(10);
      expect(reading.hrv).toBeLessThanOrEqual(100);
    }
  });

  it("generates data for all demo patients", () => {
    const allVitals = generateAllDemoVitals({
      points: 10,
    });

    expect(Object.keys(allVitals)).toHaveLength(4);

    expect(allVitals["demo-patient-a"]).toHaveLength(10);
    expect(allVitals["demo-patient-b"]).toHaveLength(10);
    expect(allVitals["demo-patient-c"]).toHaveLength(10);
    expect(allVitals["demo-patient-d"]).toHaveLength(10);
  });

  it("finds a demo patient by ID", () => {
    const patient = getDemoPatient("demo-patient-a");

    expect(patient).not.toBeNull();
    expect(patient.id).toBe("demo-patient-a");
    expect(patient.name).toBe("Aarav Mehta");
  });

  it("returns null for an unknown patient", () => {
    expect(getDemoPatient("does-not-exist")).toBeNull();
  });
});