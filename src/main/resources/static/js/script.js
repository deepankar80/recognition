/*function validationCtrl($scope) {
   var validUsername = "Thodoris Bais";
   var validEmail = "thodoris.bais@gmail.com";
   
   $scope.reset = function(){
		$scope.username = validUsername;
		$scope.email = validEmail;
   }   
   
   $scope.checkData = function() {
		if ($scope.username != validUsername || $scope.email != validEmail) {
			alert("The data provided do not match with the default owner");
		} else {
			alert("Seems to be ok!");
		}
	}
}*/

var app = angular.module('form-example', []);

app.directive('passwordValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
                    ctrl.$setValidity('pwd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('pwd', false);                    
                    return undefined;
                }

            });
        }
    };
});