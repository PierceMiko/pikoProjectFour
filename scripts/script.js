const app = {};

app.getRecs = () => {
  //ajax call
  //then pass results to showRecs
}

app.showRecs = () => {
  //filter results
  //display results on dom
}

app.showError = () => {
  //display errors on around search bars
  //display "no recs found" in results area
}

app.bindEvents = () => {
  //search button
  //search bar
  //drop down filter
}



app.init = () => {
  console.log("Document Loaded");
}

$(document).ready(function(){
  app.init();
});