angular.module('Bastion.routing', ['ui.router']);

(function () {
    'use strict';

    /**
     * @ngdoc config
     * @name  Bastion.routing.config
     *
     * @requires $urlRouterProvider
     * @requires $locationProvider
     *
     * @description
     *   Routing configuration for Bastion.
     */
    function bastionRouting($urlRouterProvider, $locationProvider) {
        var oldBrowserBastionPath = '/bastion#', getRootPath;

        getRootPath = function (path) {
            console.log(path);
            var rootPath = null;

            if (path && angular.isString(path)) {
                rootPath = path.replace('_', '-').split('/')[1];
            }
            console.log(rootPath);
            return rootPath
        };

        $urlRouterProvider.rule(function ($injector, $location) {
            var $sniffer = $injector.get('$sniffer'),
                $window = $injector.get('$window'),
                path = $location.path();

            if (!$sniffer.history) {
                $window.location.href = oldBrowserBastionPath + $location.path();
            }

            // removing trailing slash to prevent endless redirect
            if (path[path.length - 1] === '/') {
                return path.slice(0, -1);
            }
        });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $window = $injector.get('$window'),
                $state = $injector.get('$state'),
                rootPath = getRootPath($location.path()),
                url = $location.absUrl(),
                foundParentState;

            // ensure we don't double encode +s
            url = url.replace(/%2B/g, "+");

            // Remove the old browser path if present
            url = url.replace(oldBrowserBastionPath, '');

            if (rootPath) {
                foundParentState = _.find($state.get(), function (state) {
                    var found = false;
                    console.log(state);
                    if (state.url) {
                        console.log("STATE URL: " + getRootPath(state.url));
                        console.log("ROOT PATH: " + rootPath);
                        found = getRootPath(state.url) === rootPath;
                    }

                    return found;
                });
            }

            if (foundParentState) {
                $window.location.href = '/404';
            } else {
                $window.location.href = url;
            }
            return $location.path();
        });

        $locationProvider.html5Mode(true);

    }

    angular.module('Bastion.routing').config(bastionRouting);
    bastionRouting.$inject = ['$urlRouterProvider', '$locationProvider'];
})();
