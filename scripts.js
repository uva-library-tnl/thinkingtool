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
  let synonyms = getFromStorage("synonyms");
  if (synonyms) {
    synonyms.map((s) => {
      addToList("synonyms", s);
    })
  }
  let people = getFromStorage("people");
  if (people) {
    people.map((s) => {
      addToList("people", s);
    })
  }
  let places = getFromStorage("places");
  if (places) {
    places.map((s) => {
      addToList("places", s);
    })
  }
  let dates = getFromStorage("dates");
  if (dates) {
    dates.map((s) => {
      addToList("dates", s);
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
  let div = template.querySelector(".panel-block");
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
    addToList("synonyms", $(this).val());
    $(this).val("");
  });

  $("#people input").on('change', function() {
    addToList("people", $(this).val());
    $(this).val("");
  });

  $("#places input").on('change', function() {
    addToList("places", $(this).val());
    $(this).val("");
  });

  $("#dates input").on('change', function() {
    addToList("dates", $(this).val());
    $(this).val("");
  });

  /**
   * Allows removal of an item once added
   */
  $(".panel-block.is-active button.is-danger").on('click', function() {
    $("#removeitem-modal").addClass("is-active");
    $("#removeitem-conf").attr("data-caller", $(this).closest('.panel-block').attr('id'));
    $("html").addClass("is-clipped");
  });

  $("#removeitem-conf").on('click', function() {
    let id = $(this).data('caller');
    let panelBlock = $("#" + id);
    let parent = $(panelBlock).parents('.panel').attr('id');
    $(panelBlock).remove();
    updateList(parent);
    closeRemoveItemModal();
  });

  $("#removeitem-cancel").on('click', function() {
    closeRemoveItemModal();
  });

  $(".panel-block.is-active button.is-success").on('click', function() {
    let data = $(this).closest('.panel-block').find('.list-item-data').text();
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

  $(".tags a.is-delete").on('click', function() {
    $(this).closest('.control').remove();
    updateTerms();
  });
});