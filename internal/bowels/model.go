package bowels

import (
	"database/sql"
	"fmt"
)

type Bowel struct {
	Id   int64    `json:"id"`
	Name string `json:"name"`
	// description can be null.
	Description *string `json:"description"`
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

func (r *SQLiteBowelRepository) GetById (id int) (*Bowel, error) {
	row := r.db.QueryRow("select * from bowels where id = ?", id)

	bowel := Bowel{}
	err := row.Scan(&bowel.Id, &bowel.Name, &bowel.Description)

	if err != nil {
		return nil, err
	}

	return &bowel, nil
}



func (r *SQLiteBowelRepository) DeleteById(id int) error {
	result, err := r.db.Exec("delete from bowels where id = ?", id)
	if err != nil {
		return err
	}
	if rows, err := result.RowsAffected(); err != nil {
		return err
	} else if rows != 1 {
		return fmt.Errorf("expected to delete 1 row, but deleted %d", rows)
	} else {
		return nil
	}
}