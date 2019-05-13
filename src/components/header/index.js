import React from 'react';
import DarkmodeToggle from './darkmode_toggle.js';
import { NavLink } from 'react-router-dom';
import style from './style.module.css';

const Header = () => (
	<header className={style.header}>
    <h1 className={style['header-left']}>Taylor Bartlett</h1>
    <nav className={style['header-right']}>
      <NavLink className={style['nav-link']} activeClassName={style.active} to="/" exact>home</NavLink>
			<NavLink className={style['nav-link']} activeClassName={style.active} to="/resume">resume</NavLink>
      <NavLink className={style['nav-link']} activeClassName={style.active} to="/hn">hn</NavLink>
      <DarkmodeToggle />
		</nav>
	</header>
);

export default Header;
