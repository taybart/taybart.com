const api = 'http://localhost:8080'



export async function login(user: string, password: string): Promise<{msg: string, error: boolean}> {
  if (user.length === 0) {
    return {msg: 'A user name is required', error: true}
  }
  if (password.length === 0) {
    return {msg: 'A password is required', error: true}
  }
  const res = await fetch(`${api}/login`, {
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

export async function notes(note = ''): Promise<{msg: string, note?: {title: string, body: string}, error: boolean}> {
  const res = await fetch(`${api}/notes${note && `?note=${note}`}`, {
    method: "GET",
    credentials: 'include',
  })
  if (res.status === 401) {
    return {msg: 'unauthorized', error: true}
  }
  try {
    const json = await res.json()
    return {msg: '', note: json, error: !(res.status === 200)}
  } catch (err) {
    return {msg: err, error: true}
  }
}
