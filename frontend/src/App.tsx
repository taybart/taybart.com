import React, {FC, useEffect} from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import {setAuthorized, useAppDispatch} from './store'

import Login from './routes/login'
import {NotesList, Note} from './routes/notes'
import Resume from './routes/resume'
import HN from './routes/hn'
import Post from './routes/hn/post'
import NotFoundPage from './routes/notfound'
import Header from './components/header'

import {checkLoggedin} from './util/api'

import "virtual:windi.css";
import "./index.css"
import "./markdown.css"

const App: FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    checkLoggedin().then(auth => {
      dispatch(setAuthorized(auth))
    })
  }, [])
  return (<>
    <Router>
      <Header />
      <div className="pt-16 w-full h-full">
        <Switch>
          <Route exact path="/">
            <Redirect to="/resume" />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/notes">
            <NotesList />
          </Route>
          <Route exact path="/note/:id">
            <Note />
          </Route>
          <Route exact path="/resume">
            <Resume />
          </Route>
          <Route exact path="/hn">
            <HN />
          </Route>
          <Route path="/hn/:id/:comment?">
            <Post />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </div>
    </Router >
  </>)
}

export default App
