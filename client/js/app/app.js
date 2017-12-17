// CREATE THE MODULE AND NAME IT cleanBlog
var app = angular.module("app", ["ngAnimate", "ui.router", "ngSanitize", ]);

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

// CONFIGURE OUR ROUTES
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'pages/home.html',
      controller: 'mainController'
    })

    .state('post', {
      url: '/post/{id}/{slug}',
      templateUrl: 'pages/post.html',
      controller: 'postController'
    })

    .state('pager', {
      url: '/page/{id}',
      templateUrl: 'pages/home.html',
      controller: 'mainController'
    })

  $locationProvider.html5Mode(true);
});

// Posts Pagination
app.directive('postsPagination', function () {
  return {
    restrict: 'E',
    template: '<ul class="pager" ng-show="pager">' +
      '<li class="previous" ng-show="currentPage != 1">' +
      '<a ui-sref="pager({id:currentPage-1})">&larr; Newer Posts</a>' +
      '</li>' +
      '<li class="next" ng-show="currentPage != totalPages">' +
      '<a ui-sref="pager({id:currentPage+1})">Older Posts &rarr;</a>' +
      '</li>' +
      '</ul>'
  };
});

// Limit the Posts content text on the Post list page/home page
app.filter('limitHtml', function () {
  return function (text, limit) {

    var changedString = String(text).replace(/<[^>]+>/gm, '');
    var length = changedString.length;

    return changedString.length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
  }
});

// Get current year
app.filter('currentYear', ['$filter', function ($filter) {
  return function () {
    return $filter('date')(new Date(), 'yyyy');
  };
}])

// MAIN CONTROLLER/HOME
app.controller('mainController', function ($scope, $http, $sce, $timeout, $stateParams) {

  $scope.page_title = 'Serverless';
  $scope.page_subtitle = 'A space to learn about new tech';

  $scope.date = new Date();

  $scope.posts = [];
  $scope.totalPages = 0;
  $scope.currentPage = 1;
  $scope.range = [];
  $scope.loading = false;
  $scope.pager = false;

  // DATE FORMAT
  $scope.dateFormat = function (dateString) {
    if (dateString) {
      var properlyFormattedDate = dateString.split(" ").join("T");
      return new Date(properlyFormattedDate);
    } else {
      return null;
    }
  };

  // GET POSTS FUNCTION
  $scope.getPosts = function (pageNumber) {

    pageNumber = $stateParams.id;

    if (pageNumber === undefined) {
      pageNumber = '1';
    }

    $scope.loading = true;

    $http.get('json/posts-page-' + pageNumber + '.json').success(function (response) {
      $scope.posts = response.data;
      $scope.totalPages = response.last_page;
      $scope.currentPage = response.current_page;
      $scope.loading = false;
      $scope.pager = true;


      if (pageNumber > $scope.totalPages) {
        $scope.noResult = true;
        $scope.loading = false;
        $scope.pager = false;
      }
    });
  };

  $scope.getPosts();
});

// POST CONTROLLER
app.controller('postController', function ($scope, $http, $state, $stateParams) {
  $scope.page_title = 'About Me';

  if ($stateParams.id == undefined) {
    $state.go('home');
  }

  // DATE FORMAT
  $scope.dateFormat = function (dateString) {
    if (dateString) {
      var properlyFormattedDate = dateString.split(" ").join("T");
      return new Date(properlyFormattedDate);
    } else {
      return null;
    }
  };

  post_id = $stateParams.id;

  $http.get('json/post.json').success(function (response) {
    $scope.post_id = response.id;
    $scope.post_date = response.post_date;
    $scope.post_title = response.post_title;
    $scope.post_author = response.author.firstname + ' ' + response.author.lastname;
    $scope.post_content = response.post_content;
  });
});