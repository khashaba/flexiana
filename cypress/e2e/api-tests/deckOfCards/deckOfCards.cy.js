import { getCardsCode, compareCardsFn } from "../helpers";
import { drawCardsFromDeck, baseUrl } from "../requests";

describe("Cards API tests", () => {
  let deckId;
  let remainingInDeck = 52;
  const piles = [
    { name: "player1", cards: "" },
    { name: "player2", cards: "" },
  ];

  it("Create and shuffle a deck of cards", () => {
    cy.request(`${baseUrl}/new/shuffle/?deck_count=1`).then(
      ({ body: resBody }) => {
        expect(resBody.success).equal(true);
        expect(resBody.remaining).equal(remainingInDeck);
        deckId = resBody.deck_id;
      }
    );
  });

  it("Draw 3 cards from deck", () => {
    const drawCount = 3;
    remainingInDeck -= drawCount;
    drawCardsFromDeck(deckId, drawCount).then(({ remaining }) => {
      expect(remaining).equal(remainingInDeck);
    });
  });

  it("Make 2 piles with 5 cards each from deck", () => {
    const drawCount = 5;
    // for (let pileNumber = 0; pileNumber < piles.length; pileNumber++) {
    piles.forEach((pile) => {
      drawCardsFromDeck(deckId, drawCount).then(({ cards }) => {
        pile.cards = cards;
        const cardsCode = getCardsCode(cards);
        cy.request(
          `${baseUrl}/${deckId}/pile/${pile.name}/add/?cards=${cardsCode}`
        ).then(({ body: resBody }) => {
          expect(resBody.success).equal(true);
          expect(resBody.remaining).equal((remainingInDeck -= drawCount)); // Decrement the number of drawn cards from the remianing in deck
          expect(resBody.piles).has.property(pile.name);
        });
      });
    });
  });

  it("List the cards in pile1 and pile2", () => {
    for (let count = 0; count < 2; count++) {
      const pileName = piles[count].name;
      cy.request(`${baseUrl}/${deckId}/pile/${pileName}/list/`).then(
        ({ body: resBody }) => {
          const cards = resBody.piles[pileName].cards;
          expect(resBody.success).equal(true);
          expect(resBody.remaining).equal(remainingInDeck);
          expect(resBody.piles).has.property(pileName);
          expect(cards).to.deep.equal(piles[count].cards);
        }
      );
    }
  });

  it("Shuffle pile1", () => {
    const pileNumber = 0;
    const pileName = piles[pileNumber].name;

    cy.request(`${baseUrl}/${deckId}/pile/${pileName}/shuffle/`).then(
      ({ body: resBody }) => {
        expect(resBody.success).equal(true);
        expect(resBody.remaining).equal(remainingInDeck);
        expect(resBody.piles).has.property(pileName);
        cy.request(`${baseUrl}/${deckId}/pile/${pileName}/list/`).then(
          ({ body: resBody }) => {
            const cards = resBody.piles[pileName].cards;
            // arrays shouldn't have the same order anymore
            expect(cards).not.deep.equal(piles[pileNumber].cards);
            // Both arrays should have the same values
            expect(cards.sort(compareCardsFn)).deep.equal(
              piles[pileNumber].cards.sort(compareCardsFn)
            );
          }
        );
      }
    );
  });

  it("Draw 2 cards from pile1", () => {
    const pileName = piles[0].name;
    const drawCount = 2;
    drawCardsFromDeck(deckId, drawCount, false, pileName).then((resBody) => {
      expect(resBody.piles[pileName].remaining).to.equal(3);
    });
  });

  it("Draw 3 cards from pile2", () => {
    const pileName = piles[1].name;
    const drawCount = 3;
    drawCardsFromDeck(deckId, drawCount, false, pileName).then((resBody) => {
      expect(resBody.piles[pileName].remaining).to.equal(2);
    });
  });
});
