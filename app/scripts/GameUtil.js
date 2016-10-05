import {SheepsheadCard} from './SheepsheadCard.js';
import {suits} from './Card.js';
import {AIUtil} from './AIUtil.js';

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
  },
  isGoodCard: function(card) {
    return card.isTrump() || SheepsheadCard.getName(card.identifier) == 'ace';
  },
  compWantsToPick: function(player) {
    //won't pick unless has more than 6 'good' cards
    let goodCardCount = 0;
    player.hand.forEach(card => {
      if(GameUtil.isGoodCard(card)) {
        goodCardCount++;
      }
    });
    
    return goodCardCount > 6;
  },
  playCard: function(trick, player, card) {
    player.playCard(card);
    trick.push(card);

    return card;
  },
  compPlayCard: function(trick, player) {
    if(player.isPlayer) {
      throw "Only a computer player is valid for compPlayTurn";
    }

    let playedCard;
    if(player.isPicker) {
      if(trick == null || trick.length == 0) {
        //computer is leading and the picker
        //play high card
        let highCard = AIUtil.getHighCard(player.hand);
        playedCard = GameUtil.playCard(trick, player, highCard);
      } else {
        //try to win
        playedCard = tryToWin(trick, player);

      }
    } else {
      //not the picker
      if(trick == null || trick.length == 0) {
        //computer is leading
        let failAce = AIUtil.getFailAce(player.hand);
        if(failAce) {
          //play an ace if it has one
          playedCard = GameUtil.playCard(trick, player, failAce);
        } else {
          //otherwise play low card
          playedCard = playLowCard(trick, player);
        }
      } else {
        if(AIUtil.arePartnersWinning(trick)) {
          //if partners are winning play low card
          playedCard = playLowCard(trick, player);
        } else {
          playedCard = tryToWin(trick, player);
        }
      }
    }

    return playedCard;
  },
  getWinningPlayer: function(trick) {
    return AIUtil.getWinningCard(trick).owner;
  }
}

let tryToWin = function(trick, player) {
  let canBeatResult = AIUtil.canBeat(trick, player.hand);

  if(canBeatResult) {
    return GameUtil.playCard(trick, player, canBeatResult);
  } else {
    //play lowest legal card
    let lowCard = AIUtil.getLowLegalCard(trick, player.hand);
    return GameUtil.playCard(trick, player, lowCard);
  }
}

let playLowCard = function(trick, player) {
  let lowCard = AIUtil.getLowLegalCard(trick, player.hand);
  return GameUtil.playCard(trick, player, lowCard);
}