module.exports = {
    login: function(req, res, next) {
        return res.json({token : req.body.token});
    },
    logout: function(req, res) {},
    ensureAuthorizedApi: function(req,res,next,routes) {
        var route = _.findWhere(routes,{path : req.route.path,httpMethod : req.route.stack[0].method.toUpperCase()});

        if(route.require && route.require.token){
            if(!req.headers.authorization || req.headers.authorization.split(' ').length < 2){
            return res.sendStatus(401);
            }
        }
    	
    	return next();
    }
};
