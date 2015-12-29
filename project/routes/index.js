var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('/desktop', { title: 'Express' });
  var ua = req.headers['user-agent'].toLowerCase();
  console.log(ua);
  if(/mobile/i.test(ua)||/iphone/.test(ua)||/ipad/.test(ua)||/android/.test(ua)||/windows phone/.test(ua)){
   //res.writeHead(302, {Location: request.headers.host+'/mobile'});
      res.redirect('/mobile');
      //res.end()
  }else{
      res.redirect('/desktop');
      //res.writeHead(302, {Location: request.headers.host+'/desktop'});
      //res.end()
  }

});

module.exports = router;
