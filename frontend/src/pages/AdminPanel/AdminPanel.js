import { useContext, useEffect, useRef, useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import styles from "./AdminPanel.module.css";
import axios from "axios";
import DeleteInAdminPanel from "../DeleteInAdminPanel/DeleteInAdminPanel";
import { url } from "../../App";
import LoginContext from "../../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import { getImageSize } from "react-image-size";
// import resizeImage from "../../functions/resizeImage";

export default function AdminPanel() {
  useWebsiteTitle("CKZiU | Panel administratora");
  const navigate = useNavigate();
  const select = useRef();
  const selectYearAlbum = useRef();
  const selectNameAlbum = useRef();
  const context = useContext(LoginContext);
  const [newSchoolYearData, setNewSchoolYearData] = useState({
    name: "",
    photo: null,
  });
  const [newAlbumData, setNewAlbumData] = useState({
    name: "",
    schoolYear: "",
    photo: null,
  });
  const [newPhotosInAlbum, setNewPhotosInAlbum] = useState({
    schoolYear: "",
    album: "",
    photos: [],
  });
  const [msg, setMsg] = useState("");

  async function resizeImage(imageFile) {
    let arr = [];

    // console.log(imageFile.length);

    // for (let i = 0; i < imageFile.length; i++) {
    //   var _URL = window.URL || window.webkitURL;
    //   const image = new Image();
    //   var objectUrl = _URL.createObjectURL(imageFile[i]);
    //   image.onload = function () {
    //     console.log(this.width);
    //     console.log(this.height);
    //     var obj = { width: this.width, height: this.height };
    //     console.log(obj);
    //     _URL.revokeObjectURL(objectUrl);
    //   };
    // }

    // for (let i = 0; i < imageFile.length; i++) {
    //   const dimensions = getImageSize(imageFile[i]);
    //   console.log(dimensions);

    //   try {
    //     Resizer.imageFileResizer(
    //       imageFile,
    //       height * 0.7,
    //       width * 0.7,
    //       "JPEG",
    //       75,
    //       0,
    //       (newImg) => {
    //         console.log(newImg);
    //         arr.push(newImg);
    //       },
    //       "base64",
    //       400,
    //       500
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    setNewPhotosInAlbum({
      ...newPhotosInAlbum,
      photos: arr,
    });
  }

  async function getAllYears(type) {
    axios.get(`${url}/rokszkolny`).then((res) => {
      res.data.years.forEach((el) => {
        const option = document.createElement("option");
        option.setAttribute("value", el.rok_szkolny);
        option.innerText = `${el.rok_szkolny}`;
        type
          ? selectYearAlbum.current.append(option)
          : select.current.append(option);
      });
    });
  }

  async function getAllAlbumsInYear() {
    if (newPhotosInAlbum.schoolYear != "") {
      axios.get(`${url}/albumy/${newPhotosInAlbum.schoolYear}`).then((res) => {
        // Delete previous options
        var i,
          L = selectNameAlbum.current.options.length - 1;
        for (i = L; i >= 0; i--) {
          selectNameAlbum.current.remove(i);
        }

        // If not exist albums
        if (res.data.albums.length == 0) {
          const option = document.createElement("option");
          option.innerText = `Brak albumów`;
          selectNameAlbum.current.append(option);
        } else {
          const option = document.createElement("option");
          option.setAttribute("value", "");
          option.innerText = `Wybierz album`;
          selectNameAlbum.current.append(option);
          res.data.albums.forEach((el, index) => {
            if (index == 0) {
              newPhotosInAlbum.album = el.name;
            }
            const option = document.createElement("option");
            option.setAttribute("value", el.name);
            option.innerText = `${el.name}`;
            selectNameAlbum.current.append(option);
          });
        }
      });
    }
  }

  useEffect(() => {
    var option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    selectYearAlbum.current.append(option);
    var option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    select.current.append(option);
    getAllYears(0);
    getAllYears(1);
  }, []);

  useEffect(() => {
    getAllAlbumsInYear();
  }, [newPhotosInAlbum.schoolYear]);

  const addSchoolYear = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", newSchoolYearData.name);
    data.append("image", newSchoolYearData.photo);

    axios
      .post(`${url}/stworzrokszkolny`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        getAllYears(0);
        getAllYears(1);
        setMsg(res.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const addAlbum = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", newAlbumData.name);
    data.append("year", newAlbumData.schoolYear);
    data.append("image", newAlbumData.photo);

    axios
      .post(`${url}/stworzalbum`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        getAllYears();
        setMsg(res.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const addPhotos = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("year", newPhotosInAlbum.schoolYear);
    data.append("album", newPhotosInAlbum.album);
    // resizeImage(newPhotosInAlbum.photos);
    for (const key of Object.keys(newPhotosInAlbum.photos)) {
      data.append("images", newPhotosInAlbum.photos[key]);
    }

    await axios
      .post(`${url}/dodajzdjecia`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        setMsg(res.data.msg);
        setTimeout(() => {
          // window.location.reload();
        }, 3000);
      });
  };

  return (
    <div className={`${styles.main_container}`}>
      <strong
        style={{ display: "block", marginBottom: "15px", color: "white" }}
      >
        Panel admina
      </strong>
      <div className={`${styles.section_create_school_year}`}>
        <p>Utwórz nowy rok szkolny</p>
        <hr />
        <form>
          <div className={`${styles.div_form}`}>
            <input
              type="text"
              className={`${styles.input_text}`}
              placeholder="Podaj rok szkolny"
              onChange={(e) => {
                setNewSchoolYearData({
                  ...newSchoolYearData,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div className={`${styles.div_form}`}>
            <input
              type="file"
              accept="image/*"
              className={`${styles.input_file}`}
              onChange={(e) => {
                setNewSchoolYearData({
                  ...newSchoolYearData,
                  photo: e.target.files[0],
                });
              }}
            />
          </div>
          <button className={`${styles.button_style}`} onClick={addSchoolYear}>
            Dodaj rok szkolny
          </button>
        </form>
      </div>
      <div className={`${styles.section_create_album}`}>
        <p>Utwórz nowy album w roku szkolnym</p>
        <hr />
        <form>
          <div className={`${styles.div_form}`}>
            <input
              type="text"
              className={`${styles.input_text}`}
              placeholder="Podaj nazwę albumu"
              onChange={(e) => {
                setNewAlbumData({ ...newAlbumData, name: e.target.value });
              }}
            />
          </div>
          <div className={`${styles.div_form}`}>
            <select
              className={`${styles.select_style}`}
              onChange={(e) => {
                setNewAlbumData({
                  ...newAlbumData,
                  schoolYear: e.target.value,
                });
              }}
              ref={select}
            ></select>
          </div>
          <div className={`${styles.div_form}`}>
            <input
              type="file"
              accept="image/*"
              className={`${styles.input_file}`}
              onChange={(e) => {
                setNewAlbumData({ ...newAlbumData, photo: e.target.files[0] });
              }}
            />
          </div>
          <button className={`${styles.button_style}`} onClick={addAlbum}>
            Dodaj nowy album
          </button>
        </form>
      </div>
      <div className={`${styles.section_add_photo_to_album}`}>
        <p>Dodaj zdjęcia do albumu</p>
        <hr />
        <form encType="multipart/form-data">
          <div className={`${styles.div_form}`}>
            <select
              className={`${styles.select_style}`}
              onChange={(e) => {
                setNewPhotosInAlbum({
                  ...newPhotosInAlbum,
                  schoolYear: e.target.value,
                });
              }}
              ref={selectYearAlbum}
            ></select>
          </div>
          <div className={`${styles.div_form}`}>
            {newPhotosInAlbum.schoolYear ? (
              <select
                className={`${styles.select_style}`}
                onChange={(e) => {
                  setNewPhotosInAlbum({
                    ...newPhotosInAlbum,
                    album: e.target.value,
                  });
                }}
                ref={selectNameAlbum}
              ></select>
            ) : null}
          </div>
          <div className={`${styles.div_form}`}>
            <input
              type="file"
              accept="image/*"
              className={`${styles.input_file}`}
              multiple
              onChange={(e) => {
                console.log(e.target.files);
                setNewPhotosInAlbum({
                  ...newPhotosInAlbum,
                  photos: e.target.files,
                });
              }}
            />
          </div>
          <button className={`${styles.button_style}`} onClick={addPhotos}>
            Dodaj zdjęcia
          </button>
        </form>
      </div>
      {msg ? (
        <div className={`${styles.message_box}`}>
          <div
            className={`${styles.close_icon}`}
            onClick={(e) => {
              setMsg("");
            }}
          >
            <span></span>
            <span></span>
          </div>
          <p>{msg}</p>
        </div>
      ) : null}
      <hr />
      <DeleteInAdminPanel />
    </div>
  );
}
