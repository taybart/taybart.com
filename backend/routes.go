package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func (s *server) routes() {

	s.r.Use(gin.Recovery())
	s.r.Use(cors())
	s.r.Use(logger())

	// cookies
	store := cookie.NewStore([]byte("coookiecrisp"))
	store.Options(sessions.Options{MaxAge: 60 * 60 * 24}) // expire in a day
	s.r.Use(sessions.Sessions("user", store))

	s.r.POST("/login", s.handleLogin())
	s.r.GET("/notes", protected(s.handleNotes()))

	s.r.GET("/ip", func(c *gin.Context) {
		c.String(http.StatusOK, c.Request.Header.Get("X-Forwarded-For"))
	})

	// s.r.GET("/ws", s.handleWS())

	// Serve frontend static files
	s.r.Use(static.Serve("/", static.LocalFile("/app/dist", false)))
	s.r.NoRoute(func(c *gin.Context) {
		c.File("/app/dist/index.html")
	})
	s.r.GET("/hc", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
}
