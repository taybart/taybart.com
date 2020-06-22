package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/taybart/taybart.com/hn"
)

func (s *server) handleHNFrontPage() gin.HandlerFunc {
	go func() {
		for {
			s.fp.Populate()
			time.Sleep(time.Minute * 30)
		}
	}()

	return func(c *gin.Context) {
		c.HTML(http.StatusOK, "hn_frontpage.tmpl", s.fp)
	}
}

func (s *server) handleHNPost() gin.HandlerFunc {

	type request struct {
		ID int `form:"id" binding:"required"`
	}
	/* requestFeedback := map[string]string{
		"ID": "An identifier for the customer",
	} */
	return func(c *gin.Context) {
		var req request
		if err := c.ShouldBind(&req); err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"status":  "error",
				"message": "Please provide an post ID",
			})
		}

		idstr := strconv.Itoa(req.ID)
		if s, exists := s.cache.Get(idstr); exists {
			c.HTML(http.StatusOK, "hn_post.tmpl", s.(*hn.Story))
			return
		}

		story := hn.NewStory(req.ID)
		story.Populate()
		s.cache.Set(idstr, story, time.Minute*2)
		c.HTML(http.StatusOK, "hn_post.tmpl", story)
	}
}

func (s *server) handleResume() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.HTML(http.StatusOK, "resume.tmpl", gin.H{})
	}
}
