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
	sessionTTL              = 24 * time.Hour
)

type server struct {
	r   *gin.Engine
	c   *cache.Cache
	env environment.Environment
}

func main() {

	env := environment.New([]string{})

	gin.SetMode(gin.ReleaseMode)

	s := server{
		r:   gin.New(),
		c:   cache.New(),
		env: env,
	}
	s.c.SetPruneRate(time.Second)
	defer s.c.Finish()

	// test setup
	s.newUser("taylor", "1234")

	s.routes()

	// run it baby
	log.Info("Running...")
	log.Fatal(s.r.Run(":8080"))
}
