CREATE TABLE IF NOT EXISTS participants
(
    team_id      BIGINT NOT NULL REFERENCES team(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_role_id INT NOT NULL REFERENCES team_roles(id),
    joined_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);