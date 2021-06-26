const api = ''
// const api = 'http://york.local:8080'

export async function login(user: string, password: string): Promise<{msg: string, error: boolean}> {
  if (user.length === 0) {
    return {msg: 'A user name is required', error: true}
  }
  if (password.length === 0) {
    return {msg: 'A password is required', error: true}
  }
  const res = await fetch(`${api}/api/login`, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify({
      user,
      password,
    }),
  })
  if (res.status === 401) {
    return {msg: 'bad credentials', error: true}
  }
  return {msg: '', error: !(res.status === 200)}
}

export async function logout(): Promise<boolean> {
  const res = await fetch(`${api}/api/logout`, {
    method: "POST",
    credentials: 'include',
  })
  return !(res.status === 200)
}

export async function checkLoggedin(): Promise<boolean> {
  const res = await fetch(`${api}/api/authorized`, {
    method: "GET",
    credentials: 'include',
  })
  return res.status === 200
}

export async function getNote(id: string): Promise<{msg: string, note?: string, error: boolean}> {
  const res = await fetch(`${api}/api/note/${id}`, {
    method: "GET",
    credentials: 'include',
  })
  if (res.status === 401) {
    return {msg: 'unauthorized', error: true}
  }
  try {
    const json = await res.json()
    return {msg: 'finished', note: json.note, error: !(res.status === 200)}
  } catch (err) {
    return {msg: err, error: true}
  }
}
export async function updateNote(id: string, note: string): Promise<{msg: string, error: boolean}> {
  console.log(JSON.stringify({
    id,
    note
  }))
  const res = await fetch(`${api}/api/note`, {
    method: "PATCH",
    credentials: 'include',
    body: JSON.stringify({
      id,
      note
    }),
  })
  if (res.status === 401) {
    return {msg: 'unauthorized', error: true}
  }
  return {msg: '', error: !(res.status === 200)}
}
export async function listNotes(): Promise<{msg: string, notes?: string[], error: boolean}> {
  const res = await fetch(`${api}/api/notes`, {
    method: "GET",
    credentials: 'include',
  })
  if (res.status === 401) {
    return {msg: 'unauthorized', error: true}
  }
  try {
    const json = await res.json()
    return {msg: '', notes: json.notes, error: !(res.status === 200)}
  } catch (err) {
    return {msg: err, error: true}
  }
}
