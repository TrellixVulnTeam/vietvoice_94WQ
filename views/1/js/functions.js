$(document).on("click", "#menu-button", function(){
  $("#menu-container").toggle();
  if(window.innerWidth<=400){
    $("#menu-content").width(window.innerWidth-40);
  }
  if(window.innerHeight<=600){
    $("#menu-content img").css("display", "none");
  }
});
$( window ).resize(function() {
  if(window.innerWidth<=450){
    $("#menu-content").width(window.innerWidth-40);
  }
  if(window.innerHeight<=600){
    $("#menu-content img").css("display", "none");
  } else {
	$("#menu-content img").css("display", "inline-block");  
  }
});

$(document).on("click", "#exit-menu", function(){
  $("#menu-container").css("display", "none");
});
$(document).on("click", "#menu-container", function(){
  $("#exit-menu").trigger('click');
});