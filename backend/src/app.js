import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();
app.use(cors());
app.use(express.json()); // body -> req.body

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2416501065",
  });
});

app.use("/events", eventRoutes);

app.use((req, res) => {
  // eşleşen route yoksa
  res.status(404).json({ error: { message: "Route not found" } });
});

app.use((err, req, res, next) => {
  // hata yakalayıcı: sunucu çökmez
  if (err.type === "entity.parse.failed") {
    // bozuk JSON gövdesi
    return res.status(400).json({ error: { message: "Invalid JSON body" } });
  }
  console.error(err.message);
  res.status(500).json({ error: { message: "Server error" } });
});

export default app;
