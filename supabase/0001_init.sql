-- ============================================
-- MedSense AI - Phase 2 Database Schema
-- ============================================

-- Patients
create table if not exists patients (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    age integer,
    gender text,
    date_of_birth date,
    medical_record_number text unique,
    diagnosis text,
    risk_level text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Medical Images
create table if not exists medical_images (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    image_url text,
    image_type text,
    analysis_status text default 'pending',
    analysis_result jsonb,
    created_at timestamptz default now()
);

-- Clinical Reports
create table if not exists clinical_reports (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    report_text text,
    extracted_findings jsonb,
    risk_score numeric,
    created_at timestamptz default now()
);

-- Patient Vitals
create table if not exists vitals (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    recorded_at timestamptz default now(),
    heart_rate numeric,
    spo2 numeric,
    respiratory_rate numeric,
    temperature numeric,
    hrv numeric
);

-- Risk Scores
create table if not exists risk_scores (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    image_risk numeric,
    report_risk numeric,
    vitals_risk numeric,
    correlation_boost numeric default 0,
    unified_risk numeric,
    risk_tier text,
    explanation jsonb,
    created_at timestamptz default now()
);

-- Alerts
create table if not exists alerts (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    risk_score numeric,
    risk_tier text,
    reason text,
    status text default 'active',
    created_at timestamptz default now(),
    resolved_at timestamptz
);

-- Alert Feedback
create table if not exists alert_feedback (
    id uuid primary key default gen_random_uuid(),
    alert_id uuid not null references alerts(id) on delete cascade,
    feedback text not null,
    created_at timestamptz default now()
);

-- Analysis Results
create table if not exists analysis_results (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    analysis_type text not null,
    result jsonb,
    created_at timestamptz default now()
);

-- ============================================
-- Indexes
-- ============================================

create index if not exists idx_vitals_patient_time
on vitals(patient_id, recorded_at desc);

create index if not exists idx_risk_scores_patient_time
on risk_scores(patient_id, created_at desc);

create index if not exists idx_alerts_patient_time
on alerts(patient_id, created_at desc);

create index if not exists idx_images_patient
on medical_images(patient_id);

create index if not exists idx_reports_patient
on clinical_reports(patient_id);