//directive used for multi instance tabs with both state and routes used together to replace ui-router-tabs
//params:
//  id : the dom id
//  data : custom tab array handled outside to show the tabs

//close button for tabs redirects to dashboard if only one tab is opened but if more than 1 tabs are opened and trying to close the active tab then it goes to the previous tab or if trying to close a non active tab the tab gets closed but the state remains in active tab without any redirects.
(function () {
  'use strict';

  angular.module('gbrs.components').directive('multiInstanceTabs', multiInstanceTabs);
  multiInstanceTabs.$inject = ['$rootScope', '$compile', '$location', '$state', 'Config', '$q', 'dialogService', 'storageService', 'homeService', 'stepNavBreadcrumbs', 'profileService', 'entityService', 'viewPathUtil', 'textUtil'];

  function multiInstanceTabs($rootScope, $compile, $location, $state, Config, $q, dialogService, storageService, homeService, stepNavBreadcrumbs, profileService, entityService, viewPathUtil, textUtil) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        data: '=',
        type: '@',
        justified: '@',
        vertical: '@',
        class: '@'
      },
      link: link
    };

    function getTemplate(scope) {
      var html = '';
      //type="type" vertical="{{vertical}}" justified="{{justified}}"
      html += '<tabset class="{{class}}">';
      html += '<tab ng-repeat="tab in data" select="setSelectedTab(tab)" active="tab.active" context-menu="menuOptions(tab,$event,$index)" context-menu-class="context-class">';
      html += '<tab-heading>';
      html += '<p style="margin: 0 0 0px;font-size: 14px !important;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;min-width: 50px;" tooltip-html-unsafe="{{getHtmlTooltip(tab)}}"';
      html += 'tooltip-placement="top" tooltip-append-to-body="true">{{tab.heading}}&nbsp;&nbsp;</p><span class="pull-right" ng-if="validTabClose(tab)"><i class="glyphicon glyphicon-remove" ng-click="closeTab(tab,$event,$index)"></i></span>';
      html += '</tab-heading>';
      //if (tab.route !== "dashboard" && tab.route !== "search")
      //html += '<button class="glyphicon glyphicon-remove" ng-click="closeTab(tab)" style="color:red"></button>'
      html += '</tab>';
      html += '</tabset>';
      return html;
    }


    function link(scope, element, attrs) {
      scope.menuOptions = function (tab, event, id) {
        //        console.log(tab);
        //        console.log(event);
        //        console.log(id);
        if (tab.route !== "dashboard" && tab.route !== "search") {
          return [
        ['Close Other Tabs', function ($itemScope, contextEvent) {
              //console.log($itemScope.tab);
              var deleteIdx = '';
              $.each(scope.data, function (i, tab) {
                if (!_.isEmpty(tab) && tab.heading !== $itemScope.tab.heading) {
                  //console.log(tab.heading);
                  contextEvent.preventDefault();
                  contextEvent.stopPropagation();
                  //console.log(scope.data);
                  //routes views
                  if (!_.isEmpty(storageService.getObject('viewObj'))) {
                    var viewArray = storageService.getObject('viewObj');
                    viewArray = _.filter(viewArray, function (view) {
                      if (_.isNumber(view.lot)) return view.lot.toString() !== tab.heading;
                      else return view.moniker !== tab.heading;
                    });
                    storageService.saveObject('viewObj', viewArray);
                  }
                  if (!_.isEmpty(storageService.getValue('allTabs'))) {
                    var allTabs = storageService.getValue('allTabs');
                    allTabs = _.filter(allTabs, function (at) {
                      return at !== tab.heading;
                    });
                    storageService.saveValue('allTabs', allTabs);
                  }

                  if (tab.route !== undefined && tab.route !== "dashboard" && tab.route !== "search" && ($itemScope.tab.route == "add" || $itemScope.tab.route == "edit") && (_.contains(_.pluck(scope.data, 'route'), 'add') || _.contains(_.pluck(scope.data, 'route'), 'edit'))) {
                    console.log("add/edit  CONCEPT active tab " + tab.route);
                    dialogService.openConfirmationDialog("Are you sure you want to close all tabs?<br><br>Any registrations or edits that have not yet been submitted will be lost.").then(function (type) {
                      if (type == 'ok') {
                        homeService.setEditLotTabEnabled(false);
                        homeService.setLotTabEnabled(false);
                        storageService.removeValueFromLocalStorage('editLotID');
                        storageService.removeValueFromLocalStorage('addLotID');
                        scope.data = _.filter(scope.data, function (filterTab) {
                          return filterTab.heading == 'Dashboard' || filterTab.heading == 'Search' || filterTab.heading == $itemScope.tab.heading;
                        });
                        return;
                      }
                    });
                  } else if (tab.route !== undefined && tab.route !== "dashboard" && tab.route !== "search" && ($itemScope.tab.route == "addLot" || $itemScope.tab.route == "editLot") && (_.contains(_.pluck(scope.data, 'route'), 'addLot') || _.contains(_.pluck(scope.data, 'route'), 'editLot'))) {
                    console.log("add/edit  LOT active tab " + tab.route);
                    dialogService.openConfirmationDialog("Are you sure you want to close all tabs?<br><br>Any registrations or edits that have not yet been submitted will be lost.").then(function (type) {
                      if (type == 'ok') {
                        homeService.setEditTabEnabled(false);
                        homeService.setAddTabEnabled(false);
                        //storageService.removeValueFromLocalStorage('addEntity');
                        storageService.removeValueFromLocalStorage('editMonikerID');
                        scope.data = _.filter(scope.data, function (filterTab) {
                          return filterTab.heading == 'Dashboard' || filterTab.heading == 'Search' || filterTab.heading == $itemScope.tab.heading;
                        });
                        return;
                      }
                    });
                  }
                  scope.data = _.filter(scope.data, function (filterTab) {
                    return !_.isEmpty(filterTab.route) || (filterTab.heading == $itemScope.tab.heading && !_.isEmpty($itemScope.tab.link));
                    //return filterTab.heading == 'Dashboard' || filterTab.heading == 'Search' || filterTab.heading == $itemScope.tab.heading;
                  });
                  //console.log(scope.data);
                }
                contextEvent.preventDefault();
                contextEvent.stopPropagation();
                storageService.removeFromLocalStorage(['viewID']);
                storageService.removeValueFromLocalStorage('viewLotID');
                //storageService.removeValueFromLocalStorage('addLotID');
                return;
              });

              if ((_.contains(_.pluck(scope.data, 'route'), 'add') || _.contains(_.pluck(scope.data, 'route'), 'edit') || _.contains(_.pluck(scope.data, 'route'), 'addLot') || _.contains(_.pluck(scope.data, 'route'), 'editLot')) && !_.isEmpty($itemScope.tab.link)) {
                console.log("add/edit present but not active tab " + tab.route);
                dialogService.openConfirmationDialog("Are you sure you want to close all tabs?<br><br>Any registrations or edits that have not yet been submitted will be lost.").then(function (type) {
                  if (type == 'ok') {
                    entityService.initializeLot();
                    homeService.setEditLotTabEnabled(false);
                    homeService.setLotTabEnabled(false);
                    storageService.removeValueFromLocalStorage('editLotID');
                    storageService.removeValueFromLocalStorage('addLotID');

                    homeService.setEditTabEnabled(false);
                    homeService.setAddTabEnabled(false);
                    storageService.removeValueFromLocalStorage('addEntity');
                    storageService.removeValueFromLocalStorage('editMonikerID');
                    scope.data = _.filter(scope.data, function (filterTab) {
                      return filterTab.heading == 'Dashboard' || filterTab.heading == 'Search' || filterTab.heading == $itemScope.tab.heading;
                    });
                    return;
                  }

                });
              }
                  }], {
              text: 'Close All Tabs',
              click: function ($itemScope, contextEvent) {
                if (_.contains(_.pluck(scope.data, 'route'), 'add') || _.contains(_.pluck(scope.data, 'route'), 'edit') || _.contains(_.pluck(scope.data, 'route'), 'addLot') || _.contains(_.pluck(scope.data, 'route'), 'editLot')) {
                  dialogService.openConfirmationDialog("Are you sure you want to close all tabs?<br><br>Any registrations or edits that have not yet been submitted will be lost.").then(function (type) {
                    if (type == 'ok') {
                      $.each(scope.data, function (i, tab) {
                        //console.log(tab);
                        //&& !_.isEmpty(tab.link)
                        if (!_.isEmpty(tab)) {
                          //console.log(tab.heading);
                          //scope.closeTab(tab, contextEvent, i);
                          //homeService.closeTab(tab.heading);
                          contextEvent.preventDefault();
                          contextEvent.stopPropagation();
                          storageService.removeFromLocalStorage(['viewID']);
                          storageService.removeValueFromLocalStorage('viewObj');
                          storageService.removeValueFromLocalStorage('allTabs');
                          entityService.initializeEntity();
                          entityService.initializeLot();
                          homeService.setEditTabEnabled(false);
                          homeService.setAddTabEnabled(false);
                          homeService.setLotTabEnabled(false);
                          homeService.setEditLotTabEnabled(false);
                          storageService.removeFromLocalStorage(['viewID']);
                          storageService.removeValueFromLocalStorage('editMonikerID');
                          storageService.removeValueFromLocalStorage('editLotID');
                          storageService.removeValueFromLocalStorage('addLotID');
                          storageService.removeValueFromLocalStorage('addEntity');
                          storageService.removeValueFromLocalStorage('viewLotID');
                          storageService.removeValueFromLocalStorage('addLotID');
                          scope.data = _.filter(scope.data, function (filterTab) {
                            //return filterTab.heading !== tab.heading;
                            return filterTab.heading == "Dashboard" || filterTab.heading == "Search";
                          });
                          //console.log(scope.data);
                          if (scope.data.length == 2) {
                            contextEvent.preventDefault();
                            contextEvent.stopPropagation();
                            $state.go('dashboard');
                            return;
                          }
                        }
                      });
                    }
                  });
                } else {
                  $.each(scope.data, function (i, tab) {
                    //console.log(tab);
                    //&& !_.isEmpty(tab.link)
                    if (!_.isEmpty(tab)) {
                      //console.log(tab.heading);
                      //scope.closeTab(tab, contextEvent, i);
                      //homeService.closeTab(tab.heading);
                      contextEvent.preventDefault();
                      contextEvent.stopPropagation();
                      storageService.removeFromLocalStorage(['viewID']);
                      storageService.removeValueFromLocalStorage('viewObj');
                      storageService.removeValueFromLocalStorage('allTabs');
                      entityService.initializeEntity();
                      entityService.initializeLot();
                      homeService.setEditTabEnabled(false);
                      homeService.setAddTabEnabled(false);
                      homeService.setLotTabEnabled(false);
                      homeService.setEditLotTabEnabled(false);
                      storageService.removeFromLocalStorage(['viewID']);
                      storageService.removeValueFromLocalStorage('editMonikerID');
                      storageService.removeValueFromLocalStorage('editLotID');
                      storageService.removeValueFromLocalStorage('addLotID');
                      storageService.removeValueFromLocalStorage('addEntity');
                      storageService.removeValueFromLocalStorage('viewLotID');
                      storageService.removeValueFromLocalStorage('addLotID');
                      scope.data = _.filter(scope.data, function (filterTab) {
                        //return filterTab.heading !== tab.heading;
                        return filterTab.heading == "Dashboard" || filterTab.heading == "Search";
                      });
                      //console.log(scope.data);
                      if (scope.data.length == 2) {
                        contextEvent.preventDefault();
                        contextEvent.stopPropagation();
                        $state.go('dashboard');
                        return;
                      }
                    }
                  });
                }
                //console.log(_.pluck(scope.data, 'heading'));
              }
                  },
                  ];
        } else {
          event.preventDefault();
          event.stopPropagation();
          return [];
        }
      };
      element.append(getTemplate(scope));
      //$state change event catch to find the current tab
      var unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function () {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          console.log(fromState.name);
          console.log(toState.name);
          if (s.include(fromState.name, 'add.step2_') && toState.name == 'search' && _.isEmpty(storageService.getObject('addEntity'))) event.preventDefault();
          //if (s.include(fromState.name, 'edit.step3_') && toState.name == 'search' && _.isEmpty(storageService.getObject('addEntity')) && _.isEmpty(storageService.getValue('editMonikerID'))) event.preventDefault();
          if (s.include(fromState.name, 'search.') && toState.name == 'search') event.preventDefault();
        });
        scope.update_tabs();
      });

      scope.$on('$destroy', unbindStateChangeSuccess);

      //$route change event catch to find the current tab when route gets changed
      var unbindRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          //if (_.isEmpty(toParams.moniker) && fromState.name !== 'edit' && s.include(fromState.name, 'edit.step3_') && toState.name == 'addLot') event.preventDefault();
        });
        scope.update_tabs();
      });

      scope.$on('$destroy', unbindRouteChangeSuccess);

      //tab select method sets the path to that tab on tab click accordingly for states and routes
      scope.setSelectedTab = function (tab) {
        if (!_.isEmpty(tab.link) && s.include($location.url(), '/print')) $location.path(tab.link + '/print');
        if (!_.isEmpty(tab.link) && s.include($location.url(), '/inventoryRequest')) $location.path(tab.link + '/inventoryRequest');
        else if (!_.isEmpty(tab.link) && !s.include($location.url(), '/print') && !s.include($location.url(), '/inventoryRequest')) $location.path(tab.link);
        else if (!_.isEmpty(tab.route) && tab.route !== 'add') $state.go(tab.route);
        else if (!_.isEmpty(tab.route) && tab.route == 'add' && _.isEmpty(storageService.getObject('addEntity'))) $state.go('add.step1');
        else if (!_.isEmpty(tab.route) && tab.route == 'add' && !_.isEmpty(storageService.getObject('addEntity'))) $state.go('add');
      };

      scope.getHtmlTooltip = function (tab) {
        var html = angular.element("<span/>");
        html.append("<span><strong>" + tab.heading + "</strong></span>");
        if (!textUtil.isEmpty(tab.moniker)) html.append("<span><br>" + tab.moniker + "</span>");
        if (!textUtil.isEmpty(tab.name)) html.append("<span><br><em>" + tab.name + "</em></span>");
        return html.html();
      }

      //method to close tab on close button click
      scope.closeTab = function (tab, event, idx) {
        //prevents the tab click and the tab clos button is called to close the tab rather than selecting a tab and closiong it, inactive tab can also be closed with this stopPropagation
        event.preventDefault();
        event.stopPropagation();
        if (scope.data[idx].route == 'add') {
          if (!s.include(stepNavBreadcrumbs.activeTabs(), 'step4_' + entityService.returnEntitySubType())) {
            dialogService.openConfirmationDialog("Are you sure, you want to cancel this add registration?").then(function (type) {
              if (type == 'ok') {
                storageService.removeValueFromLocalStorage('addEntity');
                entityService.initializeEntity();
                $state.go('dashboard');
                homeService.setAddTabEnabled(false);
                homeService.setEditTabEnabled(false);
                scope.data = _.filter(scope.data, function (filterTab) {
                  return filterTab.heading !== scope.data[idx].heading;
                });
              }
            });
          } else {
            storageService.removeValueFromLocalStorage('addEntity');
            entityService.initializeEntity();
            $state.go('dashboard');
            homeService.setAddTabEnabled(false);
            homeService.setEditTabEnabled(false);
          }
        } else if (scope.data[idx].route == 'edit') {
          dialogService.openConfirmationDialog("Are you sure you want to cancel this edit?").then(function (type) {
            if (type == 'ok') {
              storageService.removeValueFromLocalStorage('addEntity');
              entityService.initializeEntity();
              if (!_.isEmpty(storageService.getValue('editMonikerID'))) viewPathUtil.conceptLink(storageService.getValue('editMonikerID'));
              else $state.go('dashboard');
              homeService.setEditTabEnabled(false);
              homeService.setAddTabEnabled(false);
              scope.data = _.filter(scope.data, function (filterTab) {
                return filterTab.heading !== scope.data[idx].heading;
              });
            }
          });
        } else if (scope.data[idx].route == 'addLot') {
          dialogService.openConfirmationDialog("Are you sure you want to cancel this lot registration?").then(function (type) {
            if (type == 'ok') {
              entityService.initializeLot();
              $state.go('dashboard');
              homeService.setLotTabEnabled(false);
              homeService.setEditLotTabEnabled(false);
              scope.data = _.filter(scope.data, function (filterTab) {
                return filterTab.heading !== scope.data[idx].heading;
              });
            }
          });
        } else if (scope.data[idx].route == 'editLot') {
          dialogService.openConfirmationDialog("Are you sure you want to cancel this edit?").then(function (type) {
            if (type == 'ok') {
              entityService.initializeLot();
              if (!_.isEmpty(storageService.getValue('editLotID'))) viewPathUtil.lotLink(storageService.getValue('editLotID'));
              else $state.go('dashboard');
              homeService.setLotTabEnabled(false);
              homeService.setEditLotTabEnabled(false);
              scope.data = _.filter(scope.data, function (filterTab) {
                return filterTab.heading !== scope.data[idx].heading;
              });
            }
          });
        } else if (s.include(scope.data[idx].link, '/view/')) {
          storageService.removeFromLocalStorage(['viewID']);
          storageService.removeObjectFromIndex('viewObj', _.indexOf(storageService.getValue('allTabs'), scope.data[idx].heading));
          if (!_.isEmpty(storageService.getObject('relEntViewer')) && _.contains(_.pluck(storageService.getObject('relEntViewer'), 'moniker'), scope.data[idx].heading)) {
            var relNewObj = _.reject(storageService.getObject('relEntViewer'), function (rel) {
              return rel.moniker == scope.data[idx].heading;
            });
            storageService.saveObject('relEntViewer', relNewObj);
          }
          homeService.closeTab(scope.data[idx].heading);
          if (!_.isEmpty(storageService.getValue('allTabs')) && storageService.getValue('allTabs').length == 1) {
            $location.search('');
            $location.path('/dashboard');
          }
          if (!_.isEmpty(storageService.getValue('allTabs'))) {
            var allTabs = storageService.getValue('allTabs');
            allTabs = _.filter(allTabs, function (at) {
              return at !== scope.data[idx].heading;
            });
            storageService.saveValue('allTabs', allTabs);
          }
          scope.data = _.filter(scope.data, function (filterTab) {
            return filterTab.heading !== scope.data[idx].heading;
          });
          $state.go('dashboard');
        } else if (s.include(scope.data[idx].link, '/viewLot')) {
          homeService.closeTab(scope.data[idx].heading);
          storageService.removeFromLocalStorage(['viewLotID']);
          storageService.removeObjectFromIndex('viewObj', _.indexOf(storageService.getValue('allTabs'), scope.data[idx].heading));
          if (!_.isEmpty(storageService.getValue('allTabs')) && storageService.getValue('allTabs').length == 1) {
            $location.search('');
            $location.path('/dashboard');
          }
          if (!_.isEmpty(storageService.getValue('allTabs'))) {
            var allTabs = storageService.getValue('allTabs');
            allTabs = _.filter(allTabs, function (at) {
              return at !== scope.data[idx].heading;
            });
            storageService.saveValue('allTabs', allTabs);
          }
          scope.data = _.filter(scope.data, function (filterTab) {
            return filterTab.heading !== scope.data[idx].heading;
          });
          $state.go('dashboard');
        }
      }

      //close button on tabs excluding dashboard and search tabs
      scope.validTabClose = function (tab) {
        if (tab.route !== "dashboard" && tab.route !== "search" && tab.route !== "relatedEntityViewer")
          return true;
        return false;
      }

      //method is called everytime a state is changed or a route is changed based on url to find the active current tab based on link or route provided to this directive from home controller
      scope.update_tabs = function () {
        console.log(decodeURI($location.url()));
        var currentTab = _.find(scope.data, function (tab) {
          //console.log(s.include($location.url(), tab.link));
          if (!_.isEmpty(tab.link) && s.include($location.url(), '/print') && s.include(tab.link + '/print', decodeURI($location.url()))) return tab;
          if (!_.isEmpty(tab.link) && s.include($location.url(), '/inventoryRequest') && s.include(tab.link + '/inventoryRequest', decodeURI($location.url()))) return tab;
          if (!_.isEmpty(tab.link) && !s.include($location.url(), '/print') && !s.include($location.url(), '/inventoryRequest') && s.include(tab.link, decodeURI($location.url()))) return tab;
          if (!_.isEmpty(tab.route) && s.include($location.url(), '/' + tab.route + '?') || ($location.url() == '/' + tab.route) || ($location.url() == '/' + tab.route + '/' + $location.$$url.split('/')[2])) return tab;
        });
        console.log(currentTab);
        if (!_.isEmpty(currentTab) && !currentTab.active) currentTab.active = true;
        scope.currentTab = currentTab;
      };
      $compile(element.contents())(scope);
    } //end of link
  } //end of directive
})();
