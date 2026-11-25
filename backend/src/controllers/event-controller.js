import mongoose from "mongoose";
import { Event } from "../models/event-model.js";

// PATCH ile değiştirilemeyen alanlar
const KORUNAN_ALANLAR = ["_id", "createdAt", "updatedAt", "__v"];

// Aynı 404 tek yerde
function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

// GET /events  (?category=Atölye isteğe bağlı)
export async function getEvents(req, res, next) {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /events/:id
export async function getEventById(req, res, next) {
  try {
    // biçimi yanlış id ("yok") -> CastError/500 yerine 404
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const event = await Event.findById(req.params.id);
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// POST /events  (doğrulamayı schema yapar, controller 400'e çevirir)
export async function createEvent(req, res, next) {
  try {
    const event = await Event.create(req.body ?? {});
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

// PATCH /events/:id  (sadece gönderilen alanlar değişir)
export async function updateEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const body = req.body ?? {};
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: { message: "Body is empty" } });
    }

    const korunan = Object.keys(body).filter((k) => KORUNAN_ALANLAR.includes(k));
    if (korunan.length > 0) {
      return res
        .status(400)
        .json({ error: { message: `${korunan.join(", ")} cannot be changed` } });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, body, {
      returnDocument: "after", // güncellenmiş kaydı döndür
      runValidators: true, // schema kuralları burada da çalışsın
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    // enum/min gibi kurallar ValidationError, "2026-12-20" gibi tarih CastError -> 400
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

// DELETE /events/:id  (silindi: 204, gövde yok)
export async function deleteEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return notFound(res); // ikinci silme de buraya
    res.status(204).end(); // 204'ün gövdesi olmaz: res.json yazılmaz
  } catch (err) {
    next(err);
  }
}
