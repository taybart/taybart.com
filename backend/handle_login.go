package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/taybart/log"
)

func (s *server) handleLogin() gin.HandlerFunc {
	// POST /api/login

	type request struct {
		User     string `json:"user" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	issues := map[string]string{
		"user":     "user is required. {t:string}",
		"password": "password is required. {t:string}",
	}

	return func(c *gin.Context) {
		var in request
		if err := c.ShouldBindJSON(&in); err != nil {
			errs := s.createErrorResponse(request{}, issues, err)
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, errs)
			return
		}

		var u user
		err := s.c.Get(in.User, &u)
		if err != nil {
			log.Errorf("Could not get user %s: %+v\n", in.User, err)
			c.Status(http.StatusInternalServerError)
			return
		}

		attempts := u.getLoginAttempts(s.c)
		if attempts >= maxAllowedLoginAttempts {
			log.Warnf("User %s too many login attempts\n", in.User)
			c.Status(http.StatusUnauthorized)
			return
		}

		if !u.checkPW(in.Password) {
			attempts += 1
			u.setLoginAttempts(s.c, attempts)
			c.Status(http.StatusUnauthorized)
			return
		}

		session := sessions.Default(c)
		session.Set("user", in.User)
		session.Set("authorized", "true")
		if err := session.Save(); err != nil {
			c.Status(http.StatusInternalServerError)
		}
		c.Status(http.StatusOK)
	}
}

func (s *server) handleLogout() gin.HandlerFunc {
	// POST /api/logout

	return func(c *gin.Context) {

		session := sessions.Default(c)

		session.Delete("authorized")
		if err := session.Save(); err != nil {
			c.Status(http.StatusInternalServerError)
		}
		c.Status(http.StatusOK)
	}
}

func (s *server) handleCheckAuthorized() gin.HandlerFunc {
	// GET /api/authorized

	return func(c *gin.Context) {
		c.Status(http.StatusOK)
	}
}
