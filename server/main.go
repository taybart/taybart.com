package main

import (
	"fmt"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/taybart/log"

	"net/http"
	"time"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
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
		SkipPaths: []string{"/health"},
	}))
	r.Use(gin.Recovery())

	// Serve frontend static files
	r.Use(static.Serve("/", static.LocalFile("../build", false)))
	r.NoRoute(func(c *gin.Context) {
		c.File("../build/index.html")
	})

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
		c.Header("Allow", "HEAD,GET,POST,OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})
	r.POST("/login", func(c *gin.Context) {
		submission := struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}{}
		if err := c.ShouldBindJSON(&submission); err != nil {
			c.String(500, "bad submission")
			return
		}
		fmt.Println(submission)
		c.JSON(http.StatusOK, gin.H{"test": "test"})
	})

	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	r.GET("/ws", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			fmt.Printf("Failed to set websocket upgrade: %+v\n", err)
			return
		}
		wshandler(conn)
	})

	log.Info("Running...")
	log.Fatal(r.Run("localhost:8080"))
}
