function getEuropeCapitalsData() {
  return {
    setName: "Europe capitals",
    cards: [
      { front: "Albania", back: "Tirana", lvl: 0, expired_in: 0 },
      { front: "Andorra", back: "Andorra la Vella", lvl: 0, expired_in: 0 },
      { front: "Armenia", back: "Yerevan", lvl: 0, expired_in: 0 },
      { front: "Austria", back: "Vienna", lvl: 0, expired_in: 0 },
      { front: "Azerbaijan", back: "Baku", lvl: 0, expired_in: 0 },
      { front: "Belarus", back: "Minsk", lvl: 0, expired_in: 0 },
      { front: "Belgium", back: "Brussels", lvl: 0, expired_in: 0 },
      {
        front: "Bosnia and Herzegovina",
        back: "Sarajevo",
        lvl: 0,
        expired_in: 0,
      },
      { front: "Bulgaria", back: "Sofia", lvl: 0, expired_in: 0 },
      { front: "Croatia", back: "Zagreb", lvl: 0, expired_in: 0 },
      { front: "Cyprus", back: "Nicosia", lvl: 0, expired_in: 0 },
      { front: "Czechia", back: "Prague", lvl: 0, expired_in: 0 },
      { front: "Denmark", back: "Copenhagen", lvl: 0, expired_in: 0 },
      { front: "Estonia", back: "Tallinn", lvl: 0, expired_in: 0 },
      { front: "Finland", back: "Helsinki", lvl: 0, expired_in: 0 },
      { front: "France", back: "Paris", lvl: 0, expired_in: 0 },
      { front: "Georgia", back: "Tbilisi", lvl: 0, expired_in: 0 },
      { front: "Germany", back: "Berlin", lvl: 0, expired_in: 0 },
      { front: "Greece", back: "Athens", lvl: 0, expired_in: 0 },
      { front: "Hungary", back: "Budapest", lvl: 0, expired_in: 0 },
      { front: "Iceland", back: "Reykjavík", lvl: 0, expired_in: 0 },
      { front: "Ireland", back: "Dublin", lvl: 0, expired_in: 0 },
      { front: "Italy", back: "Rome", lvl: 0, expired_in: 0 },
      { front: "Kazakhstan", back: "Nur-Sultan", lvl: 0, expired_in: 0 },
      { front: "Kosovo", back: "Pristina", lvl: 0, expired_in: 0 },
      { front: "Latvia", back: "Riga", lvl: 0, expired_in: 0 },
      { front: "Liechtenstein", back: "Vaduz", lvl: 0, expired_in: 0 },
      { front: "Lithuania", back: "Vilnius", lvl: 0, expired_in: 0 },
      { front: "Luxembourg", back: "Luxembourg City", lvl: 0, expired_in: 0 },
      { front: "Malta", back: "Valletta", lvl: 0, expired_in: 0 },
      { front: "Moldova", back: "Chișinău", lvl: 0, expired_in: 0 },
      { front: "Monaco", back: "Monaco", lvl: 0, expired_in: 0 },
      { front: "Montenegro", back: "Podgorica", lvl: 0, expired_in: 0 },
      { front: "Netherlands", back: "Amsterdam", lvl: 0, expired_in: 0 },
      { front: "North Macedonia", back: "Skopje", lvl: 0, expired_in: 0 },
      { front: "Norway", back: "Oslo", lvl: 0, expired_in: 0 },
      { front: "Poland", back: "Warsaw", lvl: 0, expired_in: 0 },
      { front: "Portugal", back: "Lisbon", lvl: 0, expired_in: 0 },
      { front: "Romania", back: "Bucharest", lvl: 0, expired_in: 0 },
      { front: "Russia", back: "Moscow", lvl: 0, expired_in: 0 },
      { front: "Serbia", back: "Belgrade", lvl: 0, expired_in: 0 },
      { front: "Slovakia", back: "Bratislava", lvl: 0, expired_in: 0 },
      { front: "Slovenia", back: "Ljubljana", lvl: 0, expired_in: 0 },
      { front: "Spain", back: "Madrid", lvl: 0, expired_in: 0 },
      { front: "Sweden", back: "Stockholm", lvl: 0, expired_in: 0 },
      { front: "Switzerland", back: "Bern", lvl: 0, expired_in: 0 },
      { front: "Turkey", back: "Ankara", lvl: 0, expired_in: 0 },
      { front: "Ukraine", back: "Kyiv", lvl: 0, expired_in: 0 },
      { front: "United Kingdom", back: "London", lvl: 0, expired_in: 0 },
      { front: "San Marino", back: "San Marino", lvl: 0, expired_in: 0 },
      { front: "Vatican City", back: "Vatican City", lvl: 0, expired_in: 0 },
    ],
  };
}

function getBotanicalNamesData() {
  return {
    setName: "Botanical names: daily fruits",
    cards: [
      { front: "Coconut", back: "Cocos\nnucifera", lvl: 5, expired_in: 10 },
      { front: "Carrot", back: "Daucas\ncarota", lvl: 5, expired_in: 10 },
      {
        front: "Blueberry",
        back: "Vaccinium\ncyanococcus",
        lvl: 4,
        expired_in: 0,
      },
      { front: "Blackberry", back: "Rubus\nfruticosus", lvl: 5, expired_in: 6 },
      { front: "Banana", back: "Musa\nparadisicum", lvl: 6, expired_in: 32 },
      { front: "Avocado", back: "Persea\namericana", lvl: 6, expired_in: 0 },
      { front: "Apricot", back: "Prunus\narmeniaca", lvl: 8, expired_in: 24 },
      { front: "Apple", back: "Pyrus\nmalus", lvl: 6, expired_in: 2 },
    ],
  };
}

function getFillerSetData(index) {
  return {
    setName: "Filler set " + (index + 1),
    cards: [
      { front: "Front 1\n", back: "Back 1", lvl: index, expired_in: index * 3 },
      { front: "Front 2\n", back: "Back 2", lvl: index, expired_in: index * 3 },
      { front: "Front 3\n", back: "Back 3", lvl: index, expired_in: index * 3 },
      { front: "Front 4\n", back: "Back 4", lvl: index, expired_in: index * 3 },
      { front: "Front 5\n", back: "Back 5", lvl: index, expired_in: index * 3 },
    ],
  };
}

module.exports = {
  getEuropeCapitalsData,
  getBotanicalNamesData,
  getFillerSetData,
};
