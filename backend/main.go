package main

import (
	"time"

	"github.com/gin-gonic/gin"

	"server/notes"

	"github.com/taybart/cache"
	"github.com/taybart/env"
	"github.com/taybart/log"
)

const (
	maxAllowedLoginAttempts = 3
	sessionTTL              = 24 * time.Hour
)

type server struct {
	r     *gin.Engine
	c     *cache.Cache
	notes *notes.Client
	db    *DB
}

func main() {

	// set up env requirements
	env.Add([]string{
		"NOTES_BUCKET",
		"NOTES_ACCESS_KEY_ID",
		"NOTES_SECRET_KEY",
	})

	gin.SetMode(gin.ReleaseMode)

	// connect to notes storage
	nc, err := notes.New(notes.Config{
		Endpoint:        env.Get("NOTES_BUCKET"),
		Bucket:          "taybart",
		Prefix:          "notes/",
		AccessKeyID:     env.Get("NOTES_ACCESS_KEY_ID"),
		SecretAccessKey: env.Get("NOTES_SECRET_KEY"),
	})
	if err != nil {
		log.Fatal(err)
	}

	db, err := NewDB()
	if err != nil {
		log.Fatal(err)
	}

	s := server{
		r:     gin.New(),
		c:     cache.New(),
		notes: nc,
		db:    db,
	}
	// prune cache every 1s
	s.c.SetPruneRate(time.Second)
	defer s.c.Finish()

	// set routes
	s.routes()

	// run it baby
	log.Info("Running...")
	// log.Fatal(s.r.Run(":8080"))
}
