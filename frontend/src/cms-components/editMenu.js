import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

export default function EditMenu(props) {
  const location = useLocation();
  const [data, setData] = useState({
    name: "",
    type: "",
    which: "",
    category: "",
    path: "",
    id: null,
  });
  const [menuLvl1, setMenuLvl1] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [msg, setMsg] = useState("");

  async function getMenuLvl1() {
    axios.get(`${url}/getlvl1`).then((res) => {
      setMenuLvl1(res.data.menu);
    });
  }

  async function getCategory() {
    let ifExist = false;
    axios.get(`${url}/getcategory/${data.which}`).then((res) => {
      res.data.category.forEach((menuEl) => {
        if (
          menuEl.path.split("/")[3].toLowerCase().replace(/ /g, "") ==
          data.category
        ) {
          ifExist = true;
        }
      });
      if (!ifExist) {
        setData({ ...data, category: "" });
      }
      setCategory(res.data.category);
      setLoadingCategory(false);
    });
  }

  async function getDetailsMenuItem() {
    axios.get(`${url}/getlvl1Details/${props.id}`).then((res) => {
      setData({
        ...data,
        name: res.data.data[0].nazwa,
        id: props.id,
        which: res.data.data[0].glowny,
        type: res.data.data[0].rodzaj,
        path: res.data.data[0].path,
        category: res.data.data[0].path.split("/")[3],
      });
      setLoading(false);
    });
  }

  useEffect(() => {
    new Promise((resolve, reject) => {
      getMenuLvl1();
      resolve();
    }).then((res) => {
      getDetailsMenuItem();
    });
  }, [location]);

  useEffect(() => {
    if (data.which != "") {
      getCategory();
    }
  }, [data.which]);

  const editMenuFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/editmenu/${props.id}`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          // setMsg(res.data.msg);
          props.setEditShow(false);
        }
      });
  };

  return (
    <div className="add-news-panel">
      <button
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          props.setEditShow(false);
        }}
      >
        Powrót do poprzedniej strony (Zmiany nie zostaną zapisane)
      </button>
      <form>
        <h1>Edytuj Zawartość W Menu</h1>
        <h3>Nazwa:</h3>
        <input
          type={"text"}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
          defaultValue={data.name}
        />
        <h3>Link do zewnętrznej strony:</h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, path: e.target.value });
          }}
          defaultValue={data.path.includes("http") ? data.path : null}
        />
        <h3>Czy jest to kategoria</h3>
        <input
          type="checkbox"
          name="checked"
          onChange={(e) => {
            setData({ ...data, type: e.target.checked ? "kategoria" : "" });
          }}
          checked={data.type == "kategoria" ? true : false}
        />
        <h3>Wybierz Do Jakiej Części Menu Dodasz</h3>
        {loading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <select
            onChange={(e) => {
              setData({ ...data, which: e.target.value });
            }}
          >
            <option value={""}>Wybierz</option>
            {menuLvl1.map((menuElement, key) => {
              return (
                <option
                  key={key}
                  value={menuElement.nazwa}
                  selected={
                    data.which ==
                    menuElement.nazwa.toLowerCase().replace(/ /g, "")
                      ? true
                      : false
                  }
                >
                  {menuElement.nazwa}
                </option>
              );
            })}
          </select>
        )}
        <h3>Wybierz do której kategorii dodajesz zawartość</h3>
        {loadingCategory ? null : (
          <select
            onChange={(e) => {
              setData({ ...data, category: e.target.value });
            }}
          >
            <option value={""}>Bez dodatkowej kategorii</option>
            {category.map((categoryEl, key) => {
              return (
                <option
                  key={key}
                  value={categoryEl.nazwa}
                  selected={
                    data.category ==
                    categoryEl.nazwa.toLowerCase().replace(/ /g, "")
                      ? true
                      : false
                  }
                >
                  {categoryEl.nazwa}
                </option>
              );
            })}
          </select>
        )}
        <h3>Napisz treść zawartości</h3>
        {data.type === "kategoria" ? (
          <p>Jeśli to kategoria nie możesz dodać zawartości</p>
        ) : (
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
              setData({ ...data, type: e });
            }}
            value={data.type}
          />
        )}

        <input
          type={"submit"}
          value={"+ Edytuj poziom 1"}
          onClick={editMenuFunction}
        />
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
  );
}
