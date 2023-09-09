import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

export default function EditNews(props) {
  const location = useLocation();
  const [data, setData] = useState({
    title: "",
    shortDes: "",
    longDes: "",
    alt: "",
    date: "",
    image: [],
    keyword: "",
    buildings: [],
  });
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [loadingActualData, setLoadingActualData] = useState(true);

  const fetchBuildings = async () => {
    axios.get(`${url}/buildinglist`).then((res) => {
      setBuildings(res.data.buildings);
      setLoading(false);
    });
  };

  const fetchActualData = async () => {
    axios.get(`${url}/getdetailstoeditarticle/${props.id}`).then((res) => {
      setData({
        title: res.data.actualData[0].title,
        shortDes: res.data.actualData[0].shortdes,
        longDes: res.data.actualData[0].longdes,
        alt: res.data.actualData[0].alt,
        date: res.data.actualData[0].date,
        keyword: res.data.actualData[0].keyword,
        buildings: res.data.actualData[0].includes,
      });
      setLoadingActualData(false);
    });
  };

  const handleCheck = (e) => {
    let updatedList = [...data.buildings];
    if (e.target.checked) {
      updatedList = [...data.buildings, e.target.value];
    } else {
      updatedList.splice(data.buildings.indexOf(e.target.value, 1));
    }

    setData({ ...data, buildings: updatedList });
  };

  useEffect(() => {
    fetchBuildings();
    fetchActualData();
  }, [location]);

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("short", data.shortDes);
    formData.append("long", data.longDes);
    formData.append("alt", data.alt);
    formData.append("date", data.date);
    formData.append("keyword", data.keyword);
    formData.append("buildings", data.buildings);

    if (data.image) {
      for (const key of Object.keys(data.image)) {
        formData.append("images", data.image[key]);
      }
    }

    await axios
      .post(`${url}/editarticle/${props.id}`, formData, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setMessage(res.data.error);
        } else {
          setMessage(res.data.message);
        }
      });
  };

  return (
    <div className="add-news-panel other-than-news">
      <button
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          props.changeVisibility(false);
        }}
      >
        Powrót do poprzedniej strony (Zmiany nie zostaną zapisane)
      </button>
      {loadingActualData ? (
        <p>Ładowanie danych</p>
      ) : (
        <form encType="multipart/form-data">
          <h1>Dodaj aktualność</h1>
          <h3>Tytuł:</h3>
          <input
            value={data.title}
            type={"text"}
            onChange={(e) => {
              setData({ ...data, title: e.target.value });
            }}
          />
          <h3>Data:</h3>
          <input
            value={data.date}
            type="date"
            onChange={(e) => {
              setData({ ...data, date: e.target.value });
            }}
          />
          <h3>Kluczowe słowa do wyszukiwania: </h3>
          <input
            value={data.keyword}
            type="text"
            onChange={(e) => {
              setData({ ...data, keyword: e.target.value });
            }}
          />
          <h3>Alternatywne zdanie do zdjęcia: </h3>
          <input
            value={data.alt}
            type="text"
            onChange={(e) => {
              setData({ ...data, alt: e.target.value });
            }}
          />
          <h3>Budynki: </h3>
          <div className="buildings-div">
            {loading ? (
              <p>Ładowanie</p>
            ) : (
              <>
                <input
                  type="checkbox"
                  id={"glowna"}
                  value={"glowna"}
                  onChange={handleCheck}
                />
                <label htmlFor={"glowna"}>Główny panel</label>
                {buildings.map((building) => {
                  return [
                    <input
                      type="checkbox"
                      id={building.name}
                      value={building.name}
                      onChange={handleCheck}
                    />,
                    <label htmlFor={building.name}>{building.name}</label>,
                  ];
                })}
                <input
                  type="checkbox"
                  id={"sport"}
                  value={"sport"}
                  onChange={handleCheck}
                />
                <label htmlFor={"sport"}>Sport</label>
              </>
            )}
          </div>
          <h3>Krótki opis:</h3>
          <textarea
            rows={"3"}
            onChange={(e) => {
              setData({ ...data, shortDes: e.target.value });
            }}
            defaultValue={data.shortDes}
          ></textarea>
          <h3>Długi opis</h3>
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
            value={data.longDes}
            onEditorChange={(e) => {
              setData({ ...data, longDes: e });
            }}
          />
          <div className="add-news-panel-btn-cnt">
            <input
              type={"file"}
              placeholder={"Wybierz zdjęcie"}
              multiple
              onChange={(e) => {
                setData({ ...data, image: e.target.files });
              }}
            />
            <input type={"submit"} value={"+ Zapisz"} onClick={submit} />
          </div>
        </form>
      )}
      {message ? (
        <div className="msg-div" style={{ width: "200px", height: "250px" }}>
          <div className="button-close" onClick={(e) => setMessage("")}>
            <span></span>
            <span></span>
          </div>
          {message}
        </div>
      ) : null}
    </div>
  );
}
