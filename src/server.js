const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { query } = require("./config/db");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = Number(process.env.PORT || 5001);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use('/uploads', express.static('uploads'));

app.get("/health", async (_req, res, next) => {
  try {
    // Try database connection with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 5000)
    );

    const queryPromise = query("SELECT 1 AS test");

    const rows = await Promise.race([queryPromise, timeoutPromise]);
    res.json({ ok: true, db: 'connected', test: rows[0] });
  } catch (err) {
    // Return success even if DB fails, so we know server is running
    res.json({ ok: true, db: 'error', error: err.message, server: 'running' });
  }
});

app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  const message = err && err.message ? err.message : "Internal server error";
  res.status(500).json({ error: message });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Jinka CMS backend running on port ${port}`);
});
