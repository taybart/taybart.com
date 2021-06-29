import React, { FC, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Loading from "../../components/loading";

import { listNotes } from "../../util/api";

import "./index.css";

const NotesList: FC = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[]>(["asdf"]);
  const history = useHistory();

  useEffect(() => {
    listNotes().then(({ notes, msg, error }) => {
      if (error) {
        if (msg === "unauthorized") {
          history.push("/login");
        }
        return;
      }
      if (notes) {
        setNotes(notes);
      }
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <Loading className="m-auto pt-16" />;
  }

  return (
    <div className="notes-list">
      <ul>
        {notes.map((n) => (
          <li key={n}>
            <Link to={`/notes/${n}`}>{n}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
