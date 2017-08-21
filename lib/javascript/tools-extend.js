
//import notie from 'notie'

var utilsApiEnpoint = '//utils.dev/api/genre/add';
var currentData = {};
var previousEdit = '';
var currentForm = {};


function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

// Cookies
function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    if (days) {
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }
    var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";

  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

//assuming "b" contains a subsequence containing
//all of the letters in "a" in the same order
function getDifference(a, b)
{
    var i = 0;
    var j = 0;
    var result = "";

    while (j < b.length)
    {
        if (a[i] != b[j] || i == a.length)
            result += b[j];
        else
            i++;
        j++;
    }
    return result;
}

// Wait for element to exist.
function elementLoaded(el, cb) {
  if ($(el).length) {
    console.debug('elementLoaded');
    cb($(el));
  } else {
    // Repeat every 500ms.
    setTimeout(function() {
      elementLoaded(el, cb)
    }, 500);
  }
}


// Wait for element gone.
function elementNotLoaded(el, cb) {
  if (!$(el).length) {
    console.debug('elementNotLoaded');
    setTimeout(function() {
      elementNotLoaded(el, cb)
    }, 500);
  } else {

    cb($(el));
  }
}

function searchElement() {
  elementLoaded('.edit_dialog_content', function(el) {
    // Element is ready to use.
    currentForm = el;

    //console.debug(currentForm.attr('id'));

    currentData = getFormData(currentForm);
    previousEdit = currentData.edit_tags;

    notie.alert({ type: 2, text: 'Only Tags/Genres working now!', time: 5});
  });
}

elementNotLoaded('.edit_dialog_content', function(el) {
  searchElement();
});

searchElement();

/*
$(document).on('click', '.tagit-new', function(){

});
*/

$(document).on('click', ".ui-dialog-buttonset span:contains('Save')" , function() {
  currentData = getFormData(currentForm);

  //console.debug(previousEdit);
  //console.debug(currentData.edit_tags);
  //console.debug(getDifference(previousEdit, currentData.edit_tags));

  $.getJSON(utilsApiEnpoint, {
      edit_tags: typeof previousEdit == "undefined" ? currentData.edit_tags : getDifference(previousEdit, currentData.edit_tags),
      object_id: currentData.id,
      object_type: currentData.type.replace('_row', ''),
      user: readCookie('ampache_user')
  },
  function(response) {

    if (response.length) {

      notie.alert({ type: 'success', text: 'Tune successfully Genred!', time: 2 }); // Hides after 2 seconds

      $('#editdialog').dialog('close');

      var reloadp = window.location;
      var hash = window.location.hash.substring(1);
      if (hash && hash.indexOf('.php') > -1) {
        reloadp = jsWebPath + '/' + hash;
      }
      loadContentPage(reloadp);
      searchElement();
    }
  },
  function(error) {
    notie.alert({ type: 3, text: 'Ouch... something goes wrong!', stay: true});
  });

});
