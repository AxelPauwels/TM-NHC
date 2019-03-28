//
// TODO: “Always use a dot in your ng-model”
//
// Advice from a war-torn, battle-scarred, mentally-exhausted person who didn’t do exactly this!
//
//
// Scoping and binding are potentially screwed if you don’t. It is a difficult problem to find and understand.
//
// Further reading is required: https://github.com/angular/angular.js/wiki/Understanding-Scopes
//
// http://stackoverflow.com/questions/17178943/does-my-ng-model-really-need-to-have-a-dot-to-avoid-child-scope-problems
//
// http://stackoverflow.com/questions/18128323/angularjs-if-you-are-not-using-a-dot-in-your-models-you-are-doing-it-wrong
//
// TODO: “Always use a dot in your ng-model”
//

/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Remote Logging Module for logging messages from the client to the server.
 */
// https://engineering.talis.com/articles/client-side-error-logging/
// https://www.bennadel.com/blog/
//      2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm
// https://www.stacktracejs.com/#!/docs/v0-migration-guide

/* global angular */
var loggingModule = angular.module('client.server.logging', []);

/**
 * Service that wraps the error-stack-parser.js global ErrorStackParser and
 * formally exposes the parser.
 */
// The 'error-stack-parser' library is in the Global scope but, we don't want
// to reference global objects inside the AngularJS components. Wrap the
// ErrorStackParser in a proper AngularJS service that formally exposes
// the parser.

/* global ErrorStackParser */
loggingModule.factory(
    'stacktraceService',
    function () {
        return {
            parser: ErrorStackParser
        };
    }
);

/**
 * Override Angular's built in exception handler, to use the
 * exceptionRemoteLoggingService.
 */
// By default, AngularJS will catch errors and log them to
// the Console. We want to keep that behavior; however, we
// want to intercept it so that we can also log the errors
// to the server for later analysis.
loggingModule.provider(
    '$exceptionHandler', {
        $get: function (exceptionRemoteLoggingService) {
            return (exceptionRemoteLoggingService);
        }
    }
);

/**
 * Exception Remote Logging Service, used by the $exceptionHandler.
 * It preserves the default behaviour (logging to the console) but also posts
 * the error to the server side, after generating a stacktrace.
 * --
 * Any unhandled exception within the Angular app will now be posted to the
 * server-side automatically.
 */
/* global $ */
loggingModule.factory(
    'exceptionRemoteLoggingService',
    ['$log', '$window', 'stacktraceService',
        function ($log, $window, stacktraceService) {
            function error(exception, cause) {
                // Preserve the default behaviour which will log the error to
                // the console and allow the application to continue running.
                $log.error.apply($log, arguments);

                // Now try to log the error to the server side.
                // --
                // TODO NOTE: In production, we may have some debouncing logic
                // here to prevent the same client from logging the same error
                // over and over again! That would just add noise to the log.
                try {
                    var errorMessage = exception.toString();

                    // Use the stacktraceService to generate a stack trace
                    var stackTrace = stacktraceService.parser.parse(exception);

                    // Post the error to the server.
                    // Use AJAX and NOT an angular service such as $http.
                    // For two reasons, firstly it will create a circular
                    // dependency which we really want to avoid, and secondly
                    // if the AngularJS app is fubar’d we still have a chance
                    // of logging the error to the server.
                    $.ajax({
                        type: 'POST',
                        url: '/api-v2/logger',
                        contentType: 'application/json',
                        data: angular.toJson({
                            url: $window.location.href,
                            messageArgs: [errorMessage, stackTrace,
                                'cause:', ( cause || '')],
                            type: 'error'
                        })
                    });
                } catch (err) {
                    // For Developers - log the logging-error.
                    $log.warn(
                        'exceptionRemoteLoggingService error:', err);
                }
            }

            // Return the error logging function.
            return (error);
        }
    ]
);

/**
 * Remote Logging Service providing a way to log messages from the client to
 * the server.
 */
// TODO add user-agent, cookie and maybe more...
loggingModule.factory(
    'remoteLoggingService',
    ['$log', '$window', function ($log, $window) {
        function log(type, args) {
            // Preserve the default behaviour which will log the error to
            // the console and allow the application to continue running.
            $log[type].apply($log, args);
            // Send the log message to the server side.
            // Use AJAX and NOT an angular service such as $http.
            // For two reasons, firstly it will create a circular
            // dependency which we really want to avoid, and secondly
            // if the AngularJS app is fubar’d we still have a chance
            // of logging the error to the server.
            $.ajax({
                type: 'POST',
                url: '/api-v2/logger',
                contentType: 'application/json',
                data: angular.toJson({
                    url: $window.location.href,
                    messageArgs: [].slice.call(args),
                    type: type
                }, false)
            });
        }

        return {
            error: function () {
                log('error', arguments);
            },
            warn: function () {
                log('warn', arguments);
            },
            info: function () {
                log('info', arguments);
            },
            debug: function () {
                log('debug', arguments);
            },
            log: function () {
                log('log', arguments);
            }
        };
    }]
);


/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Application Module
 */
var app = angular.module(
    'nhcWall', [
        'ngRoute', 'ngResource', 'ui.bootstrap', 'angularSpinners',
        'ds.clock', 'ui.calendar', 'client.server.logging',
        'angular-useragent-parser', 'angular-virtual-keyboard',
        'scrollable-table', 'angularBootstrapNavTree',
        'angularSpectrumColorpicker'
    ]);

// Services
// app.service(
//     'dataService',
//     ['remoteLoggingService', '$http', function (log, $http) {
//
//         this.getData = function (dataPath) {
//             log.debug('service dataService.getData:', dataPath);
//             return $http.get('/api-v2/' + dataPath)
//                 .success(function (result) {
//                     log.debug('service dataService.getData result:', result);
//                 })
//                 .catch(function (err) {
//                     log.debug('service dataService.getData error:', err);
//                 });
//                 // .then(function (response) {
//                 //     console.log(response);
//                 //     return response.data;
//                 // });
//         };
//     }]);

app.service(
    'NhcActionBar',
    ['remoteLoggingService', function (log) {
        var self = this;
        this.availableActions = [];
        this.selectionActions = [];
        this.selectedItems = [];

        this.registerAction = function (action) {
            log.debug('service NhcActionBar.registerAction:', action);
            self.availableActions.push(action);
            // Destroyer
            return function () {
                var index = self.availableActions.indexOf(action);
                if (index >= 0)
                    self.availableActions.splice(index, 1);
            };
        };

        this.registerSelectionAction = function (action) {
            log.debug('service NhcActionBar.registerSelectionAction:', action);
            var dtrFn = self.registerAction(action);
            self.selectionActions.push(action);
            return function () {
                dtrFn();
                var index = self.selectionActions.indexOf(action);
                if (index >= 0)
                    self.selectionActions.splice(index, 1);
            };
        };

        this.toggleItemSelection = function (item) {
            log.debug('service NhcActionBar.toggleItemSelection:', item);
            if (!item.__selected) {
                item.__selected = true;
                self.selectedItems.push(item);
            }
            else {
                var index = self.selectedItems.indexOf(item);
                if (index >= 0)
                    self.selectedItems.splice(index, 1);
                item.__selected = false;
            }
            checkSelectionActions();
        };

        this.clearSelection = function () {
            log.debug('service NhcActionBar.clearSelection:');
            self.selectedItems.forEach(function (item) {
                item.__selected = false;
            });
            self.selectedItems = [];
            checkSelectionActions();
        };

        function checkSelectionActions() {
            self.selectionActions.forEach(function (action) {
                action.active = !!action.checkAvailability(self.selectedItems);
            });
        }
    }]);

app.service(
    'borderControlService',
    ['remoteLoggingService', '$http', '$q', '$uibModal', function (log, $http, $q, $uibModal) {
        var self = this;
        this.defaultRoles = ['rlVolunteer'];
        // TODO: Initial login required
        // this.defaultRoles = [];
        this.currentRoles = this.defaultRoles;

        this.reset = function () {
            self.currentRoles = self.defaultRoles;
        };

        this.hasAuthority = function (role) {
            log.debug('service borderControlService.hasAuthority:', role);
            return self.currentRoles.indexOf(role) >= 0;

        };

        this.getRolesByPin = function (pin) {
            log.debug('service borderControlService.getRolesByPin:', pin);
            var defer = $q.defer();
            $http.get('/api-v2/user/pin/' + pin)
                .success(function (result) {
                    log.debug('service borderControlService.getRolesByPin result:', result);
                    var roles = [];
                    if (result.length > 0)
                        roles = result[0].roles.split(';');
                    defer.resolve(roles);
                })
                .error(function () {
                    defer.reject('');
                });
            return defer.promise;
        };

        this.setRolesByPin = function (pin) {
            log.debug('service borderControlService.setRolesByPin:', pin);
            var defer = $q.defer();
            self.getRolesByPin(pin)
                .then(function (roles) {
                        self.currentRoles = roles;
                        defer.resolve(roles);
                    }, function () {
                        defer.reject('');
                    }
                );
            return defer.promise;
        };

        this.borderControl = function (role, confirmTitle) {
            log.debug('service borderControlService.borderControl:', role, confirmTitle);
            var defer = $q.defer();
            if (self.hasAuthority(role)) {
                if (confirmTitle) {
                    var modalInfo = {title: confirmTitle};
                    ($uibModal.open({
                        templateUrl: '/v2/window/confirm_basic.html',
                        controller: 'BasicConfirmationController',
                        resolve: {
                            modalInfo: function () {
                                return modalInfo;
                            }
                        }
                    })).result
                        .then(function () {
                            defer.resolve('OK');
                        }, function () {
                            defer.reject('FAIL');
                        });
                }
                else {
                    defer.resolve('OK');
                }
            }
            else {
                var modalOutcome = {};
                ($uibModal.open({
                    templateUrl: '/v2/window/user_modal.html',
                    controller: 'SecurityModalController',
                    resolve: {
                        outcome: function () {
                            return modalOutcome;
                        }
                    }
                })).result
                    .then(function () {
                        self.setRolesByPin(modalOutcome.pin)
                            .then(function (result) {
                                if (self.hasAuthority(role)) {
                                    defer.resolve('OK');
                                }
                                else {
                                    defer.reject('FAIL');
                                }
                            }, function () {
                                defer.reject('FAIL');
                            });
                    }, function () {
                        defer.reject('FAIL');
                    });
            }
            return defer.promise;
        };

        this.tryAction = function (action, role, confirmTitle) {
            log.debug('service borderControlService.tryAction:', action, role, confirmTitle);
            self.borderControl(role, confirmTitle)
                .then(function () {
                        action();
                    },
                    function () {

                    });
        };
    }]);

app.service(
    'PreviousRoute',
    ['remoteLoggingService', function (log) {
        log.debug('service PreviousRoute');
        var self = this;
        self.path = '/';
    }]);

app.service(
    'preferencesService',
    // ['remoteLoggingService', '$http', 'spinnerService',
    function (remoteLoggingService, $http, spinnerService) {
        var log = remoteLoggingService;
        var self = this;
        // Cache the latest promise, to be dropped if it gets rejected.
        var promise;

        this.load = function () {
            // The $http-get, promise-success, -catch and -finally functions,
            // all return a promise.
            if (!promise) {
                spinnerService.taskStart('nhcActionBarSpinner');
                promise = $http.get('/api-v2/preferences/')
                    .success(function (result) {
                        log.debug('preferencesService.load ' +
                            'GET /api-v2/preferences/ result:', result);
                    })
                    .catch(function (err) {
                        log.debug('preferencesService.load ' +
                            'GET /api-v2/preferences/ error:', err);
                        // The promise is rejected, so do not keep it cached
                        promise = null;
                        throw(err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });
            }
            // Return the (cached) promise
            return promise;
        };

        this.reset = function () {
            log.debug('preferencesService.reset');
            // Reset the cached promise, causing a refresh of the preferences
            // on the next load.
            promise = null;
        };

        this.reload = function () {
            log.debug('preferencesService.reload');
            // Reset the cache and refresh the preferences.
            self.reset();
            return self.load();
        };

        this.get = function (path) {
            log.debug('preferencesService.get path', path);
            // Path may be '/' or '.' separated e.g.
            // '/ui/colors/mainBgColor' or 'ui.colors.mainBgColor'
            return self.load()
                .then(function (response) {
                    log.debug(
                        'preferencesService.get %s result:', path, response);
                    var branch = response.data;
                    if (branch) {
                        // Split the path on '/' and '.' characters, after
                        // removing any leading and trailing ones and traverse
                        // the preference tree down to the preference branch.
                        path = path.replace(/^[\/\.]+|[\/\.]+$/g, '');
                        if (path.length) {
                            path.split(/[\/\.]/g)
                                .forEach(
                                    function (item, index, arr) {
                                        branch = branch.children[item];
                                    }
                                );
                        }
                    }
                    log.debug(
                        'preferencesService.get %s branch:', path, branch);
                    return branch;
                });
        };

        this.put = function (preferences) {
            spinnerService.taskStart('nhcActionBarSpinner');
            return $http.post('/api-v2/preferences/', preferences)
                .success(function (result) {
                    log.debug('preferencesService.put ' +
                        'POST /api-v2/preferences/ result:', result);
                    // Successfully updated the preferences, so reset the cache
                    // to start using the new preferences on the next load.
                    self.reset();
                })
                .catch(function (err) {
                    log.debug('preferencesService.put ' +
                        'POST /api-v2/preferences/ error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });

        };

        this.delete = function () {
            spinnerService.taskStart('nhcActionBarSpinner');
            return $http.delete('/api-v2/preferences/')
                .success(function (result) {
                    log.debug('preferencesService.delete ' +
                        'DELETE /api-v2/preferences/ result:', result);
                    // Successfully deleted the preferences, so reset the cache
                    // to start using the factory preferences on the next load.
                    self.reset();
                })
                .catch(function (err) {
                    log.debug('preferencesService.delete ' +
                        'DELETE /api-v2/preferences/ error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });

        };

    });

// app.decorator('spinnerService', ['$delegate', 'remoteLoggingService', function ($delegate, log) {
//     log.debug('decorator concurrentTaskSpinnerService on spinnerService');
//     var taskCount = {};
//
//     var concurrentTaskSpinnerService = {
//         taskStart: function (name) {
//             taskCount[name] = taskCount[name] || 0;
//             if (taskCount[name] === 0) {
//                 $delegate.show(name);
//             }
//             taskCount[name]++;
//         },
//
//         taskStop: function (name) {
//             if (!taskCount[name]) {
//                 this.reset(name);
//             } else {
//                 taskCount[name]--;
//                 if (taskCount[name] === 0) {
//                     $delegate.hide(name);
//                 }
//             }
//         },
//
//         reset: function (name) {
//             $delegate.hide(name);
//             this.taskCount[name] = 0;
//         }
//     };
//
//     $delegate._get = function(name) {
//         return spinners[name];
//     };
//
//     return concurrentTaskSpinnerService;
//     return $delegate;
// }]);

// Run
app.run(
    function (remoteLoggingService, $rootScope, $route, PreviousRoute) {
        var log = remoteLoggingService;
        log.debug('run:', $rootScope, $route, PreviousRoute);
        $rootScope.$on('$locationChangeStart', function (evt, newUrl, curUrl) {
            log.debug('$rootScope.$on($locationChangeStart):', $rootScope, evt, newUrl, curUrl);
            if ($route.current) {
                if (PreviousRoute.route) {
                    // FIXME assignment to itself ???
                    // PreviousRoute.cache = PreviousRoute.cache;
                    PreviousRoute.cache = PreviousRoute.route;
                }
                PreviousRoute.route = $route.current.$$route;
            }
        });
    });

app.config(
    function ($provide) {
        $provide.decorator('spinnerService', function ($delegate, remoteLoggingService) {
            var log = remoteLoggingService;
            log.debug('decorator concurrentTaskSpinnerService on spinnerService:', $delegate);

            // Default decorator behavior, relay all methods
            var concurrentTaskSpinnerService = {};
            for (var attr in $delegate) {
                if ($delegate.hasOwnProperty(attr)) {
                    if ($delegate[attr] instanceof Function) {
                        // log.debug('decorator concurrentTaskSpinnerService relay:', attr.toString());
                        concurrentTaskSpinnerService[attr] = $delegate[attr];
                    }
                }
            }

            // Now add the decoration
            var spinners = {};
            // Since the spinners from the original service are not accessible,
            // an own spinner admin is needed for the task-count
            concurrentTaskSpinnerService._register = function (data) {
                if (data.hasOwnProperty('name')) {
                    spinners[data.name] = data;
                    spinners[data.name].taskCount = 0;
                }
                $delegate._register(data);
            };
            concurrentTaskSpinnerService._unregister = function (name) {
                if (spinners.hasOwnProperty(name)) {
                    delete spinners[name];
                }
                $delegate._unregister(name);
            };
            concurrentTaskSpinnerService._unregisterGroup = function (group) {
                for (var name in spinners) {
                    if (spinners[name].group === group) {
                        delete spinners[name];
                    }
                }
                $delegate._unregisterGroup(group);
            };
            concurrentTaskSpinnerService._unregisterAll = function () {
                for (var name in spinners) {
                    delete spinners[name];
                }
                $delegate._unregisterAll();
            };

            // Add the actual decorator functionality
            concurrentTaskSpinnerService.taskStart = function (name) {
                var spinner = spinners[name];
                if (spinner && spinner.taskCount < 0) {
                    this.reset(name);
                }
                if (!spinner || spinner.taskCount === 0) {
                    $delegate.show(name);
                }
                if (spinner) {
                    spinner.taskCount++;
                }
            };
            concurrentTaskSpinnerService.taskStop = function (name) {
                var spinner = spinners[name];
                if (!spinner || spinner.taskCount === 1) {
                    $delegate.hide(name);
                }
                if (spinner) {
                    spinner.taskCount--;
                }
            };
            concurrentTaskSpinnerService.reset = function (name) {
                var spinner = spinners[name];
                $delegate.hide(name);
                if (spinner) {
                    spinner.taskCount = 0;
                }
            };

            return concurrentTaskSpinnerService;
        });
    });

// Routing
app.config(
    ['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'v2/wall/feeding_wall.html'
            })
            .when('/walls/feeding', {
            templateUrl: 'v2/wall/feeding_wall.html'
        })
            .when('/walls/preparation', {
                templateUrl: 'v2/preparation/preparation_wall.html'
            })
            .when('/walls/quarantaine', {
                templateUrl: 'v2/other/qua_wall.html'
            })
            .when('/walls/medication', {
                templateUrl: 'v2/other/medication_wall.html'
            })
            .when('/leftover', {
                templateUrl: 'v2/wall/leftover_list.html',
                controller: 'LeftoverController'
            })
            .when('/config/main', {
                // templateUrl: 'v2/config/config_home.html'
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/configuratie');
                }
            })
            .when('/config/fiche', {
                templateUrl: 'v2/config/fiche_management.html',
                controller: 'GuestListController'
            })
            .when('/config/animal', {
                templateUrl: 'v2/config/animal_management.html',
                controller: 'ManageAnimalsController'
            })
            .when('/config/cage', {
                templateUrl: 'v2/config/cage_management.html',
                controller: 'ManageCagesController'
            })
            .when('/config/menu', {
                templateUrl: 'v2/config/menu_management.html',
                controller: 'ManageMenusController'
            })
            .when('/config/food', {
                templateUrl: 'v2/config/food_management.html',
                controller: 'ManageFoodsController'
            })
            .when('/config/measure', {
                templateUrl: 'v2/config/measure_management.html',
                controller: 'ManageMeasuresController'
            })
            .when('/config/prepare_category', {
                templateUrl: 'v2/config/prepare_category_management.html',
                controller: 'ManagePrepareCategoriesController'
            })
            .when('/config/route', {
                templateUrl: 'v2/config/route_management.html',
                controller: 'ManageRoutesController'
            })
            .when('/config/entrance_reason', {
                templateUrl: 'v2/config/entrance_reason_management.html',
                controller: 'ManageEntranceReasonsController'
            })
            .when('/config/exit_reason', {
                templateUrl: 'v2/config/exit_reason_management.html',
                controller: 'ManageExitReasonsController'
            })
            .when('/config/preferences', {
                templateUrl: 'v2/config/preferences.html',
                controller: 'PreferencesController'
            })
            .when('/config/work', {
                templateUrl: 'v2/work/worklist.html',
                controller: 'WorkController'
            })
            

            //<editor-fold desc="Thomas More Links">
            .when('/opname', {
                templateUrl: 'v2/fiche/fiche.html',
                controller: 'FicheController'
            })
            .when('/opnameTablet', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/opnameTablet/nieuweOpname');
                }
                // templateUrl: 'http://localhost:4200/index.html',
                // controller: 'FicheController'
            })
            .when('/egelswegen', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/egelswegen');
                }
            })
            .when('/fiches', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/fiches/fichelijst');
                }
            })
            .when('/kalender', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/kalender');
                }
            })
            //</editor-fold>

            .when('/fiche', {
                templateUrl: 'v2/fiche/fiche.html',
                controller: 'FicheController'
            })
            .when('/fiches/list', {
                templateUrl: 'v2/fiche/list.html',
                controller: 'GuestListController'
            })
            .when('/fiches/recover_list', {
                templateUrl: 'v2/fiche/recover_list.html',
                controller: 'GuestListController'
            })
            .when('/fiches/ic_list', {
                templateUrl: 'v2/fiche/ic_list.html',
                controller: 'GuestListController'
            })
            .when('/fiches/end_list', {
                templateUrl: 'v2/fiche/end_list.html',
                controller: 'GuestListController'
            })
            // .when('/fiches/archived_list', {
            //     templateUrl: 'v2/fiche/archived_list.html',
            //     controller: 'GuestListController'
            // })
            .when('/fiches/adoption', {
                templateUrl: 'v2/fiche/adoption_list.html',
                controller: 'AdoptionListController'
            })
            .when('/fiches/overview_report', {
                templateUrl: 'v2/fiche/overview_report.html',
                controller: 'OverviewReportController'
            })
            .when('/calendar', {
                templateUrl: 'v2/other/calendar.html',
                controller: 'CalendarController'
            })
            .when('/executor/tasks', {
                templateUrl: 'v2/other/task_executors.html',
                controller: 'TaskExecutorController'
            })
            .when('/taken', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/taken');
                }
            })
            .when('/taskprotocol', {
                templateUrl: 'v2/work/protocol.html',
                controller: 'WorkProtocolController'
            })
            .when('/hedgehogcare', {
                templateUrl: 'v2/new/hedgehogcare.html',
                controller: 'HedgehogCareController'
            })
            .when('/mousebreeding', {
                templateUrl: 'v2/new/mousebreeding.html',
                controller: 'MouseBreedingController'
            })
            .when('/stockmanagement', {
                templateUrl: 'v2/new/stockmanagement.html',
                controller: 'StockManagementController'
            })
            .when('/directions', {
                templateUrl: 'v2/new/directions.html',
                controller: 'DirectionsController'
            })
            .when('/fiches/overview_report', {
                templateUrl: 'v2/new/overview_report.html',
                controller: 'OverviewReportController'
            })
            .when('/statistieken', {
                redirectTo: function (routeParams) {
                    dynamicRouting.redirectToDynamicRoute('/statistieken');
                }
            });
    }]);

