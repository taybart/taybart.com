import React, {FC, useState, useEffect} from 'react'
import {useHistory, Link} from 'react-router-dom'
import Loading from '../../components/loading'

import {listNotes} from '../../util/api'

const NotesList: FC = () => {
  const [ready, setReady] = useState<boolean>(false)
  const [notes, setNotes] = useState<string[]>([])
  const history = useHistory()


  useEffect(() => {
    listNotes().then(({notes, msg, error}) => {
      if (error) {
        if (msg === 'unauthorized') {
          history.push('/login')
        }
        return
      }
      if (notes) {
        setNotes(notes)
      }
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <Loading className="m-auto pt-16" />
  }
  return (<div className="flex flex-col items-left justify-center py-10 pl-10">
    <ul className="list-disc">
      {notes.map(n => (
        <li key={n}>
          <Link className="underline" to={`/note/${n}`}>
            {n}
          </Link>
        </li>
      ))}
    </ul>
  </div>)
}

export default NotesList
