package hn

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"strconv"
	"sync"
	"time"
)

type Story struct {
	ID          int
	Descendants int
	Kids        []int
	By          string
	Parent      int
	Score       int
	Time        int
	Title       string
	Type        string
	URL         string
	Posts       []Post
}

type Post struct {
	By     string
	ID     int
	Kids   []int
	Parent int
	Text   template.HTML
	Time   int
	Type   string
}

func NewStory(id int) (s *Story) {
	res, err := http.Get(fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", id))
	if err != nil {
		return
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return
	}
	s = &Story{}
	err = json.Unmarshal(body, s)
	return
}

func (s *Story) Populate() (err error) {
	s.Posts = make([]Post, len(s.Kids))

	var wg sync.WaitGroup
	for i, id := range s.Kids {
		wg.Add(1)
		go func(i, id int) {
			defer wg.Done()
			idstr := strconv.Itoa(id)
			if p, exists := cache.Get(idstr); exists {
				s.Posts[i] = p.(Post)
				return
			}

			p, err := s.GetPost(id)
			if err != nil {
				fmt.Println(err)
				return
			}
			cache.Set(idstr, p, time.Minute)
			s.Posts[i] = p
		}(i, id)
	}
	wg.Wait()

	return // get all things
}

func (s *Story) GetPost(id int) (post Post, err error) {
	res, err := http.Get(fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json", id))
	if err != nil {
		return
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return
	}
	err = json.Unmarshal(body, &post)
	return
}
