import { Route } from 'wouter'
import Header from './components/molecules/Header'
import Resume from './pages/resume'
import HN from './pages/hn'
import HNPost from './pages/hn/Post'
import './App.css'

function App() {
  return (
    <>
      <Header />

      <Route path="/">
        <Resume />
      </Route>
      <Route path="/hn">
        <HN />
      </Route>
      <Route path="/hn/:id">
        {(params) => <HNPost top={true} id={+params.id} />}
      </Route>
    </>
  )
}

export default App
