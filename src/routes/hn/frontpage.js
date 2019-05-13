import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import arrow from '../../assets/right-arrow.png';
import arrowWhite from '../../assets/right-arrow-white.png';

export default class FrontPage extends Component {
  renderItem = (p, key) => {
    let a = (localStorage.getItem('mode') === 'light') ? arrow : arrowWhite;
    return (
      <li key={key} className={`${style["hn-post"]}`}>
        <a href={p.url} rel="noopener noreferrer" target="_blank">[{p.score}] {p.title}</a>
        <div className={style['hn-post-comments-link']}>
          <Link to={`/hn/${p.id}`}>
            ({p.descendants}) <img alt="arrow" src={a} height="23"/>
          </Link>
      </div>
      </li>
    );
  }
  render() {
    const { posts } = this.props;
    return (
      <ul className={`${style.hn} ${style["hn-post-list"]}`}>
        {posts.map(e => this.renderItem(e, e.id))}
      </ul>
    );
  }
}
