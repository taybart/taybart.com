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
	s.r.Use(s.cors())
	s.r.Use(s.logger())

	// cookies
	store := cookie.NewStore([]byte("coookiecrisp"))
	store.Options(sessions.Options{MaxAge: 60 * 60 * 24}) // expire in a day
	s.r.Use(sessions.Sessions("user", store))

	api := s.r.Group("api")
	{
		api.POST("/login", s.handleLogin())
		api.POST("/logout", s.handleLogout())
		api.GET("/authorized", s.protected(s.handleCheckAuthorized()))
		api.GET("/notes", s.protected(s.handleGetNotes()))
		api.GET("/note/:id", s.protected(s.handleGetNote()))
		api.PATCH("/note", s.protected(s.handleSetNote()))
	}

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
