var app=angular.module("app",["ngAnimate","ui.router","ngSanitize"]);app.run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]),app.config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"pages/home.html",controller:"mainController"}).state("post",{url:"/post/{id}/{slug}",templateUrl:"pages/post.html",controller:"postController"}).state("pager",{url:"/page/{id}",templateUrl:"pages/home.html",controller:"mainController"}),c.html5Mode(!0)}]),app.directive("postsPagination",function(){return{restrict:"E",template:'<ul class="pager" ng-show="pager"><li class="previous" ng-show="currentPage != 1"><a ui-sref="pager({id:currentPage-1})">&larr; Newer Posts</a></li><li class="next" ng-show="currentPage != totalPages"><a ui-sref="pager({id:currentPage+1})">Older Posts &rarr;</a></li></ul>'}}),app.filter("limitHtml",function(){return function(a,b){var c=String(a).replace(/<[^>]+>/gm,"");c.length;return c.length>b?c.substr(0,b-1)+"...":c}}),app.filter("currentYear",["$filter",function(a){return function(){return a("date")(new Date,"yyyy")}}]),app.controller("mainController",["$scope","$http","$sce","$timeout","$stateParams",function(a,b,c,d,e){a.page_title="Lucas Klaassen",a.page_subtitle="My journey into tech",a.date=new Date,a.posts=[],a.totalPages=0,a.currentPage=1,a.range=[],a.loading=!1,a.pager=!1,a.dateFormat=function(a){if(a){var b=a.split(" ").join("T");return new Date(b)}return null},a.getPosts=function(c){c=e.id,void 0===c&&(c="1"),a.loading=!0,b.get("json/posts-page-"+c+".json").success(function(b){a.posts=b.data,a.totalPages=b.last_page,a.currentPage=b.current_page,a.loading=!1,a.pager=!0,c>a.totalPages&&(a.noResult=!0,a.loading=!1,a.pager=!1)})},a.getPosts()}]),app.controller("postController",["$scope","$http","$state","$stateParams",function(a,b,c,d){a.page_title="About Me",void 0==d.id&&c.go("home"),a.dateFormat=function(a){if(a){var b=a.split(" ").join("T");return new Date(b)}return null},post_id=d.id,b.get("json/post"+post_id+".json").success(function(b){a.post_id=b.id,a.post_date=b.post_date,a.post_title=b.post_title,a.post_author=b.author.firstname+" "+b.author.lastname,a.post_content=b.post_content})}]);