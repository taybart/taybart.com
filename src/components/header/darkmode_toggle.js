import React, {Component} from 'react';
import style from './style.module.css';
import sun from '../../assets/sun.png';
import moon from '../../assets/moon.png';

export default class DarkmodeToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: ((localStorage.getItem('mode') || 'light') === 'light') ? moon : sun,
    };
  }

  componentDidMount() {
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
    this.setState({ img: sun });
  }
  setlight = () => {
    localStorage.setItem('mode', 'light');
    document.querySelector('body').classList.remove('dark');
    document.querySelector('header').classList.remove('dark');
    this.setState({ img: moon });
  }

  render() {
    return (<button className={style["darkmode-toggle"]} onClick={this.toggleMode}>
      <img alt="darkmode toggle" src={this.state.img} />
    </button>);
  }
}
