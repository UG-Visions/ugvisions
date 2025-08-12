const express = require("express");
const path = require("path");
const fs = require("fs");
const pool = require("./database/connection"); // MySQL connection pool

const app = express();
const PORT = process.env.PORT || 3000; // Use environment PORT or 3000 locally

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend public folder statically
app.use(express.static(path.join(__dirname, "../public")));

// Serve admin panel static files
app.use('/admin', express.static(path.join(__dirname, "../admin-panel")));

// Frontend page routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});
app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/services.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/contact.html"));
});

// Contact form POST handler — save message to DB and optionally JSON (optional JSON part commented)
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Please fill all fields.");
  }

  const newMessage = { name, email, message, date: new Date().toISOString() };

  /*
  // Optional: Save message in JSON file — Disabled for hosting compatibility
  // const filePath = path.join(__dirname, "messages.json");
  // let messages = [];
  // if (fs.existsSync(filePath)) {
  //   const data = fs.readFileSync(filePath, "utf8");
  //   messages = JSON.parse(data);
  // }
  // messages.push(newMessage);
  // fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  */

  try {
    await pool.execute(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    res.send("Message received and saved! Thank you for contacting us.");
  } catch (err) {
    console.error("Error saving message to DB:", err);
    res.status(500).send("Server error, please try again later.");
  }
});

// Admin panel API route — fetch all messages from DB ordered by date desc
app.get('/admin/messages', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 404 fallback page handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
