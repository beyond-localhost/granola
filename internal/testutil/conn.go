package testutil

import (
	"granola/db"
)





func NewTestConn() (*db.Conn, error) {
	conn := db.New()
	conn.SetAppDirPath(":memory:")
	
	err := conn.Open()
	if err != nil {
		return nil, err
	}

	err = conn.Migrate()
	if err != nil {
		return nil, err
	}

	return conn, nil
}

