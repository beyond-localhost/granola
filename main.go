package main

import (
	"embed"
	"granola/db"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/todos"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	db := db.New()

	bowlsRepo := bowls.NewSQLiteBowlRepository(db)
	bowlsService := bowls.NewBowlsService(bowlsRepo)

	flakesRepo := flakes.NewSQLiteFlakeRepository(db)
	flakesService := flakes.NewFlakeService(flakesRepo)

	todosRepo := todos.NewSQLiteTodoRepository(db)
	todosService := todos.NewTodosService(todosRepo)

	app := NewApp(bowlsService, flakesService, todosService)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "granola",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnDomReady: app.domReady,
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