app.config(
    ['$uibModalProvider', function ($uibModalProvider) {
        $uibModalProvider.options = {
            backdrop: 'static', // disable close on backdrop click
            size: 'lg'
        };
    }]);

// Directives
app.directive(
    'nhcCage',
    ['remoteLoggingService', '$http', '$location', 'NhcActionBar', 'spinnerService', 'preferencesService', '$window',
        function (log, $http, $location, actionBar, spinnerService, preferencesService, $window) {
            log.debug('directive nhcCage:', $location, actionBar);

            return {
                restrict: 'A',
                templateUrl: 'v2/wall/cage.html',
                scope: {
                    cage: '=nhcCage',
                    css: '=nhcClass',
                    showMeal: '=?nhcShowMeal',
                    showMedication: '=?nhcShowMedication',
                    showWarnings: '=?nhcShowWarnings'
                },
                link: function (scope, element, attrs) {
                    log.debug('directive nhcCage.link:', scope, element, attrs);
                },
                controller: function ($scope) {

                    $scope.popover = {};
                    ['contents', 'lightson', 'clean', 'leftover'].forEach(
                        function (item, index) {
                            $scope.popover[item] = {
                                isOpen: false,
                                placement: 'right'
                            };
                        }
                    );

                    $scope.popover.toggle = function (event, popover) {
                        log.debug('directive nhcCage.controller ' +
                            'popover.toggle:', arguments);
                        if (!popover.isOpen) {
                            popover.placement =
                                event.pageX < $window.innerWidth / 2 ?
                                    'right' : 'left';
                            log.debug('directive nhcCage.controller ' +
                                'popover.toggle open:', popover.placement);
                        } else {
                            log.debug('directive nhcCage.controller ' +
                                'popover.toggle close');
                        }
                        popover.isOpen = !popover.isOpen;
                    };

                    $scope.popover.close = function (event, popover) {
                        log.debug('directive nhcCage.controller ' +
                            'popover.close:', arguments);
                        popover.isOpen = false;
                    };

                    $scope.popover.cageCleaned = function (event, popover) {
                        log.debug('directive nhcCage.controller ' +
                            'popover.cageCleaned:', arguments);
                        popover.isOpen = false;

                        var cage = angular.copy($scope.cage);
                        cage.to_clean = false;
                        // Save the changed cage data to the DB.
                        spinnerService.taskStart('nhcActionBarSpinner');
                        log.debug('directive nhcCage.controller ' +
                            'popover.cageCleaned ' +
                            'POST /api-v2/cage/id/%s data:',
                            cage.id, cage);
                        $http.post('/api-v2/cage/id/' + cage.id, cage)
                            .success(function (result) {
                                log.debug('directive nhcCage.controller ' +
                                    'popover.cageCleaned ' +
                                    'POST /api-v2/cage/id/%s result:',
                                    cage.id, result);
                                // Successful so save the updated cage to the
                                // current $scope.cage.
                                $scope.cage.to_clean = false;
                            })
                            .catch(function (err) {
                                log.debug('directive nhcCage.controller ' +
                                    'popover.cageCleaned ' +
                                    'POST /api-v2/cage/id/%s error:',
                                    cage.id, err);
                                // Failed so drop the updated cage.
                            })
                            .finally(function () {
                                spinnerService.taskStop('nhcActionBarSpinner');
                            });
                    };

                    $scope.selectCage = function (event, cage) {
                        log.debug('directive nhcCage.controller.selectCage:',
                            event, cage);
                        actionBar.toggleItemSelection(cage);
                    };

                    $scope.selectFiche = function (event, guest) {
                        log.debug('directive nhcCage.controller.selectFiche:',
                            event, guest);
                        $scope.stopPropagation(event);
                        $location.url('/fiche?uuid=' + guest.uuid);
                    };

                    $scope.stopPropagation = function (event) {
                        log.debug(
                            'directive nhcCage.controller.stopPropagation:',
                            event);
                        event.stopPropagation();
                        event.preventDefault();
                    };
                }
            };
        }]);

app.directive(
    'nhcDatePicker',
    ['remoteLoggingService',
        function (log) {
            log.debug('directive nhcDatePicker');
            return {
                restrict: 'E',
                templateUrl: '/v2/control/datepicker.html',
                scope: {
                    date: '=nhcDate',
                    datePickerDisabled: '=?ngDisabled',
                    dateDisabled: '&',
                    isDateDisabled: '=?',
                    initDate: '=?',
                    minDate: '=?',
                    maxDate: '=?'
                },
                controller: function ($scope) {
                    log.debug('directive nhcDatePicker.controller:', $scope);
                    // TODO: Date-format as Preference
                    $scope.dateFormat = 'dd-MM-yyyy';

                    $scope.dp = {
                        dateOptions: {
                            startingDay: 1
                        },
                        isOpen: false
                    };

                    $scope.open = function (event) {
                        log.debug('directive nhcDatePicker.controller.open:',
                            event);
                        event.stopPropagation();
                        event.preventDefault();
                        if (!$scope.datePickerDisabled) {
                            $scope.dp.isOpen = true;
                        }
                    };
                }
            };
        }]);

