package todos

import (
	"database/sql"
	"fmt"
	"granola/db/transaction"
	"time"
)

type Todo struct {
	Id int64 `json:"id"`
	FlakeId int64 `json:"flakeId"`
	Done bool `json:"done"`
	ScheduledAt time.Time `json:"scheduledAt" ts_type:"Date" ts_transform:"new Date(__VALUE__)"`
}

type TodoWithFlakeName struct {
	Todo
	FlakeName string `json:"flakeName"`
}

func NewTodo(id int64, flakeId int64, done bool, scheduledAt time.Time) *Todo {
	return &Todo{
		Id: id,
		FlakeId: flakeId,
		Done: done,
		ScheduledAt: scheduledAt,
	}
}

type TodoRepository interface {
	Create(flakeId int64, scheduledAt time.Time) (*Todo, error)
	GetAllByFlakeId(flakeId int64) ([]Todo, error)
	GetAllByRange(from time.Time, to time.Time) ([]TodoWithFlakeName, error)
	SetDone(id int64) (bool, error)
}


type SQLiteTodoRepository struct {
	db *sql.DB
}

func NewSQLiteTodoRepository(db *sql.DB) TodoRepository {
	return &SQLiteTodoRepository{db}
}

func (r *SQLiteTodoRepository) Create(flakeId int64, scheduledAt time.Time) (*Todo, error) {
	result, err := r.db.Exec("insert into todos (flake_id scheduled_at) values (?, ?)", flakeId, scheduledAt)
	
	if err != nil {
		return nil, err
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	
	return NewTodo(id, flakeId, false, scheduledAt), nil
}

func getByIdTx(tx *sql.Tx, id int64) (*Todo, error) {
	row := tx.QueryRow("select * from todos where id = ?", id)
	
	todo := Todo{}

	err := row.Scan(&todo.Id, &todo.FlakeId, &todo.Done, &todo.ScheduledAt)
	
	if err != nil {
		return nil, err
	}
	
	return &todo, nil
}


func (r *SQLiteTodoRepository) GetAllByFlakeId(flakeId int64) ([]Todo, error) {
	rows, err := r.db.Query("select * from todos where flake_id = ?", flakeId)
	
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	ret := make([]Todo, 0)
	for rows.Next() {
		todo := Todo{}
		err := rows.Scan(&todo.Id, &todo.FlakeId, &todo.Done, &todo.ScheduledAt)
		if err != nil {
			return nil, err
		}
		ret = append(ret, todo)
	}
	
	return ret, nil
}

func (r * SQLiteTodoRepository) GetAllByRange(from time.Time, to time.Time) ([]TodoWithFlakeName, error) {
	rows, err := r.db.Query(`
		select * t.*, f.name as flake_name
		from todos t
		join flakes f on t.flake_id = f.id
		where scheduled_at between ? and ?
	`, from, to)
	
	if err != nil {
		return nil, err
	}

	ret := make([]TodoWithFlakeName, 0)

	for rows.Next() {
		todo := TodoWithFlakeName{}
		err := rows.Scan(
			&todo.Id,
			&todo.FlakeId,
			&todo.Done,
			&todo.ScheduledAt,
			&todo.FlakeName,
		)
		if err != nil {
			return nil, err
		}
	}

	return ret, nil
}


func (r * SQLiteTodoRepository) SetDone(id int64) (bool, error) {
	return transaction.Tx(r.db, func(tx *sql.Tx) (bool, error) {
		todo, err := getByIdTx(tx, id)
		if err != nil {
			return false, err
		}
		
		nextDone := !todo.Done

		ret, err := tx.Exec("update todos set done = ? where id = ?", nextDone, id)
		if err != nil {
			return false, err
		}
		
		affected, err := ret.RowsAffected()
		
		if err != nil {
			return false, fmt.Errorf("unsupported rowsAffected")
		}

		if affected != 1 {
			return false, fmt.Errorf("expected affected row is 1 but found %d", affected)
		}
		
		return nextDone, nil
	})
}

