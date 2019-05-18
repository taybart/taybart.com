import React, { Component } from 'react';
import style from './style.module.css';

export default class Chat extends Component {
  state = {
    message: "",
  }
  render() {
    return (<div className={style.chat}>
      <ul className={style.chatlog}> {this.props.chat.map((m,i) =>
       <li key={i}>{m.user}: {m.msg}</li>
      )} </ul>
    <form
      className={style.chatinput}
      onSubmit={(e) => {
        e.preventDefault();
        console.log(this.state.message)
        this.props.onSend(this.state.message);
        this.setState({ message: "" });
      }}>
        <label>
          <input
            ref={this.input}
            type="text"
            value={this.state.message}
            onChange={(e) => this.setState({ message: e.target.value })}
          />
        </label>
      </form>
    </div>);
  }
}
