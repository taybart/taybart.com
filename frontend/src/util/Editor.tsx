import React, { FC, useState, useEffect, useRef } from "react";
import Draft, { Editor, EditorState, ContentState } from 'draft-js';

import { VimEditor } from './vim'


interface Props {
  note: string;
  online: boolean;
}

export const Vim: FC<Props> = ({ note, online }) => {
  const [value] = useState<string>(note);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText(note)),
  );
  // const [renderedValue, setRenderedValue] = useState<JSX.Element[]>([]);
  const taRef = useRef<HTMLDivElement>(null)
  const [editor] = useState<VimEditor>(() => new VimEditor());
  const [mode, setMode] = useState<string>(editor.mode);

  useEffect(() => {
    editor.onUpdate()
    // setRenderedValue(render(value))
  }, [value]);

  useEffect(() => {
    if (taRef) {
      editor.ref = taRef
    }
  }, [taRef]);

  editor.onModeChange = (m: string) => {
    setMode(m)
  }
  const keyBindingFn = (e: KeyboardEvent) => {
    const currentSelection = editorState.getSelection();
    console.log(currentSelection)
    if (editor.process(e, value)) {

      return 'handled-by-vim'
    }

    // This wasn't the delete key, so we return Draft's default command for this key
    return Draft.getDefaultKeyBinding(e)
  }
  const handleKeyCommand = (command: string): Draft.DraftHandleValue => {
    console.log(command)

    if (command === 'handled-by-vim') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.

      // editor.process(e, value, setValue)
      return 'handled';
    }
    return 'not-handled';
  }

  return (<div className="flex flex-col w-full items-left justify-center py-10" >
    <div className="flex flex-row justify-between w-full px-10" >
      <div className="back cursor-pointer lg:pb-0 pb-14" > finish </div>
      {!online && (<div className="cursor-pointer lg:pb-0 pb-14 text-red-600" > offline!  </div>)}
    </div>
    <div className={`md:mx-56 mx-4 border ${online ? "border-dark dark:border-white" : "border-red-600"} h-full`} >
      <div className={`p-10 border h-full`}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
      <div className="pl-10 text-yellow-600" > {mode} </div>
    </div>
  </div>)
};
        // <div
        //   contentEditable={true}
        //   role="textbox"
        //   ref={taRef}
        //   className="editor"
        //   onKeyDown={(e) => {
        //     e.preventDefault()
        //     console.log(getCaretCoordinates())
        //     editor.process(e, value, setValue)
        //   }}>
        //   {renderedValue}
        // </div>

/*
// useEffect(() => {
//   return () => {
//     clearTimeout(editor.to)
//   };
// }, []);

// useEffect(() => {
//   const saveListener = (e: KeyboardEvent) => {
//     if (
//       (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
//       e.key == "s"
//     ) {
//       e.preventDefault();
//       // onSave(serialize(value));
//       if (!online) {
//         alert("not online, your work will not be saved");
//       }
//     }
//   };
//   // setValue(parse(note));
//   document.addEventListener("keydown", saveListener, false);
//   return () => {
//     document.removeEventListener("keydown", saveListener);
//   };
// }, []);



// const onClick = () => {
//   console.log('test')
//   // onExit();
// };


// editor.onSave = () => {
//   // onSave(serialize(value));
// }
// editor.onQuit = () => {
//   onExit();
// }


*/
