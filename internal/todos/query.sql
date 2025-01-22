-- name: Create :one
insert into todos (flake_id, scheduled_at)
values (?, ?)
returning *;

-- name: GetAll :many
select * from todos;

-- name: GetAllByFlakeId :many
select * from todos
where flake_id = ?;

-- name: GetById :one
select * from todos
where id = ?
limit 1;

-- name: GetAllByRange :many
select sqlc.embed(t), sqlc.embed(f)
from todos t
join flakes f on t.flake_id = f.id
where t.scheduled_at between ? and ?;


-- name: SetDone :exec
update todos
set done = ?
where id = ?
returning *;



-- name: DeleteById :exec
delete from todos
where id = ?;