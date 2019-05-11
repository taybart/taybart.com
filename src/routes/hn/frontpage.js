import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import ReactList from 'react-list';
import style from './style.module.css';
import arrow from '../../assets/right-arrow.png';

export default class FrontPage extends Component {
  renderItem = (p, key) => {
    return (
      <li key={key} className={`${style["hn-post"]}`}>
        <a href={p.url} rel="noopener noreferrer" target="_blank">[{p.score}] {p.title}</a>
        <div className={style['hn-post-comments-link']}>
          <Link to={`/hn/${p.id}`}>
            ({p.descendants}) <img alt="arrow" src={arrow} height="23"/>
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
