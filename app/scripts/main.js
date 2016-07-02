import {Game, events} from './Game.js';
import {states} from './StateManager.js';
import {Deck} from './Deck.js';
import {SheepsheadCard} from './SheepsheadCard.js';
import {SheepsheadPlayer} from './SheepsheadPlayer.js';
import {suits} from './Card.js';

//load cards for sheepshead
let loadCards = function(cards) {
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

let deck = new Deck(loadCards);

let players = [new SheepsheadPlayer(true, 'Player1'), new SheepsheadPlayer(false, 'Comp 1'), new SheepsheadPlayer(false, 'Comp 2')];

let game = new Game(players, deck);

let selectedCards = [];

$(function() {
  addListenersModalButtons();

  //subscribe to events from Game
  let picking_token = PubSub.subscribe(events.ASK_TO_PICK, function(msg, data) {
    //show the modal
    $("#ask_to_pick_modal").modal('show');
  });

  let bury_token = PubSub.subscribe(events.ASK_TO_BURY, function(msg, data) {
    console.log(data);
    $("#user-message").text("Choose two cards to bury");
  });

  let update_hand_token = PubSub.subscribe(events.UPDATE_HAND, function(msg, data) {
    console.log(data.reason);
    updatePlayerHandUI(data.cards);
  });

  game.startGame();

  updatePlayerHandUI(game.players[0].hand);
});

let addListenersModalButtons = function() {
  $("#pick-yes").click(function() {
    //hide the modal
    $("#ask_to_pick_modal").modal('hide');

    PubSub.publish(events.PICKED, "yes");
  });

  $("#pick-no").click(function() {
    //hide the modal
    $("#ask_to_pick_modal").modal('hide');

    PubSub.publish(events.PICKED, "no");
  });
}

let updatePlayerHandUI = function(cards) {
  let player_card_container = $('.cards-container > ul');
  //remove all cards before redrawing them
  player_card_container.children().remove();

  cards.forEach(function(card, index, array) {
    addCardtoUI(card, index);
  });

  //animate bottom cards on hover
  let bottom_cards = $('.cards-container > ul > li > .card');
  bottom_cards.hover(function() {
    $(this).stop().animate({
        top: -25
    }, 200, 'linear');
  }, function() {
      $(this).stop().animate({
          top: 0
      }, 200, 'linear');
  });

  //add click listeners to bottom cards
  bottom_cards.click(function() {
    //remove card from view
    let card = $(this);
    let player_card = players[0].hand[card.attr('data-index')];
    // console.log(players[0].hand[card.attr('data-index')]);

    if(game.getState() == states.PLAYERTURN) {
      card.parent().remove();

      //add card to played card spot remove old one
      $('#player-played-card').empty();
      //reset style
      card.removeAttr('style');
      $('#player-played-card').append(card);
    } else if(game.getState() == states.PICKING) {
      //if card was previously selected deselect it
      if(card.hasClass("selected-card")) {
        card.removeClass("selected-card");

        selectedCards.splice(selectedCards.indexOf(card, 1));
      } else {
        if(selectedCards.length < 1) {
          //highlight picked card
          card.addClass("selected-card");

          selectedCards.push(card);
        } else {

          //highlight picked card
          card.addClass("selected-card");

          selectedCards.push(card);

          //bury the cards
          //remove them from the view and find it in the player's hand
          let cardsToBury = [];
          selectedCards.forEach( card => {
            card.parent().remove();

            cardsToBury.push(players[0].hand[card.attr('data-index')]);
          });

          PubSub.publish(events.USER_BURY, {player: players[0], cards: cardsToBury});
        }
      }
    }

  });
}

let addCardtoUI = function(card, index) {
  let player_card_container = $('.cards-container > ul');

  //create card and append to card container div
  let new_li = $('<li>');
  let img = $('<img>', {src:card.image, class:'card', 'data-index': index});

  new_li.append(img);
  player_card_container.append(new_li);
}