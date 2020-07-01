let saveToStorage = (obj, data) => {
  window.localStorage.setItem(obj, JSON.stringify(data));
}

let getFromStorage = (obj) => {
  return JSON.parse(window.localStorage.getItem(obj));
}

let initApp = () => {
  $("#tt1").val(function () {
    return getFromStorage("tt1") || null;
  });
  $("#tt2").val(function () {
    return getFromStorage("tt2") || null;
  });
  $("#mainidea").text(function () {
    return getFromStorage("tt2") || "Enter your main idea in Step 2 above";
  });
  let synonyms = getFromStorage("synonymtags");
  if (synonyms) {
    synonyms.map((s) => {
      addToList("synonymtags", s);
    })
  }
  let people = getFromStorage("peopletags");
  if (people) {
    people.map((s) => {
      addToList("peopletags", s);
    })
  }
  let places = getFromStorage("placetags");
  if (places) {
    places.map((s) => {
      addToList("placetags", s);
    })
  }
  let dates = getFromStorage("datetags");
  if (dates) {
    dates.map((s) => {
      addToList("datetags", s);
    })
  }
  let terms = getFromStorage("searchterms");
  if (terms) {
    terms.map((s) => {
      addToSearchTerms(s);
    })
  }
}

let closeStartOverModal = () => {
  $("html").removeClass("is-clipped");
  $("#startover-modal").removeClass("is-active");
}

let closeRemoveItemModal = () => {
  $("html").removeClass("is-clipped");
  $("#removeitem-modal").removeClass("is-active");
  $("#removeitem-conf").data("caller", "");

}

let createListItem = (data) => {
  let template = document.querySelector("#cloud-item").content.cloneNode(true);
  let div = template.querySelector(".control");
  let item = template.querySelector(".list-item-data");
  div.id = "a" + Date.now();
  item.textContent = data;
  return template;
}

let addToList = (obj, data) => {
  let id = `#${obj}`;
  let template = createListItem(data);
  $(id).append(template);
  updateList(obj);
}

let updateList = (obj) => {
  let id = `#${obj}`;
  let items = [];
  $(id).find('.list-item-data').each(function() {
    items.push($(this).text());
  });

  saveToStorage(obj, items);
}

let updateTerms = () => {
  let items = [];
  $(".tags span.is-black").each(function() {
    items.push($(this).text());
  });

  saveToStorage("searchterms", items);
}

let createSearchTerm = (data) => {
  let template = document.querySelector("#searchterm").content.cloneNode(true);
  let tag = template.querySelector("span");
  tag.textContent = data;
  return template;
}

let addToSearchTerms = (data) => {
  let template = createSearchTerm(data);
  $("#searchterms").append(template);
  updateTerms();
}

$(document).ready(function() {
  initApp();

  /**
   * Save assignment info to storage
   */
  $("#tt1").on('input', function() {
    saveToStorage("tt1", $(this).val());
  });

  /**
   * Set main idea in cloud from step 2 and save to storage
   */
  $("#tt2").on('input', function() {
    $("#mainidea").text($(this).val());
    saveToStorage("tt2", $(this).val());
  });

  /**
   * React to start over button being clicked. Pop up warning.
   */
  $("#startover").on('click', function() {
    $("#startover-modal").addClass("is-active");
    $("html").addClass("is-clipped");
  });

  /**
   * On confirmation of starting over, 
   * clear storage and reload page.
   */
  $("#startover-conf").on('click', function() {
    window.localStorage.clear();
    closeStartOverModal();
    location.reload();
  });

  /**
   * User cancelled start over
   */
  $("#startover-cancel").on('click', function() {
    closeStartOverModal();
  });

  /**
   * When user changes a list item, 
   * add to the corresponding space below it.
   */
  $("#synonyms input").on('change', function() {
    let pieces = $(this).val().split(",");
    if (pieces.length > 2) {
      pieces.map( (p) => {
        addToList("synonymtags", p.trim());
      })
    } else {
      addToList("synonymtags", $(this).val());
    }
    $(this).val("");
  });

  $("#people input").on('change', function() {
    let pieces = $(this).val().split(",");
    if (pieces.length > 2) {
      pieces.map( (p) => {
        addToList("peopletags", p.trim());
      })
    } else {
      addToList("peopletags", $(this).val());
    }
    $(this).val("");
  });

  $("#places input").on('change', function() {
    let pieces = $(this).val().split(",");
    if (pieces.length > 2) {
      pieces.map( (p) => {
        addToList("placetags", p.trim());
      })
    } else {
      addToList("placetags", $(this).val());
    }
    $(this).val("");
  });

  $("#dates input").on('change', function() {
    let pieces = $(this).val().split(",");
    if (pieces.length > 2) {
      pieces.map( (p) => {
        addToList("datetags", p.trim());
      })
    } else {
      addToList("datetags", $(this).val());
    }
    $(this).val("");
  });

  /**
   * Allows removal of an item once added.
   * Modals used to confirm deletion.
   */
  $(".tt-tags").on('click', '.is-delete', function() {
    $("#removeitem-conf").attr("data-caller", $(this).closest('.control').attr('id'));
    $("html").addClass("is-clipped");
    $("#removeitem-modal").addClass("is-active");
  });

  $("#removeitem-conf").on('click', function() {
    let id = $(this).attr('data-caller');
    let tagGroup = $("#" + id);
    let parent = $(tagGroup).closest('.tt-tags').attr('id');
    $(tagGroup).remove();
    updateList(parent);
    closeRemoveItemModal();
  });

  $("#removeitem-cancel").on('click', function() {
    closeRemoveItemModal();
  });

  /**
   * Add brainstorm items to search terms when clicked.
   * n.b. Only 4 total can be added
   */
  $(".tt-tags").on('click', '.list-item-data', function() {
    let data = $(this).text();
    if ($('#searchterms .tags').length <= 3) {
      addToSearchTerms(data);
    } else {
      bulmaToast.toast({ 
        message: "Try removing some search terms first.", 
        type: "is-danger",
        duration: 3000,
        position: "center",
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  });

  /**
   * Remove search terms when delete button clicked
   */
  $("#searchterms").on('click', ".tags a.is-delete", function() {
    $(this).closest('.control').remove();
    updateTerms();
  });

  /**
   * Toggle menu on mobile when hamburger clicked
   */
  $(".navbar-burger").on('click', function() {
    $(".navbar-menu").toggle();
  });

  /**
   * Stop user from completing Step 2 prior to 1 being finished.
   */
  $("#tt2").on('focus', function() {
    if ($("#tt1").val()) {
      return;
    } else {
      bulmaToast.toast({ 
        message: "Step 1 should be completed before addressing the main idea.", 
        type: "is-danger",
        duration: 3000,
        position: "center",
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      $(this).blur();
    }
  });

  /**
   * Stop user from completing Step 3 prior to 1 & 2 being finished.
   */
  $(".panel-block input").on('focus', function() {
    let steps12Complete = ($("#tt1").val() && $("#tt2").val());
    if (steps12Complete) {
      return;
    } else {
      bulmaToast.toast({ 
        message: "Both Steps 1 and 2 should be completed before filling out the concept cloud.", 
        type: "is-danger",
        duration: 3000,
        position: "center",
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      $(this).blur();
    }
  });

  /**
   * TODO: get PDF to work
   */
  $("#savepdf").on('click', function() {
    // let doc = new jsPDF();

    // doc.html(document.body, {
    //   callback: function (doc) {
    //     doc.save();
    //   }
    // });
  });
});