import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";

export default function AddBuildings() {
  const location = useLocation();
  const [buildingData, setBuildingData] = useState({
    name: "",
    type: "poziom1",
    link: "BRAK",
  });
  const [message, setMessage] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBuildings() {
    axios.get(`${url}/getallbuildings`).then((res) => {
      setBuildings(res.data.buildings);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchBuildings();
  }, [location]);

  const addBuildingFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/addbuilding`, buildingData, {
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
        fetchBuildings();
      });
  };

  const deleteBuildingFunction = async (e, id) => {
    e.preventDefault();
    axios
      .post(
        `${url}/deletebuilding/${id}`,
        {},
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          setMessage(res.data.error);
        } else {
          setMessage(res.data.msg);
        }
        fetchBuildings();
      });
  };

  return (
    <div className="add-news-panel">
      <form onSubmit={addBuildingFunction}>
        <h1>Dodaj budynek do menu</h1>
        <h3>Podaj nazwę budynku</h3>
        <input
          type="text"
          onChange={(e) => {
            setBuildingData({ ...buildingData, name: e.target.value });
          }}
          required
        />
        <h3>
          Czy ma być odnośnikiem do innej strony? Jeśli tak wklej link tutaj
        </h3>
        <input
          type="text"
          onChange={(e) => {
            setBuildingData({ ...buildingData, link: e.target.value });
          }}
        />
        <div className="add-news-panel-btn-cnt">
          <input type={"submit"} value={"+ Zapisz"} />
        </div>
      </form>
      <form>
        <h1>Usuń budynek z menu</h1>
        {loading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <table>
            <tbody>
              {buildings.map((building, key) => {
                return (
                  <tr key={key}>
                    <td>{building.id}</td>
                    <td>{building.name}</td>
                    <td>
                      <button
                        className="footer-delete-button"
                        onClick={(e) => {
                          if (
                            window.confirm("Na pewno chcesz usunąć ten rekord?")
                          ) {
                            deleteBuildingFunction(e, building.id);
                          }
                        }}
                      >
                        - Usuń Budynek
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
