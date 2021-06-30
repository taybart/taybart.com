package main

import (
	"bytes"
	"crypto/rand"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"time"

	"github.com/taybart/cache"
	"github.com/taybart/log"
	"golang.org/x/crypto/pbkdf2"
)

const (
	PWSaltBytes   = 32
	LoginRetryTTL = time.Minute
)

type user struct {
	ID   string `json:"id,omitempty"`
	Salt []byte `json:"salt,omitempty"`
	PW   []byte `json:"pw,omitempty"`
}

func (s server) loadUsers() error {
	b, err := ioutil.ReadFile("./users.json")
	if err != nil {
		return err
	}

	var users []user
	err = json.Unmarshal(b, &users)
	if err != nil {
		return err
	}

	for _, u := range users {
		s.c.SetWithTTL(u.ID, &u, cache.TTLNeverExpire)
	}
	return nil
}

func (s server) newUser(id, pw string) error {
	b, err := ioutil.ReadFile("./users.json")
	if err != nil {
		return err
	}

	var users []user
	err = json.Unmarshal(b, &users)
	if err != nil {
		return err
	}

	for _, u := range users {
		if u.ID == id {
			return fmt.Errorf("user already exists")
		}
	}

	salt := make([]byte, PWSaltBytes)
	_, err = io.ReadFull(rand.Reader, salt)
	if err != nil {
		log.Fatal(err)
	}
	u := user{
		ID:   id,
		Salt: salt,
	}
	u.derivePW(pw)
	s.c.SetWithTTL(id, &u, cache.TTLNeverExpire)
	users = append(users, u)

	b, err = json.Marshal(&users)
	if err != nil {
		return err
	}

	return ioutil.WriteFile("./users.json", b, 0755)
}

func (u *user) getLoginAttempts(c *cache.Cache) int {
	var attempts int
	c.Get(fmt.Sprintf("%s-attempts", u.ID), &attempts)
	return attempts
}

func (u *user) setLoginAttempts(c *cache.Cache, attempts int) error {
	return c.SetWithTTL(fmt.Sprintf("%s-attempts", u.ID), &attempts, LoginRetryTTL)
}

func (u *user) toJSON() (string, error) {
	b, err := json.Marshal(u)
	return string(b), err
}

func (u user) checkPW(pw string) bool {
	dpw := pbkdf2.Key([]byte(pw), u.Salt, 4096, 32, sha1.New)
	if dpw == nil {
		return false
	}
	return bytes.Equal(u.PW, dpw)
}

func (u *user) derivePW(pw string) []byte {
	u.PW = pbkdf2.Key([]byte(pw), u.Salt, 4096, 32, sha1.New)
	return u.PW
}
