import {Game} from './Game.js'; //startGame subscriber isn't called unless this is imported
import {EventHelper} from './EventHelper.js';
import {states} from './StateManager.js';
import {SheepsheadPlayer} from './SheepsheadPlayer.js';
import {AIUtil} from './AIUtil.js';

let players = [new SheepsheadPlayer(true, 'Player1'), new SheepsheadPlayer(false, 'Comp 1'), new SheepsheadPlayer(false, 'Comp 2')];

let state = states.DEALING;

let selectedCards = [];

let user_message = $("#user-message");

let trick = [];

const WAIT_TIME_BTW_PLAYERS = 2000;

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

  let play_card_token = EventHelper.subscribe(EventHelper.events.ASK_TO_PLAY, function(msg, data) {
    user_message.text("Pick a card to play");
  });

  let comp_player_played_token = EventHelper.subscribe(EventHelper.events.COMP_PLAYER_PLAYED, function(msg, data) {
    console.log(`Player ${data.player.name} played ${data.card}`);
    updateCompPlayerHandUI(data.player, data.card);

    //wait a bit before moving to next player
    setTimeout(() => {
      EventHelper.publish(EventHelper.events.COMP_PLAYER_UPDATED);
    }, WAIT_TIME_BTW_PLAYERS);
    
  });

  let new_trick_token = EventHelper.subscribe(EventHelper.events.NEW_TRICK, function(msg, data) {
    handleNewTrick();
  });

  let update_trick_token = EventHelper.subscribe(EventHelper.events.UPDATE_TRICK, function(msg, data) {
    trick = data.trick;
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

let updateCompPlayerHandUI = function(player, card) {
  // determine which comp
  const playerIndex = players.indexOf(player);

  // update comp played card
  let cardContainer;
  let handElements;
  let rotatedClass;
  switch(playerIndex) {
    case 1:
      cardContainer = $("#left-played-card");
      rotatedClass = 'rotated-right';
      handElements = $("#left-player-hand ul li");
      break;
    case 2:
      cardContainer = $("#right-played-card");
      rotatedClass = 'rotated-left';
      handElements = $("#right-player-hand ul li");
      break;
    default:
      throw 'Only valid for computer player';
      break;
  }

  //create image
  let img = $('<img>', {src:card.image, class: `card ${rotatedClass}`});
  //remove old card
  cardContainer.empty();
  //add new one
  cardContainer.append(img);

  //remove card from the comp player cards shown on sides
  handElements.last().remove();
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
    let card = $(this);
    let player_card = players[0].hand[card.attr('data-index')];
    // console.log(players[0].hand[card.attr('data-index')]);

    //TODO: Don't let player play when it's not their turn
    if(state == states.PLAYERTURN) {
      playerTurnClickHandler(card, player_card);
    } else if(state == states.PICKING) {
      pickingClickHandler(card);
    }

  });
}

let playerTurnClickHandler = function(card, player_card) {
  //TODO: make sure card is legal
  if(!AIUtil.isCardLegal(trick, players[0].hand, player_card)) {
    console.log(`Card ${player_card} is illegal`);
    return false;
  }


  //remove card from view
  card.parent().remove();

  //add card to played card spot remove old one
  $('#player-played-card').empty();
  //reset style
  card.removeAttr('style');
  $('#player-played-card').append(card);

  //clear user_message
  user_message.text("");

  //wait a bit to send played card
  setTimeout(() => {
    //send played card
    EventHelper.publish(EventHelper.events.PLAYED_CARD, {player: players[0], card: player_card});
  }, WAIT_TIME_BTW_PLAYERS);
}

let pickingClickHandler = function(card) {
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

let handleNewTrick = function() {
  //reset played cards to back of cards
  const leftPlayedCard = $('#left-played-card');
  const rightPlayedCard = $('#right-played-card');
  const playerPlayedCard = $('#player-played-card');

  const backImage = "images/playingcards/PNG-cards-1.3/back.png";

  const leftCard = $('<img>', {src:backImage, class:'card rotated-right'});
  const rightCard = $('<img>', {src:backImage, class:'card rotated-left'});
  const playerCard = $('<img>', {src:backImage, class:'card'});

  leftPlayedCard.empty();
  rightPlayedCard.empty();
  playerPlayedCard.empty();

  leftPlayedCard.append(leftCard);
  rightPlayedCard.append(rightCard);
  playerPlayedCard.append(playerCard);
}

let addCardtoUI = function(card, index) {
  let player_card_container = $('.cards-container > ul');

  //create card and append to card container div
  let new_li = $('<li>');
  let img = $('<img>', {src:card.image, class:'card', 'data-index': index});

  new_li.append(img);
  player_card_container.append(new_li);
}