app.directive(
    'nhcFoodPreparation',
    function (remoteLoggingService, $http, spinnerService) {
        var log = remoteLoggingService;
        log.debug('directive nhcFoodPreparation');
        return {
            restrict: 'A',
            templateUrl: 'v2/preparation/food_preparation.html',
            scope: {},
            link: function (scope, element, attrs, boardCtrl) {
                log.debug('directive nhcFoodPreparation.link:', scope, element, attrs, boardCtrl);
            },
            controller: function ($scope) {
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/food/prepare/daily')
                    .success(function (result) {
                        log.debug('directive nhcFoodPreparation.controller GET /api-v2/food/prepare/daily result:', result);
                        $scope.items = result;
                    })
                    .catch(function (err) {
                        log.debug('directive nhcFoodPreparation.controller GET /api-v2/food/prepare/daily error:', err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });

                $scope.show = true;

                $scope.toggleShow = function () {
                    log.debug('directive nhcFoodPrepareCategory.controller.toggleShow');
                    $scope.show = !$scope.show;
                };
            }
        };
    });

app.directive(
    'nhcFoodPrepareCategory',
    function (remoteLoggingService, $http, spinnerService) {
        var log = remoteLoggingService;
        log.debug('directive nhcFoodPrepareCategory');
        return {
            restrict: 'A',
            templateUrl: 'v2/preparation/prepare_category.html',
            scope: {
                categoryId: '=nhcFoodPrepareCategory',
                cageCss: '=nhcClass',
                board: '=nhcBoard'
            },
            link: function (scope, element, attrs) {
                log.debug('directive nhcFoodPrepareCategory.link:', scope, element, attrs);
            },
            controller: function ($scope) {
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/preparecategory/id/' + $scope.categoryId)
                    .success(function (result) {
                        log.debug('directive nhcFoodPrepareCategory.controller GET /api-v2/preparecategory/id/' + $scope.categoryId + ' result:', result);
                        if (result.length > 0) $scope.category = result[0];
                    })
                    .catch(function (err) {
                        log.debug('directive nhcFoodPrepareCategory.controller GET /api-v2/preparecategory/id/' + $scope.categoryId + ' error:', err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/cage/rich/preparecategory/' + $scope.categoryId + '/menu/' + $scope.board)
                    .success(function (result) {
                        log.debug('directive nhcFoodPrepareCategory.controller GET /api-v2/cage/rich/preparecategory/' + $scope.categoryId + '/menu/' + $scope.board + ' result:', result);
                        $scope.cages = result;
                        var columns = Math.ceil((result.length) / 6);
                        if ($scope.board === 1) {
                            columns *= 2;
                        }
                        if (columns < 2) {
                            columns = 2;
                        }
                        $scope.css = 'nhc-route-' + columns;
                    })
                    .catch(function (err) {
                        log.debug('directive nhcFoodPrepareCategory.controller GET /api-v2/cage/rich/preparecategory/' + $scope.categoryId + '/menu/' + $scope.board + ' error:', err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });

                $scope.show = true;

                $scope.toggleShow = function () {
                    log.debug('directive nhcFoodPrepareCategory.controller.toggleShow');
                    $scope.show = !$scope.show;
                };
            }
        };
    });

app.directive(
    'nhcForceSecurityReset',
    ['remoteLoggingService', 'borderControlService',
        function (log, borderControlService) {
            log.debug('directive nhcForceSecurityReset:', borderControlService);
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    log.debug('directive nhcForceSecurityReset.link:', scope, element, attrs);
                    borderControlService.reset();
                }
            };
        }]);

// Action Link
app.directive(
    'nhcLinkAction',
    ['remoteLoggingService', '$location', 'NhcActionBar',
        function (log, $location, actionBar) {
            log.debug('directive nhcLinkAction:', $location, actionBar);
            return {
                restrict: 'E',
                scope: {
                    title: '@?nhcTitle',
                    active: '@?nhcActive',
                    url: '@nhcUrl',
                    icon: '@?nhcIcon',
                    role: '@nhcRole',
                    signIn: '@nhcSignIn',
                    imageUrl: '@?nhcImage'
                },
                link: function (scope, element, attrs, appCtrl) {
                    // Actie Registreren
                    log.debug('directive nhcLinkAction.link:', scope, element, attrs, appCtrl);

                    scope.$on('$destroy', actionBar.registerAction({
                        action: function () {
                            $location.url(scope.url);
                        },
                        icon: scope.icon,
                        title: scope.title,
                        active: scope.active !== 'false',
                        role: scope.role,
                        signIn: scope.signIn,
                        imageUrl: scope.imageUrl,
                        content: []
                    }));
                },
                controller: function ($scope) {
                    log.debug('directive nhcLinkAction.controller:', $scope);
                }
            };
        }]);

// Route
app.directive(
    'nhcMedGroup',
    ['remoteLoggingService', '$http', 'spinnerService',
        function (log, $http, spinnerService) {
            log.debug('directive nhcMedGroup');
            return {
                restrict: 'A',
                templateUrl: 'v2/other/medgroup.html',
                scope: {
                    route: '=nhcRoute',
                    cageCss: '=nhcClass'
                },
                link: function (scope, element, attrs) {
                    log.debug('directive nhcMedGroup.link:', scope, element, attrs);
                },
                controller: function ($scope) {
                    spinnerService.taskStart('nhcActionBarSpinner');
                    $http.get('/api-v2/cage/rich/medication/menu/0')
                        .success(function (result) {
                            log.debug('directive nhcMedGroup.controller GET /api-v2/cage/rich/medication/menu/0 result:', result);
                            $scope.cages = result;
                            var columns = Math.ceil((result.length) / 6);
                            $scope.css = 'nhc-route-' + columns;
                        })
                        .catch(function (err) {
                            log.debug('directive nhcMedGroup.controller GET /api-v2/cage/rich/medication/menu/0 error:', err);
                        })
                        .finally(function () {
                            spinnerService.taskStop('nhcActionBarSpinner');
                        });
                }
            };
        }]);

// app.directive(
//     'nhcPopover',
//     ['remoteLoggingService', '$q', '$http', '$templateCache', '$compile',
//         function (log, $q, $http, $templateCache, $compile) {
//             log.debug('directive nhcPopover:', $q, $http, $templateCache, $compile);
//             return {
//                 restrict: 'E',
//                 link: function (scope, element, attrs, ctrl, transclude) {
//                     log.debug('directive nhcPopover.link:', scope, element, attrs, ctrl, transclude);
//                     if (attrs.nhcTemplate) {
//                         var findTemplate = function () {
//                             var q = $q.defer();
//                             var htmlTemplate = $templateCache.get(attrs.nhcTemplate);
//                             if (typeof htmlTemplate === 'undefined') {
//                                 $http.get(attrs.nhcTemplate)
//                                     .success(function (template) {
//                                         $templateCache.put(attrs.nhcTemplate, template);
//                                         q.resolve(template);
//                                     });
//                             }
//                             else {
//                                 q.resolve(htmlTemplate);
//                             }
//                             return q.promise;
//                         };
//                         // Find the Template
//                         findTemplate()
//                             .then(function (template) {
//                                 var options = {
//                                     content: $compile(template)(scope),
//                                     placement: function (pop, dom_el) {
//                                         var width = window.innerWidth;
//                                         var left_pos = $(dom_el).offset().left;
//                                         if (width - left_pos > 400) return 'right';
//                                         return 'left';
//                                     },
//                                     // placement: 'auto right',
//                                     html: true
//                                 };
//
//                                 $(element).popover(options);
//
//                                 $(element).click(function (event) {
//                                     log.debug('directive nhcPopover.link click():', event);
//                                     $('nhc-popover').not(this).popover('hide');
//                                     event.preventDefault();
//                                     return false;
//                                 });
//                             });
//                     }
//                 },
//                 controller: function ($scope) {
//                     log.debug('directive nhcPopover.controller:', $scope);
//                 }
//             };
//         }]);

// Route
app.directive(
    'nhcRoute',
    function (remoteLoggingService, $http, spinnerService) {
        var log = remoteLoggingService;
        log.debug('directive nhcRoute');
        return {
            restrict: 'A',
            templateUrl: 'v2/wall/route.html',
            scope: {
                routeId: '=nhcRoute',
                cageCss: '=nhcClass'
            },
            link: function (scope, element, attrs) {
                log.debug('directive nhcRoute.link:', scope, element, attrs);
            },
            controller: function ($scope) {
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/route/id/' + $scope.routeId)
                    .success(function (result) {
                        log.debug('directive nhcRoute.controller ' +
                            'GET /api-v2/route/id/%s result:',
                            $scope.routeId, result);
                        $scope.route = result[0];
                    })
                    .catch(function (err) {
                        log.error('directive nhcRoute.controller ' +
                            'GET /api-v2/route/id/%s error:',
                            $scope.routeId, err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/cage/rich/route/' +
                    $scope.routeId + '/menu/0')
                    .success(function (result) {
                        log.debug('directive nhcRoute.controller ' +
                            'GET /api-v2/cage/rich/route/%s/menu/0 result:',
                            $scope.routeId, result);
                        $scope.cages = result;
                        var columns = Math.ceil((result.length + 2) / 6);
                        $scope.css = 'nhc-route-' + columns;
                    })
                    .catch(function (err) {
                        log.debug('directive nhcRoute.controller ' +
                            'GET /api-v2/cage/rich/route/%s/menu/0 error:',
                            $scope.routeId, err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });
                spinnerService.taskStart('nhcActionBarSpinner');
                $http.get('/api-v2/cage/leftover_logging/route/' +
                    $scope.routeId)
                    .success(function (result) {
                        log.debug('directive nhcRoute.controller ' +
                            'GET /api-v2/cage/leftover_logging/route/%s ' +
                            'result:', $scope.routeId, result);
                        $scope.leftoverLoggingCages = result;
                    })
                    .catch(function (err) {
                        log.debug('directive nhcRoute.controller ' +
                            'GET /api-v2/cage/leftover_logging/route/%s ' +
                            'error:', $scope.routeId, err);
                    })
                    .finally(function () {
                        spinnerService.taskStop('nhcActionBarSpinner');
                    });
            }
        };
    });

app.directive(
    'nhcSecuredPage',
    ['remoteLoggingService', '$location', 'borderControlService', 'PreviousRoute',
        function (log, $location, borderControlService, PreviousRoute) {
            log.debug('directive nhcSecuredPage:', $location, borderControlService, PreviousRoute);
            return {
                restrict: 'E',
                scope: {
                    minimalRole: '=nhcRole'
                },
                link: function (scope, element, attrs) {
                    log.debug('directive nhcSecuredPage.link:', scope, element, attrs);

                    borderControlService.borderControl(scope.minimalRole)
                        .then(function () {
                        }, function () {
                            $location.url(PreviousRoute.route.originalPath);
                        });
                }
            };
        }]);

app.directive(
    'nhcSwitchAction',
    function (remoteLoggingService, $route, $http, NhcActionBar, spinnerService) {
        var log = remoteLoggingService;
        log.debug('directive nhcSwitchAction:', $route, $http, NhcActionBar);

        var actionBar = NhcActionBar;

        return {
            restrict: 'E',
            scope: {},
            link: function (scope, element, attrs) {
                log.debug('directive nhcSwitchAction.link:',
                    scope, element, attrs);

                function actionFn() {
                    var one = actionBar.selectedItems[0].id;
                    var two = actionBar.selectedItems[1].id;
                    spinnerService.taskStart('nhcActionBarSpinner');
                    $http.post('/api-v2/cage/switch/one/' + one + '/two/' + two)
                        .success(function (result) {
                            log.debug(
                                'directive nhcSwitchAction.link actionFn() ' +
                                'POST /api-v2/cage/switch/one/%s/two/%s ' +
                                'result:', one, two, result);
                            actionBar.clearSelection();
                            $route.reload();
                        })
                        .catch(function (err) {
                            log.debug(
                                'directive nhcSwitchAction.link actionFn() ' +
                                'POST /api-v2/cage/switch/one/%s/two/%s ' +
                                'error:', one, two, err);
                        })
                        .finally(function () {
                            spinnerService.taskStop('nhcActionBarSpinner');
                        });
                }

                function checkFn(selectedItemArray) {
                    return selectedItemArray.length === 2;
                }

                var action = {
                    action: actionFn,
                    title: 'Wisselen',
                    imageUrl: '/images/rub10bis.png',
                    active: false,
                    role: 'rlAdmin',
                    confirm: true,
                    checkAvailability: checkFn
                };
                var dtrFn = actionBar.registerSelectionAction(action);

                scope.$on('$destroy', function () {
                    dtrFn();
                    actionBar.clearSelection();
                });
            }
        };
    });

// DraggableToggle Plugin-Wrapper Angular directive
app.directive(
    'draggableToggle',
    function (remoteLoggingService, $parse, $timeout) {
        var log = remoteLoggingService;

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                log.debug('directive draggableToggle.link:',
                    scope, element, attrs);
                // Get the specified standard draggable toggle options
                var opts = scope.$eval(attrs.draggableToggle);
                // Add some default CSS classes to the main-element
                element.addClass('toggle toggle-clean');
                // Create the draggable toggle using the specified options
                element.toggles(opts);
                // Get a handle to the draggable toggle
                var draggableToggle = element.data('toggles');

                // Handle some custom draggable toggle options
                ['on', 'handle', 'off'].forEach(
                    function (part) {
                        var el = angular.element(
                            element[0].querySelector('.toggle-' + part));
                        el.addClass('vertical-flex-container');
                        el.addClass(attrs[part + 'Class']);

                        // Click event handler
                        el.on('click', function () {
                            log.debug(
                                'directive draggableToggle.on click-%s', part);
                            // Invoke the click handler in a $parse way i.e.
                            // function(context, locals)
                            $parse(
                                attrs[attrs.$normalize('click-' + part)]
                            )(scope, {});
                            // If defined, the toggle has to be bounced back to
                            // its initial position
                            if (attrs[attrs.$normalize(
                                    'click-' + part + '-bounce-back')
                                    ] === 'true')
                                doBounceBack();
                        });
                    }
                );

                var doBounceBack = function () {
                    log.debug('directive draggableToggle doBounceBack');
                    // Reset to the initial state without triggering an
                    // event (myToggle.toggle(state, noAnimate, noEvent))
                    var initialState = opts.on || false;
                    $timeout(function () {
                        draggableToggle.toggle(initialState, false, true);
                    });
                };

                // Toggle event handler
                element.on('toggle', function () {
                    log.debug('directive draggableToggle.on toggle');
                    // Invoke the toggle handler in a $parse way i.e.
                    // function(context, locals)
                    $parse(attrs.doToggle)(scope, {});
                    // If defined, the toggle has to be bounced back to its
                    // initial position
                    if (attrs.bounceBack === 'true') doBounceBack();
                });
            }
        };
    });

// Define a directive to bind a specific action on right click,
// using the 'contextmenu' event.
app.directive(
    'rightClick',
    function (remoteLoggingService, $parse) {
        var log = remoteLoggingService;

        return function (scope, element, attrs) {
            var onRightClick = $parse(attrs.rightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.stopPropagation();
                    event.preventDefault();
                    log.debug('directive rightClick onRightClick:', onRightClick);
                    onRightClick(scope, {$event: event});
                });
            });
        };
    });

app.directive(
    'nhcSvgMap',
    function ($compile) {
        return {
            restrict: 'A',
            templateUrl: 'images/NHC_map.svg',
            link: function (scope, element, attrs) {
                // var regions = element[0].querySelectorAll('.state');
                // angular.forEach(regions, function (path, key) {
                //     var regionElement = angular.element(path);
                //     regionElement.attr("region", "");
                //     $compile(regionElement)(scope);
                // })
            }
        };
    });

app.controller(
    'LeftoverController',
    function ($scope, $http, $filter, preferencesService, $timeout) {

    });

// Controllers
app.controller(
    'MainController',
    function ($scope, remoteLoggingService, $window) {
        var log = remoteLoggingService;

        angular.element($window).on('resize', function () {
            log.debug('MainController $window on resize inner-width x -height:', $window.innerWidth, ' x ', $window.innerHeight);
            $scope.windowInnerWidth = $window.innerWidth;
            $scope.windowInnerHeight = $window.innerHeight;
        });
        $scope.windowInnerWidth = $window.innerWidth;
        $scope.windowInnerHeight = $window.innerHeight;
    });

app.controller(
    'ClockController',
    function ($scope, remoteLoggingService, $location, borderControlService) {
        // TODO Define pref clock.format
        $scope.clock_format = 'EEE dd MMM yyyy';
        // TODO Redesign/simplify action-bar actions i.e. unnecessary registration and very complex e.g. see below for a fit-for-purpose simplification
        $scope.executeAction = function () {
            var action = {
                action: function () {
                    $location.url('/calendar');
                },
                title: 'Agenda',
                active: true,
                role: 'rlVolunteer'
            };
            $scope.$parent.execute(action);
            // borderControlService.tryAction(action.action, action.role);
        };
    });

app.controller(
    'SpinnerController',
    function ($scope, remoteLoggingService, spinnerService) {
        var log = remoteLoggingService;
        $scope.resetSpinner = function ($event) {
            log.debug('SpinnerController resetSpinner:', $event);
            spinnerService.reset($event.delegateTarget.attributes.name.value);
        };
    });

app.controller(
    'PopoverController',
    function ($scope, remoteLoggingService, $window) {
        var log = remoteLoggingService;

        $scope.popoverIsOpen = false;
        $scope.popoverPlacement = 'right';

        $scope.onToggle = function ($event) {
            log.debug('PopoverController onToggle:', arguments);
            if (!$scope.popoverIsOpen) {
                $scope.popoverPlacement =
                    $event.pageX < $window.innerWidth / 2 ? 'right' : 'left';
                log.debug('PopoverController onToggle open:',
                    $scope.popoverPlacement);
            } else {
                log.debug('PopoverController onToggle close');
            }
            $scope.popoverIsOpen = !$scope.popoverIsOpen;
        };

        $scope.close = function ($event) {
            log.debug('PopoverController close:', arguments);
            $scope.popoverIsOpen = false;
        };
    });

app.controller(
    'AdoptionListController',
    function ($scope, remoteLoggingService, $location, $http, spinnerService) {
        var log = remoteLoggingService;
        // TODO: Date-format as Preference
        $scope.dateFormat = 'dd-MM-yyyy';

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/fiche/adoption/')
            .success(function (result) {
                log.debug('AdoptionListController get ' +
                    '/api-v2/fiche/adoption/ result:', result);
                $scope.guests = result;
            })
            .catch(function (err) {
                log.debug('AdoptionListController get ' +
                    '/api-v2/fiche/adoption/ error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.fiche = function (guest) {
            $location.url('/fiche?uuid=' + guest.uuid);
        };
    });

// Basic Confirmation
app.controller(
    'BasicConfirmationController',
    function ($scope, remoteLoggingService, $uibModalInstance, modalInfo) {
        var log = remoteLoggingService;
        log.debug('BasicConfirmationController:', $uibModalInstance, modalInfo);
        $scope.info = modalInfo;

        $scope.confirm = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });

// Fiche
app.controller(
    'FicheController',
    function ($scope, remoteLoggingService, $location, $routeParams, $uibModal,
              $http, $filter, PreviousRoute, spinnerService, preferencesService) {
        var log = remoteLoggingService;

        $scope.today = new Date(new Date().setHours(0, 0, 0, 0));

        // // TODO Define pref fiche.allowUnlockingDisabledFields
        // $scope.allowUnlockingDisabledFields = true;
        // TODO: Date-format as Preference
        $scope.dateFormat = 'dd-MM-yyyy';

        $scope.guestWeightMeasurements = [];
        var droppedWeightMeasurements = [];

        function initNewWeightMeasurement() {
            $scope.newWeightMeasurement = {
                id: null,
                hospitalization: null,
                grams: null,
                date: null
            };
        }

        function getWeightMeasurements() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/weight/hospitalization/' + $scope.guest.id;
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    $scope.guestWeightMeasurements = result.map(
                        function (item, index, arr) {
                            item.date = new Date(item.date);
                            return item;
                        }
                    );
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function saveWeightMeasurements() {
            droppedWeightMeasurements.forEach(
                function (wm, index, arr) {
                    var action = 'FicheController.save weight delete';
                    var url = '/api-v2/weight/id/' + wm.id;
                    $http.delete(url)
                        .success(function (result) {
                            log.debug('%s %s result:', action, url, result);
                        })
                        .catch(function (err) {
                            log.debug('%s %s error:', action, url, err);
                        });
                }
            );
            $scope.guestWeightMeasurements.forEach(
                function (wm, index, arr) {
                    var action = 'FicheController.save weight post';
                    var url = '/api-v2/weight/';
                    if (wm.id)
                        url += 'id/' + wm.id;

                    wm.hospitalization = $scope.guest.id;

                    log.debug('%s %s data:', action, url, wm);
                    $http.post(url, wm)
                        .success(function (result) {
                            log.debug('%s %s result:', action, url, result);
                            wm = result;
                        })
                        .catch(function (err) {
                            log.debug('%s %s error:', action, url, err);
                        });
                }
            );
        }

        function getFiche() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/fiche' +
                (status_code ? '/state/' + status_code : '') + '/uuid/' + uuid;
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    if (result.length > 0) {
                        $scope.guest = result[0];
                        // Convert all dates
                        ['entrance', 'exit', 'adoption_from'].forEach(
                            function (date, index, arr) {
                                if ($scope.guest[date])
                                    $scope.guest[date] =
                                        new Date($scope.guest[date]);
                            }
                        );
                        // Initialize the virtual counter unspecifiedSexQuantity
                        $scope.unspecifiedSexQuantity =
                            $scope.guest.quantity -
                            $scope.guest.male_quantity -
                            $scope.guest.female_quantity;
                        // Get all weight measurements for the fiche
                        getWeightMeasurements();

                        // }
                        // else {
                        //     // Not found, go back
                        //     spinnerService.reset('nhcActionBarSpinner');
                        //     // TODO Go back results in an infinite loop (hanging) because login is still pending
                        //     // Find a solution to login first -> success -> get fiche
                        //     //                                -> failure -> go back
                        //     // $location.url(PreviousRoute.route.originalPath);
                    }
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getCages() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/cage/';
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    $scope.cages = result;
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getAnimals() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/animal/';
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    $scope.animals = result;
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getEntranceReasons() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/entrancereason/';
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    // TODO: I.s.o. filtering out not allowed items, show all but disable the not allowed ones (angular 1.4 >) !!!!!!!!!!!!!!!!!
                    // <select ng-model="$ctrl.selectedItem" ng-options="item as item.label disable when item.disabled for item in $ctrl.listItems">
                    $scope.entrance_reasons = result.filter(
                        function (item, index, arr) {
                            return true || item.use_allowed;
                        }
                    );
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getExitReasons() {
            spinnerService.taskStart('nhcActionBarSpinner');
            var action = 'FicheController get';
            var url = '/api-v2/exitreason/';
            $http.get(url)
                .success(function (result) {
                    log.debug('%s %s result:', action, url, result);
                    // TODO: I.s.o. filtering out not allowed items, show all but disable the not allowed ones (angular 1.4 >) !!!!!!!!!!!!!!!!!
                    // <select ng-model="$ctrl.selectedItem" ng-options="item as item.label disable when item.disabled for item in $ctrl.listItems">
                    $scope.exit_reasons = result.filter(
                        function (item, index, arr) {
                            return true || item.use_allowed;
                        }
                    );
                })
                .catch(function (err) {
                    log.debug('%s %s error:', action, url, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getFichePreferences() {
            var prefBranch = '/fiche';
            preferencesService.get(prefBranch)
                .then(function (result) {
                    log.debug('FicheController get preferences %s result:',
                        prefBranch, result);
                    $scope.fichePrefs = result;
                    $scope.allowUnlockingDisabledFields =
                        $scope.fichePrefs.children
                            .allowUnlockingDisabledFields.data.value;
                })
                .catch(function (err) {
                    log.debug('FicheController get preferences %s error:',
                        prefBranch, err);
                });
        }

        var isNewFiche = !$routeParams.hasOwnProperty('uuid');
        if (isNewFiche) {
            // Initialize the new fiche
            $scope.guest = {
                entrance: $scope.today,
                quantity: 1,
                male_quantity: 0,
                female_quantity: 0,
                menu_percentage: 100
            };
            $scope.showIDs = false;
            $scope.showExit = false;
            $scope.datePickerEntranceDisabled = false;
            $scope.datePickerExitDisabled = true;
            $scope.exitReasonDisabled = true;
            $scope.quantityDisabled = false;
            // Initialize the virtual counter unspecifiedSexQuantity
            $scope.unspecifiedSexQuantity = $scope.guest.quantity -
                $scope.guest.male_quantity - $scope.guest.female_quantity;

        } else {
            var uuid = $routeParams.uuid;
            var status_code = $routeParams.state;
            // Initialize and get the existing fiche
            $scope.showIDs = true;
            $scope.showExit = true;
            $scope.datePickerEntranceDisabled = true;
            $scope.datePickerExitDisabled = true;
            $scope.exitReasonDisabled = true;
            $scope.quantityDisabled = true;

            getFiche();
        }
        // Initialize the potential new weight measurement.
        initNewWeightMeasurement();
        // Get all cages, animals, entrance-reasons, exit-reasons
        getCages();
        getAnimals();
        getEntranceReasons();
        getExitReasons();
        getFichePreferences();

        $scope.animalSelected = function () {
            if ($scope.guest && $scope.guest.animal && $scope.animals) {
                var animal =
                    $filter('filter')(
                        $scope.animals, {'id': $scope.guest.animal}
                    )[0];
                log.debug('FicheController animalSelected:', animal);
                if (isNewFiche) {
                    $scope.guest.for_adoption = animal.default_for_adoption;
                }
            }
        };

        $scope.enableField = function ($event, propertyName, fieldLabel) {
            log.debug('FicheController.enableField:', arguments);
            var modalInfo = {
                title: 'Veld ' + fieldLabel + ' deblokkeren'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    $scope[propertyName] = false;
                });
        };

        $scope.showImage = function ($event) {
            log.debug('FicheController.showImage:', arguments);
            var modal = $uibModal.open({
                templateUrl: '/v2/fiche/image_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        modal.close();
                    };
                }
            });
        };

        $scope.isDateDisabled = function (date, mode) {
            // log.debug('FicheController.isDateDisabled:', arguments);
            return $scope.guestWeightMeasurements.some(function (item, index) {
                // Date is disabled when view is in day mode, item has a valid
                // weight and item date equals specified date (must be unique).
                // Note that dates can't be compared, but their numeric
                // values can.
                return mode === 'day' && item.grams && +item.date === +date;
            });
        };

        $scope.createWeightMeasurement = function ($event, weightMeasurement) {
            log.debug('FicheController.createWeightMeasurement:', arguments);
            if (weightMeasurement.date && weightMeasurement.grams) {
                // Add the new weight measurement to the list.
                $scope.guestWeightMeasurements.push(weightMeasurement);
                // Initialize the potential new weight measurement.
                initNewWeightMeasurement();
            }
        };

        $scope.changeWeightMeasurement = function ($event, weightMeasurement) {
            log.debug('FicheController.changeWeightMeasurement:', arguments);
            // Create an intermediate weight measurement to capture the
            // performed changes. Only when the changes are confirmed, the
            // intermediate weight measurement is saved to the current weight
            // measurement list.
            $scope.weightMeasurement = {
                date: new Date(weightMeasurement.date),
                grams: weightMeasurement.grams
            };

            var modal = $uibModal.open({
                templateUrl: '/v2/fiche/weight_measurement_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.weightMeasurement.date &&
                            $scope.weightMeasurement.grams)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    log.debug('FicheController.changeWeightMeasurement result:',
                        $scope.weightMeasurement);
                    // Save the changed intermediate weight measurement to the
                    // current guest weight measurement list.
                    var index = $scope.guestWeightMeasurements
                        .indexOf(weightMeasurement);
                    $scope.guestWeightMeasurements[index] =
                        $scope.weightMeasurement;
                });
        };

        $scope.deleteWeightMeasurement = function ($event, weightMeasurement) {
            log.debug('FicheController.deleteWeightMeasurement:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Gewicht van ' + weightMeasurement.grams + ' gram op ' +
                $filter('date')(
                    weightMeasurement.date,
                    $scope.dateFormat
                ) + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    if (weightMeasurement.id) {
                        // The weight measurement exists in the database. Keep
                        // track of the weight measurement to be deleted from
                        // the database by adding it to the dropped weight
                        // measurement list.
                        droppedWeightMeasurements.push(weightMeasurement);
                        log.debug('FicheController.deleteWeightMeasurement ' +
                            'droppedWeightMeasurements:',
                            droppedWeightMeasurements);
                    }
                    // Remove the weight measurement from the current weight
                    // measurement list.
                    var index = $scope.guestWeightMeasurements
                        .indexOf(weightMeasurement);
                    $scope.guestWeightMeasurements.splice(index, 1);

                });
        };

        $scope.save = function (hold) {
            log.debug('FicheController.save:',
                $scope.guest, $scope.unspecifiedSexQuantity);
            var newQuantity = $scope.unspecifiedSexQuantity +
                $scope.guest.male_quantity + $scope.guest.female_quantity;
            if ($scope.guest.entrance &&
                $scope.guest.animal && newQuantity > 0 &&
                $scope.guest.menu_percentage >= 0 &&
                $scope.guest.entrance_reason >= 0) {

                $scope.guest.quantity = newQuantity;
                $scope.guest.status_code = $scope.guest.cage ? 'RECOVER' : 'IC';

                var action = 'FicheController.save post';
                var url = '/api-v2/fiche/';
                if ($scope.guest.id > 0)
                    url += 'id/' + $scope.guest.id;

                log.debug('%s %s data:', action, url, $scope.guest);
                $http.post(url, $scope.guest)
                    .success(function (result) {
                        log.debug('%s %s result:', action, url, result);
                        $scope.guest = result;

                        // Initialize the virtual counter unspecifiedSexQuantity
                        $scope.unspecifiedSexQuantity =
                            $scope.guest.quantity -
                            $scope.guest.male_quantity -
                            $scope.guest.female_quantity;

                        saveWeightMeasurements();
                    })
                    .catch(function (err) {
                        log.debug('%s %s error:', action, url, err);
                    });

                if (!hold)
                    $location.url(PreviousRoute.route.originalPath);
            }
        };

        $scope.free = function () {
            log.debug('FicheController.free');
            var modal = $uibModal.open({
                templateUrl: '/v2/fiche/exit_modal.html',
                controller: 'GuestExitModalController',
                resolve: {
                    guest: function () {
                        return $scope.guest;
                    },
                    animal: function () {
                        return $scope.animal;
                    }
                }
            });
            modal.result
                .then(function (guest) {
                    $scope.guest = guest;
                    $scope.save();
                });
        };

        $scope.ic = function () {
            log.debug('FicheController.ic');
            var modal = $uibModal.open({
                templateUrl: '/v2/fiche/ic_modal.html',
                controller: 'GuestICModalController',
                resolve: {
                    guest: function () {
                        return $scope.guest;
                    },
                    animal: function () {
                        return $scope.animal;
                    }
                }
            });
            modal.result
                .then(function (guest) {
                    $scope.guest = guest;
                    $scope.save();
                });
        };

        $scope.split = function () {
            log.debug('FicheController.split');
            var modal = $uibModal.open({
                templateUrl: '/v2/fiche/split_modal.html',
                controller: 'GuestSplitModalController',
                resolve: {
                    guest: function () {
                        return $scope.guest;
                    },
                    animal: function () {
                        return $scope.animal;
                    }
                }
            });
            modal.result
                .then(function (guests) {
                    $scope.save(true); // hold
                    $scope.guest = guests.splitted;
                    $scope.save(true); // hold
                });
        };

        $scope.back = function () {
            log.debug('FicheController.back');
            $location.url(PreviousRoute.route.originalPath);
        };

    });

app.controller(
    'GuestListController',
    function ($scope, remoteLoggingService, $location, $http, $timeout, spinnerService) {
        var log = remoteLoggingService;
        // TODO: Use 'Controller as' syntax
        $scope.ctrl = {};
        // $scope.ctrl.status_code = 'RECOVER';
        // TODO: Date-format as Preference
        $scope.ctrl.dateFormat = 'dd-MM-yyyy';

        function load() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/fiche/state/' + $scope.ctrl.status_code)
                .success(function (result) {
                    log.debug('GuestListController.load ' +
                        'GET /api-v2/fiche/state/%s result:',
                        $scope.ctrl.status_code, result);
                    $scope.guests = result;
                })
                .catch(function (err) {
                    log.debug('GuestListController.load ' +
                        'GET /api-v2/fiche/state/%s error:',
                        $scope.ctrl.status_code, err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });

        }

        // After loading the page, including initialization of
        // $scope.ctrl.status_code, load the relevant fiches.
        $timeout(function () {
            if (!$scope.ctrl.status_code)
                $scope.ctrl.status_code = 'RECOVER';
            load();
        });

        $scope.onLocationStatusChange = function () {
            log.debug('GuestListController.onLocationStatusChange:',
                $scope.ctrl.status_code);
            load();
        };

        // $scope.$watch('status_code', function (newValue, oldValue) {
        //     if (newValue) {
        //         spinnerService.taskStart('nhcActionBarSpinner');
        //         $http.get('/api-v2/fiche/state/' + newValue)
        //             .success(function (result) {
        //                 log.debug('GuestListController.$watch get ' +
        //                     '/api-v2/fiche/state/%s result:', newValue, result);
        //                 $scope.guests = result;
        //             })
        //             .catch(function (err) {
        //                 log.debug('GuestListController.$watch get ' +
        //                     '/api-v2/fiche/state/%s error:', newValue, err);
        //             })
        //             .finally(function () {
        //                 spinnerService.taskStop('nhcActionBarSpinner');
        //             });
        //     }
        //     else {
        //         $scope.guests = [];
        //     }
        // });

        $scope.fiche = function (guest) {
            log.debug('GuestListController.fiche:', guest, $scope.ctrl.status_code);
            $location.url('/fiche?uuid=' + guest.uuid + '&state=' + $scope.ctrl.status_code);
            // $location.url('/fiche/uuid/' + guest.uuid);
            // $location.url('/fiche/state/' + $scope.status_code + '/uuid/' + guest.uuid);
        };
    });

app.controller(
    'GuestExitModalController',
    function ($scope, remoteLoggingService, $uibModalInstance, guest, animal) {
        var log = remoteLoggingService;
        log.debug('GuestExitModalController:', $uibModalInstance, guest, animal);
        $scope.guest = guest;
        $scope.animal = animal;

        $scope.ok = function () {
            log.debug('GuestExitModalController ok');
            if ($scope.guest.exit && $scope.guest.exit_reason) {
                $scope.guest.cage = null;
                $scope.guest.status_code = 'END';
                $uibModalInstance.close($scope.guest);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });

app.controller(
    'GuestICModalController',
    function ($scope, remoteLoggingService, $uibModalInstance, guest, animal) {
        var log = remoteLoggingService;
        log.debug('GuestICModalController:', $uibModalInstance, guest, animal);
        $scope.guest = guest;
        $scope.animal = animal;

        $scope.ok = function () {
            log.debug('GuestICModalController ok');
            $scope.guest.cage = null;
            $scope.guest.status_code = 'IC';
            $uibModalInstance.close($scope.guest);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });

app.controller(
    'GuestSplitModalController',
    function ($scope, remoteLoggingService, $uibModalInstance, guest, animal) {
        var log = remoteLoggingService;
        log.debug('GuestSplitModalController:', $uibModalInstance, guest, animal);
        $scope.guest = guest;
        $scope.animal = animal;
        $scope.split_count = 1;

        $scope.ok = function () {
            log.debug('GuestSplitModalController ok');
            if ($scope.split_count > 0 && $scope.split_count < $scope.guest.quantity) {
                $scope.guest.quantity -= $scope.split_count;
                var newGuest = {};
                for (var attr in guest) {
                    if (guest.hasOwnProperty(attr)) {
                        newGuest[attr] = guest[attr];
                    }
                }
                delete newGuest.id;
                delete newGuest.uuid;
                newGuest.quantity = $scope.split_count;
                $uibModalInstance.close({
                    toSplit: $scope.guest,
                    splitted: newGuest
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });

app.controller(
    'LeftoverController',
    function ($scope, remoteLoggingService, $http, $uibModal,
              spinnerService, $filter, preferencesService, $timeout) {
        var log = remoteLoggingService;

        $scope.today = new Date(new Date().setHours(0, 0, 0, 0));
        // Default leftover-type
        $scope.leftoverType = 'list';

        function leftoverDayHeaders() {
            // Days ago day-ordering, ending at today
            var weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
            var dayHeaders = [];
            var day = new Date($scope.today);
            day.setDate(day.getDate() - $scope.daysAgoToShow);
            for (var daysAgo = $scope.daysAgoToShow; daysAgo >= 0; daysAgo--) {
                dayHeaders.push([
                    weekDays[day.getDay()],
                    day.getDate() + '/' + (day.getMonth() + 1)
                ]);
                day.setDate(day.getDate() + 1);
            }
            return dayHeaders;
        }

        function getLeftoverPreferences() {
            var prefBranch = '/leftovers';
            preferencesService.get(prefBranch)
                .then(function (result) {
                    log.debug('LeftoverController get preferences %s result:',
                        prefBranch, result);
                    $scope.leftoverPrefs = result;
                    $scope.warningLevels =
                        $scope.leftoverPrefs.children.warningLevels.data.value;
                    $scope.showPercentage =
                        $scope.leftoverPrefs.children.showPercentage.data.value;
                    $scope.showMenuQuantityAnimalCount =
                        $scope.leftoverPrefs.children
                            .showMenuQuantityAnimalCount.data.value;
                    $scope.daysAgoToShow =
                        $scope.leftoverPrefs.children[$scope.leftoverType]
                            .children.daysAgoToShow.data.value;
                    $scope.dayLabels =
                        leftoverDayHeaders();
                })
                .catch(function (err) {
                    log.debug('LeftoverController get preferences %s error:',
                        prefBranch, err);
                });

            var prefBranch2 = '/system';
            preferencesService.get(prefBranch2)
                .then(function (result) {
                    log.debug('LeftoverController get preferences %s result:',
                        prefBranch2, result);
                    $scope.systemPrefs = result;
                    $scope.automaticUpdateDebounceTime =
                        $scope.systemPrefs.children.fineTuning
                            .children.automaticUpdateDebounceTime.data.value;
                })
                .catch(function (err) {
                    log.debug('LeftoverController get preferences %s error:',
                        prefBranch2, err);
                });
        }

        function getLeftoverLoggingMenus() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/menu/leftover_logging')
                .success(function (result) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/menu/leftover_logging result:', result);
                    $scope.leftoverLoggingMenus = result;
                    // Set today's leftover for the cages in the leftovers list.
                    $scope.leftovers.forEach(
                        function (item, index, arr) {
                            var menu = $filter('filter')(
                                $scope.leftoverLoggingMenus,
                                {cage: item.cage}
                            )[0];
                            if (item.relative_day_leftover[0])
                                angular.extend(
                                    item.relative_day_leftover[0], menu);
                            else
                                item.relative_day_leftover[0] = menu;
                        }
                    );
                    // Set today's leftover for the cages that are not
                    // yet in the leftovers list.
                    $scope.leftoverLoggingCages.forEach(
                        function (item, index, arr) {
                            var menu = $filter('filter')(
                                $scope.leftoverLoggingMenus,
                                {cage: item.id}
                            )[0];
                            item.leftover = menu;
                        }
                    );
                })
                .catch(function (err) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/menu/leftover_logging error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getLeftoverLoggingCages() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/cage/leftover_logging')
                .success(function (result) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/cage/leftover_logging result:', result);
                    // Filter the cages that are not yet shown in the
                    // leftover list.
                    $scope.leftoverLoggingCages =
                        result.filter(function (cage) {
                            return !$scope.leftovers.some(function (leftover) {
                                return cage.id === leftover.cage;
                            });
                        });
                    getLeftoverLoggingMenus();
                })
                .catch(function (err) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/cage/leftover_logging error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getLeftoverLoggingFoods() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/food/leftover_logging')
                .success(function (result) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/food/leftover_logging result:', result);
                    $scope.leftoverLoggingFoods = result;
                })
                .catch(function (err) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/food/leftover_logging error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getLeftovers() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/leftover')
                .success(function (result) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/leftover result:', result);
                    $scope.leftovers = result;
                    getLeftoverLoggingCages();
                })
                .catch(function (err) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/leftover error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        function getLeftover(cage) {
            $scope.leftovers = [{
                cage: cage.id,
                cageName: cage.name,
                cageRoute: cage.route,
                color: cage.color,
                relative_day_leftover: {}
            }];
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/leftover/cage/' + cage.id)
                .success(function (result) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/leftover/cage/%s result:',
                        cage.id, result);
                    if (result.length > 0) {
                        $scope.leftovers = result;
                    }
                })
                .catch(function (err) {
                    log.debug('LeftoverController ' +
                        'GET /api-v2/leftover/cage/%s error:',
                        cage.id, err);
                })
                .finally(function () {
                    spinnerService
                        .taskStop('nhcActionBarSpinner');
                });
        }

        // After loading the page, including initialization of
        // $scope.leftoverType and $scope.leftoverCage, load the relevant
        // leftover data.
        $timeout(function () {
            log.debug('LeftoverController init:',
                $scope.leftoverType, $scope.leftoverCage);

            getLeftoverPreferences();
            if ($scope.leftoverCage) {
                getLeftover($scope.leftoverCage);
                $scope.leftoverLoggingCages = [];
                getLeftoverLoggingMenus();
            } else {
                getLeftovers();
            }
            getLeftoverLoggingFoods();
        });

        $scope.getWarningStyle = function (percent) {
            var levelIndex = -1;
            $scope.warningLevels.colorLevels.forEach(
                function (colorLevel, index) {
                    if (percent >= colorLevel.percent) levelIndex = index;
                }
            );
            var style = {};
            if (levelIndex === -1) return {};
            angular.forEach($scope.warningLevels.styling,
                function (value, key) {
                    if (value) style[key] =
                        $scope.warningLevels.colorLevels[levelIndex].color;
                }
            );
            return style;
        };

        $scope.save = function (item) {
            log.debug('LeftoverController.save data:', item);
            var dayLeftover = item.relative_day_leftover[0];
            log.debug('LeftoverController.save ' +
                'POST /api-v2/leftover data:', dayLeftover);
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.post('/api-v2/leftover', dayLeftover)
                .success(function (result) {
                    log.debug('LeftoverController.save ' +
                        'POST /api-v2/leftover result:', result);
                    dayLeftover.percent = Math.round(
                        dayLeftover.quantity / dayLeftover.menu_quantity * 100);
                })
                .catch(function (err) {
                    log.debug('LeftoverController.save ' +
                        'POST /api-v2/leftover error:', err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        };

        $scope.create = function ($event) {
            log.debug('LeftoverController.create:', arguments);
            $scope.selectedCage = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/wall/left_over_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        // Get the cage and today's leftover from the selected
                        // leftoverLoggingCage.
                        $scope.cage = $filter('filter')(
                            $scope.leftoverLoggingCages,
                            {id: $scope.selectedCage.id}
                        )[0];
                        $scope.dayLeftover = $scope.cage.leftover;
                        if ($scope.dayLeftover.cage > 0 &&
                            $scope.dayLeftover.quantity > 0) {
                            modal.close();
                        }
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new leftover to the DB.
                    log.debug('LeftoverController.create ' +
                        'POST /api-v2/leftover data:', $scope.dayLeftover);
                    spinnerService.taskStart('nhcActionBarSpinner');
                    $http.post('/api-v2/leftover', $scope.dayLeftover)
                        .success(function (result) {
                            log.debug('LeftoverController.create ' +
                                'POST /api-v2/leftover result:', result);
                            // Successful so add the new leftover to the
                            // current leftovers list...
                            var leftover = {
                                cage: $scope.cage.id,
                                cageName: $scope.cage.name,
                                cageRoute: $scope.cage.route,
                                color: $scope.cage.color,
                                relative_day_leftover: {'0': result}
                            };
                            $scope.leftovers.push(leftover);
                            // ... and remove the cage from the
                            // leftoverLoggingCages.
                            $scope.leftoverLoggingCages.splice(
                                $scope.leftoverLoggingCages
                                    .indexOf($scope.cage), 1);
                        })
                        .catch(function (err) {
                            log.debug('LeftoverController.create ' +
                                'POST /api-v2/leftover error:', err);
                            // Failed so drop the new leftover.
                        })
                        .finally(function () {
                            spinnerService.taskStop('nhcActionBarSpinner');
                        });
                });
        };
    });

// app.controller(
//     'LeftOverModalController',
//     function ($scope, remoteLoggingService, $uibModalInstance, $http, spinnerService) {
//         var log = remoteLoggingService;
//         $scope.data = {cage: 0, number: 0};
//
//         $scope.ok = function () {
//             if ($scope.data.cage > 0 && $scope.data.number > 0) {
//                 spinnerService.taskStart('nhcActionBarSpinner');
//                 log.debug('LeftOverModalController.ok: ' +
//                     'POST /api-v2/leftover data:', $scope.data);
//                 $http.post('/api-v2/leftover', $scope.data)
//                     .success(function (result) {
//                         log.debug('LeftOverModalController.ok: ' +
//                             'POST /api-v2/leftover result:', result);
//                         $uibModalInstance.close();
//                     })
//                     .catch(function (err) {
//                         log.debug('LeftOverModalController.ok: ' +
//                             'POST /api-v2/leftover error:', err);
//                     })
//                     .finally(function () {
//                         spinnerService.taskStop('nhcActionBarSpinner');
//                     });
//             }
//         };
//
//         $scope.cancel = function () {
//             $uibModalInstance.dismiss();
//         };
//     });

app.controller(
    'ManageAnimalsController',
    function ($scope, remoteLoggingService, $http, spinnerService, $uibModal) {
        var log = remoteLoggingService;
        // For now, set the scrollable table 'watched' appData
        // to the entire scope.
        $scope.appData = $scope;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/animal/')
            .success(function (result) {
                log.debug('ManageAnimalsController ' +
                    'GET /api-v2/animal result:', result);
                $scope.animals = result;
            })
            .catch(function (err) {
                log.error('ManageAnimalsController ' +
                    'GET /api-v2/animal error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/preparecategory')
            .success(function (result) {
                log.debug('ManageAnimalsController ' +
                    'GET /api-v2/preparecategory result:', result);
                $scope.prepareCategories = result;
            })
            .catch(function (err) {
                log.debug('ManageAnimalsController ' +
                    'GET /api-v2/preparecategory error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.showImage = function ($event) {
            log.debug('ManageAnimalsController.showImage:', arguments);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/image_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        modal.close();
                    };
                }
            });
        };

        $scope.create = function ($event) {
            log.debug('ManageAnimalsController.create:', arguments);
            $scope.animal = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/animal_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.animal.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new animal to the DB.
                    log.debug('ManageAnimalsController.create ' +
                        'POST /api-v2/animal data:', $scope.animal);
                    $http.post('/api-v2/animal', $scope.animal)
                        .success(function (result) {
                            log.debug('ManageAnimalsController.create ' +
                                'POST /api-v2/animal result:', result);
                            // Successful so add the new animal to the
                            // current animals list.
                            $scope.animals.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageAnimalsController.create ' +
                                'POST /api-v2/animal error:', err);
                            // Failed so drop the new animal.
                        });
                });
        };

        $scope.update = function ($event, animal) {
            log.debug('ManageAnimalsController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.animal = angular.copy(animal);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/animal_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.animal.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageAnimalsController.update ' +
                        'POST /api-v2/animal/id/%s data:',
                        $scope.animal.id, $scope.animal);
                    $http.post('/api-v2/animal/id/' + $scope.animal.id,
                        $scope.animal)
                        .success(function (result) {
                            log.debug('ManageAnimalsController.update ' +
                                'POST /api-v2/animal/id/%s result:',
                                $scope.animal.id, result);
                            // Successful so save the updated animal to the
                            // current animals list.
                            var index = $scope.animals.indexOf(animal);
                            $scope.animals[index] = $scope.animal;
                        })
                        .catch(function (err) {
                            log.debug('ManageAnimalsController.update ' +
                                'POST /api-v2/animal/id/%s error:',
                                $scope.animal.id, err);
                            // Failed so drop the updated animal.
                        });
                });
        };

        $scope.delete = function ($event, animal) {
            log.debug('ManageAnimalsController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Diersoort ' + animal.name + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageAnimalsController.delete ' +
                        'DELETE /api-v2/animal/id/%s data:',
                        animal.id, animal);
                    $http.delete('/api-v2/animal/id/' + animal.id)
                        .success(function (result) {
                            log.debug('ManageAnimalsController.delete ' +
                                'DELETE /api-v2/animal/id/%s result:',
                                animal.id, result);
                            // Successful so remove the animal from the
                            // current animals list.
                            var index = $scope.animals.indexOf(animal);
                            $scope.animals.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageAnimalsController.delete ' +
                                'DELETE /api-v2/animal/id/%s error:',
                                animal.id, err);
                            // Failed so drop the removed animal.
                        });
                });
        };

    });

