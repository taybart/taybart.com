import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './header';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Resume from '../routes/resume';
import HN from '../routes/hn';
// import HNPost from '../routes/hn/post';

export default class App extends Component {
  render() {
    return (
      <div id="app">
        <Router>
          <Header />
          <Route path="/" exact component={Home} />
          <Route path="/resume" component={Resume} />
          <Route path="/hn" component={HN} />
          {/* <HNPost path="/hn/post/:id" /> */}
        </Router>
      </div>
    );
  }
}
