import React, { Component } from 'react';
import style from './style.module.css';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
  };
  render() {
    const { username, password } = this.state;
    return (<form
      className={style.login}
      onSubmit={(e) => {
        e.preventDefault();
        fetch()
      }}
    >
      <input
        type="text"
        value={username}
        placeholder="username"
        autoFocus
        onChange={(e) => this.setState({ username: e.target.value })}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => this.setState({ password: e.target.value })}
      />
      <button type="submit" className="btn-tb">login</button>
    </form>);
  }
}
