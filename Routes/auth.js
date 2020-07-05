const router = require('express').Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//load Auth Schema and Model
const User = require('../Model/Auth'); //mongoose model

// --------------Register get routes starts here ---------------

router.get("/register",(req,res)=>{
    res.render("./auth/register");
})
// --------------Register get routes ends here ---------------

// --------------Register POST routes starts here ------------

router.post("/register",(req,res)=>{
    //validations
    let errors = [];
    let {username, password, email, password2} = req.body;
    if(password != password2){
        errors.push({text:"password should match"});
    }
    if(password2.length < 6){
        errors.push({text:"password should be minimum of 6 character"})
    }
    if(errors.length > 0){
        res.render("./auth/register",{
            errors,
            username,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({email})
        .then((user) => {
            if (user) {
                req.flash(
                    "errors_msg","already taken please enter new one"
                );
                res.redirect("/auth/register",401, {});
            } else {
                //create a new account with valid email address
                let newUser =  new User ({
                    username,
                    password,
                    email,
                });

                //make password hashed and stored in database
                bcrypt.genSalt(12,(err,salt) => {
                    if (err) throw err;
                    //make it hashed using bycrpt.hash()
                    bcrypt.hash(newUser.password,salt , (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                    //lastly can store data into database with hashed password
                    newUser.save()
                    .then((user) => {
                        req.flash("success_msg", "successfully Registered");
                        res.redirect("/auth/login",201, {user});
                    })
                    .catch((err)=> console.log(err));
                    });
                });
            }
        })
        .catch((err)=> console.log(err));
    }
});

// --------------register POST routes ends here --------------

//--------------login GET routes start here -----------------


router.get("/login",(req,res)=>{
    res.render("./auth/login");
})
//--------------login GET routes start here -----------------

// ---------login post routes starts here ------------------

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/student/students",
        failureRedirect:"/auth/login",
        failureFlash:true,
    })(req,res,next);
});
// ---------login post routes starts here ------------------
//----------logout functionality ---------
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","successfully loggged out!")
    res.redirect("/auth/login", 201,{});
});

module.exports = router;


