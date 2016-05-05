(function () {

    /**
     * @ngdoc controller
     * @name Bastion.NutupaneLayoutController
     *
     * @description
     *   Basic functionality for the nutupane layout.
     */
    function NutupaneLayoutController($rootScope, $scope, $state) {
        $scope.showSearch = !$state.current.collapsed;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $scope.showSearch = !toState.collapsed;
        });
    }

    angular
        .module('Bastion')
        .controller('NutupaneLayoutController', NutupaneLayoutController);

    NutupaneLayoutController.$inject = ['$rootScope', '$scope', '$state'];

})();
