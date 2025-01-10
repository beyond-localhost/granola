package main

import (
	"context"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/todos"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	bowlsService *bowls.BowlsService
	todosService *todos.TodosService
	flakesService *flakes.FlakeService
}

// NewApp creates a new App application struct
func NewApp(bowlsService *bowls.BowlsService, flakeService *flakes.FlakeService, todosService *todos.TodosService) *App {
	return &App{
		bowlsService: bowlsService,
		flakesService: flakeService,
		todosService: todosService,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domReady(_ context.Context) {
	bowls, err := a.bowlsService.GetAll()
	if err != nil {
		return 
	}
	flakes, err := a.flakesService.GetAll()
	if err != nil {
		return
	}

	todos, err := a.todosService.GetAll()
	
	if err != nil {
		return
	}
	runtime.EventsEmit(a.ctx, "initialize", bowls, flakes, todos)	
}


