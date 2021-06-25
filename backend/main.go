package main

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/taybart/cache"
	"github.com/taybart/environment"
	"github.com/taybart/log"
)

const (
	maxAllowedLoginAttempts = 3
	sessionTTL              = 5 * time.Second
	// sessionTTL              = 24 * time.Hour
)

type server struct {
	r   *gin.Engine
	c   *cache.Cache
	env environment.Environment
}

func main() {

	env := environment.New([]string{
		"NOTES_BUCKET",
		"NOTES_ACCESS_KEY_ID",
		"NOTES_SECRET_KEY",
	})

	gin.SetMode(gin.ReleaseMode)

	s := server{
		r:   gin.New(),
		c:   cache.New(),
		env: env,
	}
	s.c.SetPruneRate(time.Second)
	defer s.c.Finish()

	s.loadUsers()
	// test setup
	s.newUser("taylor", "1234")

	s.routes()

	// run it baby
	log.Info("Running...")
	log.Fatal(s.r.Run(":8080"))
}
