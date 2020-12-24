const path = require('path');
const router = require('express').Router();

router.get('/favicon.ico', function(req, res) { 
    res.status(204);
    res.end();    
});

router.get('/robots.txt', function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/robots.txt'));
});

router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));
});

module.exports = router;