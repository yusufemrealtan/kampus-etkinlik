import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // body -> req.body

app.use((req, res) => {
  // eşleşen route yoksa
  res.status(404).json({ error: { message: "Route not found" } });
});

export default app;
