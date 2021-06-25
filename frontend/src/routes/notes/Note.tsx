import React, {FC, useState, useEffect} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Loading from '../../components/loading'

import {getNote} from '../../util/api'

const Note: FC = () => {
  const [ready, setReady] = useState<boolean>(false)
  const [note, setNote] = useState<{title: string, body: string}>({title: '', body: ''})
  const history = useHistory()
  const params = useParams<{id: string}>()


  useEffect(() => {
    getNote(params.id).then(({note, msg, error}) => {
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
    return <Loading className="m-auto pt-16" />
  }
  return (<div className="flex flex-col items-left justify-center py-10">
    <Link className="back pl-10" to="/notes">back</Link>
    <ReactMarkdown className="pl-80 markdown">
      {note.body}
    </ReactMarkdown>
  </div>)
}

export default Note
