import React, { Component } from 'react';
import style from './style.module.css';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
  };
  username = React.createRef()
  password = React.createRef()
  render() {
    const { username, password } = this.state;
    return (<form
      className={style.login}
      onSubmit={(e) => {
        this.username.current.classList.remove(style['input-error']);
        this.password.current.classList.remove(style['input-error']);
        e.preventDefault();
        let url = 'http://localhost:8080/login';
        if (process.env.NODE_ENV !== 'development') {
          url = 'https://taybart.com/login';
        }
        if (username === '') {
          this.username.current.classList.add(style['input-error'])
        }
        if (password === '') {
          this.password.current.classList.add(style['input-error'])
        }
        if ((username === '') || (password === '')) {
          return
        }
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        }).then(res => res.json()).then((res) => {
          console.log(res)
        });
      }}
    >
      <input
        ref={this.username}
        type="text"
        value={username}
        placeholder="username"
        autoFocus
        onChange={(e) => this.setState({ username: e.target.value })}
      />
      <input
        ref={this.password}
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => this.setState({ password: e.target.value })}
      />
      <button type="submit" className="btn-tb">login</button>
    </form>);
  }
}
