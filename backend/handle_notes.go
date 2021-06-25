package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/taybart/log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func (s *server) handleGetNote() gin.HandlerFunc {
	// GET /note/:id

	endpoint := s.env.Get("NOTES_BUCKET")
	accessKeyID := s.env.Get("NOTES_ACCESS_KEY_ID")
	secretAccessKey := s.env.Get("NOTES_SECRET_KEY")
	useSSL := true

	// Initialize minio client object.
	mc, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatal(err)
	}

	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			log.Error("missing id param")
			c.Status(http.StatusBadRequest)
		}

		session := sessions.Default(c)

		uP := session.Get("user")
		if uP == nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		username := uP.(string)

		var u user
		err := s.c.Get(username, &u)
		if err != nil {
			log.Errorf("could not get user %s: %+v\n", username, err)
			c.Status(http.StatusInternalServerError)
			return
		}

		// NOTE: get from s3/minio/spaces
		// b, err := ioutil.ReadFile(fmt.Sprintf("./notes/%s.md", in.Note))
		// if err != nil {
		// 	log.Error("Could not get note ", err)
		// 	c.Status(http.StatusInternalServerError)
		// 	return
		// }

		obj, err := mc.GetObject(context.Background(), "taybart", fmt.Sprintf("notes/%s", id), minio.GetObjectOptions{})
		if err != nil {
			log.Errorf("could not get note %s: %+v\n", id, err)
			c.Status(http.StatusInternalServerError)
		}
		b, err := ioutil.ReadAll(obj)
		if err != nil {
			log.Errorf("could not read note %s: %+v\n", id, err)
			c.Status(http.StatusInternalServerError)
		}

		c.JSON(http.StatusOK, gin.H{"title": "shh", "body": string(b)})
	}
}

func (s *server) handleGetNotes() gin.HandlerFunc {
	// GET /note

	type request struct {
		Note string `form:"note"`
	}

	issues := map[string]string{
		"note": "note name must be a string. {t:string}",
	}

	endpoint := s.env.Get("NOTES_BUCKET")
	accessKeyID := s.env.Get("NOTES_ACCESS_KEY_ID")
	secretAccessKey := s.env.Get("NOTES_SECRET_KEY")
	useSSL := true

	// Initialize minio client object.
	mc, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatal(err)
	}

	return func(c *gin.Context) {
		var in request
		if err := c.ShouldBind(&in); err != nil {
			errs := s.createErrorResponse(request{}, issues, err)
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, errs)
			return
		}

		session := sessions.Default(c)

		uP := session.Get("user")
		if uP == nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		username := uP.(string)

		var u user
		err := s.c.Get(username, &u)
		if err != nil {
			log.Errorf("could not get user %s: %+v\n", username, err)
			c.Status(http.StatusInternalServerError)
			return
		}

		ch := mc.ListObjects(context.Background(), "taybart", minio.ListObjectsOptions{
			Prefix: "notes/",
		})
		res := []string{}
		for object := range ch {
			if object.Err != nil {
				log.Errorf("could not get note %s: %+v\n", in.Note, object.Err)
				c.Status(http.StatusInternalServerError)
				return
			}
			name := strings.TrimPrefix(object.Key, "notes/")
			if name != "" {
				res = append(res, name)
			}
		}

		c.JSON(http.StatusOK, gin.H{"notes": res})
	}
}
