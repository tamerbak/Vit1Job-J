/**
 * Created by Denni Adam on 16.09.15.
 */
angular.module('comboBoxDirective', [])

  // >> Directive >> comboBox >>
  /**
   * @example:
   * <input / div ...
   *    combo-box="events"
   *    cbx-arr="events"
   *    cbx-qry="data.event"
   *    cbx-placeholder="Событие"
   * >
   */
  .directive('comboBox', function factory($timeout) {
    return {
      // E -> <my-dir>, A -> <p my-dir="value">, C -> in class, M -> in comment
      restrict: 'A',

      controller: function($scope, $element, $attrs, $transclude, $ionicModal) {
        $element.on("click", function () {$scope.openModal()});

        $scope.data = {};
        if ($scope.cbxQry !== undefined) {
          $scope.data.query = $scope.cbxQry;
        } else if($scope.ngModel !== undefined) {
          $scope.data.query = $scope.ngModel;
        } else {
          console.error('comboBox error: use ngModel or cbxQry');
        }

        if ($scope.comboBox !== undefined) {
          $scope.cbxArray = $scope.comboBox;
        } else if ($scope.cbxArr !== undefined) {
          $scope.cbxArray = $scope.cbxArr;
        } else {
          console.error('comboBox error: use comboBox or cbxArr');
        }

        $scope.cbxHeaderClass = $scope.cbxHeaderClass || 'bar-positive';
        $scope.cbxOkCaption = $scope.cbxOkCaption || 'Ok';


        $scope.cbxFilterCaption = $scope.cbxFilterCaption || 'Фильтр данных';
        $scope.cbxEmptyFilterCaption = $scope.cbxEmptyFilterCaption || 'Поиск не дал результатов';
        
        var closeOnSelect = $attrs.hasOwnProperty('cbxCloseOnSelect');

        $ionicModal.fromTemplateUrl('lib/ionic-combo-box/combo-box-modal.html', {
          scope: $scope,
          animation: 'slide-in-up',
          focusFirstInput: true
        }).then(function (modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function () {
          $scope.modal.show();
        };

        $scope.clearQuery = function () {
          $scope.data.query = '';
        };

        $scope.closeModal = function () {
          if ($scope.cbxQry !== undefined) {
            $scope.cbxQry = $scope.data.query;
          } else {
            $scope.ngModel = $scope.data.query;
          }
          $scope.modal.hide();
        };

        $scope.selectItem = function (index) {
          $scope.data.query = $scope.cbxArray[index].value;
          if (closeOnSelect) $scope.closeModal();
        };
      },

      scope: {
        comboBox: '=',
        cbxArr: '=',
        cbxQry: '=',
        ngModel: '=',
        cbxPlaceholder: '@',
        cbxFilterCaption: '@',
        cbxEmptyFilterCaption: '@',
        cbxCloseOnSelect: '@',
        cbxHeaderClass: '@',
        cbxOkCaption: '@'
      }
    };
  })
// << Directive << comboBox <<

;