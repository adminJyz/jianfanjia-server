(function () {
  angular.module('controllers')
    .controller('UserController', [
      '$scope', '$rootScope', 'adminUser', '$stateParams', '$location',
      function ($scope, $rootScope, adminUser, $stateParams, $location) {
        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/user/' + JSON.stringify(detail));
        }

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.createAt) {
            if (detail.createAt["$gte"]) {
              $scope.startTime.time = new Date(detail.createAt["$gte"]);
            }

            if (detail.createAt["$lte"]) {
              $scope.endTime.time = new Date(detail.createAt["$lte"]);
            }
          }

          detail.currentPage = detail.currentPage || 1;
          $scope.pagination.currentPage = detail.currentPage;
          $scope.searchUser = detail.searchUser;
        }

        //从页面获取详情
        function getDetailFromUI() {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;


          return {
            currentPage: $scope.pagination.currentPage,
            searchUser: $scope.searchUser || undefined,
            createAt: createAt
          }
        }

        //数据加载显示状态
        $scope.loading = {
          loadData: false,
          notData: false
        };

        //分页控件
        $scope.pagination = {
          currentPage: 1,
          totalItems: 0,
          maxSize: 5,
          pageSize: 10,
          pageChanged: function () {
            refreshPage(getDetailFromUI());
          }
        };
        //时间筛选控件
        $scope.startTime = {
          clear: function () {
            this.dt = null;
          },
          dateOptions: {
            formatYear: 'yy',
            startingDay: 1
          },
          status: {
            opened: false
          },
          open: function ($event) {
            this.status.opened = true;
          },
          today: function () {
            this.dt = new Date();
          }
        };
        $scope.startTime.today();
        $scope.endTime = {
          clear: function () {
            this.dt = null;
          },
          dateOptions: {
            formatYear: 'yy',
            startingDay: 1
          },
          status: {
            opened: false
          },
          open: function ($event) {
            this.status.opened = true;
          },
          today: function () {
            this.dt = new Date();
          }
        };
        $scope.endTime.today();
        $scope.searchTimeBtn = function () {
          var start = new Date($scope.startTime.time).getTime();
          var end = new Date($scope.endTime.time).getTime();
          if (start > end) {
            alert('开始时间比结束时间大，请重新选择');
            return;
          }
          if (end - start < 86400000) {
            alert('结束时间必须必比开始时间大一天，请重新选择');
            return;
          }

          $scope.pagination.currentPage = 1;
          refreshPage(getDetailFromUI());
        };
        //搜索业主
        $scope.searchBtn = function () {
          $scope.pagination.currentPage = 1;
          refreshPage(getDetailFromUI());
        };

        //重置清空状态
        $scope.clearStatus = function () {
          $scope.searchUser = undefined;
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          refreshPage(getDetailFromUI());
        };

        //加载数据
        function loadList(detail) {
          var data = {
            "query": {
              phone: detail.searchUser,
              create_at: detail.createAt
            },
            "from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
            "limit": $scope.pagination.pageSize
          };
          adminUser.search(data).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.users;
              $scope.pagination.totalItems = resp.data.data.total;
              $scope.loading.loadData = true;
              $scope.loading.notData = false;
            }
          }, function (resp) {
            //返回错误信息
            $scope.loadData = false;
            console.log(resp);

          });
        }
        //初始化UI
        initUI($stateParams.detail);
        //初始化数据
        loadList($stateParams.detail);
      }
    ])
    .controller('UserInfoController', [
      '$scope', '$rootScope', '$stateParams', 'adminUser',
      function ($scope, $rootScope, $stateParams, adminUser) {
        adminUser.search({
          "query": {
            "_id": $stateParams.id
          },
          "from": 0,
          "limit": 1
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.user = resp.data.data.users[0];
            $scope.head = !!$scope.user.imageid ? RootUrl + 'api/v2/web/thumbnail/200/' + $scope.user.imageid : 'jyz/img/headpic.jpg';
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ])
    .controller('UserRequirementController', [
      '$scope', '$rootScope', '$stateParams', 'adminRequirement',
      function ($scope, $rootScope, $stateParams, adminRequirement) {
        adminRequirement.search({
          "query": {
            "userid": $stateParams.id
          },
          "sort": {
            "_id": 1
          },
          "from": 0,
          "limit": 10
        }).then(function (resp) {
          if (resp.data.data.total !== 0) {
            $scope.userList = resp.data.data.requirements;
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ])
    .controller('UserDesignerController', [
      '$scope', '$rootScope', '$stateParams', 'adminRequirement', 'adminPlan', 'adminDesigner',
      function ($scope, $rootScope, $stateParams, adminRequirement, adminPlan, adminDesigner) {
        adminRequirement.search({
          "query": {
            "_id": $stateParams.id
          },
          "sort": {
            "_id": 1
          },
          "from": 0,
          "limit": 10
        }).then(function (resp) {
          if (resp.data.data.total === 1) {
            $scope.user = resp.data.data.requirements[0];
            //所有方案
            adminPlan.search({
              "query": {
                "requirementid": $scope.user._id
              },
              "sort": {
                "_id": 1
              },
              "from": 0
            }).then(function (resp) {
              if (resp.data.data.total !== 0) {
                $scope.plans = resp.data.data.requirements;
                angular.forEach($scope.plans, function (value, key) {
                  if (value.requirement.rec_designerids.indexOf(value.designerid) != -1) {
                    value.biaoshi = "匹配";
                  } else {
                    value.biaoshi = "自选";
                  }
                });
              }
            }, function (resp) {
              //返回错误信息
              console.log(resp);
            });
            //匹配设计师
            if ($scope.user.rec_designerids.length > 0) {
              adminDesigner.search({
                "query": {
                  "_id": {
                    "$in": $scope.user.rec_designerids
                  }
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total !== 0) {
                  $scope.recDesignerList = resp.data.data.designers;
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
            //所有参与设计师
            if ($scope.user.order_designerids.length > 0) {
              adminDesigner.search({
                "query": {
                  "_id": {
                    "$in": $scope.user.order_designerids
                  }
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total !== 0) {
                  $scope.designerList = resp.data.data.designers;
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
            //最后成交设计师
            if ($scope.user.final_designerid) {
              adminDesigner.search({
                "query": {
                  "_id": $scope.user.final_designerid
                },
                "sort": {
                  "_id": 1
                },
                "from": 0
              }).then(function (resp) {
                if (resp.data.data.total === 1) {
                  $scope.finalDesigner = resp.data.data.designers[0];
                }
              }, function (resp) {
                //返回错误信息
                console.log(resp);
              });
            }
          }
        }, function (resp) {
          //返回错误信息
          console.log(resp);

        });
      }
    ]);
})();
