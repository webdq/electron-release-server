angular
  .module("app.admin.add-flavor-modal", [])
  .controller("AddFlavorModalController", [
    "$scope",
    "DataService",
    "$uibModalInstance",
    function ($scope, DataService, $uibModalInstance) {
      $scope.flavor = {
        name: "",
      };

      $scope.addFlavor = function () {
        DataService.createFlavor($scope.flavor).then(
          $uibModalInstance.close,
          function () {}
        );
      };

      $scope.closeModal = $uibModalInstance.dismiss;
    },
  ]);
