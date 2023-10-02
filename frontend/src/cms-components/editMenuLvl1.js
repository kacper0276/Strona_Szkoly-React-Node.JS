import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";

export default function EditMenuLvl1(props) {
  const location = useLocation();
  const [data, setData] = useState({
    name: "",
    type: "poziom1",
    which: "",
    rodzaj: "",
    path: "",
    id: null,
  });
  const [loadingData, setLoadingData] = useState(true);

  const editMenu = (e) => {
    e.preventDefault();

    axios
      .post(`${url}/editmenu/${data.id}`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.msg) {
          props.setShowEditForm(false);
        }
      });
  };

  const fetchDetails = async () => {
    axios.get(`${url}/getlvl1details/${props.idEdit}`).then((res) => {
      setData({
        ...data,
        name: res.data.data[0].nazwa,
        id: res.data.data[0].id,
        rodzaj:
          res.data.data[0].rodzaj == "poziom1" ? "" : res.data.data[0].rodzaj,
        path: res.data.data[0].path.includes("/content")
          ? ""
          : res.data.data[0].path,
        which: res.data.data[0].glowny,
      });
      setLoadingData(false);
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [location]);

  return (
    <div className="adduser-panel-cnt">
      <button
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          props.setShowEditForm(false);
        }}
      >
        Powrót do poprzedniej strony (Zmiany nie zostaną zapisane)
      </button>
      <form>
        {loadingData ? (
          <p>Ładowanie danych</p>
        ) : (
          <>
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
              defaultValue={data.name}
            />
            <h3>Link do zewnętrznej strony:</h3>
            <input
              type="text"
              onChange={(e) => {
                setData({ ...data, path: e.target.value });
              }}
              defaultValue={data.path}
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
              value={data.rodzaj}
              onEditorChange={(e) => {
                setData({ ...data, rodzaj: e });
              }}
            />
            <input
              type={"submit"}
              value={"+ Edytuj poziom 1"}
              onClick={editMenu}
            />
          </>
        )}
      </form>
    </div>
  );
}
