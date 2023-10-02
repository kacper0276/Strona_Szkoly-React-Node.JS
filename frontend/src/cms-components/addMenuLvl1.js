import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import EditMenuLvl1 from "./editMenuLvl1";

export default function AddMenuLvl1() {
  const location = useLocation();
  const [data, setData] = useState({
    name: "",
    type: "poziom1",
    which: "",
    rodzaj: "",
    path: "",
  });
  const [msg, setMsg] = useState("");
  const [actualLvl1, setActualLvl1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const addMenu = (e) => {
    e.preventDefault();

    axios
      .post(`${url}/addlvl1menu`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          setMsg(res.data.msg);
        }
        fetchLvl1();
      });
  };

  const deleteMenu = (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deletelvl1menu/${id}`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          setMsg(res.data.msg);
        }
        fetchLvl1();
      });
  };

  async function fetchLvl1(e) {
    axios.get(`${url}/getlvl1`).then((res) => {
      setActualLvl1(res.data.menu);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchLvl1();
  }, [location]);

  return (
    <>
      {showEditForm ? (
        <EditMenuLvl1 setShowEditForm={setShowEditForm} idEdit={editId} />
      ) : (
        <div className="adduser-panel-cnt">
          <form>
            <h1>Dodaj Poziom 1 W Menu</h1>
            <h3>Nazwa:</h3>
            <input
              type={"text"}
              onChange={(e) => {
                setData({
                  ...data,
                  name: e.target.value,
                  which: e.target.value,
                });
              }}
            />
            <h3>Link do zewnętrznej strony:</h3>
            <input
              type="text"
              onChange={(e) => {
                setData({ ...data, path: e.target.value });
              }}
            />
            <h3>Zawartość: </h3>
            <Editor
              init={{
                language: "pl",
                language_url: "/langs/pl.js",
                plugins: "table link image preview code",
                resize: false,
                branding: false,

                menu: {
                  file: {
                    title: "File",
                    items:
                      "newdocument restoredraft | preview | export print | deleteallconversations",
                  },
                  edit: {
                    title: "Edit",
                    items:
                      "undo redo | cut copy paste pastetext | selectall | searchreplace",
                  },
                  view: {
                    title: "View",
                    items:
                      "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
                  },
                  insert: {
                    title: "Insert",
                    items:
                      "image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
                  },
                  format: {
                    title: "Format",
                    items:
                      "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | removeformat",
                  },
                  tools: {
                    title: "Tools",
                    items:
                      "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
                  },
                  table: {
                    title: "Table",
                    items:
                      "inserttable | cell row column | advtablesort | tableprops deletetable",
                  },
                  help: { title: "Help", items: "help" },
                },
              }}
              onEditorChange={(e) => {
                setData({ ...data, rodzaj: e });
              }}
            />
            <input
              type={"submit"}
              value={"+ Dodaj poziom 1"}
              onClick={addMenu}
            />
          </form>
          <form>
            <h1>Usuń Poziom 1 W Menu</h1>
            {loading ? (
              <p>Ładowanie danych...</p>
            ) : (
              <table>
                <tbody>
                  {actualLvl1.map((actual, key) => {
                    return (
                      <tr key={key}>
                        <td>{actual.id}</td>
                        <td>{actual.nazwa}</td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Na pewno chcesz usunąć ten rekord?"
                                )
                              ) {
                                deleteMenu(e, actual.id);
                              }
                            }}
                          >
                            - Usuń Poziom 1
                          </button>
                        </td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              setEditId(actual.id);
                              setShowEditForm(true);
                            }}
                          >
                            - Edytuj Poziom 1
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </form>
          {msg ? (
            <div className="msg-div">
              <div className="button-close" onClick={(e) => setMsg("")}>
                <span></span>
                <span></span>
              </div>
              {msg}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
