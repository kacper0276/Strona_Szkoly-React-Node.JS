import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

export default function AddMenu() {
  const location = useLocation();
  const [data, setData] = useState({
    name: "",
    type: "",
    which: "",
    category: "",
  });
  const [menuLvl1, setMenuLvl1] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [msg, setMsg] = useState("");

  async function getMenuLvl1() {
    axios.get(`${url}/getlvl1`).then((res) => {
      setMenuLvl1(res.data.menu);
      setLoading(false);
    });
  }

  async function getCategory() {
    axios.get(`${url}/getcategory/${data.which}`).then((res) => {
      setCategory(res.data.category);
      setLoadingCategory(false);
    });
  }

  useEffect(() => {
    getMenuLvl1();
  }, [location]);

  useEffect(() => {
    if (data.which != "") {
      getCategory();
      setData({ ...data, category: "" });
    }
  }, [data.which]);

  const addMenuFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/addcolormenu`, data, {
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
      });
  };

  return (
    <div className="add-news-panel">
      <form>
        <h1>Dodaj Zawartość W Menu</h1>
        <h3>Nazwa:</h3>
        <input
          type={"text"}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
        <h3>Czy jest to kategoria</h3>
        <input
          type="checkbox"
          name="checked"
          onChange={(e) => {
            setData({ ...data, type: e.target.checked ? "kategoria" : "" });
          }}
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
                <option key={key} value={menuElement.nazwa}>
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
                <option key={key} value={categoryEl.nazwa}>
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
          />
        )}

        <input
          type={"submit"}
          value={"+ Dodaj Element Menu"}
          onClick={addMenuFunction}
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
