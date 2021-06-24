package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/taybart/log"
)

func (s *server) handleNotes() gin.HandlerFunc {

	type request struct {
		Note string `form:"note"`
	}

	issues := map[string]string{
		"note": "note name must be a string. {t:string}",
	}

	return func(c *gin.Context) {
		var in request
		if err := c.ShouldBind(&in); err != nil {
			errs := s.createErrorResponse(request{}, issues, err)
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, errs)
			return
		}

		session := sessions.Default(c)

		username := session.Get("user").(string)
		log.Info(username)

		var u user
		err := s.c.Get(username, &u)
		if err != nil {
			log.Errorf("Could not get user %s: %+v\n", username, err)
			c.Status(http.StatusInternalServerError)
			return
		}

		c.JSON(http.StatusOK, gin.H{"title": "shh", "body": "this is secret jaboi"})
	}
}
