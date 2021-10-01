const { Client } = require("@notionhq/client")

const notion = new Client({auth: process.env.NOTION_API_KEY})
let flashcards
let sets
updateFromNotion([updateFlashcards(), updateSets()])
setInterval(() => updateFromNotion([updateFlashcards(), updateSets()]), 1000 * 60 * 60) // Cache every hour

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

  flashcards = response.results.map(getTrimmedFlashcard)
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

  function getTrimmedSet(set) {
    return {
      id: set.id,
      name: set.properties.Name.title[0].plain_text,
      flashcards: set.properties.Flashcards.relation.map(f => f.id)
    }
  }

  sets = response.results.map(getTrimmedSet)
}

function sendSets(req, res) {
  res.json(req.query.contains ?
    sets.filter(s => s.name.includes(req.query.contains))
    : sets)
}

function sendSetFlashcards(req, res) {
  const setName = sets.filter(s => s.id === req.params.setID)[0].name
  const setFlashcards = flashcards.filter(f => f.sets.includes(req.params.setID))

  const set = sets.filter(s => s.id === req.params.setID)[0]
  console.log(set.flashcards.length)
  console.log(setFlashcards.length)

  res.json({setName: setName, flashcards: setFlashcards})
}

function sendWildcardSetFlashcards(req, res) {
  // TODO: 
  // res.json(flashcards.slice(0, 3))
}

function updateFlashcardExpirations(req, res) {
  function updateFlashcardExpiration(flashcard) {
    return notion.pages.update({
      page_id: flashcard.id,
      properties: {
        "Lvl": {
          number: flashcard.lvl,
        },
        "Expired in": {
          number: flashcard.expired_in,
        },
      },
    });
  }

  const flashcardUpdates = req.body.map(updateFlashcardExpiration)

  Promise.all(flashcardUpdates)
    .then(data => updateFromNotion([updateFlashcards()]))
    .then(data => res.json({ updateSuccess: true }))
    .catch(error => {
      console.log(error)
      res.json({ updateSuccess: false })
    })
}

function recachedSets(req, res) {
  updateFromNotion([updateFlashcards(), updateSets()])
    // .then(data => sendSets(req, res))
    .then(data => res.json(sets))
    
}

