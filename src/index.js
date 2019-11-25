import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import Header from './components/header';

// Code-splitting is automated for routes
// import Home from '../routes/home';
import Resume from './routes/resume';
import HN from './routes/hn';
import VC from './routes/voicechat';
import Login from './routes/login';

function App () {
    return (
      <div id="app">
        <Router>
          <Header />
          <Route path="/" exact>
            <Redirect to="/resume" />
          </Route>
          <Route path="/resume" component={Resume} />
          <Route path="/hn" component={HN} />
          <Route path="/vc" component={VC} />
          <Route path="/login" component={Login} />
        </Router>
      </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
