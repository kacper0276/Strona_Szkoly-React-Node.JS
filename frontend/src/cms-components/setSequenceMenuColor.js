import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function SetSequenceMenuColor() {
  const location = useLocation();
  const [menuFromDB, setMenuFromDB] = useState([]);
  const [menuContentFromDB, setMenuContentFromDB] = useState([]);
  const [menu, setMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuDataLoading, setMenuDataLoading] = useState(true);
  const [newSequence, setNewSequence] = useState("");
  const [message, setMessage] = useState("");

  async function fetchSequenceMenuLvl1() {
    axios.get(`${url}/getlvl1`).then((res) => {
      setMenuFromDB(res.data.menu);
      setLoading(false);
    });
  }

  async function setSequence(e) {
    e.preventDefault();

    if (menuContentFromDB.length != newSequence.length) {
      setMessage("Musisz wybrać wszystkie dane!");
    } else {
      axios
        .post(
          `${url}/setsequencemenucontent/${menu}`,
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
            setNewSequence([]);
          }
          fetchSequenceMenuLvl1();
        });
    }
  }

  async function fetchMenuContent() {
    axios.get(`${url}/getdetailsmenu/${menu}`).then((res) => {
      let arr = [];
      for (let i = 0; i < res.data.menu.length; i++) {
        const obj = {
          value: res.data.menu[i].nazwa,
          label: res.data.menu[i].nazwa,
        };
        arr.push(obj);
      }
      setMenuContentFromDB(arr);
      setMenuDataLoading(false);
    });
  }

  function handleChange(selectedOption) {
    setNewSequence(selectedOption);
  }

  useEffect(() => {
    fetchSequenceMenuLvl1();
  }, [location]);

  useEffect(() => {
    if (menu != "") {
      fetchMenuContent();
      setNewSequence([]);
    }
  }, [menu]);

  return (
    <div className="adduser-panel-cnt">
      <form>
        <h1>Ustaw kolejność zawartości w menu</h1>
        {loading ? (
          <p>Ładowanie danych</p>
        ) : (
          <select onChange={(e) => setMenu(e.target.value)}>
            <option>Wybierz menu</option>
            {menuFromDB.map((building, key) => {
              return (
                <option value={building.glowny} key={key}>
                  {building.nazwa}
                </option>
              );
            })}
          </select>
        )}
        {menuDataLoading ? null : (
          <>
            <h3>Ustaw kolejność w budynku</h3>
            <Select
              isMulti
              options={menuContentFromDB}
              onChange={handleChange}
              value={newSequence}
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