async function resetDemo(req, res) {
  // Delete every flashcard and set
  await Promise.all([
    notion.databases.query({database_id: process.env.NOTION_SET_DATABASE_ID})
      .then(data => data.results.map(s => notion.pages.update({page_id: s.id, archived: true})))
      .then(data => console.log("deleted sets")),
    notion.databases.query({database_id: process.env.NOTION_FLASHCARD_DATABASE_ID})
      .then(data => data.results.map(f => notion.pages.update({page_id: f.id, archived: true})))
      .then(data => console.log("deleted cards"))
  ]).then(data => console.log("deleted everything"))

  // Set up demo data
  function getFlashcardEntry(flashcard, setID) {
    return {
      parent: { database_id: process.env.NOTION_FLASHCARD_DATABASE_ID },
      properties: {
        Front: { title: [{ text: { content: flashcard.front } }] },
        "Back": { "rich_text": [{ "type": "text", "text": { "content": flashcard.back } }]},
        "Lvl": { number: flashcard.lvl },
        "Expired in": { number: flashcard.expired_in },
        "Sets": { "relation": [{ "id": setID }] }
      }
    }
  }

  async function createSet({ setName, cards }) {
    const set = await notion.pages.create({
      parent: { database_id: process.env.NOTION_SET_DATABASE_ID },
      properties: { Name: { title: [{ text: { content: setName } }] } }
    })

    return Promise.all(cards.map(v => notion.pages.create(getFlashcardEntry(v, set.id))))
  }

  await Promise.all([
    createSet({ setName: "Europe capitals", cards: [
      { front: "Albania",  back: "Tirana", lvl: 0, expired_in: 0},
      { front: "Andorra",  back: "Andorra la Vella", lvl: 0, expired_in: 0},
      { front: "Armenia",  back: "Yerevan", lvl: 0, expired_in: 0},
      { front: "Austria",  back: "Vienna", lvl: 0, expired_in: 0},
      { front: "Azerbaijan",  back: "Baku", lvl: 0, expired_in: 0},
      { front: "Belarus",  back: "Minsk", lvl: 0, expired_in: 0},
      { front: "Belgium",  back: "Brussels", lvl: 0, expired_in: 0},
      { front: "Bosnia and Herzegovina",  back: "Sarajevo", lvl: 0, expired_in: 0},
      { front: "Bulgaria",  back: "Sofia", lvl: 0, expired_in: 0},
      { front: "Croatia",  back: "Zagreb", lvl: 0, expired_in: 0},
      { front: "Cyprus",  back: "Nicosia", lvl: 0, expired_in: 0},
      { front: "Czechia",  back: "Prague", lvl: 0, expired_in: 0},
      { front: "Denmark",  back: "Copenhagen", lvl: 0, expired_in: 0},
      { front: "Estonia",  back: "Tallinn", lvl: 0, expired_in: 0},
      { front: "Finland",  back: "Helsinki", lvl: 0, expired_in: 0},
      { front: "France",  back: "Paris", lvl: 0, expired_in: 0},
      { front: "Georgia",  back: "Tbilisi", lvl: 0, expired_in: 0},
      { front: "Germany",  back: "Berlin", lvl: 0, expired_in: 0},
      { front: "Greece",  back: "Athens", lvl: 0, expired_in: 0},
      { front: "Hungary",  back: "Budapest", lvl: 0, expired_in: 0},
      { front: "Iceland",  back: "Reykjavík", lvl: 0, expired_in: 0},
      { front: "Ireland",  back: "Dublin", lvl: 0, expired_in: 0},
      { front: "Italy",  back: "Rome", lvl: 0, expired_in: 0},
      { front: "Kazakhstan",  back: "Nur-Sultan", lvl: 0, expired_in: 0},
      { front: "Kosovo",  back: "Pristina", lvl: 0, expired_in: 0},
      { front: "Latvia",  back: "Riga", lvl: 0, expired_in: 0},
      { front: "Liechtenstein",  back: "Vaduz", lvl: 0, expired_in: 0},
      { front: "Lithuania",  back: "Vilnius", lvl: 0, expired_in: 0},
      { front: "Luxembourg",  back: "Luxembourg City", lvl: 0, expired_in: 0},
      { front: "Malta",  back: "Valletta", lvl: 0, expired_in: 0},
      { front: "Moldova",  back: "Chișinău", lvl: 0, expired_in: 0},
      { front: "Monaco",  back: "Monaco", lvl: 0, expired_in: 0},
      { front: "Montenegro",  back: "Podgorica", lvl: 0, expired_in: 0},
      { front: "Netherlands",  back: "Amsterdam", lvl: 0, expired_in: 0},
      { front: "North Macedonia",  back: "Skopje", lvl: 0, expired_in: 0},
      { front: "Norway",  back: "Oslo", lvl: 0, expired_in: 0},
      { front: "Poland",  back: "Warsaw", lvl: 0, expired_in: 0},
      { front: "Portugal",  back: "Lisbon", lvl: 0, expired_in: 0},
      { front: "Romania",  back: "Bucharest", lvl: 0, expired_in: 0},
      { front: "Russia",  back: "Moscow", lvl: 0, expired_in: 0},
      { front: "Serbia",  back: "Belgrade", lvl: 0, expired_in: 0},
      { front: "Slovakia",  back: "Bratislava", lvl: 0, expired_in: 0},
      { front: "Slovenia",  back: "Ljubljana", lvl: 0, expired_in: 0},
      { front: "Spain",  back: "Madrid", lvl: 0, expired_in: 0},
      { front: "Sweden",  back: "Stockholm", lvl: 0, expired_in: 0},
      { front: "Switzerland",  back: "Bern", lvl: 0, expired_in: 0},
      { front: "Turkey",  back: "Ankara", lvl: 0, expired_in: 0},
      { front: "Ukraine",  back: "Kyiv", lvl: 0, expired_in: 0},
      { front: "United Kingdom",  back: "London", lvl: 0, expired_in: 0},
      { front: "San Marino",  back: "San Marino", lvl: 0, expired_in: 0},
      { front: "Vatican City",  back: "Vatican City", lvl: 0, expired_in: 0},
    ]}).then(data => console.log("created capitals")),
    // createSet({setName: "Botanical names: daily fruits", cards: [
    //   { front: "Coconut",     back: "Cocos nucifera",         lvl: 0,   expired_in: 0},
    //   { front: "Carrot",      back: "Daucas carota",          lvl: 0,   expired_in: 0},
    //   { front: "Blueberry",   back: "Vaccinium cyanococcus",  lvl: 0,   expired_in: 0},
    //   { front: "Blackberry",  back: "Rubus fruticosus",       lvl: 0,   expired_in: 0},
    //   { front: "Banana",      back: "Musa paradisicum",       lvl: 0,   expired_in: 0},
    //   { front: "Avocado",     back: "Persea americana",       lvl: 0,   expired_in: 0},
    //   { front: "Apricot",     back: "Prunus armeniaca",       lvl: 0,   expired_in: 0},
    //   { front: "Apple",       back: "Pyrus malus",            lvl: 0,   expired_in: 0},
    // ]}).then(data => console.log("created botanical")),
    // createSet(getFillerSetData(0)).then(data => console.log("created filler")),
    // createSet(getFillerSetData(1)).then(data => console.log("created filler")),
    // createSet(getFillerSetData(2)).then(data => console.log("created filler")),
  ])
  await updateFromNotion([updateFlashcards(), updateSets()])
  console.log("all done!")
  sendSets(req, res)
}

module.exports = {
  sendSets,
  sendSetFlashcards,
  sendWildcardSetFlashcards,
  updateFlashcardExpirations,
  recachedSets,
  resetDemo,
}

function getFillerSetData(index) {
  return {
    setName: "Filler set " + (index + 1),
    cards: [
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
      { front: "Front 1", back: "Back 1",  lvl: index, expired_in: index * 3},
      { front: "Front 2", back: "Back 2",  lvl: index, expired_in: index * 3},
      { front: "Front 3", back: "Back 3",  lvl: index, expired_in: index * 3},
      { front: "Front 4", back: "Back 4",  lvl: index, expired_in: index * 3},
      { front: "Front 5", back: "Back 5",  lvl: index, expired_in: index * 3},
    ]
  }
}