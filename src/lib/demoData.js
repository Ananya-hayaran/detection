import { generateId } from "./uuid.js";

export const DEMO_PATIENTS = [
  {
    id: "demo-patient-a",
    name: "Aarav Mehta",
    age: 67,
    gender: "Male",
    date_of_birth: "1959-03-14",
    medical_record_number: "DEMO-001",
    diagnosis: "Pneumonia with respiratory deterioration",
    risk_level: "high",
  },
  {
    id: "demo-patient-b",
    name: "Isha Sharma",
    age: 42,
    gender: "Female",
    date_of_birth: "1984-07-22",
    medical_record_number: "DEMO-002",
    diagnosis: "Post-operative observation",
    risk_level: "low",
  },
  {
    id: "demo-patient-c",
    name: "Kabir Singh",
    age: 58,
    gender: "Male",
    date_of_birth: "1968-11-05",
    medical_record_number: "DEMO-003",
    diagnosis: "Congestive heart failure",
    risk_level: "moderate",
  },
  {
    id: "demo-patient-d",
    name: "Meera Kapoor",
    age: 51,
    gender: "Female",
    date_of_birth: "1975-01-30",
    medical_record_number: "DEMO-004",
    diagnosis: "Respiratory infection — improving",
    risk_level: "improving",
  },
];

const PATIENT_BASELINES = {
  "demo-patient-a": {
    heart_rate: 82,
    spo2: 96,
    respiratory_rate: 18,
    temperature: 37.1,
    hrv: 48,
  },

  "demo-patient-b": {
    heart_rate: 72,
    spo2: 98,
    respiratory_rate: 15,
    temperature: 36.7,
    hrv: 62,
  },

  "demo-patient-c": {
    heart_rate: 86,
    spo2: 95,
    respiratory_rate: 19,
    temperature: 37.2,
    hrv: 42,
  },

  "demo-patient-d": {
    heart_rate: 91,
    spo2: 94,
    respiratory_rate: 21,
    temperature: 37.8,
    hrv: 35,
  },
};

function gaussianNoise(amount = 1) {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = Math.random();
  }

  while (v === 0) {
    v = Math.random();
  }

  const gaussian =
    Math.sqrt(-2 * Math.log(u)) *
    Math.cos(2 * Math.PI * v);

  return gaussian * amount;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function round(value, decimals = 1) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Generates a smooth 0 → 1 progression.
 * The easing prevents abrupt jumps between readings.
 */
function smoothProgress(progress) {
  const p = clamp(progress, 0, 1);

  return p * p * (3 - 2 * p);
}

/**
 * Generates realistic demonstration vitals.
 *
 * Patient A: deterioration
 * Patient B: stable
 * Patient C: elevated but relatively stable
 * Patient D: improvement
 */
export function generateVitalsSeries(patientId, options = {}) {
  const {
    points = 48,
    intervalMinutes = 15,
    endTime = new Date(),
  } = options;

  const baseline =
    PATIENT_BASELINES[patientId] ?? PATIENT_BASELINES["demo-patient-b"];

  const series = [];

  const endTimestamp = new Date(endTime).getTime();

  for (let index = 0; index < points; index += 1) {
    const progress =
      points <= 1 ? 1 : index / (points - 1);

    const trend = smoothProgress(progress);

    let heartRate = baseline.heart_rate;
    let spo2 = baseline.spo2;
    let respiratoryRate = baseline.respiratory_rate;
    let temperature = baseline.temperature;
    let hrv = baseline.hrv;

    switch (patientId) {
      case "demo-patient-a":
        // Deteriorating patient:
        // HR ↑, SpO2 ↓, RR ↑, temperature ↑, HRV ↓

        heartRate += 22 * trend;
        spo2 -= 7 * trend;
        respiratoryRate += 7 * trend;
        temperature += 0.9 * trend;
        hrv -= 18 * trend;
        break;

      case "demo-patient-b":
        // Stable patient:
        // Only small physiological fluctuations.

        heartRate += gaussianNoise(2);
        spo2 += gaussianNoise(0.35);
        respiratoryRate += gaussianNoise(0.8);
        temperature += gaussianNoise(0.08);
        hrv += gaussianNoise(2.5);
        break;

      case "demo-patient-c":
        // Elevated-risk patient:
        // Mild upward cardiovascular/respiratory trend.

        heartRate += 8 * trend;
        spo2 -= 2 * trend;
        respiratoryRate += 3 * trend;
        temperature += 0.3 * trend;
        hrv -= 7 * trend;
        break;

      case "demo-patient-d":
        // Improving patient:
        // HR ↓, SpO2 ↑, RR ↓, temperature ↓, HRV ↑

        heartRate -= 18 * trend;
        spo2 += 4 * trend;
        respiratoryRate -= 5 * trend;
        temperature -= 0.7 * trend;
        hrv += 16 * trend;
        break;

      default:
        break;
    }

    // Add realistic measurement noise.
    heartRate += gaussianNoise(1.8);
    spo2 += gaussianNoise(0.25);
    respiratoryRate += gaussianNoise(0.6);
    temperature += gaussianNoise(0.06);
    hrv += gaussianNoise(1.5);

    // Keep demo values within plausible boundaries.
    heartRate = clamp(heartRate, 45, 150);
    spo2 = clamp(spo2, 80, 100);
    respiratoryRate = clamp(respiratoryRate, 8, 40);
    temperature = clamp(temperature, 35, 40.5);
    hrv = clamp(hrv, 10, 100);

    const timestamp =
      endTimestamp -
      (points - 1 - index) * intervalMinutes * 60 * 1000;

    series.push({
      id: generateId(),
      patient_id: patientId,
      recorded_at: new Date(timestamp).toISOString(),

      heart_rate: Math.round(heartRate),
      spo2: round(spo2, 1),
      respiratory_rate: Math.round(respiratoryRate),
      temperature: round(temperature, 1),
      hrv: Math.round(hrv),
    });
  }

  return series;
}

/**
 * Generate vitals for all four demo patients.
 */
export function generateAllDemoVitals(options = {}) {
  return Object.fromEntries(
    DEMO_PATIENTS.map((patient) => [
      patient.id,
      generateVitalsSeries(patient.id, options),
    ])
  );
}

/**
 * Returns a demo patient by ID.
 */
export function getDemoPatient(patientId) {
  return (
    DEMO_PATIENTS.find(
      (patient) => patient.id === patientId
    ) ?? null
  );
}