var express = require('express');
var router = express.Router();

router.post('/isInChart', function(req, res, next) {
	let sql = "SELECT id FROM chart WHERE user_id='"+req.body.userId+"' AND product_id='"+req.body.productId+"'";
	dbPool.execQuery(next,sql,[], function (err, result) {
        res.send({
            success: true,
            contained: result.length > 0,
        });
		res.end();
	});
});

router.post('/getChart', function(req, res, next) {
	let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable FROM chart c LEFT JOIN product p ON p.id=c.product_id WHERE c.user_id = '"+req.body.userId+"'";
	dbPool.execQuery(next,sql,[], function (err, result) {
		res.send(result);
		res.end();
	});
});

router.post('/addToChart', function(req, res, next) {
	let sql = "INSERT INTO chart VALUES(UUID(),'"+req.body.productId+"','"+req.body.userId+"')";
	dbPool.execQuery(next,sql,[], function (err, result) {
		res.send({success: true});
		res.end();
	});
});

module.exports = router;