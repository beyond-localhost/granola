package bowls

import (
	"database/sql"
	"fmt"
	"granola/db/transaction"
	"strings"
)

type Bowl struct {
	Id   int64    `json:"id"`
	Name string `json:"name"`
	// description can be null.
	Description *string `json:"description"`
}

type BowlUpdate struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

func NewBowel(id int64, name string, description *string) *Bowl {
	return &Bowl{id, name, description}
}

type BowlRepository interface {
	Create(name string, description *string) (*Bowl, error)
	GetAll() ([]Bowl, error)
	GetById(id int) (*Bowl, error)
	UpdateById(id int, update BowlUpdate) (*Bowl, error)
	DeleteById(id int) error
}

type SQLiteBowlRepository struct {
	db *sql.DB
}

func NewSQLiteBowlRepository(db *sql.DB) BowlRepository {
	return &SQLiteBowlRepository{db}
}


func (r *SQLiteBowlRepository) Create(name string, description *string) (*Bowl, error) {
    result, err := r.db.Exec("insert into bowls (name, description) values (?, ?)", name, description)
    
    if err != nil {
        return nil, err
    }

    id, err := result.LastInsertId()
    
		if err != nil {
        return nil, err
    }

    return NewBowel(id, name, description), nil
}

func (r *SQLiteBowlRepository) GetAll() ([]Bowl, error) {
	rows, err := r.db.Query("select * from bowls")

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	bowls := []Bowl{}
	for rows.Next() {
		bowel := Bowl{}
		err = rows.Scan(&bowel.Id, &bowel.Name, &bowel.Description)
		if err != nil {
			return nil, err
		}
		bowls = append(bowls, bowel)
	}

	return bowls, nil
}

func (r *SQLiteBowlRepository) GetById(id int) (*Bowl, error) {
	row := r.db.QueryRow("select * from bowls where id = ?", id)

	bowel := Bowl{}
	err := row.Scan(&bowel.Id, &bowel.Name, &bowel.Description)

	if err != nil {
		return nil, err
	}

	return &bowel, nil
}

func getByIdTx(tx *sql.Tx, id int) (*Bowl, error) {
	row := tx.QueryRow("select * from bowls where id = ?", id)

	bowel := Bowl{}
	err := row.Scan(&bowel.Id, &bowel.Name, &bowel.Description)

	if err != nil {
		return nil, err
	}

	return &bowel, nil
}


func (r * SQLiteBowlRepository) UpdateById(id int, update BowlUpdate) (*Bowl, error) {
	_, err := r.GetById(id)
	
	if err != nil {
		return nil, err
	}

	return transaction.Tx(r.db, func(tx *sql.Tx) (*Bowl, error) {
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
			`UPDATE bowls 
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

func (r *SQLiteBowlRepository) DeleteById(id int) error {
	_, err := r.GetById(id)
	
	if err != nil {
		return err
	}
	_, err = r.db.Exec("delete from bowls where id = ?", id)
	if err != nil {
		return fmt.Errorf("failed to delete bowel: %w", err)
	}

	return nil
}