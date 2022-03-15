package main

import (
	"testing"
)

func TestCreateUser(t *testing.T) {
	db, err := NewDB()
	if err != nil {
		t.Fatal(err)
	}
	user := "test"
	pass := "123456"

	err = db.DeleteUser(user)
	if err != nil {
		t.Fatal(err)
	}
	err = db.CreateUser(user, pass)
	if err != nil {
		t.Fatal(err)
	}
	u, err := db.GetUser(user)
	if err != nil {
		t.Fatal(err)
	}
	if !u.checkPW(pass) {
		t.Fatal("password incorrect")
	}
}
