package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/taybart/log"
)

func (s *server) handleSetNote() gin.HandlerFunc {
	// PATCH /note/:id

	type request struct {
		ID   string `json:"id"`
		Note string `json:"note"`
	}

	issues := map[string]string{
		"id":   "id  must be a string. {t:string}",
		"note": "note name must be a string. {t:string}",
	}

	return func(c *gin.Context) {
		var in request
		if err := c.ShouldBindJSON(&in); err != nil {
			errs := createErrorResponse(request{}, issues, err)
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, errs)
			return
		}

		err := s.notes.Set(in.ID, in.Note)
		if err != nil {
			log.Error(err)
			c.Status(http.StatusInternalServerError)
		}

		c.Status(http.StatusOK)
	}
}
