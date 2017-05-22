angular
    .module('MainApp')
    .controller('LoginCtrl', function($scope, $rootScope,$state , Auth,SessionStorageService) {


        $scope.login = function() {
            Auth.login($scope.user,
                function(data) {
                    $rootScope.error = "";
                    SessionStorageService.put('token',data.token);
                    $rootScope.$broadcast("loginlogout", data.user);
                    $state.go('albums');
                },
                function(err,code) {});
        };

        $scope.required = {email : false};
        $scope.reset = {};


        $rootScope.$on("loginlogout", function () {
            $scope.user = {};
        });



    }
);