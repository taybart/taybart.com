package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

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

		c.JSON(http.StatusOK, gin.H{"note": string(b)})
	}
}

func (s *server) handleSetNote() gin.HandlerFunc {
	// PATCH /note/:id

	type request struct {
		ID   string `json:"id"`
		Note string `json:"note"`
	}

	issues := map[string]string{
		"id":   "id  must be a string. {t:string}",
		"note": "note name must be a string. {t:string}",
	}

	endpoint := s.env.Get("NOTES_BUCKET")
	accessKeyID := s.env.Get("NOTES_ACCESS_KEY_ID")
	secretAccessKey := s.env.Get("NOTES_SECRET_KEY")

	// Initialize minio client object.
	mc, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: true,
	})
	if err != nil {
		log.Fatal(err)
	}

	return func(c *gin.Context) {
		var in request
		if err := c.ShouldBindJSON(&in); err != nil {
			errs := s.createErrorResponse(request{}, issues, err)
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, errs)
			return
		}

		info, err := mc.PutObject(
			context.Background(),
			"taybart",
			fmt.Sprintf("notes/%s", in.ID),
			strings.NewReader(in.Note),
			int64(len(in.Note)),
			minio.PutObjectOptions{ContentType: "application/octet-stream"},
		)
		if err != nil {
			log.Errorf("could not get note %s: %+v\n", in.ID, err)
			c.Status(http.StatusInternalServerError)
		}
		log.Infof("%+v\n", info)

		c.Status(http.StatusOK)
	}
}

func (s *server) handleGetNotes() gin.HandlerFunc {
	// GET /notes

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
