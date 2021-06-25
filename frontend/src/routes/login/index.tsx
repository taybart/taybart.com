import React, {FC, SyntheticEvent, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {setAuthorized, useAppDispatch} from '../../store'

import {login} from '../../util/api'

import './style.css'

const Login: FC = () => {
  const [user, setUser] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [badCreds, setBadCreds] = useState<boolean>(false)
  const [to, setTO] = useState<number>(-1)

  const history = useHistory()
  const dispatch = useAppDispatch()

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    clearTimeout(to)
    const {msg, error} = await login(user, password)
    if (error) {
      if (msg === 'bad credentials') {
        setBadCreds(true)
        setTO(setTimeout(() => {
          setBadCreds(false)
          setError("")
        }, 5000))
      } else {
        setError(msg)
      }
      return
    }
    dispatch(setAuthorized(true))
    history.push('/')
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {error && <p className="text-red-500"> {error} </p>}
        <label className="input-label" htmlFor="u"> user: </label>
        <input
          id="u"
          className="input"
          autoFocus
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <label className="input-label" htmlFor="pw"> password: </label>
        <input
          id="pw"
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" />
      </form>
      {badCreds && <img className="absolute inset-0 m-auto" src="/img/jp_naw.gif" />}
    </div>
  )
}

export default Login
