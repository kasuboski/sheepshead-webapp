$(function() {
  let deck = new Deck();

  let players = [new Player(true, "Player1"), new Player(false, "Comp 1"), new Player(false, "Comp 2")];

  players.forEach(player => {
    for(let i=0; i < 10; i++) {
      player.hand.push(deck.draw());
    }
  });

  players[0].hand.forEach(card => {
    addCardtoUI(card);
  });

    //animate bottom cards on hover
  $(".cards-container > ul > li > .card").hover(function() {
    $(this).stop().animate({
        top: -25
    }, 200, "linear");
  }, function() {
      $(this).stop().animate({
          top: 0
      }, 200, "linear");
  });
});

let addCardtoUI = function(card) {
  let player_card_container = $(".cards-container > ul");

  //create card and append to card container div
  let new_li = $("<li>");
  let img = $("<img>", {src:card.image, class:"card"});

  new_li.append(img);
  player_card_container.append(new_li);
}