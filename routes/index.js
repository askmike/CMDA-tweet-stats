var l = console.log
  // , _ = require('underscore')
  , async = require('async')
  , mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')

var sortByDay = function( array, dateProp ) {
  var sorted = []
    , year, month, day, date, period, exist
    // sort function
    , dateAsc = function (a, b) {
      if (a.timestamp > b.timestamp)
        return 1;
      if (a.timestamp < b.timestamp)
        return -1;
      return 0;
    }
    // helper
    , verifyTime = function( t ) {
      if( t < 10 )
        t = '0' + t;
      return t;
    }
    , sortSingle = function( obj ) {
    date = obj[ dateProp ];
    year = verifyTime( date.getFullYear() );
    month = verifyTime( date.getMonth() );
    day = verifyTime( date.getDate() );

    period = [ year, month, day ].join('-');

    exist = false;

    sorted.forEach(function( entry ) {
      if( entry.period === period ) {
        exist = true;
        entry.tweets++;
      }
    });
    if( !exist )
      sorted.push({
        period: period
      , tweets: 1
      , timestamp: +obj.created_at
      });
  }

  array.forEach( sortSingle );

  return sorted.sort( dateAsc ).reverse();
}

exports.tweetsperday = function( req, res ) {
  Tweet.find({}, function( err, tweets ) {

    // delete all
    // tweets.forEach( function(tweet) { tweet.remove(); });
    
    res.json( sortByDay( tweets, 'created_at' ) );
  });
}

var sortByUser = function( tweets ) {
  var users = [], name, exist
    , addUser = function( tweet ) {
      name = '@' + tweet.username;
      exist = false;
      users.forEach(function( u ) {
        if( u.label === name ) {
          exist = true;
          u.value++;
        }
      });
      if( !exist )
        users.push({
          label: name
        , value: 1
        });
    }
  tweets.forEach( addUser );
  return users;
}

exports.users = function( req, res ) {
  Tweet.find({}, function( err, tweets ) {
    res.json( sortByUser( tweets ) );
  });
}

var getAmountOfUsers = function( cb ) {
  Tweet.distinct('userid').exec(function( err, records ) {
    cb( null, records.length );
  });
}

var getAmountOfTweets = function( cb ) {
  Tweet.find({}, function( err, records ) {
    cb( null, records.length );
  });
}

var getOldest = function( cb ) {
  Tweet.findOne({}, {}, { sort: { 'created_at' : 1 } }, function(err, post) {
    cb( null, post.created_at );
  });
}

var calcDays = function( cb ) {
  var getNewest = function( cb ) {
    Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      cb( null, post.created_at );
    });
  }
    , returnTimeDifference = function( err, results ) {
    var days = ( results.newest.getTime() - results.oldest.getTime() ) / 1000 / 60 / 60 / 24;
    cb( null, days );
  };

  async.parallel({ 
    oldest: getOldest
  , newest: getNewest
  }
    , returnTimeDifference
  );
}

exports.index = function( req, res ) {
  async.parallel({ 
    amountOfUsers: getAmountOfUsers
  , amountOfTweets: getAmountOfTweets
  , timespan: calcDays
  , oldest: getOldest
  , 
  }
    , function( err, results ) {
      var o = results.oldest;
      results.oldest = o.getDate() + '-' + ( o.getMonth() + 1 ) + '-' + o.getFullYear();
      res.render('home', results);
    }
  );
}
