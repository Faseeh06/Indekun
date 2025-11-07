-- Create Database (PostgreSQL)
-- Run this command first: CREATE DATABASE indekun_db;
-- Then connect: \c indekun_db;
-- Then run this script

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 1,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_available ON equipment(is_available);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    purpose TEXT NOT NULL,
    notes TEXT,
    priority priority_level DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_equipment_id ON bookings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);

-- Insert Default Admin User (password: admin123)
-- Password hash will be updated by application
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@university.edu', '$2a$10$rOzJqQJqQJqQJqQJqQJqQeQJqQJqQJqQJqQJqQJqQJqQJqQJqQJqQ2', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Equipment
INSERT INTO equipment (name, category, description, quantity, image_url) VALUES
('Projector - Sony VPL-FHZ90', 'Projectors', 'High-quality 4K projector for presentations and events', 3, '/professional-projector.jpg'),
('Laptop - MacBook Pro 16', 'Computers', '16-inch MacBook Pro with M2 chip', 5, '/modern-laptop.png'),
('Camera - Canon EOS R5', 'Cameras', 'Professional mirrorless camera with 4K video', 2, '/professional-camera.png'),
('Drone - DJI Air 3', 'Drones', 'Professional drone for aerial photography', 1, '/drone-quadcopter.jpg'),
('Studio Lighting Kit', 'Lighting', 'Professional studio lighting setup', 4, '/studio-lighting-kit.png'),
('Microphone - Studio Quality', 'Audio', 'Professional studio microphone', 3, '/microphone-studio.jpg'),
('Ultrawide Monitor', 'Monitors', '32-inch ultrawide monitor for presentations', 6, '/ultrawide-monitor-setup.png'),
('Color Printer', 'Printers', 'High-quality color printer', 2, '/color-printer.jpg')
ON CONFLICT DO NOTHING;

