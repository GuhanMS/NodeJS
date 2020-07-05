module.exports = {
    ensureAuthenticated:(req, res, next)=>{
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash(
                'errors_msg',
                'you are not authenticated user'
                );
            res.redirect("/auth/login",401,{});
        }
    },
};