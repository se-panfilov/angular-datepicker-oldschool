var angularView = (function (DateUtils, DataClass, Config) {
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
                    //TODO (S.Panfilov) may be should add tests
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

                        //TODO (S.Panfilov) localization fix
                        var localization = scope.apdLocalization || null;
                        scope.daysList = Config.daysList;
                        scope.monthList = Config.monthList;

                        ngModelWatcher.start(onModelChange);
                    })();

                }
            }
        });
})(DateUtils, DataClass, Config);
angular.module("angular-pd.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("apd.html","<div class=apd_root><select ng-model=data.selected.d ng-options=\"day for day in data.list.d\" ng-init=\"data.selected.d = data.list.d[0]\" ng-change=onDaySelectChanged(data.selected.d) id={{::apdDayId}} class=\"apd_elem apd_select_day apd_select {{::apdDayClasses}}\"></select><span ng-bind=daysList[data.selected.dow] class=\"apd_elem apd_day_of_week\"></span><select ng-model=data.selected.m ng-options=\"monthList[month] for month in data.list.m\" ng-init=\"data.selected.m = data.list.m[0]\" ng-change=onMonthSelectChanged(data.selected.m) id={{::apdMonthId}} class=\"apd_elem apd_select_month apd_select {{::apdMonthClasses}}\"></select><select ng-model=data.selected.y ng-options=\"year for year in data.list.y\" ng-init=\"data.selected.y = data.list.y[0]\" ng-change=onYearSelectChanged(data.selected.y) id={{::apdYearId}} class=\"apd_elem apd_select_year apd_select {{::apdYearClasses}}\"></select></div>");}]);