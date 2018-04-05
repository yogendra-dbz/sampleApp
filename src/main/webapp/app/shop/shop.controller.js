(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('JhiShopController', JhiShopController);

    JhiShopController.$inject = ['$scope'];

    function JhiShopController($scope) {
        var vm = this;
        vm.showModal = showModal;
        vm.addToCart = addToCart;
        if (sessionStorage.getItem('cartNumber') !== undefined && sessionStorage.getItem('cartNumber') !== null) {
            vm.cartNumber = sessionStorage.getItem('cartNumber');
        } else {
            vm.cartNumber = 0;
        }

        function showModal($event) {
            var img = $event.delegateTarget.childNodes[1].currentSrc;
            var title = $event.delegateTarget.childNodes[3].childNodes[1].innerText;
            var price = $event.delegateTarget.childNodes[3].childNodes[3].innerText;
            $("#popup-title").html(title);
            $("#popup-desc").html(title);
            $("#popup-price").html(price);
            $("#popup-img").attr('src', img);
            $("#exampleModalCenter").modal();

        }

        function addToCart() {
            vm.cartNumber = parseInt(vm.cartNumber) + 1;
            sessionStorage.setItem('cartNumber', vm.cartNumber);
        }
    }
})();