import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

function Resume () {
  return (<div className={style.resume}>
    <div className={style.resumelist}>
      <ul className={style.list}>
        <li>
          2018-now <b>head architect</b> journey
          <div style={{paddingLeft: '3%'}}> Journey is bringing trust, identity and zero-knowledge privacy to the contact center & beyond </div>
        </li>
        <li>
          2017-2018 <b>lead engineer</b> the spiga group
        </li>
        <li>
          2014-2017 <b>co-founder</b> mfactor engineering
        </li>
        <li>2015 <b>bs</b> electrical and computer engineering, university of colorado</li>
      </ul>
      <b>things i know well</b>
      <ul>
        <li> language </li>
        <ul>
          <li> go </li>
          <li> js/node </li>
          <li> python </li>
          <li> c </li>
        </ul>
        <li> web frameworks </li>
        <ul>
          <li> react </li>
        </ul>
        <li> ops </li>
        <ul>
          <li> linux </li>
          <li> docker </li>
          <li> aws...all the aws </li>
        </ul>
      </ul>
      <b>things i made</b>
      <ul>
        <li>
          <a href="https://github.com/taybart/fm">fm</a>
        </li>
        <li>
          <a href="https://github.com/taybart/rest">rest</a>
        </li>
        <li>
          <a href="https://github.com/taybart/log">log</a>
        </li>
        <li>
          <a href="https://github.com/taybart/paint">paint</a>
        </li>
        <li>
          <Link to="/hn">my hacker news</Link>
        </li>
      </ul>
    </div>
  </div>
  )
}

export default Resume
