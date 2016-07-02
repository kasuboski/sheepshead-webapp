import {Game} from './Game.js'; //startGame subscriber isn't called unless this is imported
import {EventHelper} from './EventHelper.js';
import {states} from './StateManager.js';
import {SheepsheadPlayer} from './SheepsheadPlayer.js';

let players = [new SheepsheadPlayer(true, 'Player1'), new SheepsheadPlayer(false, 'Comp 1'), new SheepsheadPlayer(false, 'Comp 2')];

let state = states.DEALING;

let selectedCards = [];

let user_message = $("#user-message");

$(function() {
  addListenersModalButtons();

  let stateUpdate_token = EventHelper.subscribe(EventHelper.events.UPDATE_STATE, function(msg, data) {
    state = data.state;
  });

  //subscribe to events from Game
  let picking_token = EventHelper.subscribe(EventHelper.events.ASK_TO_PICK, function(msg, data) {
    //show the modal
    $("#ask_to_pick_modal").modal('show');
  });

  let bury_token = EventHelper.subscribe(EventHelper.events.ASK_TO_BURY, function(msg, data) {
    console.log(data);
    user_message.text("Choose two cards to bury");
  });

  let update_hand_token = EventHelper.subscribe(EventHelper.events.UPDATE_HAND, function(msg, data) {
    console.log(data.reason);
    updatePlayerHandUI(data.cards);
  });

  EventHelper.publish(EventHelper.events.START_GAME, {players: players});

});

let addListenersModalButtons = function() {
  $("#pick-yes").click(function() {
    //hide the modal
    $("#ask_to_pick_modal").modal('hide');

    EventHelper.publish(EventHelper.events.PICKED, "yes");
  });

  $("#pick-no").click(function() {
    //hide the modal
    $("#ask_to_pick_modal").modal('hide');

    EventHelper.publish(EventHelper.events.PICKED, "no");
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

    if(state == states.PLAYERTURN) {
      card.parent().remove();

      //add card to played card spot remove old one
      $('#player-played-card').empty();
      //reset style
      card.removeAttr('style');
      $('#player-played-card').append(card);
    } else if(state == states.PICKING) {
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

          user_message.text("");
          EventHelper.publish(EventHelper.events.USER_BURY, {player: players[0], cards: cardsToBury});
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