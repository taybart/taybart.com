package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/gorilla/websocket"
)

func (s *server) routes() {
	// s.r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
	// 	Formatter: func(param gin.LogFormatterParams) string {
	// 		var statusColor, methodColor, resetColor string
	// 		if param.IsOutputColor() {
	// 			statusColor = param.StatusCodeColor()
	// 			methodColor = param.MethodColor()
	// 			resetColor = param.ResetColor()
	// 		}

	// 		if param.Latency > time.Minute {
	// 			param.Latency.Truncate(time.Second)
	// 		}
	// 		return fmt.Sprintf("%v | %s %3d %s| %13v | %15s |%s %-7s %s %s\n%s",
	// 			param.TimeStamp.Format("2006-01-02T15:04:05"),
	// 			statusColor, param.StatusCode, resetColor,
	// 			param.Latency,
	// 			param.ClientIP,
	// 			methodColor, param.Method, resetColor,
	// 			param.Path,
	// 			param.ErrorMessage,
	// 		)
	// 	},
	// 	SkipPaths: []string{"/hc"},
	// }))
	// s.r.Use(gin.Recovery())

	// Serve frontend static files
	s.r.Static("/", "./app/dist")
	// s.r.NoRoute(func(c *fiber.Ctx) error {
	// 	c.File("/app/dist/index.html")
	// })
	s.r.Get("/hc", func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
	})

	s.r.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		c.Set("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
		c.Set("Allow", "HEAD,GET,POST,OPTIONS")
		if c.Request.Method == "OPTIONS" {
			return c.AbortWithStatus(http.StatusOK)
		}
		return c.Next()
	})
	s.r.Post("/login", func(c *fiber.Ctx) error {
		submission := struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}{}
		if err := c.ShouldBindJSON(&submission); err != nil {
			return c.SendString(500, "bad submission")
		}
		fmt.Println(submission)
		return c.JSON(http.StatusOK, gin.H{"test": "test"})
	})

	s.r.Get("/ip", func(c *fiber.Ctx) error {
		return c.SendString(http.StatusOK, c.Request.Header.Get("X-Forwarded-For"))
	})

	s.r.Get("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
		wshandler(conn)
	})
}
