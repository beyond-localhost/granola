package bowls_test

import (
	"database/sql"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/testutil"
	"granola/internal/todos"
	"testing"
	"time"
)

// TestCreate tests the Create method of the SQLiteBowlRepository.
func TestCreate(t *testing.T) {
	conn, err := testutil.NewTestConn()
	if err != nil {
		t.Fatal(err)
	}
	defer func() {
		conn.DB.Close()
	}()

	bowlRepo := bowls.NewSQLiteBowlRepository()
	bowlRepo.SetDB(conn.DB)

	name := "bowl1"
	description := "aabbccddeeffgghhiijjkkllmmnn"
	created, err := bowlRepo.Create(name, &description)

	if err != nil {
		t.Fatal(err)
	}

	got, err := bowlRepo.GetById(created.Id)

	if err != nil {
		t.Fatal(err)
	}

	if got.Name != created.Name {
		t.Errorf("bowlRepo.create(%s, %s) makes a bowl with id %d and name %s, but got the name of %s", name, description, created.Id, created.Name, got.Name)
	}
}



// TestDelete tests the Delete method of the SQLiteBowlRepository.
// Note that the flake, todo will be removed at the same time because of the foreign key.
func TestDelete(t *testing.T) {
	// connection
	conn, err := testutil.NewTestConn()
	if err != nil {
		t.Fatal(err)
	}
	defer func() {
		conn.DB.Close()
	}()

	bowlRepo := bowls.NewSQLiteBowlRepository()
	flakesRepo := flakes.NewSQLiteFlakeRepository()
	todoRepo := todos.NewSQLiteTodoRepository()

	// Set db on above repos
	bowlRepo.SetDB(conn.DB)
	flakesRepo.SetDB(conn.DB)
	todoRepo.SetDB(conn.DB)


	bowlName := "bowl1"
	
	createdBowl, err := bowlRepo.Create(bowlName, nil)
	if err != nil {
		t.Fatal(err)
	}


	
	flakeName := "flake1"
	
	createdFlake, err := flakesRepo.Create(flakeName, nil, createdBowl.Id)
	if err != nil {
		t.Fatal(err)
	}

	
	
	createdTodo, err := todoRepo.Create(createdFlake.Id, time.Now())
	if err != nil {
		t.Fatal(err)
	}

	


	// Delete the bowl
	err = bowlRepo.DeleteById(createdBowl.Id)
	if err != nil {
		t.Fatal(err)
	}

	_, err = bowlRepo.GetById(createdBowl.Id)
	
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the bowl", createdBowl.Id)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

	// Check if the flake is deleted
	_, err = flakesRepo.GetById(createdFlake.Id)
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the flake", createdFlake.Id)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

	// Check if the todo is deleted
	_, err = todoRepo.GetById(createdTodo.Id)
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the todo", createdTodo.Id)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

}