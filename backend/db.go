package main

import (
	"crypto/rand"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"os"

	_ "github.com/mattn/go-sqlite3"
	"github.com/taybart/env"
	"github.com/taybart/log"
)

var (
	ErrNotFound = errors.New("not found")
)

type DB struct {
	db *sql.DB
}

func NewDB() (*DB, error) {
	return nil, nil
	env.Add([]string{
		"DB_LOCATION",
	})

	if _, err := os.Stat(env.Get("DB_LOCATION")); errors.Is(err, os.ErrNotExist) {
		os.Create(env.Get("DB_LOCATION"))
	}
	db, err := sql.Open("sqlite3", fmt.Sprintf("file:%s?cache=shared", env.Get("DB_LOCATION")))
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users(
    id TEXT NOT NULL PRIMARY KEY,
    salt BLOB NOT NULL,
    pw BLOB NOT NULL
  );`)
	if err != nil {
		return nil, err
	}

	return &DB{db: db}, nil
}

func (d *DB) CreateUser(id, pw string) error {

	salt := make([]byte, PWSaltBytes)
	_, err := io.ReadFull(rand.Reader, salt)
	if err != nil {
		log.Fatal(err)
	}
	u := User{
		ID:   id,
		Salt: salt,
	}
	u.derivePW(pw)
	// s.c.SetWithTTL(id, &u, cache.TTLNeverExpire)

	_, err = d.db.Exec("INSERT INTO users(id, salt, pw) values(?,?,?)", u.ID, u.Salt, u.PW)
	if err != nil {
		log.Fatal(err)
	}

	return nil
}
func (d *DB) GetUser(id string) (User, error) {
	var u User

	row := d.db.QueryRow("SELECT * FROM users WHERE id = ?", id)
	if err := row.Scan(&u.ID, &u.Salt, &u.PW); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return u, ErrNotFound
		}
		return u, err
	}
	return u, nil
}
func (d *DB) DeleteUser(id string) error {
	_, err := d.db.Exec("DELETE FROM users WHERE id = ?", id)
	return err
}
