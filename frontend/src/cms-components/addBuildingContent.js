import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { url } from "../App";

export default function AddBuildinContent() {
  const location = useLocation();
  const [buildingsList, setBuildingsList] = useState([]);
  const [iconsList, setIconsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    link: "",
    contents: "",
    which: "",
    img: "",
    type: "kafel",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    new Promise((resolve, reject) => {
      axios.get(`${url}/getallbuildings`).then((res) => {
        setBuildingsList(res.data.buildings);
        resolve();
      });
    }).then((response) => {
      axios.get(`${url}/getphotosbuilding`).then((res) => {
        setIconsList(res.data.photos);
        setData({ ...data, img: res.data.photos[0].namePhoto });
        setLoading(false);
      });
    });
  }, [location]);

  const addBuildingContentFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/addbuilding`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res) {
          // window.location.reload();
          if (res.data.error) {
            setMsg(res.data.error);
          } else {
            setMsg(res.data.message);
          }
        }
      });
  };

  return (
    <div className="add-news-panel">
      <form>
        <h1>Dodaj kafel w budynku</h1>
        <h3>Podaj nazwę kafla</h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
        <h3>
          Czy ma być odnośnikiem do innej strony? Jeśli tak wklej link tutaj
        </h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, link: e.target.value });
          }}
        />
        <h3>Czy ma być odnośnikiem do pobrania</h3>
        <input
          type="checkbox"
          name="download"
          onChange={(e) => {
            setData({ ...data, type: e.target.checked ? "download" : "kafel" });
          }}
        />
        <h3>Wybierz do jakiego budynku chcesz dodać kafel</h3>
        {loading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <select
            onChange={(e) => {
              setData({ ...data, which: e.target.value });
            }}
          >
            {buildingsList.map((building, key) => {
              return (
                <option key={key} value={building.which}>
                  {building.name}
                </option>
              );
            })}
          </select>
        )}
        <h3>Wybierz ikonę kafla</h3>
        {loading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <select
            onChange={(e) => {
              setData({ ...data, img: e.target.value });
            }}
          >
            {iconsList.map((icon, key) => {
              return (
                <option value={icon.namePhoto} key={key}>
                  {icon.namePhoto}
                </option>
              );
            })}
          </select>
        )}
        <h3>Zawartość kafla (opcjonalne)</h3>
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
            setData({ ...data, contents: e });
          }}
        />
        <div className="add-news-panel-btn-cnt">
          <input
            type={"submit"}
            value={"+ Zapisz"}
            onClick={addBuildingContentFunction}
          />
        </div>
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
