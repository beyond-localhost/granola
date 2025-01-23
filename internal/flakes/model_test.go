package flakes_test

import (
	"context"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/testutil"
	"testing"
)

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
	flakeQuery := flakes.New(conn.DB)

	t.Run("Create with non nullable description", func(t *testing.T) {
		createdBowl, err := bowlQuery.Create(ctx, bowls.CreateParams{Name: "TestBowlQuery"})
		if err != nil {
			t.Fatalf("error while creating a bowl: %v", err)
		}
		
		flakeName := "flakeOne"
		description := "flakeDescription"

		createdFlake, err := flakeQuery.Create(ctx, flakes.CreateParams{
			Name: flakeName, 
			Description: &description,
			BowlID: createdBowl.ID,
		})

		if err != nil {
			t.Fatal(err)
		}

		if createdFlake.Name != flakeName {
			t.Errorf("Create(%s, %s) should make a bowl with the name %s but got %s", flakeName, description, flakeName, createdFlake.Name)
		}
	})

	t.Run("Create with nullable description", func(t *testing.T) {
		createdBowl, err := bowlQuery.Create(ctx, bowls.CreateParams{Name: "TestBowlQuery2"})
		if err != nil {
			t.Fatalf("error while creating a bowl: %v", err)
		}
		
		flakeName := "flakeOneTwo"
		description := ""

		createdFlake, err := flakeQuery.Create(ctx, flakes.CreateParams{
			Name: flakeName, 
			Description: nil,
			BowlID: createdBowl.ID,
		})

		if err != nil {
			t.Fatal(err)
		}

		if createdFlake.Name != flakeName {
			t.Errorf("Create(%s, %s) should make a bowl with the name %s but got %s", flakeName, description, flakeName, createdFlake.Name)
		}
	})
}

