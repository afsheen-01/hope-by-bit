-- B3 · a minimal identity, so a record follows its person between phone and
-- browser: an id, an email, how they signed in, and when it was made.

create table account (
  id         text primary key,
  email      text not null unique,   -- both providers land on one account by it
  provider   text not null,          -- 'google' | 'email'
  created_at timestamptz not null default now()
);

-- Sessions are short-lived tokens. What is stored is the sha256 of the token,
-- not the token, so a copy of this table is not a set of working sessions.
create table session (
  token_hash text primary key,
  account_id text not null references account(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index session_account on session (account_id);

-- Single-use sign-in links. Same rule: the hash is stored, never the token.
create table sign_in_link (
  token_hash text primary key,
  email      text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at    timestamptz
);
