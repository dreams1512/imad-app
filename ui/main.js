//counter code 
var button = document.getElementById('counter');
button.onclick = function(){
    //create a request object
    var request = new XMLHttpRequest();
    
    //capture the response and store in a variable
    request.onreadystatechange = function() {
       if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
       {
         var counter = request.responseText;
         var span = document.getElementById('count');
         span.innerHTML = counter.toString();
       } 
    };
    //make a request
    request.open('GET', "http://dreams1512.imad.hasura-app.io/counter", true);
    request.send('null');
};

//submit name
var nameInput = document.getElementById("name");
var name = nameInput.value;
var submit= document.getElementById("submit_btn");
submit.onclick = function(){
  //make a request to the server and send the name
  
  //capture the list of name and render it as a undfined list
  var names = ["name1","name2","name3","name4"];
  var list = " ";
  for (var i=1; i < names.length; i++)
  {
     list+= '<li>' + names[i] + '</li>'; 
  }
  
  
};