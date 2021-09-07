const { Client } = require("@notionhq/client")

const notion = new Client({auth: process.env.NOTION_API_KEY})

let flashcards
let sets
updateFromNotion([updateFlashcards(), updateSets()])
setInterval(() => updateFromNotion([updateFlashcards(), updateSets()]), 1000 * 60 * 60) // Update every hour

async function updateFromNotion(updates) {
  return Promise.all(updates)
    .then(data => sets.map(s => { // Update sets avg expiration
      const setFlashcards = flashcards.filter(f => f.sets.includes(s.id))
      const expirationSum = setFlashcards.reduce((acc, f) => acc + f.expired_in, 0)
      s.avg_expiration = Math.round(expirationSum / setFlashcards.length)
    }))
}

async function updateFlashcards(fromSetID) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_FLASHCARD_DATABASE_ID,
    ...(fromSetID && {
      filter: {
        "property": "Sets",
        "relation": {
          "contains": fromSetID
        }
      }
    }),
    sorts: [
      {
        property: "Expired in",
        direction: "ascending",
      },
    ],
  })

  flashcards = response.results.map(getTrimmedFlashcard)
}

function getTrimmedFlashcard(flashcard) {
  return {
    id: flashcard.id,
    front: flashcard.properties.Front.title[0].plain_text,
    back: flashcard.properties.Back.rich_text[0].plain_text,
    lvl: flashcard.properties.Lvl.number,
    expired_in: flashcard.properties["Expired in"].number,
    sets: flashcard.properties.Sets.relation.map(s => s.id)
  }
}

async function updateSets(mustContainStr) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_SET_DATABASE_ID,
    ...(mustContainStr && {
      filter: {
        "property": "Name",
        "text": {
          "contains": mustContainStr
        }
      }
    })
  })

  sets = response.results.map(getTrimmedSet)
}

function getTrimmedSet(set) {
  return {
    id: set.id,
    name: set.properties.Name.title[0].plain_text,
    flashcards: set.properties.Flashcards.relation.map(f => f.id)
  }
}

function sendSets(req, res) {
  res.json(req.query.contains ?
    sets.filter(s => s.name.includes(req.query.contains))
    : sets)
}

async function sendSyncedSets(req, res) {
  await updateFromNotion([updateFlashcards(), updateSets()])
  sendSets(req, res)
}

function sendSetFlashcards(req, res) {
  const setName = sets.filter(s => s.id === req.params.setID)[0].name
  const setFlashcards = flashcards.filter(f => f.sets.includes(req.params.setID))
  res.json({setName: setName, flashcards: setFlashcards})
}

function sendWildcardSetFlashcards(req, res) {
  res.json(flashcards.slice(0, 3))
}

function updateFlashcardExpirations(req, res) {
  const flashcardUpdates = req.body.map(f => updateFlashcardExpiration(f.id, f.lvl, f.expired_in))
  Promise.all(flashcardUpdates)
    .then(data => updateFromNotion([updateFlashcards()]))
    .then(data => res.json({ updateSuccess: true }))
    .catch(error => {
      console.log(error)
      res.json({ updateSuccess: false })
    })
}

function updateFlashcardExpiration(pageID, lvl, expiredIn) {
  return notion.pages.update({
    page_id: pageID,
    properties: {
      "Lvl": {
        number: lvl,
      },
      "Expired in": {
        number: expiredIn,
      },
    },
  });
}

module.exports = {
  sendSets,
  sendSyncedSets,
  sendSetFlashcards,
  sendWildcardSetFlashcards,
  updateFlashcardExpirations
}