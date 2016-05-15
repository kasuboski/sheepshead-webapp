$(function() {
  let deck = new Deck(loadCards);

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
    // console.log(players[0].hand[card.attr('data-index')]);
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

//load cards for sheepshead
let loadCards = function(cards) {
  for(let suit=0; suit < 4; suit++) {
    let rank = 0;
    for(let i=7; i <= 9; i++) {
        rank = (suit == 3) ? i : i-6; //if suit is diamonds the rank is higher
        cards.push(new Card(i, suits[suit], rank, 0, `images/playingcards/PNG-cards-1.3/${Card.getName(i)}_of_${suits[suit]}.png`));
    }

    //king
    cards.push(new Card(12, suits[suit], rank+1, 4, `images/playingcards/PNG-cards-1.3/king_of_${suits[suit]}.png`));
    //10
    cards.push(new Card(10, suits[suit], rank+2, 10, `images/playingcards/PNG-cards-1.3/10_of_${suits[suit]}.png`));
    //ace
    cards.push(new Card(14, suits[suit], rank+3, 11, `images/playingcards/PNG-cards-1.3/ace_of_${suits[suit]}.png`));

    //jacks
    cards.push(new Card(11, suits[suit], 16-suit, 2, `images/playingcards/PNG-cards-1.3/jack_of_${suits[suit]}.png`));    
    //queens
    cards.push(new Card(12, suits[suit], 20-suit, 3, `images/playingcards/PNG-cards-1.3/queen_of_${suits[suit]}.png`));
  }

}