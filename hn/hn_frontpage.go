package hn

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/taybart/taybart.com/util"
)

var cache *util.Cache

func Init() {
	cache = util.NewCache(time.Minute, 2*time.Minute)
}

type FrontPage struct {
	ids     []int
	Stories []*Story
}

func (fp *FrontPage) Populate() (err error) {
	res, err := http.Get("https://hacker-news.firebaseio.com/v0/topstories.json")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fp.ids = []int{}
	err = json.Unmarshal(body, &fp.ids)
	if err != nil {
		fmt.Println(err)
		return
	}
	fp.Stories = make([]*Story, 50)

	var wg sync.WaitGroup
	for i, id := range fp.ids[:50] {
		wg.Add(1)
		go func(i, id int) {
			defer wg.Done()
			s := NewStory(id)
			if err != nil {
				fmt.Println(err)
				return
			}
			fp.Stories[i] = s
		}(i, id)
	}
	wg.Wait()
	return
}
