var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) { //sets session.user cookie and sessionId on db
    let sql = "SELECT u.id,u.username,u.privileges,u.session_id as 'sessionId' FROM user u WHERE u.username = ? AND u.password = ?";
    let params = [
        req.body.username,
        req.body.password,
    ]
    dbPool.execQuery(next, sql, params, function (err, result) {
        if(result.length === 1) {
            let user = result[0];
            user.sessionId = uuid();
            let sqlSession = "UPDATE user SET session_id = ? WHERE id = ?";
            let paramsSession = [
                user.sessionId,
                user.id
            ];
            dbPool.execQuery(next, sqlSession, paramsSession, function (err, result) {
                req.session.user = JSON.stringify(user);
                res.send({ success: true });
                res.end(req.session);
            });
        }
        else {
            req.session.user = JSON.stringify({});
            res.send({success:false});
            res.end(req.session);
        }
    });
});

router.post('/authenticate', function (req, res, next) { //check if sessionId on db = sessionId of session.user cookie
    let user = getUser(req.session);
    if(user) { //if client has user cookie
        let sql = "SELECT id FROM user WHERE id = ? AND session_id = ?";
        let params = [
            user.id,
            user.sessionId,
        ]
        dbPool.execQuery(next, sql, params, function (err, result) {
            if (result.length === 1) {
                res.send({ success: true });
            }
            else {
                req.session.user = JSON.stringify({});
                res.send({ success: false });
            }
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/getUserData', function (req, res, next) {
    let user = getUser(req.session);
    if (user) { //if client has user cookie
        let sql = "SELECT id,username,balance,privileges FROM user WHERE id = ? AND session_id = ?";
        let params = [
            user.id,
            user.sessionId,
        ]
        dbPool.execQuery(next, sql, params, function (err, result) {
            if (result.length === 1) {
                res.send({ success: true, user: result[0] });
            }
            else {
                res.send({ success: false });
            }
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

module.exports = router;
