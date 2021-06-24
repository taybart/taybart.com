package main

import (
	"bytes"
	"crypto/rand"
	"crypto/sha1"
	"fmt"
	"io"
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

func (s server) newUser(id, pw string) {
	salt := make([]byte, PWSaltBytes)
	_, err := io.ReadFull(rand.Reader, salt)
	if err != nil {
		log.Fatal(err)
	}
	u := &user{
		ID:   id,
		Salt: salt,
	}
	u.derivePW(pw)
	s.c.SetWithTTL(id, &u, cache.TTLNeverExpire)
}

func (u *user) getLoginAttempts(c *cache.Cache) int {
	var attempts int
	c.Get(fmt.Sprintf("%s-attempts", u.ID), &attempts)
	return attempts
}

func (u *user) setLoginAttempts(c *cache.Cache, attempts int) error {
	return c.SetWithTTL(fmt.Sprintf("%s-attempts", u.ID), &attempts, LoginRetryTTL)
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
