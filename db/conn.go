package db

import (
	"database/sql"
	"log"
	"net/url"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
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

// TODO: executable 디렉토리에 디비 추가


func userHomeDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Fatalf("Failed to get user home directory: %v", err)
	}
	return home
}

func New() *sql.DB {
	granolaDir := filepath.Join(userHomeDir(), "granola")
	if err := os.MkdirAll(granolaDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create granola directory: %v", err)
	}

	dbPath := filepath.Join(granolaDir, "granola.db")
	log.Printf("Using dbPath: %s\n", dbPath)

	newDB := false

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Printf("DB not exists: %s\n", err)
		newDB = true
	}

	connString := createConnectionString(dbPath, connectionOptions)
	log.Printf("Using connection path: %s\n", connString)
	conn, err := sql.Open("sqlite", connString)
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
		v, err := CurrentVersion(conn)
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

