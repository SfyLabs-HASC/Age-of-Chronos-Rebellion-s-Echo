$(window).on('load', function(){
  $('.player .hex_button:not(.claimed)').mouseenter(function(){
    $(this).closest('.player').find('.back').css({'opacity' : '1'});
  });

  $('.player .hex_button:not(.claimed)').mouseleave(function(){
    $(this).closest('.player').find('.back').css({'opacity' : '0'});
  });
}); 