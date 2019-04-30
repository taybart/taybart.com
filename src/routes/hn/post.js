import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import arrow from '../../assets/left-arrow.png';

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: {},
      comments: [],
    };
  }

  componentDidMount() {
    this.getPost(this.props.match.params.id).then((post) => {
      this.getChildren(post.kids)
    });
  }

  getPost = (id) => new Promise((resolve) => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(res => res.json())
      .then((post) => {
        this.setState({ post, loading: false });
        resolve(post)
      });
  });
  getChildren = (kidsp) => {
    const comments = [];
    const kids = this.state.post.kids || kidsp;
    if (kids) {
      kids.forEach((k) => {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${k}.json`)
          .then(res => res.json())
          .then((comment) => {
            comments.push(comment);
            this.setState({ comments });
        });
      });
    }
  }

  render() {
    const { loading, post, comments } = this.state;
    if (loading) {
      return <div className={style.hn}>Getting post...</div>;
    }
    return (
      <ul className={`${style.hn} ${style['hn-post-list']}`}>
        <li className={`${style['hn-post-title']}`}>
          <Link className={style['hn-post-back']} to="/hn">
            <img alt="arrow" src={arrow} height="23"/>
          </Link>
          <a href={post.url} rel="noopener noreferrer" target="_blank">({post.score}) {post.title}</a>
        </li>
        {comments.map((p) => {
          if (p && !p.deleted && !p.dead) {
            if (!p.text.includes('<script')) {
              return (
                <li key={`${p.id}`} className={`${style['hn-comment']}`}>
                  <div dangerouslySetInnerHTML={{ __html: p.text }} />
                </li>
              );
            }
          }
          return null;
        })}
      </ul>
    );
  }
}

