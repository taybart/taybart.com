import React, {Component} from 'react';
import DarkmodeToggle from './darkmode_toggle.js';
import { NavLink } from 'react-router-dom';
import style from './style.module.css';



class Header extends Component {
  componentDidMount() {
    /* let prevScrollpos = window.pageYOffset;
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      console.log(prevScrollpos, currentScrollPos)
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
      } else {
        document.getElementById("navbar").style.top = "-50px";
      }
      prevScrollpos = currentScrollPos;
    } */
  }
  render() {
    return (
      <header id="navbar" className={style.header}>
        <h1 className={style['header-left']}>Taylor Bartlett</h1>
        <nav className={style['header-right']}>
          <NavLink className={style['nav-link']} activeClassName={style.active} to="/" exact>home</NavLink>
          <NavLink className={style['nav-link']} activeClassName={style.active} to="/resume">resume</NavLink>
          <NavLink className={style['nav-link']} activeClassName={style.active} to="/hn">hn</NavLink>
          <DarkmodeToggle />
        </nav>
      </header>
    );
  }
  }

  export default Header;
