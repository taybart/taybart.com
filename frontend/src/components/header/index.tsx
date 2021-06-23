import React, {FC} from 'react'
import {NavLink} from 'react-router-dom'
import './style.css'

const Header: FC = () => {
  return (
    <header id="navbar" className="header">
      <NavLink exact to="/">
        <h1 className={`pl-2 text-xl font-medium`}>TB</h1>
      </NavLink>
      <nav className="right">
        <NavLink
          className="nav-link"
          activeClassName="active"
          to="/resume"
        >
          resume
        </NavLink>
        <NavLink
          className="nav-link"
          activeClassName="active"
          to="/hn"
        >
          hn
        </NavLink>
      </nav>
    </header>
  )
}


// path="/hn/:id?/:comment?"
export default Header
