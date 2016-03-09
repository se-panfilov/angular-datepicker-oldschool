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

          //var ngModelWatcher = {
          //  handler: null,
          //  start: function (callback) {
          //    ngModelWatcher.handler = scope.$watch('ngModel.dt', function (value, oldValue) {
          //      if (callback) {
          //        callback(value, oldValue)
          //      }
          //
          //    }, true);
          //  },
          //  stop: function () {
          //    ngModelWatcher.handler();
          //    return true;
          //  }
          //};

          //function getLimitSafeDatetime(day, month, year) {
          //
          //  var datetime = new Date(year, month, day).getTime();
          //
          //  if (!x.DateUtils.isDateBetweenLimits(datetime, settings.startDateTime, settings.endDateTime)) {
          //    if (!x.DateUtils.isDateUpperStartLimit(datetime, settings.startDateTime)) {
          //      datetime = settings.startDateTime;
          //    } else if (!x.DateUtils.isDateLowerEndLimit(datetime, settings.endDateTime)) {
          //      datetime = settings.endDateTime;
          //    }
          //  }
          //
          //  return datetime;
          //}

          //function updateModel(datetime) {
          //  ngModelWatcher.stop();
          //  scope.data.selected = new DateModel(datetime);
          //  scope.ngModel = scope.data.selected;
          //  ngModelWatcher.start(onModelChange);
          //}

          //function onModelChange(datetime, oldValue) {
          //  if (datetime === oldValue) {
          //    return;
          //  }
          //
          //  var day = x.DateUtils.getDay(datetime);
          //  var month = x.DateUtils.getMonth(datetime);
          //  var year = x.DateUtils.getYear(datetime);
          //
          //  datetime = getLimitSafeDatetime(day, month, year);
          //  updateModel(datetime);
          //
          //  scope.data.reloadYearsList();
          //  scope.data.reloadMonthList();
          //  scope.data.reloadDaysList();
          //}

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


          var isUpdateFromCore = false;

          //scope.$watch('ngModel', function (newModel, oldModel) {
          //
          //  if (!x) return;
          //  if (!x.DateUtils.isValidModel(newModel)) return;
          //  if (newModel.dt === oldModel.dt) return;
          //  if (isUpdateFromCore) return;
          //
          //  isUpdateFromCore = true;
          //  x.State.setSelected(newModel.dt);
          //  scope.ngModel = copyObj(x.State.selected);
          //  isUpdateFromCore = false;
          //
          //}, true);


          //scope.onDaySelectChanged = function (day) {
          //  if (!day) return;
          //
          //  var datetime = getLimitSafeDatetime(scope.data.selected.d, scope.data.selected.m, scope.data.selected.y);
          //  updateModel(datetime);
          //};
          //
          //scope.onMonthSelectChanged = function (month) {
          //  if (!month && month !== 0) return;
          //
          //  var datetime;
          //  var year = scope.data.selected.y;
          //  var day = scope.data.selected.d;
          //
          //  datetime = getLimitSafeDatetime(day, month, year);
          //  updateModel(datetime);
          //
          //  scope.data.reloadDaysList();
          //};
          //
          //scope.onYearSelectChanged = function (year) {
          //  if (!year && year !== 0) return;
          //
          //  var month = scope.data.selected.m;
          //  var day = scope.data.selected.d;
          //
          //  var datetime = getLimitSafeDatetime(day, month, year);
          //  updateModel(datetime);
          //
          //  scope.data.reloadMonthList();
          //  scope.data.reloadDaysList();
          //};

          (function _init() {
            _initData();

            //scope.daysList = (scope.apdLocalization && scope.apdLocalization.daysList) ? scope.apdLocalization.daysList : Config.daysList;
            //scope.monthList = (scope.apdLocalization && scope.apdLocalization.monthList) ? scope.apdLocalization.monthList : Config.monthList;

            //ngModelWatcher.start(onModelChange);
          })();

        }
      }
    })
;