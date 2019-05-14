import React, {Component} from 'react';
import style from './style.module.css';
import sun from '../../assets/sun.png';
import moon from '../../assets/moon.png';

const DARK = '(prefers-color-scheme: dark)';
const LIGHT = '(prefers-color-scheme: light)';

export default class DarkmodeToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: ((localStorage.getItem('mode') || 'light') === 'light') ? moon : sun,
    };
  }

  componentDidMount() {
    this.addColorSchemeListeners();
    const mode = localStorage.getItem('mode');
    if (mode === 'light') {
      this.setLight()
    } else if (mode === 'dark') {
      this.setDark()
    } else if (!this.sysColorScheme()) {
      // if no previous mode, attempt to autodetect
      this.setLight(); // default to light
    }
  }

  addColorSchemeListeners = () => {
    if(!window.matchMedia) { return }
    window.matchMedia(DARK).addListener((e) => this.checkSysScheme(e));
    window.matchMedia(LIGHT).addListener((e) => this.checkSysScheme(e));
  }
  sysColorScheme = () => {
    return this.checkSysScheme(window.matchMedia(DARK)) || this.checkSysScheme(window.matchMedia(LIGHT));
  }
  checkSysScheme = ({matches, media}) => {
    if(!matches) {
      return false;
    } else if(media === DARK) {
      this.setDark()
      return true;
    } else if (media === LIGHT) {
      this.setLight()
      return true;
    }
  }

  toggleMode = () => {
    if (localStorage.getItem('mode') === 'light') {
      this.setDark();
    } else {
      this.setLight();
    }
  }

  setmode = (mode) => {
  }
  setDark = () => {
    localStorage.setItem('mode', 'dark');
    document.querySelector('body').classList.add('dark');
    document.querySelector('header').classList.add('dark');
    this.setState({ img: sun });
  }
  setLight = () => {
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
