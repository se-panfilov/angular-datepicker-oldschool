'use strict';

angular.module('demo', [
        'angular-pd'
    ])

    .directive('modelWell', function ($filter) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                caseModel: '='
            },
            template: '<section class=well>' +
            '<div><span>Day:</span>&nbsp;<span ng-bind=caseModel.model.d></span></div>' +
            '<div><span>Month:</span>&nbsp;<span ng-bind=caseModel.model.m></span>&nbsp;<span>(+1)</span></div>' +
            '<div><span>Year:</span>&nbsp;<span ng-bind=caseModel.model.y></span></div>' +
            '<div><span>Datetime:</span>&nbsp;<span ng-bind=caseModel.model.dt></span>&nbsp;<span>({{getDate(caseModel.model.dt)}})</span></div>' +
            '<div><span>Timezone:</span>&nbsp;<span ng-bind=caseModel.model.tz></span></div>' +
            '<div><span>Start limit:</span>&nbsp;<span ng-bind=caseModel.start></span>&nbsp;<span>({{getDate(caseModel.start)}})</span></div>' +
            '<div><span>End limit:</span>&nbsp;<span ng-bind=caseModel.end></span>&nbsp;<span>({{getDate(caseModel.end)}})</span></div>' +
            '<div><button type="button" ng-click="plusOneMonth()">+1 month</button></div>' +
            '<div><button type="button" ng-click="minusOneMonth()">-1 month</button></div>' +
            '</section>',
            link: function (scope) {
                scope.getDate = function (datetime) {
                    if (!datetime) return ' none ';

                    return $filter('date')(new Date(datetime), 'dd-MM-yyyy');
                };

                scope.plusOneMonth = function () {
                    var date = new Date(scope.caseModel.model.dt);
                    if (date.getMonth() === 11) {
                        date.setMonth(0);
                        date.setFullYear(date.getFullYear() + 1)
                    } else {
                        date.setMonth(date.getMonth() + 1);
                    }

                    scope.caseModel.model.dt = date.getTime();
                };

                scope.minusOneMonth = function () {
                    var date = new Date(scope.caseModel.model.dt);
                    if (date.getMonth() === 0) {
                        date.setMonth(11);
                        date.setFullYear(date.getFullYear() - 1)
                    } else {
                        date.setMonth(date.getMonth() - 1);
                    }

                    scope.caseModel.model.dt = date.getTime();
                };
            }
        };
    })

    .controller('DemoPageCtrl', function ($scope) {

        $scope.localized = {
            daysList: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            monthList: ['Январт', 'Фераль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        };

        $scope.commonCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            }
        };

        $scope.limitsCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2015, 6, 21).getTime(),
            end: new Date(2020, 6, 27).getTime()
        };

        $scope.leftLimitsCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2012, 4, 3).getTime()
        };

        $scope.rightLimitsCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            end: new Date(2015, 7, 31).getTime()
        };

        $scope.outOfRightLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            end: new Date(2015, 6, 21).getTime()
        };

        $scope.outOfLeftLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2015, 6, 27).getTime()
        };

        $scope.emptyModelCase = {
            model: null
        };

        $scope.emptyModelLeftLimitCase = {
            model: null,
            start: new Date(2015, 6, 26).getTime()
        };

        $scope.emptyModelRightLimitCase = {
            model: null,
            end: new Date(2015, 6, 26).getTime()
        };

        $scope.invalidLeftLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: 'invalid'
        };

        $scope.invalidRightLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            end: Infinity
        };

        $scope.linkedModelCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            }
        };

        $scope.linkedModelBothLimitsCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2015, 6, 25).getTime(),
            end: new Date(2015, 6, 27).getTime()
        };

        $scope.linkedModelBothDifferentLimitsCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start_one: new Date(2015, 5, 1).getTime(),
            end_one: new Date(2015, 7, 31).getTime(),
            start_two: new Date(2015, 6, 20).getTime(),
            end_two: new Date(2015, 8, 31).getTime()
        };

        $scope.externalChangeCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            }
        };

        $scope.externalChangeLeftLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2013, 6, 25).getTime()
        };

        $scope.externalChangeRightLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            end: new Date(2018, 6, 27).getTime()
        };

        $scope.externalChangeBothLimitCase = {
            model: {
                dt: new Date(2015, 6, 26).getTime()
            },
            start: new Date(2013, 6, 25).getTime(),
            end: new Date(2018, 6, 27).getTime()
        };
    })
;
