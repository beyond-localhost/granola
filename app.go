package main

import (
	"context"
	"granola/internal/bowls"
	"granola/internal/flakes"
	"granola/internal/todos"
)

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
