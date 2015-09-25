/**
* @ngdoc directive
* @name Bastion.components.directive:bookmark
* @description
* Provides the bookmarked items for a dropdown menu
*/
angular.module('Bastion.components').directive('bstBookmark', ['BstBookmark', function (BstBookmark) {
    return {
        scope: {
            controllerName: '=',
            query: '='
        },
        templateUrl: 'components/views/bst-bookmark.html',
        controller: ['$scope', 'translate', function ($scope, translate) {
            $scope.newBookmark = {};

            $scope.load = function () {
                BstBookmark.queryPaged({search: 'controller=' + $scope.controllerName}).$promise.then(function (response) {
                    $scope.bookmarks = response.results;
                });
            };

            $scope.bookmarks = $scope.load();

            $scope.add = function () {
                if (angular.isDefined($scope.query)) {
                    $scope.newBookmark.query = $scope.query.trim();
                }
                $scope.openModal();
            };

            $scope.save = function () {
                BstBookmark.create({
                                     name: $scope.newBookmark.name,
                                     query: $scope.newBookmark.query,
                                     public: $scope.newBookmark.public,
                                     controller: $scope.controllerName
                                   }
                ).$promise.then(function successCallback() {
                    $scope.bookmarks = $scope.load();
                    $scope.$parent.successMessages = [translate('Bookmark was successfully created.')];
                }, function errorCallback(response) {
                    $scope.$parent.errorMessages = response.data.error.full_messages;
                });
            };

            $scope.get = function (bookmark) {
                $scope.query = bookmark.query;
            };
        }]
    };
}]);
