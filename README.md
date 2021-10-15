A flashcard app using the Notion API.
Built with React + Framer Motion + Styled components + NodeJS.

Try the [live demo](https://notion-flashcards.herokuapp.com/).

## Notes
### Data
App data comes from a personal root page shared with a Notion [internal integration](https://developers.notion.com/docs/authorization#integration-types).
The root page contains 2 database pages: "Sets" and "Flashcards".
"Sets" entries are sets - named collections of flashcards.
"Flashcards" entries are flashcards, which have a front and back side (just strings for now), a list of sets they belong to, a progression level and an expiration date.

The card's level and expiration date are used by the app's simple [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) logic.
A card is "stale" when the expiration date nears 0. When stale cards are tested and answered correctly their level increases and a new expiration date is assigned (as 2 ^ level). Stale and non-stale cards' level always decreases when answered incorrectly.

### Server
The node server caches the entries of sets and flashcards every hour (Notion can be a bit slow and data rarely changes). If data is changed manually on notion, a recache can be requested to avoid waiting. The demo can also be restored to its initial state.

Notion API's relation property queries are limited to 25 entries. Because some sets are larger than this, their flashcard list is built on the server by looking at the flashcard's set list. Although a flashcard can belong to multiple sets, it's highly unlikely that number will ever exceed 25.

### React app
The app has 2 views. On the "SetSelectionView", the user can view, filter and sort a list of the available card sets. If he clicks on a set, he is taken to the "SetSessionView" to carry out the corresponding training session. There, he can flip cards (toggling between the front and the back side), skip them (sending them back into the deck) and register his answer (correct vs incorrect). When the last card is answered, a report modal appears letting the user save his performance or retry the session.

### TODOs
- [ ] Wildcard sets (compute a dynamic set made of x random stale cards)
- [ ] Image support
    - [ ] Add a "Files & Media" property to Flashcards
    - [ ] Use placeholder expressions to indicate where the images should be inserted
- [ ] Undo on swipe up
- [ ] Get a set average expiration from Notion using a sum rollup (instead of computing on the server)
- [ ] Rich text
- [ ] UI flourishes
    - [ ] SessionReport animation time based on number of cards (x milliseconds per card until a cap is reached)
    - [ ] SessionReport confettis/seal of approval animation on perfect score
    - [ ] Free drag movement on 2 axis (currently using framer-motion dragDirectionLock)

### Installation
If you want to run the app locally:

    git clone https://github.com/tiagodinis/notion-flashcards
    npm i
    npm run dev

### License
[MIT License](https://opensource.org/licenses/MIT).