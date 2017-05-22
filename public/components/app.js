angular
    .module('MainApp',
        [
            'ui.router', 'ngResource', 'ngCookies','ui.bootstrap','ngSanitize','angular-loading-bar'
        ]
    )
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('TokenInterceptor');

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'components/partials/home/home.html',
                require: {}
            })
            .state('albums', {
                url: '/facebook/albums',
                templateUrl: 'components/frontoffice/facebook/views/albums.html',
                controller: 'FacebookAlbumCtrl',
                require: {}
            })
            .state('photos', {
                url: '/facebook/albums/:id/photos/:name',
                templateUrl: 'components/frontoffice/facebook/views/photos.html',
                controller: 'FacebookPhotoCtrl',
                require: {}
            })
    })
    .run(function($rootScope, $location , SessionStorageService, Auth) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            $rootScope.isAuthenticated = SessionStorageService.get('token');
        });
    });