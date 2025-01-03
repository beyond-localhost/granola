package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type migration struct {
	version int
	description string
	filePath string
}

func loadMigrations() ([]migration, error) {
	root := getProjectRoot()
	dirPath := filepath.Join(root, "db", "migrations")

	entries, err := os.ReadDir(dirPath)
	
	if err != nil { 
		return nil, fmt.Errorf("migration directory: %v", err)
	}

	var migrations []migration

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		if !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}

		parts := strings.SplitN(entry.Name(), "_", 2)

		fmt.Printf("Found migration file: %s, parts: %v\n", entry.Name(), parts)
		
		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid migration file name: %s", entry.Name())	
		}

		var version int
		if _, err := fmt.Sscanf(parts[0], "%d", &version); err != nil {
			return nil, fmt.Errorf("invalid migration version(%s): %v",parts[0], err)
		}

		description := strings.TrimSuffix(parts[1], ".sql")
		filePath := filepath.Join(dirPath, entry.Name())

		migrations = append(migrations, migration{
			version: version,
			description: description,
			filePath: filePath,
		})
	}

	sort.Slice(migrations, func (i, j int) bool {
		return migrations[i].version < migrations[j].version
	})


	return migrations, nil
}

func applyMigrations(db *sql.DB, migrations []migration, currentVersion int) error {
	log.Printf("applymigrations: %v, %d\n", migrations, currentVersion)
	var pendingMigrations []migration
	for _, m := range migrations {
			if m.version > currentVersion {
					pendingMigrations = append(pendingMigrations, m)
			}
	}

	log.Printf("Pending migrations: %v\n", pendingMigrations)
	
	if len(pendingMigrations) == 0 {
		return nil
	}

	tx, err := db.Begin()
	
	if err != nil {
		return fmt.Errorf("begin transaction: %v", err)
	}

	defer tx.Rollback()

	for _, m := range pendingMigrations {
		content, err := os.ReadFile(m.filePath)
		
		if err != nil {
			return fmt.Errorf("read file: %v", err)
		}

		if _, err := tx.Exec(string(content)); err != nil {
			return fmt.Errorf("execute migration: %v", err)
		}

		if _, err := tx.Exec(`
			insert into schema_migrations(version) values($1)
		`, m.version); err != nil {
			return fmt.Errorf("insert schema_migrations: %v", err)
		}

		fmt.Printf("Applied migration %d: %s\n", m.version, m.description)
	}
	
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit transaction: %v", err)
	}

	return nil
}


func mustCurrentVersion(db *sql.DB) (int, error) {
	var version int
	err := db.QueryRow(`
	  select version from schema_migrations
		order by version desc
		limit 1
	`).Scan(&version)

	if err == sql.ErrNoRows {
		return version, nil
	}
	
	return version, err
}