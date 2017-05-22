var async = require('async'),
    _ =           require('underscore'),
    fs =           require('fs'),
    FB = require('fb'),
    request = require('request'),
    AuthCtrl =  require('../controllers/authCtrl');

var routesApi = [
    {
        path: '/api/facebook/albums',
        httpMethod : 'GET',
        require : {
            token : true
        },
        middleware: [function(req, res) {
            console.log("GET - /api/facebook/albums");
            if(!FB.getAccessToken()) {
                FB.setAccessToken(req.headers.authorization.split(' ')[1]);
            }
            FB.api('/me/albums','get',  function (response) {
                if(!response || response.error) {
                    return res.sendStatus(401);
                }
                return res.json(response.data); 
            });
        }]
    },
    {
        path: '/api/facebook/albums/:id',
        httpMethod : 'GET',
        require : {
            token : true
        },
        middleware: [function(req, res) {
            console.log("GET - /api/facebook/albums/:id");
            if(!FB.getAccessToken()) {
                FB.setAccessToken(req.headers.authorization.split(' ')[1]);
            }
            FB.api('/'+req.params.id+'/photos', function (response){
                    if(!response || response.error) {
                        return res.sendStatus(401);
                    }
                    var urls = [];
                    for (var i = 0; i < response.data.length; i++) {
                        urls.push(response.data[i].images[0].source);                           
                    }
                    return res.json(urls);
            });  
        }]
    },
    {
        path: '/api/facebook/photos/download',
        httpMethod : 'POST',
        require : {
            token : true
        },
        middleware: [function(req, res) {
            console.log("GET - /api/facebook/photos/download");
            var fileName = {};
            async.map(req.body,function(url,cb){
                fileName[url] = Math.random().toString(36).substring(10);
                request(url).pipe(fs.createWriteStream('img/' + fileName[url] + '.jpg')).on('finish', function(response) {      
                    cb(null);
                });
            },function(err,results){
                return res.json(_.values(fileName));
            })
        }]
    },
    {
        path: '/api/facebook/photos/:id',
        httpMethod : 'GET',
        require : {
            token : false
        },
        middleware: [function(req, res) {
            console.log("GET - /api/facebook/photos/:id");
            return res.download("./img/" + req.params.id +".jpg", _.noop)
        }]
    },
]

module.exports = function(app) {

    _.each(routesApi, function(route) {
        route.middleware.unshift(function(req,res,next){AuthCtrl.ensureAuthorizedApi(req,res,next,routesApi)});
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });

}

