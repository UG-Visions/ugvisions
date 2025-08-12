// database/queries.js
const db = require('./connection');

function saveMessage(name, email, message, callback) {
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.execute(sql, [name, email, message])
    .then(() => callback(null))
    .catch(err => callback(err));
}

module.exports = { saveMessage };
