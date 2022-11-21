export const baseUrl = "https://deckofcardsapi.com/api/deck";
import { getCardsCode } from "./helpers";

/**
 * Draw number of cards from a deck
 * @param {string} deckId the ID of the deck
 * @param {string} count the number of cards to draw from the deck
 * @param {string} serialize to serialize the cards object array to a string of cards
 * @returns the draw cards returns back in one string, joined by commas
 */
export const drawCardsFromDeck = (
  deckId,
  drawCount,
  serialize = false,
  pileName
) => {
  const url = pileName
    ? `${baseUrl}/${deckId}/pile/${pileName}/draw/?count=${drawCount}`
    : `${baseUrl}/${deckId}/draw/?count=${drawCount}`;
  return cy.request(url).then(({ body: resBody }) => {
    expect(resBody.success).equal(true);
    expect(resBody.cards).to.have.lengthOf(drawCount);
    return serialize ? getCardsCode(resBody.cards) : resBody;
  });
};
