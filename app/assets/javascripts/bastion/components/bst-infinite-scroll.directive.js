/**
 * @ngdoc directive
 * @name Bastion.components.directive:bstInfiniteScroll
 *
 * @description
 *   The infinite scroll directive should be applied to a wrapping div around another element
 *   and provides automatic loading when a user scrolls to the bottom of the element.
 *
 *   Note that the element using the bst-infinite-scroll directive should have it's overflow
 *   set properly.
 *
 * @requires $window
 *
 * @example
 *   <pre>
 *     <div bst-infinite-scroll="loadMore()" style="height: 100px; overflow-y: auto;">
 *       <p style="height: 1000px;">Hello</p>
 *     </div>
 *   </pre>
 */
angular.module('Bastion.components').directive('bstInfiniteScroll', ['$window', function ($window) {
    return {
        scope: {
            data: '=',
            loadMoreFunction: '&bstInfiniteScroll',
            initialLoad: '='
        },
        controller: function ($scope, $element) {

            var getScrollHeight, isPromise, loadUntilScroll,
                raw = $element[0];

            $element.bind('scroll', function () {
                var sliderPosition = raw.scrollTop + raw.offsetHeight;
                if (sliderPosition > 0 && sliderPosition >= raw.scrollHeight - 1) {
                    $scope.loadMoreFunction();
                }
            });

            getScrollHeight = function () {
                var scrollHeight = 0;
                $element.children().each(function () {
                    scrollHeight = scrollHeight + angular.element(this).get(0).scrollHeight;
                });
                return scrollHeight;
            };

            isPromise = function (promise) {
                return promise && promise.hasOwnProperty('then');
            };

            loadUntilScroll = function () {
                var loadResult;

                if (getScrollHeight() < $element.height()) {
                    loadResult = $scope.loadMoreFunction();
                    if (isPromise(loadResult)) {
                        loadResult.then(function () {
                            if (getScrollHeight() < $element.height()) {
                                loadUntilScroll();
                            }
                        });
                    }
                }
            };

            if ($scope.initialLoad && (angular.isUndefined($scope.data) || $scope.data.length === 0)) {
                loadUntilScroll();
                angular.element($window).bind('resize', loadUntilScroll);
            }
        }
    };
}]);
