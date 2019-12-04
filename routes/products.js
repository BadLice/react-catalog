var express = require('express');
var router = express.Router();

router.post('/getProducts', function(req, res, next) {
	let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable,p.create_user_id as \"createdUserID\" FROM product p LEFT JOIN product_section_assign p_s ON p_s.product_id = p.id LEFT JOIN section s ON s.id = p_S.section_id WHERE s.id = '"+req.body.sectionId+"'";
	dbPool.execQuery(next,sql,[], function (err, result) {
		res.send(result);
		res.end();
	});
});

router.post('/addProduct', function(req, res, next) {
	let prodId = uuid();
	let product = {};
	var form = new formidable.IncomingForm();
	form.parse(req);

    form.on('field', function(name, value) {
		if(name === 'product')
			product = JSON.parse(value);
    });

    form.on('fileBegin', (name, file) => {
		let __dir_save = process.env.PRODUCTS_FILE_DIR+prodId;

		if (!fs.existsSync(__dir_save)){
			fs.mkdirSync(__dir_save);
		}
        file.path = __dir_save +'/product-logo.jpg';
		
    });

    form.on('file', (name, file) => {
        log.info('------ UPLOADED FILE: ' + file.name);
    });

	form.on('end', function() {
		let sqlProd = "INSERT INTO product VALUES (?,?,?,?,?,?)";
		let paramsProd= [
			prodId,
			product.name,
			product.producer,
			product.price,
			product.avaliable,
			'TEST'
		]

		dbPool.execQuery(next,sqlProd,paramsProd, function (err, result) {
			let sqlSections = "INSERT INTO product_section_assign VALUES ";
			let paramsSections = [];

			product.sections.forEach(s => {
				sqlSections += "(UUID(),?,?),"
				paramsSections.push(s.id);
				paramsSections.push(paramsProd[0]);
			});

			dbPool.execQuery(next,sqlSections.slice(0,-1),paramsSections, function (err, result) {		
				res.send({success:true,id: prodId});
				res.end();
			});
		});
	});
	
});

router.post('/', (req, res, next) => {
    
});


module.exports = router;
