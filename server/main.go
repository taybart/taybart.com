package main

import (
	"crypto/tls"
	"fmt"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/taybart/log"
	"golang.org/x/crypto/acme/autocert"
	"net/http"
	"time"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	// r := gin.Default()
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

	log.Info("Running...")
	certManager := autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		Cache:      autocert.DirCache("certs"),
		HostPolicy: autocert.HostWhitelist("www.taylorbartlett.com", "taylorbartlett.com", "taybart.com", "www.taybart.com"),
	}

	go http.ListenAndServe(":80", certManager.HTTPHandler(nil))

	server := &http.Server{
		Addr:    ":443",
		Handler: r,
		TLSConfig: &tls.Config{
			GetCertificate: certManager.GetCertificate,
		},
	}

	log.Fatal(server.ListenAndServeTLS("", ""))
}