app.controller(
    'ManageCagesController',
    function ($scope, remoteLoggingService, $http, $uibModal,
              spinnerService, $filter) {
        var log = remoteLoggingService;
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/cage/')
            .success(function (result) {
                log.debug(
                    'ManageCagesController GET /api-v2/cage result:', result);
                $scope.cages = result;
            })
            .catch(function (err) {
                log.error(
                    'ManageCagesController GET /api-v2/cage error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/route')
            .success(function (result) {
                log.debug(
                    'ManageCagesController GET /api-v2/route result:', result);
                $scope.routes = result;
            })
            .catch(function (err) {
                log.error(
                    'ManageCagesController GET /api-v2/route error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.create = function ($event) {
            log.debug('ManageCagesController.create:', arguments);
            $scope.cage = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/cage_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.cage.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new cage to the DB.
                    log.debug('ManageCagesController.create ' +
                        'POST /api-v2/cage data:', $scope.cage);
                    $http.post('/api-v2/cage', $scope.cage)
                        .success(function (result) {
                            log.debug('ManageCagesController.create ' +
                                'POST /api-v2/cage result:', result);
                            // Successful so add the new cage to the
                            // current cages list, after setting the route-name
                            // and color according the current route-id.
                            // Note that the 'result' contains the created
                            // cage-id.
                            var route =
                                $filter('filter')(
                                    $scope.routes, {'id': result.route}
                                )[0];
                            result.route_name = route.name;
                            result.color = route.color;
                            $scope.cages.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageCagesController.create ' +
                                'POST /api-v2/cage error:', err);
                            // Failed so drop the new cage.
                        });
                });
        };

        $scope.update = function ($event, cage) {
            log.debug('ManageCagesController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.cage = angular.copy(cage);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/cage_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.cage.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageCagesController.update ' +
                        'POST /api-v2/cage/id/%s data:',
                        $scope.cage.id, $scope.cage);
                    $http.post('/api-v2/cage/id/' + $scope.cage.id,
                        $scope.cage)
                        .success(function (result) {
                            log.debug('ManageCagesController.update ' +
                                'POST /api-v2/cage/id/%s result:',
                                $scope.cage.id, result);
                            // Successful so save the updated cage to the
                            // current cages list, after setting the route-name
                            // and color according the current route-id.
                            if ($scope.cage.route) {
                                var route =
                                    $filter('filter')(
                                        $scope.routes, {'id': $scope.cage.route}
                                    )[0];
                                $scope.cage.route_name = route.name;
                                $scope.cage.color = route.color;
                            }
                            var index = $scope.cages.indexOf(cage);
                            $scope.cages[index] = $scope.cage;
                        })
                        .catch(function (err) {
                            log.debug('ManageCagesController.update ' +
                                'POST /api-v2/cage/id/%s error:',
                                $scope.cage.id, err);
                            // Failed so drop the updated cage.
                        });
                });
        };

        $scope.delete = function ($event, cage) {
            log.debug('ManageCagesController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Kooi ' + cage.name + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageCagesController.delete ' +
                        'DELETE /api-v2/cage/id/%s data:',
                        cage.id, cage);
                    $http.delete('/api-v2/cage/id/' + cage.id)
                        .success(function (result) {
                            log.debug('ManageCagesController.delete ' +
                                'DELETE /api-v2/cage/id/%s result:',
                                cage.id, result);
                            // Successful so remove the cage from the
                            // current cages list.
                            var index = $scope.cages.indexOf(cage);
                            $scope.cages.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageCagesController.delete ' +
                                'DELETE /api-v2/cage/id/%s error:',
                                cage.id, err);
                            // Failed so drop the removed cage.
                        });
                });
        };

        // $scope.update = function (animal) {
        //     log.debug('ManageCagesController.update ' +
        //         'POST /api-v2/id/' + animal.id + ' data:', animal);
        //     $http.post('/api-v2/cage/id/' + animal.id, animal)
        //         .success(function (result) {
        //             log.debug('ManageCagesController.update ' +
        //                 'POST /api-v2/id/' + animal.id + ' result:', result);
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageCagesController.update ' +
        //                 'POST /api-v2/id/' + animal.id + ' error:', err);
        //         });
        // };
        //
        // $scope.newItem = {board_position: 0};
        // $scope.create = function () {
        //     // var newItem = {
        //     //     board_position: 0
        //     // };
        //     log.debug('ManageCagesController.create ' +
        //         'POST /api-v2/cage data:', $scope.newItem);
        //     $http.post('/api-v2/cage', $scope.newItem)
        //         .success(function (result) {
        //             log.debug('ManageCagesController.create ' +
        //                 'POST /api-v2/cage result:', result);
        //             $scope.cages.push(result);
        //             $scope.newItem = {board_position: 0};
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageCagesController.create ' +
        //                 'POST /api-v2/cage error:', err);
        //         });
        // };
        //
        // $scope.delete = function (cage) {
        //     var modalInfo = {
        //         title: 'Kooi ' + cage.name + ' verwijderen'
        //     };
        //     var modal = $uibModal.open({
        //         templateUrl: '/v2/window/confirm_basic.html',
        //         controller: 'BasicConfirmationController',
        //         resolve: {
        //             modalInfo: function () {
        //                 return modalInfo;
        //             }
        //         }
        //     });
        //     modal.result
        //         .then(function () {
        //             $http.delete('/api-v2/cage/id/' + cage.id)
        //                 .success(function (result) {
        //                     log.debug('ManageCagesController.delete ' +
        //                         'DELETE /api-v2/cage/id/' + cage.id +
        //                         ' result:', result);
        //                     $http.get('/api-v2/cage/')
        //                         .success(function (result) {
        //                             log.debug('ManageCagesController.delete ' +
        //                                 'GET /api-v2/cage/ result:', result);
        //                             $scope.cages = result;
        //                         })
        //                         .catch(function (err) {
        //                             log.debug('ManageCagesController.delete ' +
        //                                 'GET /api-v2/cage/ error:', err);
        //                         });
        //                 })
        //                 .catch(function (err) {
        //                     log.debug('ManageCagesController.delete ' +
        //                         'DELETE /api-v2/cage/id/' + cage.id +
        //                         ' error:', err);
        //                 });
        //         }, function () {
        //         })
        //     ;
        // };
    });

