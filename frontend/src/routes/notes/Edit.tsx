import React, { FC, useState, useEffect, useMemo } from "react";
import { BaseEditor, createEditor, Node } from "slate";
import { Slate, Editable, ReactEditor, withReact } from "slate-react";

const serialize = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join("\n");
};

export type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
  }
}

interface Props {
  note: string;
  online: boolean;
  onExit: () => void;
  onSave: (note: string) => void;
}

const parse = (note: string): Node[] => {
  return note
    .split("\n")
    .map((s) => ({ type: "paragraph", children: [{ text: s }] }));
};

const Edit: FC<Props> = ({ note, online, onSave, onExit }) => {
  const [value, setValue] = useState<Node[]>([]);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    const saveListener = (e: KeyboardEvent) => {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.key == "s"
      ) {
        e.preventDefault();
        onSave(serialize(value));
        if (!online) {
          alert("not online, your work will not be saved");
        }
      }
    };
    setValue(parse(note));
    document.addEventListener("keydown", saveListener, false);
    return () => {
      document.removeEventListener("keydown", saveListener);
    };
  }, []);

  const onClick = () => {
    onSave(serialize(value));
    onExit();
  };

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
        className={`md:mx-56 mx-4 p-10 border ${
          online ? "border-dark dark:border-white" : "border-red-600"
        } h-full`}
      >
        <Slate
          editor={editor}
          value={value}
          onChange={(update) => setValue(update)}
        >
          <Editable />
        </Slate>
      </div>
    </div>
  );
};

export default Edit;
