$(function() {
  let deck = new Deck();

  let player_card_container = $(".cards-container > ul");
  for(let i=0; i < 10; i++) {
    let card = deck.draw();
    
    let new_li = $("<li>");
    let img = $("<img>", {src:card.image, class:"card"});

    new_li.append(img);
    player_card_container.append(new_li);
  }

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