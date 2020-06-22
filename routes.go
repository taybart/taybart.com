package main

func (s *server) routes() {
	s.router.LoadHTMLGlob("./templates/*/*")

	s.router.Static("/img", "./static/img")
	s.router.Static("/css", "./static/css")

	s.router.GET("/", s.handleResume())
	s.router.GET("/resume", s.handleResume())

	s.router.Static("/hn/css", "./hn/css")
	s.router.GET("/hn", s.handleHNFrontPage())
	s.router.GET("/hn/post", s.handleHNPost())
}
