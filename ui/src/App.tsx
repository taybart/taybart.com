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
      {/* TODO: clean this up */}
      <Route path="/hn/:id?">
        {(params) =>
          params.id ? <HNPost top={true} id={+params.id} /> : <HN />
        }
      </Route>
    </>
  )
}

export default App
