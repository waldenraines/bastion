angular.element(document).ready(function () {
    angular.bootstrap(document, BASTION_MODULES);
});

BASTION_MODULES = [
    'angular-blocks',
    'ngAnimate',
    'ngSanitize',
    'infinite-scroll',
    'templates',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'Bastion.auth',
    'Bastion.menu',
    'Bastion.i18n',
    'Bastion.features'
];