app.controller(
    'ManageMenusController',
    function ($scope, remoteLoggingService, $http, $uibModal,
              spinnerService, $filter) {
        var log = remoteLoggingService;
        // TODO: The boards should also be stored in the DB
        // TODO: Are the boards really needed/used !!! For now, they are disabled !!!
        // $scope.boards = [
        //     {id: 0, name: 'Voederbord 9u'},
        //     {id: 1, name: 'Menu Exoten'}
        // ];

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/menu/')
            .success(function (result) {
                log.debug('ManageMenusController GET /api-v2/menu/ result:', result);
                $scope.menus = result;
            })
            .catch(function (err) {
                log.debug('ManageMenusController GET /api-v2/menu/ error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/food')
            .success(function (result) {
                log.debug('ManageMenusController GET /api-v2/food result:', result);
                $scope.foods = result;
            })
            .catch(function (err) {
                log.debug('ManageMenusController GET /api-v2/food error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/animal/')
            .success(function (result) {
                log.debug('ManageMenusController GET /api-v2/animal/ result:', result);
                $scope.animals = result;
            })
            .catch(function (err) {
                log.debug('ManageMenusController GET /api-v2/animal/ error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.create = function ($event, animal) {
            log.debug('ManageMenusController.create:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            $scope.menu = {};
            if (animal)
                $scope.menu.animal = animal;
            var modal = $uibModal.open({
                templateUrl: '/v2/config/menu_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        log.debug('ManageMenusController.create ok:', $scope.menu);
                        if ($scope.menu.animal && $scope.menu.food &&
                            $scope.menu.quantity > 0 &&
                            $scope.menu.each > 0)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new menu to the DB.
                    log.debug('ManageMenusController.create ' +
                        'POST /api-v2/menu data:', $scope.menu);
                    $http.post('/api-v2/menu', $scope.menu)
                        .success(function (result) {
                            log.debug('ManageMenusController.create ' +
                                'POST /api-v2/menu result:', result);
                            // Successful so add the new menu to the current
                            // menus list, after setting the animal- and food-
                            // name according the current animal- and food-id.
                            // Note that the 'result' contains the created
                            // menu-id.
                            result.animal_name =
                                $filter('filter')(
                                    $scope.animals, {'id': result.animal}
                                )[0].name;
                            result.food_name =
                                $filter('filter')(
                                    $scope.foods, {'id': result.food}
                                )[0].name;
                            $scope.menus.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageMenusController.create ' +
                                'POST /api-v2/menu error:', err);
                            // Failed so drop the new menu.
                        });
                });
        };

        $scope.update = function ($event, menu) {
            log.debug('ManageMenusController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.menu = angular.copy(menu);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/menu_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        log.debug(
                            'ManageMenusController.update ok:', $scope.menu);
                        if ($scope.menu.animal && $scope.menu.food &&
                            $scope.menu.quantity > 0 &&
                            $scope.menu.each > 0)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageMenusController.update ' +
                        'POST /api-v2/menu/id/%s data:',
                        $scope.menu.id, $scope.menu);
                    $http.post('/api-v2/menu/id/' + $scope.menu.id,
                        $scope.menu)
                        .success(function (result) {
                            log.debug('ManageMenusController.update ' +
                                'POST /api-v2/menu/id/%s result:',
                                $scope.menu.id, result);
                            // Successful so save the updated menu to the
                            // current menus list, after setting the animal-
                            // and food-name according the current animal-
                            // and food-id.
                            var index = $scope.menus.indexOf(menu);
                            $scope.menus[index] = $scope.menu;
                        })
                        .catch(function (err) {
                            log.debug('ManageMenusController.update ' +
                                'POST /api-v2/menu/id/%s error:',
                                $scope.menu.id, err);
                            // Failed so drop the updated menu.
                        });
                });
        };

        $scope.delete = function ($event, menu) {
            log.debug('ManageMenusController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Voedsel ' + menu.food_name + ' van het ' +
                menu.animal_name + ' menu verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageMenusController.delete ' +
                        'DELETE /api-v2/menu/id/%s data:',
                        menu.id, menu);
                    $http.delete('/api-v2/menu/id/' + menu.id)
                        .success(function (result) {
                            log.debug('ManageMenusController.delete ' +
                                'DELETE /api-v2/menu/id/%s result:',
                                menu.id, result);
                            // Successful so remove the menu from the
                            // current menus list.
                            var index = $scope.menus.indexOf(menu);
                            $scope.menus.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageMenusController.delete ' +
                                'DELETE /api-v2/menu/id/%s error:',
                                menu.id, err);
                            // Failed so drop the removed menu.
                        });
                });
        };


        //
        //
        // $scope.animal = 0;
        //
        // $scope.$watch('animal', function (n, o) {
        //     $http.get('/api-v2/menu/animal/' + $scope.animal)
        //         .success(function (result) {
        //             log.debug('ManageMenusController.$watch GET /api-v2/menu/animal/' + $scope.animal + ' result:', result);
        //             $scope.diet = result;
        //         });
        // });
        //
        // $scope.update = function (diet) {
        //     log.debug('ManageMenusController.update POST /api-v2/menu/id/' + diet.id + ' data:', diet);
        //     $http.post('/api-v2/menu/id/' + diet.id, diet)
        //         .success(function (result) {
        //             log.debug('ManageMenusController.update POST /api-v2/menu/id/' + diet.id + ' result:', result);
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageMenusController.update POST /api-v2/menu/id/' + diet.id + ' error:', err);
        //         });
        // };
        //
        // $scope.newItem = {
        //     animal: $scope.animal,
        //     quantity: 1,
        //     each: 1
        // };
        // $scope.create = function () {
        //     log.debug('ManageMenusController.create POST /api-v2/menu data:', $scope.newItem);
        //     $http.post('/api-v2/menu', $scope.newItem)
        //         .success(function (result) {
        //             log.debug('ManageMenusController.create POST /api-v2/menu result:', result);
        //             $scope.diet.push(result);
        //             $scope.newItem = {
        //                 animal: $scope.animal,
        //                 quantity: 1,
        //                 each: 1
        //             };
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageMenusController.create POST /api-v2/menu error:', err);
        //         });
        // };
        //
        // $scope.delete = function (diet) {
        //     var modalInfo = {
        //         title: 'Diëet item verwijderen'
        //     };
        //     var modal = $uibModal.open({
        //         templateUrl: '/v2/window/confirm_basic.html',
        //         controller: 'BasicConfirmationController',
        //         resolve: {
        //             modalInfo: function () {
        //                 return modalInfo;
        //             }
        //         }
        //     });
        //     modal.result
        //         .then(function () {
        //             $http.delete('/api-v2/menu/id/' + diet.id)
        //                 .success(function (result) {
        //                     log.debug('ManageMenusController.delete DELETE /api-v2/menu/id/' + diet.id + ' result:', result);
        //                     $http.get('/api-v2/menu/animal/' + $scope.animal)
        //                         .success(function (result) {
        //                             log.debug('ManageMenusController.delete GET /api-v2/menu/animal/' + $scope.animal + ' result:', result);
        //                             $scope.diet = result;
        //                         })
        //                         .catch(function (err) {
        //                             log.debug('ManageMenusController.delete GET /api-v2/menu/animal/' + $scope.animal + ' error:', err);
        //                         });
        //                 })
        //                 .catch(function (err) {
        //                     log.debug('ManageMenusController.delete DELETE /api-v2/menu/id/' + diet.id + ' error:', err);
        //                 });
        //         }, function () {
        //
        //         });
        // };
    });

app.controller(
    'ManageFoodsController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/measure/')
            .success(function (result) {
                log.debug('ManageFoodsController ' +
                    'GET /api-v2/measure/ result:', result);
                $scope.measures = result;
            })
            .catch(function (err) {
                log.debug('ManageFoodsController ' +
                    'GET /api-v2/measure/ error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });
        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/food')
            .success(function (result) {
                log.debug('ManageFoodsController ' +
                    'GET /api-v2/food result:', result);
                $scope.foods = result;
            })
            .catch(function (err) {
                log.debug('ManageFoodsController ' +
                    'GET /api-v2/food error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });


        $scope.create = function ($event) {
            log.debug('ManageFoodsController.create:', arguments);
            $scope.food = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/food_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.food.name && $scope.food.feeding_measure)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new food to the DB.
                    log.debug('ManageFoodsController.create ' +
                        'POST /api-v2/food data:', $scope.food);
                    $http.post('/api-v2/food', $scope.food)
                        .success(function (result) {
                            log.debug('ManageFoodsController.create ' +
                                'POST /api-v2/food result:', result);
                            // Successful so add the new food to the
                            // current foods list.
                            $scope.foods.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageFoodsController.create ' +
                                'POST /api-v2/food error:', err);
                            // Failed so drop the new food.
                        });
                });
        };

        $scope.update = function ($event, food) {
            log.debug('ManageFoodsController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.food = angular.copy(food);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/food_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.food.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageFoodsController.update ' +
                        'POST /api-v2/food/id/%s data:',
                        $scope.food.id, $scope.food);
                    $http.post('/api-v2/food/id/' + $scope.food.id,
                        $scope.food)
                        .success(function (result) {
                            log.debug('ManageFoodsController.update ' +
                                'POST /api-v2/food/id/%s result:',
                                $scope.food.id, result);
                            // Successful so save the updated food to the
                            // current foods list.
                            var index = $scope.foods.indexOf(food);
                            $scope.foods[index] = $scope.food;
                        })
                        .catch(function (err) {
                            log.debug('ManageFoodsController.update ' +
                                'POST /api-v2/food/id/%s error:',
                                $scope.food.id, err);
                            // Failed so drop the updated food.
                        });
                });
        };

        $scope.delete = function ($event, food) {
            log.debug('ManageFoodsController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Voeder-product ' + food.name + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageFoodsController.delete ' +
                        'DELETE /api-v2/food/id/%s data:',
                        food.id, food);
                    $http.delete('/api-v2/food/id/' + food.id)
                        .success(function (result) {
                            log.debug('ManageFoodsController.delete ' +
                                'DELETE /api-v2/food/id/%s result:',
                                food.id, result);
                            // Successful so remove the food from the
                            // current foods list.
                            var index = $scope.foods.indexOf(food);
                            $scope.foods.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageFoodsController.delete ' +
                                'DELETE /api-v2/food/id/%s error:',
                                food.id, err);
                            // Failed so drop the removed food.
                        });
                });
        };

        // $scope.newItem = {
        //     feeding_measure: 1,
        //     extra_quantity: 0
        // };
        // $scope.create = function () {
        //     log.debug('ManageFoodsController.create POST /api-v2/food data:', $scope.newItem);
        //     $http.post('/api-v2/food', $scope.newItem)
        //         .success(function (result) {
        //             log.debug('ManageFoodsController.create POST /api-v2/food result:', result);
        //             $scope.foods.push(result);
        //             $scope.newItem = {
        //                 feeding_measure: 1,
        //                 extra_quantity: 0
        //             };
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageFoodsController.create POST /api-v2/food error:', err);
        //         });
        // };
        //
        // $scope.update = function (food) {
        //     log.debug('ManageFoodsController.update POST /api-v2/food/id/' + food.id + ' data:', food);
        //     $http.post('/api-v2/food/id/' + food.id, food)
        //         .success(function (result) {
        //             log.debug('ManageFoodsController.update POST /api-v2/food/id/' + food.id + ' result:', result);
        //         })
        //         .catch(function (err) {
        //             log.debug('ManageFoodsController.update POST /api-v2/food/id/' + food.id + ' error:', err);
        //         });
        // };
        //
        // $scope.delete = function (food) {
        //     var modalInfo = {
        //         title: 'Voeder-product ' + food.name + ' verwijderen'
        //     };
        //     var modal = $uibModal.open({
        //         templateUrl: '/v2/window/confirm_basic.html',
        //         controller: 'BasicConfirmationController',
        //         resolve: {
        //             modalInfo: function () {
        //                 return modalInfo;
        //             }
        //         }
        //     });
        //     modal.result
        //         .then(function () {
        //             $http.delete('/api-v2/food/id/' + food.id)
        //                 .success(function (result) {
        //                     log.debug('ManageFoodsController.delete DELETE /api-v2/food/id/' + food.id + ' result:', result);
        //                     $http.get('/api-v2/food/')
        //                         .success(function (result) {
        //                             log.debug('ManageFoodsController.delete GET /api-v2/food/ result:', result);
        //                             $scope.foods = result;
        //                         })
        //                         .catch(function (err) {
        //                             log.debug('ManageFoodsController.delete GET /api-v2/food/ error:', err);
        //                         });
        //                 })
        //                 .catch(function (err) {
        //                     log.debug('ManageFoodsController.delete DELETE /api-v2/food/id/' + food.id + ' error:', err);
        //                 });
        //         }, function () {
        //
        //         });
        // };
    });

app.controller(
    'ManageMeasuresController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/measure')
            .success(function (result) {
                log.debug('ManageMeasuresController ' +
                    'GET /api-v2/measure result:', result);
                $scope.measures = result;
            })
            .catch(function (err) {
                log.debug('ManageMeasuresController ' +
                    'GET /api-v2/measure error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.create = function ($event) {
            log.debug('ManageMeasuresController.create:', arguments);
            $scope.measure = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/measure_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.measure.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new measure to the DB.
                    log.debug('ManageMeasuresController.create ' +
                        'POST /api-v2/measure data:', $scope.measure);
                    $http.post('/api-v2/measure', $scope.measure)
                        .success(function (result) {
                            log.debug('ManageMeasuresController.create ' +
                                'POST /api-v2/measure result:', result);
                            // Successful so add the new measure to the
                            // current measures list.
                            $scope.measures.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageMeasuresController.create ' +
                                'POST /api-v2/measure error:', err);
                            // Failed so drop the new measure.
                        });
                });
        };

        $scope.update = function ($event, measure) {
            log.debug('ManageMeasuresController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.measure = angular.copy(measure);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/measure_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.measure.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageMeasuresController.update ' +
                        'POST /api-v2/measure/id/%s data:',
                        $scope.measure.id, $scope.measure);
                    $http.post('/api-v2/measure/id/' + $scope.measure.id,
                        $scope.measure)
                        .success(function (result) {
                            log.debug('ManageMeasuresController.update ' +
                                'POST /api-v2/measure/id/%s result:',
                                $scope.measure.id, result);
                            // Successful so save the updated measure to the
                            // current measures list.
                            var index = $scope.measures.indexOf(measure);
                            $scope.measures[index] = $scope.measure;
                        })
                        .catch(function (err) {
                            log.debug('ManageMeasuresController.update ' +
                                'POST /api-v2/measure/id/%s error:',
                                $scope.measure.id, err);
                            // Failed so drop the updated measure.
                        });
                });
        };

        $scope.delete = function ($event, measure) {
            log.debug('ManageMeasuresController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Eenheidsmaat ' + measure.name + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageMeasuresController.delete ' +
                        'DELETE /api-v2/measure/id/%s data:',
                        measure.id, measure);
                    $http.delete('/api-v2/measure/id/' + measure.id)
                        .success(function (result) {
                            log.debug('ManageMeasuresController.delete ' +
                                'DELETE /api-v2/measure/id/%s result:',
                                measure.id, result);
                            // Successful so remove the measure from the
                            // current measures list.
                            var index = $scope.measures.indexOf(measure);
                            $scope.measures.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageMeasuresController.delete ' +
                                'DELETE /api-v2/measure/id/%s error:',
                                measure.id, err);
                            // Failed so drop the removed measure.
                        });
                });
        };

    });

