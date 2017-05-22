angular.module('MainApp')
    .factory('FacebookSvc', function($http){
        return  {
            getAlbums : function(){
                return $http.get('/api/facebook/albums');
            },
            getPhotos : function(album){
                return $http.get('/api/facebook/albums/'+album);
            },
            download : function(photos){
                return $http.post('/api/facebook/photos/download',photos);
            }
        }
    });