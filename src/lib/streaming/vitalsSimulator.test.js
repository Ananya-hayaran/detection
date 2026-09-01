import { describe, expect, it, vi } from "vitest";
import { VitalsSimulator } from "../streaming/vitalsSimulator.js";
import { VitalsStreamManager } from "../streaming/vitalsStream.js";

describe("VitalsSimulator", () => {
  it("creates a simulator with default settings", () => {
    const simulator = new VitalsSimulator();

    expect(simulator.patientId).toBe(
      "demo-patient-a"
    );

    expect(simulator.isRunning()).toBe(false);
    expect(simulator.getHistory()).toHaveLength(0);
  });

  it("generates a vitals reading", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
      points: 10,
    });

    const reading = simulator.next();

    expect(reading).not.toBeNull();

    expect(reading.patient_id).toBe(
      "demo-patient-a"
    );

    expect(reading).toHaveProperty("heart_rate");
    expect(reading).toHaveProperty("spo2");
    expect(reading).toHaveProperty(
      "respiratory_rate"
    );
    expect(reading).toHaveProperty(
      "temperature"
    );
    expect(reading).toHaveProperty("hrv");
    expect(reading).toHaveProperty(
      "recorded_at"
    );
  });

  it("stores generated readings in history", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-b",
      points: 10,
    });

    simulator.next();
    simulator.next();
    simulator.next();

    expect(simulator.getHistory()).toHaveLength(3);
  });

  it("limits history to the configured number of points", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
      points: 3,
    });

    simulator.next();
    simulator.next();
    simulator.next();
    simulator.next();
    simulator.next();

    expect(simulator.getHistory()).toHaveLength(3);
  });

  it("notifies subscribers when a reading arrives", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
    });

    const listener = vi.fn();

    simulator.subscribe(listener);

    const reading = simulator.next();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      reading
    );
  });

  it("allows subscribers to unsubscribe", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
    });

    const listener = vi.fn();

    const unsubscribe =
      simulator.subscribe(listener);

    unsubscribe();

    simulator.next();

    expect(listener).not.toHaveBeenCalled();
  });

  it("starts and stops the stream", () => {
    vi.useFakeTimers();

    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
      intervalMs: 1000,
    });

    simulator.start();

    expect(simulator.isRunning()).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(
      simulator.getHistory().length
    ).toBeGreaterThanOrEqual(3);

    simulator.stop();

    expect(simulator.isRunning()).toBe(false);

    vi.useRealTimers();
  });

  it("does not start the stream twice", () => {
    vi.useFakeTimers();

    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
      intervalMs: 1000,
    });

    simulator.start();
    simulator.start();

    vi.advanceTimersByTime(2000);

    expect(
      simulator.getHistory().length
    ).toBe(3);

    simulator.stop();

    vi.useRealTimers();
  });

  it("resets the simulator", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
    });

    simulator.next();
    simulator.next();

    expect(simulator.getHistory()).toHaveLength(2);

    simulator.reset();

    expect(simulator.getHistory()).toHaveLength(0);
    expect(simulator.isRunning()).toBe(false);
  });

  it("can switch patients", () => {
    const simulator = new VitalsSimulator({
      patientId: "demo-patient-a",
    });

    simulator.next();

    simulator.setPatient(
      "demo-patient-b"
    );

    const reading = simulator.next();

    expect(reading.patient_id).toBe(
      "demo-patient-b"
    );
  });
});

describe("VitalsStreamManager", () => {
  it("creates independent simulators for patients", () => {
    const manager =
      new VitalsStreamManager();

    const patientA =
      manager.getSimulator(
        "demo-patient-a"
      );

    const patientB =
      manager.getSimulator(
        "demo-patient-b"
      );

    expect(patientA).not.toBe(patientB);

    expect(patientA.patientId).toBe(
      "demo-patient-a"
    );

    expect(patientB.patientId).toBe(
      "demo-patient-b"
    );
  });

  it("reuses the same simulator", () => {
    const manager =
      new VitalsStreamManager();

    const first =
      manager.getSimulator(
        "demo-patient-a"
      );

    const second =
      manager.getSimulator(
        "demo-patient-a"
      );

    expect(first).toBe(second);
  });

  it("starts and stops a patient stream", () => {
    vi.useFakeTimers();

    const manager =
      new VitalsStreamManager();

    manager.getSimulator(
      "demo-patient-a",
      {
        intervalMs: 1000,
      }
    );

    manager.start(
      "demo-patient-a"
    );

    vi.advanceTimersByTime(2000);

    expect(
      manager.getHistory(
        "demo-patient-a"
      ).length
    ).toBe(3);

    manager.stop(
      "demo-patient-a"
    );

    vi.useRealTimers();
  });

  it("removes a patient simulator", () => {
    const manager =
      new VitalsStreamManager();

    manager.getSimulator(
      "demo-patient-a"
    );

    expect(
      manager.getHistory(
        "demo-patient-a"
      )
    ).toHaveLength(0);

    manager.remove(
      "demo-patient-a"
    );

    expect(
      manager.getHistory(
        "demo-patient-a"
      )
    ).toHaveLength(0);
  });

  it("clears all simulators", () => {
    const manager =
      new VitalsStreamManager();

    manager.getSimulator(
      "demo-patient-a"
    );

    manager.getSimulator(
      "demo-patient-b"
    );

    manager.clear();

    expect(
      manager.getHistory(
        "demo-patient-a"
      )
    ).toHaveLength(0);

    expect(
      manager.getHistory(
        "demo-patient-b"
      )
    ).toHaveLength(0);
  });
});