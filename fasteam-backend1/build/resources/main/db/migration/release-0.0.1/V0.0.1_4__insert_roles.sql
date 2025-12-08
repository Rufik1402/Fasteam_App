-- insert_initial_roles.sql

INSERT INTO roles (name) VALUES ('USER'), ('ADMIN') ON CONFLICT DO NOTHING;

INSERT INTO role_authorities (role_id, authority)
SELECT id, 'USER_READ' FROM roles WHERE name='USER'
ON CONFLICT DO NOTHING;

INSERT INTO role_authorities (role_id, authority)
SELECT id, 'USER_READ' FROM roles WHERE name='ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO role_authorities (role_id, authority)
SELECT id, 'ADMIN_READ' FROM roles WHERE name='ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO role_authorities (role_id, authority)
SELECT id, 'ADMIN_WRITE' FROM roles WHERE name='ADMIN'
ON CONFLICT DO NOTHING;
