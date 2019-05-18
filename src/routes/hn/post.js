import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import arrow from '../../assets/left-arrow.png';
import arrowWhite from '../../assets/left-arrow-white.png';

// Note post and frontpage should move to display components
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

  setItems = (i) => {
    const comments = this.state.comments.concat(i)
    this.setState({ comments })
  }

  async getItems(itemIds) {
    const chunkSize = 30;
    const chunks = itemIds.length / chunkSize
    for (let i = 0; i < chunks; i += 1) {
      const actions = (itemIds.slice(i * chunkSize, (i + 1) * chunkSize).map(this.getItem));
      await Promise.all(actions).then(this.setItems);
    }
  }

  getItem(id, index) {
    return new Promise((resolve) => {
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(post => post.json())
        .then((post) => {
          resolve(post);
        });
    });
  }

  updateLocalStore = () => {
    localStorage.setItem('commentsOwner', this.props.match.params.comment)
    localStorage.setItem('comments', JSON.stringify(this.state.comments))
  }

  componentDidMount() {
    /* const owner = localStorage.getItem('commentsOwner');
    if (owner !== this.props.match.params.comment) { */
      this.getItem(this.props.match.params.id).then((post) => {
        this.setState({ post, loading: false });
        if (this.props.match.params.comment) {
          this.getItem(this.props.match.params.comment)
            .then(comment => this.getItems(comment.kids));
        } else {
          this.getItems(post.kids)
        }
      });
    /* } else {
      const comments = JSON.parse(localStorage.getItem('comments'))
      this.setState({ comments })
    } */
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.comment !== prevProps.match.params.comment) {
      const id = this.props.match.params.comment || this.props.match.params.id;
      this.setState({ comments: [] })
      this.getItem(id).then((post) => {
        this.getItems(post.kids)
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
          <a href={post.url} rel="noopener noreferrer" target="_blank">{post.title}</a>
        </li>
        {comments.map(p => {
          if (p && !p.deleted && !p.dead) {
            if (!p.text.includes('<script')) {
              return (
                <li key={p.id} className={`${style['hn-comment']}`}>
                  <div className={localStorage.getItem('mode')} dangerouslySetInnerHTML={{ __html: p.text }} />
                  {/* <Link onClick={this.updateLocalStore} to={`/hn/${this.props.match.params.id}/${p.id}`}> */}
                  <Link to={`/hn/${this.props.match.params.id}/${p.id}`}>
                    {p.kids ?  <div className={style['hn-comment-count']}>{p.kids.length}</div> : null}
                  </Link>
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

