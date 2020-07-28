const MI_PLACEHOLDER = 'Choose your main idea from Step 2 above';
var synonymtagscount = 0;
var peopletagscount = 0;
var placetagscount = 0;
var datetagscount = 0;
var misctagscount = 0;

const $ = jQuery;

const saveToStorage = (obj, data) => {
  window.localStorage.setItem(obj, JSON.stringify(data));
};

const getFromStorage = (obj) => {
  return JSON.parse(window.localStorage.getItem(obj));
};

const initApp = () => {
  $('#tt1').val(function () {
    return getFromStorage('tt1') || null;
  });
  $('#tt2').val(function () {
    return getFromStorage('tt2') || null;
  });
  $('#mainidea').text(getFromStorage('tt2'));
  const synonyms = getFromStorage('synonymtags');
  if (synonyms) {
    synonyms.map((s) => {
      addToList('synonymtags', s);
    });
  }
  const people = getFromStorage('peopletags');
  if (people) {
    people.map((s) => {
      addToList('peopletags', s);
    });
  }
  const places = getFromStorage('placetags');
  if (places) {
    places.map((s) => {
      addToList('placetags', s);
    });
  }
  const dates = getFromStorage('datetags');
  if (dates) {
    dates.map((s) => {
      addToList('datetags', s);
    });
  }
  const misc = getFromStorage('misctags');
  if (misc) {
    misc.map((s) => {
      addToList('misctags', s);
    });
  }
  const terms = getFromStorage('searchterms');
  if (terms) {
    terms.map((s) => {
      addToSearchTerms(s.id, s.text);
      disableTag($('#' + s.id + ' .tag'));
    });
  }
};

const closeStartOverModal = () => {
  $('html').removeClass('is-clipped');
  $('#startover-modal').removeClass('is-active');
};

const closeRemoveItemModal = () => {
  $('html').removeClass('is-clipped');
  $('#removeitem-modal').removeClass('is-active');
  $('#removeitem-conf').data('caller', '');
};

const createListItem = (obj, data) => {
  const template = document.querySelector('#cloud-item').content.cloneNode(true);
  const div = template.querySelector('.control');
  const item = template.querySelector('.list-item-data');
  window[obj + 'count']++;
  div.id = obj + window[obj + 'count'];
  item.textContent = data;
  return template;
};

const addToList = (obj, data) => {
  const id = `#${obj}`;
  const template = createListItem(obj, data);
  $(id).append(template);
  updateList(obj);
};

const updateList = (obj) => {
  const id = `#${obj}`;
  const items = [];
  $(id).find('.list-item-data').each(function () {
    items.push($(this).text());
  });

  saveToStorage(obj, items);
};

const updateTerms = () => {
  const items = [];
  $('.tags span.is-black').each(function () {
    items.push({ id: $(this).attr('data-origid'), text: $(this).text() });
  });

  saveToStorage('searchterms', items);
};

const createSearchTerm = (obj, data) => {
  const template = document.querySelector('#searchterm').content.cloneNode(true);
  const tag = template.querySelector('span');
  tag.textContent = data;
  tag.dataset.origid = obj;
  return template;
};

const addToSearchTerms = (obj, data) => {
  const template = createSearchTerm(obj, data);
  $('#searchterms').append(template);
  updateTerms();
};

const disableTag = (obj) => {
  obj.addClass('has-background-success-dark');
  obj.addClass('is-disabled');
  obj.siblings().addClass('is-disabled');
};

const enableTag = (obj) => {
  $(`#${obj} .tag`).removeClass('is-disabled');
  $(`#${obj} .tag`).removeClass('has-background-success-dark');
};

const prepPDF = () => {
  const sn = getFromStorage('studentname');
  const cn = getFromStorage('coursename');

  $('#pdfinfo-modal').addClass('is-active');
  $('html').addClass('is-clipped');
  $('#studentnamefield').val(sn || '');
  $('#coursenamefield').val(cn || '');
};

