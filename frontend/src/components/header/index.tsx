import React, {FC} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {setAuthorized, useAppDispatch, useAppSelector} from '../../store'

import {logout} from '../../util/api'

import './style.css'

const Header: FC = () => {
  const authenticated = useAppSelector((state) => state.authenticated.value)
  const dispatch = useAppDispatch()
  const history = useHistory()
  return (
    <header id="navbar" className="header">
      <NavLink exact to="/">
        <h1 className={`pl-2 text-xl font-medium`}>TB</h1>
      </NavLink>
      <nav className="right">
        <NavLink className="nav-link" activeClassName="active" to="/resume">
          resume
        </NavLink>
        <NavLink className="nav-link" activeClassName="active" to="/hn">
          hn
        </NavLink>
        {authenticated && (<>
          <NavLink className="nav-link" activeClassName="active" to="/notes">
            notes
          </NavLink>
          <button className="focus:outline-none underline" onClick={() => {
            logout()
            dispatch(setAuthorized(false))
            history.push('/')
          }}>
            logout
          </button>
        </>)}
      </nav>
    </header>
  )
}


// path="/hn/:id?/:comment?"
export default Header
