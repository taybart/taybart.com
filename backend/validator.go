package main

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/go-playground/validator/v10"
)

// ValidationError : A validation error from an HTTP request's input
type ValidationError struct {
	Param   string `json:"param,omitempty"`
	Message string `json:"message,omitempty"`
}

// ValidationErrors : A container for validation errors
type ValidationErrors struct {
	Errors []ValidationError `json:"errors"`
}

// CreateErrorResponse : create response for user
func (s server) createErrorResponse(j interface{}, msgMap map[string]string, err error) (errs *ValidationErrors) {
	errs = &ValidationErrors{}
	switch t := err.(type) {
	case *json.SyntaxError:
		msg := fmt.Sprintf("%s (at byte: %d)", t.Error(), t.Offset)
		errs.Errors = []ValidationError{{Message: msg}}
	case *json.UnmarshalTypeError:
		errs.Errors = []ValidationError{{
			Param:   t.Field,
			Message: msgMap[t.Field],
		}}
	case validator.ValidationErrors:
		for _, e := range t {
			if tag, ok := reflect.TypeOf(j).FieldByName(e.Field()); ok {
				errs.Errors = append(errs.Errors, ValidationError{
					Param:   tag.Tag.Get("json"),
					Message: fmt.Sprintf("%s", msgMap[tag.Tag.Get("json")]),
				})
			}
		}
	}
	return
}
