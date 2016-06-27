(function () {
  angular.module('JfjAdmin.pages.designer')
    .controller('DesignerController', [ //设计师列表
      '$scope', '$rootScope', '$uibModal', 'adminDesigner', '$stateParams', '$location', 'mutiSelected',
      function ($scope, $rootScope, $uibModal, adminDesigner, $stateParams, $location, mutiSelected) {
        $scope.authList = [{
          id: "0",
          name: '未提交',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '已通过',
          cur: false
        }, {
          id: "3",
          name: '不通过',
          cur: false
        }, {
          id: "4",
          name: '已违规',
          cur: false
        }];

        $scope.uidAuthList = [{
          id: "0",
          name: '未提交',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '已通过',
          cur: false
        }, {
          id: "3",
          name: '不通过',
          cur: false
        }, {
          id: "4",
          name: '已违规',
          cur: false
        }];

        $scope.workAuthList = [{
          id: "0",
          name: '未提交',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '已通过',
          cur: false
        }, {
          id: "3",
          name: '不通过',
          cur: false
        }, {
          id: "4",
          name: '已违规',
          cur: false
        }];

        $scope.emailAuthList = [{
          id: "0",
          name: '未提交',
          cur: false
        }, {
          id: "1",
          name: '审核中',
          cur: false
        }, {
          id: "2",
          name: '已通过',
          cur: false
        }, {
          id: "3",
          name: '不通过',
          cur: false
        }, {
          id: "4",
          name: '已违规',
          cur: false
        }];

        $stateParams.detail = JSON.parse($stateParams.detail || '{}');
        //刷新页面公共方法
        function refreshPage(detail) {
          $location.path('/designer/' + JSON.stringify(detail));
        }

        //从url详情中初始化页面
        function initUI(detail) {
          if (detail.query) {
            if (detail.query.create_at) {
              if (detail.query.create_at["$gte"]) {
                $scope.startTime.time = new Date(detail.query.create_at["$gte"]);
              }

              if (detail.query.create_at["$lte"]) {
                $scope.endTime.time = new Date(detail.query.create_at["$lte"]);
              }
            }

            mutiSelected.initMutiSelected($scope.authList, detail.query.auth_type);
            mutiSelected.initMutiSelected($scope.uidAuthList, detail.query.uid_auth_type);
            mutiSelected.initMutiSelected($scope.workAuthList, detail.query.work_auth_type);
            mutiSelected.initMutiSelected($scope.emailAuthList, detail.query.email_auth_type);

            $scope.searchDesigner = detail.query.phone;
          }

          detail.from = detail.from || 0;
          detail.limit = detail.limit || 10;
          $scope.pagination.pageSize = detail.limit;
          $scope.pagination.currentPage = (detail.from / detail.limit) + 1;
          detail.sort = detail.sort || {
            create_at: -1
          };
          $scope.sort = detail.sort;
        }

        //从页面获取详情
        function refreshDetailFromUI(detail) {
          var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
          var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;

          var createAt = gte && lte ? {
            "$gte": gte,
            "$lte": lte
          } : undefined;

          detail.query = detail.query || {};
          detail.query.phone = $scope.searchDesigner || undefined;
          detail.query.auth_type = mutiSelected.getInQueryFormMutilSelected($scope.authList);
          detail.query.uid_auth_type = mutiSelected.getInQueryFormMutilSelected($scope.uidAuthList);
          detail.query.work_auth_type = mutiSelected.getInQueryFormMutilSelected($scope.workAuthList);
          detail.query.email_auth_type = mutiSelected.getInQueryFormMutilSelected($scope.emailAuthList);
          detail.query.create_at = createAt;
          detail.from = ($scope.pagination.pageSize) * ($scope.pagination.currentPage - 1);
          detail.limit = $scope.pagination.pageSize;
          detail.sort = $scope.sort;
          return detail;
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
            refreshPage(refreshDetailFromUI($stateParams.detail));
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
        //提示消息
        function tipsMsg(msg, time) {
          time = time || 2000;
          $uibModal.open({
            size: 'sm',
            template: '<div class="modal-header"><h3 class="modal-title">消息提醒</h3></div><div class="modal-body"><p class="text-center">' +
              msg + '</p></div>',
            controller: function ($scope, $timeout, $modalInstance) {
              $scope.ok = function () {
                $modalInstance.close();
              };
              $timeout(function () {
                $scope.ok();
              }, time);
            }
          });
        }
        //加载数据
        function loadList(detail) {
          console.log(detail);
          adminDesigner.search(detail).then(function (resp) {
            if (resp.data.data.total === 0) {
              $scope.loading.loadData = true;
              $scope.loading.notData = true;
              $scope.userList = [];
            } else {
              $scope.userList = resp.data.data.designers;
              // angular.forEach($scope.userList, function (value, key) {
              //   if ($scope.authType) {
              //     value.authDate = value.auth_date;
              //     value.status = value.auth_type;
              //   } else if ($scope.uidAuthType) {
              //     value.authDate = value.uid_auth_date;
              //     value.status = value.uid_auth_type;
              //   } else if ($scope.workAuthType) {
              //     value.authDate = value.work_auth_date;
              //     value.status = value.work_auth_type;
              //   } else if ($scope.emailAuthType) {
              //     value.authDate = value.email_auth_date;
              //     value.status = value.email_auth_type;
              //   }
              // });
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

        //搜索设计师
        $scope.searchBtn = function () {
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        }

        $scope.authBtn = function (id, list) {
          mutiSelected.curList(list, id);
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //排序
        $scope.sortData = function (sortby) {
          if ($scope.sort[sortby]) {
            $scope.sort[sortby] = -$scope.sort[sortby];
          } else {
            $scope.sort = {};
            $scope.sort[sortby] = -1;
          }
          $scope.pagination.currentPage = 1;
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //重置清空状态
        $scope.clearStatus = function () {
          mutiSelected.clearCur($scope.authList);
          mutiSelected.clearCur($scope.uidAuthList);
          mutiSelected.clearCur($scope.workAuthList);
          mutiSelected.clearCur($scope.emailAuthList);
          $scope.pagination.currentPage = 1;
          $scope.startTime.time = '';
          $scope.endTime.time = '';
          $scope.searchDesigner = undefined;
          $stateParams.detail = {};
          refreshPage(refreshDetailFromUI($stateParams.detail));
        };
        //设计师强制下线
        $scope.forcedOffline = function (id, status, designer) {
          status = status == 0 ? "1" : "0"
          if (confirm("你确定该设计师强制下线吗？")) {
            adminDesigner.online({
              "designerid": id,
              "new_oneline_status": status
            }).then(function (resp) {
              if (resp.data.msg === "success") {
                tipsMsg('操作成功');
                // designer.online_status = status;
                loadList(refreshDetailFromUI($stateParams.detail));
              }
            }, function (resp) {
              console.log(resp);
            });
          }
        };

        $scope.getProductDetail = function (designer) {
          var detail = {
            detail: JSON.stringify({
              query: {
                designerid: designer._id
              }
            })
          };
          return detail;
        };
      }
    ]);
})();