var express = require('express');
var router = express.Router();

router.post('/isInChart', function(req, res, next) {
	let user = getUser(req.session);
	if (user) {
		let sql = "SELECT id FROM chart WHERE user_id='" + user.id + "' AND product_id='" + req.body.productId + "'";
		dbPool.execQuery(next, sql, [], function (err, result) {
			res.send({
				success: true,
				contained: result.length > 0,
			});
			res.end(req.session);
		});
	} else {
		res.send({ success: false });
		res.end(req.session);
	}
});

router.post('/getChart', function(req, res, next) {
	let user = getUser(req.session);
	if(user) {
		let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable FROM chart c LEFT JOIN product p ON p.id=c.product_id WHERE c.user_id = '"+user.id+"'";
		dbPool.execQuery(next,sql,[], function (err, result) {
			res.send(result);
			res.end(req.session);
		});
	} else {
		res.send({success: false});
		res.end(req.session);
	}
});

router.post('/addToChart', function(req, res, next) {
	let user = getUser(req.session);
	if (user) {
		let sql = "INSERT INTO chart VALUES(UUID(),'" + req.body.productId + "','" + user.id + "')";
		dbPool.execQuery(next, sql, [], function (err, result) {
			res.send({ success: true });
			res.end(req.session);
		});
	} else {
		res.send({ success: false });
		res.end(req.session);
	}
	
});

module.exports = router;