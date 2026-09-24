CREATE TABLE IF NOT EXISTS users(
    user_id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_no VARCHAR(20),
    college VARCHAR(150) NOT NULL,
    about VARCHAR(500), 
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    resume_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hackathons(
    hack_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    venue VARCHAR(255),
    cover_image VARCHAR(500),
    regi_url VARCHAR(500) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (end_date >= start_date)
);

ALTER TABLE hackathons
ADD COLUMN min_team_size INTEGER,
ADD COLUMN max_team_size INTEGER;

ALTER TABLE hackathons
ADD CONSTRAINT valid_min_team_size
CHECK (min_team_size > 0),
ADD CONSTRAINT valid_max_team_size
CHECK (max_team_size >= min_team_size);

CREATE TABLE IF NOT EXISTS teams(
    team_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(50) NOT NULL,
    description TEXT,
    max_members INTEGER NOT NULL CHECK (max_members > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hack_id uuid NOT NULL REFERENCES hackathons(hack_id),
    leader_id uuid NOT NULL REFERENCES users(user_id)
);