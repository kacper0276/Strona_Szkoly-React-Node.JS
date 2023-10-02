import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { url } from "../App";
import EditBuildingContent from "./editBuildingContent";
import LoginContext from "../context/LoginContext";

export default function DeleteBuildingContent() {
  const location = useLocation();
  const context = useContext(LoginContext);
  const [data, setData] = useState([]);
  const [buildingsList, setBuildingsList] = useState([]);
  const [actualBuilding, setActualBuilding] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBuilding, setLoadingBuilding] = useState(true);
  const [msg, setMsg] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const deleteBuildingContentFunction = (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deletebuildingcontent/${id}`,
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
        fetchData(actualBuilding);
      });
  };

  async function fetchBuildings() {
    axios.get(`${url}/getallbuildings`).then((res) => {
      setBuildingsList(res.data.buildings);
      // setActualBuilding(res.data.buildings[0].which);
      setLoadingBuilding(false);
    });
  }

  async function fetchData(typeBuilding) {
    axios.get(`${url}/getdetailsbuilding/${typeBuilding}`).then((res) => {
      setData(res.data.buildings);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchBuildings();
  }, [location]);

  useEffect(() => {
    if (actualBuilding !== "") {
      fetchData(actualBuilding);
    }
  }, [actualBuilding]);

  return (
    <>
      {editShow ? (
        <EditBuildingContent
          id={editId}
          changeVisibility={setEditShow}
          fetchBuildings={fetchBuildings}
        />
      ) : (
        <div className="adduser-panel-cnt">
          <form encType="multipart/form-data">
            <h1>Usuń Kafle W Budynku</h1>
            <h3>Wybierz Z Jakiego Budynku Chcesz Zawartość</h3>
            {loadingBuilding ? (
              <p>Ładowanie danych</p>
            ) : (
              <select
                onChange={(e) => {
                  setActualBuilding(e.target.value);
                }}
              >
                <option value={""}>Wybierz budynek</option>
                {buildingsList.map((building, key) => {
                  if (
                    context.state.userStatus.includes(
                      `${building.which}kafle`
                    ) ||
                    context.state.userStatus.includes("kafleall") ||
                    context.state.userStatus.includes("admin")
                  ) {
                    return (
                      <option key={key} value={building.which}>
                        {building.name}
                      </option>
                    );
                  }
                })}
              </select>
            )}
            {loading ? null : (
              <table>
                <thead>
                  <tr style={{ fontSize: "23px" }}>
                    <th>ID:</th>
                    <th>Nazwa</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((buildingContent, key) => {
                    return (
                      <tr key={key}>
                        <td>{buildingContent.id}</td>
                        <td>{buildingContent.name}</td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Na pewno chcesz usunąć ten rekord?"
                                )
                              ) {
                                deleteBuildingContentFunction(
                                  e,
                                  buildingContent.id
                                );
                              }
                            }}
                          >
                            - Usuń Kafel
                          </button>
                        </td>
                        <td>
                          <button
                            className="footer-delete-button"
                            onClick={(e) => {
                              setEditId(buildingContent.id);
                              setEditShow(true);
                            }}
                          >
                            - Edytuj Kafel
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
