import {SheepsheadCard} from './SheepsheadCard.js';
import {GameUtil} from './GameUtil.js';

export const AIUtil = {
  getHighCard: function(hand) {
    //TODO: take into account number of cards of each suit left
    //assume hand is sorted so just get the last one
    return hand[hand.length - 1];
  },
  getLowLegalCard: function(trick, hand) {
    for(let playerCard of hand) {
      if(AIUtil.isCardLegal(trick, hand, playerCard)) {
        return playerCard;
      }
    }
  },
  isCardLegal: function(trick, hand, card) {
    if(trick.length == 0) {
      //always legal if no cards played yet
      return true;
    }

    let ledCard = trick[0];

    if(ledCard.isTrump()) {
      if(card.isTrump()) {
        return true;
      }

      //if card is fail; only legal
      //if player doesn't have trump
      for(let playerCard of hand) {
        if(playerCard.isTrump()) {
          return false;
        }
      }
    } else {
      //fail was led
      //if card suit doesn't match what was led
      //then only legal if they don't have a matching suit
      if(card.suit != ledCard.suit || card.isTrump()) {
        for(let playerCard of hand) {
          if((playerCard.suit == ledCard.suit) && !playerCard.isTrump()) {
            return false;
          }
        }
      }
    }
    return true;
  },
  getFailAce: function(hand) {
    for(let playerCard of hand) {
      if(playerCard.rank == 6) {
        //fail ace rank
        return playerCard;
      }
    }
    return false;
  },
  arePartnersWinning: function(trick) {
    let winningCard = AIUtil.getWinningCard(trick);
    //partners winning if the winning card is owned by a partner
    return !winningCard.owner.isPicker;
  },
  getWinningCard: function(trick) {
    let highRank = 0;
    let highCard;
    let ledCard = trick[0];

    for(let trickCard of trick) {
      if((trickCard.rank > highRank) && followsSuit(ledCard, trickCard)) {
        highRank = trickCard.rank;
        highCard = trickCard;
      }
    }
    return highCard;
  },
  canBeat: function(trick, hand) {
    for(let playerCard of hand) {
      for(let trickCard of trick) {
        if(AIUtil.isCardLegal(trick, hand, playerCard) && (playerCard.rank > trickCard.rank)) {
          return playerCard;
        }
      }
    }
    //can't win the trick
    return false;
  }
}

let followsSuit = function(ledCard, card) {
  return (ledCard.isTrump() && card.isTrump()) || (!ledCard.isTrump() && (ledCard.suit == card.suit));
}