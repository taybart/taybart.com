import React, {FC, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Loading from '../../components/loading'

import {notes} from '../../util/api'

const Notes: FC = () => {
  const [ready, setReady] = useState<boolean>(false)
  const [note, setNote] = useState<{title: string, body: string}>({title: '', body: ''})
  const history = useHistory()


  useEffect(() => {
    notes().then(({note, msg, error}) => {
      if (error) {
        if (msg === 'unauthorized') {
          history.push('/login')
        }
        return
      }
      if (note) {
        setNote(note)
      }
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <Loading className="mx-auto mt-56" />
  }
  return (<div className="flex flex-col items-center justify-center w-full h-screen">
    <h1 className="text-3xl border-b border-dark dark:border-white">{note.title}</h1>
    <p>{note.body}</p>
  </div>)
}

export default Notes
