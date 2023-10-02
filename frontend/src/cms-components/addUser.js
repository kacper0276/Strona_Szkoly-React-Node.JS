import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";
import EditUser from "./editUser";

const AddUser = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [loading, setLoadnig] = useState(true);
  const [loadingClass, setLoadingClass] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [newSequence, setNewSequence] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editId, setEditId] = useState(null);
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
      console.log(res.data.buildings);
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

  async function fetchUsers() {
    axios.get(`${url}/allusers`).then((res) => {
      setUsersList(res.data.data);
    });
    setLoadnig(false);
  }

  useEffect(() => {
    fetchUsers();
  }, [location]);

  useEffect(() => {
    fetchUsers();
  }, [editShow]);

  useEffect(() => {
    fetchBuildings();
  }, []);

  function handleChange(selectedOption) {
    setNewSequence(selectedOption);
  }

  const createUser = (e) => {
    e.preventDefault();
    const pass1 = document.querySelector("#primPass").value;
    const pass2 = document.querySelector("#secPass").value;
    const userName = document.querySelector("#usrName").value;
    const classUser = newSequence;

    if (pass1 !== pass2) {
      setMessage("Hasła nie są takie same.");
    } else if (pass1 == "" || pass2 == "" || userName == "") {
      setMessage("Żadne z pól nie może być puste.");
    } else {
      axios
        .post(
          `${url}/adduser`,
          {
            login: userName,
            password: pass1,
            sec_password: pass2,
            classUser: classUser,
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
            fetchUsers();
          }
        });
    }
  };

  const delUser = (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deluser/${id}`,
        {},
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
        fetchUsers();
      });
  };

  return (
    <>
      {editShow ? (
        <EditUser id={editId} changeVisibility={setEditShow} />
      ) : (
        <div className="add-news-panel">
          <form
            onSubmit={(e) => {
              createUser(e);
            }}
          >
            <h1>Dodaj Użytkownika</h1>
            <h3>Nazwa użytkownika:</h3>
            <input type={"text"} id="usrName" required />
            <h3>Hasło:</h3>
            <input type={"password"} id="primPass" required />
            <h3>Potwierdź hasło:</h3>
            <input type={"password"} id="secPass" required />
            <h3>Klasa użytkownika:</h3>
            {loadingClass ? (
              <p>Ładowanie klass</p>
            ) : (
              <Select
                isMulti
                options={clasesUser}
                onChange={handleChange}
                styles={customStyles}
              />
            )}
            <input type={"submit"} value={"+ Dodaj użytkownika"} />
          </form>
          <form
            onSubmit={(e) => {
              delUser(e);
            }}
          >
            <h1>Usuń Użytkownika</h1>
            {loading ? (
              <p>Ładowanie danych...</p>
            ) : (
              <>
                <table
                  style={{
                    border: "1px solid black",
                  }}
                >
                  <thead>
                    <tr>
                      <td>ID</td>
                      <td>Nazwa użytkownika</td>
                      <td>Klasy użytkownika</td>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, key) => {
                      return (
                        <tr key={key}>
                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            {user.id}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            {user.login}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                            }}
                          >
                            {user.klasa}
                          </td>
                          <td>
                            <button
                              className="footer-delete-button"
                              onClick={(e) => {
                                if (
                                  window.confirm(
                                    "Na pewno chcesz usunąć ten rekord?"
                                  )
                                ) {
                                  delUser(e, user.id);
                                }
                              }}
                            >
                              - Usuń Użytkownika
                            </button>
                          </td>
                          <td>
                            <button
                              className="footer-delete-button"
                              onClick={(e) => {
                                setEditId(user.id);
                                setEditShow(true);
                              }}
                            >
                              - Edytuj Użytkownika
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
      )}
    </>
  );
};

export default AddUser;
