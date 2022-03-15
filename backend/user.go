package main

import (
	"bytes"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"time"

	"golang.org/x/crypto/pbkdf2"

	"github.com/taybart/cache"
)

const (
	PWSaltBytes   = 32
	LoginRetryTTL = time.Minute
)

type User struct {
	ID   string `json:"id,omitempty"`
	Salt []byte `json:"salt,omitempty"`
	PW   []byte `json:"pw,omitempty"`
}

func (u *User) getLoginAttempts(c *cache.Cache) int {
	var attempts int
	c.Get(fmt.Sprintf("%s-attempts", u.ID), &attempts)
	return attempts
}

func (u *User) setLoginAttempts(c *cache.Cache, attempts int) error {
	return c.SetWithTTL(fmt.Sprintf("%s-attempts", u.ID), &attempts, LoginRetryTTL)
}

func (u *User) toJSON() (string, error) {
	b, err := json.Marshal(u)
	return string(b), err
}

func (u User) checkPW(pw string) bool {
	dpw := pbkdf2.Key([]byte(pw), u.Salt, 4096, 32, sha1.New)
	if dpw == nil {
		return false
	}
	return bytes.Equal(u.PW, dpw)
}

func (u *User) derivePW(pw string) []byte {
	u.PW = pbkdf2.Key([]byte(pw), u.Salt, 4096, 32, sha1.New)
	return u.PW
}
