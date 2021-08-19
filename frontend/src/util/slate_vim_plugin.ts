import {BaseEditor, Editor, Transforms, Element} from "slate";

export type VimText = {text: string}
export interface VimElement {type: 'paragraph'; children: VimText[]}

export interface VimEditor extends BaseEditor {
  to: number
  mode: string
  buf: string
  cmd: string
  vimKeyDown: (event: KeyboardEvent) => void
  handleNormalMode: () => void
  handleInsertMode: () => void
  handleCommandMode: () => void
  executeCommand: () => void
  onModeChange: (mode: string) => void
  setMode: (mode: string) => void
  onSave: () => void
  onQuit: () => void
}


function handleMotion<T extends Editor>(e: T & VimEditor, dir: 'up' | 'down' | 'left' | 'right' | 'end' | 'start') {
  if (e.selection && e.selection.focus) {
    if (e.children.length > 0) {
      const {focus} = e.selection

      const currentNode = focus.path[0]
      let prevLength = 0
      if (currentNode - 1 >= 0) {
        const n = e.children[currentNode - 1]
        if (Element.isElement(n)) {
          prevLength = n.children[0].text.length
        } else {
          prevLength = n.text.length
        }

      }

      let currentLength = 0
      {
        const n = e.children[currentNode]
        if (Element.isElement(n)) {
          currentLength = n.children[0].text.length
        } else {
          currentLength = n.text.length
        }
      }

      let nextLength = 0
      if (currentNode + 1 < e.children.length) {
        const n = e.children[currentNode + 1]
        if (Element.isElement(n)) {
          nextLength = n.children[0].text.length
        } else {
          nextLength = n.text.length
        }

      }
      switch (dir) {
        case 'up':
          {
            if (focus.path[0] == 0) {
              break
            }
            let offset = focus.offset
            if (prevLength < offset) {
              offset = prevLength
            }
            const loc = {path: [focus.path[0] - 1], offset: offset}
            Transforms.select(e, {focus: loc, anchor: loc})
          }
          break
        case 'down':
          {
            if (currentNode >= e.children.length) {
              break
            }
            let offset = focus.offset
            if (nextLength < offset) {
              offset = nextLength
            }
            const loc = {path: [focus.path[0] + 1], offset: offset}
            Transforms.select(e, {focus: loc, anchor: loc})
          }
          break
        case 'left':
          Transforms.move(e, {distance: 1, unit: 'character', reverse: true})
          break
        case 'right':
          Transforms.move(e, {distance: 1, unit: 'character'})
          break
        case 'start':
          {
            const loc = {path: [focus.path[0]], offset: 0}
            Transforms.select(e, {focus: loc, anchor: loc})
          }
          break
        case 'end':
          {
            const loc = {path: [focus.path[0]], offset: currentLength}
            Transforms.select(e, {focus: loc, anchor: loc})
          }
          break
      }

    }
  }
}

export function withVim<T extends Editor>(editor: T): T & VimEditor {
  const e = editor as T & VimEditor
  e.to = -1
  e.buf = '' // command buffer
  e.mode = 'normal'
  e.cmd = ''
  e.setMode = (m: string) => {
    e.mode = m
    e.onModeChange(m)
  }

  e.executeCommand = () => {
    console.log(e.cmd)
    switch (e.cmd) {
      case 'w':
        // save
        e.onSave()
        break
      case 'q':
        // quit
        e.onQuit()
        break
      case 'wq':
        e.onSave()
        e.onQuit()
        break
    }
  }
  e.handleNormalMode = () => {
    switch (e.buf) {
      case 'ArrowLeft':
      case 'h':
        handleMotion(e, 'left')
        break
      case 'ArrowDown':
      case 'j':
        handleMotion(e, 'down')
        break
      case 'ArrowUp':
      case 'k':
        handleMotion(e, 'up')
        break
      case 'ArrowRight':
      case 'l':
        handleMotion(e, 'right')
        break
      case '$':
        handleMotion(e, 'end')
        break
      case '^':
        handleMotion(e, 'start')
        break
      case 'i':
        e.setMode('insert')
        break
      case 'o':
        {
          handleMotion(e, 'end')
          Transforms.insertNodes(e, {type: 'paragraph', children: [{text: ''}]})
          e.setMode('insert')
        }
        break
      case 'v':
        e.setMode('visual')
        break
      case 'V':
        e.setMode('visual-line')
        break
      case 'Shift:':
      case ':':
        e.setMode('command')
        break
    }
    e.buf = ''
  }

  e.handleCommandMode = () => {
    switch (e.buf) {
      case 'Escape':
        e.setMode('normal')
        break
      case 'Enter':
        e.executeCommand()
        e.mode = 'insert'
        break
      default:
        e.cmd += e.buf
    }
  }

  e.handleInsertMode = () => {
    if ((e.buf === 'Escape' || e.buf === 'jk')) {
      e.setMode('normal')
    } else {
      switch (e.buf) {
        case 'ArrowLeft':
          handleMotion(e, 'left')
          break
        case 'ArrowDown':
          handleMotion(e, 'down')
          break
        case 'ArrowUp':
          handleMotion(e, 'up')
          break
        case 'ArrowRight':
          handleMotion(e, 'right')
          break
        case 'Enter':
          Transforms.insertNodes(e, {type: 'paragraph', children: [{text: ''}]})
          break
        case 'Backspace':
          e.deleteBackward("character")
          break
        case 'Shift':
        case 'Control':
          break
        default:
          e.insertText(e.buf)
      }
    }
  }

  e.vimKeyDown = (ev: KeyboardEvent): void => {
    ev.preventDefault()
    e.buf += ev.key
    clearTimeout(e.to)
    e.to = setTimeout(() => {
      console.log(e.buf)
      if (e.mode === 'normal') {
        e.handleNormalMode()
      } else if (e.mode === 'command') {
        e.handleCommandMode()
      } else if (e.mode === 'insert') {
        e.handleInsertMode()
      }
      e.buf = ''
    }, 50)
  }
  return e
}

