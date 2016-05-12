$(function() {
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