app.controller(
    'ManagePrepareCategoriesController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/preparecategory')
            .success(function (result) {
                log.debug('ManagePrepareCategoriesController ' +
                    'GET /api-v2/preparecategory result:', result);
                $scope.prepare_categories = result;
            })
            .catch(function (err) {
                log.debug('ManagePrepareCategoriesController ' +
                    'GET /api-v2/preparecategory error:', err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.create = function ($event) {
            log.debug('ManagePrepareCategoriesController.create:', arguments);
            $scope.prepare_category = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/prepare_category_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.prepare_category.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new prepare_category to the DB.
                    log.debug('ManagePrepareCategoriesController.create ' +
                        'POST /api-v2/preparecategory data:',
                        $scope.prepare_category);
                    $http.post('/api-v2/preparecategory',
                        $scope.prepare_category)
                        .success(function (result) {
                            log.debug(
                                'ManagePrepareCategoriesController.create ' +
                                'POST /api-v2/preparecategory result:', result);
                            // Successful so add the new prepare_category to
                            // the current prepare_categories list.
                            $scope.prepare_categories.push(result);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManagePrepareCategoriesController.create ' +
                                'POST /api-v2/preparecategory error:', err);
                            // Failed so drop the new prepare_category.
                        });
                });
        };

        $scope.update = function ($event, prepare_category) {
            log.debug('ManagePrepareCategoriesController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.prepare_category = angular.copy(prepare_category);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/prepare_category_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.prepare_category.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManagePrepareCategoriesController.update ' +
                        'POST /api-v2/preparecategory/id/%s data:',
                        $scope.prepare_category.id, $scope.prepare_category);
                    $http.post('/api-v2/preparecategory/id/' +
                        $scope.prepare_category.id, $scope.prepare_category)
                        .success(function (result) {
                            log.debug(
                                'ManagePrepareCategoriesController.update ' +
                                'POST /api-v2/preparecategory/id/%s result:',
                                $scope.prepare_category.id, result);
                            // Successful so save the updated prepare_category
                            // to the current prepare_categories list.
                            var index = $scope.prepare_categories
                                .indexOf(prepare_category);
                            $scope.prepare_categories[index] =
                                $scope.prepare_category;
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManagePrepareCategoriesController.update ' +
                                'POST /api-v2/preparecategory/id/%s error:',
                                $scope.prepare_category.id, err);
                            // Failed so drop the updated prepare_category.
                        });
                });
        };

        $scope.delete = function ($event, prepare_category) {
            log.debug('ManagePrepareCategoriesController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Bereidingscategorie ' + prepare_category.name +
                ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManagePrepareCategoriesController.delete ' +
                        'DELETE /api-v2/preparecategory/id/%s data:',
                        prepare_category.id, prepare_category);
                    $http.delete('/api-v2/preparecategory/id/' +
                        prepare_category.id)
                        .success(function (result) {
                            log.debug(
                                'ManagePrepareCategoriesController.delete ' +
                                'DELETE /api-v2/preparecategory/id/%s result:',
                                prepare_category.id, result);
                            // Successful so remove the prepare_category from
                            // the current prepare_categories list.
                            var index = $scope.prepare_categories
                                .indexOf(prepare_category);
                            $scope.prepare_categories.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManagePrepareCategoriesController.delete ' +
                                'DELETE /api-v2/preparecategory/id/%s error:',
                                prepare_category.id, err);
                            // Failed so drop the removed prepare_category.
                        });
                });
        };

    });


app.controller(
    'ManageRoutesController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;
        // TODO: There should be only 1 color-picker-options object for entire app.
        $scope.colorPickerOptions = {
            preferredFormat: 'rgb',
            chooseText: 'OK',
            cancelText: 'Annuleren',
            showInput: true,
            showInitial: true,
            // color: "rgb(0, 0, 0)",
            showPalette: true,
            palette: [
                ['#000', '#444', '#666', '#999',
                    '#ccc', '#eee', '#f3f3f3', '#fff'],
                ['#f00', '#f90', '#ff0', '#0f0',
                    '#0ff', '#00f', '#90f', '#f0f'],
                ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3',
                    '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
                ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8',
                    '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
                ['#e06666', '#f6b26b', '#ffd966', '#93c47d',
                    '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
                ['#c00', '#e69138', '#f1c232', '#6aa84f',
                    '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
                ['#900', '#b45f06', '#bf9000', '#38761d',
                    '#134f5c', '#0b5394', '#351c75', '#741b47'],
                ['#600', '#783f04', '#7f6000', '#274e13',
                    '#0c343d', '#073763', '#20124d', '#4c1130']
            ],
            showSelectionPalette: true,
            maxSelectionSize: 8,
            localStorageKey: 'selectedUIColors',
            replacerClassName: 'colorpicker-replacer',
            containerClassName: 'colorpicker-container'
        };

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/route/')
            .success(function (result) {
                log.debug('ManageRoutesController GET /api-v2/route/ result:',
                    result);
                $scope.routes = result;
            })
            .catch(function (err) {
                log.debug('ManageRoutesController GET /api-v2/route/ error:',
                    err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.create = function ($event) {
            log.debug('ManageRoutesController.create:', arguments);
            $scope.route = {color: "rgb(0,0,0)"};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/route_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.route.name && $scope.route.color)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new route to the DB.
                    log.debug('ManageRoutesController.create ' +
                        'POST /api-v2/route data:', $scope.route);
                    $http.post('/api-v2/route', $scope.route)
                        .success(function (result) {
                            log.debug('ManageRoutesController.create ' +
                                'POST /api-v2/route result:', result);
                            // Successful so add the new route to the
                            // current routes list.
                            $scope.routes.push(result);
                        })
                        .catch(function (err) {
                            log.debug('ManageRoutesController.create ' +
                                'POST /api-v2/route error:', err);
                            // Failed so drop the new route.
                        });
                });
        };

        $scope.update = function ($event, route) {
            log.debug('ManageRoutesController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.route = angular.copy(route);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/route_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.route.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageRoutesController.update ' +
                        'POST /api-v2/route/id/%s data:',
                        $scope.route.id, $scope.route);
                    $http.post('/api-v2/route/id/' + $scope.route.id,
                        $scope.route)
                        .success(function (result) {
                            log.debug('ManageRoutesController.update ' +
                                'POST /api-v2/route/id/%s result:',
                                $scope.route.id, result);
                            // Successful so save the updated route to the
                            // current routes list.
                            var index = $scope.routes.indexOf(route);
                            $scope.routes[index] = $scope.route;
                        })
                        .catch(function (err) {
                            log.debug('ManageRoutesController.update ' +
                                'POST /api-v2/route/id/%s error:',
                                $scope.route.id, err);
                            // Failed so drop the updated route.
                        });
                });
        };

        $scope.delete = function ($event, route) {
            log.debug('ManageRoutesController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: 'Route ' + route.name + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageRoutesController.delete ' +
                        'DELETE /api-v2/route/id/%s data:',
                        route.id, route);
                    $http.delete('/api-v2/route/id/' + route.id)
                        .success(function (result) {
                            log.debug('ManageRoutesController.delete ' +
                                'DELETE /api-v2/route/id/%s result:',
                                route.id, result);
                            // Successful so remove the route from the
                            // current routes list.
                            var index = $scope.routes.indexOf(route);
                            $scope.routes.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug('ManageRoutesController.delete ' +
                                'DELETE /api-v2/route/id/%s error:',
                                route.id, err);
                            // Failed so drop the removed route.
                        });
                });
        };

    });

app.controller(
    'ManageEntranceReasonsController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/entrancereason/')
            .success(function (result) {
                log.debug('ManageEntranceReasonsController ' +
                    'GET /api-v2/entrancereason/ result:',
                    result);
                $scope.entrance_reasons = result;
            })
            .catch(function (err) {
                log.debug('ManageEntranceReasonsController ' +
                    'GET /api-v2/entrancereason/ error:',
                    err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.enable = function ($event, entrance_reason) {
            log.debug('ManageEntranceReasonsController.enable:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: (entrance_reason.standard ?
                    'Standard reden ' : 'Reden ') + entrance_reason.name +
                ' deblokkeren'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    entrance_reason.enabled = true;
                });
        };

        $scope.create = function ($event) {
            log.debug('ManageEntranceReasonsController.create:', arguments);
            $scope.entrance_reason = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/entrance_reason_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.entrance_reason.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new entrance_reason to the DB.
                    log.debug('ManageEntranceReasonsController.create ' +
                        'POST /api-v2/entrancereason/ data:',
                        $scope.entrance_reason);
                    $http.post('/api-v2/entrancereason/',
                        $scope.entrance_reason)
                        .success(function (result) {
                            log.debug(
                                'ManageEntranceReasonsController.create ' +
                                'POST /api-v2/entrancereason/ result:', result);
                            // Successful so add the new entrance_reason to the
                            // current entrance_reasons list.
                            $scope.entrance_reasons.push(result);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageEntranceReasonsController.create ' +
                                'POST /api-v2/entrancereason/ error:', err);
                            // Failed so drop the new entrance_reason.
                        });
                });
        };

        $scope.update = function ($event, entrance_reason) {
            log.debug('ManageEntranceReasonsController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.entrance_reason = angular.copy(entrance_reason);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/entrance_reason_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.entrance_reason.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageEntranceReasonsController.update ' +
                        'POST /api-v2/entrancereason/id/%s data:',
                        $scope.entrance_reason.id, $scope.entrance_reason);
                    $http.post('/api-v2/entrancereason/id/' +
                        $scope.entrance_reason.id, $scope.entrance_reason)
                        .success(function (result) {
                            log.debug(
                                'ManageEntranceReasonsController.update ' +
                                'POST /api-v2/entrancereason/id/%s result:',
                                $scope.entrance_reason.id, result);
                            // Successful so save the updated entrance_reason
                            // to the current entrance_reasons list.
                            var index = $scope.entrance_reasons
                                .indexOf(entrance_reason);
                            $scope.entrance_reasons[index] =
                                $scope.entrance_reason;
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageEntranceReasonsController.update ' +
                                'POST /api-v2/entrancereason/id/%s error:',
                                $scope.entrance_reason.id, err);
                            // Failed so drop the updated entrance_reason.
                        });
                });
        };

        $scope.delete = function ($event, entrance_reason) {
            log.debug('ManageEntranceReasonsController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: (entrance_reason.standard ?
                    'Standard reden ' : 'Reden ') + entrance_reason.name +
                ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageEntranceReasonsController.delete ' +
                        'DELETE /api-v2/entrancereason/id/%s data:',
                        entrance_reason.id, entrance_reason);
                    $http.delete('/api-v2/entrancereason/id/' +
                        entrance_reason.id)
                        .success(function (result) {
                            log.debug(
                                'ManageEntranceReasonsController.delete ' +
                                'DELETE /api-v2/entrancereason/id/%s result:',
                                entrance_reason.id, result);
                            // Successful so remove the entrance_reason from the
                            // current entrance_reasons list.
                            var index = $scope.entrance_reasons
                                .indexOf(entrance_reason);
                            $scope.entrance_reasons.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageEntranceReasonsController.delete ' +
                                'DELETE /api-v2/entrancereason/id/%s error:',
                                entrance_reason.id, err);
                            // Failed so drop the removed entrance_reason.
                        });
                });
        };

    });

app.controller(
    'ManageExitReasonsController',
    function ($scope, remoteLoggingService, $http, $uibModal, spinnerService) {
        var log = remoteLoggingService;

        spinnerService.taskStart('nhcActionBarSpinner');
        $http.get('/api-v2/exitreason/')
            .success(function (result) {
                log.debug('ManageExitReasonsController ' +
                    'GET /api-v2/exitreason/ result:',
                    result);
                $scope.exit_reasons = result;
            })
            .catch(function (err) {
                log.debug('ManageExitReasonsController ' +
                    'GET /api-v2/exitreason/ error:',
                    err);
            })
            .finally(function () {
                spinnerService.taskStop('nhcActionBarSpinner');
            });

        $scope.enable = function ($event, exit_reason) {
            log.debug('ManageExitReasonsController.enable:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: (exit_reason.standard ?
                    'Standard reden ' : 'Reden ') + exit_reason.name +
                ' deblokkeren'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    exit_reason.enabled = true;
                });
        };

        $scope.create = function ($event) {
            log.debug('ManageExitReasonsController.create:', arguments);
            $scope.exit_reason = {};
            var modal = $uibModal.open({
                templateUrl: '/v2/config/exit_reason_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.exit_reason.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the new exit_reason to the DB.
                    log.debug('ManageExitReasonsController.create ' +
                        'POST /api-v2/exitreason/ data:',
                        $scope.exit_reason);
                    $http.post('/api-v2/exitreason/',
                        $scope.exit_reason)
                        .success(function (result) {
                            log.debug(
                                'ManageExitReasonsController.create ' +
                                'POST /api-v2/exitreason/ result:', result);
                            // Successful so add the new exit_reason to the
                            // current exit_reasons list.
                            $scope.exit_reasons.push(result);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageExitReasonsController.create ' +
                                'POST /api-v2/exitreason/ error:', err);
                            // Failed so drop the new exit_reason.
                        });
                });
        };

        $scope.update = function ($event, exit_reason) {
            log.debug('ManageExitReasonsController.update:', arguments);
            // Create an intermediate copy to capture the performed changes.
            // Only when the changes are confirmed, the intermediate data is
            // saved.
            $scope.exit_reason = angular.copy(exit_reason);
            var modal = $uibModal.open({
                templateUrl: '/v2/config/exit_reason_modal.html',
                scope: $scope,
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if ($scope.exit_reason.name)
                            modal.close();
                    };
                    $scope.cancel = function () {
                        modal.dismiss();
                    };
                }
            });
            modal.result
                .then(function () {
                    // Save the changed intermediate data to the DB.
                    log.debug('ManageExitReasonsController.update ' +
                        'POST /api-v2/exitreason/id/%s data:',
                        $scope.exit_reason.id, $scope.exit_reason);
                    $http.post('/api-v2/exitreason/id/' +
                        $scope.exit_reason.id, $scope.exit_reason)
                        .success(function (result) {
                            log.debug(
                                'ManageExitReasonsController.update ' +
                                'POST /api-v2/exitreason/id/%s result:',
                                $scope.exit_reason.id, result);
                            // Successful so save the updated exit_reason
                            // to the current exit_reasons list.
                            var index = $scope.exit_reasons
                                .indexOf(exit_reason);
                            $scope.exit_reasons[index] =
                                $scope.exit_reason;
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageExitReasonsController.update ' +
                                'POST /api-v2/exitreason/id/%s error:',
                                $scope.exit_reason.id, err);
                            // Failed so drop the updated exit_reason.
                        });
                });
        };

        $scope.delete = function ($event, exit_reason) {
            log.debug('ManageExitReasonsController.delete:', arguments);
            $event.stopPropagation();
            $event.preventDefault();

            var modalInfo = {
                title: (exit_reason.standard ?
                    'Standard reden ' : 'Reden ') + exit_reason.name +
                ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    log.debug('ManageExitReasonsController.delete ' +
                        'DELETE /api-v2/exitreason/id/%s data:',
                        exit_reason.id, exit_reason);
                    $http.delete('/api-v2/exitreason/id/' +
                        exit_reason.id)
                        .success(function (result) {
                            log.debug(
                                'ManageExitReasonsController.delete ' +
                                'DELETE /api-v2/exitreason/id/%s result:',
                                exit_reason.id, result);
                            // Successful so remove the exit_reason from the
                            // current exit_reasons list.
                            var index = $scope.exit_reasons
                                .indexOf(exit_reason);
                            $scope.exit_reasons.splice(index, 1);
                        })
                        .catch(function (err) {
                            log.debug(
                                'ManageExitReasonsController.delete ' +
                                'DELETE /api-v2/exitreason/id/%s error:',
                                exit_reason.id, err);
                            // Failed so drop the removed exit_reason.
                        });
                });
        };

    });

