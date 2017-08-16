console.log('Loaded!');
//alert ('modified main.js');
//var element = document.getElementById('main-text');
//element.innerHTML = "new text modified by main.js";
var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight() {
    marginLeft = marginLeft + 5;
    img.style.marginLeft= marginLeft + 'px';
}
img.onclick=function() {
  var interval = setInterval(moveRight,50);
};