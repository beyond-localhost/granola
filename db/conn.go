package db

import (
	"database/sql"
	"log"
	"net/url"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
)



var connectionOptions = map[string]string{
	"cache":         "private",
	"_pragma": "foreign_keys(1)",
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



func New() *sql.DB {
	/**
	** Do we need really read env file?
	**/
	err := godotenv.Load(".env")

	if err != nil {
			log.Fatal("Error loading .env file")
	}
	
	var appDir string
	appEnv := os.Getenv("APP_ENV")
	if len(appEnv) == 0 {
		log.Fatal("APP_ENV not set")
	} else if appEnv == "production" {
		appDir = appDataDirProd()
	} else {
		appDir = appDataDirDev()
	}

	log.Printf("appdir is %s\n", appDir)
	if err := os.MkdirAll(appDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create granola directory: %v", err)
	}
	

	dbPath := filepath.Join(appDir, "granola.db")
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

