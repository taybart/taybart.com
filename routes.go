package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (s *server) routes() {
	s.router.Use(gin.LoggerWithConfig(gin.LoggerConfig{
		Formatter: func(param gin.LogFormatterParams) string {
			var statusColor, methodColor, resetColor string
			if param.IsOutputColor() {
				statusColor = param.StatusCodeColor()
				methodColor = param.MethodColor()
				resetColor = param.ResetColor()
			}

			if param.Latency > time.Minute {
				param.Latency.Truncate(time.Second)
			}
			return fmt.Sprintf("%v | %s %3d %s| %13v | %15s |%s %-7s %s %s\n%s",
				param.TimeStamp.Format("2006-01-02T15:04:05"),
				statusColor, param.StatusCode, resetColor,
				param.Latency,
				param.ClientIP,
				methodColor, param.Method, resetColor,
				param.Path,
				param.ErrorMessage,
			)
		},
		SkipPaths: []string{"/hc"},
	}))

	s.router.Use(gin.Recovery())
	s.router.GET("/hc", func(c *gin.Context) { c.Status(http.StatusOK) })

	s.router.LoadHTMLGlob("./templates/*/*")

	s.router.Static("/img", "./static/img")
	s.router.Static("/css", "./static/css")

	s.router.GET("/", s.handleResume())
	s.router.GET("/resume", s.handleResume())

	s.router.Static("/hn/css", "./hn/css")
	s.router.GET("/hn", s.handleHNFrontPage())
	s.router.GET("/hn/post", s.handleHNPost())
}
