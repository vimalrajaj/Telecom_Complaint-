CREATE DATABASE IF NOT EXISTS telecom_complaints;
USE telecom_complaints;

-- Drop tables in reverse dependency order if they exist
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  role ENUM('CUSTOMER', 'ENGINEER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
);

CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  status ENUM('OPEN', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'OPEN',
  customer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_complaints_customer (customer_id),
  INDEX idx_complaints_status (status),
  INDEX idx_complaints_priority (priority)
);

CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL UNIQUE,
  engineer_id INT NOT NULL,
  status ENUM('ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'ASSIGNED',
  assigned_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (engineer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assignments_engineer (engineer_id),
  INDEX idx_assignments_complaint (complaint_id)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_comments_complaint (complaint_id)
);
