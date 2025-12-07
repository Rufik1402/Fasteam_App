CREATE TABLE IF NOT EXISTS roles
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS role_authorities
(
    role_id   INT         NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    authority VARCHAR(50) NOT NULL,
    PRIMARY KEY (role_id, authority)
);