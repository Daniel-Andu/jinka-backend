// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// const { query } = require("./config/db");
// const publicRoutes = require("./routes/publicRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();
// const port = Number(process.env.PORT || 5001);

// app.use(cors());
// app.use(express.json({ limit: "1mb" }));
// app.use('/uploads', express.static('uploads'));

// app.get("/health", async (_req, res, next) => {
//   try {
//     // Try database connection with timeout
//     const timeoutPromise = new Promise((_, reject) =>
//       setTimeout(() => reject(new Error('Database timeout')), 5000)
//     );

//     const queryPromise = query("SELECT 1 AS test");

//     const rows = await Promise.race([queryPromise, timeoutPromise]);
//     res.json({ ok: true, db: 'connected', test: rows[0] });
//   } catch (err) {
//     // Return success even if DB fails, so we know server is running
//     res.json({ ok: true, db: 'error', error: err.message, server: 'running' });
//   }
// });

// app.use("/api/public", publicRoutes);
// app.use("/api/admin", adminRoutes);

// app.use((err, _req, res, _next) => {
//   const message = err && err.message ? err.message : "Internal server error";
//   res.status(500).json({ error: message });
// });

// app.listen(port, () => {
//   // eslint-disable-next-line no-console
//   console.log(`Jinka CMS backend running on port ${port}`);
// });

const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const { query } = require("./config/db");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Render requires using process.env.PORT
const PORT = process.env.PORT || 5000;

// -------------------
// CORS Configuration
// -------------------

// Allow your Vercel frontend to access the backend
const FRONTEND_URL = process.env.FRONTEND_URL || "https://jinka-admin.vercel.app";

app.use(
  cors({
    origin: FRONTEND_URL, // allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies if needed
  })
);

// -------------------
// Middleware
// -------------------
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static("uploads"));

// -------------------
// Health check
// -------------------
app.get("/health", async (_req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database timeout")), 5000)
    );

    const queryPromise = query("SELECT 1 AS test");

    const rows = await Promise.race([queryPromise, timeoutPromise]);

    res.json({
      ok: true,
      db: "connected",
      test: rows[0],
    });
  } catch (err) {
    res.json({
      ok: true,
      db: "error",
      error: err.message,
      server: "running",
    });
  }
});

// -------------------
// Routes
// -------------------
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

// -------------------
// Global error handler
// -------------------
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// -------------------
// Start server
// -------------------
app.listen(PORT, () => {
  console.log(`Jinka CMS backend running on port ${PORT}`);
});