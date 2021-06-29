package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/taybart/log"
)

func (s *server) handleGetNote() gin.HandlerFunc {
	// GET /note/:id

	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			log.Error("missing id param")
			c.Status(http.StatusBadRequest)
		}

		note, err := s.notes.Get(id)
		if err != nil {
			log.Errorf("could not read note %s: %+v\n", id, err)
			c.Status(http.StatusInternalServerError)
		}

		c.JSON(http.StatusOK, gin.H{"note": string(note)})
	}
}

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
			errs := s.createErrorResponse(request{}, issues, err)
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

func (s *server) handleGetNotes() gin.HandlerFunc {
	// GET /notes

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

		notes, err := s.notes.List()
		if err != nil {
			log.Error(err)
			c.JSON(http.StatusInternalServerError, gin.H{})
		}

		c.JSON(http.StatusOK, gin.H{"notes": notes})
	}
}
