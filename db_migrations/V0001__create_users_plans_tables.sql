CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_players INTEGER NOT NULL,
    ram_gb INTEGER NOT NULL,
    cpu_cores INTEGER NOT NULL,
    storage_gb INTEGER NOT NULL,
    has_ddos_protection BOOLEAN DEFAULT true,
    support_level VARCHAR(50) DEFAULT '24/7',
    features JSONB,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_servers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES plans(id),
    server_name VARCHAR(255) NOT NULL,
    minecraft_version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_servers_user_id ON user_servers(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_slug ON plans(slug);

INSERT INTO plans (name, slug, price, max_players, ram_gb, cpu_cores, storage_gb, features, is_popular) VALUES
('Starter', 'starter', 299.00, 10, 2, 1, 10, '["Автобэкапы", "FTP доступ", "Панель управления"]'::jsonb, false),
('Premium', 'premium', 599.00, 30, 4, 2, 25, '["Автобэкапы", "FTP доступ", "Панель управления", "Бесплатные плагины"]'::jsonb, true),
('Ultimate', 'ultimate', 999.00, 60, 8, 4, 50, '["Автобэкапы", "FTP доступ", "Панель управления", "Бесплатные плагины", "Приоритетная поддержка"]'::jsonb, false);