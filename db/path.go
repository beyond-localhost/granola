package db

import (
	"os"
	"path/filepath"
	"runtime"
)


func appDataDirProd() string {
	if runtime.GOOS == "windows" {
		return filepath.Join(os.Getenv("APPDATA"), "Granola")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	if runtime.GOOS == "darwin" {
		return filepath.Join(home, "Library", "Application Support", "Granola")
	} else {
		return filepath.Join(home, ".local", "share")
	}
}

func appDataDirTest() string {
    wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return filepath.Join(wd, "db")	
}


func appDataDirDev() string {
    wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return filepath.Join(wd, "db")
}

