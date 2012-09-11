var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

	var Tweet = new Schema({
	    body: String
	  , fid: { type: String, index: { unique: true } }
	  , username: { type: String, index: true }
	  , userid: Number
	  , created_at: Date
	  , source: String
	});

// Tweet.namedScope('latest').find().sort('_id','descending').limit(1);

mongoose.model( 'Tweet', Tweet );
mongoose.connect( 'mongodb://localhost/CMDA' );