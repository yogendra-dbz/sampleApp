(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarController ($state, Auth, Principal, ProfileService, LoginService) {
        var vm = this;

        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;
        vm.clickedAccount = false;
        if (sessionStorage.getItem('cartNumber') !== undefined && sessionStorage.getItem('cartNumber') !== null) {
            vm.cartNumber = sessionStorage.getItem('cartNumber');
        } else {
            vm.cartNumber = 0;
        }

        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerEnabled = response.swaggerEnabled;
        });

        vm.login = login;
        vm.logout = logout;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;

        function login() {
            collapseNavbar();
            LoginService.open();
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }

        $(document).ready(function() {
            $(document).on('click', function() {
                if (sessionStorage.getItem('cartNumber') !== undefined && sessionStorage.getItem('cartNumber') !== null) {
                    vm.cartNumber = sessionStorage.getItem('cartNumber');
                } else {
                    vm.cartNumber = 0;
                }

            })
        });
    }
})();
