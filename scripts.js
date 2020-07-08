const MI_PLACEHOLDER = "Choose your main idea from Step 2 above";
var mainideatagscount = 0;
var synonymtagscount = 0;
var peopletagscount = 0;
var placetagscount = 0;
var datetagscount = 0;

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
  let mainideas = getFromStorage("mainideatags");
  if (mainideas) {
    mainideas.map((s) => {
      addToList("mainideatags", s);
    })
  }
  let miObj = getFromStorage("mainidea") || null;
  if (miObj) {
    $("#mainidea").attr('data-origid', miObj.id);
    $("#mainidea").text(miObj.text);
    disableMITag($("#" + miObj.id + " .tag"));
  } else {
    $("#mainidea").text(MI_PLACEHOLDER);
  }
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
      addToSearchTerms(s.id, s.text);
      disableTag($("#" + s.id + " .tag"));
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

let createListItem = (obj, data) => {
  let template = document.querySelector("#cloud-item").content.cloneNode(true);
  let div = template.querySelector(".control");
  let item = template.querySelector(".list-item-data");
  window[obj + "count"]++;
  div.id = obj + window[obj + "count"];
  item.textContent = data;
  return template;
}

let addToList = (obj, data) => {
  let id = `#${obj}`;
  let template = createListItem(obj, data);
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
    items.push({id : $(this).attr('data-origid'), text: $(this).text()});
  });

  saveToStorage("searchterms", items);
}

let createSearchTerm = (obj, data) => {
  let template = document.querySelector("#searchterm").content.cloneNode(true);
  let tag = template.querySelector("span");
  tag.textContent = data;
  tag.dataset.origid = obj;
  return template;
}

let addToSearchTerms = (obj, data) => {
  let template = createSearchTerm(obj, data);
  $("#searchterms").append(template);
  updateTerms();
}

let disableMITag = (obj) => {
  obj.closest('.is-grouped').find('.is-disabled').removeClass("is-disabled");
  obj.closest('.is-grouped').find('.tag').removeClass('has-background-success-dark');
  obj.addClass('has-background-success-dark');
  obj.addClass('is-disabled');
  obj.siblings().addClass("is-disabled");
}

let disableTag = (obj) => {
  obj.addClass('has-background-success-dark');
  obj.addClass('is-disabled');
  obj.siblings().addClass("is-disabled");
}

let enableTag = (obj) => {
  $(`#${obj} .tag`).removeClass("is-disabled");
  $(`#${obj} .tag`).removeClass('has-background-success-dark');
}

