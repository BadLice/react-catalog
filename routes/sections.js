var express = require('express');
var router = express.Router();

router.post('/getSections', function(req, res, next) {

    let sql = "SELECT DISTINCT s.id as 'id', s.name as 'name', (CASE WHEN p_s.product_id IS NULL THEN false ELSE true END) as 'hasProducts' FROM section s LEFT JOIN product_section_assign p_s ON s.id = p_s.section_id";
    dbPool.execQuery(next, sql, [], function(err, result) {
        res.send(result)
        res.end(req.session);
    });
});

router.post('/getSellingSections', function(req, res, next) {
    let user = getUser(req.session);
    if (user) {
        let sql = "SELECT DISTINCT s.id, s.name FROM product p LEFT JOIN product_section_assign p_s ON p.id = p_s.product_id LEFT JOIN section s ON s.id = p_s.section_id WHERE create_user_id = ?";
        let params = [
            user.id,
        ]
        dbPool.execQuery(next, sql, params, function(err, result) {
            res.send({
                success: true,
                sections: result,
            })
            res.end(req.session);
        });
    } else {
        res.send({ success: false });
        res.end(req.session);
    }
});

router.post('/existsSection', function(req, res, next) {

    let sql = "SELECT * FROM section WHERE name = ?";
    let params = [
        req.body.section.name.trim()
    ]
    dbPool.execQuery(next, sql, params, function(err, result) {
        res.send({
            success: true,
            exists: result.length > 0,
        })
        res.end(req.session);
    });
});

router.post('/addSection', function(req, res, next) {
    let id = uuid();
    let sql = "INSERT INTO section VALUES(?,?)";
    let params = [
        id,
        req.body.section.name.trim()
    ]
    dbPool.execQuery(next, sql, params, function(err, result) {
        res.send({
            success: true,
            sectionId: id,
        })
        res.end(req.session);
    });
});

module.exports = router;