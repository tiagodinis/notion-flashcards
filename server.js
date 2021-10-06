require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notion = require("./notion");
app.get("/api/sets", notion.sendSets);
app.get("/api/flashcards/:setID", notion.sendSetFlashcards);
app.get("/api/flashcards/wildcard", notion.sendWildcardSetFlashcards);
app.patch("/api/flashcards/:setID", notion.updateFlashcardExpirations);
app.get("/api/recached-sets", notion.recachedSets);
app.get("/api/reset-demo", notion.resetDemo);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 3001;
app.listen(PORT);
