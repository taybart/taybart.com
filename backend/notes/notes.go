package notes

import (
	"context"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	mc     *minio.Client
	bucket string
	prefix string
}

type Config struct {
	Endpoint        string
	Bucket          string
	Prefix          string
	AccessKeyID     string
	SecretAccessKey string
	UseTLS          bool
}

func New(c Config) (*Client, error) {
	// Initialize minio client object.
	mc, err := minio.New(c.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(c.AccessKeyID, c.SecretAccessKey, ""),
		Secure: c.UseTLS,
	})
	if err != nil {
		return nil, err
	}
	return &Client{
		mc:     mc,
		bucket: c.Bucket,
		prefix: c.Prefix,
	}, nil
}

func (c Client) List() ([]string, error) {
	ch := c.mc.ListObjects(context.Background(), c.bucket, minio.ListObjectsOptions{
		Prefix: c.prefix,
	})
	res := []string{}
	for object := range ch {
		if object.Err != nil {
			err := fmt.Errorf("could not get note %s: %+v\n", object.Key, object.Err)
			return res, err
		}
		name := strings.TrimPrefix(object.Key, c.prefix)
		if name != "" {
			res = append(res, name)
		}
	}
	return res, nil
}

func (c Client) Get(id string) (string, error) {
	obj, err := c.mc.GetObject(
		context.Background(),
		c.bucket,
		fmt.Sprintf("%s%s", c.prefix, id),
		minio.GetObjectOptions{})
	if err != nil {
		err = fmt.Errorf("could not get note %s: %+v\n", id, err)
		return "", err
	}
	b, err := ioutil.ReadAll(obj)
	if err != nil {
		err = fmt.Errorf("could not read note %s: %+v\n", id, err)
		return "", err
	}
	return string(b), nil
}
func (c Client) Set(id string, note string) error {
	info, err := c.mc.PutObject(
		context.Background(),
		c.bucket,
		fmt.Sprintf("%s%s", c.prefix, id),
		strings.NewReader(note),
		int64(len(note)),
		minio.PutObjectOptions{ContentType: "application/octet-stream"},
	)
	if err != nil {
		return fmt.Errorf("could not get note %s: %+v\n", id, err)
	}
	fmt.Printf("%+v\n", info)
	return nil
}
