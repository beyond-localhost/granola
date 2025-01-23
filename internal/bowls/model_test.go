package bowls_test

import (
	"context"
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
	ctx := context.Background()

	conn, err := testutil.NewTestConn()
	if err != nil {
		t.Fatal(err)
	}
	defer func() {
		conn.DB.Close()
	}()
	bowlQuery := bowls.New(conn.DB)
	
	t.Run("Create with non nullable description", func(t *testing.T) {
		name := "bowl1"
		description := "aabbccddeeffgghhiijjkkllmmnn"
		got, err := bowlQuery.Create(ctx, bowls.CreateParams{
			Name: name,
			Description: &description,
		})
		if err != nil {
			t.Fatal(err)
		}
	
		if got.Name != name {
			t.Errorf("Create(%s, %s) should make a bowl with name(%s) but got %s", name, description, name, got.Name)
		}
	})

	t.Run("Create with nullable description", func(t *testing.T) {
		name := "bowl2"

		got, err := bowlQuery.Create(ctx, bowls.CreateParams{
			Name: name,
			Description: nil,
		})

		if err != nil {
			t.Fatal(err)
		}

		if got.Name != name {
			t.Errorf("Create(%s, %s) should make a created bowl with name(%s) but got %s", name, "", name, got.Name)
		}
	})



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

	ctx := context.Background()


	bowlQuery := bowls.New(conn.DB)
	flakeQuery := flakes.New(conn.DB)
	todoQuery := todos.New(conn.DB)
	// bowlRepo := bowls.NewSQLiteBowlRepository()
	// flakesRepo := flakes.NewSQLiteFlakeRepository()
	// todoRepo := todos.NewSQLiteTodoRepository()

	// Set db on above repos
	// bowlRepo.SetDB(conn.DB)
	// flakesRepo.SetDB(conn.DB)
	// todoRepo.SetDB(conn.DB)


	bowlName := "bowl1"
	
	createdBowl, err := bowlQuery.Create(ctx, bowls.CreateParams{Name: bowlName})
	if err != nil {
		t.Fatal(err)
	}


	
	flakeName := "flake1"
	
	// createdFlake, err := flakesRepo.Create(flakeName, nil, createdBowl.Id)
	createdFlake, err := flakeQuery.Create(ctx, flakes.CreateParams{
		Name: flakeName,
		BowlID: createdBowl.ID,
	})
	
	if err != nil {
		t.Fatal(err)
	}

	
	
	// createdTodo, err := todoRepo.Create(createdFlake.Id, time.Now())
	createdTodo, err := todoQuery.Create(ctx, todos.CreateParams{
		FlakeID: createdFlake.ID,
		ScheduledAt: time.Now(),
	})
	if err != nil {
		t.Fatal(err)
	}

	


	// Delete the bowl
	// err = bowlRepo.DeleteById(createdBowl.Id)
	err = bowlQuery.DeleteById(ctx, createdBowl.ID)
	if err != nil {
		t.Fatal(err)
	}


	// _, err = bowlRepo.GetById(createdBowl.Id)
	_, err = bowlQuery.GetById(ctx, createdBowl.ID)
	
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the bowl", createdBowl.ID)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

	// Check if the flake is deleted
	// _, err = flakesRepo.GetById(÷createdFlake.Id)
	_, err = flakeQuery.GetById(ctx, createdFlake.ID)
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the flake", createdFlake.ID)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

	// Check if the todo is deleted
	_, err = todoQuery.GetById(ctx, createdTodo.ID)
	if err == nil {
		t.Errorf("bowlRepo.DeleteById(%d) should delete the todo", createdTodo.ID)
	} else if err != sql.ErrNoRows {
		t.Fatal(err)
	}

}