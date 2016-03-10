'use strict';

angular.module('angular-pd', [
      'angular-pd.templates'
    ])

    .directive('pureDatepicker', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'apd.html',
        scope: {
          ngModel: '=',
          apdStart: '=?',
          apdEnd: '=?',
          apdLocalization: '=?',
          apdIsUtc: '=?'
        },
        link: function (scope) {
          scope.apdIsUtc = scope.apdIsUtc || false;

          function copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
          }

          function getDt(obj) {
            return (obj && obj.dt) ? copyObj(obj.dt) : null;
          }

          var x;

          function _initData() {
            var modelDt = getDt(scope.ngModel) || +(new Date());
            var startDt = getDt(scope.apdStart);
            var endDt = getDt(scope.apdEnd);

            x = new xDateCore(modelDt, startDt, endDt);
            x.ListsState.initList();
            scope.lists = {
              d: x.ListsState.list.d,
              m: x.ListsState.list.m,
              y: x.ListsState.list.y
            };

            scope.ngModel = copyObj(x.State.selected);
          }

          scope.isUpdateFromCore = false;

          scope.$watch('ngModel', function (newModel, oldModel) {

            if (!x) return;
            if (!x.DateUtils.isValidModel(newModel)) return;
            if (newModel.dt === oldModel.dt) return;
            if (scope.isUpdateFromCore) return; //TODO (S.Panfilov) This doesn't work. Perhaps stop watching is a best solution

            scope.isUpdateFromCore = true;
            x.State.setSelected(newModel.dt);
            scope.ngModel = copyObj(x.State.selected);
            scope.isUpdateFromCore = false;

          }, true);

          scope.onSelectChanged = function () {
            scope.ngModel.dt = +(new Date(scope.ngModel.y, scope.ngModel.m, scope.ngModel.d));
          };

          (function _init() {
            _initData();
            scope.daysList = (scope.apdLocalization && scope.apdLocalization.daysList) ? scope.apdLocalization.daysList : x.Config.daysList;
            scope.monthList = (scope.apdLocalization && scope.apdLocalization.monthList) ? scope.apdLocalization.monthList : x.Config.monthList;
          })();

        }
      }
    })
;