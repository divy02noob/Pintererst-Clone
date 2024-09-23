const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const upload = require('./multer');

passport.use(new LocalStrategy(userModel.authenticate()));

router.get('/', (req, res) => {
  res.render('index',{nav:false});
});


router.get('/register', (req, res) => {
  res.render('register',{nav:false});
});
router.get('/profile',isLoggedIn,async function(req,res,next){
  const user = await userModel
  .findOne({username: req.session.passport.user}).populate("post")
  res.render("profile",{user, nav:true});
});

router.get('/show/post',isLoggedIn,async function(req,res,next){
  const user =
  await userModel
  .findOne({username: req.session.passport.user})
  .populate("post")
  res.render("show",{user, nav:true});
});
router.get('/feed',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find().populate("user")
  res.render("feed",{user,posts,nav:true});
})

router.get('/add',isLoggedIn,async function(req,res,next){
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render("add",{user, nav:true});
  });



router.post('/createpost',isLoggedIn, upload.single("postimage") ,async function(req,res,next){
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
});
  user.post.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/fileupload',isLoggedIn , upload.single("image") ,async function(req,res,next){
  const user = await userModel.findOne({username:req.session.passport.user});
  user.profileImage= req.file.filename;
  await user.save();
  res.redirect("/profile")
});  

router.post('/register', (req, res) => {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    name: req.body.fullname
  });

userModel.register(data, req.body.password)
    .then((registeredUser) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/');
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/profile');
        });
      })(req, res);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error registering user');
    });
});

router.get('/profile',isLoggedIn, (req, res) => {
  res.render('profile');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/profile',
}));

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports = router;
//lets start once again
//lets start once again
//lets start once again
//lets start once again
//lets continue
