angular
    .module('MainApp')
    .controller('FacebookPhotoCtrl', function($scope,FacebookSvc, $state, $timeout) {
    	
    	$scope.selectedPhotos = [];
        $scope.currentAlbum = $state.params.name;
        $scope.pagination = {itemsPerPage : 6,currentPage : 1};
        $scope.upload = {done : false}

        doPaginate();

        function doPaginate(){
             $scope.$watch('pagination.currentPage + pagination.itemsPerPage', function() {
                 var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage),
                     end = begin + $scope.pagination.itemsPerPage;
                     FacebookSvc.getPhotos($state.params.id).success(function(photos){
                        $scope.pagination.totalItems = photos.length;
                         $scope.photos = photos.slice(begin, end);
                    })
             });
        }

    	$scope.togglePhoto = function(url){
    		var index = 0;
    		if((index = $scope.selectedPhotos.indexOf(url)) !== -1){
    			$scope.selectedPhotos.splice(index,1);
    		} else {
    			$scope.selectedPhotos.push(url);
    		}
    	}

    	$scope.download = function(url){
    		FacebookSvc.download($scope.selectedPhotos).success(function(files){
                $scope.upload.done = true;
    			downloadPicture(0, files);
    		})
    	}

    	function downloadPicture(index, files){
    		if(!files[index]) return;
    		document.location.href = '/api/facebook/photos/'+files[index];
    		$timeout(function(){
    			downloadPicture(index+1, files);
    		},500);
    	}
    })