'use strict';

/**
 * @ngdoc overview
 * @name Demo
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Demo', ['ionic', 'jett.ionic.content.banner'])

  .config(function($httpProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController'
      });
    $urlRouterProvider.otherwise('/app')
  })

  .run(function ($window, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      if ($window.cordova && $window.cordova.plugins.Keyboard) {
        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        $window.cordova.plugins.Keyboard.disableScroll(true);
      }
    });
  })

  .controller('MainController', function($scope, $timeout, $q, $ionicContentBanner) {

    var contentBannerInstance;

    function fakeHttpCall (failOnPurpose) {
      var deferred = $q.defer();
      var items = [];

      if (!failOnPurpose) {
        for (var x = 1; x < 500; x++) {
          items.push({text: 'This is item number ' + x});
        }
        deferred.resolve(items);
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }

    function getItems (failOnPurpose, bannerType, transition) {
      //CLOSE content banner!!!
      if (contentBannerInstance) {
        contentBannerInstance();
        contentBannerInstance = null;
      }

      fakeHttpCall(failOnPurpose).then(function (items) {
        //HTTP SUCCES!!
        $scope.items = items;
      }, function () {
        //HTTP FAIL!!!
        contentBannerInstance = $ionicContentBanner.show({
          text: ['System Unavailable', 'Please try again later.'],
          interval: 3000,
          autoClose: 10000,
          type: bannerType,
          transition: transition || 'vertical'
        });
      })
    }
    getItems(false);

    $scope.showInfoBanner = function () {
      getItems(true, 'info', 'vertical');
    };

    $scope.showErrorBanner = function () {
      getItems(true, 'error', 'fade');
    };

    $scope.refreshItems = function () {
      $timeout(function () {
        getItems(true, 'error', 'vertical');
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
  });


