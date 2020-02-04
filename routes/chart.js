var express = require('express');
var router = express.Router();

router.post('/getChart', function(req, res, next) {
    let user = getUser(req.session);
    if (user) {
        let sql = "SELECT p.id,p.name,p.producer,p.price,p.avaliable,c.selected,c.amount FROM chart c LEFT JOIN product p ON p.id=c.product_id WHERE c.user_id = '" + user.id + "'";
        dbPool.execQuery(next, sql, [], function(err, result) {
            result = result.map(p => {
                p.selected = Boolean(p.selected);
                return p;
            });
            res.send({ success: true, cart: result });
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/setAmount', (req, res, next) => {
    log.info(req.body)
    let user = getUser(req.session);
    if (user) {
        let sql = "UPDATE chart SET amount=? WHERE product_id=? AND user_id=?";
        let params = [
            Number(req.body.amount),
            req.body.productId,
            user.id
        ]
        dbPool.execQuery(next, sql, params, (err, result) => {
            res.send({ success: true });
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/removeFromCart', (req, res, next) => {
    log.info(req.body)
    let user = getUser(req.session);
    if (user) {
        let sql = "DELETE FROM chart WHERE product_id=? AND user_id=?";
        let params = [
            req.body.productId,
            user.id
        ]
        dbPool.execQuery(next, sql, params, (err, result) => {
            res.send({ success: true });
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/normalizeAmount', (req, res, next) => {
    log.info(req.body)
    let user = getUser(req.session);
    if (user) {
        let sql = "UPDATE chart SET amount=avaliable WHERE product_id=? AND user_id=?";
        let params = [
            req.body.productId,
            user.id
        ]
        dbPool.execQuery(next, sql, params, (err, result) => {
            res.send({ success: true });
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});


router.post('/addToChart', function(req, res, next) {
    let user = getUser(req.session);
    if (user) {
        let sql = "SELECT id FROM chart WHERE user_id=? AND product_id=?";
        let params = [
            user.id,
            req.body.productId
        ]
        dbPool.execQuery(next, sql, params, (err, result) => {
            if (result.length === 0) { //product is not in cart
                let sql = "INSERT INTO chart VALUES(UUID(),?,?,1,1)";
                let params = [
                    req.body.productId,
                    user.id
                ]
                dbPool.execQuery(next, sql, params, (err, result) => {
                    res.send({ success: true, alreadyInCart: false });
                    res.end(req.session);
                });
            } else { //product already in cart
                let sql = "UPDATE chart SET amount=(amount+1) WHERE user_id=? AND product_id=?";
                let params = [
                    user.id,
                    req.body.productId
                ]
                dbPool.execQuery(next, sql, params, (err, result) => {
                    res.send({ success: true, alreadyInCart: true });
                    res.end(req.session)
                });
            }
        })
    } else {
        res.send({ success: false });
        res.end(req.session);
    }

});

router.post('/selectInCart', (req, res, next) => {
    let user = getUser(req.session);
    if (user) {
        let sql = "UPDATE chart SET selected=? WHERE product_id=? AND user_id=?";
        let params = [
            Number(req.body.selected),
            req.body.productId,
            user.id
        ]
        dbPool.execQuery(next, sql, params, (err, result) => {
            res.send({ success: true });
            res.end(req.session);
        })
    }
});

module.exports = router;