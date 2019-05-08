import React, { Component } from 'react';
import { Switch, Route } from 'react-router'
import FrontPage from './frontpage';
import Post from './post';


export default class HN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.getFP();
  }

  getFP = () => {
    const posts = [];
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
      .then(res => res.json())
      .then((json) => {
        json.forEach((p) => {
          fetch(`https://hacker-news.firebaseio.com/v0//item/${p}.json`)
            .then(post => post.json())
            .then((res) => {
              posts.push(res);
              this.setState({ posts });
            });
        });
      });
  }


  render() {
    const { posts } = this.state;
    return (<Switch>
      <Route
        path="/hn"
        exact
        render={props => <FrontPage posts={posts} />}
      />
      <Route
        path="/hn/:id"
        component={Post}
      />
    </Switch>);
  }
}
