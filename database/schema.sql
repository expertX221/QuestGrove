CREATE TABLE IF NOT EXISTS questgrove_workspaces (
  id uuid PRIMARY KEY,
  access_hash text NOT NULL,
  snapshot jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (octet_length(snapshot::text) <= 1048576)
);
