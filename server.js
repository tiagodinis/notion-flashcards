require("dotenv").config()
const express = require("express")

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const notion = require("./notion")
app.get("/api/sets", notion.sendSets)
app.get("/api/flashcards/:setID", notion.sendSetFlashcards)
app.get("/api/flashcards/wildcard", notion.sendWildcardSetFlashcards)
app.put("/api/flashcards/:setID", notion.updateFlashcardExpirations)
app.get("/api/recached-sets", notion.recachedSets)
app.get("/api/reset-demo", notion.resetDemo)

app.listen(3001)