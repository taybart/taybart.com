import React from 'react';
import { Switch, Route } from 'react-router'
import FrontPage from './frontpage';
import Post from './post';


const HN = () => (<Switch>
  <Route path="/hn" exact component={FrontPage} />
  <Route path="/hn/:id/:comment?" component={Post} />
</Switch>);
export default HN;
