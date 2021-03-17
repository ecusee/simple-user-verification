const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verificationEmail = require("../config/verificationEmail");
const {
  loginValidation,
  registerValidation,
} = require("../validation/userValidation");

//@desc		Register Page
//@route 	GET /api/user/register
router.get('/register', (req,res) => {
  res.render('pages/register')
})

//@desc		Register Email & Pass
//@route 	POST /api/user/register
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).render('pages/error', {message: error.details[0].message});

  //Check if user is alreadt in db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).render('pages/error', {message: "Email zaten kullanimda"});

  //Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a verification code
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
  //Create new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    country: req.body.country,
    confirmationCode: token,
  });

  try {
    const savedUser = await user.save();
    verificationEmail(user.email,user.name, token);
    res.render('pages/success', {
      message: "Devam etmek icin lutfen mail adresinizi dogrulayin.Spam klasorunu kontrol edin."
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

//@desc		Verify your email
//@route 	GET /api/user/verify
router.get("/verify/:confirmationCode", async (req, res) => {
  try {
    isVerified = await User.findOne({
      confirmationCode: req.params.confirmationCode,
    });

    if (isVerified) {
      if (isVerified.isValid) {
        res.render('pages/success', {
          message: "Hesabinizi zaten aktif ettiniz."
        });
      } else {
        isVerified.isValid = true;
        verifyUser = await User.findOneAndUpdate(
          { _id: isVerified._id },
          isVerified,
          {
            new: true,
            runValidators: true,
          }
        );
        if (verifyUser) {
          res.render('pages/login');
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

//@desc		Login Page
//@route 	GET /api/user/login
router.get('/login', (req,res) => {
  res.render('pages/login')
})

//@desc		Login Email & Pass
//@route 	POST /api/user/login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).render('pages/error', {message: error.details[0].message});

  //Check if email is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email ya da parola yanlis");

  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email ya da parola yanlis");

  //Check if user valid
  const isValid = user.isValid
  if(!isValid) {
    res.render('pages/login', {
      message: 'Önce, hesabını onaylamalısın.'
    })
  }

  res.render('pages/success', {
    message: 'Giriş Başarılı.'
  })
});

module.exports = router;
