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
  ).then( (results) => { 
    app.showRecs(results); 
  });
  //then pass results to showRecs
}

app.showRecs = (results) => {
  //filter results
  //display results on dom
  console.log(results.Similar.Info);
  app.$list.empty();
  app.$list.append(`<li class="userQuery">${results.Similar.Info[0].Name}</li>`)
  results.Similar.Results.forEach( (rec) => {
    app.$list.append(`<li>${rec.Name}</li>`);
  });
  //Scroll to list
  const y = $('main').offset().top;
  $("html, body").animate({ scrollTop: y }, 750, "swing");
}

app.showApiError = () => {
  //display errors on around search bars
  //display "no recs found" in results area
  // $('ul').empty();
  $('ul').html(`<li> </li>`);

}

app.showUserError = () => {
  const warningBox = $('#userWarning')
  warningBox.css({display: 'flex'});
  // setInterval(function() { warningBox.css({display: 'none'}); }, 5000);
  warningBox.delay(1000).fadeOut();
}


app.bindEvents = () => {
  //search button
  //search bar
  //drop down filter

  $('form').on('submit', function(event){
    event.preventDefault();
    const query = $('#searchMedia').val();
    if(query !== ''){
      app.getRecs(query);
    }else{
      app.showUserError();
    }
  });
}

app.getDomElements = () => {
  app.$list = $('ul');
}


app.init = () => {
  app.getDomElements();
  app.bindEvents();
}

$(document).ready(function(){
  app.init();
});