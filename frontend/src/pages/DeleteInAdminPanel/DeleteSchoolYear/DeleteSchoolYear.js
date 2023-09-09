import axios from "axios";
import styles from "./DeleteSchoolYear.module.css";
import { useEffect, useRef, useState } from "react";
import { url } from "../../../App";

export default function DeleteSchoolYear() {
  const [deleteAlbumData, setDeleteAlbumData] = useState({
    name: "",
    schoolYearId: null,
    photo: null,
  });
  const [miniImg, setMiniImg] = useState("");
  const [firstLog, setFirstLog] = useState(true);
  const select = useRef();

  async function deleteFunction(e) {
    e.preventDefault();

    axios
      .post(`${url}/deleteyear/${deleteAlbumData.schoolYearId}`)
      .then((res) => {
        console.log(res);
        if (res.data.msg) {
          window.location.reload();
        }
      });
  }

  async function editFunction(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", deleteAlbumData.name);
    data.append("image", deleteAlbumData.photo);

    axios
      .post(`${url}/updateYear/${deleteAlbumData.schoolYearId}`, data)
      .then((res) => {
        window.location.reload();
      });
  }

  async function getAllYears(type) {
    const option = document.createElement("option");
    option.innerText = `Wybierz rok szkolny`;
    select.current.append(option);
    axios.get(`${url}/rokszkolny`).then((res) => {
      res.data.years.forEach((el) => {
        const option = document.createElement("option");
        option.setAttribute("value", el.id);
        option.innerText = `${el.rok_szkolny}`;

        select.current.append(option);
      });
    });
  }

  useEffect(() => {
    getAllYears(0);
  }, []);

  useEffect(() => {
    if (deleteAlbumData.schoolYearId != null) {
      axios
        .get(`${url}/getimgalbum/${deleteAlbumData.schoolYearId}`)
        .then((res) => {
          setMiniImg(res.data.dataMiniImg[0].photo);
          if (firstLog) {
            setDeleteAlbumData({
              ...deleteAlbumData,
              name: res.data.dataMiniImg[0].rok_szkolny,
            });
            setFirstLog(false);
          }
        });
    }
  }, [deleteAlbumData]);

  return (
    <div className={`${styles.main_container}`}>
      <select
        className={`${styles.select_style}`}
        onChange={(e) => {
          setDeleteAlbumData({
            ...deleteAlbumData,
            schoolYearId: e.target.value,
          });
        }}
        ref={select}
      ></select>
      {miniImg ? (
        <>
          <div className={`${styles.mini_img}`}>
            {miniImg ? <img src={`/schoolYear/${miniImg}`} /> : null}
          </div>
          <div className={`${styles.buttons}`}>
            <input
              type="text"
              defaultValue={deleteAlbumData.name}
              onChange={(e) => {
                setDeleteAlbumData({
                  ...deleteAlbumData,
                  name: e.target.value,
                });
              }}
            />
            <input
              type="file"
              className={`${styles.input_file}`}
              onChange={(e) => {
                setDeleteAlbumData({
                  ...deleteAlbumData,
                  photo: e.target.files[0],
                });
              }}
            />
          </div>
          <div className={`${styles.buttons}`}>
            <button className={`${styles.button_style}`} onClick={editFunction}>
              Edytuj
            </button>
            <button
              className={`${styles.button_style}`}
              onClick={deleteFunction}
            >
              Usuń
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
