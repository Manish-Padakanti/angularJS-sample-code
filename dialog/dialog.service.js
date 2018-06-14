(function () {
  'use strict';

  angular.module('gbrs.dialog').service('dialogService', dialogService);

  dialogService.$inject = ['$q', 'ngDialog', '$modal', '$timeout', '$document', 'notifyService'];

  function dialogService($q, ngDialog, $modal, $timeout, $document, notifyService) {
    var authenticationWindow;
    var fileDownloadWindow;
    var msgModalWindow;
    var customMsgWindow;
    var validateEntityWindow;
    var registerEntityWindow;
    var raWindow;
    var domainWindow;
    var immWindow;
    var antiBodyIsotypeWindow;
    var darWindow;
    var aggregationWindow;
    var errorWindow;
    var validationMsgWindow;
    var constructsWindow;
    var cassettesWindow;
    var relatedEntityWindow;
    var bufferWindow;
    var searchFilterWindow;
    var gbisRequestFormWindow;

    var confirmDeffered;
    var confirmationWindow;


    //deferred set
    var raDeffered;
    var raWindowOpen = false; // XXX, for now we will not use it, but kept as a placehoder for future conflicts
    var antigen;

    var domainDeffered;
    var domainWindowOpen = false; // XXX, for now we will not use it, but kept as a placehoder for future conflicts
    var domain;

    var constructsDeffered;
    var constructs;

    var cassettesDeffered;
    var cassettes;

    var antiBodyIsotypeDeffered;
    var antiBodyIsotypeWindowOpen = false; // XXX, for now we will not use it, but kept as a placehoder for future conflicts
    var antiBodyIsotype;


    var immDeffered;
    var immWindowOpen = false; // XXX, for now we will not use it, but kept as a placehoder for future conflicts
    var immunogen;

    var darDeffered;
    var darWindowOpen = false; // XXX-, for now we will not use it, but kept as a placehoder for future conflicts
    var dar;

    var bufferDeffered;
    var bufferWindowOpen = false; // XXX-, for now we will not use it, but kept as a placehoder for future conflicts
    var buffer;

    var aggregationDeffered;
    var aggregationWindowOpen = false; // XXX-, for now we will not use it, but kept as a placehoder for future conflicts
    var aggregation;

    var validationMsgDeffered;
    var valMsgWindowOpen = false; // XXX-, for now we will not use it, but kept as a placehoder for future conflicts
    var validationMsg;

    return {
      showAuthenticationDialog: showAuthenticationDialog,
      closeAuthenticationDialog: closeAuthenticationDialog,
      showFileDownloadDialog: showFileDownloadDialog,
      closeFileDownloadDialog: closeFileDownloadDialog,
      showValidateEntityDialog: showValidateEntityDialog,
      closeValidateEntityDialog: closeValidateEntityDialog,
      showRegisterEntityDialog: showRegisterEntityDialog,
      closeRegisterEntityDialog: closeRegisterEntityDialog,
      showUpdateEntityDialog: showUpdateEntityDialog,
      closeUpdateEntityDialog: closeUpdateEntityDialog,
      openMsgModalDialog: openMsgModalDialog,
      closeMsgModalDialog: closeMsgModalDialog,
      openCustomMsgDialog: openCustomMsgDialog,
      closeCustomMsgDialog: closeCustomMsgDialog,
      openRaSelectionDialog: openRaSelectionDialog,
      closeRaSelectionDialog: closeRaSelectionDialog,
      openDomainSelectionDialog: openDomainSelectionDialog,
      closeDomainSelectionDialog: closeDomainSelectionDialog,
      openConfirmationDialog: openConfirmationDialog,
      closeConfirmationDialog: closeConfirmationDialog,
      openErrorMessageDialog: openErrorMessageDialog,
      closeErrorMessageDialog: closeErrorMessageDialog,
      openValidationMsgDialog: openValidationMsgDialog,
      closeValidationMsgDialog: closeValidationMsgDialog,
      openAntiBodyIsotypeSelectionDialog: openAntiBodyIsotypeSelectionDialog,
      closeAntiBodyIsotypeSelectionDialog: closeAntiBodyIsotypeSelectionDialog,
      openImmunogenSelectionDialog: openImmunogenSelectionDialog,
      closeImmunogenSelectionDialog: closeImmunogenSelectionDialog,
      openDarSelectionDialog: openDarSelectionDialog,
      closeDarSelectionDialog: closeDarSelectionDialog,
      openAggregationSelectionDialog: openAggregationSelectionDialog,
      closeAggregationSelectionDialog: closeAggregationSelectionDialog,
      openConstructsSelectionDialog: openConstructsSelectionDialog,
      closeConstructsSelectionDialog: closeConstructsSelectionDialog,
      openExpressionCassettesDialog: openExpressionCassettesDialog,
      closeExpressionCassettesDialog: closeExpressionCassettesDialog,
      showRelatedEntityDialog: showRelatedEntityDialog,
      closeRelatedEntityDialog: closeRelatedEntityDialog,
      openBufferComponentDialog: openBufferComponentDialog,
      closeBufferComponentDialog: closeBufferComponentDialog,
      showSearchFilterDialog: showSearchFilterDialog,
      closeSearchFilterDialog: closeSearchFilterDialog,
      openGbisRequestForm: openGbisRequestForm,
      closeGbisRequestForm: closeGbisRequestForm
    };

    //open the authentication dialog
    function showAuthenticationDialog() {
      //console.log("open authentication dialog");
      authenticationWindow = ngDialog.open({
        template: 'app/dialog/authentication.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }
    //close the authentication dialog
    function closeAuthenticationDialog() {
      authenticationWindow.close();
    }

    //open the authentication dialog
    function showFileDownloadDialog() {
      fileDownloadWindow = ngDialog.open({
        template: 'app/dialog/fileDownload.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
      // console.log(authenticationWindow);
    }
    //close the authentication dialog
    function closeFileDownloadDialog() {
      fileDownloadWindow.close();
    }
    //open the validate dialog
    function showValidateEntityDialog() {
      validateEntityWindow = ngDialog.open({
        template: 'app/dialog/validateEntityMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }
    //close the validate dialog
    function closeValidateEntityDialog() {
      validateEntityWindow.close();
    }
    //open the validate dialog
    function showRegisterEntityDialog() {
      registerEntityWindow = ngDialog.open({
        template: 'app/dialog/registerEntityMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }
    //close the validate dialog
    function closeRegisterEntityDialog() {
      registerEntityWindow.close();
    }
    //open the  update dialog
    function showUpdateEntityDialog() {
      registerEntityWindow = ngDialog.open({
        template: 'app/dialog/updateEntityMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }
    //close the validate dialog
    function closeUpdateEntityDialog() {
      registerEntityWindow.close();
    }

    //function to open msg modal dialog
    function openMsgModalDialog(type, msg) {
      //console.log("open openMsgModalDialog dialog : " + type);
      var template = "";
      if (type == 'genbankParser')
        template = 'app/dialog/parseGenbankMsg.html';
      else if (type == 'viewConcept')
        template = 'app/dialog/viewConceptMsg.html';
      else if (type == 'annotation')
        template = 'app/dialog/annotationMsg.html';
      else if (type == 'searchConcept')
        template = 'app/dialog/searchMsg.html';
      else if (type == 'lotsList')
        template = 'app/dialog/lotsListMsg.html';
      else if (type == 'customMsg')
        template = 'app/dialog/customMsg.html';
      if ((typeof (template) == 'undefined') || ($.trim(template) == ''))
        return;
      msgModalWindow = ngDialog.open({
        template: template,
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: msg
      });
    }
    //close the msg window
    function closeMsgModalDialog(anchorSearchScroll) {
      //XXX== needed to add this. when you open the dialog and close immediately it fails
      // as your are tyring to close the dialog beofe it opens.. I think it is a bug in ngDialog
      $timeout(function () {
        if (typeof (msgModalWindow) != 'undefined')
          msgModalWindow.close();
        if (anchorSearchScroll) {
          var scrollElement = angular.element(document.getElementById('searchScroll'));
          $document.scrollToElement(scrollElement, 50, 1000);
          //notifyService.displayHtmlNotification('<p>Scrolling to results</p>', 'alert-info', 5000);
        }
      }, 500);
    }

    //function to open custom msg dialog
    function openCustomMsgDialog(msg) {
      customMsgWindow = ngDialog.open({
        template: 'app/dialog/customMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: msg
      });
    }
    //close the custom msg window
    function closeCustomMsgDialog() {
      //if (typeof (customMsgWindow) != 'undefined')
      customMsgWindow.close();
    }
    //-------------------------------- RECOGNIZED ANTIGEN WINDOW -------------------------------
    //function to open msg modal dialog
    function openRaSelectionDialog(raData) {
      antigen = {};
      if (isEmpty(raData)) initializeRecognizedAntigen_(antigen);
      else antigen = $.extend(true, {}, raData); //making a deep copy
      //check if window is already open... for now we are ignoring this
      raDeffered = $q.defer();
      raWindow = ngDialog.open({
        template: 'app/dialog/RaSelection/raSelection.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: antigen
      });
      return raDeffered.promise;
    } //end of open Ra Seclection window
    //close the msg window
    // type : save -- when the RA window save is clicked
    //        cancel -- when the RA cancel window is clicked
    function closeRaSelectionDialog(type) {
      if (!isEmpty(raDeffered)) {
        if (type == 'save') {
          raDeffered.resolve(antigen);
        } else raDeffered.resolve();
      }
      if (typeof (raWindow) != 'undefined') {
        raWindow.close();
      }
    } //end of close RASelection Dialog
    //function to initialize recognized antigen
    function initializeRecognizedAntigen_(ra) {
      if (isEmpty(ra.antiIdiotypeType)) ra.antiIdiotypeType = '';
      if (isEmpty(ra.antibodyAntigen)) ra.antibodyAntigen = '';
      if (isEmpty(ra.corporateID)) ra.corporateID = '';
      if (isEmpty(ra.description)) ra.description = '';
      if (isEmpty(ra.entrezgeneID)) ra.entrezgeneID = '';
      if (isEmpty(ra.geneSymbol)) ra.geneSymbol = '';
      if (isEmpty(ra.name)) ra.name = '';
      if (isEmpty(ra.relatedProtein)) ra.relatedProtein = '';
      if (isEmpty(ra.sequence)) ra.sequence = '';
      if (isEmpty(ra.species)) ra.species = '';
      if (isEmpty(ra.type)) ra.type = 'Protein';
      if (isEmpty(ra.externalID)) ra.externalID = '';
    } //end of initialize Recognized Antigen

    //-------------------------------- END OF RECOGNIZED ANTIGEN WINDOW -------------------------------

    //-------------------------------- Domains WINDOW -------------------------------
    //function to open msg modal dialog
    function openDomainSelectionDialog(domainData, length) {
      domain = {};
      if (isEmpty(domainData)) initializeDomain_(domain);
      else domain = $.extend(true, {}, domainData); //making a deep copy
      domain.len = length;

      //check if window is already open... for now we are ignoring this
      domainDeffered = $q.defer();
      domainWindow = ngDialog.open({
        template: 'app/dialog/AddDomain/addDomain.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: domain
      });
      return domainDeffered.promise;
    } //end of open domain Seclection window
    //close the msg window
    // type : save -- when the domain window save is clicked
    //        cancel -- when the domain cancel window is clicked
    function closeDomainSelectionDialog(type) {
      if (!isEmpty(domainDeffered)) {
        if (type == 'save') {
          domainDeffered.resolve(domain);
        } else domainDeffered.resolve();
      }
      if (typeof (domainWindow) != 'undefined') {
        domainWindow.close();
      }
    } //end of close domain Dialog
    //function to initialize domain
    function initializeDomain_(d) {
      if (isEmpty(d.allotype)) d.allotype = '';
      if (isEmpty(d.domainType)) d.domainType = '';
      if (isEmpty(d.domainEnd)) d.domainEnd = '';
      if (isEmpty(d.entrezgeneID)) d.entrezgeneID = '';
      if (isEmpty(d.geneSymbol)) d.geneSymbol = '';
      if (isEmpty(d.heavyChainIsoType)) d.heavyChainIsoType = '';
      if (isEmpty(d.heavyChainIsoTypeMutation)) d.heavyChainIsoTypeMutation = '';
      if (isEmpty(d.lightChainIsoType)) d.lightChainIsoType = '';
      if (isEmpty(d.name)) d.name = '';
      if (isEmpty(d.regonizedAntigenFK)) d.regonizedAntigenFK = '';
      if (isEmpty(d.species)) d.species = '';
      if (isEmpty(d.domainStart)) d.domainStart = '';
      if (isEmpty(d.heavyChainIsoTypeMutation)) d.heavyChainIsoTypeMutation = '';
      if (isEmpty(d.source)) d.source = '';
      if (isEmpty(d.antigens)) d.antigens = [];
      if (isEmpty(d.len)) d.len = '';
    } //end of initialize domain

    //-------------------------------- End of Domains WINDOW -------------------------------

    //-------------------------------- Constructs WINDOW -------------------------------
    //function to open msg modal dialog
    function openConstructsSelectionDialog(constructsData) {
      constructs = {};
      if (isEmpty(constructsData)) initializeConstructs_(constructs);
      else constructs = $.extend(true, {}, constructsData); //making a deep copy

      //check if window is already open... for now we are ignoring this
      constructsDeffered = $q.defer();
      constructsWindow = ngDialog.open({
        template: 'app/dialog/AddConstructs/addConstructs.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: constructs
      });
      return constructsDeffered.promise;
    } //end of open constructs Seclection window
    //close the msg window
    // type : save -- when the constructs window save is clicked
    //        cancel -- when the constructs cancel window is clicked
    function closeConstructsSelectionDialog(type) {
      if (!isEmpty(constructsDeffered)) {
        if (type == 'save') {
          constructsDeffered.resolve(constructs);
        } else constructsDeffered.resolve();
      }
      if (typeof (constructsWindow) != 'undefined') {
        constructsWindow.close();
      }
    } //end of close constructs Dialog
    //function to initialize constructs
    function initializeConstructs_(ec) {
      if (isEmpty(ec.avgMolWt)) ec.avgMolWt = '';
      if (isEmpty(ec.plasmidID)) ec.plasmidID = '';
      if (isEmpty(ec.precursorAminoAcidSeq)) ec.precursorAminoAcidSeq = '';
    } //end of initialize domain

    //-------------------------------- End of Constructs WINDOW -------------------------------

    //-------------------------------- Expression Cassettes WINDOW -------------------------------
    //function to open msg modal dialog
    function openExpressionCassettesDialog(cassettesData) {
      cassettes = {};
      if (isEmpty(cassettesData)) initializeCassettes_(cassettes);
      else cassettes = $.extend(true, {}, cassettesData); //making a deep copy

      //check if window is already open... for now we are ignoring this
      cassettesDeffered = $q.defer();
      cassettesWindow = ngDialog.open({
        template: 'app/dialog/ExpressionCassettes/expressionCassettes.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: cassettes
      });
      return cassettesDeffered.promise;
    } //end of open constructs Seclection window
    //close the msg window
    // type : save -- when the constructs window save is clicked
    //        cancel -- when the constructs cancel window is clicked
    function closeExpressionCassettesDialog(type) {
      if (!isEmpty(cassettesDeffered)) {
        if (type == 'save') {
          cassettesDeffered.resolve(cassettes);
        } else cassettesDeffered.resolve();
      }
      if (typeof (cassettesWindow) != 'undefined') {
        cassettesWindow.close();
      }
    } //end of close constructs Dialog
    //function to initialize cassettes
    function initializeCassettes_(cas) {
      if (isEmpty(cas.enhancer)) cas.enhancer = '';
      if (isEmpty(cas.corePromoter)) cas.corePromoter = '';
      if (isEmpty(cas.entrezgeneID)) cas.entrezgeneID = '';
      if (isEmpty(cas.geneSymbol)) cas.geneSymbol = '';
      if (isEmpty(cas.name)) cas.name = '';
      if (isEmpty(cas.species)) cas.species = '';
    } //end of initialize cassettes
    //--------------------------------End of Expression Cassettes WINDOW -------------------------------

    //-------------------------------- AntiBody Isotype WINDOW -------------------------------
    //function to open msg modal dialog
    function openAntiBodyIsotypeSelectionDialog(antiBodyIsotypeData) {
      antiBodyIsotype = {};
      if (isEmpty(antiBodyIsotypeData)) initializeAntiBodyIsotype_(antiBodyIsotype);
      else antiBodyIsotype = $.extend(true, {}, antiBodyIsotypeData); //making a deep copy

      //check if window is already open... for now we are ignoring this
      antiBodyIsotypeDeffered = $q.defer();
      antiBodyIsotypeWindow = ngDialog.open({
        template: 'app/dialog/AntibodyIsotype/antibodyIsotype.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: antiBodyIsotype
      });
      return antiBodyIsotypeDeffered.promise;
    } //end of open antiBodyIsotype Seclection window
    //close the msg window
    // type : save -- when the antiBodyIsotype window save is clicked
    //        cancel -- when the antiBodyIsotype cancel window is clicked
    function closeAntiBodyIsotypeSelectionDialog(type) {
      if (!isEmpty(antiBodyIsotypeDeffered)) {
        if (type == 'save') {
          antiBodyIsotypeDeffered.resolve(antiBodyIsotype);
        } else antiBodyIsotypeDeffered.resolve();
      }
      if (typeof (antiBodyIsotypeWindow) != 'undefined') {
        antiBodyIsotypeWindow.close();
      }
    } //end of close antiBodyIsotype Dialog
    //function to initialize antiBodyIsotype
    function initializeAntiBodyIsotype_(d) {
      if (isEmpty(d.allotype)) d.allotype = '';
      if (isEmpty(d.heavyChainIsoType)) d.heavyChainIsoType = '';
      if (isEmpty(d.heavyChainIsoTypeMutation)) d.heavyChainIsoTypeMutation = '';
      if (isEmpty(d.lightChainIsoType)) d.lightChainIsoType = '';
      if (isEmpty(d.name)) d.name = '';
      if (isEmpty(d.species)) d.species = '';
    } //end of initialize domain

    //-------------------------------- End of AntiBody Isotype WINDOW -------------------------------


    //-------------------------------- Immunogen Selection WINDOW -------------------------------
    //function to open msg modal dialog
    function openImmunogenSelectionDialog(immData) {
      immunogen = {};
      if (isEmpty(immData)) initializeImmunogen_(immunogen);
      else immunogen = $.extend(true, {}, immData); //making a deep copy
      //check if window is already open... for now we are ignoring this
      immDeffered = $q.defer();
      immWindow = ngDialog.open({
        template: 'app/dialog/AddImmunogen/addImmunogen.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: immunogen
      });
      return immDeffered.promise;
    } //end of open imm Seclection window
    //close the msg window
    // type : save -- when the imm window save is clicked
    //        cancel -- when the imm cancel window is clicked
    function closeImmunogenSelectionDialog(type) {
      if (!isEmpty(immDeffered)) {
        if (type == 'save') {
          immDeffered.resolve(immunogen);
        } else immDeffered.resolve();
      }
      if (typeof (immWindow) != 'undefined') {
        immWindow.close();
      }
    } //end of close immSelection Dialog
    //function to initialize  immunogen
    function initializeImmunogen_(imm) {
      if (isEmpty(imm.corporateID)) imm.corporateID = '';
      if (isEmpty(imm.entrezgeneID)) imm.entrezgeneID = '';
      if (isEmpty(imm.geneSymbol)) imm.geneSymbol = '';
      if (isEmpty(imm.name)) imm.name = '';
      if (isEmpty(imm.species)) imm.species = '';
      if (isEmpty(imm.type)) imm.type = 'Protein';
      if (isEmpty(imm.lotID)) imm.lotID = '';
      if (isEmpty(imm.sequence)) imm.sequence = '';
    } //end of initialize  immunogen

    //-------------------------------- END OF Immunogen Selection WINDOW -------------------------------

    //-------------------------------- DAR Selection WINDOW -------------------------------
    //function to open msg modal dialog
    function openDarSelectionDialog(darData, conceptConjugates) {
      dar = {};
      if (isEmpty(darData)) initializeDARS_(dar);
      else dar = $.extend(true, {}, darData); //making a deep copy
      dar.conceptConjugates = $.extend(true, [], conceptConjugates);
      //check if window is already open... for now we are ignoring this
      darDeffered = $q.defer();
      darWindow = ngDialog.open({
        template: 'app/dialog/addDar/addDar.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: dar
      });
      return darDeffered.promise;
    } //end of open dar Seclection window
    //close the msg window
    // type : save -- when the dar window save is clicked
    //        cancel -- when the dar cancel window is clicked
    function closeDarSelectionDialog(type) {
      if (!isEmpty(darDeffered)) {
        if (type == 'save') {
          darDeffered.resolve(dar);
        } else darDeffered.resolve();
      }
      if (typeof (darWindow) != 'undefined') {
        darWindow.close();
      }
    } //end of close darSelection Dialog
    function initializeDARS_(dar) {
      if (isEmpty(dar.value)) dar.value = '';
      if (isEmpty(dar.method)) dar.method = '';
      if (isEmpty(dar.chemicalConjugate)) dar.chemicalConjugate = '';
    }

    //-------------------------------- END OF DAR Selection WINDOW -------------------------------

    //-------------------------------- Aggregation Selection WINDOW -------------------------------
    //function to open msg modal dialog
    function openAggregationSelectionDialog(aggregationData) {
      aggregation = {};
      if (isEmpty(aggregationData)) initializeAggregations_(aggregation);
      else aggregation = $.extend(true, {}, aggregationData); //making a deep copy
      //check if window is already open... for now we are ignoring this
      aggregationDeffered = $q.defer();
      aggregationWindow = ngDialog.open({
        template: 'app/dialog/addAggregation/addAggregation.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: aggregation
      });
      return aggregationDeffered.promise;
    } //end of open aggregation Seclection window
    //close the msg window
    // type : save -- when the aggregation window save is clicked
    //        cancel -- when the aggregation cancel window is clicked
    function closeAggregationSelectionDialog(type) {
      if (!isEmpty(aggregationDeffered)) {
        if (type == 'save') {
          aggregationDeffered.resolve(aggregation);
        } else aggregationDeffered.resolve();
      }
      if (typeof (aggregationWindow) != 'undefined') {
        aggregationWindow.close();
      }
    } //end of close aggregationSelection Dialog
    //utility method to init aggregation
    function initializeAggregations_(dar) {
      if (isEmpty(dar.percentAggMethod)) dar.percentAggMethod = '';
      if (isEmpty(dar.percentAggValue)) dar.percentAggValue = '';
    }

    //-------------------------------- END OF Aggregation Selection WINDOW -------------------------------


    //------------------------------------- Validation Msg Window --------------------------
    //function to open msg modal Validation Msg
    function openValidationMsgDialog(validationMsgData) {
      validationMsg = {};
      validationMsg = $.extend(true, {}, validationMsgData); //making a deep copy
      console.log(validationMsg);
      //check if window is already open... for now we are ignoring this
      validationMsgDeffered = $q.defer();
      validationMsgWindow = ngDialog.open({
        template: 'app/dialog/ValidationMsgDialog/validationMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: validationMsg
      });
      return validationMsgDeffered.promise;
    } //end of open domain Validation msg window

    //close the msg window
    // type : continue -- when the validation Msg window continue is clicked
    //        registerLot -- when the  validation Msg window register Lot is clicked
    //        cancel -- when t validation Msg window cancel is clicked
    function closeValidationMsgDialog(type) {
      validationMsgDeffered.resolve(type);
      if (typeof (validationMsgWindow) != 'undefined') {
        validationMsgWindow.close();
      }
    } //end of close domain Dialog
    //------------------------------------- End of Validation Msg Window -------------------

    //-------------------------------- Buffer Component WINDOW -------------------------------
    //open the Buffer Component dialog
    function openBufferComponentDialog(bufferData) {
      buffer = {};
      if (isEmpty(bufferData)) initializeBuffer_(buffer);
      else buffer = $.extend(true, {}, bufferData); //making a deep copy
      //check if window is already open... for now we are ignoring this
      bufferDeffered = $q.defer();
      bufferWindow = ngDialog.open({
        template: 'app/dialog/AddBuffer/addBuffer.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: buffer
      });
      return bufferDeffered.promise;
    } //end of open buffer Component window
    //close the msg window
    // type : save -- when the buffer window save is clicked
    //        cancel -- when the buffer cancel window is clicked
    function closeBufferComponentDialog(type) {
      if (!isEmpty(bufferDeffered)) {
        if (type == 'save') {
          bufferDeffered.resolve(buffer);
        } else bufferDeffered.resolve();
      }
      if (typeof (bufferWindow) != 'undefined') {
        bufferWindow.close();
      }
    } //end of close bufferComponent Dialog
    function initializeBuffer_(buffer) {
      if (isEmpty(buffer.component)) buffer.component = '';
      if (isEmpty(buffer.amount)) buffer.amount = '';
      if (isEmpty(buffer.unit)) buffer.unit = '';
    }

    //-------------------------------- END OF Buffer Component WINDOW -------------------------------

    //function to check if a given object is empty
    //@NOTE , could have used _.isEmpty, but I want to trim the string as well before checking
    //      for emptiness
    function isEmpty(obj) {
      if (obj == null) return true;
      if (_.isString(obj)) obj = $.trim(obj);
      return _.isEmpty(obj);
    } //end of isEmpty

    //opens the confirmation window
    function openConfirmationDialog(msg, type) {
      var template = "";
      if (isEmpty(type))
        template = 'app/dialog/ConfirmationDomain/confirmation.html';
      else if (type == 'annotation')
        template = 'app/dialog/ConfirmationDomain/confirmationAnnotation.html';
      else if (type == 'antigens')
        template = 'app/dialog/ConfirmationDomain/confirmationWarningAntigen.html';
      else if (type == 'editConcept')
        template = 'app/dialog/ConfirmationDomain/confirmationEditConcept.html'
      confirmDeffered = $q.defer();
      confirmationWindow = ngDialog.open({
        template: template,
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: msg
      });
      return confirmDeffered.promise;
    }

    //closes the confirmation window
    function closeConfirmationDialog(type) {
      if (!isEmpty(confirmDeffered)) {
        confirmDeffered.resolve(type);
      }
      if (typeof (confirmationWindow) != 'undefined') {
        confirmationWindow.close();
      }
    }

    function openErrorMessageDialog(errMsg) {
      errorWindow = ngDialog.open({
        template: 'app/dialog/ErrorMsgDialog/errorMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: errMsg
      });
    }

    function closeErrorMessageDialog() {
      errorWindow.close();
    }
    //open the related entity dialog
    function showRelatedEntityDialog(id) {
      relatedEntityWindow = ngDialog.open({
        template: 'app/dialog/relatedEntityMsg.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        appendTo: id
      });
    }
    //close the related entity dialog
    function closeRelatedEntityDialog(scroll) {
      $timeout(function () {
        if (typeof (relatedEntityWindow) != 'undefined') relatedEntityWindow.close();
        if (scroll) {
          var scrollElement = angular.element(document.getElementById('chart'));
          $document.scrollToElement(scrollElement, 50, 1000);
        }
      }, 500);
    }
    //open the searchFilter dialog
    function showSearchFilterDialog() {
      searchFilterWindow = ngDialog.open({
        template: 'app/dialog/searchFilter.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });
    }
    //close the searchFilter dialog
    function closeSearchFilterDialog(anchorSearchScroll) {
      searchFilterWindow.close();
      if (anchorSearchScroll) {
        var scrollElement = angular.element(document.getElementById('searchScroll'));
        $document.scrollToElement(scrollElement, 50, 1000);
        //notifyService.displayHtmlNotification('<p>Scrolling to results</p>', 'alert-info', 5000);
      }
    }

    function openGbisRequestForm(lot, pharmacy) {
      var vialInfo = {};
      vialInfo.lot = lot;
      vialInfo.pharmacy = pharmacy;
      gbisRequestFormWindow = ngDialog.open({
        template: 'app/dialog/GbisInventory/gbisInventory.html',
        className: 'ngdialog-theme-custom',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        data: vialInfo
      });
    }

    function closeGbisRequestForm() {
      gbisRequestFormWindow.close();
    }
  }
})();
