exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.json({ error: 'Not authenticated' });
}