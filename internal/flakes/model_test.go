package flakes_test

import (
	"database/sql"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/testutil"
	"granola/internal/todos"
	"testing"
	"time"
)

// TestCreate tests the Create, Remove method of the SQLiteFlakeRepository.
// The todo will be removed at the same time because of the foreign key.
func TestFlakeRepository(t *testing.T) {
	conn, err := testutil.NewTestConn()
	if err != nil {
		t.Fatal(err)
	}
	defer func() {
		conn.DB.Close()
	}()

	bowlRepo := bowls.NewSQLiteBowlRepository()
	bowlRepo.SetDB((conn.DB))
	flakeRepo := flakes.NewSQLiteFlakeRepository()
	flakeRepo.SetDB(conn.DB)

	todoRepo := todos.NewSQLiteTodoRepository()
	todoRepo.SetDB(conn.DB)

	name := "flake1"
	description := "aabbccddeeffgghhiijjkkllmmnn"
	_, err = flakeRepo.Create(name, &description, 1)

	if err == nil {
		t.Fatal(err)
	}

	createdBowl, err := bowlRepo.Create("bowl13", nil)
	if err != nil {
		t.Fatalf("error while creating a bowl: %v", err)
	}

	createdFlake, err := flakeRepo.Create(name, &description, createdBowl.Id)
	
	if err != nil {
		t.Fatal(err)
	}

	scheduled := time.Now()
	createdTodo, err := todoRepo.Create(createdFlake.Id, scheduled)
	
	if err != nil {
		t.Fatal(err)
	}

	// Remove the flake
	err = flakeRepo.DeleteById(createdFlake.Id)
	if err != nil {
		t.Fatal(err)
	}

	_, err = todoRepo.GetById(createdTodo.Id)
	
	if err == nil {
		t.Errorf("flakeRepo.DeleteById(%d) removes the todo with id %d, but got the todo", createdFlake.Id, createdTodo.Id)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}
}