import React, {FC} from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

import Resume from './routes/resume/index'
import HN from './routes/hn'
import Post from './routes/hn/post'
import NotFoundPage from './routes/notfound'
import Header from './components/header'

import "virtual:windi.css";

const App: FC = () => {
  return (<>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/resume" />
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
      </Router >
  </>)
}

export default App
