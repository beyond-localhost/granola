create table if not exists schema_migrations (
  version integer primary key,
  created_at timestamp not null default current_timestamp
);

create table if not exists bowls (
  id integer primary key,
  name text not null,
  description text
);

create table if not exists flakes (
  id integer primary key,
  name text not null,
  description text,
  bowl_id integer not null,
  
  constraint fk_flakes_bowls
    foreign key (bowl_id)
    references bowls (id)
    on delete cascade
);

create table if not exists todos (
  id integer primary key,
  flake_id integer not null,
  done binary not null default 0, -- 0 is false, 1 is true
  scheduled_at timestamp not null,

  constraint fk_todos_flakes
    foreign key (flake_id)
    references flakes (id)
    on delete cascade
)