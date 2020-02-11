import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import arrow from '../../assets/right-arrow.png';
import arrowWhite from '../../assets/right-arrow-white.png';

export default class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // posts: JSON.parse(localStorage.getItem('fp')) || [],
      posts: [],
    };
  }

  setItems = (p) => {
    let posts = this.state.posts.concat(p)
    this.setState({ posts })
  }

  async getItems(itemIds) {
    const chunkSize = 30;
    const chunks = itemIds.length / chunkSize
    for (let i = 0; i < chunks; i += 1) {
      const actions = await Promise.all(itemIds.slice(i * chunkSize, (i + 1) * chunkSize).map(this.getItem))
      this.setItems(actions)
    }
  }

  getItem(id, index) {
    return new Promise((resolve) => {
      fetch(`https://hacker-news.firebaseio.com/v0//item/${id}.json`)
        .then(post => post.json())
        .then((post) => {
          resolve(post);
        });
    });
  }

  componentDidMount() {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => res.json())
      .then((postIds) => {
        this.getItems(postIds);
      });
  }

  render() {
    const { posts } = this.state;
    if (posts.length === 0) {
      return <div className={style.hn}>Getting frontpage...</div>;
    }
    let a = (localStorage.getItem('mode') === 'light') ? arrow : arrowWhite;
    return (<ul className={`${style.hn} ${style["hn-post-list"]}`}>
      {posts.map(p => <li key={p.id} className={`${style["hn-post"]}`}>
        <a href={p.url} rel="noopener noreferrer" target="_blank">[{p.score}] {p.title}</a>
        {(p.descendants > 0) ?  <Link to={`/hn/${p.id}`} className={style['hn-post-comments-link']}>
          {p.descendants} <img alt="arrow" src={a} height="23"/>
        </Link> : null }
      </li>)}
    </ul>);
  }
}
