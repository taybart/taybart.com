import React, { FC, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";

import Edit from "./Edit";
import EditIcon from "./EditIcon";
import Loading from "../../components/loading";

import { getNote, updateNote } from "../../util/api";

const Note: FC = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(true);
  const [to, setTO] = useState<number>(-1);
  const [note, setNote] = useState<{ id: string; body: string }>({
    id: "",
    body: "",
  });
  const history = useHistory();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    getNote(params.id).then(({ note, msg, error }) => {
      if (error) {
        if (msg === "unauthorized") {
          history.push("/login");
        }
        return;
      }
      if (note) {
        setNote({ id: params.id, body: note });
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (edit) {
      if (to) {
        clearTimeout(to);
      }
      setTO(
        setTimeout(() => {
          fetch("/hc")
            .then((res) => setOnline(res.status === 200))
            .catch(() => setOnline(false));
        }, 5000)
      );
    }
    return () => {
      clearTimeout(to);
    };
  }, [edit]);

  if (!ready) {
    return <Loading className="m-auto pt-16" />;
  }
  if (edit) {
    return (
      <Edit
        note={note.body}
        online={online}
        onExit={(n: string) => {
          setNote({ id: params.id, body: n });
          setEdit(false);
          if (note.body !== n) {
            updateNote(params.id, n);
          }
        }}
      />
    );
  }

  return (
    <div className="w-full pt-10">
      <div className="flex flex-row w-full justify-between pb-10 px-10">
        <Link className="back" to="/notes">
          back
        </Link>
        <EditIcon
          className="cursor-pointer stroke-1"
          onClick={() => setEdit(true)}
        />
      </div>
      <Markdown className="markdown">{note.body}</Markdown>
    </div>
  );
};

export default Note;
