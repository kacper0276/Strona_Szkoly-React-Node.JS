import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { url } from "../App";
import { Editor } from "@tinymce/tinymce-react";

export default function EditBuildingContent(props) {
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
    id: null,
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    new Promise((resolve, reject) => {
      axios.get(`${url}/getallbuildings`).then((res) => {
        setBuildingsList(res.data.buildings);
        resolve();
      });
    }).then((response) => {
      axios
        .get(`${url}/getphotosbuilding`)
        .then((res) => {
          setIconsList(res.data.photos);
          setData({ ...data, img: res.data.photos[0].namePhoto });
          setLoading(false);
        })
        .then((response) => {
          axios
            .get(`${url}/getdetailskafel/${props.id}`, {
              headers: {
                accessToken: localStorage.getItem("token"),
              },
            })
            .then((res) => {
              setData({
                name: res.data.data[0].name,
                link: res.data.data[0].link,
                contents:
                  res.data.data[0].content == "BRAK"
                    ? ""
                    : res.data.data[0].content,
                which: res.data.data[0].which,
                img: res.data.data[0].img,
                id: res.data.data[0].id,
                type: res.data.data[0].type,
              });
            });
        });
    });
  }, [location]);

  const editBuildingContentFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/editbuilding/${data.id}`, data, {
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
            props.changeVisibility(false);
            props.fetchBuildings();
          }
        }
      });
  };

  return (
    <div className="adduser-panel-cnt">
      <button
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          props.changeVisibility(false);
        }}
      >
        Powrót do poprzedniej strony (Zmiany nie zostaną zapisane)
      </button>
      <form>
        <h1>Dodaj kafel w budynku</h1>
        <h3>Podaj nazwę kafla</h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
          value={data.name}
        />
        <h3>
          Czy ma być odnośnikiem do innej strony? Jeśli tak wklej link tutaj
        </h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, link: e.target.value });
          }}
          value={data.link}
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
              return building.which == data.which ? (
                <option key={key} value={building.which} selected>
                  {building.name}
                </option>
              ) : (
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
              return icon.namePhoto == data.img ? (
                <option value={icon.namePhoto} key={key} selected>
                  {icon.namePhoto}
                </option>
              ) : (
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
          value={data.contents}
          onEditorChange={(e) => {
            setData({ ...data, contents: e });
          }}
        />
        <div className="add-news-panel-btn-cnt">
          <input
            type={"submit"}
            value={"+ Edytuj"}
            onClick={editBuildingContentFunction}
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
