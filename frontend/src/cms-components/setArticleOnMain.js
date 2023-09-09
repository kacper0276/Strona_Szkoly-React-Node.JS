import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { url } from "../App";

export default function SetArticleOnMain() {
  const location = useLocation();
  const [data, setData] = useState();
  const [actualNumber, setActualNumber] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchNumber() {
    axios.get(`${url}/getnumbermainpage`).then((res) => {
      setActualNumber(res.data.number);
      setLoading(false);
    });
  }

  const setNumberFunction = async (e) => {
    e.preventDefault();

    axios
      .post(
        `${url}/setnumberonmainpage`,
        { data },
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.msg) {
          fetchNumber();
        } else {
          setMessage(res.data.error);
        }
      });
  };

  useEffect(() => {
    fetchNumber();
  }, [location]);

  return (
    <div className="adduser-panel-cnt">
      <form>
        <h1>Ustaw Liczbę Artykułów Na Stronie Głównej</h1>
        {loading ? (
          <p>Ładowanie danych</p>
        ) : (
          <>
            <h3>Aktualna liczba to: {actualNumber[0].size}</h3>
            <input
              type="number"
              onChange={(e) => {
                setData(e.target.value);
              }}
            />

            <input
              type={"submit"}
              value={"+ Zmień liczbę"}
              onClick={setNumberFunction}
            />
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
