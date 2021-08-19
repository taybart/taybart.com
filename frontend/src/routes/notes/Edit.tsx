import React, {FC, useState, useEffect} from "react";
import {Vim} from "../../util/Editor"
import {isMobile} from '../../util/mobile'


interface Props {
  note: string;
  online: boolean;
  onExit: () => void;
  onSave: (note: string) => void;
}

const Edit: FC<Props> = ({note, online, onSave, onExit}) => {
  const [value, setValue] = useState<string>(note);

  useEffect(() => {
    const saveListener = (e: KeyboardEvent) => {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.key == "s"
      ) {
        e.preventDefault();
        // onSave(serialize(value));
        if (!online) {
          alert("not online, your work will not be saved");
        }
      }
    };
    // setValue(parse(note));
    document.addEventListener("keydown", saveListener, false);
    return () => {
      document.removeEventListener("keydown", saveListener);
    };
  }, []);


  const onClick = () => {
    onSave(value);
    onExit();
  };

  if (!isMobile()) {
    return <Vim online={online} note={note} />
  }
  return (
    <div className="flex flex-col w-full items-left justify-center py-10">
      <div className="flex flex-row justify-between w-full px-10">
        <div className="back cursor-pointer lg:pb-0 pb-14" onClick={onClick}>
          finish
        </div>
        {!online && (
          <div className="cursor-pointer lg:pb-0 pb-14 text-red-600">
            offline!
          </div>
        )}
        <div />
      </div>
      <div
        className={`md:mx-56 mx-4 border ${online ? "border-dark dark:border-white" : "border-red-600"} h-full`} >
        <div className={`p-10 border h-full`}>
          <textarea
            value={value}
            className="editor h-screen"
            onChange={(e) => {setValue(e.target.value)}}
          />
        </div>
      </div>
    </div>
  );
};

export default Edit;
