$(document).ready(function() {
  $("#tt2").on('keyup', function() {
    console.log($(this).val());
    $("#mainidea").text($(this).val());
  });
});