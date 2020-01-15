var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('field', function(name, value) {
        log.info(name)
        log.info(value)
    });

    form.on('fileBegin', (name, file) => {
        file.path = './client/public/products-images/' + file.name;
    });

    form.on('file', (name, file) => {
        log.info('Uploaded ' + file.name);
    });

    form.on('end', () => {
        res.send({success:true});
        res.end(req.session);
    });
});



module.exports = router;
