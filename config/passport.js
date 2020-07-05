//loading these four classes
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//load a scheme Model
const User = require("../Model/Auth");

module.exports = (passport)=>{
    passport.use(
        new LocalStrategy({ usernameField: "email"},(email,password,done)=>{
            User.findOne({ email:email})
            .then((user)=>{
                if(!user){
                    return done(null,false,{
                        message:"No email address found please register then login",
                    });
                }
                //match  password or vaild password or not
                bcrypt.compare(password, user.password,(err,isMatch)=>{
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user,{message:'login successfull'});
                    } else {
                        return done(null,false,{ message:"Incorrect password"});
                    }
                });
            }
            )
            .catch((err) => console.log(err));
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};
