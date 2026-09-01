import { describe, expect, it } from "vitest";
import {
  calculateTrend,
  summarizeTrend,
  classifyVitalTrend,
} from "../vitals.js";

describe("vitals trend calculations", () => {
  it("detects an increasing trend", () => {
    const readings = [
      { heart_rate: 70 },
      { heart_rate: 75 },
      { heart_rate: 80 },
      { heart_rate: 90 },
    ];

    const result = calculateTrend(
      readings,
      "heart_rate"
    );

    expect(result.direction).toBe("increasing");
    expect(result.change).toBe(20);
  });

  it("detects a decreasing trend", () => {
    const readings = [
      { spo2: 98 },
      { spo2: 97 },
      { spo2: 95 },
      { spo2: 92 },
    ];

    const result = calculateTrend(
      readings,
      "spo2"
    );

    expect(result.direction).toBe("decreasing");
    expect(result.change).toBe(-6);
  });

  it("detects a stable trend", () => {
    const readings = [
      { heart_rate: 72 },
      { heart_rate: 73 },
      { heart_rate: 72 },
      { heart_rate: 73 },
    ];

    const result = calculateTrend(
      readings,
      "heart_rate"
    );

    expect(result.direction).toBe("stable");
  });

  it("handles insufficient readings", () => {
    const result = calculateTrend(
      [{ heart_rate: 72 }],
      "heart_rate"
    );

    expect(result.direction).toBe("stable");
    expect(result.change).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it("summarizes multiple vital trends", () => {
    const readings = [
      {
        heart_rate: 70,
        spo2: 98,
        respiratory_rate: 14,
        temperature: 36.7,
        hrv: 60,
      },
      {
        heart_rate: 90,
        spo2: 92,
        respiratory_rate: 22,
        temperature: 38,
        hrv: 35,
      },
    ];

    const result = summarizeTrend(readings);

    expect(result.heart_rate.direction).toBe(
      "increasing"
    );

    expect(result.spo2.direction).toBe(
      "decreasing"
    );

    expect(
      result.respiratory_rate.direction
    ).toBe("increasing");

    expect(result.temperature.direction).toBe(
      "increasing"
    );

    expect(result.hrv.direction).toBe(
      "decreasing"
    );
  });

  it("classifies strongly worsening vitals as deteriorating", () => {
    const readings = [
      {
        heart_rate: 70,
        spo2: 98,
        respiratory_rate: 14,
        temperature: 36.7,
        hrv: 60,
      },
      {
        heart_rate: 100,
        spo2: 90,
        respiratory_rate: 26,
        temperature: 38.5,
        hrv: 30,
      },
    ];

    const result = classifyVitalTrend(readings);

    expect(result.direction).toBe(
      "deteriorating"
    );

    expect(
      result.deteriorationSignals
    ).toBeGreaterThan(0);
  });
});