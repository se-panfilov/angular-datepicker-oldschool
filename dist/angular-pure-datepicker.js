"use strict";var Config={isUtc:!1,monthDirection:"asc",daysDirection:"asc",yearsDirection:"desc",daysList:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],monthList:["January","February","March","April","May","June","July","August","September","October","November","December"]},CommonUtils=function(){var t={isValidNumber:function(t){var e=!isNaN(t),r=isFinite(t);return e&&r},getArrayOfNumbers:function(t,e){for(var r=[],n=t;e>=n;n++)r.push(n);return r},intArraySort:function(t,e){function r(t,e){return e-t}switch(e){default:return t.sort(function(t,e){return t-e});case"desc":return t.sort(r)}},getIntArr:function(e){return e||0===e?e?t._getIntArr(e-1).concat(e):[]:void 0}};return t}(),DateUtils=function(t){function e(t,e){var r=new Date(t);return e.call(r)}var r={getDay:function(r){var n=t.isUTC?Date.prototype.getUTCDate:Date.prototype.getDate;return e(r,n)},getDayOfWeek:function(r){var n=t.isUTC?Date.prototype.getUTCDay:Date.prototype.getDay;return e(r,n)},getYear:function(r){var n=t.isUTC?Date.prototype.getUTCFullYear:Date.prototype.getFullYear;return e(r,n)},getMonth:function(r){var n=t.isUTC?Date.prototype.getUTCMonth:Date.prototype.getMonth;return e(r,n)},getDaysInMonth:function(e,r){var n=t.isUTC?Date.prototype.getUTCDate:Date.prototype.getDate;return n.call(new Date(r,e+1,0))},isValidModel:function(t){return!(!t||!t.dt&&0!==t.dt)},isDateUpperStartLimit:function(t,e){return e?t>e:!0},isDateLowerEndLimit:function(t,e){return e?e>t:!0},isDateBetweenLimits:function(t,e,n){return r.isDateUpperStartLimit(t,e)&&r.isDateLowerEndLimit(t,n)}};return r}(Config),LimitsModel=function(t){function e(e,r){function n(e){return s.start.d=t.getDay(e),s.start.m=t.getMonth(e),s.start.y=t.getYear(e),s.start.dt=e,this}function i(e){return s.end.d=t.getDay(e),s.end.m=t.getMonth(e),s.end.y=t.getYear(e),s.end.dt=e,this}function a(){var e=(new Date).getTime();return s.now.d=t.getDay(e),s.now.m=t.getMonth(e),s.now.y=t.getYear(e),s.now.dt=e,this}var s={start:{},end:{},now:{}};return n(e),i(r),a(),s}return e}(DateUtils),DateModel=function(t){function e(e){return this.d=t.getDay(e),this.dow=t.getDayOfWeek(e),this.m=t.getMonth(e),this.y=t.getYear(e),this.dt=e,this.tz=new Date(e).getTimezoneOffset(),this}return e}(DateUtils),YearsUtils=function(t,e,r){var n={getYearsList:function(n,i,a,s){var o=[],u=10,l=s.start.y,d=s.end.y,y=s.now.y,g=t.getYear(a.dt),f=g>y?g:y,c=y>g?g:y;return f+=u-1,c-=u-1,n&&i&&i>n?o=e.getArrayOfNumbers(l,d):n&&i&&n>i?o=e.getArrayOfNumbers(d,l):n&&i&&n===i?o=e.getArrayOfNumbers(l,d):n&&!i?o=e.getArrayOfNumbers(l,f):!n&&i?s.end.y>=s.now.y?o=c-u>d-u?e.getArrayOfNumbers(c,d):e.getArrayOfNumbers(d-(u-1),d):s.end.y>s.now.y&&(o=e.getArrayOfNumbers(d-(u-1),d)):n||i||(o=e.getArrayOfNumbers(c,f)),e.intArraySort(o,r.yearsListDirection)}};return n}(DateUtils,CommonUtils,Config),MonthUtils=function(t,e,r,n){var i={getMonthList:function(e,i,a){var s,o=0,u=11;if(e||i){var l=e?t.start.y===a:!1,d=i?t.end.y===a:!1,y=e?t.start.m:o,g=i?t.end.m:u;s=l&&d?r.getArrayOfNumbers(y,g):l&&!d?r.getArrayOfNumbers(y,u):!l&&d?r.getArrayOfNumbers(o,g):r.getArrayOfNumbers(o,u)}else s=r.getArrayOfNumbers(o,u);return r.intArraySort(s,n.monthListDirection)}};return i}(LimitsModel,DateUtils,CommonUtils,Config),DaysUtils=function(t,e,r,n){var i={getDaysList:function(i,a,s,o){var u,l=1,d=e.getDaysInMonth(o,s);if(i||a){var y=i?t.start.y===s:!1,g=a?t.end.y===s:!1,f=i?t.start.m===o:!1,c=a?t.end.m===o:!1,m=y&&f,D=g&&c,h=i?t.start.d:l,U=a?t.end.d:d;u=m&&D?r.getArrayOfNumbers(h,U):m&&!D?r.getArrayOfNumbers(h,d):!m&&D?r.getArrayOfNumbers(l,U):r.getArrayOfNumbers(l,d)}else u=r.getArrayOfNumbers(l,d);return r.intArraySort(u,n.daysListDirection)}};return i}(LimitsModel,DateUtils,CommonUtils,Config),DataClass=function(t,e,r,n,i,a){function s(t,e,r){var n,i=t.dt>e,s=t.dt===e,o=t.dt>r,u=t.dt===r;return n=new a(i||s||o||u?t.dt:i?i?(new Date).getTime():r:e)}return function(a,o,u){var l={_start:null,_end:null,_limitDates:null},d={selected:{},list:{y:null,m:null,d:null},reloadYearsList:function(){return d.list.y=r.getYearsList(l._start,l._end),this},reloadMonthList:function(){var e=t.getYear(d.selected.dt);return d.list.m=n.getMonthList(l._start,l._end,e),this},reloadDaysList:function(){var e=t.getYear(d.selected.dt),r=t.getMonth(d.selected.dt);return d.list.d=i.getDaysList(l._start,l._end,e,r),this}};a.dt=e.isValidNumber(a.dt)?a.dt:null,o=e.isValidNumber(o)?o:null,u=e.isValidNumber(u)?u:null,d.selected=s(a,o,u);var y=t.getYear(d.selected.dt),g=t.getMonth(d.selected.dt);return l._limitDates=new LimitsModel(o,u),l._start=o,l._end=u,d.list.y=r.getYearsList(o,u,d.selected,l._limitDates),d.list.m=n.getMonthList(o,u,y,l._limitDates),d.list.d=i.getDaysList(o,u,y,g,d.selected,l._limitDates),d}}(DateUtils,CommonUtils,YearsUtils,MonthUtils,DaysUtils,DateModel);
//# sourceMappingURL=x-date-core.min.js.map
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