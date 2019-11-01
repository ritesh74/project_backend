var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../routes/User');

router.post('/register',function(req,res){
    var hashedPassword=bcrypt.hashSync(req.body.password,8);

    User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    },
    function(err,user){
        if(err) res.status(500).send("there is a problem of creating user");

        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/me',VerifyToken, function(req, res,next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
     // res.status(200).send(decoded);
     User.findById(decoded.id,{password:0}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        res.status(200).send(user);
        //next(user);
      });
    });
  });

//   router.use(function(user,req,res,next){
//     res.status(200).send(user);
//   })

  router.post('/login',function(req,res){
      User.findOne({email:req.body.email},function(err,user){
          if(err) return res.status(500).send("error on server");
          if(!user) return res.status(404).send("user not found");

          var passwordIsValid= bcrypt.compareSync(req.body.password,user.password)
          if (!passwordIsValid) return res.status(401).send({auth:false,token:null});

          var token=jwt.sign({id:user._id},config.secret,{
              expiresIn:86400
            });

            res.status(200).send({auth:true, token:token});
        
      })
  })

  router.get('/logout',function(req,res){
      res.status(200).send({auth:false,token:null});
  })

  module.exports = router;