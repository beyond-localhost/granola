package bowels

import (
	"database/sql"
	"fmt"
	"granola/db/transaction"
	"strings"
)

type Bowel struct {
	Id   int64    `json:"id"`
	Name string `json:"name"`
	// description can be null.
	Description *string `json:"description"`
}

type BowelUpdate struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

func NewBowel(id int64, name string, description *string) *Bowel {
	return &Bowel{id, name, description}
}

type BowelRepository interface {
	GetAll() ([]Bowel, error)
	GetById(id int) (*Bowel, error)
	Create(name string, description *string) (*Bowel, error)
	UpdateById(id int, params map[string]string) (*Bowel, error)
	DeleteById(id int) error
}

type SQLiteBowelRepository struct {
	db *sql.DB
}

func NewSQLiteBowelRepository(db *sql.DB) *SQLiteBowelRepository {
	return &SQLiteBowelRepository{db}
}


func (r *SQLiteBowelRepository) Create(name string, description *string) (*Bowel, error) {
    result, err := r.db.Exec("insert into bowels (name, description) values (?, ?)", name, description)
    
    if err != nil {
        return nil, err
    }

    id, err := result.LastInsertId()
    
		if err != nil {
        return nil, err
    }

    return NewBowel(id, name, description), nil
}

func (r *SQLiteBowelRepository) GetAll() ([]Bowel, error) {
	rows, err := r.db.Query("select * from bowels")

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	bowels := []Bowel{}
	for rows.Next() {
		bowel := Bowel{}
		err = rows.Scan(&bowel.Id, &bowel.Name, &bowel.Description)
		if err != nil {
			return nil, err
		}
		bowels = append(bowels, bowel)
	}

	return bowels, nil
}

func (r *SQLiteBowelRepository) GetById(id int) (*Bowel, error) {
	row := r.db.QueryRow("select * from bowels where id = ?", id)

	bowel := Bowel{}
	err := row.Scan(&bowel.Id, &bowel.Name, &bowel.Description)

	if err != nil {
		return nil, err
	}

	return &bowel, nil
}

func getByIdTx(tx *sql.Tx, id int) (*Bowel, error) {
	row := tx.QueryRow("select * from bowels where id = ?", id)

	bowel := Bowel{}
	err := row.Scan(&bowel.Id, &bowel.Name, &bowel.Description)

	if err != nil {
		return nil, err
	}

	return &bowel, nil
}


func (r * SQLiteBowelRepository) UpdateById(id int, update BowelUpdate) (*Bowel, error) {
	_, err := r.GetById(id)
	
	if err != nil {
		return nil, err
	}

	return transaction.Tx(r.db, func(tx *sql.Tx) (*Bowel, error) {
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
			`UPDATE bowels 
			 SET %s 
			 WHERE id = ?`,
			strings.Join(setValues, ", "),
		)

		result, err := tx.Exec(query, append(args, id)...)
		
		if err != nil {
			return nil, fmt.Errorf("failed to update bowel: %w", err)
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