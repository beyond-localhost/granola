package db

import (
	"database/sql"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)



var connectionOptions = map[string]string{
	"cache":         "private",
	"_foreign_keys": "yes",
	"mode":          "rwc",
}

func createConnectionString(path string, options map[string]string) string {
	connectionString := "file:" + path + "?"

	q := url.Values{}
	for k, v := range options {
		q.Set(k, v)
	}

	return connectionString + q.Encode()
}

func getProjectRoot() string {
	// Check if we're in development mode (go run)
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("Failed to get current file path")
	}

	// In development, find project root by traversing up until we find go.mod
	if strings.Contains(filename, "go-build") || strings.Contains(filename, "go/pkg/mod") {
		pwd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Failed to get current working directory: %v", err)
		}
		return pwd
	}

	dir := filepath.Dir(filename)
	// return dir
	// Go up two levels from internal/db to project root
	return filepath.Dir(dir)
}

func New() *sql.DB {
	projectRoot := getProjectRoot()
	dbPath := filepath.Join(projectRoot, "granola.db")
	log.Printf("Using dbPath: %s\n", dbPath)

	newDB := false

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Printf("DB not exists: %s\n", err)
		newDB = true
	}

	connString := createConnectionString(dbPath, connectionOptions)
	log.Printf("Using connection path: %s\n", connString)
	conn, err := sql.Open("sqlite3", connString)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Verify the connection
	if err := conn.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	

	log.Printf("Successfully connected to database: %s", connString)

	version := 0

	if !newDB {
		v, err := mustCurrentVersion(conn)
		if err != nil {
			log.Fatalf("Failed to get current version: %v", err)
		}
		version = v
	}

	migrations, err := loadMigrations()

	if err != nil {
		log.Fatalf("Failed to load migrations: %v", err)
	}

	if err := applyMigrations(conn, migrations, version); err != nil {
		log.Fatalf("Failed to apply migrations: %v", err)
	}

	log.Println("Applied all migrations")
	return conn
}

