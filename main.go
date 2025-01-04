package main

import (
	"embed"
	"granola/db"
	"granola/internal/bowls"
	"granola/internal/flakes"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	db := db.New()

	bowlsRepo := bowls.NewSQLiteBowlRepository(db)
	bowelsService := bowls.NewBowelService(bowlsRepo)

	flakesRepo := flakes.NewSQLiteFlakeRepository(db)
	flakesService := flakes.NewFlakeService(flakesRepo)
	app := NewApp()

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
		Bind: []interface{}{
			app,
			bowelsService,
			flakesService,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
