const { Client } = require("@notionhq/client");
const {
  getEuropeCapitalsData,
  getBotanicalNamesData,
  get80sMusicPopQuiz,
  getTVPopCultureTrivia,
  getFillerSetData,
} = require("./demoData");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
let flashcards;
let sets;
updateFromNotion([updateFlashcards(), updateSets()]);
setInterval(
  // Cache notion data every hour
  () => updateFromNotion([updateFlashcards(), updateSets()]),
  1000 * 60 * 60
);

async function updateFromNotion(updates) {
  await Promise.all(updates);

  sets.map((s) => {
    // Store flashcards id and avg expiration on sets
    // (!) Don't get set flashcards through relation property (notion limits it to 25 results)
    let expirationSum = 0;
    const setFlashcards = flashcards.filter((f) => f.sets.includes(s.id));
    s.flashcards = setFlashcards.map((f) => {
      expirationSum += f.expired_in;
      return f.id;
    });
    s.avg_expiration = Math.round(expirationSum / setFlashcards.length);
  });
}

async function updateFlashcards(fromSetID) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_FLASHCARD_DATABASE_ID,
    ...(fromSetID && {
      filter: {
        property: "Sets",
        relation: {
          contains: fromSetID,
        },
      },
    }),
    sorts: [
      {
        property: "Expired in",
        direction: "ascending",
      },
    ],
  });

  // Store trimmed flashcards
  flashcards = response.results.map((f) => ({
    id: f.id,
    front: f.properties.Front.title[0].plain_text,
    back: f.properties.Back.rich_text[0].plain_text,
    lvl: f.properties.Lvl.number,
    expired_in: f.properties["Expired in"].number,
    sets: f.properties.Sets.relation.map((s) => s.id),
  }));
}

async function updateSets(mustContainStr) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_SET_DATABASE_ID,
    ...(mustContainStr && {
      filter: {
        property: "Name",
        text: {
          contains: mustContainStr,
        },
      },
    }),
  });

  // Store trimmed sets
  sets = response.results.map((s) => ({
    id: s.id,
    name: s.properties.Name.title[0].plain_text,
  }));
}

function sendSets(req, res) {
  let setList = req.query.contains
    ? sets.filter((s) => s.name.includes(req.query.contains))
    : sets;

  res.json(setList);
}

function sendSetFlashcards(req, res) {
  res.json({
    setName: sets.filter((s) => s.id === req.params.setID)[0].name,
    flashcards: flashcards.filter((f) => f.sets.includes(req.params.setID)),
  });
}

function sendWildcardSetFlashcards(req, res) {
  // TODO
}

async function updateFlashcardExpirations(req, res) {
  const flashcardUpdates = req.body.map((f) =>
    notion.pages.update({
      page_id: f.id,
      properties: {
        Lvl: {
          number: f.lvl,
        },
        "Expired in": {
          number: f.expired_in,
        },
      },
    })
  );

  await Promise.all(flashcardUpdates);
  await updateFromNotion([updateFlashcards()]);
  res.json({ updateSuccess: true });
}

async function recachedSets(req, res) {
  await updateFromNotion([updateFlashcards(), updateSets()]);
  sendSets(req, res);
}

async function resetDemo(req, res) {
  // Delete every flashcard and set
  await Promise.all([
    notion.databases
      .query({ database_id: process.env.NOTION_SET_DATABASE_ID })
      .then((data) =>
        data.results.map((s) =>
          notion.pages.update({ page_id: s.id, archived: true })
        )
      ),
    notion.databases
      .query({ database_id: process.env.NOTION_FLASHCARD_DATABASE_ID })
      .then((data) =>
        data.results.map((f) =>
          notion.pages.update({ page_id: f.id, archived: true })
        )
      ),
  ]);

  // Set up demo data
  function getFlashcardEntry(flashcard, setID) {
    return {
      parent: { database_id: process.env.NOTION_FLASHCARD_DATABASE_ID },
      properties: {
        Front: { title: [{ text: { content: flashcard.front } }] },
        Back: {
          rich_text: [{ type: "text", text: { content: flashcard.back } }],
        },
        Lvl: { number: flashcard.lvl },
        "Expired in": { number: flashcard.expired_in },
        Sets: { relation: [{ id: setID }] },
      },
    };
  }

  async function createSet({ setName, cards }) {
    const set = await notion.pages.create({
      parent: { database_id: process.env.NOTION_SET_DATABASE_ID },
      properties: { Name: { title: [{ text: { content: setName } }] } },
    });

    return Promise.all(
      cards.map((v) => notion.pages.create(getFlashcardEntry(v, set.id)))
    );
  }

  await Promise.all([
    createSet(getEuropeCapitalsData()),
    createSet(getBotanicalNamesData()),
    createSet(get80sMusicPopQuiz()),
    createSet(getTVPopCultureTrivia()),
    createSet(getFillerSetData(0, 0)),
    createSet(getFillerSetData(1, 2)),
    createSet(getFillerSetData(4, 8)),
  ]);
  await updateFromNotion([updateFlashcards(), updateSets()]);
  sendSets(req, res);
}

module.exports = {
  sendSets,
  sendSetFlashcards,
  sendWildcardSetFlashcards,
  updateFlashcardExpirations,
  recachedSets,
  resetDemo,
};
