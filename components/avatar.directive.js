//directive used to show user avatar when there is a profile image or just shows person icon
//params:
//  id : the dom id
//  type : S,M,L small/medium/large sizes of the image-(Not Required 's' by default)
//  height : custom height of the image in pixel(px)
(function () {
  'use strict';

  angular.module('gbrs.components').directive('avatar', avatar);
  avatar.$inject = ['$compile', 'Config', '$q'];

  function avatar($compile, Config, $q) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        username: '@',
        type: '@',
        height: '@'
      },
      link: link
        //template: '<span class="icon-user" style="color:#337ab7 !important" ng-if="!hasImage"></span><img ng-src="{{profileimage}}" ng-if="hasImage">'
    };

    function getTemplate(scope) {
      var html = '';
      html += '<span class="icon-user" style="color:#337ab7 !important" ng-if="!hasImage"></span>';
      html += '<img ';
      if (!_.isEmpty(scope.height)) html += 'style="height:' + scope.height + ';border-radius: 50%;"';
      html += 'ng-src="{{profileimage}}" ng-if="hasImage">';
      return html;
    }

    function isImage_(src, index) {
      var deferred = $q.defer();
      var image = new Image();
      image.onerror = function () {
        deferred.reject();
      };
      image.onload = function () {
        deferred.resolve(index);
      };
      image.src = src;
      return deferred.promise;
    }

    //link function
    function link(scope, element, attrs) {
      var type = '';
      element.append(getTemplate(scope));
      if (!_.isEmpty(scope.type)) type = scope.type.toUpperCase();
      else type = "S";
      scope.hasImage = false;
      var src = Config.MystiesURL + scope.username + "_" + type + "Thumb.jpg";
      isImage_(src, -1).then(function (result) {
        scope.hasImage = true;
        scope.profileimage = Config.MystiesURL + scope.username + "_" + type + "Thumb.jpg";
      });
      $compile(element.contents())(scope);
    }
  } // end of directive
})();