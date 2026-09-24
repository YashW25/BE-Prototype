-- NYAYAVAULT Seed SQL Data for Demo Accounts and Initial Cases

-- Sample FIR Records for Simulation
INSERT INTO public.fir_records (fir_number, police_station, registration_date, case_type, complainant_name, description, investigating_officer, status, source)
VALUES
  ('FIR/2026/01842', 'Shivajinagar Police Station', '2026-09-18T10:30:00Z', 'Theft', 'Ramesh Kumar', 'Theft of digital storage equipment and financial ledger books from commercial office premises.', 'INS-102 (Insp. Rajesh Varma)', 'INVESTIGATION', 'DEMO_POLICE_STATION_API'),
  ('FIR/2026/01791', 'Pune Division Central PS', '2026-09-10T14:15:00Z', 'Financial Fraud', 'Sunita Deshmukh', 'Unauthorized electronic transfer of corporate funds across multiple shell accounts.', 'INS-108 (Insp. Priya Sharma)', 'INVESTIGATION', 'DEMO_POLICE_STATION_API'),
  ('FIR/2026/01905', 'Cyber Crime Cell HQ', '2026-09-21T09:00:00Z', 'Cyber Extortion', 'TechCorp India Pvt Ltd', 'Ransomware attack targeting internal database servers and legal contracts.', 'INS-115 (Insp. Amit Kulkarni)', 'PENDING_FORENSIC', 'DEMO_POLICE_STATION_API')
ON CONFLICT (fir_number) DO NOTHING;
