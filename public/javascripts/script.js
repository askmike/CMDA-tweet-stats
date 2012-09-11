(function() {
  var display = {
    tweetsLine: function( data ) {
      Morris.Line({
        element: 'tweetsperday'
      , data: data
      , dateFormat: false
      , xkey: 'period'
      , ykeys: ['tweets']
      , labels: ['tweets']
      , xLabelFormat: function( d ) {
        return d.getDate() + '-' + ( d.getMonth() + 1 ) + '-' + d.getFullYear();
      }
      , xLabels: 'day'
      });
    }
  , users: function( data ) {
      Morris.Donut({
        element: 'users'
      , data: data
      });
    }
  };

  var showDaarom = function( e ) {
    e.preventDefault();
    $( this ).text( 'Daarom!' );
    $( '#daarom' ).show();
  }

  var init = function() {
    $.getJSON( 'tweetsperday', display.tweetsLine );
    $.getJSON( 'users', display.users );
    $('#waarom').on( 'click', showDaarom )
  };

  $( init );
})();