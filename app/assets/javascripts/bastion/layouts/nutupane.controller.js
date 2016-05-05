(function () {

    /**
     * @ngdoc controller
     * @name Bastion.NutupaneController
     *
     * @description
     *   Wraps the
     */
    function NutupaneController($rootScope, $scope, $state) {
        $scope.showSearch = !$state.current.collapsed;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $scope.showSearch = !toState.collapsed;
        });
    }

    angular
        .module('Bastion')
        .controller('NutupaneController', NutupaneController);

    NutupaneController.$inject = ['$rootScope', '$scope', '$state'];

})();
