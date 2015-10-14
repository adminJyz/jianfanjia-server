'use strict';
angular.module('services', [])
<<<<<<< HEAD
<<<<<<< HEAD
	.factory('userInfo', ['$http', function($http){
		return function name(){
			
=======
	.factory('userInfo', ['$http', function($http){   //业主 get获取资料 post修改资料
		var doRequest = function(type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/user/info',
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
>>>>>>> 10bb1567a9c920511a1dfe40d1671f1315119a32
		};
		return {
			get : function(){return doRequest('GET')},
			update : function(data){return doRequest('POST' , data)}
		}
	}])
<<<<<<< HEAD
	
=======
	.factory('userInfo', ['$http', function($http){   //业主 get获取资料 post修改资料
		var doRequest = function(type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/user/info',
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			get : function(){return doRequest('GET')},
			update : function(data){return doRequest('POST' , data)}
		}
	}])
=======
>>>>>>> 10bb1567a9c920511a1dfe40d1671f1315119a32
	.factory('userRequiremtne', ['$http', function($http){      //业主 add 提交需求 update更新需求 list需求列表 order预约量房 checked确认设计师量完房 plans获取方案列表 define选定方案  plan获取某个方案信息
		var doRequest = function(url,type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(){return doRequest('user_my_requiremtne_list','GET')},
			add : function(data){return doRequest('user_add_requirement','POST', data)},
			get : function(data){return doRequest('user_one_requirement','POST', data)},
			update : function(data){return doRequest('user_update_requirement','POST' , data)},
			order : function(data){return doRequest('user_order_designer','POST' , data)},
			checked : function(data){return doRequest('user_order_designer','POST' , data)},
			plans : function(data){return doRequest('user_requirement_plans','POST' , data)},
			define : function(data){return doRequest('user/plan/final','POST' , data)},
			plan : function(data){return doRequest('one_plan','POST' , data)}
		}
	}])
	.factory('userFavoriteDesigner', ['$http', function($http){     //业主 list获取意向设计师列表 add添加 remove删除
		var doRequest = function(url,type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/favorite/designer/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(){return doRequest('list','POST')},
			add : function(data){return doRequest('add','POST',data)},
			remove : function(data){return doRequest('delete','POST',data)}
		}
	}])
	.factory('userFavoriteProduct', ['$http', function($http){     //业主 list收藏作品列表 add添加收藏 remove删除收藏
		var doRequest = function(url,type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/favorite/product/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			list : function(){return doRequest('list','GET')},
			add : function(data){return doRequest('add','POST', data)},
			remove : function(data){return doRequest('delete','POST' , data)}
		}
	}])
	.factory('userComment', ['$http', function($http){     //业主 unread获取未读评论 add添加评论 delete评论并标记为已读
		var doRequest = function(url,type,data){
			return $http({
                method : type,
                url : RootUrl+'api/v2/web/'+url,
                headers: {
					'Content-Type': 'application/json; charset=utf-8'
			    },
                data: data
            })
		};
		return {
			unread : function(){return doRequest('unread_comment','GET')},
			add : function(data){return doRequest('add_comment','POST', data)},
			read : function(data){return doRequest('topic_comments','POST' , data)}
		}
<<<<<<< HEAD
	}])
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
=======
	}])
>>>>>>> 10bb1567a9c920511a1dfe40d1671f1315119a32
