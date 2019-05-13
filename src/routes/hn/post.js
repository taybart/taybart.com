import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import arrow from '../../assets/left-arrow.png';
import arrowWhite from '../../assets/left-arrow-white.png';

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: {},
      comments: [],
      kids: [],
    };
  }

  componentDidMount() {
    this.getPost(this.props.match.params.id).then((post) => {
      this.setState({ post, loading: false });
      if (this.props.match.params.comment) {
        this.getPost(this.props.match.params.comment)
          .then(comment => this.getChildren(comment.kids));
      } else {
        this.getChildren(post.kids)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.comment !== prevProps.match.params.comment) {
      const id = this.props.match.params.comment || this.props.match.params.id;
      this.getPost(id).then((post) => {
        this.getChildren(post.kids)
      });
    }
  }

  getPost = (id) => new Promise((resolve) => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(res => res.json())
      .then((post) => {
        resolve(post)
      });
  });

  getChildren = (kidsp) => {
    const comments = [];
    const kids = kidsp || this.state.post.kids;
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

    let a = (localStorage.getItem('mode') === 'light') ? arrow : arrowWhite;
    return (
      <ul className={`${style.hn} ${style['hn-post-list']}`}>
        <li className={`${style['hn-post-title']}`}>
          <Link className={style['hn-post-back']} to="/hn">
            <img alt="arrow" src={a} height="23"/>
          </Link>
          <a href={post.url} rel="noopener noreferrer" target="_blank">({post.score}) {post.title}</a>
        </li>
        {comments.sort((a, b) => a.score - b.score).map(p => {
          if (p && !p.deleted && !p.dead) {
            if (!p.text.includes('<script')) {
              return (
                <li key={p.id} className={`${style['hn-comment']}`}>
                    <div dangerouslySetInnerHTML={{ __html: p.text }} />
                    <Link to={`/hn/${this.props.match.params.id}/${p.id}`}>
                      {p.kids ?  <div className={style['hn-comment-count']}>{p.kids.length}</div> : null}
                    </Link>
                </li>
              );
            }
          }
          return <div />;
        })}
      </ul>
    );
  }
}

