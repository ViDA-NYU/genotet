// var count = 0;

$('.panel-manager').load('panel-manager/panel-manager.html');
$('#slidebar').on('click', toggleSlideBar);

var PanelManager = {
//$(document).ready(function(){
//  $('#btn-add').click(function(e){
  addPanel: function(e){
//     count++;
    var count = $('.sideways').children().length;
//    e.preventDefault();
//    $('.sideways').append('<li id="li'+count+'"><a href="#view'+count+'" data-toggle="tab">view'+count+'</a></li>');
    $('.sideways').append('<li id="li'+count+'"><a href="#view'+count+'" data-toggle="tab">'+viewName+'</a></li>');
    $('.tab-content').append('<div class="tab-pane" id="view'+count+'">property'+count+'</div>');
    $('#li'+count+' a[href="#view'+count+'"]').tab('show');
    $('.panel-manager').css('display','inline');
    if ($('#slidebar').css('right') == '0px'){ $('#slidebar').trigger('click'); }
  };
//  $('#btn-remove').click(function(e){
//  $.when($.ajax(ViewManager.closeView())).done(function(e){
  removePanel: function(e){
    var count = $('.sideways').children().length - 1;
    var actived = false;
    if ($('#li'+count).hasClass('active') == true){ actived = true; }
    $('#li'+count).remove();
    $('#view'+count).remove();
    count--;
    if (actived == true){ $('#li'+count+' a[href="#view'+count+'"]').tab('show'); }
    $('.panel-manager').css('display', count > -1 ? 'inline' : 'none');
//  });
  }
//  $('#btn-closeAll').click(function(e){
//  $.when(ViewManager.closeAllViews()).done(function(e){
//    $('.sideways').empty();
//    $('.tab-content').empty();
//    $('.panel-manager').css('display', 'none');
//  });
//});
};

function toggleSlideBar(){
  $('#slider').toggle('slide', { direction: 'right' }, 300);
  $('#slidebar').animate({
    'right' : $('#slidebar').css('right') == '0px' ? '249px' : '0px'
  }, 300);
  setTimeout(function(){
      $('#icon-button').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
  }, 300);
}
