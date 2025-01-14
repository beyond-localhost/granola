package db

import (
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"

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

func ResolveAppDir(buildType string) string {
	switch buildType {
	case "production":
		return appDataDirProd()
	case "dev":
		return appDataDirDev()
	case "test":
		return appDataDirTest()
	default:
		log.Fatalf("Unknown build type: %s", buildType)
		return ""
	}
}

type Conn struct {
	DB *sql.DB
	appDirPath string
	dbName string
}

func New() *Conn {
	return &Conn{}
}

func (c *Conn) SetAppDirPath(appDirPath string) {
	c.appDirPath = appDirPath
}

func (c *Conn) SetAppDirPathByBuildType(buildType string) (error) {
	var ret string
	switch buildType {
		case "production": ret = appDataDirProd()
		case "dev": ret = appDataDirDev()
		case "test": ret = appDataDirTest()
	}

	if len(ret) == 0 {
		return fmt.Errorf("buildType should be one of the production, dev, test but got %v", buildType)
	}
	
	c.appDirPath = ret
	return nil
}

func (c *Conn) SetDBName(dbName string) {
	c.dbName = dbName
}

func (c *Conn) Open() error {
	if c.appDirPath == "" {
		return fmt.Errorf("appDirPath is not set. Call either c.SetAppDirPath or c.SetAppDirPathByBuildType")
	}

	if c.dbName == "" {
		return fmt.Errorf("dbName is not set. Call the c.SetDBName")
	}

	dbPath := filepath.Join(c.appDirPath, c.dbName)
	connString := createConnectionString(dbPath, connectionOptions)
	
	conn, err := sql.Open("sqlite", connString)
	
	if err != nil {
		return fmt.Errorf("opening sqlite3 failed: %v", err)
	}

	// Verify the connection
	if err := conn.Ping(); err != nil {
		return fmt.Errorf("ping/pong sqlite failed: %v", err)
	}
	
	c.DB = conn
	return nil
}

func (c *Conn) HasFile() (bool, error) {
	if c.appDirPath == "" {
		return false, fmt.Errorf("appDirPath is not set. Call either c.SetAppDirPath or c.SetAppDirPathByBuildType")
	}
	if c.dbName == "" {
		return false, fmt.Errorf("dbName is not set. Call the c.SetDBName")
	}

	dbPath := filepath.Join(c.appDirPath, c.dbName)


	_, err := os.Stat(dbPath)
	if os.IsNotExist(err) {
		return false, nil
	} else if err != nil {
		return false, fmt.Errorf("error while checking file: %v", err)
	}

	return true, nil
}

func (c *Conn) Migrate() (error) {
	if c.DB == nil {
		return fmt.Errorf("DB is not open. Call c.Open() before calling c.Migrate()")
	}

	hasFile, err := c.HasFile()

	if err != nil {
		return err
	}

	version := 0
	
	if hasFile {
		v, err := CurrentVersion(c.DB)
		if err != nil {
			return fmt.Errorf("failed to get current version: %v", err)
		}
		version = v
	}


	migrations, err := loadMigrations()

	if err != nil {
		return fmt.Errorf("failed to load migrations: %v", err)
	}

	if err := applyMigrations(c.DB, migrations, version); err != nil {
		return fmt.Errorf("failed to apply migrations: %v", err)
	}

	return nil
}