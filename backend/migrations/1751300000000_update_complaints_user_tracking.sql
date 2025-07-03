-- Migration untuk menambahkan kolom tracking user dan role
-- Filename: 1751300000000_update_complaints_user_tracking.js

ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS created_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS created_by_role VARCHAR(20),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS updated_by_role VARCHAR(20),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(50),
ADD COLUMN IF NOT EXISTS assigned_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS resolved_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS resolved_by_role VARCHAR(20),
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;

-- Update status enum untuk menambahkan 'in_progress'
ALTER TABLE complaints 
ALTER COLUMN status TYPE VARCHAR(20);

-- Tambahkan index untuk performa
CREATE INDEX IF NOT EXISTS idx_complaints_created_by ON complaints(created_by);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_created_by_role ON complaints(created_by_role);

-- Update existing data (optional - jika ada data lama)
UPDATE complaints 
SET created_by_role = 'siswa', 
    updated_at = reported_at 
WHERE created_by_role IS NULL;
