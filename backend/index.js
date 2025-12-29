import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

// ------------------------
// MYSQL CONNECTION (LOCAL)
// ------------------------
const db = await mysql.createPool({
  host: "127.0.0.1",
  user: "contactuser",
  password: "StrongPassword123@",
  database: "contactbook",
  waitForConnections: true,
  connectionLimit: 10
});

// ------------------------
// HEALTH CHECK
// ------------------------
app.get("/health", (_, res) => res.send("ok"));

// ------------------------
// API ROUTES
// ------------------------
const router = express.Router();

// GET all contacts
router.get("/contacts", async (_, res) => {
  const [rows] = await db.query(
    "SELECT * FROM contacts ORDER BY created_at DESC"
  );
  res.json(rows);
});

// CREATE contact
router.post("/contacts", async (req, res) => {
  const id = uuid();
  const { name, email, phone } = req.body;

  await db.query(
    "INSERT INTO contacts (id, name, email, phone) VALUES (?, ?, ?, ?)",
    [id, name, email, phone]
  );

  res.json({ id, name, email, phone });
});

// UPDATE contact
router.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  await db.query(
    "UPDATE contacts SET name=?, email=?, phone=? WHERE id=?",
    [name, email, phone, id]
  );

  res.json({ id, name, email, phone });
});

// DELETE contact
router.delete("/contacts/:id", async (req, res) => {
  await db.query("DELETE FROM contacts WHERE id=?", [req.params.id]);
  res.json({ message: "deleted" });
});

// mount prefix
app.use("/api", router);

// ------------------------
// LISTEN LOCAL ONLY
// ------------------------
app.listen(3000, "127.0.0.1", () => {
  console.log("Backend running on http://localhost:3000");
});
