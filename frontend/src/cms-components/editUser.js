import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { url } from "../App";
import { useLocation } from "react-router-dom";

export default function EditUser(props) {
  const location = useLocation();
  const [loadingClass, setLoadingClass] = useState(true);
  const [clasesUser, setClasesUser] = useState([
    {
      value: "admin",
      label: "admin",
    },
    {
      value: "newsall",
      label: "Aktualności",
    },
    {
      value: "menu",
      label: "Zarządzanie menu",
    },
    {
      value: "footer",
      label: "Zarządzanie stopką",
    },
    {
      value: "building",
      label: "Zarządzanie budynek",
    },
    {
      value: "kafleall",
      label: "Kafle w budynku",
    },
    {
      value: "sequence",
      label: "Kolejność",
    },
    {
      value: "mainCount",
      label: "Liczba artykułów na stronie głównej",
    },
    {
      value: "contact",
      label: "Kontakt",
    },
    {
      value: "galeria",
      label: "Galeria",
    },
    {
      value: "newssport",
      label: "Sport - Aktualności",
    },
    {
      value: "newsmain",
      label: "Główna - Aktualności",
    },
  ]);

  const customStyles = {
    menu: (css) => ({
      ...css,
      width: "500px",
    }),
    control: (css) => ({ ...css, display: "inline-flex " }),
    valueContainer: (css) => ({
      ...css,
    }),
  };

  async function fetchBuildings() {
    axios.get(`${url}/getallbuildings`).then((res) => {
      res.data.buildings.forEach((building) => {
        if (
          building.name.toLowerCase().replace(/\s+/g, "") == "szkołabranżowai"
        ) {
          var obj = {
            value: `szkołabranżowanews`,
            label: `${building.name} - Aktualności`,
          };
          var obj1 = {
            value: `szkołabranżowakafle`,
            label: `${building.name} - Kafle`,
          };
        } else {
          var obj = {
            value: `${building.name.toLowerCase().replace(/\s+/g, "")}news`,
            label: `${building.name} - Aktualności`,
          };
          var obj1 = {
            value: `${building.name.toLowerCase().replace(/\s+/g, "")}kafle`,
            label: `${building.name} - Kafle`,
          };
        }

        let arr = clasesUser;
        arr.push(obj);
        arr.push(obj1);
        setClasesUser(arr);
      });
      setLoadingClass(false);
    });
  }
  const [newSequence, setNewSequence] = useState("");
  const [message, setMessage] = useState("");
  const [loadingActualData, setLoadingActualData] = useState(true);
  const [data, setData] = useState({
    login: "",
  });

  function handleChange(selectedOption) {
    setNewSequence(selectedOption);
  }

  const editUser = (e) => {
    e.preventDefault();
    const pass1 = document.querySelector("#primPass").value;
    const pass2 = document.querySelector("#secPass").value;
    const userName = document.querySelector("#usrName").value;
    const classUser = newSequence;

    if (pass1 !== pass2) {
      setMessage("Hasła nie są takie same.");
    } else {
      axios
        .post(
          `${url}/edituser/${props.id}`,
          {
            login: userName,
            password: pass1,
            sec_password: pass2,
            classUser: classUser,
            id: props.id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            setMessage(response.data.error);
          } else {
            setMessage(response.data.message);
          }
        });
    }
  };

  const fetchActualData = async () => {
    axios
      .get(`${url}/getdetailsuser/${props.id}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setData({
          login: res.data.actualData[0].login,
        });
        setLoadingActualData(false);
      });
  };

  useEffect(() => {
    fetchActualData();
  }, [location]);

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <div className="add-news-panel">
      <button
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          props.changeVisibility(false);
        }}
      >
        Powrót do poprzedniej strony (Zmiany nie zostaną zapisane)
      </button>
      <form
        onSubmit={(e) => {
          editUser(e);
        }}
      >
        <h1>
          Edytuj Użytkownika (Jeśli nie zmieniasz jakiegoś pola zostaw to pole
          puste)
        </h1>
        {loadingActualData ? (
          <p>Ładowanie danych</p>
        ) : (
          <>
            <h3>Nazwa użytkownika:</h3>
            <input type={"text"} id="usrName" defaultValue={data.login} />
            <h3>Hasło:</h3>
            <input type={"password"} id="primPass" />
            <h3>Potwierdź hasło:</h3>
            <input type={"password"} id="secPass" />
            <h3>Klasa użytkownika:</h3>
            {loadingClass ? (
              <p>Ładowanie danych</p>
            ) : (
              <Select
                isMulti
                options={clasesUser}
                onChange={handleChange}
                styles={customStyles}
              />
            )}
            <input type={"submit"} value={"+ Edytuj użytkownika"} />
          </>
        )}
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
}
