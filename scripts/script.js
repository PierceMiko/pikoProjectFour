const app = {};

app.url = `https://tastedive.com/api/similar?`;
app.key = `349895-MediaRec-TXFIUD0F`;
app.currentList = [];

app.checkQuery = (query) => {
  if(query !== ''){
    $('#bottomControls').fadeIn();
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
    app.currentList = results.Similar;
    app.showRecs(app.currentList); 
  });
  //then pass results to showRecs
}

app.showRecs = (results) => {
  //filter results
  //display results on dom
  const filteredList = app.filterRecs(results.Results);
  app.$list.empty();
  app.$list.append(`<h3>You searched for:</h3>`);
  app.$list.append(
    `<li class="userQuery">
      <div class="title">
        <i class="fas fa-plus"></i>
      	<h2>${results.Info[0].Name}</h2>
        <h3>(${results.Info[0].Type})</h3>
      </div>
      <p id="description" class="hiddenDescription">${results.Info[0].wTeaser}</p>
      <a href="${results.Info[0].wUrl}" class="wiki" target="_blank"><i class="fab fa-wikipedia-w"></i></a>
      ${results.Info[0].yUrl ? `<a href="${results.Info[0].yUrl}" class="youtube" target="_blank"><i class="fab fa-youtube"></i></a>`: ''}
    </li>`
  );
  app.$list.append(`<h3>Here are your recommendations:</h3>`);
  filteredList.forEach( (rec) => {
    let content = 
    `<li>
      <div class="title">
        <i class="fas fa-plus"></i>
      	<h2>${rec.Name}</h2>
        <h3>(${rec.Type})</h3>      
      </div>
      <p id="description" class="hiddenDescription">${rec.wTeaser}</p>
      <a href="${rec.wUrl}" class="wiki" target="_blank"><i class="fab fa-wikipedia-w"></i></a>
      `;
    rec.yUrl ? content+= `<a href="${rec.yUrl ? rec.yUrl : '#'}" class="youtube" target="_blank"><i class="fab fa-youtube"></i></a>` : ``;

    content += `</li>`;
    app.$list.append(content);
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
  const warningBox = $('.userWarning')
  warningBox.css({display: 'flex'});
  // setInterval(function() { warningBox.css({display: 'none'}); }, 5000);
  warningBox.delay(1000).fadeOut();
}

app.filterRecs = (list) => {
  const genreFilter = $('#genreFilter').val();
  if(genreFilter === 'all'){
    return list;
  }else {
    return list.filter((rec) => {
      return rec.Type === genreFilter;
    });
  }
}

app.bindEvents = () => {
  //search button
  //search bar
  //drop down filter

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

  $('ul').on('click', 'li div', function(){
    $(this).siblings('#description').toggleClass('hiddenDescription');
    $(this).find('.fas').toggleClass('rotated');
  });

  $('#genreFilter').on('change', function(){
    app.showRecs(app.currentList);
  });

  $('input').on('click', function(){
    $(this).select();
  });
  $('#expandAll').on('click', function(e){
    e.preventDefault();
    $('li p').toggleClass('hiddenDescription');
    //Cool ternary operator idea found at https://www.tutorialrepublic.com/faq/how-to-toggle-text-inside-an-element-on-click-using-jquery.php
    $(this).text($(this).text() === 'Expand All' ? 'Collapse All' : 'Expand All');
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