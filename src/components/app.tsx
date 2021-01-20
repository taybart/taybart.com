import { FunctionalComponent, h } from 'preact'
import { Router, Route, route } from 'preact-router'

import Resume from '../routes/resume/index'
import HN from '../routes/hn'
import Post from '../routes/hn/post'
import NotFoundPage from '../routes/notfound'
import Header from './header'

const Redirect: FunctionalComponent<{ to: string }> = props => {
    route(props.to, true)
    return null
}

const App: FunctionalComponent = () => {
    return (
        <div id="app">
            <Header />
            <Router>
                <Redirect path="/" to="/resume" />
                <Resume path="/resume" />
                <HN path="/hn" />
                <Route path="/hn/:id/:comment?" component={Post} />
                <NotFoundPage default />
            </Router>
        </div>
    )
}

export default App