app.controller(
    'PreferencesController',
    function ($scope, $http, $uibModal, $window, $document, $timeout,
              remoteLoggingService, preferencesService) {
        var log = remoteLoggingService;

        $scope.selectedBranch = null;
        // For now, set the scrollable table 'watched' appData
        // to the entire scope.
        $scope.appData = $scope;

        // Tree-Control API: Pass an empty object to the tree as "tree-control"
        // and it will be populated with a set of functions for navigating and
        // controlling the tree.
        var tree = $scope.treeController = {};

        tree.toggle_branch = function (b) {
            if (b === null)
                b = tree.get_selected_branch();
            if (b !== null) {
                b.expanded = !b.expanded;
                return b;
            }
        };

        function prefs2navtree(prefs) {
            // All 'children' objects need to be converted to a list i.e.
            // remove the keys-names. In order to preserve the key-names,
            // they are moved to the 'data' object of the child.
            Object.keys(prefs).forEach(function (key, index) {
                if (!prefs[key].hasOwnProperty('data'))
                    prefs[key].data = {};
                prefs[key].data.name = key;
                if (prefs[key].hasOwnProperty('children'))
                    prefs[key].children = prefs2navtree(prefs[key].children);
            });
            return Object.keys(prefs).map(function (key) {
                return prefs[key];
            });
        }

        function load() {
            var prefBranch = '/';
            preferencesService.get(prefBranch)
                .then(function (result) {
                    log.debug(
                        'PreferencesController get preferences %s result:',
                        prefBranch, result);
                    $scope.preferences = result;
                    // // Get the preference(s) applicable to this controller
                    // $scope.automaticUpdateDebounceTime =
                    //     $scope.preferences.children.system.children.fineTuning
                    //         .children.automaticUpdateDebounceTime.data.value;
                    applyPreferences();
                    // Create a deep copy for the navigation tree in order to
                    // keep the preferences clean, as the navigation tree data
                    // gets polluted with all kinds of navigation data.
                    // Additionally, for the navigation tree the 'children'
                    // need to be lists i.s.o. objects.
                    $scope.treeData =
                        prefs2navtree(angular.copy(result.children));
                    // After loading the tree data, expand all
                    $timeout(function () {
                        tree.expand_all();
                    });
                })
                .catch(function (err) {
                    log.debug(
                        'PreferencesController get preferences %s error:',
                        prefBranch, err);
                });
        }

        function applyPreferences() {
            // Get the preference(s) applicable to this controller
            $scope.automaticUpdateDebounceTime =
                $scope.preferences.children.system.children.fineTuning
                    .children.automaticUpdateDebounceTime.data.value;
            // Unfortunately, the ngModelOptions expression is only evaluated
            // once when the directive is linked; it is not watched for changes.
            // This means that the automaticUpdateDebounceTime is not applied
            // while editing it, but it will be as soon as you navigate away.

            // The following is an attempt to solve this problem.
            // TODO: ngModelController.$options vs. ngModelController.$overrideModelOptions()

            // for now, directly update ngModelController.$options e.g.
            //     ngModelController.$options = {
            //         updateOn: 'blur',
            //         updateOnDefault: true,
            //         debounce: {
            //             'blur': 2000,
            //             'default': 3000
            //         }
            //     };

            // but for 1.6+,
            // use function ngModelController.$overrideModelOptions e.g.
            //     ngModelController.$overrideModelOptions({
            //         updateOn: 'blur',
            //         updateOn: 'default',
            //         debounce:= {
            //             'blur': 2000,
            //             'default': 3000
            //         }
            //     });
            if ($scope.appform.number) {
                // log.debug('>>>>>', $scope.appform.number);
                $scope.appform.number.$options.debounce.default =
                    $scope.automaticUpdateDebounceTime;
            }
        }

        $scope.treeData = [];
        load();

        $scope.colorPickerOptions = {
            preferredFormat: 'rgb',
            chooseText: 'OK',
            cancelText: 'Annuleren',
            showInput: true,
            showInitial: true,
            // color: "rgb(0, 0, 0)",
            showPalette: true,
            palette: [
                ['#000', '#444', '#666', '#999',
                    '#ccc', '#eee', '#f3f3f3', '#fff'],
                ['#f00', '#f90', '#ff0', '#0f0',
                    '#0ff', '#00f', '#90f', '#f0f'],
                ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3',
                    '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
                ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8',
                    '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
                ['#e06666', '#f6b26b', '#ffd966', '#93c47d',
                    '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
                ['#c00', '#e69138', '#f1c232', '#6aa84f',
                    '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
                ['#900', '#b45f06', '#bf9000', '#38761d',
                    '#134f5c', '#0b5394', '#351c75', '#741b47'],
                ['#600', '#783f04', '#7f6000', '#274e13',
                    '#0c343d', '#073763', '#20124d', '#4c1130']
            ],
            showSelectionPalette: true,
            maxSelectionSize: 8,
            localStorageKey: 'selectedUIColors',
            replacerClassName: 'colorpicker-replacer',
            containerClassName: 'colorpicker-container'
        };

        $scope.factoryReset = function () {
            log.debug('PreferencesController.factoryReset');
            // Delete all custom preferences from the DB 
            preferencesService.delete()
                .then(function (result) {
                    log.debug('PreferencesController delete preferences ' +
                        'result:', result);
                    // Successful, so delete the currently loaded, but outdated
                    // preferences, including the derived nav-tree.
                    $scope.selectedBranch = null;
                    $scope.treeData = [];
                    $scope.preferences = null;
                    // Now, load the factory default preferences
                    load();
                })
                .catch(function (err) {
                    log.debug('PreferencesController delete preferences ' +
                        'error:', err);
                });
        };

        $scope.onBranchSelect = function (branch) {
            log.debug('PreferencesController.onBranchSelect:', branch);

            // The newly selected branch will be shown in the form, so the form
            // should be regarded as pristine and untouched again.
            $scope.appform.$setPristine();
            $scope.appform.$setUntouched();

            if (branch.classes.indexOf('leaf') < 0) {
                tree.toggle_branch(branch);
                tree.select_branch();
                $scope.selectedBranch = null;
            } else {
                $scope.selectedBranch = branch;
            }

            $scope.newListItem = {};
            $scope.selectedPathLabels = [];
            $scope.selectedPathNames = [];
            while (tree.get_parent_branch(branch)) {
                branch = tree.get_parent_branch(branch);
                $scope.selectedPathLabels.unshift(branch.label);
                $scope.selectedPathNames.unshift(branch.data.name);
            }
        };

        $scope.save = function () {
            // Save the value of the selected preference. Since the entire
            // pref-tree will be saved, the preference value needs to be copied
            // from the navigation tree to the current pref-tree.
            var prefBranch = $scope.preferences;
            // First traverse the pref-tree down to the direct parent
            $scope.selectedPathNames.forEach(function (name, nindex) {
                prefBranch = prefBranch.children[name];
            });
            // Now address the child and update its value
            log.debug('PreferencesController.save branch %s:',
                $scope.selectedBranch.data.name,
                $scope.selectedBranch.data.value);
            prefBranch.children[$scope.selectedBranch.data.name].data.value =
                $scope.selectedBranch.data.value;
            // Finally, save the entire pref-tree
            log.debug('PreferencesController.save:', $scope.preferences);
            preferencesService.put($scope.preferences)
                .then(function (result) {
                    log.debug('PreferencesController.save put preferences ' +
                        'result:', result);
                    // Successful, so the form  should be regarded as pristine
                    // and untouched again.
                    $scope.appform.$setPristine();
                    $scope.appform.$setUntouched();
                    // Successful, so just in case one of the applicable
                    // preferences is changed, apply the new preferences.
                    applyPreferences();
                })
                .catch(function (err) {
                    log.debug('PreferencesController.save put preferences ' +
                        'error:', err);
                    // Failed, so reload the current preferences to rollback
                    // (undo) the changes in the currently loaded preferences.
                    // First delete the currently loaded preferences,
                    // including the derived nav-tree.
                    $scope.selectedBranch = null;
                    $scope.treeData = [];
                    $scope.preferences = null;
                    // Now, load the current preferences.
                    load();
                });
        };

        $scope.onColorChange = function () {
            var branch = $scope.selectedBranch;
            var color = branch.data.value;
            log.debug('PreferencesController.onColorChange:', branch, color);

            // Get CSS custom property (variable)
            function cssCustomProperty(cssVar) {
                return $window.getComputedStyle($document[0].documentElement)
                    .getPropertyValue(cssVar);
            }

            // Separate the R, G and B values
            function color2Rgb(color) {
                return color.match(/\d+/g).slice(0, 3);
            }

            // Compare scalar arrays
            function arraysEqual(a1, a2) {
                return a1.length === a2.length && a1.every(function (v, i) {
                    return v === a2[i];
                });
            }

            var cssColorRgb = color2Rgb(cssCustomProperty(branch.data.cssVar));
            var colorRgb = color2Rgb(color);
            if (!arraysEqual(cssColorRgb, colorRgb)) {
                // The color has really been changed
                log.debug('PreferencesController.onColorChange current:',
                    cssColorRgb);
                // Update the document-style by setting
                // the R, G and B values separately
                var docStyle = $document[0].documentElement.style;
                docStyle.setProperty(branch.data.cssVar + '-r', colorRgb[0]);
                docStyle.setProperty(branch.data.cssVar + '-g', colorRgb[1]);
                docStyle.setProperty(branch.data.cssVar + '-b', colorRgb[2]);
                log.debug('PreferencesController.onColorChange result:',
                    color2Rgb(cssCustomProperty(branch.data.cssVar)));
                // Save the updated preference
                $scope.save();
            }
        };

        $scope.newListItem = {};
        $scope.createListItem =
            function (itemValue, listProperty, keyProperty) {
                var branch = $scope.selectedBranch;
                log.debug('PreferencesController.createListItem:',
                    branch, arguments);
                var list = listProperty ?
                    branch.data.value[listProperty] : branch.data.value;

                if ((// Object-list: keyProperty must be valid and unique
                        keyProperty &&
                        typeof itemValue !== 'undefined' &&
                        itemValue !== null &&
                        typeof itemValue[keyProperty] !== 'undefined' &&
                        itemValue[keyProperty] !== null &&
                        list.every(
                            function (value, index) {
                                return value[keyProperty] !==
                                    itemValue[keyProperty];
                            }
                        )) || (// OR Value-list: value must be valid and unique
                        !keyProperty &&
                        typeof itemValue !== 'undefined' &&
                        itemValue !== null &&
                        list.every(
                            function (value, index) {
                                return value !== itemValue;
                            }
                        )
                    )
                ) {
                    log.debug('PreferencesController.createListItem ' +
                        'add new item:', itemValue);
                    list.push(itemValue);
                    $scope.newListItem = {};
                    $scope.save();
                } else {
                    log.debug('PreferencesController.createListItem ' +
                        'drop new item:', itemValue);
                }
            };

        $scope.updateListItem =
            function (oldValue, newValue, listProperty, keyProperty) {
                var branch = $scope.selectedBranch;
                log.debug('PreferencesController.updateListItem:',
                    branch, arguments);
                var list = listProperty ?
                    branch.data.value[listProperty] : branch.data.value;
                var index = list.indexOf(oldValue);

                if ((// Object-list: keyProperty must be valid and unique
                        keyProperty &&
                        typeof newValue !== 'undefined' &&
                        newValue !== null &&
                        typeof newValue[keyProperty] !== 'undefined' &&
                        newValue[keyProperty] !== null &&
                        list.every(
                            function (value, lindex) {
                                return value[keyProperty] !==
                                    newValue[keyProperty] ||
                                    lindex === index;
                            }
                        )) || (// OR Value-list: value must be valid and unique
                        !keyProperty &&
                        typeof newValue !== 'undefined' &&
                        newValue !== null &&
                        list.every(
                            function (value, lindex) {
                                return value !== newValue ||
                                    lindex === index;
                            }
                        )
                    )
                ) {
                    log.debug('PreferencesController.updateListItem ' +
                        'update item:', oldValue, newValue);
                    list[index] = newValue;
                    $scope.save();

                } else if ((// Object-list: keyProperty undefined or null
                        keyProperty &&
                        (typeof newValue === 'undefined' ||
                            newValue === null ||
                            typeof newValue[keyProperty] === 'undefined' ||
                            newValue[keyProperty] === null)
                    ) || (// OR Value-list: value undefined or null
                        !keyProperty &&
                        (typeof newValue === 'undefined' ||
                            newValue === null)
                    )
                ) {
                    log.debug('PreferencesController.updateListItem ' +
                        'delete item:', oldValue);
                    list.splice(index, 1);
                    $scope.save();
                } else {
                    log.debug('PreferencesController.updateListItem ' +
                        'drop item update:', newValue);
                    // TODO: roll-back the value in the view
                }
            };

        $scope.deleteListItem = function (itemValue, listProperty) {
            var branch = $scope.selectedBranch;
            log.debug('PreferencesController.deleteListItem:',
                branch, itemValue);
            var modalInfo = {
                title: 'Van ' + branch.label + ', ' +
                angular.toJson(itemValue, false) + ' verwijderen'
                // JSON.stringify(itemValue) + ' verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    var list = listProperty ?
                        branch.data.value[listProperty] : branch.data.value;
                    var index = list.indexOf(itemValue);
                    list.splice(index, 1);
                    $scope.save();
                }, function () {
                })
            ;
        };

    });


// Tool Bar
/* global screenfull */
app.controller(
    'FullscreenController',
    function ($scope, remoteLoggingService) {
        var log = remoteLoggingService;
        log.debug('FullscreenController fullscreenEnabled:', screenfull.enabled);

        $scope.fullscreenEnabled = screenfull.enabled;

        $scope.toggleFullscreen = function () {
            log.debug('FullscreenController toggleFullscreen');
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        };
    });

app.controller(
    'ActionBarLockController',
    function ($scope, remoteLoggingService) {
        var log = remoteLoggingService;
        log.debug('ActionBarLockController');

        $scope.toggleActionBarLock = function () {
            log.debug('ActionBarLockController toggleActionBarLock');
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        };
    });

// Action Bar
app.controller(
    'NhcActionBarController',
    ['$scope', 'remoteLoggingService', 'NhcActionBar', 'borderControlService', function ($scope, remoteLoggingService, actionBar, borderControlService) {
        var log = remoteLoggingService;
        log.debug('NhcActionBarController:', actionBar, borderControlService);
        $scope.actions = actionBar.availableActions;
        $scope.locked = false;

        $scope.execute = function (action) {
            if (!$scope.locked) {
                log.debug('NhcActionBarController execute:', action);
                // var confirmTitle;
                // if (action.confirm) confirmTitle = action.title;
                borderControlService.tryAction(
                    action.action, action.role,
                    action.confirm ? action.title : null
                );
            }
        };

        $scope.toggleActionBarLock = function () {
            log.debug('NhcActionBarController toggleActionBarLock');
            $scope.locked = !$scope.locked;
        };

    }]);

// Border Control
app.controller(
    'SecurityModalController',
    ['$scope', 'remoteLoggingService', '$uibModalInstance', 'outcome', function ($scope, remoteLoggingService, $uibModalInstance, outcome) {
        var log = remoteLoggingService;
        log.debug('SecurityModalController:', $uibModalInstance, outcome);
        $scope.pin = '';

        $scope.ok = function () {
            outcome.pin = $scope.pin;
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);

app.controller(
    'CalendarController',
    function ($scope, remoteLoggingService, $http, uiCalendarConfig) {
        var log = remoteLoggingService;
        log.debug('CalendarController', uiCalendarConfig);
        $scope.calendarOptions = {
            id: 'businessCalendar',
            height: 600,
            editable: true,
            header: {
                left: 'month,agendaWeek,agendaDay',
                center: 'title',
                right: 'prev,today,next'
            },
            defaultView: 'agendaWeek',
            fixedWeekCount: false,
            weekNumberCalculation: 'ISO',
            weekNumberTitle: 'W',
            firstDay: 1,
            nowIndicator: true,
            titleFormat: 'DD MMM YYYY',
            columnFormat: 'ddd DD MMM',
            timeFormat: 'H:mm',
            slotLabelFormat: 'H:mm',
            slotDuration: '00:30:00',
            scrollTime: '07:00:00',
            slotEventOverlap: false,
            displayEventTime: true, // TODO Define pref.

            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        };

        $scope.availableEventSources = [
            {
                id: 'business-hours',
                title: 'Kantooruren',
                show: true,
                events: [
                    // dow = day of week integers (zero-based, 0=Sunday)
                    {
                        dow: [1, 2, 3, 4, 5],
                        start: '09:00',
                        end: '17:30'
                    },
                    {
                        dow: [6, 0],
                        start: '9:00',
                        end: '17:30'
                    }
                ],
                className: 'fc-nonbusiness fa fa-clock-o',
                rendering: 'inverse-background',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(215, 215, 215, .7)',
                borderColor: 'rgba(215, 215, 215, .3)'
            },
            {
                id: 'business-events',
                title: 'Zakelijk',
                show: true,
                events: function (start, end, timezone, callback) {
                    callback([{
                        title: 'Opendeurdag',
                        start: '2017-08-18T10:30',
                        end: '2017-08-18T17:30'
                    }]);
                },
                className: 'business-events fa fa-tag',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(96, 255, 96, 0.3)',
                borderColor: 'rgba(96, 255, 96, 0.7)'
            },
            {
                id: 'staff-presence',
                title: 'Personeel',
                show: true,
                events: function (start, end, timezone, callback) {
                    callback([
                        {
                            dow: '[1, 2, 3, 4]',
                            title: 'Daan',
                            start: '09:00',
                            end: '17:30'
                        },
                        {
                            dow: '[1]',
                            title: 'Pieter-Jan',
                            start: '13:00',
                            end: '17:30'
                        },
                        {
                            dow: '[2, 3, 4, 5]',
                            title: 'Pieter-Jan',
                            start: '09:00',
                            end: '17:30'
                        }
                    ]);
                },
                className: 'staff-presence fa fa-paw',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(0, 96, 192, 0.3)',
                borderColor: 'rgba(0, 96, 192, 0.7)'
            },
            {
                id: 'volunteer-presence',
                title: 'Vrijwilligers',
                show: true,
                events: function (start, end, timezone, callback) {
                    callback([
                        {
                            dow: '[1, 4]',
                            title: 'Arie',
                            start: '09:00',
                            end: '12:00'
                        }
                    ]);
                },
                className: 'volunteer-presence fa fa-leaf',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(96, 0, 96, 0.3)',
                borderColor: 'rgba(96, 0, 96, 0.7)'
            },
            {
                id: 'student-presence',
                title: 'Studenten',
                show: true,
                events: function (start, end, timezone, callback) {
                    callback([
                        {
                            dow: '[1, 3, 5]',
                            title: 'Student',
                            start: '09:00',
                            end: '17:30'
                        }
                    ]);
                },
                className: 'student-presence fa fa-graduation-cap',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(255, 96, 0, 0.3)',
                borderColor: 'rgba(255, 96, 0, 0.7)'
            },
            {
                id: 'public-holidays-belgium',
                show: true,
                title: 'Vakantie BE',
                events: function (start, end, timezone, callback) {
                    callback([{
                        title: 'Feestdag BE',
                        allDay: true,
                        start: '2017-08-17'
                    }]);
                },
                className: 'public-holiday-belgium',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(96, 255, 96, 0.3)',
                borderColor: 'rgba(96, 255, 96, 0.7)'
            },
            {
                id: 'public-holidays-netherlands',
                title: 'Vakantie NL',
                show: true,
                events: function (start, end, timezone, callback) {
                    callback([{
                        title: 'Feestdag NL',
                        allDay: true,
                        start: '2017-08-17'
                    }]);
                },
                className: 'public-holiday-netherlands',
                textColor: 'rgba(0, 0, 0, .7)',
                backgroundColor: 'rgba(96, 255, 96, 0.3)',
                borderColor: 'rgba(96, 255, 96, 0.7)'
                // },
                // {
                //     // TODO Specify a googleCalendarApiKey. See http://fullcalendar.io/docs/google_calendar/
                //     id: 'public-holidays-belgium-2',
                //     show: true,
                //     title: 'Vakantie BE 2',
                //     googleCalendarId: 'feestdagenbelgie@gmail.com',
                //     className: 'public-holiday-belgium',
                //     textColor: 'rgba(0, 0, 0, .7)',
                //     backgroundColor: 'rgba(96, 255, 96, 0.3)',
                //     borderColor: 'rgba(96, 255, 96, 0.7)'
            }
        ];

        $scope.eventSources = $scope.availableEventSources.filter(
            function (eventSource, index) {
                return eventSource.show;
            });

        log.debug('CalendarController $scope', $scope);

        $scope.switchTo = function (id, newVal) {
            log.debug('CalendarController switchTo:', id, newVal);
            var index;
            if (newVal) {
                // Show additional calendar
                // Preserve the order of shown calendars according the
                // available ones.
                var eventSourcesToShow = $scope.availableEventSources.filter(
                    function (eventSource, index) {
                        return eventSource.show;
                    });
                // Index of the additional calendar to show
                index = eventSourcesToShow.map(function (eventSource) {
                    return eventSource.id;
                }).indexOf(id);
                // Insert the additional calender at the index (this will
                // make $scope.eventSources equal to eventSourcesToShow).
                $scope.eventSources.splice(index, 0, eventSourcesToShow[index]);
            } else {
                // Hide visible calendar
                // Index of the calendar to hide
                index = $scope.eventSources.map(function (eventSource) {
                    return eventSource.id;
                }).indexOf(id);
                // Remove the calender at the index
                $scope.eventSources.splice(index, 1);
            }
        };
    });

app.directive(
    'switcher',
    ['remoteLoggingService', function (log) {
        log.debug('directive switcher');
        return {
            restrict: 'AE',

            link: function (scope, element, attrs) {
                log.debug('directive switcher.link:', scope, element, attrs);

                scope.$watch(attrs.switchPosition, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        log.debug('directive switcher $watch switchPosition:',
                            newVal, oldVal, attrs.id);
                        if (newVal !== oldVal) {
                            scope.switchTo(attrs.id, newVal);
                        }
                    }
                });
            }
        };
    }]);

app.config(['VKI_CONFIG', function (VKI_CONFIG) {
    VKI_CONFIG.layout.Belgian = {
        'name': "Belgian",
        'keys': [
            [["\u00b2", "\u00b3"], ["&", "1", "|"], ["\u00e9", "2", "@"],
                ['"', "3", "#"], ["'", "4"], ["(", "5"], ["\u00a7", "6", "^"],
                ["\u00e8", "7"], ["!", "8"], ["\u00e7", "9", "{"],
                ["\u00e0", "0", "}"], [")", "\u00b0"], ["-", "_"],
                ["Bksp", "Bksp"]],
            [["Tab", "Tab"], ["a", "A"], ["z", "Z"], ["e", "E", "\u20ac"],
                ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"],
                ["o", "O"], ["p", "P"], ["^", "\u00a8", "["], ["$", "*", "]"],
                ["\u03bc", "\u00a3", "`"]],
            [["Caps", "Caps"], ["q", "Q"], ["s", "S"], ["d", "D"], ["f", "F"],
                ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"],
                ["m", "M"], ["\u00f9", "%", "\u00b4"], ["Enter", "Enter"]],
            [["Shift", "Shift"], ["<", ">", "\\"], ["w", "W"], ["x", "X"],
                ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], [",", "?"],
                [";", "."], [":", "/"], ["=", "+", "~"], ["Shift", "Shift"]],
            [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
        ],
        'lang': ["nl-BE", "fr-BE"]
    };
    VKI_CONFIG.layout.Numeric = {
        'name': 'Numeric',
        'keys': [
            [['7'], ['8'], ['9'], ['\u232B']],
            [['4'], ['5'], ['6'], ['+']],
            [['1'], ['2'], ['3'], ['-']],
            [['.'], ['0'], [','], ['OK']]
        ],
        'lang': ['en']
    };
    // TODO: Get preferences for options below
    VKI_CONFIG.relative = false;
    VKI_CONFIG.sizeAdj = true;
}]);

// TODO Check alternative: An AngularJs Virtual Keyboard Interface based on Mottie/Keyboard.
// https://github.com/antonio-spinelli/ng-virtual-keyboard
// based on https://mottie.github.io/Keyboard/
app.controller(
    'VirtualKeyboardController',
    ['$scope', 'remoteLoggingService', 'VKI_CONFIG',
        function ($scope, remoteLoggingService, VKI_CONFIG) {
            var log = remoteLoggingService;
            log.debug('VirtualKeyboardController');

            // Your controller code comes here
            $scope.toggleKeyboardPosition = function () {
                log.debug('VirtualKeyboardController toggleKeyboardPosition:',
                    VKI_CONFIG, $scope);
                VKI_CONFIG.relative = !VKI_CONFIG.relative;
                // TODO Propagate the changed config to existing keyboards
            };
        }]);


// Decorator on ngVirtualKeyboard service, storing the attached
// keyboard in the scope variable.
app.config(
    function ($provide) {
        $provide.decorator(
            'ngVirtualKeyboardService',
            function ($delegate, remoteLoggingService, VKI_CONFIG) {
                var log = remoteLoggingService;
                log.debug('decorator on ngVirtualKeyboardService:', $delegate);
//
//                 // var service = {
//                 //         /*globals VKI */
//                 //         attach: function (element, scope, inputCallback) {
//                 //             var config = scope.config || {};
//                 //             config.i18n = config.i18n || VKI_CONFIG.i18n;
//                 //             config.kt = config.kt || VKI_CONFIG.kt;
//                 //             config.relative = config.relative === false ? false : VKI_CONFIG.relative;
//                 //             config.keyCenter = config.keyCenter || VKI_CONFIG.keyCenter;
//                 //             config.sizeAdj = config.sizeAdj === false ? false : VKI_CONFIG.sizeAdj;
//                 //             config.customClass = config.customClass || VKI_CONFIG.customClass;
//                 //
//                 //             var vki = new VKI(config, VKI_CONFIG.layout, VKI_CONFIG.deadkey, inputCallback);
//                 //             vki.attachVki(element);
//                 //
//                 //             // Save the attached keyboard
//                 //             scope.vki = vki;
//                 //         }
//                 //     };
//                 // // Return the new service
//                 // return service;
//
//                 // var _attach = $delegate.attach.toString();
//                 // log.debug('decorator on ngVirtualKeyboardService original function attach():', _attach);
//                 // // Adding the return for 'vki'
//                 // var attach = _attach.substring(0, _attach.lastIndexOf("}")) + ";" + "return vki;" + "}";
//                 // var getVki = "(function getVki() { return vki; })";
//                 // log.debug('decorator on ngVirtualKeyboardService patched function attach():', attach);
//                 // // Redefining attach
//                 // $delegate.attach.getVki = eval(getVki);
//                 // // eval($delegate.getVki);
//                 // $delegate.attach.getVki();
                return $delegate;
            });
    });


// Decorator on ngVirtualKeyboard directive, allowing to
// use predefined / default keyboard configurations.
app.config(
    function ($provide) {
        // Predefined (default) keyboard configurations
        var kb = {};
        kb.numeric = {
            kt: 'Numeric',
            customClass: 'numeric-keyboard',
            forcePosition: 'bottom'
        };
        kb.general = {
            numberPad: true,
            showKbSelect: true,
            forcePosition: 'bottom'
        };
        $provide.decorator(
            'ngVirtualKeyboardDirective',
            function ($delegate, remoteLoggingService, ngVirtualKeyboardService, $timeout, $injector) {
                var log = remoteLoggingService;
                log.debug('decorator on ngVirtualKeyboardDirective:', $delegate);

                // Preserve some properties
                var directive = {
                    restrict: 'A',
                    require: '?ngModel'
                };
                // The ngVirtualKeyboard attribute value becomes optional
                directive.scope = {
                    config: '=?ngVirtualKeyboard'
                };
                // Provide a 'compile' function i.s.o. a 'link' function
                directive.compile = function () {
                    return function (scope, elements, attrs, ngModelCtrl) {
                        log.debug(
                            'decorator on ngVirtualKeyboardDirective compile:',
                            scope, elements, attrs, ngModelCtrl);
                        // Keyboards defined explicitly like
                        //     ... ngVirtualKeyboard="{ ... }"
                        // are left untouched.
                        // For predefined keyboards like
                        //     ... ngVirtualKeyboard="numeric"
                        // set the corresponding keyboard configuration.
                        // For undefined keyboards like
                        //     ... ngVirtualKeyboard
                        // set a default keyboard configuration according a
                        // fallback strategy.
                        if (attrs.ngVirtualKeyboard) {
                            if (kb.hasOwnProperty(attrs.ngVirtualKeyboard)) {
                                scope.config = kb[attrs.ngVirtualKeyboard];
                            }
                        } else {
                            // Value is undefined, null or empty string
                            // Apply fallback strategy
                            if (attrs.hasOwnProperty('type') &&
                                attrs.type === 'number') {
                                // scope.config = kb.numeric;
                                scope.config = kb.general;
                            } else {
                                scope.config = kb.general;
                            }
                        }

                        // Apply the 'link' function of the original directive
                        if (!ngModelCtrl) return;
                        // For mobile devices, determine whether to show the
                        // virtual keyboard or not.
                        if (scope.config.showInMobile !== true &&
                            $injector.has('UAParser')) {
                            var UAParser = $injector.get('UAParser');
                            var results = new UAParser().getResult();
                            var isMobile = results.device.type === 'mobile' ||
                                results.device.type === 'tablet';
                            isMobile = isMobile ||
                                (results.os && (results.os.name === 'Android'));
                            isMobile = isMobile ||
                                (results.os && (results.os.name === 'iOS'));
                            isMobile = isMobile ||
                                (results.os &&
                                    (results.os.name === 'Windows Phone'));
                            isMobile = isMobile ||
                                (results.os &&
                                    (results.os.name === 'Windows Mobile'));
                            if (isMobile) return;
                        }
                        // Attach the virtual keyboard to the element.
                        // Note that the signature of attach() has changed.
                        scope.vki = ngVirtualKeyboardService
                            .attach(elements[0], scope.config, function () {
                                $timeout(function () {
                                    ngModelCtrl
                                        .$setViewValue(elements[0].value);
                                });
                            });

                        // Patch the vki.VKI_position() function, which
                        // hides the keyboard based on incorrect position
                        // calculations, so just always show the keyboard.
                        scope.vki._VKI_position = scope.vki.VKI_position;
                        scope.vki.VKI_position = function (force) {
                            // Execute the original function
                            scope.vki._VKI_position(force);
                            // Show thw keyboard
                            scope.vki.VKI_keyboard.style.display = '';
                        };

                        // Patch the element.onclick() function, which does not
                        // focus the element, so just add it.
                        elements[0]._onclick = elements[0].onclick;
                        elements[0].onclick = function () {
                            // Execute the original function
                            elements[0]._onclick();
                            // Focus the element
                            elements[0].focus();
                        };
                    };
                };
                // Return the new directive
                return [directive];
            });
    });

app.controller(
    'TaskExecutorController',
    ['$scope', 'remoteLoggingService', '$http', function ($scope, log, $http) {
        $scope.forDate = (new Date()).toJSON();
        $scope.$watch('forDate', function (n, o) {
            var date = new Date(n);
            var intDate = date.getFullYear() * 10000 +
                (date.getMonth() + 1) * 100 +
                date.getDate();
            $http.get('/api-v2/taskexecutor/date/' + intDate).success(function (result) {
                log.debug('TaskExecutorController.$watch GET /api-v2/taskexecutor/date/' + intDate + ' result', result);
                $scope.taskSet = {
                    'RTBINNEN': {
                        id: 0,
                        task_code: 'RTBINNEN',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'RTBOS': {
                        id: 0,
                        task_code: 'RTBOS',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'RTBUITEN': {
                        id: 0,
                        task_code: 'RTBUITEN',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'RTMUIS': {
                        id: 0,
                        task_code: 'RTMUIS',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'RTEGEL': {
                        id: 0,
                        task_code: 'RTEGEL',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'PREX14': {
                        id: 0,
                        task_code: 'PREX14',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'PREX17': {
                        id: 0,
                        task_code: 'PREX17',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'PRKU09': {
                        id: 0,
                        task_code: 'PRKU09',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'PRKU17': {
                        id: 0,
                        task_code: 'PRKU17',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'PRANDERE': {
                        id: 0,
                        task_code: 'PRANDERE',
                        task_date: intDate,
                        task_executors: ''
                    },
                    'UITLEG': {
                        id: 0,
                        task_code: 'UITLEG',
                        task_date: intDate,
                        task_executors: ''
                    }
                };
                result.forEach(function (task) {
                    $scope.taskSet[task.task_code] = task;
                });
            });
        });
        $scope.save = function (task) {
            if (task.id === 0) {
                $http.post('/api-v2/taskexecutor', task).success(function (result) {
                    log.debug('TaskExecutorController.save POST /api-v2/taskexecutor data:', task);
                    log.debug('TaskExecutorController.save POST /api-v2/taskexecutor result:', result);
                    task.id = result.id;
                });
            }
            else {
                $http.post('/api-v2/taskexecutor/id/' + task.id, task);
                log.debug('TaskExecutorController.save POST /api-v2/taskexecutor/id/' + task.id + ' data:', task);
            }
        };
    }]);

app.controller(
    'WorkController',
    ['$scope', 'remoteLoggingService', '$http', '$uibModal', function ($scope, log, $http, $uibModal) {
        function deleteTask(task) {
            $http.delete('/api-v2/work/id/' + task.id).success(function (result) {
                log.debug('WorkController-deleteTask DELETE /api-v2/work/id/' + task.id + ' result:', result);
            });
        }

        function load() {
            $http.get('/api-v2/work').success(function (result) {
                log.debug('WorkController-load GET /api-v2/work result:', result);
                $scope.tasks = result;
            });
        }

        load();

        $scope.edit = function (task) {
            log.debug('WorkController.edit:', task);
            var modal = $uibModal.open({
                templateUrl: '/v2/work/work_modal.html',
                controller: 'WorkModalController',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
            modal.result
                .then(function () {
                    load();
                }, function () {

                });
        };
        $scope.new = function () {
            log.debug('WorkController.new');
            $scope.edit({id: 0, description: ''});
        };
        $scope.prevention = function (event) {
            log.debug('WorkController.prevention:', event);
            event.stopPropagation();
            event.preventDefault();
        };
        $scope.deleteItem = function (task) {
            log.debug('WorkController.deleteItem:', task);
            var modalInfo = {
                title: 'Taak verwijderen'
            };
            var modal = $uibModal.open({
                templateUrl: '/v2/window/confirm_basic.html',
                controller: 'BasicConfirmationController',
                resolve: {
                    modalInfo: function () {
                        return modalInfo;
                    }
                }
            });
            modal.result
                .then(function () {
                    $http.delete('/api-v2/work/id/' + task.id).success(function (result) {
                        log.debug('WorkController.deleteItem DELETE /api-v2/work/id/' + task.id + ' result', result);
                        load();
                    });
                }, function () {

                });
        };
        $scope.activate = function (task) {
            log.debug('WorkController.activate:', task);
            var modal = $uibModal.open({
                templateUrl: '/v2/work/work_flow_modal.html',
                controller: 'WorkFlowModalController',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
            modal.result
                .then(function () {
                }, function () {

                });
        };
    }]);

app.controller(
    'WorkModalController',
    ['$scope', 'remoteLoggingService', '$http', '$uibModalInstance', 'task', function ($scope, log, $http, $uibModalInstance, task) {
        $scope.task = task;

        function saveTask(task) {
            $http.post('/api-v2/work/id/' + task.id, task).success(function (result) {
                log.debug('WorkModalController-saveTask POST /api-v2/work/id/' + task.id + ' data:', task);
                log.debug('WorkModalController-saveTask POST /api-v2/work/id/' + task.id + ' result:', result);
                $uibModalInstance.close();
            });
        }

        function createTask(task) {
            $http.post('/api-v2/work', task).success(function (result) {
                log.debug('WorkModalController-createTask POST /api-v2/work/ data:', task);
                log.debug('WorkModalController-createTask POST /api-v2/work/ result:', result);
                $uibModalInstance.close();
            });
        }

        $scope.save = function () {
            log.debug('WorkModalController.save');
            if ($scope.task.id && $scope.task.id > 0) {
                saveTask($scope.task);
            }
            else {
                createTask($scope.task);
            }
        };
        $scope.cancel = function () {
            log.debug('WorkModalController.cancel');
            $uibModalInstance.dismiss();
        };
    }]);

app.controller(
    'WorkFlowModalController',
    ['$scope', 'remoteLoggingService', '$http', '$uibModalInstance', 'task',
        function ($scope, log, $http, $uibModalInstance, task) {
            $scope.task = task;
            $scope.more_info = '';

            function saveFlow(flow) {
                $http.post('/api-v2/workflow', flow).success(function (result) {
                    log.debug('WorkFlowModalController-saveFlow POST /api-v2/workflow data:', flow);
                    log.debug('WorkFlowModalController-saveFlow POST /api-v2/workflow data:', result);
                    $uibModalInstance.close();
                });
            }

            $scope.save = function () {
                log.debug('WorkFlowModalController.save');
                var flow = {
                    action_id: task.id,
                    more_info: $scope.more_info,
                    status: 'NEW'
                };
                saveFlow(flow);
            };
            $scope.cancel = function () {
                log.debug('WorkFlowModalController.cancel');
                $uibModalInstance.dismiss();
            };
        }]);

app.controller(
    'WorkFlowController',
    ['$scope', 'remoteLoggingService', '$http', '$uibModal',
        '$location', 'borderControlService',
        function ($scope, log, $http, $uibModal,
                  $location, borderControlService) {
            function load() {
                $http.get('/api-v2/workflow').success(function (result) {
                    log.debug('WorkFlowController-load GET /api-v2/workflow result:', result);
                    $scope.tasks = result;
                });
            }

            load();
            $scope.view = function (item) {
                log.debug('WorkFlowController.view:', item);
                $location.url('/taskprotocol?id=' + item.action_id);
            };
            $scope.prevention = function (event) {
                log.debug('WorkFlowController.prevention:', event);
                event.stopPropagation();
                event.preventDefault();
            };
            $scope.save = function (flow) {
                $http.post('/api-v2/workflow/id/' + flow.id, flow).success(function (result) {
                    log.debug('WorkFlowController.save POST /api-v2/workflow/id/' + flow.id + ' data:', flow);
                    log.debug('WorkFlowController.save POST /api-v2/workflow/id/' + flow.id + ' result:', result);
                });
            };
            $scope.endTask = function (task) {
                borderControlService.tryAction(
                    function () {
                        task.status = 'END';
                        $http.post('/api-v2/workflow/id/' + task.id, task).success(function (result) {
                            log.debug('WorkFlowController.endTask POST /api-v2/workflow/id/' + task.id + ' data:', task);
                            log.debug('WorkFlowController.endTask POST /api-v2/workflow/id/' + task.id + ' result:', result);
                            load();
                        });
                    },
                    'rlAdmin',
                    'Taak Afsluiten'
                );
                /*
                 var modalInfo = {
                 title:'Taak is Voltooid'
                 };
                 var modal = $uibModal.open({
                 templateUrl:'/v2/window/confirm_basic.html',
                 controller:'BasicConfirmationController',
                 size:'lg',
                 resolve: {
                 modalInfo: function() {return modalInfo;}
                 }
                 });
                 modal.result.then(
                 function() {
                 task.status = 'END';
                 $http.post('/api-v2/workflow/id/' + task.id, task).success(function() {
                 load();
                 });
                 }, function() {

                 })
                 ;*/
            };
        }]);

app.controller(
    'WorkProtocolController',
    ['$scope', 'remoteLoggingService', '$location', '$routeParams', '$http', 'PreviousRoute',
        function ($scope, log, $location, $routeParams, $http, PreviousRoute) {
            var id = $routeParams.id;
            $http.get('/api-v2/work/id/' + id).success(function (result) {
                log.debug('WorkProtocolController GET /api-v2/work/id/' + id + ' result:', result);
                if (result.length > 0) {
                    $scope.work = result[0];
                }
                else
                    $location.url(PreviousRoute.route.originalPath);
            });
            $scope.back = function () {
                $location.url(PreviousRoute.route.originalPath);
            };
        }]);


/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 *  New
 */

app.controller(
    'HedgehogCareController',
    function ($scope, remoteLoggingService, $http) {
        var log = remoteLoggingService;
        log.debug('HedgehogCareController');
    });

app.controller(
    'MouseBreedingController',
    function ($scope, remoteLoggingService, $http) {
        var log = remoteLoggingService;
        log.debug('MouseBreedingController');
    });

app.controller(
    'StockManagementController',
    function ($scope, remoteLoggingService, $http) {
        var log = remoteLoggingService;
        log.debug('StockManagementController');
    });

app.controller(
    'DirectionsController',
    function ($scope, remoteLoggingService, $http) {
        var log = remoteLoggingService;
        log.debug('DirectionsController');
    });

app.controller(
    'OverviewReportController',
    function ($scope, remoteLoggingService, $http, spinnerService) {
        var log = remoteLoggingService;
        log.debug('OverviewReportController');

        $scope.today = new Date(new Date().setHours(0, 0, 0, 0));

        function load() {
            spinnerService.taskStart('nhcActionBarSpinner');
            $http.get('/api-v2/fiche/overviewreport/start/' +
                $scope.startDate.getTime() + '/end/' +
                $scope.endDate.getTime())
                .success(function (result) {
                    log.debug('OverviewReportController ' +
                        'GET /api-v2/fiche/overviewreport/start/' +
                        $scope.startDate.getTime() + '/end/' +
                        $scope.endDate.getTime() + ' result:',
                        result);
                    $scope.overviewData = result;
                    $scope.total = {animal_count: 0, fiche_count: 0};
                    $scope.overviewData.forEach(
                        function (item, index) {
                            $scope.total.animal_count += item.animal_count;
                            $scope.total.fiche_count += item.fiche_count;
                        }
                    );
                })
                .catch(function (err) {
                    log.debug('OverviewReportController ' +
                        'GET /api-v2/fiche/overviewreport/start/' +
                        $scope.startDate.getTime() + '/end/' +
                        $scope.endDate.getTime() + ' error:',
                        err);
                })
                .finally(function () {
                    spinnerService.taskStop('nhcActionBarSpinner');
                });
        }

        $scope.getReport = function () {
            log.debug('OverviewReportController.getReport:',
                $scope.startDate, $scope.endDate);
            if ($scope.startDate && $scope.endDate)
                load($scope.startDate, $scope.endDate);
        };

    });

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */


// function closeAllPopover() {
//     $('nhc-popover').popover('hide');
// }