/**
 * Extract all cards code from cards array and concatenate them in one array
 * @param {Array} cards array of cards object
 * @returns the cards codes returns back in one string, joined by commas
 */
export const getCardsCode = (cards) => {
  return cards.map((elm) => elm.code).join();
};

/**
 * compareFn is used as a helper to help sort function to be able to sort cards based on the card code
 */
export const compareCardsFn = (a, b) => {
    const nameA = a.code// ignore upper and lowercase
    const nameB = b.code; // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  };