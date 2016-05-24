(function () {
  angular.module('controllers')
    .controller('RequirementController', [
      '$scope', '$rootScope', 'adminRequirement', '$stateParams', '$location',

      function ($scope, $rootScope, adminRequirement, $stateParams, $location) {
        $scope.authList = [{
          id: "0",
          name: '未预约',
          cur: false
        }, {
          id: "1",
          name: '已预约无人响应',
          cur: false
        }, {
          id: "2",
          name: '有响应无人量房',
          cur: false
        }, {
          id: "6",
          name: '已量房无方案',
          cur: false
        }, {
          id: "3",
          name: '提交方案但无选定方案',
          cur: false
        }, {
          id: "4",
          name: '选定方案无配置合同',
          cur: false
        }, {
          id: "7",
          name: '已配置合同',
          cur: false
        }, {
          id: "5",
          name: '配置工地',
          cur: false
        }, {
          id: "8",
          name: '已完成',
          cur: false
        }, ];

        $stateParams.detail = JSON.parse($stateParams.detail || '{}');

        //数据加载显示状态
        $scope.loading = {
          loadData: false,
          notData: false
        };

        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/requirement/' + JSON.stringify(detail));
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

          if (detail.authType) {
            angular.forEach($scope.authList, function (value, key) {
              if (value.id == detail.authType) {
                if (value.cur) {
                  value.cur = false;
                } else {
                  value.cur = true;
                }
              } else {
                value.cur = false;
              }
            });
          }

          detail.currentPage = detail.currentPage || 1;
          $scope.pagination.currentPage = detail.currentPage;
        }

        //从页面获取详情
        function getDetailFromUI() {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
          var authType = undefined;
          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          angular.forEach($scope.authList, function (value, key) {
            if (value.cur) {
              authType = value.id;
            }
          });

          return {
            currentPage: $scope.pagination.currentPage,
            authType: authType,
            createAt: createAt
          }
        }

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

        //时间过滤
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

        //状态过滤
        $scope.authBtn = function (id) {
          $scope.pagination.currentPage = 1;
          angular.forEach($scope.authList, function (value, key) {
            if (value.id == id) {
              value.cur = !value.cur;
            } else {
              value.cur = false;
            }
          });

          refreshPage(getDetailFromUI());
        };
        //重置清空状态
        $scope.clearStatus = function () {
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          angular.forEach($scope.authList, function (value, key) {
            value.cur = false;
          });
          refreshPage(getDetailFromUI());
        };

        //加载数据
        function loadList(detail) {
          var data = {
            "query": {
              status: detail.authType,
              create_at: detail.createAt
            },
            "from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
            "limit": $scope.pagination.pageSize
          };
          console.log(data);
          adminRequirement.search(data).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.requirements;
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
    .controller('RequirementDesignerController', [
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
