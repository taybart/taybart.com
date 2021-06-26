import React, {FC, useState, useEffect, useMemo} from 'react'
import {BaseEditor, createEditor, Node, Text} from 'slate'
import {Slate, Editable, ReactEditor, withReact, } from 'slate-react'

const serialize = (nodes: Node[]) => {
  return nodes.map(n => Node.string(n)).join('\n')
}


export type CustomEditor = BaseEditor & ReactEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
  }
}

interface Props {
  note: string;
  onExit: (note: string) => void;
}

const parse = (note: string): Node[] => {
  return note.split('\n').map(s => ({type: 'paragraph', children: [{text: s}]}))
}

const Edit: FC<Props> = ({note, onExit}) => {
  const [value, setValue] = useState<Node[]>([])
  const editor = useMemo(() => withReact(createEditor()), [])

  useEffect(() => {
    setValue(parse(note))
  }, [])

  return (<div className="flex flex-col w-full items-left justify-center py-10">
    <div className="back pl-10 cursor-pointer" onClick={() => onExit(serialize(value))}>
      finish
    </div>
    <div className="mx-56 p-10 border border-white h-full">
      <Slate editor={editor} value={value} onChange={update => setValue(update)}>
        <Editable />
      </Slate>
    </div >
  </div >)
}

export default Edit
