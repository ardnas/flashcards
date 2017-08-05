
// Client ID and API key from the Developer Console
var CLIENT_ID = '179033791357-n7ibolgj4ha87fc0mqs8odiiednq1q12.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';
    listFlashcards();
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


function appendCard(order,title, subtitle) {
  $('.flashcard-container').append("<div class='flashcard-wrapper' id="+order+" style='order:"+order+";'><div class='flashcard'><div class='title'>"+title+"</div><div class='subtitle'>"+subtitle+"</div></div><img class='star' src='assets/noun_5432_cc.svg'></div>")
  // $('.flashcard:last-child').append("<div class='title'>"+title+"</div>")
  // $('.flashcard:last-child').append("<div class='subtitle'>"+subtitle+"</div>")
  // $('.flashcard:last-child').append("<img class='star' src='assets/noun_5432_cc.svg'></div>")
}     

function listFlashcards() {
  gapi.client.sheets.spreadsheets.values.get({
    //ET 2 spreadsheetId: '1LqpqjqSFF_wqj8CVSrcw50gC0VTfJJwz3vIln3ctQnM',
    spreadsheetId: '1BM6OatEmHnZDN-uolI1qqn9kSHzzsBDVAEpHPOvwvzI',
    range: 'Sheet1!A1:B',
  }).then(function(response) {
    var range = response.result;
    // numCards = range.values.length;
    numCardsArray = [];
    if (range.values.length > 0) {
      // appendCard('Reference, Verse:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        // appendCard(row[0] + ', ' + row[1]);
        appendCard(i,row[0],row[1]);
        numCardsArray.push(i);
      }
    } else {
      console.log('No data found.');
    }
  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}

//Fisher-Yates shuffle
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function shuffleCards(){
  var shuffledArray = shuffle(numCardsArray);
  $('.flashcard-wrapper').each(function(index){
    $( this ).css('order', shuffledArray[index]);
  });
}

function testMode(){
  $('.subtitle').hide();
}

function resetCards(){
  numCardsArray.sort();
  console.log(numCardsArray);
  $('.flashcard').each(function(index){
    $( this ).css('order', numCardsArray[index]);
  });
  $('.subtitle').show();
}

$( document ).ready(function() {
  $('body').on('click', '.flashcard', function(){
    $('.subtitle', this ).toggle();
  })
  $('body').on('click','img.star', function(){
    $( this ).prev('.flashcard').css('background-color','#f5aea7');
  })
});

