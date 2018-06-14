(function () {
  'use strict';

  angular.module('gbrs.dialog').controller('ValidationMsgController', ValidationMsgController);

  ValidationMsgController.$inject = ['$http', '$scope', '$state', '$stateParams', 'ngDialog', 'dialogService', 'vocabService', 'entityService'];

  function ValidationMsgController($http, $scope, $state, $stateParams, ngDialog, dialogService, vocabService, entityService) {
    var vm = this;
    vm.validationMsg = $scope.ngDialogData;

    vm.willReceiveMoniker = willReceiveMoniker;
    vm.cancelValidation = cancelValidation;
    vm.continueValidation = continueValidation;
    vm.curationEvent = curationEvent;
    vm.isRuleEmpty = isRuleEmpty;
    vm.checkConceptStatus = checkConceptStatus;
    vm.viewConcept = viewConcept;
    vm.registerLot = registerLot;
    vm.isEmpty = isEmpty;

    init();

    function init() {
      if (!isEmpty(vm.validationMsg.output.moniker)) {
        entityService.getEntity(vm.validationMsg.output.moniker).then(function (data) {
          console.log(data);
          vm.validationMsg.output.conceptStatus = data.conceptStatus;
          vm.validationMsg.output.replacedMoniker = data.replacedMoniker;
          if (data.conceptStatus == 'Discontinued') vm.validationMsg.output.statusMessage = "This Corporate ID has been Discontinued! No Lots may be added.";
          if (data.conceptStatus == 'Replaced') vm.validationMsg.output.statusMessage = "This Corporate ID has been Replaced with [" + data.replacedMoniker + "]!";
        });
      }
    }
    //function to check if the concept will receive moniker
    function willReceiveMoniker() {
      if (vm.validationMsg.output.willReceiveMoniker) return true;
      return false;
    }
    //function to check if the event is curation event
    function curationEvent() {
      if (vm.validationMsg.output.ruleID == 999) return true;
      return false;
    }
    //function to check if no rule is triggered in case of illigal vocab entry check for "-1"
    function isRuleEmpty() {
      if (vm.validationMsg.output.ruleID == -1) return true;
      return false;
    }

    //function to check for concept status 
    function checkConceptStatus() {
      if (vm.validationMsg.output.conceptStatus == 'Discontinued' || vm.validationMsg.output.conceptStatus == 'Replaced') return true;
      return false;
    }

    //open view concept tab
    function viewConcept(status) {
      if (status == 'Replaced') dialogService.closeValidationMsgDialog('newReplacedView' + vm.validationMsg.output.replacedMoniker);
      dialogService.closeValidationMsgDialog('viewMoniker');
    }

    //function to cancel validation
    function cancelValidation() {
      dialogService.closeValidationMsgDialog('cancel');
    }

    //function to continue validation
    function continueValidation() {
      dialogService.closeValidationMsgDialog('continue');
    }

    //function to registerLot validation
    function registerLot() {
      dialogService.closeValidationMsgDialog('registerLot');
    }

    //Check if a given object is empty
    function isEmpty(obj) {
      if (typeof (obj) == 'undefined') return true;
      //if($.isArray(obj) & (obj.length == 0)) return true;
      else if ($.trim(obj).length == 0) return true;
      return false;
    }
  } //end of controller
})();
