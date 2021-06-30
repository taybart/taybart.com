package main

import (
	"time"

	"github.com/gin-gonic/gin"

	"server/notes"

	"github.com/taybart/cache"
	"github.com/taybart/environment"
	"github.com/taybart/log"
)

const (
	maxAllowedLoginAttempts = 3
	sessionTTL              = 24 * time.Hour
)

type server struct {
	r     *gin.Engine
	c     *cache.Cache
	env   environment.Environment
	notes *notes.Client
}

func main() {

	env := environment.New([]string{
		"NOTES_BUCKET",
		"NOTES_ACCESS_KEY_ID",
		"NOTES_SECRET_KEY",
	})

	gin.SetMode(gin.ReleaseMode)

	endpoint := env.Get("NOTES_BUCKET")
	accessKeyID := env.Get("NOTES_ACCESS_KEY_ID")
	secretAccessKey := env.Get("NOTES_SECRET_KEY")

	nc, err := notes.New(notes.Config{
		Endpoint:        endpoint,
		Bucket:          "taybart",
		Prefix:          "notes/",
		AccessKeyID:     accessKeyID,
		SecretAccessKey: secretAccessKey,
	})
	if err != nil {
		log.Fatal(err)
	}

	s := server{
		r:     gin.New(),
		c:     cache.New(),
		env:   env,
		notes: nc,
	}
	s.c.SetPruneRate(time.Second)
	defer s.c.Finish()

	err = s.loadUsers()
	if err != nil {
		log.Fatal(err)
	}

	s.routes()

	// run it baby
	log.Info("Running...")
	log.Fatal(s.r.Run(":8080"))
}
