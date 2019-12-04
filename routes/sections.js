var express = require('express');
var router = express.Router();

router.post('/getSections', function(req, res, next) {

	let sql = "SELECT * FROM section"; 
	dbPool.execQuery(next,sql,[], function (err, result) {
        res.send(result)
        res.end();        
	});
});

router.post('/existsSection', function(req, res, next) {

	let sql = "SELECT * FROM section WHERE name = ?";
	let params = [
		req.body.section.name.trim()
	] 
	dbPool.execQuery(next,sql,params, function (err, result) {
        res.send({
			success: true,
			exists: result.length>0,
		})
        res.end();        
	});
});

router.post('/addSection', function(req, res, next) {
	let id = uuid();
	let sql = "INSERT INTO section VALUES(?,?)";
	let params = [
		id,
		req.body.section.name.trim()
	] 
	dbPool.execQuery(next,sql,params, function (err, result) {
        res.send({
			success: true,
			sectionId: id,
		})
        res.end();        
	});
});

module.exports = router;
