$(function() {
  let deck = new Deck();

  let players = [new Player(true, "Player1"), new Player(false, "Comp 1"), new Player(false, "Comp 2")];

  players.forEach(player => {
    for(let i=0; i < 10; i++) {
      player.hand.push(deck.draw());
    }
  });

  players[0].hand.forEach(function(card, index, array) {
    addCardtoUI(card, index);
  });

  //animate bottom cards on hover
  let bottom_cards = $(".cards-container > ul > li > .card");
  bottom_cards.hover(function() {
    $(this).stop().animate({
        top: -25
    }, 200, "linear");
  }, function() {
      $(this).stop().animate({
          top: 0
      }, 200, "linear");
  });

  //add click listeners to bottom cards
  bottom_cards.click(function() {
    //remove card from view
    let card = $(this);
    card.parent().remove();

    //add card to played card spot remove old one
    $("#player-played-card").empty();
    //reset style
    card.removeAttr("style");
    $("#player-played-card").append(card);
  });

});

let addCardtoUI = function(card, index) {
  let player_card_container = $(".cards-container > ul");

  //create card and append to card container div
  let new_li = $("<li>");
  let img = $("<img>", {src:card.image, class:"card", 'data-index': index});

  new_li.append(img);
  player_card_container.append(new_li);
}