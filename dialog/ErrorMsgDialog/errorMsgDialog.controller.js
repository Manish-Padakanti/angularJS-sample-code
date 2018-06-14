(function () {
  'use strict';

  angular.module('gbrs.dialog').controller('ErrorMessageDialogController', ErrorMessageDialogController);

  ErrorMessageDialogController.$inject = ['$scope', 'ngDialog', 'dialogService'];

  function ErrorMessageDialogController($scope, ngDialog, dialogService) {
      var vm = this;
      vm.errorMsg = $scope.ngDialogData;

      vm.okClose = okClose;

      init();

      function init() {}

      //function to call the required service
      function okClose() {
        dialogService.closeErrorMessageDialog();
      }

    } //end of controller
})();