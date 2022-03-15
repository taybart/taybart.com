package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
)

type sdp struct {
	Type string `json:"type"`
	SDP  string `json:"sdp"`
}

type iceCandidate struct {
	Candidate     string `json:"candidate"`
	SDPMLineIndex int    `json:"sdpMLineIndex"`
	SDPMid        string `json:"sdpMid"`
}

type message struct {
	ID        uuid.UUID    `json:"id,omitempty"`
	Action    string       `json:"action,omitempty"`
	Date      int          `json:"date,omitempty"`
	Username  string       `json:"username,omitempty"`
	Target    uuid.UUID    `json:"target,omitempty"`
	Candidate iceCandidate `json:"candidate,omitempty"`
	Text      string       `json:"text,omitempty"`
	Type      string       `json:"type,omitempty"`
	SDP       sdp          `json:"sdp,omitempty"`
	Status    string       `json:"status,omitempty"`
	Message   string       `json:"message,omitempty"`
}

var mutex = &sync.Mutex{}
var connections = make(map[uuid.UUID]*websocket.Conn)
var userlist = make(map[uuid.UUID]string)
var connectedUsers = make(map[uuid.UUID]string)

func randStringBytes(n int) string {
	l := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, n)
	for i := range b {
		b[i] = l[rand.Intn(len(l))]
	}
	return string(b)
}

func handleJoinChat(c *websocket.Conn, ID uuid.UUID) error {
	cuserlist := make(map[uuid.UUID]string)
	for id := range connectedUsers {
		cuserlist[id] = userlist[id]
	}

	ul := struct {
		Type  string               `json:"type"`
		Users map[uuid.UUID]string `json:"users"`
	}{
		Type:  "userlist-populate",
		Users: cuserlist,
	}

	ulB, err := json.Marshal(ul)
	if err != nil {
		return errors.Wrap(err, "handleUsername, ul marshal")
	}
	c.WriteMessage(1, ulB)

	// update userlist globally
	userupdate := struct {
		Type     string    `json:"type"`
		Action   string    `json:"action"`
		ID       uuid.UUID `json:"id"`
		Username string    `json:"username"`
	}{
		Type:     "userlist-update",
		Action:   "add",
		ID:       ID,
		Username: userlist[ID],
	}

	ua, err := json.Marshal(userupdate)
	if err != nil {
		return errors.Wrap(err, "handleUsername, ua marshal")
	}

	for id := range connectedUsers {
		if ID != id {
			connections[id].WriteMessage(1, ua)
		}
	}
	return nil
}

func handleLeaveChat(_ *websocket.Conn, ID uuid.UUID) error {
	userupdate := struct {
		Type   string    `json:"type"`
		Action string    `json:"action"`
		ID     uuid.UUID `json:"id"`
	}{
		Type:   "userlist-update",
		Action: "delete",
		ID:     ID,
	}

	ud, err := json.Marshal(userupdate)
	if err != nil {
		fmt.Println("Marshal ud delete", err)
		return err
	}
	for id := range connectedUsers {
		if ID != id {
			connections[id].WriteMessage(1, ud)
		}
	}
	return nil
}

func handleUsername(c *websocket.Conn, m message) error {
	for i, u := range userlist {
		if u == m.Username && i != m.ID {
			// Append nonsense
			m.Username += "-" + randStringBytes(5)
			m := message{
				ID:       m.ID,
				Type:     "username-reject",
				Username: m.Username,
			}
			msg, err := json.Marshal(m)
			if err != nil {
				return errors.Wrap(err, "handleUsername, reject marshal")
			}
			c.WriteMessage(1, msg)
			break
		}
	}

	mutex.Lock()
	userlist[m.ID] = m.Username
	mutex.Unlock()
	if status, exists := connectedUsers[m.ID]; exists && status == "connected" {
		// update userlist globally
		userupdate := struct {
			Type     string    `json:"type"`
			Action   string    `json:"action"`
			ID       uuid.UUID `json:"id"`
			Username string    `json:"username"`
		}{
			Type:     "userlist-update",
			Action:   "update",
			ID:       m.ID,
			Username: userlist[m.ID],
		}

		ua, err := json.Marshal(userupdate)
		if err != nil {
			return errors.Wrap(err, "handleUsername, ua marshal")
		}

		for id := range connectedUsers {
			if m.ID != id {
				connections[id].WriteMessage(1, ua)
			}
		}
	}

	return nil
}

func wshandler(c *websocket.Conn) {
	var id uuid.UUID
	defer func() {
		c.Close()
		if id != uuid.Nil {
			userupdate := struct {
				Type   string    `json:"type"`
				Action string    `json:"action"`
				ID     uuid.UUID `json:"id"`
			}{
				Type:   "userlist-update",
				Action: "delete",
				ID:     id,
			}

			ud, err := json.Marshal(userupdate)
			if err != nil {
				fmt.Println("Marshal ud delete", err)
			}
			if _, exists := connectedUsers[id]; exists {
				mutex.Lock()
				delete(connectedUsers, id)
				mutex.Unlock()
				for i := range connectedUsers {
					connections[i].WriteMessage(1, ud)
				}
			}
			mutex.Lock()
			delete(connections, id)
			delete(userlist, id)
			mutex.Unlock()
		}
	}()

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			break
		}

		m := message{}
		err = json.Unmarshal(msg, &m)
		if err != nil {
			fmt.Println("Parse message", err)
			break
		}

		switch m.Type {
		case "id":
			if m.Action == "set" {
				id = m.ID

				mutex.Lock()
				connections[m.ID] = c
				mutex.Unlock()
				c.WriteMessage(1, []byte(`{"type": "id", "id": "`+id.String()+`" }`))
			}
			if m.Action == "request" {
				id = uuid.New()
				mutex.Lock()
				connections[id] = c
				mutex.Unlock()
				c.WriteMessage(1, []byte(`{"type": "id", "id": "`+id.String()+`" }`))
			}

			// Username change
		case "username":
			err := handleUsername(c, m)
			if err != nil {
				fmt.Println(err)
			}
		case "status":
			if m.Action == "set" {
				if m.Status == "connected" {
					connectedUsers[m.ID] = m.Status
					handleJoinChat(c, m.ID)
				}
				if m.Status == "disconnected" {
					delete(connectedUsers, m.ID)
					handleLeaveChat(c, m.ID)
				}
			}
		case "message":
			for _, conn := range connections {
				conn.WriteMessage(1, msg)
			}
		default:
			if m.Target != uuid.Nil {
				msg, err := json.Marshal(m)
				if err != nil {
					fmt.Println("Marshal target", err)
					break
				}
				connections[m.Target].WriteMessage(1, msg)
			} else {
				fmt.Printf("%+v\n", m)
				for i, conn := range connections {
					if i != m.ID {
						conn.WriteMessage(1, msg)
					}
				}
			}
		}
	}

}
