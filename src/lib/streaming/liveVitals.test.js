import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  startLiveVitals,
  stopLiveVitals,
} from "./liveVitals.js";

import { vitalsStream } from "./vitalsStream.js";

describe("liveVitals", () => {
  beforeEach(() => {
    vitalsStream.clear();
    vi.restoreAllMocks();
  });

  it("starts a live vitals stream", async () => {
    const readings = [];

    const unsubscribe = startLiveVitals(
      "demo-patient-a",
      (reading) => {
        readings.push(reading);
      },
      {
        intervalMs: 1000,
      }
    );

    // Allow the first immediate reading to arrive.
    await new Promise((resolve) =>
      setTimeout(resolve, 20)
    );

    expect(readings.length).toBeGreaterThan(0);

    expect(readings[0]).toHaveProperty(
      "patient_id"
    );

    expect(readings[0]).toHaveProperty(
      "heart_rate"
    );

    unsubscribe();
  });

  it("sends readings to the callback", async () => {
    const callback = vi.fn();

    const unsubscribe = startLiveVitals(
      "demo-patient-b",
      callback,
      {
        intervalMs: 1000,
      }
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 20)
    );

    expect(callback).toHaveBeenCalled();

    const reading =
      callback.mock.calls[0][0];

    expect(reading.patient_id).toBe(
      "demo-patient-b"
    );

    unsubscribe();
  });

  it("stops the stream when unsubscribed", async () => {
    const callback = vi.fn();

    const unsubscribe = startLiveVitals(
      "demo-patient-a",
      callback,
      {
        intervalMs: 20,
      }
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 30)
    );

    unsubscribe();

    const countAfterStop =
      callback.mock.calls.length;

    await new Promise((resolve) =>
      setTimeout(resolve, 60)
    );

    expect(
      callback.mock.calls.length
    ).toBe(countAfterStop);
  });

  it("rejects a missing patient ID", () => {
    expect(() =>
      startLiveVitals(
        "",
        () => {}
      )
    ).toThrow(
      "patientId is required."
    );
  });

  it("rejects an invalid callback", () => {
    expect(() =>
      startLiveVitals(
        "demo-patient-a",
        null
      )
    ).toThrow(
      "onReading must be a function."
    );
  });

  it("can explicitly stop a patient stream", () => {
    const callback = vi.fn();

    startLiveVitals(
      "demo-patient-c",
      callback,
      {
        intervalMs: 1000,
      }
    );

    stopLiveVitals(
      "demo-patient-c"
    );

    expect(
      vitalsStream
        .getSimulator("demo-patient-c")
        .isRunning()
    ).toBe(false);
  });
});