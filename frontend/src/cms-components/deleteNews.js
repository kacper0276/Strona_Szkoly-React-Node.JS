import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import EditNews from "./editNews";
import LoginContext from "../context/LoginContext";

export default function DeleteNews() {
  const location = useLocation();
  const context = useContext(LoginContext);
  const [buildingsList, setBuildingsList] = useState([]);
  const [actualBuilding, setActualBuilding] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loadingBuilding, setLoadingBuilding] = useState(true);

  async function fetchNews(building) {
    // axios.get(`${url}/getarticle`).then((res) => {
    //   setData(res.data.data);
    //   setLoading(false);
    // });
    if (actualBuilding == "wszystkie") {
      axios.get(`${url}/getarticle`).then((res) => {
        setData(res.data.data);
        setLoading(false);
      });
    } else {
      axios
        .get(`${url}/getarticlefrombuilding/${actualBuilding}`)
        .then((res) => {
          if (res.data.data) {
            setData(res.data.data);
            setLoading(false);
          }
        });
    }
  }

  async function fetchBuildings() {
    axios.get(`${url}/getallbuildings`).then((res) => {
      setBuildingsList(res.data.buildings);
      setActualBuilding("");
      setLoadingBuilding(false);
    });
  }

  const deleteNews = async (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deletearticle/${id}`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          setMsg(res.data.message);
        }
        fetchNews();
      });
  };

  useEffect(() => {
    fetchBuildings();
  }, [location]);

  useEffect(() => {
    if (actualBuilding != "" || typeof actualBuilding != undefined) {
      fetchNews(actualBuilding);
    }
  }, [actualBuilding]);

  return (
    <>
      {editShow ? (
        <EditNews id={editId} changeVisibility={setEditShow} />
      ) : (
        <div className="add-news-panel">
          {loadingBuilding ? (
            <p>Ładowanie danych</p>
          ) : (
            <select
              onChange={(e) => {
                setActualBuilding(e.target.value);
              }}
            >
              <option value={"BRAK"}>Wybierz opcję</option>
              {buildingsList.map((building, key) => {
                if (
                  context.state.userStatus.includes(`${building.which}news`) ||
                  context.state.userStatus.includes("newsall") ||
                  context.state.userStatus.includes("admin")
                ) {
                  return (
                    <option key={key} value={building.which}>
                      {building.name}
                    </option>
                  );
                }
              })}
              {context.state.userStatus.includes("admin") ||
              context.state.userStatus.includes("newsall") ||
              context.state.userStatus.includes("newssport") ? (
                <option value={"sport"}>Sport</option>
              ) : null}
              {context.state.userStatus.includes("admin") ||
              context.state.userStatus.includes("newsall") ||
              context.state.userStatus.includes("newsmain") ? (
                <option value={"glowna"}>Główna strona</option>
              ) : null}
              {context.state.userStatus.includes("admin") ||
              context.state.userStatus.includes("newsall") ? (
                <option value={"wszystkie"}>Wszystkie</option>
              ) : null}
            </select>
          )}
          <form encType="multipart/form-data">
            {loading ? (
              <p>Wybierz opcję</p>
            ) : (
              <table>
                <thead>
                  <tr style={{ fontSize: "23px" }}>
                    <th>ID:</th>
                    <th>Nazwa</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((news, key) => {
                    return (
                      <tr key={key}>
                        <td>{news.id}</td>
                        <td>{news.title}</td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Na pewno chcesz usunąć ten rekord?"
                                )
                              ) {
                                deleteNews(e, news.id);
                              }
                            }}
                          >
                            - Usuń Aktualność
                          </button>
                        </td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              setEditId(news.id);
                              setEditShow(true);
                            }}
                          >
                            - Edytuj Aktualność
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
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
      )}
    </>
  );
}
