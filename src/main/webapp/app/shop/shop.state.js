(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('shop', {
            parent: 'app',
            url: '/shop',
            data: {
                authorities: [],
                pageTitle: 'Shopping Cart'
            },
            views: {
                'content@': {
                    templateUrl: 'app/shop/shop.html',
                    controller: 'JhiShopController',
                    controllerAs: 'vm'
                }
            },
            resolve: {}
        });
    }
})();