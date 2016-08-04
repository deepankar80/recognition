angular.module("textAngularTest", ['textAngular', "ui.bootstrap", 'toggle-switch','dialogs']);

function wysiwygeditor($scope, $http, $log, $window, $location,$dialogs) {
	$scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
	$scope.htmlcontent = '';
	$scope.disabled = false;
	$scope.typeaheadCategoriy = ['Client Focussed Delivery (CFD)', 'Creativity', 'People Growth', 'Relationship', 'Openness', 'Leadership', 'Fresh Face', 'Fundoo'];
	$scope.typeaheadAccounts = [{
							'id'    : '102',
							'value' : 'Wellington'
						},
						{
							'id'    : '101',
							'value' : 'Goldman'
						}
					  ];
	
	$scope.loggedInUser;
	$scope.votes = {};
	$scope.winners = {};
	$scope.tabId = 0;
	$scope.allWinners;
	$scope.myNominations;
	$scope.recognitionCutOff;
	$scope.isGuestUser = true;
	$scope.periodId;
	
	if($location.path() == "/firstTab") {
		$scope.tabId = 1;
	} else if($location.path() == "/secondTab") {
		$scope.tabId = 2;
	}  else if($location.path() == "/editTab") {
		$scope.tabId = 4;
	}  else if($location.path() == "/adminTab") {
		$scope.tabId = 6;
	}  else if($location.path() == "/") {
		$scope.tabId = 0;
	}
	
	$scope.isAfterCurrentDate = function(date) {
		return (new Date() > new Date(date ));
	}
	
	$scope.isBeforeCurrentDate = function(date) {
		return (new Date() > new Date(date));
	}
	
	$scope.isBeforeAndEqualCurrentDate = function(date) {
		var dt = new Date(date);
		dt.setDate(dt.getDate() + 1);
		return (new Date() > dt);
	}
	
	$scope.getPersons = function(val) {
		return $http.get('personSearchTypeaheadDynamic', {
			params : {
				personSearchString : val,
				accountId : $scope.loggedInUser.accountId
			}
		}).then(function(res) {
			return res.data;
		});
	};

	$scope.submitVotes = function() {
		console.log($scope.votes);
		
		$scope.formData = {
			'votes' : $scope.votes,
			'submittedBy' : $scope.loggedInUser.oracleId,
			'periodId' : $scope.periodId,
			'accountId': $scope.loggedInUser.accountId
		};
		
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/submitVotes',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : $scope.formData
		}).success(function(data) {
			alert("Votes Saved Successfully.");
			$window.location.href = '/sapient#firstTab';
		});
	}

	$scope.updateMember = function() {
		var WinNetwork = new ActiveXObject("WScript.Network");
		
		$scope.formData = {
				'name' : $scope.editUser.name,
				'projectDesc' : $scope.editUser.project,
				'officeLocation' : $scope.editUser.location,
				'oracleId' : $scope.editUser.oracleId,
				'ntLogin' : $scope.editUser.ntLogin,
				'accountId': $scope.editUser.account.id,
				'recognitionTeamFlag' : $scope.editUser.recognitionTeamFlg
		};
		
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/updateMember',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : $scope.formData
		}).success(function(data) {
			$scope.loadLoggedInUser();
			alert("Member Saved Successfully.");
			//$window.location.href = '/sapient';
			$window.location.reload();
		});
	}
	
	$scope.updateCutoff = function() {
		if ($scope.recognitionDescription == null || $scope.recognitionDescription == undefined) {
			alert("Recognition Description can not be blank");
			return;
		}
		
		if ($scope.recognitionPeriodStart == null || $scope.recognitionPeriodStart == undefined) {
			alert("Recognition Period Start can not be blank");
			return;
		}
		
		if ($scope.recognitionPeriodEnd == null || $scope.recognitionPeriodEnd == undefined) {
			alert("Recognition Period End can not be blank");
			return;
		}
		
		if ($scope.recognitionPeriodCutoff == null || $scope.recognitionPeriodCutoff == undefined) {
			alert("Recognition Period Cutoff can not be blank");
			return;
		}
		
		if ($scope.votingCutoff == null || $scope.votingCutoff == undefined) {
			alert("Voting Cutoff can not be blank");
			return;
		}
		
		var startDt = new Date($scope.recognitionPeriodStart).getTime();
		var endDt = new Date($scope.recognitionPeriodEnd).getTime();
		var cutOffDt = new Date($scope.recognitionPeriodCutoff).getTime();
		var votingDt = new Date($scope.votingCutoff).getTime();
		
		if(startDt > endDt) {
			alert("Start date shouldn't be greater than end date.");
			return;
		}
		if(cutOffDt > endDt || cutOffDt < startDt) {
			alert("cutOff date should be between start and end dates.");
			return;
		}
		if(votingDt > endDt || votingDt < startDt) {
			alert("voting date should be between start and end dates.");
			return;
		}
		
		if(cutOffDt > votingDt) {
			alert("cutOff date shouldn't be greater than voting date.");
			return;
		}
		
		$scope.adminFormData = {
				'recognitionDescription' : $scope.recognitionDescription,
				'recognitionPeriodStart' : $scope.recognitionPeriodStart,
				'recognitionPeriodEnd' : $scope.recognitionPeriodEnd,
				'recognitionPeriodCutoff' : $scope.recognitionPeriodCutoff,
				'votingCutoff' : $scope.votingCutoff,
				'periodId' : $scope.periodId,
				'accountId': $scope.loggedInUser.accountId
		};
		
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/updateCutOff',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : $scope.adminFormData 
		}).success(function(data) {
			alert("Saved Successfully.");
			$window.location.href = '/sapient';
			/*dlg = $dialogs.notify('Recognition details saved successfully.');
	        dlg.result.then(function(btn){
	        	$window.location.href = '/sapient';
	        },function(btn){
	        	//$window.location.href = '/sapient';
	        });*/
			
		});
	}
	
	$scope.submitWinners = function() {
		console.log($scope.winners);
		
		$scope.formData = {
			'winners' : $scope.winners,
			'submittedBy' : $scope.loggedInUser.oracleId,
			'periodId' : $scope.periodId,
			'accountId': $scope.loggedInUser.accountId
		};
		
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/submitWinners',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : $scope.formData
		}).success(function(data) {
			alert("Winners Saved Successfully.");
			$window.location.href = '/sapient#secondTab';
		});
	}
	
	$scope.edit = function(reg) {
		$scope.nominee = reg.nominee;
		$scope.htmlcontent = reg.citation;
		$scope.category = reg.recognitionCategory;
		$scope.nominationId = reg.nominationId;
		
		$scope.tabId = 0;
		
	};
	
	$scope.editUser = function(reg) {
		$scope.editUser.name = reg.name;
		$scope.editUser.project = reg.projectDesc;
		$scope.editUser.location = reg.officeLocation;
		$scope.editUser.oracleId = reg.oracleId;
		$scope.editUser.recognitionTeamFlg = reg.recognitionTeamFlag;
		$scope.editUser.account = {"id" : $scope.loggedInUser.accountId};
		
		var WinNetwork = new ActiveXObject("WScript.Network");
		$scope.editUser.ntLogin = WinNetwork.UserName;
		
		$scope.tabId = 6;
		
	};
	
	// pull data from form and persist custom deal to DB
	//$scope.nominee;
	//$scope.nominator;
	$scope.submit = function() {
		
		//alert($scope.nominee);
		if($scope.recognitionCutOff == null || $scope.recognitionCutOff == undefined) {
			alert("Nomination Cycle is not initiated yet. Please contact recognition team.");
			return;
		}
		
		if($scope.isBeforeAndEqualCurrentDate($scope.recognitionCutOff.recognitionPeriodCutoff)) {
			alert("Sorry nominations are not allowed after submission last date.");
			return;
		}
		
		if($scope.nominee.oracleId == null || $scope.nominee.oracleId == undefined) {
			alert("Please select nominee. It is not selected from the list");
			return;
		}
		
		$scope.formData = {
			'nominationId' : $scope.nominationId,
			'nominatorOracleId' : $scope.nominator.oracleId,
			'nomineeOracleId' : $scope.nominee.oracleId,
			'message' : $scope.htmlcontent,
			'category' : $scope.category,
			'periodId' : $scope.periodId,
			'accountId': $scope.loggedInUser.accountId,
			'submitter':  $scope.loggedInUser.ntLogin
		};
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/submit',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : $scope.formData
		}).success(function(data) {
			alert("Saved Successfully. \n\nPlease add the citation in PeoplePortal.");
			
			$window.location.href = '/sapient#editTab';
		});
	};
	
	$scope.openOutlook = function() {
		try {

		    //get outlook and create new email
		    var outlook = new ActiveXObject('Outlook.Application');
		    var email = outlook.CreateItem(0);

		    //add some recipients
		    email.Recipients.Add('user1@company.com').Type = 1; //1=To
		    email.Recipients.Add('user2@company.com').Type = 2; //2=CC

		    //subject and attachments
		    email.Subject = 'A Subject';
		    //email.Attachments.Add('URL_TO_FILE', 1); //1=Add by value so outlook downloads the file from the url

		    // display the email (this will make the signature load so it can be extracted)
		    email.Display();

		    //use a regular expression to extract the html before and after the signature
		    var signatureExtractionExpression = new RegExp('/[^~]*(<BODY[^>]*>)([^~]*</BODY>)[^~]*/', 'i');
		    signatureExtractionExpression.exec(email.HTMLBody);
		    var beforeSignature = RegExp.$1;
		    var signature = RegExp.$2;

		    //set the html body of the email
		    email.HTMLBody = beforeSignature + '<h1>Our Custom Body</h1>' + signature;

		} catch(ex) {
		    //something went wrong
		}
	}
	
	$scope.getMyVotingCount = function(recognitions) {
		var count = 0;
		for(var i = 0; i < recognitions.length; i++) {
			count += $scope.votes[recognitions[i].nominationId] ? 1 : 0;
		}
		return count;
	}
	
	$scope.recognitions;
	
	$scope.loadLoggedInUser = function() {
		$scope.loadingView = true;
		
		if(!!document.documentMode) {
			var WinNetwork = new ActiveXObject("WScript.Network");
			return $http.get('personSearchLoggedInUser', {
				params : {
					personSearchString : WinNetwork.UserName
				}
			}).then(function(res) {
				$scope.nominator = res.data[0];
				//$log.info(res.data[0].name);
				$scope.loggedInUser = res.data[0]
				$scope.isGuestUser = ($scope.loggedInUser == null);
				
				if($scope.isGuestUser) {
					$scope.tabId = 6;
					$scope.isNewUser = 'Y';
					
					var WinNetwork = new ActiveXObject("WScript.Network");
					$scope.editUser.ntLogin = WinNetwork.UserName;
				} else {
					//$scope.editUser.account = $scope.typeaheadAccounts[$scope.loggedInUser.accountId - 1];
					$scope.load();
				}
			});
			
		} else {
			alert("Unsupported Browser!! Please use IE.");
		}
	}
	
	$scope.load = function() {
		$scope.loadingView = true;
		
		var formData = {
			'submittedBy' : $scope.loggedInUser.oracleId
		};
		
		$http({
		    'method' : 'POST',
		    'url' : 'feedback/load',
		    'headers' : {
			'Content-Type' : 'application/json'
		    },
		    'data' : formData
		}).success(function(data) {
			$log.info(data);
			$scope.recognitions = data.recognitionDto;
			$scope.votes = data.myVotes;
			$scope.winners = data.myWinners;
			$scope.allWinners = data.allWinners;
			$scope.myNominations = data.myNominations;
			$scope.recognitionCutOff = data.recognitionCutOff;
			
			if($scope.recognitionCutOff != null && $scope.recognitionCutOff != undefined) {
				$scope.recognitionDescription = $scope.recognitionCutOff.recognitionDescription;
				$scope.recognitionPeriodStart = $scope.recognitionCutOff.recognitionPeriodStart;
				$scope.recognitionPeriodEnd = $scope.recognitionCutOff.recognitionPeriodEnd;
				$scope.recognitionPeriodCutoff = $scope.recognitionCutOff.recognitionPeriodCutoff;
				$scope.votingCutoff = $scope.recognitionCutOff.votingCutoff;
				$scope.periodId = $scope.recognitionCutOff.periodId;
			}
			
			console.log($scope.winners);
			
			$scope.loadingView = false;
		});
		
	};
	
	//$scope.openOutlook();
	$scope.loadLoggedInUser();
};