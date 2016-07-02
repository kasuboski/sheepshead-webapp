import {SheepsheadCard} from './SheepsheadCard.js';
import {suits} from './Card.js';

export const GameUtil = {
  loadCards: function(cards) {
    for(let suit=0; suit < 4; suit++) {
      let rank = 0;
      for(let i=7; i <= 9; i++) {
          rank = (suit == 3) ? i : i-6; //if suit is diamonds the rank is higher
          cards.push(new SheepsheadCard(i, suits[suit], rank, 0, `images/playingcards/PNG-cards-1.3/${SheepsheadCard.getName(i)}_of_${suits[suit]}.png`));
      }

      //king
      cards.push(new SheepsheadCard(12, suits[suit], rank+1, 4, `images/playingcards/PNG-cards-1.3/king_of_${suits[suit]}.png`));
      //10
      cards.push(new SheepsheadCard(10, suits[suit], rank+2, 10, `images/playingcards/PNG-cards-1.3/10_of_${suits[suit]}.png`));
      //ace
      cards.push(new SheepsheadCard(14, suits[suit], rank+3, 11, `images/playingcards/PNG-cards-1.3/ace_of_${suits[suit]}.png`));

      //jacks
      cards.push(new SheepsheadCard(11, suits[suit], 16-suit, 2, `images/playingcards/PNG-cards-1.3/jack_of_${suits[suit]}.png`));    
      //queens
      cards.push(new SheepsheadCard(12, suits[suit], 20-suit, 3, `images/playingcards/PNG-cards-1.3/queen_of_${suits[suit]}.png`));
    }

  }
}