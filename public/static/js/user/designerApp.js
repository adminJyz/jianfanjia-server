'use strict';
(function() {
    // load modules
    angular.module('myJyzDesigner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives'])
        .config(function($stateProvider, $urlRouterProvider) {
            var RootURl = '../../../tpl/user/designer/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {     //设计师首页
                    url: '/index',
                    templateUrl: RootURl+'index.html',
                    controller : 'indexCtrl'
                })
                .state('infor', {     //设计师编辑资料和提交认证
                    url: '/infor',
                    templateUrl: RootURl+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('release', {
                    url: '/release',
                    templateUrl: RootURl+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('revise', {
                    url: '/revise/:id',
                    templateUrl: RootURl+'revise.html',
                    controller : 'releaseCtrl'
                })
                .state('requirementList', {
                    url: '/requirementList',
                    templateUrl: RootURl+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {
                    url: '/requirement/:id',
                    templateUrl: RootURl+'requirement.html',
                    controller : 'requirementCtrl'
                })
                .state('requirement.detail', {
                    url: '/detail',
                    templateUrl: RootURl+'detail.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.owenr', {
                    url: '/owenr',
                    templateUrl: RootURl+'owenr.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.plan', {
                    url: '/plan',
                    templateUrl: RootURl+'plan.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('requirement.contract', {
                    url: '/contract',
                    templateUrl: RootURl+'contract.html',
                    controller : 'requirementDetailCtrl'
                })
                .state('favorite', {
                    url: '/favorite',
                    templateUrl: RootURl+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('designer', {
                    url: '/designer',
                    templateUrl: RootURl+'designer.html',
                    controller : 'favoriteDesignerCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzDesigner']);
})();
