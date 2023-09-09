import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { url } from "../App";
import Select from "react-select";

export default function SetSequenceInBuilding() {
  const location = useLocation();
  const [buildingFromDB, setBuildingFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSequence, setNewSequence] = useState("");
  const [message, setMessage] = useState("");

  async function fetchBuildings() {
    axios.get(`${url}/getbuildingsequence`).then((res) => {
      let arr = [];
      for (let i = 0; i < res.data.data.length; i++) {
        const obj = {
          value: res.data.data[i].name,
          label: res.data.data[i].name,
        };
        arr.push(obj);
      }
      setBuildingFromDB(arr);
      setLoading(false);
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

  return (
    <div className="adduser-panel-cnt">
      <form>
        <h1>Ustaw kolejność budynków w menu</h1>
        {loading ? (
          <p>Ładowanie danych</p>
        ) : (
          <Select isMulti options={buildingFromDB} onChange={handleChange} />
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
