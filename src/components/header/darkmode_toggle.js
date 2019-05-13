import React, {Component} from 'react';
import style from './style.module.css';

export default class DarkmodeToggle extends Component {
  constructor(props) {
    super(props);
    this.button = React.createRef();
  }
  componentDidMount() {
    console.log(localStorage.getItem('mode'));
    if ((localStorage.getItem('mode') || 'light') === 'light') {
      this.setlight()
    } else {
      this.setdark()
    }
  }
  toggleMode = () => {
    console.log(localStorage.getItem('mode'));
    if (localStorage.getItem('mode') === 'light') {
      this.setdark();
    } else {
      this.setlight();
    }
  }
  setdark = () => {
    localStorage.setItem('mode', 'dark');
    document.querySelector('body').classList.add('dark');
    document.querySelector('header').classList.add('dark');
    this.button.current.classList.remove(style.moon);
    this.button.current.classList.add(style.sun);
  }
  setlight = () => {
    localStorage.setItem('mode', 'light');
    document.querySelector('body').classList.remove('dark');
    document.querySelector('header').classList.remove('dark');
    this.button.current.classList.add(style.moon);
    this.button.current.classList.remove(style.sun);
  }
  render() {
    return (<button
      ref={this.button}
      className={style["darkmode-toggle"]}
      onClick={this.toggleMode}
    />);
  }
}
