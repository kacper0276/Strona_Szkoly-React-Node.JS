import axios from "axios";
import { url } from "../App";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditContact() {
  const location = useLocation();
  const [whichEl, setWhichEl] = useState([]);
  const [actualWhichEl, setActualWhichEl] = useState("");
  const [contactData, setContactData] = useState({
    phoneNumber: "",
    adres: "",
    email: "",
    link: "",
    which: "",
  });
  const [contactDataLoading, setContactDataLoading] = useState(true);
  const [whichElLoading, setWhichElLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchWhich = async () => {
    axios.get(`${url}/getwhichfromcontact`).then((res) => {
      setWhichEl(res.data.data);
      setWhichElLoading(false);
      setActualWhichEl(res.data.data[0].which);
    });
  };

  const fetchDetailsContact = async (which) => {
    axios.get(`${url}/getdetailscontact/${which}`).then((res) => {
      setContactData({
        phoneNumber: res.data.data[0].phone_number,
        adres: res.data.data[0].adres,
        email: res.data.data[0].email,
        link: res.data.data[0].link,
        which: res.data.data[0].which,
      });
      setContactDataLoading(false);
    });
  };

  const editContactFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/editcontact`, contactData, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setMsg(res.data.error);
        } else {
          setMsg(res.data.msg);
        }
        fetchDetailsContact(actualWhichEl);
      });
  };

  useEffect(() => {
    fetchWhich();
  }, [location]);

  useEffect(() => {
    if (actualWhichEl !== "") {
      fetchDetailsContact(actualWhichEl);
    }
  }, [actualWhichEl]);

  return (
    <div className="add-news-panel">
      <h1>Edycja Danych Kontaktowych</h1>
      <form>
        {whichElLoading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <select
            onChange={(e) => {
              setActualWhichEl(e.target.value);
            }}
          >
            {whichEl.map((el, key) => {
              return (
                <option key={key} value={el.which}>
                  {el.which}
                </option>
              );
            })}
          </select>
        )}
        {contactDataLoading ? null : (
          <>
            <h3>Email: </h3>
            <input
              type={"email"}
              value={contactData.email}
              onChange={(e) => {
                setContactData({ ...contactData, email: e.target.value });
              }}
            />
            <h3>Numer Telefonu: </h3>
            <input
              type={"text"}
              value={contactData.phoneNumber}
              onChange={(e) => {
                setContactData({ ...contactData, phoneNumber: e.target.value });
              }}
            />
            <h3>Adres:</h3>
            <input
              type="text"
              value={contactData.adres}
              onChange={(e) => {
                setContactData({ ...contactData, adres: e.target.value });
              }}
            />
            <h3>Link Do Adresu (np. z google maps)</h3>
            <input
              type="text"
              value={contactData.link}
              onChange={(e) => {
                setContactData({ ...contactData, link: e.target.value });
              }}
            />
          </>
        )}
        <input
          type={"submit"}
          value={"+ Edytuj dane"}
          onClick={editContactFunction}
        />
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
  );
}
