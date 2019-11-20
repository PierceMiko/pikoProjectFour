const app = {};

app.url = `https://tastedive.com/api/similar?`;
app.key = `349895-MediaRec-TXFIUD0F`;

app.getRecs = (query) => {
  //ajax call
  $.ajax(
    {
      url: app.url,
      method: 'GET',
      dataType: 'jsonp',
      data: {
        k: app.key,
        q: query,
        info: 1
      }
    }
  ).then( (response) => { app.showRecs(response); });
  //then pass results to showRecs
}

app.showRecs = (results) => {
  //filter results
  //display results on dom
  // console.log(results.Similar.Results);
  results.Similar.Results.forEach((rec) => {
    $('ul').append(`<li>${rec.Name}</li>`);
  })
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
  app.getRecs('up');
}

$(document).ready(function(){
  app.init();
});