'use strict';
(function() {
    // load modules
    angular.module('myJyzDesigner', ['ui.router','pasvaz.bindonce','controllers', 'services', 'filters' , 'directives','ngmodel.format'])
        .config(function($stateProvider, $urlRouterProvider) {
            var url = RootUrl + 'tpl/user/designer/';
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {     //设计师首页
                    url: '/index',
                    templateUrl: url+'index.html',
                    controller : 'indexCtrl'
                })
                .state('service', {     //设计师接单服务设置
                    url: '/service',
                    templateUrl: url+'service.html',
                    controller : 'serviceCtrl'
                })
                .state('infor', {     //设计师编辑资料和提交认证
                    url: '/infor',
                    templateUrl: url+'infor.html',
                    controller : 'inforCtrl'
                })
                .state('requirementList', {   //需求列表
                    url: '/requirementList',
                    templateUrl: url+'requirementList.html',
                    controller : 'requirementListCtrl'
                })
                .state('requirement', {      //需求详情
                    url: '/requirement/:id',
                    templateUrl: url+'requirement.html'
                })
                .state('requirement.detail', {    //需求详情--需求描述
                    url: '/detail',
                    templateUrl: url+'detail.html'
                })
                .state('requirement.owner', {     //需求详情--响应业主
                    url: '/owner',
                    templateUrl: url+'owner.html'
                })
                .state('requirement.plan', {      //需求详情--方案列表
                    url: '/plan',
                    templateUrl: url+'plan.html'
                })
                .state('requirement.contract', {     //需求详情--生成合同
                    url: '/contract',
                    templateUrl: url+'contract.html'
                })
                .state('createPlan', {     //需求详情--提交方案/修改方案
                    url: '/create/:id',
                    templateUrl: url+'create.html',
                    controller : 'createCtrl'
                })
                .state('history', {      //历史订单列表
                    url: '/history',
                    templateUrl: url+'history.html',
                    controller : 'historyListCtrl'
                })
                .state('products', {      //作品列表
                    url: '/products',
                    templateUrl: url+'products.html',
                    controller : 'productsListCtrl'
                })
                .state('addProduct', {    //发布作品
                    url: '/release',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('updateProduct', {     //修改作品
                    url: '/release/:id',
                    templateUrl: url+'release.html',
                    controller : 'releaseCtrl'
                })
                .state('favorite', {      //收藏作品
                    url: '/favorite',
                    templateUrl: url+'favorite.html',
                    controller : 'favoriteProductCtrl'
                })
                .state('authHeart', {      //认证中心
                    url: '/authHeart',
                    templateUrl: url+'authHeart.html'
                })
                .state('idcard', {      //基本资料认证
                    url: '/idcard',
                    templateUrl: url+'idcard.html',
                    controller : 'idcardCtrl'
                })
                .state('addteam', {      //编辑施工团队
                    url: '/team',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl'
                })
                .state('updateteam', {      //编辑施工团队
                    url: '/team/:id',
                    templateUrl: url+'team.html',
                    controller : 'teamCtrl'
                })
                .state('teamList', {      //施工团队认证
                    url: '/teamList',
                    templateUrl: url+'teamList.html',
                    controller : 'teamCtrl'
                })
                .state('phone', {      //手机修改
                    url: '/phone',
                    templateUrl: url+'phone.html',
                    controller : 'phoneCtrl'
                })
                .state('email', {      //邮箱认证
                    url: '/email',
                    templateUrl: url+'email.html',
                    controller : 'emailCtrl'
                })
        });
    // angular bootstrap
    angular.bootstrap(document, ['myJyzDesigner']);
})();
