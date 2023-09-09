import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function SetSequenceContentInBuilding() {
  const location = useLocation();
  const [buildingFromDB, setBuildingFromDB] = useState([]);
  const [buildingContentFromDB, setBuildingContentFromDB] = useState([]);
  const [building, setBuilding] = useState("");
  const [loading, setLoading] = useState(true);
  const [buildingDataLoading, setBuildingDataLoading] = useState(true);
  const [newSequence, setNewSequence] = useState("");
  const [message, setMessage] = useState("");

  async function fetchBuildings() {
    axios.get(`${url}/getbuildingsequence`).then((res) => {
      console.log(res.data.data);
      setBuildingFromDB(res.data.data);
      setLoading(false);
    });
  }

  async function fetchBuildingContent() {
    axios.get(`${url}/getdetailsbuilding/${building}`).then((res) => {
      console.log(res);
      let arr = [];
      for (let i = 0; i < res.data.buildings.length; i++) {
        const obj = {
          value: res.data.buildings[i].name,
          label: res.data.buildings[i].name,
        };
        arr.push(obj);
      }
      setBuildingContentFromDB(arr);
      setBuildingDataLoading(false);
    });
  }

  function handleChange(selectedOption) {
    setNewSequence(selectedOption);
  }

  async function setSequence(e) {
    e.preventDefault();

    axios
      .post(
        `${url}/setbuildingsequence`,
        { sequence: newSequence },
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
  }

  useEffect(() => {
    fetchBuildings();
  }, [location]);

  useEffect(() => {
    if (building != "") {
      fetchBuildingContent();
    }
  }, [building]);

  return (
    <div className="adduser-panel-cnt">
      <form>
        <h1>Ustaw kolejność kafli w budynku</h1>
        {loading ? (
          <p>Ładowanie danych</p>
        ) : (
          <select onChange={(e) => setBuilding(e.target.value)}>
            <option>Wybierz budynek</option>
            {buildingFromDB.map((building, key) => {
              return (
                <option value={building.name} key={key}>
                  {building.name}
                </option>
              );
            })}
          </select>
        )}

        {buildingDataLoading ? null : (
          <>
            <h3>Ustaw kolejność w budynku</h3>
            <Select
              isMulti
              options={buildingContentFromDB}
              onChange={handleChange}
            />
          </>
        )}
        <input type={"submit"} value={"+ Zapisz"} onClick={setSequence} />
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
