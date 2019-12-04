var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var cookieSession = require('cookie-session');
var helmet = require('helmet');
uuid = require('uuid/v4');
formidable = require('formidable');
fs = require('fs');
var path = require('path');
require('dotenv').config(); //package for environment variables (create a file named .env in root directory and set there the environment variables, then access them with process.env.VAR_NAME; add .env file to .gitignore)

var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

//directory where to store images
app.use('./client/public/product-images',express.static('product-images'));


app.use(cookieSession({
	name: 'session',
  secret: process.env.COOKIE_SECRET,
  signed: true,
	maxAge: 60 * 60 * 1000 // 1 hour
}));

//---------- ROUTES ----------
var products = require('./routes/products.js');
var chart = require('./routes/chart.js');
var sections = require('./routes/sections.js');

app.use('/products', products);
app.use('/chart', chart);
app.use('/sections', sections);


//test upload img
var uploadImg = require('./routes/uploadImg.js');
app.use('/uploadImg', uploadImg);


log = {
  err: txt => console.log('\x1b[31m%s\x1b[0m%s', 'ERROR: ',txt),
  info: txt => console.log('\x1b[32m%s\x1b[0m', 'INFO: ',txt),
  warn: txt => console.log('\x1b[33m%s\x1b[0m', 'WARN: ',txt),
  error: txt => console.log('\x1b[31m%s\x1b[0m', 'ERROR: ',txt),
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
	log.err(err);
	res.send({
		success: false
	});
	res.end();
});

log.warn('----------- SERVER RUNNING ON PORT '+process.env.SERVER_PORT+' -----------');

var server = app.listen(process.env.SERVER_PORT);

//delete useless images periodically (every 10 minutes)
setInterval(() => {
	let sql = "SELECT id FROM product";
	dbPool.query(sql, [], function (err, allIds) {
		if(!err) {
			allIds = allIds.map(o => o.id);
			let dirs = getDirectories(process.env.PRODUCTS_FILE_DIR);
			let dirsToDelete = dirs.filter(dir => allIds.indexOf(dir) < 0 && dir!=='default');
			dirsToDelete.forEach(dir => rimraf(process.env.PRODUCTS_FILE_DIR+dir));
			if(dirsToDelete.length > 0)
				log.warn("----- DELETED USELESS DIRECTORIES ----");
		}
	});
}, 10*60*1000);


getDirectories = (source) =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

/*
-------- NOT IMPLEMENTED YET --------
io = require('socket.io').listen(server);
app.set('socketio', io);

io.on("connection", socket => {
	socketClientIdMap.push([socket.id,null]);
  socket.on("disconnect", () => socketClientIdMap = socketClientIdMap.filter(o => o[0] !== socket.id));
});
*/




//---------------- global ----------------

// socketClientIdMap = []; //0 = socket.id, 1 = client.id

dbPool  = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DB_USED
});

rimraf = (dir_path) => {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

// dbPool.execQuery = (sql, clientReq, clientRes, callback) => {

// 	//validate cookie session
// 	let cksql = "SELECT cookie_session FROM account WHERE cookie_session=? AND id=?"
// 	let ckparams=[
// 		clientReq.session.cookieSessionId,
// 		clientReq.session.userId
// 	];
// 	dbPool.execQueryNoSessionValidation(cksql, ckparams, clientReq, clientRes, (queryErr, queryRes) => {
// 		if(queryErr) {
// 			clientReq.session.userId = null;
// 			clientRes.send({
// 				success: false,
// 				queryErr: true
// 			});
// 			clientRes.end();
// 		}
// 		else {
// 			if(queryRes.length>0) {
// 				dbPool.query(sql, (queryErr, queryRes) => {
// 					if(queryErr) {
// 						logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
// 					}
// 					callback(queryErr, queryRes, clientReq, clientRes);

// 					if((sql.includes('INSERT') || sql.includes('DELETE') || sql.includes('UPDATE')) && clientReq.session.userId && clientReq.body.socketId)
// 						getSocketIdsFromClientId(clientReq.session.userId,clientReq.body.socketId).map(o => io.to(o).emit('update-data'));

// 				});
// 			}
// 			else {
// 				clientRes.send({
// 					success: false,
// 				});
// 				clientRes.end();
// 			}
// 		}
// 	});

// }

// dbPool.execQueryNoSessionValidation = (sql, queryParams, clientReq, clientRes, callback) => {
// 	dbPool.query(sql, queryParams, (queryErr, queryRes) => {
// 		if(queryErr) {
// 			logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
// 		}
// 		callback(queryErr, queryRes, clientReq, clientRes);
// 	});
// }

dbPool.execQuery = (next,sql,params,callback)  => {
	dbPool.query(sql, params, function (err, result) {
		if(err)
            next(err);
     	else
        	callback(err, result);
	});
}

toMySqlDate = (date) => {
	return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

// mapSocketClientIdf = (socketId,clientId) => {
// 	socketClientIdMap = socketClientIdMap.filter(o => o[0] !== socketId);
// 	socketClientIdMap.push([socketId,clientId]);
// }

// getSocketIdsFromClientId = (clientId,exceptId) => socketClientIdMap.filter(o => (o[1] === clientId) && (o[0] !== exceptId)).map(o => o = o[0]);

module.exports = app;
