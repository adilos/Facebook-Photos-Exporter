angular
    .module('MainApp')
    .controller('FacebookAlbumCtrl', function($scope,FacebookSvc) {

    	$scope.pagination = {itemsPerPage : 4,currentPage : 1};

    	doPaginate();

    	function doPaginate(){
             $scope.$watch('pagination.currentPage + pagination.itemsPerPage', function() {
                 var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage),
                     end = begin + $scope.pagination.itemsPerPage;
                     FacebookSvc.getAlbums().success(function(albums){
                         $scope.pagination.totalItems = albums.length;
                         $scope.albums = _.sortBy(albums,function(album){return album.name.toLowerCase();}).slice(begin, end);
    				})
             });
        }
    })