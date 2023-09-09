const connection = require("../helpers/databaseConnection.js");

class contactsController {
  async addNewContact(req, res) {
    const email = req.body.email,
      phone_number = req.body.phoneNumber,
      adress = req.body.adres,
      building = req.body.which,
      link = req.body.link;

    connection.execute(
      "INSERT INTO `contacts`(`email`, `phone_number`, `adres`, `link`, `which`) VALUES (?, ?, ?, ?, ?)",
      [email, phone_number, adress, link, building],
      (err, result) => {
        res.send({ msg: "Dodano kontakt!" });
      }
    );
  }

  async deleteContact(req, res) {
    const id = req.params.id;

    connection.execute(
      "DELETE FROM contacts WHERE id = ?",
      [id],
      (err, result) => {
        res.send({ msg: "Usunięto kontakt!" });
      }
    );
  }

  async editContact(req, res) {
    const email = req.body.email,
      phone_number = req.body.phoneNumber,
      adres = req.body.adres,
      which = req.body.which;

    connection.query(
      "UPDATE `contacts` SET `email`=?,`phone_number`=?,`adres`=? WHERE which = ?",
      [email, phone_number, adres, which],
      (err, result) => {
        res.send({ msg: "Edytowano dane!" });
      }
    );
  }

  async getWhich(req, res) {
    connection.query("SELECT which FROM contacts", (err, result) => {
      if (err) throw err;

      res.send({ data: result });
    });
  }

  async getDetailsContact(req, res) {
    const which = req.params.which;

    connection.query(
      "SELECT * FROM contacts WHERE which=?",
      [which],
      (err, result) => {
        if (err) throw err;

        res.send({ data: result });
      }
    );
  }

  async getAllContacts(req, res) {
    connection.query("SELECT * FROM contacts", (err, result) => {
      if (err) throw err;

      res.send({ contacts: result });
    });
  }
}

module.exports = new contactsController();
