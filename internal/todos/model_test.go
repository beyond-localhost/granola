package todos_test

import (
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/testutil"
	"granola/internal/todos"
	"testing"
	"time"
)

// TestTodoRepository tests the Create, SetDone, Remove method of the SQLiteTodoRepository.
func TestTodoRepository(t *testing.T) {
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

	createdBowl, err := bowlRepo.Create("bowl1", nil)
	if err != nil {
		t.Fatal(err)
	}

	createdFlake, err := flakeRepo.Create("flake1", nil, createdBowl.Id)
	if err != nil {
		t.Fatal(err)
	}

	scheduled := time.Now()
	createdTodo, err := todoRepo.Create(createdFlake.Id, scheduled)
	if err != nil {
		t.Fatal(err)
	}

	// SetDone
	next, err := todoRepo.SetDone(createdTodo.Id)
	if err != nil {
		t.Fatal(err)
	}
	if next == createdTodo.Done {
		t.Errorf("todoRepo.SetDone(%v) = %v but got %v", createdTodo.Done, !createdTodo.Done, next)
	}

	// Remove
	err = todoRepo.Remove(createdTodo.Id)
	if err != nil {
		t.Fatal(err)	
	}
}