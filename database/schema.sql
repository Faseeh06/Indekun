-- Create Database (MySQL)
CREATE DATABASE IF NOT EXISTS indekun_db;
USE indekun_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 1,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    equipment_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    purpose TEXT NOT NULL,
    notes TEXT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_equipment_id (equipment_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Admin User (password: admin123)
-- Password hash for 'admin123' using bcrypt (will be updated by application)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@university.edu', '$2a$10$rOzJqQJqQJqQJqQJqQJqQeQJqQJqQJqQJqQJqQJqQJqQJqQJqQJqQ2', 'admin')
ON DUPLICATE KEY UPDATE email=email;

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
ON DUPLICATE KEY UPDATE name=name;

