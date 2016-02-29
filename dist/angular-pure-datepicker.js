var xDateCore = (function () {
    var exports = {};
exports.Config = (function () {
    'use strict';

    return {
        isUtc: false,
        monthDirection: 'asc',
        daysDirection: 'asc',
        yearsDirection: 'desc',
        defaultYearsCount: 50,
        daysList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
})();
exports.CommonUtils = (function () {
    'use strict';

    var exports = {
        isValidNumber: function (num) {
            var isNumber = !isNaN(parseFloat(num));
            var isNotInfinity = isFinite(num);
            return isNumber && isNotInfinity;
        },
        getArrayOfNumbers: function (start, end) {
            if (!exports.isValidNumber(start) || !exports.isValidNumber(end)) return [];

            var isReverse = (start > end);
            var targetLength = isReverse ? (start - end) + 1 : (end - start ) + 1;
            var arr = new Array(targetLength);
            var newArr = Array.apply(null, arr);
            var result = newArr.map(function (d, n) {
                return (isReverse) ? n + end : n + start;
            });

            return (isReverse) ? result.reverse() : result;
        },
        intArraySort: function (arr, direction) {
            var DESC = 'desc';

            function desc(a, b) {
                return b - a;
            }

            switch (direction) {
                default:
                    return arr.sort(function (a, b) {
                        return a - b;
                    });
                case DESC:
                    return arr.sort(desc);
            }
        }
    };

    return exports;
})();
exports.DateUtils = (function (Config) {
    'use strict';

    function getVal(dt, method) {
        var date = new Date(+dt);
        return (date && method) ? method.call(date) : null;
    }

    var exports = {
        getDay: function (dt) {
            var method = (Config.isUtc) ? Date.prototype.getUTCDate : Date.prototype.getDate;
            return getVal(dt, method);
        },
        getDayOfWeek: function (dt) {
            var method = (Config.isUtc) ? Date.prototype.getUTCDay : Date.prototype.getDay;
            return getVal(dt, method);
        },
        getYear: function (dt) {
            var method = (Config.isUtc) ? Date.prototype.getUTCFullYear : Date.prototype.getFullYear;
            return getVal(dt, method);
        },
        getMonth: function (dt) {
            var method = (Config.isUtc) ? Date.prototype.getUTCMonth : Date.prototype.getMonth;
            return getVal(dt, method);
        },
        getDaysInMonth: function (month, year) {
            var method = (Config.isUtc) ? Date.prototype.getUTCDate : Date.prototype.getDate;
            return method.call(new Date(+year, (+month) + 1, 0));
        },
        isValidModel: function (model) {
            return !!model && (!!model.dt || model.dt === 0) && !Number.isNaN(+model.dt) && Number.isFinite(+model.dt);
        },
        isDateUpperStartLimit: function (dt, start) {
            if (!start) return true;
            //TODO (S.Panfilov) should be a const
            if ((!dt && dt !== 0) || Number.isNaN(+dt) || Number.isNaN(+start)) throw 'NaN or null';
            //TODO (S.Panfilov) may be (+dt >= +end)
            return (+dt > +start);
        },
        isDateLowerEndLimit: function (dt, end) {
            if (!end) return true;
            //TODO (S.Panfilov) should be a const
            if (Number.isNaN(+dt) || Number.isNaN(+end)) throw 'NaN or null';
            //TODO (S.Panfilov) may be (+dt <= +end)
            return (+dt < +end);
        },
        isDateBetweenLimits: function (dt, start, end) {
            //TODO (S.Panfilov) lowerAndEqual and UpperAndEqual?
            return (exports.isDateUpperStartLimit(dt, start) && exports.isDateLowerEndLimit(dt, end));
        }
    };


    return exports;
})(exports.Config);
exports.LimitsModel = (function (DateUtils) {
    'use strict';

    function LimitsModel(start, end) {

        var exports = {
            start: {},
            end: {},
            now: {}
        };

        function _setStart(dt) {
            exports.start.d = DateUtils.getDay(+dt);
            exports.start.m = DateUtils.getMonth(+dt);
            exports.start.y = DateUtils.getYear(+dt);
            exports.start.dt = +dt;
            //TODO (S.Panfilov) Possible strict violation
            return this;
        }

        function _setEnd(dt) {
            exports.end.d = DateUtils.getDay(+dt);
            exports.end.m = DateUtils.getMonth(+dt);
            exports.end.y = DateUtils.getYear(+dt);
            exports.end.dt = +dt;
            //TODO (S.Panfilov) Possible strict violation
            return this;
        }

        function _setNow() {
            var dt = new Date().getTime();
            exports.now.d = DateUtils.getDay(dt);
            exports.now.m = DateUtils.getMonth(dt);
            exports.now.y = DateUtils.getYear(dt);
            exports.now.dt = dt;
            //TODO (S.Panfilov) Possible strict violation
            return this;
        }

        if (start) _setStart(start);
        if (end) _setEnd(end);
        _setNow();

        
        return exports;
    }
    
    return LimitsModel;
})(exports.DateUtils);
exports.DateModel = (function (DateUtils) {
    'use strict';

    function DateModel(dt) {
        //TODO (S.Panfilov) throwed error must be a const
        if (!dt || Number.isNaN(+dt) || !Number.isFinite(+dt)) throw 'NaN or null';
        this.d = DateUtils.getDay(+dt);
        this.dow = DateUtils.getDayOfWeek(+dt);
        this.m = DateUtils.getMonth(+dt);
        this.y = DateUtils.getYear(+dt);
        this.dt = +dt;
        this.tz = new Date(+dt).getTimezoneOffset();

        return this;
    }

    return DateModel;
})(exports.DateUtils);
exports.YearsUtils = (function (CommonUtils, Config) {
    'use strict';

    function _getLatestPossibleYear(yearsCount, selectedYear, now) {
        var result = (selectedYear > now) ? selectedYear : now;
        result += (yearsCount - 1);
        return result;
    }

    function _getFirstPossibleYear(yearsCount, selectedYear, now) {
        var result = (selectedYear < now) ? selectedYear : now;
        result -= (yearsCount - 1);
        return result;
    }

    function _getRangeValues(selectedYear, startYear, endYear, nowYear, yearsCount) {

        var YEARS_COUNT = Config.defaultYearsCount;
        var latestPossibleYear = _getLatestPossibleYear(YEARS_COUNT, selectedYear, nowYear);
        var firstPossibleYear = _getFirstPossibleYear(YEARS_COUNT, selectedYear, nowYear);

        var statement = {
            isBoth: startYear && endYear,
            isBothNot: !startYear && !endYear,
            isOnlyStart: startYear && !endYear,
            isOnlyEnd: !startYear && endYear,
            isStartLower: startYear < endYear,
            isEndLower: startYear > endYear,
            isStartEqualEnd: startYear === endYear,
            isEndUpperNow: endYear > nowYear,
            isEndEqualNow: endYear === nowYear
        };

        //start = 2011, end = 2014
        if (statement.isBoth && statement.isStartLower) {
            return {from: startYear, to: endYear};
        }

        //start = 2014, end = 2011
        if (statement.isBoth && statement.isEndLower) {
            return {from: endYear, to: startYear};
        }

        //start = 2011, end = 2011
        if (statement.isBoth && statement.isStartEqualEnd) {
            return {from: startYear, to: endYear};
        }

        //start = 2014, end = null
        if (statement.isOnlyStart) {
            return {from: startYear, to: latestPossibleYear};
        }

        //start = null, now = 2013 (or 2014), end = 2014
        if (statement.isOnlyEnd && (statement.isEndUpperNow || statement.isEndEqualNow)) {
            //TODO (S.Panfilov) wtf? I cannot remember wtf this statement check
            if ((firstPossibleYear - yearsCount) > (endYear - yearsCount)) {
                return {from: firstPossibleYear, to: endYear};
            } else {
                return {from: endYear - (yearsCount - 1), to: endYear};
            }
        }

        //now = 2015,  end = 2014
        if (statement.isOnlyEnd && statement.isEndUpperNow) {
            return {from: endYear - (yearsCount - 1), to: endYear};
        }

        //start = null, end = null
        if (statement.isBothNot) {
            return {from: firstPossibleYear, to: latestPossibleYear};
        }
    }

    var exports = {
        getYearsList: function (selectedYear, startYear, endYear, nowYear) {
            var range = _getRangeValues(selectedYear, startYear, endYear, nowYear);
            var result = CommonUtils.getArrayOfNumbers(range.from, range.to);

            return CommonUtils.intArraySort(result, Config.yearsDirection);
        }
    };


    return exports;
})
(exports.CommonUtils, exports.Config);
exports.MonthUtils = (function (DateUtils, CommonUtils, Config) {
    'use strict';

    return {
        getMonthList: function (startDt, endDt, selectedYear, limitsModel) {
            var result;
            var START_MONTH = 0;
            var END_MONTH = 11;

            if (startDt || endDt) {
                var isYearOfLowerLimit = (startDt) ? limitsModel.start.y === selectedYear : false;
                var isYearOfUpperLimit = (endDt) ? limitsModel.end.y === selectedYear : false;
                var start = (startDt) ? limitsModel.start.m : START_MONTH;
                var end = (endDt) ? limitsModel.end.m : END_MONTH;

                // startYear == 2015, nowYear == 2015, endYear == 2015
                if (isYearOfLowerLimit && isYearOfUpperLimit) {
                    result = CommonUtils.getArrayOfNumbers(start, end);
                } else if (isYearOfLowerLimit && !isYearOfUpperLimit) {  // startYear == 2015, nowYear == 2015, endYear == 2016 (or null)
                    result = CommonUtils.getArrayOfNumbers(start, END_MONTH);
                } else if (!isYearOfLowerLimit && isYearOfUpperLimit) {  // startYear == 2014 (or null), nowYear == 2015, endYear == 2015
                    result = CommonUtils.getArrayOfNumbers(START_MONTH, end);
                } else {  // in all other cases return array of 12 month
                    result = CommonUtils.getArrayOfNumbers(START_MONTH, END_MONTH);
                }
            } else {  // in all other cases return array of 12 month
                result = CommonUtils.getArrayOfNumbers(START_MONTH, END_MONTH);
            }

            return CommonUtils.intArraySort(result, Config.monthDirection);
        }
    };
})(exports.DateUtils, exports.CommonUtils, exports.Config);
exports.DaysUtils = (function (DateUtils, CommonUtils, Config) {
    'use strict';

    return {
        getDaysList: function (startDt, endDt, year, month, limitsModel) {
            var result;
            var START_DAY = 1;
            var lastDayInMonth = DateUtils.getDaysInMonth(month, year);

            if (startDt || endDt) {
                var isYearOfLowerLimit = (startDt) ? limitsModel.start.y === year : false;
                var isYearOfUpperLimit = (endDt) ? limitsModel.end.y === year : false;
                var isMonthOfLowerLimit = (startDt) ? limitsModel.start.m === month : false;
                var isMonthOfUpperLimit = (endDt) ? limitsModel.end.m === month : false;

                var isLowerLimit = (isYearOfLowerLimit && isMonthOfLowerLimit);
                var isUpperLimit = (isYearOfUpperLimit && isMonthOfUpperLimit);

                var start = (startDt) ? limitsModel.start.d : START_DAY;
                var end = (endDt) ? limitsModel.end.d : lastDayInMonth;

                if (isLowerLimit && isUpperLimit) {
                    result = CommonUtils.getArrayOfNumbers(start, end);
                } else if (isLowerLimit && !isUpperLimit) {
                    result = CommonUtils.getArrayOfNumbers(start, lastDayInMonth);
                } else if (!isLowerLimit && isUpperLimit) {
                    result = CommonUtils.getArrayOfNumbers(START_DAY, end);
                } else {  // in all other cases return array of 12 month
                    result = CommonUtils.getArrayOfNumbers(START_DAY, lastDayInMonth);
                }
            } else {  // in all other cases return array of 12 month
                result = CommonUtils.getArrayOfNumbers(START_DAY, lastDayInMonth);
            }

            return CommonUtils.intArraySort(result, Config.daysDirection);
        }
    };
})(exports.DateUtils, exports.CommonUtils, exports.Config);
exports.DataClass = (function (DateUtils, CommonUtils, YearsUtils, MonthUtils, DaysUtils, DateModel, LimitsModel) {
    'use strict';

    function _getSelected(model, start, end) {
        var result;

        var isUpperStart = (model.dt > start);
        var isEqualStart = (model.dt === start);
        var isLowerEnd = (model.dt > end);
        var isEqualEnd = (model.dt === end);

        //start == 1; model == 1 or 2 or 3; end == 3;
        if ((isUpperStart || isEqualStart) || (isLowerEnd || isEqualEnd)) {
            result = new DateModel(model.dt);
        } else if (!isUpperStart) { //start == 1; model == 0
            result = new DateModel(start);
        } else if (!isUpperStart) { //model == 4; end == 3;
            result = new DateModel(end);
        } else {//paranoid case
            result = new DateModel(new Date().getTime());
        }

        return result;
    }

    return function (model, start, end) {

        var _data = {
            _start: null,
            _end: null,
            _limitDates: null
        };

        var exports = {
            selected: {},
            list: {
                y: null,
                m: null,
                d: null
            },
            reloadYearsList: function () {
                //exports.list.y = YearsUtils.getYearsList(_data._start, _data._end);
                //TODO (S.Panfilov) Cur work point, this is a test
                var selectedYear = DateUtils.getYear(exports.selected.dt);
                exports.list.y = YearsUtils.getYearsList(selectedYear, _data._start, _data._end, _data.limitsModel.now.y);
                return this;
            },
            reloadMonthList: function () {
                var selectedYear = DateUtils.getYear(exports.selected.dt);
                exports.list.m = MonthUtils.getMonthList(_data._start, _data._end, selectedYear);
                return this;
            },
            reloadDaysList: function () {
                var selectedYear = DateUtils.getYear(exports.selected.dt);
                var selectedMonth = DateUtils.getMonth(exports.selected.dt);
                exports.list.d = DaysUtils.getDaysList(_data._start, _data._end, selectedYear, selectedMonth);
                return this;
            }
        };

        model.dt = CommonUtils.isValidNumber(model.dt) ? model.dt : null;
        start = CommonUtils.isValidNumber(start) ? start : null;
        end = CommonUtils.isValidNumber(end) ? end : null;

        exports.selected = _getSelected(model, start, end);
        var selectedYear = DateUtils.getYear(exports.selected.dt);
        var selectedMonth = DateUtils.getMonth(exports.selected.dt);

        _data.limitsModel = new LimitsModel(start, end);
        _data._start = start;
        _data._end = end;

        exports.list.y = YearsUtils.getYearsList(selectedYear, _data.limitsModel.start.y, _data.limitsModel.end.y, _data.limitsModel.now.y);
        exports.list.m = MonthUtils.getMonthList(start, end, selectedYear, _data.limitsModel);
        exports.list.d = DaysUtils.getDaysList(start, end, selectedYear, selectedMonth, exports.selected, _data.limitsModel);

        return exports;
    };

})(exports.DateUtils, exports.CommonUtils, exports.YearsUtils, exports.MonthUtils, exports.DaysUtils, exports.DateModel, exports.LimitsModel);
    if (typeof module === 'object' && module.exports) module.exports = exports;

    return exports;})();
var angularView = (function (DateUtils, DataClass, Config, DateModel) {
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
                    apdDayId: '@?',
                    apdMonthId: '@?',
                    apdYearId: '@?',
                    apdDayClasses: '@?',
                    apdMonthClasses: '@?',
                    apdYearClasses: '@?',
                    apdLocalization: '=?',
                    apdIsUtc: '=?'
                },
                link: function (scope) {

                    scope.apdIsUtc = scope.apdIsUtc || false;

                    //TODO (S.Panfilov) check for cross-browser support
                    //TODO (S.Panfilov) should add tests probably
                    var settings = {
                        initDateModel: null,
                        startDateTime: null,
                        endDateTime: null
                    };

                    var ngModelWatcher = {
                        handler: null,
                        start: function (callback) {
                            ngModelWatcher.handler = scope.$watch('ngModel.dt', function (value, oldValue) {
                                if (callback) {
                                    callback(value, oldValue)
                                }

                            }, true);
                        },
                        stop: function () {
                            ngModelWatcher.handler();
                            return true;
                        }
                    };


                    function getLimitSafeDatetime(day, month, year) {

                        var datetime = new Date(year, month, day).getTime();

                        if (!DateUtils.isDateBetweenLimits(datetime, settings.startDateTime, settings.endDateTime)) {
                            if (!DateUtils.isDateUpperStartLimit(datetime, settings.startDateTime)) {
                                datetime = settings.startDateTime;
                            } else if (!DateUtils.isDateLowerEndLimit(datetime, settings.endDateTime)) {
                                datetime = settings.endDateTime;
                            }
                        }

                        return datetime;
                    }

                    function updateModel(datetime) {
                        ngModelWatcher.stop();
                        scope.data.selected = new DateModel(datetime);
                        scope.ngModel = scope.data.selected;
                        ngModelWatcher.start(onModelChange);
                    }

                    function onModelChange(datetime, oldValue) {
                        if (datetime === oldValue) {
                            return;
                        }

                        var day = DateUtils.getDay(datetime);
                        var month = DateUtils.getMonth(datetime);
                        var year = DateUtils.getYear(datetime);

                        datetime = getLimitSafeDatetime(day, month, year);
                        updateModel(datetime);

                        scope.data.reloadYearsList();
                        scope.data.reloadMonthList();
                        scope.data.reloadDaysList();
                    }

                    function getInitDateModel(model) {
                        var isInitModelValid = DateUtils.isValidModel(model);
                        var initDatetime;

                        if (isInitModelValid) {
                            initDatetime = model.dt
                        } else {
                            initDatetime = new Date().getTime();
                        }

                        var day = DateUtils.getDay(initDatetime);
                        var month = DateUtils.getMonth(initDatetime);
                        var year = DateUtils.getYear(initDatetime);

                        var limitSafeDatetime = getLimitSafeDatetime(day, month, year);

                        return new DateModel(limitSafeDatetime);
                    }

                    function _initData(initDateModel, startDateTime, endDateTime) {
                        scope.data = new DataClass(initDateModel, startDateTime, endDateTime);
                        scope.ngModel = scope.data.selected;
                    }


                    scope.onDaySelectChanged = function (day) {
                        if (!day) return;

                        var datetime = getLimitSafeDatetime(scope.data.selected.d, scope.data.selected.m, scope.data.selected.y);
                        updateModel(datetime);
                    };

                    scope.onMonthSelectChanged = function (month) {
                        if (!month && month !== 0) return;

                        var datetime;
                        var year = scope.data.selected.y;
                        var day = scope.data.selected.d;

                        datetime = getLimitSafeDatetime(day, month, year);
                        updateModel(datetime);

                        scope.data.reloadDaysList();
                    };

                    scope.onYearSelectChanged = function (year) {
                        if (!year && year !== 0) return;

                        var month = scope.data.selected.m;
                        var day = scope.data.selected.d;

                        var datetime = getLimitSafeDatetime(day, month, year);
                        updateModel(datetime);

                        scope.data.reloadMonthList();
                        scope.data.reloadDaysList();
                    };

                    (function _init() {
                        settings.startDateTime = (scope.apdStart) ? +scope.apdStart : null;
                        settings.endDateTime = (scope.apdEnd) ? +scope.apdEnd : null;
                        settings.initDateModel = getInitDateModel(scope.ngModel);
                        _initData(settings.initDateModel, settings.startDateTime, settings.endDateTime);

                        scope.daysList = (scope.apdLocalization.daysList) ? scope.apdLocalization.daysList :  Config.daysList;
                        scope.monthList = (scope.apdLocalization.monthList) ? scope.apdLocalization.monthList :  Config.monthList;

                        ngModelWatcher.start(onModelChange);
                    })();

                }
            }
        });
})(xDateCore.DateUtils, xDateCore.DataClass, xDateCore.Config, xDateCore.DateModel);
angular.module("angular-pd.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("apd.html","<div class=apd_root><select ng-model=data.selected.d ng-options=\"day for day in data.list.d\" ng-init=\"data.selected.d = data.list.d[0]\" ng-change=onDaySelectChanged(data.selected.d) id={{::apdDayId}} class=\"apd_elem apd_select_day apd_select {{::apdDayClasses}}\"></select><span ng-bind=daysList[data.selected.dow] class=\"apd_elem apd_day_of_week\"></span><select ng-model=data.selected.m ng-options=\"monthList[month] for month in data.list.m\" ng-init=\"data.selected.m = data.list.m[0]\" ng-change=onMonthSelectChanged(data.selected.m) id={{::apdMonthId}} class=\"apd_elem apd_select_month apd_select {{::apdMonthClasses}}\"></select><select ng-model=data.selected.y ng-options=\"year for year in data.list.y\" ng-init=\"data.selected.y = data.list.y[0]\" ng-change=onYearSelectChanged(data.selected.y) id={{::apdYearId}} class=\"apd_elem apd_select_year apd_select {{::apdYearClasses}}\"></select></div>");}]);