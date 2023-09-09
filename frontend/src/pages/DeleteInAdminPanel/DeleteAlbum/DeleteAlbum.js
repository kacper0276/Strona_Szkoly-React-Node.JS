import styles from "./DeleteAlbum.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { url } from "../../../App";

export default function DeleteAlbum() {
  const [schoolYearList, setSchoolYearList] = useState();
  const [albumEditData, setAlbumEditData] = useState({
    name: "",
    schoolYear: "",
    photo: null,
    newImage: null,
    id: null,
  });
  const selectYearAlbum = useRef();
  const selectYearAlbumEditImg = useRef();
  const selectNameAlbum = useRef();

  async function fetchSchoolYear() {
    axios.get(`${url}/rokszkolny`).then((res) => {
      res.data.years.forEach((el) => {
        var option = document.createElement("option");
        option.setAttribute("value", el.rok_szkolny);
        option.innerText = `${el.rok_szkolny}`;
        selectYearAlbum.current.append(option);
        var option = document.createElement("option");
        option.setAttribute("value", el.rok_szkolny);
        option.innerText = `${el.rok_szkolny}`;
        selectYearAlbumEditImg.current.append(option);
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
            option.setAttribute("value", el.id);
            option.innerText = `${el.name}`;
            selectNameAlbum.current.append(option);
          });
        }
      });
    }
  }

  async function fetchDetailsSelectedAlbum() {
    if (albumEditData.id != null) {
      axios
        .get(`${url}/albumy/${schoolYearList}/${albumEditData.id}`)
        .then((res) => {
          console.log(res);
          setAlbumEditData({
            ...albumEditData,
            name: res.data.albumData[0].name,
            schoolYear: res.data.albumData[0].years,
            photo: res.data.albumData[0].mini,
          });
        });
    }
  }

  async function deleteAlbum() {
    axios.get(`${url}/deletealbum/${albumEditData.id}`).then((res) => {
      if (res.data.msg) {
        window.location.reload();
      }
    });
  }

  async function editAlbum(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", albumEditData.name);
    data.append("image", albumEditData.newImage);
    data.append("schoolYear", albumEditData.schoolYear);

    axios.post(`${url}/editalbum/${albumEditData.id}`, data).then((res) => {
      if (res.data.msg) {
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    var option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    selectYearAlbum.current.append(option);
    var option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    selectYearAlbumEditImg.current.append(option);

    fetchSchoolYear();
  }, []);

  useEffect(() => {
    fetchAlbumInSchoolYear();
  }, [schoolYearList]);

  useEffect(() => {
    fetchDetailsSelectedAlbum();
  }, [albumEditData.id]);

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
            setAlbumEditData({ ...albumEditData, id: e.target.value });
          }}
          className={`${styles.select_style}`}
        ></select>
      </div>
      <div
        className={`${styles.other_buttons}`}
        style={{ display: albumEditData.id ? "block" : "none" }}
      >
        <img src={`/album/${albumEditData.photo}`} />
        <div className={`${styles.input_mobile}`}>
          <input
            type="text"
            defaultValue={albumEditData.name}
            onChange={(e) => {
              setAlbumEditData({ ...albumEditData, name: e.target.value });
            }}
          />
          <input
            type="file"
            className={`${styles.input_file}`}
            onChange={(e) => {
              setAlbumEditData({
                ...albumEditData,
                newImage: e.target.files[0],
              });
            }}
          />
          <select
            ref={selectYearAlbumEditImg}
            onChange={(e) => {
              setAlbumEditData({
                ...albumEditData,
                schoolYear: e.target.value,
              });
            }}
            className={`${styles.select_style}`}
            style={{
              width: "25%",
            }}
          ></select>
        </div>
        <div className={`${styles.buttons}`}>
          <button className={`${styles.button_style}`} onClick={editAlbum}>
            Edytuj
          </button>
          <button className={`${styles.button_style}`} onClick={deleteAlbum}>
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
