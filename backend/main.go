package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/taybart/log"
)

type server struct {
	r *fiber.App
}

func main() {
	s := server{
		r: fiber.New(),
	}

	s.routes()

	log.Info("Running...")
	log.Fatal(s.r.Listen(":8080"))
}
