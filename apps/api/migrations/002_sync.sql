-- B4 · the wall, Keepsakes and settings.
--
-- Read the columns and notice what is missing. There is no loop-breaker table,
-- no run count, no streak, no per-day score, and no dedication column. Those
-- are not omissions to fill in later: the API having nowhere to put them is
-- how P4, P2 and the grief gate hold by construction (p4.test.ts reads this
-- file's text and fails if one appears).

-- The wall appends. Ids come from the client so two devices offline both
-- arrive; timestamps come from the device that made the entry.
create table entry (
  id         text primary key,
  account_id text not null references account(id) on delete cascade,
  at         timestamptz not null,
  what       text not null,
  bit_id     text
);

create index entry_account on entry (account_id);

-- Keepsakes are a set: add and remove, each carrying a time. `removed_at` is
-- what lets a removal travel between devices — without it a device that never
-- saw the removal would resurrect the row on the next merge.
create table keepsake (
  account_id text not null references account(id) on delete cascade,
  bit_id     text not null,
  at         timestamptz not null,
  removed_at timestamptz,
  primary key (account_id, bit_id)
);

-- Last write wins, per key.
create table setting (
  account_id text not null references account(id) on delete cascade,
  key        text not null,
  value      text not null,
  updated_at timestamptz not null,
  primary key (account_id, key)
);
