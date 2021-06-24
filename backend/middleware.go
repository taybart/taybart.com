package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
		c.Header("Allow", "HEAD,GET,POST,OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}

func protected(next gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		authorized := session.Get("authorized")
		if authorized != nil {
			next(c)
			return
		}
		c.Status(http.StatusUnauthorized)
	}
}

func logger() gin.HandlerFunc {
	return gin.LoggerWithConfig(gin.LoggerConfig{
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
	})
}
