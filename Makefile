.PHONY: test deps build dev
CHECK_FILES?=./...

deps:
	@go mod download
	@go mod verify

dev: deps
	@wails dev

build:
	@wails build -platform darwin/universal,windows/arm64

test: build
	go test $(CHECK_FILES) -race -count=1
	