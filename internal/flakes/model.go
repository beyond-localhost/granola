package flakes

import (
	"database/sql"
	"fmt"
	"granola/db/transaction"
	"strings"
)

// type Flake struct {
// 	Id          int64   `json:"id"`
// 	Name        string  `json:"name"`
// 	Description *string `json:"description"`
// 	BowlId      int64   `json:"bowlId"`
// }

type FlakeUpdate struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

func NewFlake(id int64, name string, description *string, bowlId int64) *Flake {
	return &Flake{
		Id:          id,
		Name:        name,	
		Description: description,
		BowlId:      bowlId,
	}
}

type FlakeRepository interface {
	SetDB(db *sql.DB)
	Create(name string, description *string, bowlId int64) (*Flake, error)
	GetAll() ([]Flake, error)
	GetAllByBowlId(bowlId int64) ([]Flake, error)
	GetById(id int64) (*Flake, error)
	UpdateById(id int64, update FlakeUpdate) (*Flake, error)
	DeleteById(id int64) error
}

type SQLiteFlakeRepository struct {
	db *sql.DB
}

func NewSQLiteFlakeRepository () FlakeRepository {
	return &SQLiteFlakeRepository{}
}

func (r *SQLiteFlakeRepository) SetDB(db *sql.DB) {
	r.db = db
}

func (r *SQLiteFlakeRepository) Create(name string, description *string, bowlId int64) (*Flake, error) {
	result, err := r.db.Exec("insert into flakes (name, description, bowl_id) values (?, ?, ?)", name, description, bowlId)

	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()

	if err != nil {
		return nil, err
	}

	return NewFlake(id, name, description, bowlId), nil
}

func (r *SQLiteFlakeRepository) GetAll() ([]Flake, error) {
	rows, err := r.db.Query("select * from flakes")

	if err != nil {
		return nil, err
	}

	defer func() {
		rows.Close()
	}()

	flakes := []Flake{}

	for rows.Next() {
		flake := Flake{}

		err := rows.Scan(&flake.Id, &flake.Name, &flake.Description, &flake.BowlId)
		if err != nil {
			return nil, err
		}

		flakes = append(flakes, flake)
	}

	return flakes, nil
}

func (r *SQLiteFlakeRepository) GetAllByBowlId(bowlId int64) ([]Flake, error) {
	rows, err := r.db.Query("select * from flakes where bowl_id = ?", bowlId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	flakes := []Flake{}

	for rows.Next() {
		flake := Flake{}

		err := rows.Scan(&flake.Id, &flake.Name, &flake.Description, &flake.BowlId)
		if err != nil {
			return nil, err
		}

		flakes = append(flakes, flake)
	}

	return flakes, nil
}

func (r *SQLiteFlakeRepository) GetById(id int64) (*Flake, error) {
	row := r.db.QueryRow("select * from flakes where id = ?", id)

	flake := Flake{}

	err := row.Scan(&flake.Id, &flake.Name, &flake.Description, &flake.BowlId)

	if err != nil {
		return nil, err
	}

	return &flake, nil
}

func getByIdTx(tx *sql.Tx, id int64) (*Flake, error) {
	row := tx.QueryRow("select * from flakes where id = ?", id)

	flake := Flake{}

	err := row.Scan(&flake.Id, &flake.Name, &flake.Description, &flake.BowlId)

	if err != nil {
		return nil, err
	}

	return &flake, nil
}

func (r *SQLiteFlakeRepository) UpdateById(id int64, update FlakeUpdate) (*Flake, error) {
	_, err := r.GetById(id)
	if err != nil {
		return nil, err
	}

	return transaction.Tx(r.db, func(tx *sql.Tx) (*Flake, error) {
		setValues := make([]string, 2)
		args := make([]interface{}, 2)

		if update.Name != nil {
			setValues = append(setValues, "name = ?")
			args = append(args, *update.Name)
		}

		if update.Description != nil {
			setValues = append(setValues, "description = ?")
			args = append(args, *update.Description)
		}

		query := fmt.Sprintf(
			`update flakes
			 set %s
			 where id = ?`,
			strings.Join(setValues, ", "),
		)

		result, err := tx.Exec(query, append(args, id)...)

		if err != nil {
			return nil, fmt.Errorf("failed to update flake: %v", err)
		}

		rows, err := result.RowsAffected()

		if err != nil {
			return nil, fmt.Errorf("failed to get affected rows: %w", err)
		}

		if rows != 0 {
			return nil, fmt.Errorf("no rows affected: %w", err)
		}

		updated, err := getByIdTx(tx, id)

		if err != nil {
			return nil, fmt.Errorf("failed to get updated row after update: %w", err)
		}

		return updated, nil
	})
}

func (r *SQLiteFlakeRepository) DeleteById(id int64) error {
	_, err := r.GetById(id)

	if err != nil {
		return err
	}

	_, err = r.db.Exec("delete from flakes where id = ?", id)
	if err != nil {
		return err
	}

	return nil
}

