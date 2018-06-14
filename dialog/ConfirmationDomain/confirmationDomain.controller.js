(function () {
  'use strict';

  angular.module('gbrs.dialog').controller('ConfirmationDomainController', ConfirmationDomainController);

  ConfirmationDomainController.$inject = ['$scope', 'ngDialog', 'dialogService'];

  function ConfirmationDomainController($scope, ngDialog, dialogService) {
    var vm = this;
    vm.confirmationMsg = $scope.ngDialogData;

    vm.validConfirm = validConfirm;
    vm.invalidConfirm = invalidConfirm;
    vm.isEmpty = isEmpty;

    init();

    function init() {}

    //function to call the required service
    function validConfirm() {
      dialogService.closeConfirmationDialog('ok');
    }


    function invalidConfirm() {
      dialogService.closeConfirmationDialog('cancel');
    }

    //Check if a given object is empty
    function isEmpty(obj) {
      if (typeof (obj) == 'undefined') return true;
      else if (obj == null) return true;
      else if (obj == -1) return true;
      //if($.isArray(obj) & (obj.length == 0)) return true;
      else if ($.trim(obj).length == 0) return true;
      return false;
    }

  } //end of controller
})();