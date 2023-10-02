import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import LoginContext from "../context/LoginContext";

const AddNews = () => {
  const location = useLocation();
  const checkedWszystkie = useRef();
  const context = useContext(LoginContext);
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

  const fetchBuildings = async () => {
    axios.get(`${url}/buildinglist`).then((res) => {
      setBuildings(res.data.buildings);
      setLoading(false);
    });
  };

  const handleCheck = (e) => {
    let updatedList = [...data.buildings];
    if (e.target.checked) {
      updatedList = [...data.buildings, e.target.value];
      if (e.target.value == "glowna") {
        checkedWszystkie.current.checked = false;
        if (updatedList.includes("Wszystkie")) {
          updatedList.splice(
            updatedList.findIndex((i) => "Wszystkie" == i.toString()),
            1
          );
        }
      }
    } else {
      updatedList.splice(
        updatedList.findIndex((i) => e.target.value == i.toString()),
        1
      );
    }

    setData({ ...data, buildings: updatedList });
  };

  useEffect(() => {
    fetchBuildings();
  }, [location]);

  const submit = async (e) => {
    e.preventDefault();

    if (
      !data.buildings.includes("glowna") &&
      !data.buildings.includes("Wszystkie")
    ) {
      data.buildings.push("Wszystkie");
    }

    if (data.title == "" || data.buildings.length == 0) {
      setMessage("Pola nie mogą być puste");
    } else {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("short", data.shortDes);
      formData.append("long", data.longDes);
      formData.append("alt", data.alt);
      formData.append("date", data.date);
      formData.append("keyword", data.keyword);
      formData.append("buildings", data.buildings);

      for (const key of Object.keys(data.image)) {
        formData.append("images", data.image[key]);
      }

      await axios
        .post(`${url}/addarticle`, formData, {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.error) {
            setMessage(res.data.error);
          } else {
            setMessage(res.data.msg);
          }
        });
    }
  };

  return (
    <div className="add-news-panel">
      <form encType="multipart/form-data">
        <h1>Dodaj aktualność</h1>
        <h3>Tytuł:</h3>
        <input
          type={"text"}
          onChange={(e) => {
            setData({ ...data, title: e.target.value });
          }}
        />
        <h3>Data:</h3>
        <input
          type="date"
          onChange={(e) => {
            setData({ ...data, date: e.target.value });
          }}
        />
        <h3>Kluczowe słowa do wyszukiwania: </h3>
        <input
          type="text"
          onChange={(e) => {
            setData({ ...data, keyword: e.target.value });
          }}
        />
        <h3>Alternatywne zdanie do zdjęcia: </h3>
        <input
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
              {context.state.userStatus.includes("admin") ||
              context.state.userStatus.includes("newsall") ||
              context.state.userStatus.includes("newsmain") ? (
                <>
                  <input
                    type="checkbox"
                    id={"glowna"}
                    value={"glowna"}
                    onChange={handleCheck}
                  />
                  <label htmlFor={"glowna"}>Główny panel</label>
                </>
              ) : null}
              {buildings.map((building) => {
                if (
                  context.state.userStatus.includes(`${building.which}news`) ||
                  context.state.userStatus.includes("newsall") ||
                  context.state.userStatus.includes("admin")
                ) {
                  return [
                    <input
                      type="checkbox"
                      ref={
                        building.name == "Wszystkie" ? checkedWszystkie : null
                      }
                      id={building.name}
                      value={building.name}
                      onChange={handleCheck}
                      disabled={
                        building.name == "Wszystkie" &&
                        !data.buildings.includes("glowna")
                      }
                    />,
                    <label htmlFor={building.name}>{building.name}</label>,
                  ];
                }
                if (building.name == "Wszystkie") {
                  return [
                    <input
                      type="checkbox"
                      ref={checkedWszystkie}
                      id={building.name}
                      value={building.name}
                      onChange={handleCheck}
                      disabled={!data.buildings.includes("glowna")}
                    />,
                    <label htmlFor={building.name}>{building.name}</label>,
                  ];
                }
              })}
              {context.state.userStatus.includes("admin") ||
              context.state.userStatus.includes("newsall") ||
              context.state.userStatus.includes("newssport") ? (
                <>
                  <input
                    type="checkbox"
                    id={"sport"}
                    value={"sport"}
                    onChange={handleCheck}
                  />
                  <label htmlFor={"sport"}>Sport</label>
                </>
              ) : null}
            </>
          )}
        </div>
        <h3>Krótki opis:</h3>
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
            setData({ ...data, shortDes: e });
          }}
        />
        <h3>Długi opis</h3>
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
      {message ? (
        <div className="msg-div">
          <div className="button-close" onClick={(e) => setMessage("")}>
            <span></span>
            <span></span>
          </div>
          {message}
        </div>
      ) : null}
    </div>
  );
};
export default AddNews;
