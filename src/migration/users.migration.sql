CREATE TABLE "users" (
  "user_id" integer PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "display_name" varchar,
  "password" varchar NOT NULL,
  "created_at" timestamptz DEFAULT current_timestamp,
  "updated_at" timestamptz DEFAULT current_timestamp
);
