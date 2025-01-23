-- Create a temp table
create table if not exists todos_new (
  id integer primary key,
  flake_id integer not null,
  done int not null default 0, -- 0 is false, 1 is true
  scheduled_at timestamp not null,

  constraint fk_todos_flakes
    foreign key (flake_id)
    references flakes (id)
    on delete cascade
);

-- copy the data from the old table to the new table
insert into todos_new (id, flake_id, done, scheduled_at)
select id, flake_id, done, scheduled_at
from todos;

-- drop the old one
drop table todos;

-- rename the new table to the original table name
alter table todos_new rename to todos;