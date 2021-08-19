import {RefObject} from 'react'

type selection = {
  focus: number
  anchor: number
}

export class VimEditor {
  to: number
  inbuf: string  // input buffer
  buf: string // document buffer
  mode: string
  cmd: string
  ref: RefObject<HTMLDivElement> | null
  selection: selection
  onModeChange: (m: string) => void
  onSave: () => void
  onQuit: () => void
  constructor() {
    this.to = -1
    this.inbuf = ''
    this.buf = '' // command buffer
    // this.mode = 'normal'
    this.mode = 'insert'
    this.cmd = ''
    this.selection = {focus: 0, anchor: 0}
    this.onModeChange = (): void => {console.log('not implemented')}
    this.onSave = (): void => {console.log('not implemented')}
    this.onQuit = (): void => {console.log('not implemented')}
    this.ref = null
  }

  handleMotion(dir: 'up' | 'down' | 'left' | 'right' | 'end' | 'start'): void {
    if (this.selection && this.selection.focus) {
      switch (dir) {
        case 'up':
        // {
        //   if (focus == 0) {
        //     break
        //   }
        //   let offset = focus.offset
        //   if (prevLength < offset) {
        //     offset = prevLength
        //   }
        //   const loc = {path: [focus.path[0] - 1], offset: offset}
        //   Transforms.select(e, {focus: loc, anchor: loc})
        // }
        // break
        case 'down':
        // {
        //   if (currentNode >= this.children.length) {
        //     break
        //   }
        //   let offset = focus.offset
        //   if (nextLength < offset) {
        //     offset = nextLength
        //   }
        //   const loc = {path: [focus.path[0] + 1], offset: offset}
        //   Transforms.select(e, {focus: loc, anchor: loc})
        // }
        // break
        case 'left':
          this.selection.focus -= 1
          // this.selection.anchor -= 1
          break
        case 'right':
          this.selection.focus += 1
          // this.selection.anchor += 1
          break
        case 'start':
          this.selection.focus = this.findPrev('\n')
          break
        case 'end':
          this.selection.focus = this.findNext('\n')
          console.log(this.selection.focus)
          break
      }
      this.onUpdate()
    }
  }

  findNext(str: string): number {
    for (let i = this.selection.focus; i < this.buf.length; i++) {
      if (this.buf[i] === str) {
        return i++
      }
    }
    return this.buf.length
  }

  findPrev(str: string): number {
    for (let i = this.selection.focus; i > 0; i--) {
      if (this.buf[i] === str) {
        return i
      }
    }
    return 0
  }

  setMode(m: string): void {
    this.mode = m
    this.onModeChange(m)
  }

  executeCommand(): void {
    switch (this.cmd) {
      case 'w':
        // save
        this.onSave()
        break
      case 'q':
        // quit
        this.onQuit()
        break
      case 'wq':
        this.onSave()
        this.onQuit()
        break
    }
  }
  handleNormalMode(): boolean {
    let handled = true
    switch (this.inbuf) {
      case 'ArrowLeft':
      case 'h':
        this.handleMotion('left')
        break
      case 'ArrowDown':
      case 'j':
        this.handleMotion('down')
        break
      case 'ArrowUp':
      case 'k':
        this.handleMotion('up')
        break
      case 'ArrowRight':
      case 'l':
        this.handleMotion('right')
        break
      case '$':
        this.handleMotion('end')
        break
      case '^':
        this.handleMotion('start')
        break
      case 'i':
        this.setMode('insert')
        break
      case 'o':
        {
          this.handleMotion('end')
          this.insert('\n')
          this.setMode('insert')
        }
        break
      case 'v':
        this.setMode('visual')
        break
      case 'V':
        this.setMode('visual-line')
        break
      case 'Shift:':
      case ':':
        this.setMode('command')
        break
      default:
        handled = false
    }
    return handled
  }

  handleCommandMode(): boolean {
    switch (this.inbuf) {
      case 'Escape':
        this.setMode('normal')
        break
      case 'Enter':
        this.executeCommand()
        this.mode = 'insert'
        break
      default:
        this.cmd += this.inbuf
    }
  }

  handleInsertMode(): boolean {
    if ((this.inbuf === 'Escape' || this.inbuf === 'jk')) {
      this.setMode('normal')
      // } else {
      //   switch (this.inbuf) {
      //     case 'ArrowLeft':
      //       this.handleMotion('left')
      //       break
      //     case 'ArrowDown':
      //       this.handleMotion('down')
      //       break
      //     case 'ArrowUp':
      //       this.handleMotion('up')
      //       break
      //     case 'ArrowRight':
      //       this.handleMotion('right')
      //       break
      //     case 'Enter':
      //       this.insert('\n')
      //       break
      //     case 'Backspace':
      //       this.deleteBackward('character')
      //       break
      //     case 'Shift':
      //     case 'Control':
      //       break
      //     default:
      //       this.insert()
      //   }
    }
  }

  insert(str?: string): void {
    const f = this.selection.focus
    let toInsert = this.inbuf
    if (str) {
      toInsert = str
      console.log('to insert', str)
    }
    this.buf = this.buf.slice(0, f) + (toInsert || "") + this.buf.slice(f)
    this.selection.focus += 1
  }
  deleteBackward(unit: 'character' | 'word'): void {
    const f = this.selection.focus
    if (unit === 'word') {
      // do word
    }
    this.buf = this.buf.slice(0, f - 1) + this.buf.slice(f)
    this.selection.focus -= 1
  }

  onUpdate(): void {
    if (this.ref) {
      if (this.ref.current) {
        // this.ref.current.selectionStart = this.selection.focus
        // this.ref.current.selectionEnd = this.selection.focus
      }
    }
  }

  // process(e: React.KeyboardEvent, doc: string, finished: (n: string) => void): boolean {
  process(e: React.KeyboardEvent, doc: string): boolean {
    this.inbuf += e.key
    console.log(this.inbuf)

    this.selection.focus = e.target.selectionStart
    // this.selection.anchor = e.target.selectionEnd

    let handled = false
    this.buf = doc.slice()
    // clearTimeout(this.to)
    // this.to = setTimeout(() => {
    // console.log(this.buf)
    if (this.mode === 'normal') {
      handled = this.handleNormalMode()
    } else if (this.mode === 'command') {
      handled = this.handleCommandMode()
    } else if (this.mode === 'insert') {
      handled = this.handleInsertMode()
    }
    this.inbuf = ''
    return handled
    // finished(this.buf)
    // }, 50)
  }
}
