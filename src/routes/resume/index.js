import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

const Resume = () => (<div className={style.resume}>
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
    <li> storage </li>
    <ul>
      <li> bolt </li>
      <li> redis </li>
      <li> sqlite </li>
      <li> postgres </li>
      <li> mongodb </li>
    </ul>
    <li> ops </li>
    <ul>
      <li> docker </li>
      <li> linux </li>
      <li> aws...all the aws </li>
    </ul>
  </ul>
  <b>things i am learning</b>
  <ul>
    <li> language </li>
    <ul>
      <li> rust </li>
      <li> CUDA </li>
    </ul>
    <li> frameworks </li>
    <ul>
    </ul>
  </ul>
  <b>things i made</b>
  <ul>
    <li>
      <a href="https://github.com/taybart/fm">fm</a>
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
</div>);

export default Resume;
