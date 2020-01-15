var express = require('express');
var router = express.Router();

router.post('/getProducts', function(req, res, next) {
	let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable,p.create_user_id as \"createdUserID\" FROM product p LEFT JOIN product_section_assign p_s ON p_s.product_id = p.id LEFT JOIN section s ON s.id = p_S.section_id WHERE s.id = ? ";
	let params = [
		req.body.sectionId
	]
	dbPool.execQuery(next,sql,params, function (err, result) {
		res.send(result);
		res.end(req.session);
	});
});

router.post('/saveProduct', function(req, res, next) {
	let tempDirId;
	let product = {};
	var form = new formidable.IncomingForm();
	form.parse(req);

    form.on('field', function(name, value) {
		if(name === 'product')
			product = JSON.parse(value);
    });

    form.on('fileBegin', (name, file) => {
		let __dir_save = '';
		do { 
			tempDirId = uuid(); //temporary directory id where new file will be saved
			__dir_save = process.env.PRODUCTS_FILE_DIR + tempDirId;
		} while(fs.existsSync(__dir_save));
		//create temp directory where to save new image file
		if (!fs.existsSync(__dir_save)) {
			fs.mkdirSync(__dir_save);
		}
        file.path = __dir_save +'/product-logo.jpg';
    });

    form.on('file', (name, file) => {
		if (fs.existsSync(process.env.PRODUCTS_FILE_DIR + tempDirId)) {
			//remove old product directory 
			if(fs.existsSync(process.env.PRODUCTS_FILE_DIR + product.id)) {
				rimraf(process.env.PRODUCTS_FILE_DIR + product.id)
			}
			//rename temp directory to actual product directory
			let renamed = false;
			for(let chance=0;!renamed && chance < 100000; chance++) { //need to try some times until tempDirId is initialized by 'fileBegin' event
				try {
					fs.renameSync(process.env.PRODUCTS_FILE_DIR + tempDirId, process.env.PRODUCTS_FILE_DIR + product.id, (err) => {
						if (err) {
							log.warn("Cannot rename directory "+process.env.PRODUCTS_FILE_DIR + tempDirId+" -- err:" +err);
							throw err;
						}
					});
					renamed = true;
				} catch(err) {
					log.warn("retrying...");
				}
			}
		} else {
			log.err('Directory '+process.env.PRODUCTS_FILE_DIR + tempDirId+' doesnt exsist!');
		}
		log.info('------ UPLOADED FILE: ' + file.name + ' ------');
    });

	form.on('end', function() {
		let sql = "UPDATE product SET name=?,producer=?,price=?,avaliable=? WHERE id=?";
		let params = [
			product.name,
			product.producer,
			product.price,
			product.avaliable,
			product.id
		]
		dbPool.execQuery(next,sql,params, function (err, result) {
			let sqlSectionsOld = "DELETE FROM product_section_assign WHERE product_id=?";
			let paramsSectionsOld = [
				product.id
			]
			dbPool.execQuery(next,sqlSectionsOld,paramsSectionsOld, function (err, result) {
				let sqlSections = "INSERT INTO product_section_assign VALUES ";
				let paramsSections = [];

				product.sections.forEach(s => {
					sqlSections += "(UUID(),?,?),"
					paramsSections.push(s.id);
					paramsSections.push(product.id);
				});

				dbPool.execQuery(next,sqlSections.slice(0,-1),paramsSections, function (err, result) {		
					res.send({success:true});
					res.end(req.session);
				});
			});
		});
	});
});



router.post('/getSellingProducts', function(req, res, next) {
	let user = getUser(req.session);
	let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable,p.create_user_id as \"createdUserID\" FROM product p LEFT JOIN product_section_assign p_s ON p_s.product_id = p.id LEFT JOIN section s ON s.id = p_S.section_id WHERE s.id = ? AND p.create_user_id= ?";
	let params = [
		req.body.sectionId,
		user.id,
	]
	dbPool.execQuery(next,sql,params, function (err, result) {
        res.send({
			success: true,
			products: result,
		})
        res.end(req.session);
	});
});

router.post('/getProduct', function(req, res, next) {
	let p = {};
	let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable,p.create_user_id as \"createdUserID\" FROM product p WHERE p.id=?";
	let params = [
		req.body.productId
	]
	dbPool.execQuery(next,sql,params, function (err, result) {
		p = result[0];
		let sqlSections = "SELECT s.id,s.name FROM product_section_assign p_s LEFT JOIN product p ON p.id = p_s.product_id LEFT JOIN section s ON s.id = p_s.section_id WHERE p.id = ?";
		dbPool.execQuery(next,sqlSections,params, function (err, result) {
			p.sections = result;
			res.send({
				success:true,
				product: p,
			});
			res.end(req.session);
		});
	});
});

router.post('/addProduct', function(req, res, next) {
	let user = getUser(req.session);
	let prodId = uuid();
	let product = {};
	var form = new formidable.IncomingForm();
	form.parse(req);

    form.on('field', function(name, value) {
		if(name === 'product')
			product = JSON.parse(value);
    });

    form.on('fileBegin', (name, file) => {
		let __dir_save = process.env.PRODUCTS_FILE_DIR + prodId;

		if (!fs.existsSync(__dir_save)){
			fs.mkdirSync(__dir_save);
		}
        file.path = __dir_save +'/product-logo.jpg';
		
    });

    form.on('file', (name, file) => {
        log.info('------ UPLOADED FILE: ' + file.name + ' ------');
    });

	form.on('end', function() {
		let sqlProd = "INSERT INTO product VALUES (?,?,?,?,?,?)";
		let paramsProd= [
			prodId,
			product.name,
			product.producer,
			product.price,
			product.avaliable,
			user.id
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
				res.end(req.session);
			});
		});
	});
	
});

module.exports = router;
