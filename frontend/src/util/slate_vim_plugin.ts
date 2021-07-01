import {BaseEditor, Editor, Transforms} from "slate";

export interface VimEditor extends BaseEditor {
  to: number
  mode: string
  buf: string
  cmd: string
  vimKeyDown: (event: KeyboardEvent) => void
  handleNormalMode: () => void
  handleInsertMode: () => void
  handleCommandMode: (e: KeyboardEvent) => void
  executeCommand: (cmd: string) => void
  onModeChange: (mode: string) => void
  setMode: (mode: string) => void
  // save: (onSave: () => void) => void
  // quit: (onQuit: () => void) => void
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

  e.executeCommand = (cmd: string) => {
    cmd = cmd.slice(1)
    switch (cmd) {
      case 'w':
        // save
        break
      case 'q':
        // quit
        break
    }
  }
  e.handleNormalMode = () => {
    if (e.selection) {
      if (e.children.length > 0) {
        const {focus} = e.selection
        const currentNode = focus.path[0]
        const prevLength = (currentNode - 1 >= 0) && e.children[currentNode - 1].children[0].text.length
        const currentLength = e.children[currentNode].children[0].text.length
        const nextLength = (currentNode + 1 < e.children.length) && e.children[currentNode + 1].children[0].text.length
        switch (e.buf) {
          case 'ArrowLeft':
          case 'h':
            Transforms.move(e, {distance: 1, unit: 'character', reverse: true})
            break
          case 'ArrowDown':
          case 'j':
            {
              if (focus.path[0] >= e.children.length) {
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
          case 'ArrowUp':
          case 'k':
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
          case 'ArrowRight':
          case 'l':
            Transforms.move(e, {distance: 1, unit: 'character'})
            break
          case '$':
            {
              const loc = {path: [focus.path[0]], offset: currentLength}
              Transforms.select(e, {focus: loc, anchor: loc})
            }
            break
          case '^':
            {
              const loc = {path: [focus.path[0]], offset: 0}
              Transforms.select(e, {focus: loc, anchor: loc})
            }
            break
          case 'i':
            e.setMode('insert')
            break
          case 'o':
            {
              const loc = {path: [focus.path[0]], offset: currentLength}
              Transforms.select(e, {focus: loc, anchor: loc})
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
          case ':':
            e.setMode('command')
            break
        }
      }
    }
    e.buf = ''
  }

  e.handleCommandMode = (ev: KeyboardEvent) => {
    switch (ev.key) {
      case 'Return':
        e.executeCommand(e.cmd)
        e.mode = 'insert'
        break
      default:
        e.cmd += ev.key
    }
  }

  e.handleInsertMode = () => {
    if ((e.buf === 'Escape' || e.buf === 'jk')) {
      e.setMode('normal')
    } else {
      switch (e.buf) {
        case 'Backspace':
          e.deleteBackward("character")
          break
        case 'Shift':
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
        e.handleCommandMode(ev)
      } else if (e.mode === "insert") {
        e.handleInsertMode()
      }
      e.buf = ''
    }, 80)
  }
  return e
}

