-- name: Create :one
insert into bowls (name, description)
values (?, ?)
returning *;

-- name: GetAll :many
select * from bowls;

-- name: GetById :one
select * from bowls
where id = ?
limit 1;

-- name: UpdateById :one
update bowls
set
  name = coalesce(sqlc.narg('name'), name),
  description = coalesce(sqlc.narg('description'), description)
where id = sqlc.arg('id')
returning *;



-- name: DeleteById :exec
delete from bowls
where id = ?;