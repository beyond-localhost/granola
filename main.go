package main

import (
	"context"
	"embed"
	"granola/db"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/todos"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	conn := db.New()

	bowlsRepo := bowls.NewSQLiteBowlRepository()
	bowlsService := bowls.NewBowlsService(bowlsRepo)
	
	flakesRepo := flakes.NewSQLiteFlakeRepository()
	flakesService := flakes.NewFlakeService(flakesRepo)

	todosRepo := todos.NewSQLiteTodoRepository()
	todosService := todos.NewTodosService(todosRepo)


	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "granola",
		Width:  1200,
		Height: 900,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        func(ctx context.Context) {
			info := runtime.Environment(ctx)
			// info.BuildType
			log.Printf("Running on: %v\n", info)
			app.startup(ctx)
			conn.Init(info.BuildType)
			bowlsRepo.SetDB(conn.DB)
			flakesRepo.SetDB(conn.DB)
			todosRepo.SetDB(conn.DB)
		},
		Bind: []interface{}{
			app,
			bowlsService,
			flakesService,
			todosService,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
