(function () {
  'use strict';

  angular.module('gbrs.services').service('notifyService', notifyService);

  notifyService.$inject = ['notify'];

  function notifyService(notify) {

    return {
      displayHtmlNotification: displayHtmlNotification,
      displayMsgNotification: displayMsgNotification,
    }

    function displayHtmlNotification(msg, classes, duration) {
      return notify({
        messageTemplate: '<span>' + msg + '</span>',
        classes: classes,
        duration: duration 
      });
    }

    function displayMsgNotification(msg, classes) {
      return notify({
        message: msg,
        classes: classes,
      });
    }
  }
})();