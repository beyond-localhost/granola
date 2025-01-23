-- name: Create :one
insert into flakes (name, description, bowl_id)
values (?, ?, ?)
returning *;

-- name: GetAll :many
select * from flakes;

-- name: GetAllByBowlId :many
select * from flakes
where bowl_id = ?;

-- name: GetById :one
select * from flakes
where id = ?
limit 1;

-- name: UpdateById :one
update flakes
set
  name = coalesce(sqlc.narg('name'), name),
  description = coalesce(sqlc.narg('description'), description)
where id = sqlc.arg('id')
returning *;



-- name: DeleteById :exec
delete from flakes
where id = ?;