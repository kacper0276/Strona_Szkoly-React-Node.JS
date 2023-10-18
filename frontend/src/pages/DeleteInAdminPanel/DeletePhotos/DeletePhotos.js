import styles from "./DeletePhotos.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SliderAdminPanel from "../../../Layout/UI/SliderAdminPanel/SliderAdminPanel";
import { url } from "../../../App";

export default function DeletePhotos() {
  const [schoolYearList, setSchoolYearList] = useState();
  const [albumEditData, setAlbumEditData] = useState({
    name: "",
    schoolYear: "",
    photos: null,
  });
  const [actualPhoto, setActualPhoto] = useState("");
  const selectYearAlbum = useRef();
  const selectNameAlbum = useRef();

  async function fetchSchoolYear() {
    axios.get(`${url}/rokszkolny`).then((res) => {
      res.data.years.forEach((el) => {
        const option = document.createElement("option");
        option.setAttribute("value", el.rok_szkolny);
        option.innerText = `${el.rok_szkolny}`;
        selectYearAlbum.current.append(option);
      });
    });
  }

  async function fetchAlbumInSchoolYear() {
    if (schoolYearList != "") {
      axios.get(`${url}/albumy/${schoolYearList}`).then((res) => {
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
            // if (index == 0) {
            //   albumEditData.name = el.name;
            // }
            const option = document.createElement("option");
            option.setAttribute("value", el.name);
            option.innerText = `${el.name}`;
            selectNameAlbum.current.append(option);
          });
        }
      });
    }
  }

  async function fetchDetailsSelectedAlbum() {
    if (albumEditData.name != "") {
      axios
        .get(`${url}/zdjeciazalbumu/${schoolYearList}/${albumEditData.name}`)
        .then((res) => {
          if (res.data.photos.length) {
            setAlbumEditData({
              ...albumEditData,
              photos: JSON.parse(res.data.photos[0].name_photo),
            });
          }
        });
    }
  }

  async function deleteImage() {
    axios
      .get(`${url}/deleteimg/${actualPhoto}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.msg) {
          window.location.reload();
        }
      });
  }

  async function editImage(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", albumEditData.name);
    data.append("schoolYear", albumEditData.schoolYear);

    for (const key of Object.keys(albumEditData.photos)) {
      data.append("images", albumEditData.photos[key]);
    }

    axios
      .post(`${url}/editphotosinalbum`, data, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.msg) {
          window.location.reload();
        }
      });
  }

  useEffect(() => {
    var option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    selectYearAlbum.current.append(option);
    fetchSchoolYear();
  }, []);

  useEffect(() => {
    fetchAlbumInSchoolYear();
  }, [schoolYearList]);

  useEffect(() => {
    fetchDetailsSelectedAlbum();
  }, [albumEditData.name]);

  return (
    <div className={`${styles.main_container}`}>
      <div className={`${styles.select_container}`}>
        <select
          ref={selectYearAlbum}
          onChange={(e) => {
            setSchoolYearList(e.target.value);
            setAlbumEditData({ ...albumEditData, schoolYear: e.target.value });
          }}
          className={`${styles.select_style}`}
        ></select>
        <select
          ref={selectNameAlbum}
          onChange={(e) => {
            setAlbumEditData({ ...albumEditData, name: e.target.value });
          }}
          className={`${styles.select_style}`}
        ></select>
      </div>
      {albumEditData.name != "" ? (
        <div className={`${styles.other_buttons}`}>
          {albumEditData.photos != null ? (
            <div className={`${styles.slider}`}>
              <SliderAdminPanel
                img={albumEditData.photos}
                setActualPhoto={setActualPhoto}
              />
            </div>
          ) : (
            <p
              style={{
                color: "white",
                marginTop: "50px",
              }}
            >
              Brak zdjęć w albumie
            </p>
          )}
          <div className={`${styles.input}`}>
            <input
              type="file"
              className={`${styles.input_file}`}
              multiple
              onChange={(e) => {
                setAlbumEditData({
                  ...albumEditData,
                  photos: e.target.files,
                });
              }}
            />
          </div>
          <div className={`${styles.buttons}`}>
            <button className={`${styles.button_style}`} onClick={editImage}>
              Edytuj (Dodaj nowe zdjęcia)
            </button>
            <button className={`${styles.button_style}`} onClick={deleteImage}>
              Usuń
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
