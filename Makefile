.PHONY: test deps build dev
CHECK_FILES?=./...

deps:
	@go install github.com/wailsapp/wails/v2/cmd/wails@latest
	@go mod download
	@go mod verify

dev: deps
	@wails dev

build: deps
	@wails build -platform darwin/arm64,windows/arm64

test: build
	go test $(CHECK_FILES) -race -count=1
	