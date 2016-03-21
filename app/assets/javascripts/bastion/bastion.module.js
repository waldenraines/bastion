/**
 * @ngdoc module
 * @name  Bastion
 *
 * @description
 *   Base module that defines the Katello module namespace and includes any thirdparty
 *   modules used by the application.
 */
angular.module('Bastion', [
    'ui.router',
    'ui.router.util',
    'ngResource',
    'Bastion.i18n',
    'Bastion.components'
]);

/**
 * @ngdoc constant
 * @name Bastion.oldBrowserPath
 *
 * @description
 *   A path used for browsers that don't support push state.
 */
angular.module('Bastion').constant('oldBrowserPath', '/bastion#');

/**
 * @ngdoc config
 * @name  Bastion.config
 *
 * @requires $httpProvider
 * @requires $urlRouterProvider
 * @requires $locationProvider
 * @requires $provide
 * @requires BastionConfig
 * @requries oldBrowserPath
 *
 * @description
 *   Used for establishing application wide configuration such as adding the Rails CSRF token
 *   to every request and adding Xs to translated strings.
 */
angular.module('Bastion').config(
    ['$httpProvider', '$urlRouterProvider', '$locationProvider', '$provide', 'BastionConfig', 'oldBrowserPath',
    function ($httpProvider, $urlRouterProvider, $locationProvider, $provide, BastionConfig, oldBrowserPath) {

        $httpProvider.defaults.headers.common = {
            Accept: 'application/json, text/plain, version=2; */*',
            'X-CSRF-TOKEN': angular.element('meta[name=csrf-token]').attr('content')
        };

        $urlRouterProvider.rule(function ($injector, $location) {
            var $sniffer = $injector.get('$sniffer'),
                $window = $injector.get('$window'),
                path = $location.path();

            if (!$sniffer.history) {
                $window.location.href = oldBrowserPath + $location.path();
            }

            if (/^\/katello($|\/)/.test(path)) {
                $window.location.href = $location.url();
                $window.location.reload();
            }

            // removing trailing slash to prevent endless redirect
            if (path[path.length - 1] === '/') {
                return path.slice(0, -1);
            }
        });

        $locationProvider.html5Mode(true);

        $provide.factory('PrefixInterceptor', ['$q', '$templateCache', function ($q, $templateCache) {
            return {
                request: function (config) {
                    if (config.url.indexOf('.html') !== -1) {
                        if (angular.isUndefined($templateCache.get(config.url))) {
                            config.url = '/' + config.url;
                        }
                    }

                    return config || $q.when(config);
                }
            };
        }]);

        // Add Xs around translated strings if the config value mark_translated is set.
        if (BastionConfig.markTranslated) {
            $provide.decorator('gettextCatalog', ["$delegate", function ($delegate) {
                var getString = $delegate.getString;

                $delegate.getString = function (string, n) {
                    return 'X' + getString.apply($delegate, [string, n]) + 'X';
                };
                return $delegate;
            }]);
        }

        $httpProvider.interceptors.push('PrefixInterceptor');
    }]
);


/**
 * @ngdoc run
 * @name Bastion.run
 *
 * @requires $rootScope
 * @requires $state
 * @requires $stateParams
 * @requires gettextCatalog
 * @requires currentLocale
 * @requires $location
 * @requires $window
 * @requires PageTitle
 * @requires markActiveMenu
 * @requires UrlMatcher
 * @requires oldBrowserPath
 *
 * @description
 *   Set up some common state related functionality and set the current language.
 */
angular.module('Bastion').run(['$rootScope', '$state', '$stateParams', 'gettextCatalog', 'currentLocale', '$location', '$window', 'PageTitle', 'markActiveMenu', 'UrlMatcher', 'oldBrowserPath',
    function ($rootScope, $state, $stateParams, gettextCatalog, currentLocale, $location, $window, PageTitle, markActiveMenu, UrlMatcher, oldBrowserPath) {
        var fromState, fromParams;

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.transitionTo = $state.transitionTo;

        $rootScope.isState = function (stateName) {
            return $state.is(stateName);
        };

        $rootScope.stateIncludes = function (state, params) {
            if (angular.isDefined(params)) {
                angular.forEach(params, function (value, key) {
                    params[key] = value.toString();
                });
            }

            return $state.includes(state, params);
        };

        $rootScope.transitionBack = function () {
            if (fromState) {
                $state.transitionTo(fromState, fromParams);
            }
        };

        $rootScope.taskUrl = function (taskId) {
            return "/foreman_tasks/tasks/" + taskId;
        };

        // Set the current language
        gettextCatalog.currentLanguage = currentLocale;
        $rootScope.$on('$stateChangeStart',
            function () {
                //save location.search so we can add it back after transition is done
                this.locationSearch = $location.search().search;
            }
        );

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromStateIn, fromParamsIn) {

                //restore all query string parameters back to $location.search
                if (this.locationSearch) {
                    $location.search('search', this.locationSearch);
                }

                //Record our from state, so we can transition back there
                if (!fromStateIn.abstract) {
                    fromState = fromStateIn;
                    fromParams = fromParamsIn;
                }

                //Pop the last page title if it's not the outermost title (i.e. parent state)
                if (PageTitle.titles.length > 1) {
                    PageTitle.resetToFirst();
                }

                //Set the active menu item in Foreman
                markActiveMenu();
            }
        );

        // Should be able to replace this with $stateNotFound when a version of ui-router that
        // contains it is released, see https://github.com/angular-ui/ui-router/wiki#state-change-events
        $rootScope.$on('$locationChangeStart', function (event, newUrl) {
            var nextState, urlWithoutIds = newUrl.replace(/\/[0-9]+/g, '/');

            //nextState = _.find($state.get(), function (state) {
            //    var found = false, stateUrl = $state.href($state.get(state));
            //
            //    console.log(stateUrl);
            //    if (urlWithoutIds.indexOf(stateUrl) > -1) {
            //        found = true;
            //    }
            //
            //    return found;
            //});

            //if (nextState === undefined) {
            //    console.log("not in bastion urls!")
            //
            //    // Remove the old browser path if present
            //    newUrl = newUrl.replace(oldBrowserPath, '');
            //    //event.preventDefault();
            //    //$window.location.href = newUrl;
            //}

            console.log(UrlMatcher(newUrl));
        });
    }
]);
