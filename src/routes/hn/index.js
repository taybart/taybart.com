import React, { Component } from 'react';
import { Switch, Route } from 'react-router'
import FrontPage from './frontpage';
import Post from './post';


export default class HN extends Component {
  render() {
    return (<Switch>
      <Route
        path="/hn"
        exact
        component={FrontPage}
      />
      <Route
        path="/hn/:id/:comment?"
        component={Post}
      />
    </Switch>);
  }
}
