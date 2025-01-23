create table if not exists todos (
  id integer primary key,
  flake_id integer not null,
  done integer not null default 0, -- 0 is false, 1 is true
  scheduled_at timestamp not null,

  constraint fk_todos_flakes
    foreign key (flake_id)
    references flakes (id)
    on delete cascade
)