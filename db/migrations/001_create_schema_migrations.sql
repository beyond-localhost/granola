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
