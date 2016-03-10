var xDateCore = function(selectedDt, startDt, endDt) {
  'use strict';

  var x = {
    Config: {
      isUtc: false,
      direction: {
        d: 'asc',
        m: 'asc',
        y: 'desc'
      },
      defaultYearsCount: 30,
      daysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },

    CommonUtils: {
      isValidNumber: function(num) {
        var isNumber = !isNaN(parseFloat(num));
        var isNotInfinity = isFinite(num);
        return isNumber && isNotInfinity;
      },
      getArrayOfNumbers: function(start, end) {
        //TODO (S.Panfilov) check this in after build
        //if (!exports.isValidNumber(start) || !exports.isValidNumber(end)) return [];
        if (!this.isValidNumber(start) || !this.isValidNumber(end)) return [];

        var isReverse = (start > end);
        var targetLength = isReverse ? (start - end) + 1 : (end - start) + 1;
        var arr = new Array(targetLength);
        var newArr = Array.apply(null, arr);
        var result = newArr.map(function(d, n) {
          return (isReverse) ? n + end : n + start;
        });

        return (isReverse) ? result.reverse() : result;
      },
      intArraySort: function(arr, direction) {
        var DESC = 'desc';

        function desc(a, b) {
          return b - a;
        }

        switch (direction) {
          default: return arr.sort(function(a, b) {
            return a - b;
          });
          case DESC:
              return arr.sort(desc);
        }
      }
    },
    ListsState: {
      list: {},
      reloadDaysList: function() {
        this.list.d = x.DaysUtils.getDaysList();
      },
      reloadMonthList: function() {
        this.list.m = x.MonthUtils.getMonthList();
      },
      reloadYearsList: function() {
        this.list.y = x.YearsUtils.getYearsList();
      },
      initList: function() {
        this.reloadDaysList();
        this.reloadMonthList();
        this.reloadYearsList();
      }
    },

    DateModel:
      (function() {
        return function DateModel(dt) {
          if (!dt || Number.isNaN(+dt) || !Number.isFinite(+dt)) throw 'NaN or null';
          this.d = x.DateUtils.getDay(+dt);
          this.dow = x.DateUtils.getDayOfWeek(+dt);
          this.m = x.DateUtils.getMonth(+dt);
          this.y = x.DateUtils.getYear(+dt);
          this.dt = +dt;
          this.tz = new Date(+dt).getTimezoneOffset();

          return this;
        };
      })(),

    DateUtils:
      (function() {

        function getVal(dt, method) {
          var date = new Date(+dt);
          return (date && method) ? method.call(date) : null;
        }

        var exports = {
          getDay: function(dt) {
            if (!dt && dt !== 0) return null;
            var method = (x.Config.isUtc) ? Date.prototype.getUTCDate : Date.prototype.getDate;
            return getVal(dt, method);
          },
          getDayOfWeek: function(dt) {
            if (!dt && dt !== 0) return null;
            var method = (x.Config.isUtc) ? Date.prototype.getUTCDay : Date.prototype.getDay;
            return getVal(dt, method);
          },
          getYear: function(dt) {
            if (!dt && dt !== 0) return null;
            var method = (x.Config.isUtc) ? Date.prototype.getUTCFullYear : Date.prototype.getFullYear;
            return getVal(dt, method);
          },
          getMonth: function(dt) {
            if (!dt && dt !== 0) return null;
            var method = (x.Config.isUtc) ? Date.prototype.getUTCMonth : Date.prototype.getMonth;
            return getVal(dt, method);
          },
          getDaysInMonth: function(month, year) {
            var method = (x.Config.isUtc) ? Date.prototype.getUTCDate : Date.prototype.getDate;
            return method.call(new Date(+year, (+month) + 1, 0));
          },
          isValidModel: function(model) {
            return !!model && (!!model.dt || model.dt === 0) && !Number.isNaN(+model.dt) && Number.isFinite(+model.dt);
          },
          isDateUpperStartLimit: function(dt, start) {
            if (!start) return true;
            if ((!dt && dt !== 0) || Number.isNaN(+dt) || Number.isNaN(+start)) throw 'NaN or null';
            return (+dt > +start);
          },
          isDateLowerEndLimit: function(dt, end) {
            if (!end) return true;
            if (Number.isNaN(+dt) || Number.isNaN(+end)) throw 'NaN or null';
            return (+dt < +end);
          },
          isDateBetweenLimits: function(dt, start, end) {
            return (exports.isDateUpperStartLimit(dt, start) && exports.isDateLowerEndLimit(dt, end));
          }
        };


        return exports;
      })(),

    DaysUtils: {
      getDaysList: function() {
        var result;
        var START_DAY = 1;

        var lastDayInMonth = x.DateUtils.getDaysInMonth(x.State.selected.y, x.State.selected.y);

        var isStart = x.State.start.isExist;
        var isEnd = x.State.end.isExist;

        if (isStart || isEnd) {
          var isYearOfLowerLimit = (isStart) ? x.State.start.y === x.State.selected.y : false;
          var isYearOfUpperLimit = (isEnd) ? x.State.end.y === x.State.selected.y : false;
          var isMonthOfLowerLimit = (isStart) ? x.State.start.m === x.State.selected.y : false;
          var isMonthOfUpperLimit = (isEnd) ? x.State.end.m === x.State.selected.y : false;

          var isLowerLimit = (isYearOfLowerLimit && isMonthOfLowerLimit);
          var isUpperLimit = (isYearOfUpperLimit && isMonthOfUpperLimit);

          var start = (isStart) ? x.State.start.d : START_DAY;
          var end = (isEnd) ? x.State.end.d : lastDayInMonth;

          if (isLowerLimit && isUpperLimit) {
            result = x.CommonUtils.getArrayOfNumbers(start, end);
          } else if (isLowerLimit && !isUpperLimit) {
            result = x.CommonUtils.getArrayOfNumbers(start, lastDayInMonth);
          } else if (!isLowerLimit && isUpperLimit) {
            result = x.CommonUtils.getArrayOfNumbers(START_DAY, end);
          } else { // in all other cases return array of 12 month
            result = x.CommonUtils.getArrayOfNumbers(START_DAY, lastDayInMonth);
          }
        } else { // in all other cases return array of 12 month
          result = x.CommonUtils.getArrayOfNumbers(START_DAY, lastDayInMonth);
        }

        return x.CommonUtils.intArraySort(result, x.Config.direction.d);
      }
    },

    State: {
      selected: {}, //TODO (S.Panfilov) refactor selected
      setSelected: function(dt, isForce) {
        var result;
        var self = this;

        if (isForce) {
          this.selected = new x.DateModel(dt);
          return;
        }

        var c = {
          isStart: self.start.isExist,
          isEnd: self.end.isExist,
          isDtBeyondStart: (dt > this.start.dt),
          isDtEqualStart: (dt === this.start.dt),
          isDtBeyondEnd: (dt > this.end.dt),
          isDtEqualEnd: (dt === this.end.dt)
        };
        //
        //if (c.isStart && !c.isEnd && !c.isDtBeyondStart) {//start == 1; model == 0
        //  result = this.start.dt;
        //} else if (!c.isStart && c.isEnd && !c.isDtBeyondEnd) {//model == 4; end == 3;
        //  result = this.end.dt;
        //} else {
        //  result = dt;
        //}


        if (c.isStart || c.isEnd) {
          if (!c.isDtBeyondStart) { //start == 1; model == 0
            result = this.start.dt;
          } else if (!c.isDtBeyondEnd) {
            result = this.end.dt;
          }
        } else {
          result = dt;
        }

        //if (!c.isStart && !c.isEnd) { //start == null; model == 1; end == null
        //  result = dt;
        //} else if (c.isStart && !c.isEnd) {//Start Limit
        //  if (!c.isDtBeyondStart) { //start == 1; model == 0
        //    result = this.start.dt;
        //  } else {
        //    result = dt;//start == 1; model == 1 or 2
        //  }
        //} else if (!c.isStart && c.isEnd) {//End Limit
        //  if (!c.isDtBeyondEnd) { //model == 4; end == 3;
        //    result = this.end.dt;
        //  } else {
        //    result = dt;//model == 2 or 3; end == 3;
        //  }
        //} else if (c.isStart && c.isEnd) {//Both Limits
        //  if ((c.isDtBeyondStart || c.isDtEqualStart) || (c.isDtBeyondEnd || c.isDtEqualEnd)) {//start == 1; model == 1 or 2 or 3; end == 3;
        //    result = dt;
        //  }
        //}

        this.selected = new x.DateModel(result);
      },
      start: {},
      setStart: function(dt) {
        if (!dt && dt !== 0) return;
        this.start = new x.DateModel(dt);
        cases.isStart = true;
      },
      end: {},
      setEnd: function(dt) {
        if (!dt && dt !== 0) return;
        this.end = new x.DateModel(dt);
        cases.isEnd = true;
      },
      setLimits: function(start, end) {
        this.setStart(start);
        this.setEnd(end);
      },
      resetNow: function() {
        this.now = new x.DateModel(+(new Date()));
      },
      now: null // new x.DateModel(+(new Date())) //TODO (S.Panfilov) FIX it - x is undefined
    },

    MonthUtils: {
      getMonthList: function() {
        var result;
        var START_MONTH = 0;
        var END_MONTH = 11;

        var isStart = x.State.start.isExist;
        var isEnd = x.State.end.isExist;

        if (isStart || isEnd) {
          var isYearOfLowerLimit = (isStart) ? x.State.start.y === x.State.selected.y : false;
          var isYearOfUpperLimit = (isEnd) ? x.State.end.y === x.State.selected.y : false;
          var start = (isStart) ? x.State.start.m : START_MONTH;
          var end = (isEnd) ? x.State.end.m : END_MONTH;

          // startYear == 2015, nowYear == 2015, endYear == 2015
          if (isYearOfLowerLimit && isYearOfUpperLimit) {
            result = x.CommonUtils.getArrayOfNumbers(start, end);
          } else if (isYearOfLowerLimit && !isYearOfUpperLimit) { // startYear == 2015, nowYear == 2015, endYear == 2016 (or null)
            result = x.CommonUtils.getArrayOfNumbers(start, END_MONTH);
          } else if (!isYearOfLowerLimit && isYearOfUpperLimit) { // startYear == 2014 (or null), nowYear == 2015, endYear == 2015
            result = x.CommonUtils.getArrayOfNumbers(START_MONTH, end);
          } else { // in all other cases return array of 12 month
            result = x.CommonUtils.getArrayOfNumbers(START_MONTH, END_MONTH);
          }
        } else { // in all other cases return array of 12 month
          result = x.CommonUtils.getArrayOfNumbers(START_MONTH, END_MONTH);
        }

        return x.CommonUtils.intArraySort(result, x.Config.direction.m);
      }
    },

    YearsUtils:
      (function() {

        function _getLatestPossibleYear(yearsCount, selectedY, nowY) {
          var result = (selectedY > nowY) ? selectedY : nowY;
          result += (yearsCount - 1);
          return result;
        }

        function _getFirstPossibleYear(yearsCount, selectedY, nowY) {
          var result = (selectedY < nowY) ? selectedY : nowY;
          result -= (yearsCount - 1);
          return result;
        }

        function _getRangeValues(selectedY, startY, endY, nowY) {

          var YEARS_COUNT = x.Config.defaultYearsCount;
          var latestPossibleYear = _getLatestPossibleYear(YEARS_COUNT, selectedY, nowY);
          var firstPossibleYear = _getFirstPossibleYear(YEARS_COUNT, selectedY, nowY);

          var statement = {
            isBoth: !!(startY && endY),
            isBothNot: !!(!startY && !endY),
            isOnlyStart: !!(startY && !endY),
            isOnlyEnd: !!(!startY && endY),
            isStartLower: (startY < endY),
            isEndLower: (startY > endY),
            isStartEqualEnd: (startY === endY),
            isEndUpperNow: (endY > nowY),
            isEndEqualNow: (endY === nowY)
          };

          //start = 2011, end = 2014
          if (statement.isBoth && statement.isStartLower) {
            return {
              from: startY,
              to: endY
            };
          }

          //start = 2014, end = 2011
          if (statement.isBoth && statement.isEndLower) {
            return {
              from: endY,
              to: startY
            };
          }

          //start = 2011, end = 2011
          if (statement.isBoth && statement.isStartEqualEnd) {
            return {
              from: startY,
              to: endY
            };
          }

          //start = 2014, end = null
          if (statement.isOnlyStart) {
            return {
              from: startY,
              to: latestPossibleYear
            };
          }

          //start = null, end = 2014
          if (statement.isOnlyEnd) {
            //start = null, now = 2013 (or 2014), end = 2014
            if (statement.isEndUpperNow || statement.isEndEqualNow) {
              //TODO (S.Panfilov) wtf? I cannot remember wtf this statement check
              if ((firstPossibleYear - YEARS_COUNT) > (endY - YEARS_COUNT)) {
                return {
                  from: firstPossibleYear,
                  to: endY
                };
              } else {
                return {
                  from: endY - (YEARS_COUNT - 1),
                  to: endY
                };
              }
            }

            //start = null, now = 2015,  end = 2014
            if (!statement.isEndUpperNow) {
              return {
                from: endY - (YEARS_COUNT - 1),
                to: endY
              };
            }
          }

          //start = null, end = null
          if (statement.isBothNot) {
            return {
              from: firstPossibleYear,
              to: latestPossibleYear
            };
          }
        }

        var exports = {
          getYearsList: function() {
            var range = _getRangeValues(x.State.selected.y, x.State.start.y, x.State.end.y, x.State.now.y);
            var result = x.CommonUtils.getArrayOfNumbers(range.from, range.to);

            return x.CommonUtils.intArraySort(result, x.Config.direction.y);
          }
        };


        return exports;
      })()
  };
  x.State.resetNow();
  x.State.setLimits(startDt, endDt);
  x.State.setSelected(selectedDt);
  return x;
};
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

            scope.daysList = (scope.apdLocalization && scope.apdLocalization.daysList) ? scope.apdLocalization.daysList : x.Config.daysList;
            scope.monthList = (scope.apdLocalization && scope.apdLocalization.monthList) ? scope.apdLocalization.monthList : x.Config.monthList;

            //ngModelWatcher.start(onModelChange);
          })();

        }
      }
    })
;
angular.module("angular-pd.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("apd.html","<div class=apd_root><select ng-model=ngModel.d ng-options=\"day for day in lists.d\" ng-init=\"ngModel.d = lists.d[0]\" class=\"apd_elem apd_select_day apd_select\"></select><span ng-bind=daysList[ngModel.dow] class=\"apd_elem apd_day_of_week\"></span><select ng-model=ngModel.m ng-options=\"monthList[month] for month in lists.m\" ng-init=\"ngModel.m = lists.m[0]\" class=\"apd_elem apd_select_month apd_select\"></select><select ng-model=ngModel.y ng-options=\"year for year in lists.y\" ng-init=\"ngModel.y = lists.y[0]\" class=\"apd_elem apd_select_year apd_select\"></select></div>");}]);