import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../App";
import { useLocation } from "react-router-dom";

export default function AddNewContact() {
  const location = useLocation();
  const [buildingList, setBuildingList] = useState([]);
  const [loadingBuildingList, setLoadingBuildingList] = useState(true);
  const [contactData, setContactData] = useState({
    phoneNumber: "",
    adres: "",
    email: "",
    link: "",
    which: "",
  });
  const [contactList, setContactList] = useState([]);
  const [contactListLoading, setContactListLoading] = useState(true);
  const [message, setMessage] = useState("");

  const addNewContactFunction = async (e) => {
    e.preventDefault();

    axios
      .post(`${url}/addcontact`, contactData, {
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
        fetchAllContacts();
      });
  };

  const deleteContact = async (e, id) => {
    e.preventDefault();

    axios
      .post(
        `${url}/deletecontact/${id}`,
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
        fetchAllContacts();
      });
  };

  const fetchBuildingList = async () => {
    axios.get(`${url}/getallbuildings`).then((res) => {
      setBuildingList(res.data.buildings);
      setLoadingBuildingList(false);
    });
  };

  async function fetchAllContacts() {
    axios.get(`${url}/getallcontacts`).then((res) => {
      setContactList(res.data.contacts);
      setContactListLoading(false);
    });
  }

  useEffect(() => {
    fetchBuildingList();
    fetchAllContacts();
  }, [location]);

  return (
    <div className="add-news-panel">
      <h1>Dodaj Nowe Dane Kontaktowe</h1>
      <form>
        <h3>Wybierz Do Jakiego Budynku Chcesz Dodać Nowy Kontakt</h3>
        {loadingBuildingList ? (
          <p>Ładowanie danych...</p>
        ) : (
          <select
            onChange={(e) => {
              setContactData({ ...contactData, which: e.target.value });
            }}
          >
            {buildingList.map((el, key) => {
              if (el.which !== "szkołabranżowaii") {
                return (
                  <option key={key} value={el.which}>
                    {el.name}
                  </option>
                );
              }
            })}
          </select>
        )}
        <h3>Email: </h3>
        <input
          type={"email"}
          onChange={(e) => {
            setContactData({ ...contactData, email: e.target.value });
          }}
        />
        <h3>Numer Telefonu: </h3>
        <input
          type={"text"}
          onChange={(e) => {
            setContactData({ ...contactData, phoneNumber: e.target.value });
          }}
        />
        <h3>Adres:</h3>
        <input
          type="text"
          onChange={(e) => {
            setContactData({ ...contactData, adres: e.target.value });
          }}
        />
        <h3>Link Do Adresu (np. z google maps)</h3>
        <input
          type="text"
          onChange={(e) => {
            setContactData({ ...contactData, link: e.target.value });
          }}
        />
        <input
          type={"submit"}
          value={"+ Dodaj nowy kontakt"}
          onClick={addNewContactFunction}
        />
      </form>
      <h1>Usuń Kontakt</h1>
      <form>
        {contactListLoading ? (
          <p>Ładowanie danych...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Budynek</th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((contactEl, key) => {
                return (
                  <tr key={key}>
                    <td>{contactEl.id}</td>
                    <td>{contactEl.which}</td>
                    <td>
                      <button
                        className="footer-delete-button"
                        onClick={(e) => {
                          if (
                            window.confirm("Na pewno chcesz usunąć ten rekord?")
                          ) {
                            deleteContact(e, contactEl.id);
                          }
                        }}
                      >
                        - Usuń Kontakt
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
