const app = {};

app.url = `https://tastedive.com/api/similar?`;
app.key = `349895-MediaRec-TXFIUD0F`;
app.currentList = [];

app.checkQuery = (query) => {
  if(query !== ''){
    $('#bottomControls').fadeIn();
    $('footer').removeClass('visuallyHidden');
    app.getRecs(query);
  }else{
    app.showUserError();
  }
}

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
    if(results.error === undefined){
      //then pass results to showRecs
      app.currentList = results.Similar;
      app.showRecs(app.currentList); 
    }else{
      app.showApiError(results);
    }
  }).fail((error) => {
    app.showApiError(error)
  });
}

app.showRecs = (results) => {
  //filter results
  //display results on dom
  const filteredList = app.filterRecs(results.Results);
  app.$list.css({display: 'none'});
  //Get rid of anything in the list
  app.$list.empty();
  //Add the H3
  app.$list.append(`<li class="resultHeader"><h3>You searched for:</h3></li>`);
  //Add what the user searched for
  app.$list.append(
    `<li class="userQuery">
      <div class="title">
        <i class="fas fa-plus"></i>
      	<h2>${results.Info[0].Name}</h2>
        <h3>(${results.Info[0].Type})</h3>
      </div>
      <div id="description" class="description hiddenDescription">
        <p>${results.Info[0].wTeaser ? `${results.Info[0].wTeaser}`: 'Media not found.'}</p>
      </div>
      ${results.Info[0].wUrl ? `<a href="${results.Info[0].wUrl}" class="wiki" target="_blank"><i class="fab fa-wikipedia-w"></i></a>`: ''}
      ${results.Info[0].yUrl ? `<a href="${results.Info[0].yUrl}" class="youtube" target="_blank"><i class="fab fa-youtube"></i></a>`: ''}
    </li>`
  );
  //Add another h3
  app.$list.append(`<li class="resultHeader"><h3>Here are your recommendations:</h3></li>`);
  //If there are no results, display that
  if(filteredList.length === 0){
    app.$list.append(
      `<li>
        <p>No recommendations found.</p>
      </li>`
    );
  }
  
  //For each item in the filtered list display it as a list item
  filteredList.forEach( (rec) => {
    const content = 
    `<li>
      <div class="title">
        <i class="fas fa-plus"></i>
      	<h2>${rec.Name}</h2>
        <h3>(${rec.Type})</h3>      
      </div>
      <div id="description" class="description hiddenDescription">
        <p >${rec.wTeaser}</p>
        <button data-name="${rec.Name}">Find more like <em>${rec.Name}</em></button>
      </div>
      <a href="${rec.wUrl}" class="wiki" target="_blank"><i class="fab fa-wikipedia-w"></i></a>
      ${rec.yUrl ? `<a href="${rec.yUrl}" class="youtube" target="_blank"><i class="fab fa-youtube"></i></a>`: ''}
      </li>`;
    
    app.$list.append(content);
  });
  //Fade in the list
  app.$list.fadeIn();
  //Scroll to list
  const y = $('main').offset().top;
  $('html, body').animate({ scrollTop: y }, 750, 'swing');
}

app.showApiError = (error) => {
  //display errors on around search bars
  //display "no recs found" in results area
  if(error.error === undefined){
    
  }else{
    $('#searchMedia').val(error.error);
    $('#searchMediaBottom').val(error.error);
  }
}

app.showUserError = () => {
  const warningBox = $('.userWarning');
  //Show the warning boxes
  warningBox.css({display: 'flex'});
  //After 1000 seconds, fade the warnings out
  warningBox.delay(1000).fadeOut();
}

app.filterRecs = (list) => {
  //Get the value from the drop down list
  const genreFilter = $('#genreFilter').val();
  //If the dropdown is selected to be 'all', then don't filter
  if(genreFilter === 'all'){
    return list;
  }else {
    //Return a filtered list where the recommendation's type is what the dropdown is set to
    return list.filter((rec) => {
      return rec.Type === genreFilter;
    });
  }
}

app.bindEvents = () => {
  //For both top and bottom search buttons, pass the queries to the checkQuery function
  $('#topSearch').on('submit', function(event){
    event.preventDefault();
    const query = $('#topSearch input').val();
    $('#bottomSearch input').val(query);
    app.checkQuery(query);
  });
  $('#bottomSearch').on('submit', function(event){
    event.preventDefault();
    const query = $('#bottomSearch input').val();
    $('#topSearch input').val(query);
    app.checkQuery(query);
  });

  //For the divs in the list, if they're clicked get the description sibling and expand it
  app.$list.on('click', 'li div', function(){
    $(this).siblings('#description').toggleClass('hiddenDescription');
    $(this).find('.fas').toggleClass('rotated');
  });

  //When the user changes the filter choice, show recs based (where it will also get filtered)
  $('#genreFilter').on('change', function(){
    app.showRecs(app.currentList);
    //Set the expand/collapse all button back to default state
    $('#expandAll')
      .text('Expand All')
      .data().state = 'collapsed';
  });

  //When the user clicks on the inputs, have them select all the text
  $('input').on('click', function(){
    $(this).select();
  });
  //When the user hits the expand / collapse all button, update the button text, and 'toggle' the expandable descriptions
  $('#expandAll').on('click', function(e){
    e.preventDefault();
    if($(this).data().state === 'collapsed'){
      $(this).data().state = 'expanded';
      $('li .description').removeClass('hiddenDescription');
      $(this).text('Collapse All');
    }else{
      $(this).data().state = 'collapsed';
      $('li .description').addClass('hiddenDescription');
      $(this).text('Expand All');
    }
  });

  //On user hitting the "Find more like ___" button in the descriptions pass the stored data value to getRecs()
  app.$list.on('click', 'li button', function(){
    const newQuery = $(this).data().name;
    app.getRecs(newQuery);
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