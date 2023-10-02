import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { url } from "../App";
import Select from "react-select";
import axios from "axios";

export default function SetSequenceMenuColorlvl1() {
  const location = useLocation();
  const [menuFromDB, setMenuFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSequence, setNewSequence] = useState("");
  const [message, setMessage] = useState("");

  async function fetchSequenceMenuLvl1() {
    axios.get(`${url}/getlvl1`).then((res) => {
      let arr = [];
      for (let i = 0; i < res.data.menu.length; i++) {
        const obj = {
          value: res.data.menu[i].glowny,
          label: res.data.menu[i].nazwa,
        };
        arr.push(obj);
      }
      setMenuFromDB(arr);
      setLoading(false);
    });
  }

  function handleChange(selectedOption) {
    setNewSequence(selectedOption);
  }

  const setSequence = (e) => {
    e.preventDefault();

    if (newSequence.length != menuFromDB.length) {
      setMessage("Musisz wybrać wszystkie opcje!");
    } else {
      axios
        .post(
          `${url}/setsequencemenulvl1`,
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
          fetchSequenceMenuLvl1();
        });
    }
  };

  useEffect(() => {
    fetchSequenceMenuLvl1();
  }, [location]);

  return (
    <div className="adduser-panel-cnt">
      <form>
        <h1>Ustaw kolejność menu</h1>
        {loading ? (
          <p>Ładowanie danych</p>
        ) : (
          <Select isMulti options={menuFromDB} onChange={handleChange} />
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
