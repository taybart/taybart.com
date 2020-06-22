package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/taybart/taybart.com/hn"
	"github.com/taybart/taybart.com/util"
)

type server struct {
	router *gin.Engine
	fp     hn.FrontPage
	cache  *util.Cache
}

func newServer() (s *server) {
	// Remove gin debugging and warning
	gin.SetMode(gin.ReleaseMode)

	hn.Init()

	s = &server{
		router: gin.New(),
		fp:     hn.FrontPage{},
		cache:  util.NewCache(5*time.Minute, 10*time.Minute),
	}

	s.routes()
	return
}

func main() {
	hp := ":8080"
	s := newServer()

	signalCh := make(chan os.Signal, 1)

	signal.Notify(
		signalCh,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGQUIT,
	)

	go func() {
		if err := s.router.Run(hp); err != nil && errors.Is(err, http.ErrServerClosed) {
			panic("no server man!")
		}
	}()
	fmt.Printf("Running on %s...\n", hp)
	<-signalCh
	fmt.Println("Shutting down...")
}
