import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './header';

// Code-splitting is automated for routes
// import Home from '../routes/home';
import Resume from '../routes/resume';
import HN from '../routes/hn';
import VC from '../routes/voicechat';
import Login from '../routes/login';

export default class App extends Component {
  render() {
    return (
      <div id="app">
        <Router>
          <Header />
          <Route path="/" exact component={Resume} />
          <Route path="/resume" component={Resume} />
          <Route path="/hn" component={HN} />
          <Route path="/vc" component={VC} />
          <Route path="/login" component={Login} />
        </Router>
      </div>
    );
  }
}