let createPDF = () => {
  let tt1 = getFromStorage("tt1");
  let tt2 = getFromStorage("mainideatags");
  let tt3_mi = getFromStorage("mainidea");
  let tt3_syn = getFromStorage("synonymtags");
  let tt3_peo = getFromStorage("peopletags");
  let tt3_pla = getFromStorage("placetags");
  let tt3_dat = getFromStorage("datetags");
  let tt4 = getFromStorage("searchterms");

  if (!(tt1 && tt2 && tt3_mi && tt3_syn && tt3_peo && tt3_pla && tt3_dat && tt4)) {
    bulmaToast.toast({ 
      message: "You haven't completed all the steps.", 
      type: "is-danger",
      duration: 3000,
      position: "center",
      animate: { in: 'fadeIn', out: 'fadeOut' }
    });

    return;
  }

  let sn = getFromStorage("studentname");
  let cn = getFromStorage("coursename");

  if (sn && cn) {
    $('#studentname').text(sn);
    $('#coursename').text(cn);
  } else {
    $('#pdfinfo-modal').addClass("is-active");
    $("html").addClass("is-clipped");
    $('#studentnamefield').val(sn || "");
    $('#coursenamefield').val(cn || "");

    return;
  }

  $('#pdf1 .pdfinsert').html(tt1);
  $('#pdf2 .pdfinsert').html(tt2.map(mi => {
    return `<span class='tag'>${mi}</span>`;
  }));

  $('#pdf-mainidea .pdfinsert').html(`<h2>${tt3_mi.text}</h2>`);
  $('#pdf-synonyms .pdfinsert').html(tt3_syn.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-people .pdfinsert').html(tt3_peo.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-places .pdfinsert').html(tt3_pla.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-dates .pdfinsert').html(tt3_dat.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));

  $('#pdf4 .pdfinsert').html(tt4.map(st => st.text).map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));

  let element = document.getElementById('pdf');
  var opt = {
    margin:       0,
    filename:     'thinkingtool.pdf',
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf()
  .set(opt)
  .then(() => {
    $('#pdf').show();
  })
  .from(element)
  .save()
  .then(() => {
    $('#pdf').hide();
  });
}

let closePDFInfoModal = () => {
  $("html").removeClass("is-clipped");
  $("#pdfinfo-modal").removeClass("is-active");
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
  // $("#tt2").on('input', function() {
  //   $("#mainidea").text($(this).val());
  //   saveToStorage("tt2", $(this).val());
  // });

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
    (async function() { window.scrollTo(0,0) })()
    .then(() => location.href = "");
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
  $("#mainideas input").on('change', function() {
    let pieces = $(this).val().split(",");
    if (pieces.length > 2) {
      pieces.map( (p) => {
        addToList("mainideatags", p.trim());
      })
    } else {
      addToList("mainideatags", $(this).val());
    }
    $(this).val("");
    $(this).focus();
  });

  $('.field.has-addons .control .button').on('click', function() {
    $(this).parent().siblings('.control').find('input').focus();
  });

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
  $(".mi-tags, .tt-tags").on('click', '.is-delete', function() {
    $("#removeitem-conf").attr("data-caller", $(this).closest('.control').attr('id'));
    $("html").addClass("is-clipped");
    $("#removeitem-modal").addClass("is-active");
  });

  
  $("#removeitem-conf").on('click', function() {
    let id = $(this).attr('data-caller');
    let tagGroup = $("#" + id);
    let parent = $(tagGroup).closest('.mi-tags, .tt-tags').attr('id');
    $(tagGroup).remove();
    updateList(parent);
    closeRemoveItemModal();
  });

  $("#removeitem-cancel").on('click', function() {
    closeRemoveItemModal();
  });

  /**
   * Add a main idea tag to Step 3 when clicked.
   */
  $(".mi-tags").on('click', '.list-item-data', function() {
    let data = $(this).text();
    let origid = $(this).closest('.control').attr('id');
    $('#mainidea').text(data);
    $('#mainidea').attr('data-origid', origid);
    saveToStorage("mainidea", {id: origid, text: data});
    disableMITag($(this));
  });

  /**
   * Add brainstorm items to search terms when clicked.
   * n.b. Only 4 total can be added
   */
  $(".tt-tags").on('click', '.list-item-data', function() {
    let data = $(this).text();
    let id = $(this).closest('.control').attr('id');
    if ($('#searchterms .tags').length <= 3) {
      addToSearchTerms(id, data);
      disableTag($(this));
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
    let origid = $(this).siblings(".tag").attr("data-origid");
    enableTag(origid);
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
        message: "Step 1 should be completed before brainstorming ideas.", 
        type: "is-danger",
        duration: 3000,
        position: "center",
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      $('#tt1').focus();
    }
  });

  /**
   * Stop user from completing Step 3 prior to 1 & 2 being finished.
   */
  $(".panel-block input").on('focus', function() {
    let steps12Complete = ($("#tt1").val() && $("#mainidea").text() !== MI_PLACEHOLDER);
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

  $("#savepdf").on('click', function() {
    createPDF();
  });

  $('#pdfinfo-conf').on('click', function() {
    let sn = $('#studentnamefield').val();
    let cn = $('#coursenamefield').val();

    if (sn && cn) {
      saveToStorage("studentname", sn);
      saveToStorage('coursename', cn);
      closePDFInfoModal();
      createPDF();
    } else {
      bulmaToast.toast({ 
        message: "Please enter both your name and the course name/number", 
        type: "is-danger",
        duration: 3000,
        position: "center",
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  });

  $('#pdfinfo-cancel').on('click', function() {
    closePDFInfoModal();
  });
});