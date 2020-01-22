var express = require('express');
var router = express.Router();

const loginUser = (req, res, next) => { //sets session.user cookie and sessionId on db
    let sql = "SELECT u.id,u.username,u.password,u.privileges,u.session_id as 'sessionId' FROM user u WHERE u.username = ?";
    let params = [
        req.body.username,
        req.body.password,
    ]
    dbPool.execQuery(next, sql, params, function(err, result) {
        if (result.length === 1) { //user found
            var user = result[0];
            bcrypt.compare(req.body.password, user.password, function(err, correct) { //check if password is correct
                if (correct && !err) { //password is correct
                    user.sessionId = uuid();
                    let sqlSession = "UPDATE user SET session_id = ? WHERE id = ?";
                    let paramsSession = [
                        user.sessionId,
                        user.id
                    ];
                    dbPool.execQuery(next, sqlSession, paramsSession, function(err, result) {
                        delete user.password;
                        req.session.user = JSON.stringify(user);
                        res.send({ success: true });
                        res.end(req.session);
                    });
                } else { //password is incorrect
                    req.session.user = JSON.stringify({});
                    res.send({ success: false });
                    res.end(req.session);
                }
            });
        } else { //username not found
            req.session.user = JSON.stringify({});
            res.send({ success: false });
            res.end(req.session);
        }
    });
}

router.post('/login', (req, res, next) => loginUser(req, res, next));

router.post('/authenticate', function(req, res, next) { //check if sessionId on db = sessionId of session.user cookie
    let user = getUser(req.session);
    if (user) { //if client has user cookie
        let sql = "SELECT id FROM user WHERE id = ? AND session_id = ?";
        let params = [
            user.id,
            user.sessionId,
        ]
        dbPool.execQuery(next, sql, params, function(err, result) {
            if (result.length === 1) {
                res.send({ success: true });
            } else {
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

router.post('/getUserData', function(req, res, next) {
    let user = getUser(req.session);
    if (user) { //if client has user cookie
        let sql = "SELECT id,username,balance,privileges FROM user WHERE id = ? AND session_id = ?";
        let params = [
            user.id,
            user.sessionId,
        ]
        dbPool.execQuery(next, sql, params, function(err, result) {
            if (result.length === 1) {
                res.send({ success: true, user: result[0] });
            } else {
                res.send({ success: false });
            }
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/signup', (req, res, next) => {
    if (req.body.password.trim().length > 32 || req.body.password.trim().length < 0) { //password validation
        res.send({ success: false });
        res.end();
    } else { //if password is valid
        let sql = "SELECT id FROM user WHERE username = ?";
        let params = [req.body.username.trim()];
        dbPool.execQuery(next, sql, params, function(err, result) { //username already used?
            if (result.length === 0) { //username not used yet, ok 
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (!err) {
                        let sql = "INSERT INTO user VALUES (?,?,?,?,?,?)";
                        let params = [
                            uuid(),
                            req.body.username.trim(),
                            hash,
                            0,
                            0,
                            null
                        ];
                        dbPool.execQuery(next, sql, params, function(err, result) { //inserting new user into db
                            loginUser(req, res, next);
                        });
                    } else { //bcrypt error, stop
                        res.send({ success: false });
                        res.end();
                    }
                });
            } else { //username already used, error
                res.send({ success: false, alreadyUsed: true, });
                res.end();
            }
        });
    }
});

router.post('/rechargeCard', (req, res, next) => {
    let errors = {
        number: ('' + req.body.number).length !== 16,
        holder: req.body.holder.trim().length <= 0,
        expiration: new Date(req.body.expiration) < new Date() || req.body.expiration.trim().length === 0,
        cvv: isNaN(req.body.cvv) || req.body.cvv.trim().length === 0,
        amount: Number(req.body.amount) <= 0
    }

    if (errors.number || errors.holder || errors.expiration || errors.cvv || errors.amount) { //credit card validation
        res.send({ success: false, errors: errors });
        res.end(req.session);
    } else {
        let user = getUser(req.session)
        let sql = "UPDATE user SET balance = balance + ? WHERE id = ?";
        let params = [
            Number(req.body.amount),
            user.id
        ];

        dbPool.execQuery(next, sql, params, (err, result) => {
            res.send({ success: true });
            res.end(req.session);
        });
    }
});

module.exports = router;