const createPDF = () => {
  const tt1 = getFromStorage('tt1');
  const tt2 = getFromStorage('tt2');
  const tt3MI = getFromStorage('tt2');
  const tt3Syn = getFromStorage('synonymtags');
  const tt3Peo = getFromStorage('peopletags');
  const tt3Pla = getFromStorage('placetags');
  const tt3Dat = getFromStorage('datetags');
  const tt3Msc = getFromStorage('misctags');
  const tt4 = getFromStorage('searchterms');

  if (!(tt1 && tt2 && tt3MI && tt3Syn && tt3Peo && tt3Pla && tt3Dat && tt4)) {
    bulmaToast.toast({
      message: "You haven't completed all the steps.",
      type: 'is-danger',
      duration: 3000,
      position: 'center',
      animate: { in: 'fadeIn', out: 'fadeOut' }
    });

    return;
  }

  const sn = getFromStorage('studentname');
  const cn = getFromStorage('coursename');

  $('#studentname').text(sn || '');
  $('#coursename').text(cn || '');

  $('#pdf1 .pdfinsert').html(tt1);
  $('#pdf2 .pdfinsert').text(tt2);
  $('#pdf-mainidea .pdfinsert').html(`<h2>${tt3MI}</h2>`);
  $('#pdf-synonyms .pdfinsert').html(tt3Syn.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-people .pdfinsert').html(tt3Peo.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-places .pdfinsert').html(tt3Pla.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-dates .pdfinsert').html(tt3Dat.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));
  $('#pdf-misc .pdfinsert').html(tt3Msc.map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));

  $('#pdf4 .pdfinsert').html(tt4.map(st => st.text).map(tt => {
    return `<span class='tag'>${tt}</span>`;
  }));

  const element = document.getElementById('pdf');
  var opt = {
    margin: 0,
    filename: 'thinkingtool.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
};

const closePDFInfoModal = () => {
  $('html').removeClass('is-clipped');
  $('#pdfinfo-modal').removeClass('is-active');
};

$(document).ready(function () {
  initApp();

  /**
   * Save assignment info to storage
   */
  $('#tt1').on('input', function () {
    saveToStorage('tt1', $(this).val());
  });

  /**
   * Set main idea in cloud from step 2 and save to storage
   */
  $('#tt2').on('input', function () {
    $('#mainidea').text($(this).val());
    saveToStorage('tt2', $(this).val());
  });

  /**
   * React to start over button being clicked. Pop up warning.
   */
  $('#startover').on('click', function () {
    $('#startover-modal').addClass('is-active');
    $('html').addClass('is-clipped');
  });

  /**
   * On confirmation of starting over,
   * clear storage and reload page.
   */
  $('#startover-conf').on('click', function () {
    window.localStorage.clear();
    closeStartOverModal();
    (async function () { window.scrollTo(0, 0); })()
      .then(() => {
        window.location.href = '';
      });
  });

  /**
   * User cancelled start over
   */
  $('#startover-cancel').on('click', function () {
    closeStartOverModal();
  });

  $('.field.has-addons .control .button').on('click', function () {
    $(this).parent().siblings('.control').find('input').focus();
  });

  $('#synonyms input').on('change', function () {
    const pieces = $(this).val().split(',');
    if (pieces.length > 2) {
      pieces.map((p) => {
        addToList('synonymtags', p.trim());
      });
    } else {
      addToList('synonymtags', $(this).val());
    }
    $(this).val('');
  });

  $('#people input').on('change', function () {
    const pieces = $(this).val().split(',');
    if (pieces.length > 2) {
      pieces.map((p) => {
        addToList('peopletags', p.trim());
      });
    } else {
      addToList('peopletags', $(this).val());
    }
    $(this).val('');
  });

  $('#places input').on('change', function () {
    const pieces = $(this).val().split(',');
    if (pieces.length > 2) {
      pieces.map((p) => {
        addToList('placetags', p.trim());
      });
    } else {
      addToList('placetags', $(this).val());
    }
    $(this).val('');
  });

  $('#dates input').on('change', function () {
    const pieces = $(this).val().split(',');
    if (pieces.length > 2) {
      pieces.map((p) => {
        addToList('datetags', p.trim());
      });
    } else {
      addToList('datetags', $(this).val());
    }
    $(this).val('');
  });

  $('#misc input').on('change', function () {
    const pieces = $(this).val().split(',');
    if (pieces.length > 2) {
      pieces.map((p) => {
        addToList('misctags', p.trim());
      });
    } else {
      addToList('misctags', $(this).val());
    }
    $(this).val('');
  });

  /**
   * Allows removal of an item once added.
   * Modals used to confirm deletion.
   */
  $('.mi-tags, .tt-tags').on('click', '.is-delete', function () {
    $('#removeitem-conf').attr('data-caller', $(this).closest('.control').attr('id'));
    $('html').addClass('is-clipped');
    $('#removeitem-modal').addClass('is-active');
  });

  $('#removeitem-conf').on('click', function () {
    const id = $(this).attr('data-caller');
    const tagGroup = $('#' + id);
    const parent = $(tagGroup).closest('.mi-tags, .tt-tags').attr('id');
    $(tagGroup).remove();
    updateList(parent);
    closeRemoveItemModal();
  });

  $('#removeitem-cancel').on('click', function () {
    closeRemoveItemModal();
  });

  /**
   * Add brainstorm items to search terms when clicked.
   * n.b. Only 4 total can be added
   */
  $('.tt-tags').on('click', '.list-item-data', function () {
    const data = $(this).text();
    const id = $(this).closest('.control').attr('id');
    if ($('#searchterms .tags').length <= 3) {
      addToSearchTerms(id, data);
      disableTag($(this));
    } else {
      bulmaToast.toast({
        message: 'Try removing some search terms first.',
        type: 'is-danger',
        duration: 3000,
        position: 'center',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  });

  /**
   * Remove search terms when delete button clicked
   */
  $('#searchterms').on('click', '.tags a.is-delete', function () {
    const origid = $(this).siblings('.tag').attr('data-origid');
    enableTag(origid);
    $(this).closest('.control').remove();
    updateTerms();
  });

  /**
   * Toggle menu on mobile when hamburger clicked
   */
  $('.navbar-burger').on('click', function () {
    $('.navbar-menu').toggle();
  });

  /**
   * Stop user from completing Step 2 prior to 1 being finished.
   */
  $('#tt2').on('focus', function () {
    if (!($('#tt1').val())) {
      bulmaToast.toast({
        message: 'Step 1 should be completed before brainstorming ideas.',
        type: 'is-danger',
        duration: 3000,
        position: 'center',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      $('#tt1').focus();
    }
  });

  /**
   * Stop user from completing Step 3 prior to 1 & 2 being finished.
   */
  $('.panel-block input').on('focus', function () {
    const steps12Complete = ($('#tt1').val() && $('#tt2').val() !== MI_PLACEHOLDER);
    if (!steps12Complete) {
      bulmaToast.toast({
        message: 'Both Steps 1 and 2 should be completed before filling out the concept cloud.',
        type: 'is-danger',
        duration: 3000,
        position: 'center',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      $(this).blur();
    }
  });

  $('#savepdf').on('click', function () {
    prepPDF();
  });

  $('#pdfinfo-conf').on('click', function () {
    const sn = $('#studentnamefield').val();
    const cn = $('#coursenamefield').val();

    saveToStorage('studentname', sn);
    saveToStorage('coursename', cn);
    closePDFInfoModal();
    createPDF();
  });

  $('#pdfinfo-cancel').on('click', function () {
    closePDFInfoModal();
  });
});
