
(function() {
  var module;

  module = angular.module('treeGrid', []);

  module.directive('treeGrid', [
    '$timeout', '$http', '$location', '$anchorScroll',  function($timeout,$http, $location, $anchorScroll) {
      return {
        restrict: 'E',
        //templateUrl:'tree-grid-template.html',
        //template:"<div><table class=\"table table-bordered table-striped tree-grid\"><thead class=\"text-primary\"><tr><th>{{expandingProperty}}</th><th ng-repeat=\"col in colDefinitions\">{{col.displayName || col.field}}</th></tr></thead><tbody><tr ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\"><td class=\"text-primary\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"></i></a><span class=\"indented tree-label\">{{row.branch[expandingProperty]}}</span></td><td ng-repeat=\"col in colDefinitions\">{{row.branch[col.field]}}</td></tr></tbody><table></div>",
        template:
        	"<div>\
            <table class=\"table table-bordered table-striped tree-grid\">\
                <thead class=\"text-primary\">\
                <tr class=\"mnpi-table-header\">\
                    <th style=\"width :25%;\">{{expandingProperty}}</th>\
                    <th ng-repeat=\"col in colDefinitions\" style=\"{{col.style}}\" class=\"{{col.stclass}}\"><input type=\"checkbox\" id=\"{{col.displayName}}\" ng-click=\"header_checkbox_click(col.displayName, colDefinitions)\" ng-if=\"col.type == 'checkbox'\"/>{{col.displayName || col.field}}</th>\
                </tr>\
                </thead>\
                <tbody>\
                <tr branch-loaded ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\"\
                      ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\
                    <td class=\"text-primary\" ><a ><i ng-class=\"row.tree_icon\"\
                               ng-click=\"user_clicks_expand(row.branch)\"\
                               class=\"indented tree-icon\"></i>\
                        </a><span class=\"indented tree-icon\" ng-click=\"user_clicks_branch(row.branch)\">\
                          {{row.branch[expandingProperty]}}</span>\
                    </td>\
                    <td ng-repeat=\"col in colDefinitions\" style=\"{{col.style}}\" class=\"{{col.stclass}}\">&nbsp;&nbsp;<input id=\"ISR_{{col.displayName}}_{{row.branch.Path}}\" type=\"checkbox\" ng-click=\"row_checkbox_click(col.displayName, row.branch)\" ng-if=\"col.type == 'checkbox' && row.branch.checkbox == 'true'\"/> \
		                \
		                    <a ng-if=\"col.type == 'flags' \" href=\"\" ng-show=\"row.branch['IsOpenOrderAvailable']\" ng-click=\"getIssuerFlag(row.branch, 1)\" style=\" padding:.5px\"><img src=\"images/flag_orange.png\" height=\"20\" width=\"20\"/></a>\
							<a ng-if=\"col.type == 'flags' \" href=\"\" ng-show=\"row.branch['IsClientHeldAvailable']\" ng-click=\"getIssuerFlag(row.branch, 2)\" style=\" padding:.5px\"><img src=\"images/client_held_25x27.png\" height=\"20\" width=\"20\"/></a>\
		                    <a ng-if=\"col.type == 'flags' \" href=\"\" ng-show=\"row.branch['IsCurrentRestrictionAvailable']\" ng-click=\"getIssuerFlag(row.branch, 4)\" style=\" padding:.5px\"><img src=\"images/existing_restriction_25x25.png\" height=\"20\" width=\"20\"/></a>\
							<a ng-if=\"col.type == 'flags' \" href=\"\" ng-show=\"row.branch['IsPastRestrictionAvailable']\" ng-click=\"getIssuerFlag(row.branch, 5)\" style=\" padding:.5px\"><img src=\"images/historic_restrictions_25x25.png\" height=\"20\" width=\"20\"/></a>\
						{{row.branch[col.field]}}</td>\
                 </tr>\
                </tbody>\
            </table>\
        </div>",
        replace: true,
        scope: {
          treeData: '=',
          colDefs:'=',
          expandOn:'=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '='
        },
        link: function(scope, element, attrs) {
          var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };

          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus-sign fa fa-plus-circle';
          }
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus-sign fa fa-minus-circle';
          }
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }

          expand_level = parseInt(attrs.expandLevel, 10);
          
          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }
          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }
          if(attrs.expandOn){
            expandingProperty = scope.expandOn;
            scope.expandingProperty = scope.expandOn;
          }
          else{
            var _firstRow = scope.treeData[0], 
                _keys = Object.keys(_firstRow);
            for(var i =0, len = _keys.length; i<len; i++){
              if(typeof(_firstRow[_keys[i]])=='string'){
                expandingProperty = _keys[i];
                break;
              }
            }
            if(!expandingProperty) expandingProperty = _keys[0];
            scope.expandingProperty = expandingProperty;
          }

          if(!attrs.colDefs){
            var _col_defs = [], _firstRow = scope.treeData[0], _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];
            for(var idx in _firstRow){
              if(_unwantedColumn.indexOf(idx)==-1)
                _col_defs.push({field:idx});
            }            
            scope.colDefinitions = _col_defs;
          }
          else{
            console.log(scope.colDefs);
            scope.colDefinitions = scope.colDefs;
          }

          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };
          selected_branch = null;
          select_branch = function(branch) {
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          
          delete_transaction = function(array, item){
        	  angular.forEach(array,function(value,index){
                   if(value != undefined){
                  	 if(value.indexOf(item) != -1){
                  		 delete array[index];
                  	 } 
                   }
                });
          }
          
          scope.row_checkbox_click = function(column, rowBranch) {
        	  var rowAllChecked = document.getElementById("ISR_"+column+"_"+rowBranch.Path).checked;
        	  if(column == 'All'){        		 
        		  if(rowAllChecked){

        			  angular.forEach(scope.$parent.supported_transactions,function(trans,index){
        				  document.getElementById("ISR_"+trans+"_"+rowBranch.Path).checked = true;
        				  if(scope.$parent.selected_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path) == -1) {
        					if(rowBranch.Parent == undefined) {
        						scope.$parent.selected_transactions.push("ISR_"+trans+"_"+rowBranch.Path);
        					} else if(rowBranch.Parent != undefined && !document.getElementById("ISR_"+trans+"_"+rowBranch.Parent).checked){
              					scope.$parent.selected_transactions.push("ISR_"+trans+"_"+rowBranch.Path);
              				}
      				      }
              			  
              			  if(scope.$parent.excluded_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path) != -1) {
              				  delete scope.$parent.excluded_transactions[scope.$parent.excluded_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path)];
        				      }
              			  
              			  delete_transaction(scope.$parent.selected_transactions,"ISR_"+trans+"_"+rowBranch.Path+"_");
              			  
              			  delete_transaction(scope.$parent.excluded_transactions,"ISR_"+trans+"_"+rowBranch.Path+"_");
                       });
        			  
        		  } else {
        			  
        			  angular.forEach(scope.$parent.supported_transactions,function(trans,index){
        				  document.getElementById("ISR_"+trans+"_"+rowBranch.Path).checked = false;
        				  if(scope.$parent.excluded_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path) == -1) {
                				if(rowBranch.Path.indexOf("_") != -1){ // If the ultimate parent is unchecked, should not be added to the excluded list
                					scope.$parent.excluded_transactions.push("ISR_"+trans+"_"+rowBranch.Path);
                				}
      				      }
              			  if(scope.$parent.selected_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path) != -1) {
      					    delete scope.$parent.selected_transactions[scope.$parent.selected_transactions.indexOf("ISR_"+trans+"_"+rowBranch.Path)];
      					  } 
              			  
              			  delete_transaction(scope.$parent.selected_transactions,"ISR_"+trans+"_"+rowBranch.Path+"_");
              			  
              			  delete_transaction(scope.$parent.excluded_transactions,"ISR_"+trans+"_"+rowBranch.Path+"_");
        			  });
        			  
        		  }
        	  } else {
        		  if(rowAllChecked){
        			  
        			  // When any issuer column is checked, check the correspondig all column provided all the other columns in the row are checked ...
        			  if(document.getElementById("ISR_Buy_"+rowBranch.Path).checked && document.getElementById("ISR_Sell_"+rowBranch.Path).checked &&
        					  document.getElementById("ISR_SS_"+rowBranch.Path).checked && document.getElementById("ISR_BC_"+rowBranch.Path).checked){
        				  document.getElementById("ISR_All_"+rowBranch.Path).checked = true;
        			  }
      			      
        			  if(scope.$parent.selected_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path) == -1) {
  				    	scope.$parent.selected_transactions.push("ISR_"+column+"_"+rowBranch.Path);
  				      }
          			  if(scope.$parent.excluded_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path) != -1) {
          				  delete scope.$parent.excluded_transactions[scope.$parent.excluded_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path)];
    				      }
          			  
          			 delete_transaction(scope.$parent.selected_transactions,"ISR_"+column+"_"+rowBranch.Path+"_");
         			  
      			     delete_transaction(scope.$parent.excluded_transactions,"ISR_"+column+"_"+rowBranch.Path+"_");
      			     
        		  } else {
        			  /*if(scope.$parent.selected_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path) != -1) {
  					    delete scope.$parent.selected_transactions[scope.$parent.selected_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path)];
  					  }
        			  */
        			    // When any issuer column is unchecked, uncheck the correspondig all column and the header all & the corresponding header column ...
        			    document.getElementById("ISR_All_"+rowBranch.Path).checked = false;
        			    document.getElementById("All").checked = false;
        			    document.getElementById(column).checked = false;
        			    
            			if(scope.$parent.excluded_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path) == -1) {
            				if(rowBranch.Path.indexOf("_") != -1){ // If the ultimate parent is unchecked, should not be added to the excluded list
      				    	  scope.$parent.excluded_transactions.push("ISR_"+column+"_"+rowBranch.Path);
            				}
      				      }
              			  if(scope.$parent.selected_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path) != -1) {
      					    delete scope.$parent.selected_transactions[scope.$parent.selected_transactions.indexOf("ISR_"+column+"_"+rowBranch.Path)];
      					  } 
              			  
              			 delete_transaction(scope.$parent.selected_transactions,"ISR_"+column+"_"+rowBranch.Path+"_");
           			  
         			     delete_transaction(scope.$parent.excluded_transactions,"ISR_"+column+"_"+rowBranch.Path+"_");
         			     
        		  }
        	  }
        		
        	    var secAllRe = new RegExp("SEC_All_"+rowBranch.Path+"_",'');
        	    var secBuyRe = new RegExp("SEC_Buy_"+rowBranch.Path+"_",'');
        	    var secSsRe = new RegExp("SEC_SS_"+rowBranch.Path+"_",'');
        	    var secSellRe = new RegExp("SEC_Sell_"+rowBranch.Path+"_",'');
        	    var secBcRe = new RegExp("SEC_BC_"+rowBranch.Path+"_",'');
        	    
        	    var isrAllRe = new RegExp("ISR_All_"+rowBranch.Path);
        	    var isrBuyRe = new RegExp("ISR_Buy_"+rowBranch.Path);
        	    var isrSsRe = new RegExp("ISR_SS_"+rowBranch.Path);
        	    var isrSellRe = new RegExp("ISR_Sell_"+rowBranch.Path);
        	    var isrBcRe = new RegExp("ISR_BC_"+rowBranch.Path);
        	    
        		var c = document.getElementsByTagName('input');
           	    for (var i = 0; i < c.length; i++) {
           	        if (c[i].type == 'checkbox') {
           	        	if(c[i].id.length > 0) {
           	        		
           	        		// All Issuers ....
           	        		if((column == "All" && (c[i].id.match(isrAllRe) != null || c[i].id.match(isrBuyRe) != null || c[i].id.match(isrSsRe) != null 
           	        				|| c[i].id.match(isrSellRe) != null || c[i].id.match(isrBcRe) != null))
     	        					|| (column == "Buy" && c[i].id.match(isrBuyRe) != null) || (column == "SS" && c[i].id.match(isrSsRe) != null) || 
     	        					(column == "Sell" && c[i].id.match(isrSellRe) != null) || (column == "BC" && c[i].id.match(isrBcRe) != null)){ 
     	        				if(rowAllChecked){
     	         	                c[i].checked = true;
     	         	        	 } else {
     	         	        		c[i].checked = false;
     	         	        	 }
     	        			} 
           	        		
           	        		// All Securities ....
           	        		if((column == "All" && (c[i].id.match(secAllRe) != null || c[i].id.match(secBuyRe) != null || c[i].id.match(secSsRe) != null 
           	        				|| c[i].id.match(secSellRe) != null || c[i].id.match(secBcRe) != null))
     	        					|| (column == "Buy" && c[i].id.match(secBuyRe) != null) || (column == "SS" && c[i].id.match(secSsRe) != null) || 
     	        					(column == "Sell" && c[i].id.match(secSellRe) != null) || (column == "BC" && c[i].id.match(secBcRe) != null)){ 
     	        				if(rowAllChecked){
     	         	                c[i].checked = true;
     	         	        	 } else {
     	         	        		c[i].checked = false;
     	         	        	 }
     	        			} 
           	        		
           	        			
           	          }	
           	        }
           	    }
          }
          
          scope.header_checkbox_click = function(column, colDefinitions) {
        	 var colsArr = [];
        	 
        	 var headerChecked = false;
        	 
        	 if(column == 'All'){
        		 var headerChecked = document.getElementById("All").checked;
        		 
        		 colsArr.push("All"); // Adding All since it is not added to scope.$parent.supported_transactions
        		 // All Headers .....
        		 angular.forEach(scope.$parent.supported_transactions,function(trans,index){
                    	 colsArr.push(trans);
                    	 if(headerChecked){
                    		 document.getElementById(trans).checked = true;
                    	 } else {
                    		 document.getElementById(trans).checked = false;
                    	 }
                 });
        		 
        		 // Since all is selected, delete all selected and all excluded entries from sec_selected and sec_excluded
        		        		 
        		 angular.forEach(scope.$parent.excluded_sec_transactions,function(value,index){
                     if(value != undefined){
                    	delete scope.$parent.excluded_sec_transactions[index];
                     }
                  });
        		 
        		 angular.forEach(scope.$parent.selected_sec_transactions,function(value,index){
                     if(value != undefined){
                    	delete scope.$parent.selected_sec_transactions[index];
                     }
                  });
        		 
        		
        	 } else {
        		 
        		 angular.forEach(scope.$parent.excluded_sec_transactions,function(value,index){
                     if(value != undefined){
                    	 if(value.indexOf("SEC_"+column+"_") != -1){
                    		 delete scope.$parent.excluded_sec_transactions[index];
                    	 }
                     }
                  });
        		 
        		 angular.forEach(scope.$parent.selected_sec_transactions,function(value,index){
                     if(value != undefined){
                    	 if(value.indexOf("SEC_"+column+"_") != -1){
                    	    delete scope.$parent.selected_sec_transactions[index];
                    	 }
                     }
                  });
        		 
        		 headerChecked = document.getElementById(column).checked;
        		 colsArr.push(column);
        		 
        		 if(!headerChecked){
        			 // When any header column is unchecked, the coresponding all header column should be unchecked ...
        			 document.getElementById("All").checked = false;
        		 } else {
        			// When any header column is checked, the coresponding all header column should be checekd provided all other columns are checked ...
        			 if(document.getElementById("Buy").checked && document.getElementById("Sell").checked && document.getElementById("BC").checked
        					 && document.getElementById("BC").checked){
        				 document.getElementById("All").checked = true;
        			 }
        		 }
        	 }
        	 
        		 // Issuers ....
        		 angular.forEach(scope.tree_rows,function(row,index){
        			 // if(row.level == 1){
        				 angular.forEach(colsArr,function(colName,index){
        					 if(document.getElementById("ISR_"+colName+"_"+row.branch.Path) != null) { // For child rows the dom is not rendered for the hidden child ... Hence null check ...
        					  if(headerChecked){ 
        					    document.getElementById("ISR_"+colName+"_"+row.branch.Path).checked = true;
        					    if(colName != "All"){
        					      // When any issuer column is checked, the coresponding all issuer column should be checekd provided all other columns are checked ...	
       							  if(document.getElementById("ISR_Buy_"+row.branch.Path).checked && document.getElementById("ISR_Sell_"+row.branch.Path).checked &&
       									document.getElementById("ISR_SS_"+row.branch.Path).checked && document.getElementById("ISR_BC_"+row.branch.Path).checked ) {
       								document.getElementById("ISR_All_"+row.branch.Path).checked = true;
       							  }
       						    }
        					    if(row.level == 1){
        					    	if(colName !='All' && scope.$parent.selected_transactions.indexOf("ISR_"+colName+"_"+row.branch.Path) == -1) {
        					    	  scope.$parent.selected_transactions.push("ISR_"+colName+"_"+row.branch.Path);
        					    	}
        					    	
        					    	 delete_transaction(scope.$parent.selected_transactions,"ISR_"+colName+"_"+row.branch.Path+"_");
        		           			  
        	         			     delete_transaction(scope.$parent.excluded_transactions,"ISR_"+colName+"_"+row.branch.Path+"_");
        					    	
        					    }
        					  } else {        						
        						 document.getElementById("ISR_"+colName+"_"+row.branch.Path).checked = false;
        						 
        						 // When any issuer column is unchecked, the coresponding issuer all column should be unchecked ...
        						 if(colName != "All"){
        							 document.getElementById("ISR_All_"+row.branch.Path).checked = false; 
        						 }
        						 if(row.level == 1){
        							 if(scope.$parent.selected_transactions.indexOf("ISR_"+colName+"_"+row.branch.Path) != -1) {
           					    	   delete scope.$parent.selected_transactions[scope.$parent.selected_transactions.indexOf("ISR_"+colName+"_"+row.branch.Path)];
           					    	}
        							 delete_transaction(scope.$parent.selected_transactions,"ISR_"+colName+"_"+row.branch.Path+"_");
       		           			  
        	         			     delete_transaction(scope.$parent.excluded_transactions,"ISR_"+colName+"_"+row.branch.Path+"_");
         					     }
        					  }
        					 }
                         });
               		 
        			  //}
                      
                  });
        		 
        		// Securities .... 
        		var c = document.getElementsByTagName('input');
         	    for (var i = 0; i < c.length; i++) {
         	        if (c[i].type == 'checkbox') {
         	        	if(c[i].id.length > 0) {
         	        		//if((c[i].id).indexOf("_",0) != -1){
         	        			//var partialId = (c[i].id).substring(0,(c[i].id).indexOf("_",0)+1);
         	        			if((column == "All" && (c[i].id.match(/SEC_All_/) != null || c[i].id.match(/SEC_Buy_/) != null || c[i].id.match(/SEC_SS_/) != null || c[i].id.match(/SEC_Sell_/) != null || c[i].id.match(/SEC_BC_/) != null))
         	        					|| (column == "Buy" && c[i].id.match(/SEC_Buy_/) != null) || (column == "SS" && c[i].id.match(/SEC_SS_/) != null) || 
         	        					(column == "Sell" && c[i].id.match(/SEC_Sell_/) != null) || (column == "BC" && c[i].id.match(/SEC_BC_/) != null)){ 
         	        				if(headerChecked){
         	         	                c[i].checked = true;
         	         	        	 } else {
         	         	        		c[i].checked = false;
         	         	        	 }
         	        			} 
         	        			
         	        		//} 
         	          }	
         	        }
         	    }
        	 
        	 
        	
          }
          
          scope.user_clicks_expand = function(branch) {
        	  scope.current_parent_issuer = branch;
        	  scope.current_branch_excluded_transaction = scope.$parent.excluded_transactions;
        	  scope.current_branch_selected_transaction = scope.$parent.selected_transactions;
        	  branch.expanded = !branch.expanded;
          }
          
          scope.getIssuerFlag = function(branch, tabId) {
        	  scope.$parent.issuerFlagDetails(branch['IsrId'], tabId);
          }
          
          scope.user_clicks_branch = function(branch) {
            //if (branch !== selected_branch) {
            	var selectedIsrName = branch['Name'];
            	//alert("I am selecetd ...... "+branch['Name']);
            	//scope.clearResultsFilter();
            	var allChecked = document.getElementById("ISR_All_"+branch.Path).checked;
            	var buyChecked = document.getElementById("ISR_Buy_"+branch.Path).checked;
            	var sellChecked = document.getElementById("ISR_Sell_"+branch.Path).checked;
            	var ssChecked = document.getElementById("ISR_SS_"+branch.Path).checked;
            	var bcChecked = document.getElementById("ISR_BC_"+branch.Path).checked;
            	var selectedSecs = scope.$parent.selected_sec_transactions.toString();
            	var excludedSecs = scope.$parent.excluded_sec_transactions.toString();
            	
            	$location.hash('secTable');
			    $anchorScroll();
			    
            	scope.$parent.placeRestrictionResult.showSecurityLoading = 'true';
				$http({
					url : "getSecuritiesForAnIssuer",
					method : "GET",
					timeout : 200000,
					params : {
						isrId : branch['IsrId'],
						isrPath : branch['Path'],
						allChecked : allChecked,
						buyChecked : buyChecked,
						sellChecked : sellChecked,
						ssChecked : ssChecked,
						bcChecked : bcChecked,
						selectedSecs : selectedSecs,
						excludedSecs : excludedSecs
					}
				}).success(function(data, status) {

					scope.$parent.placeRestrictionResult.selectedIsrName =  selectedIsrName;
					scope.$parent.placeRestrictionResult.securitiesList = data;
					scope.$parent.placeRestrictionResult.showSecurityLoading = 'false';
					
				}).error(function(data, status) {
					//$scope.showSearchResults = false;
					scope.$parent.placeRestrictionResult.showSecurityLoading = 'false';
				});
            	
            	
              return select_branch(branch);
            /*} else {
            	alert(" NOT I am selecetd ...... "+branch['IsrId']);
            }*/
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };

          scope.tree_rows = [];
          
          on_treeData_change = function() {
            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = "" + Math.random();
              }
            });
            for_each_branch(function(b) {
              var child, _i, _len, _ref, _results;
              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });
            scope.tree_rows = [];
            for_each_branch(function(branch) {
              var child, f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };
                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child));
                    }
                    return _results;
                  })();
                }
              } else {
                return branch.children = [];
              }
            });
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (!branch.children || branch.children.length === 0) {
                tree_icon = attrs.iconLeaf;
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              branch.level = level;
              scope.tree_rows.push({
                level: level,
                branch: branch,                
                label: branch[expandingProperty],                
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            
            return _results;
            
          };

          scope.$watch('treeData', on_treeData_change, true);
          

          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;
                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };
              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]).directive('branchLoaded',['$timeout', function (timer) {
	    /* Note the injection of the $timeout service */
	    return {
	        link: function (scope, elem, attrs, ctrl) {
	            var select = function () {                
	              if(scope.current_parent_issuer != undefined) {
	            	var all = document.getElementById("ISR_All_"+scope.current_parent_issuer.Path).checked;
	                var buy = document.getElementById("ISR_Buy_"+scope.current_parent_issuer.Path).checked
	                var sell = document.getElementById("ISR_Sell_"+scope.current_parent_issuer.Path).checked
	                var ss = document.getElementById("ISR_SS_"+scope.current_parent_issuer.Path).checked
	                var bc = document.getElementById("ISR_BC_"+scope.current_parent_issuer.Path).checked
	            	angular.forEach(scope.current_parent_issuer.children,function(childRow,index){
	            		if(all) {
	            			document.getElementById("ISR_All_"+childRow.Path).checked = true;
	            		}
	            		if(buy) {
	            			if(scope.current_branch_excluded_transaction.indexOf("ISR_Buy_"+childRow.Path) == -1) {
	            				document.getElementById("ISR_Buy_"+childRow.Path).checked = true;
	            			} else {
	            				document.getElementById("ISR_All_"+childRow.Path).checked = false;
	            			} 
	            		} else{
	            			if(scope.current_branch_selected_transaction.indexOf("ISR_Buy_"+childRow.Path) != -1) {
	            				document.getElementById("ISR_Buy_"+childRow.Path).checked = true;
	            			}
	            		}
	            		if(sell) {
	            			if(scope.current_branch_excluded_transaction.indexOf("ISR_Sell_"+childRow.Path) == -1) {
	            			  document.getElementById("ISR_Sell_"+childRow.Path).checked = true;
	            			} else {
	            				document.getElementById("ISR_All_"+childRow.Path).checked = false;
	            			} 
	            		} else{
	            			if(scope.current_branch_selected_transaction.indexOf("ISR_Sell_"+childRow.Path) != -1) {
	            				document.getElementById("ISR_Sell_"+childRow.Path).checked = true;
	            			}
	            		}
	            		if(ss) {
	            			if(scope.current_branch_excluded_transaction.indexOf("ISR_SS_"+childRow.Path) == -1) {
	            			  document.getElementById("ISR_SS_"+childRow.Path).checked = true;
	            			} else {
	            				document.getElementById("ISR_All_"+childRow.Path).checked = false;
	            			} 
	            		} else{
	            			if(scope.current_branch_selected_transaction.indexOf("ISR_SS_"+childRow.Path) != -1) {
	            				document.getElementById("ISR_SS_"+childRow.Path).checked = true;
	            			}
	            		}
	            		if(bc) {
	            			if(scope.current_branch_excluded_transaction.indexOf("ISR_BC_"+childRow.Path) == -1) {
	            			  document.getElementById("ISR_BC_"+childRow.Path).checked = true;
	            			} else {
	            				document.getElementById("ISR_All_"+childRow.Path).checked = false;
	            			} 
	            		} else{
	            			if(scope.current_branch_selected_transaction.indexOf("ISR_BC_"+childRow.Path) != -1) {
	            				document.getElementById("ISR_BC_"+childRow.Path).checked = true;
	            			}
	            		}
	            		
	            		if(document.getElementById("ISR_Buy_"+childRow.Path).checked && document.getElementById("ISR_Sell_"+childRow.Path).checked
	            				&& document.getElementById("ISR_SS_"+childRow.Path).checked && document.getElementById("ISR_BC_"+childRow.Path).checked){
	            			document.getElementById("ISR_All_"+childRow.Path).checked = true;
	            		}
	                 });
	              }
	            }
	            // hello();
	            timer(select, 0);
	            // It works even with a delay of 0s
	        }
	    }   
	}]);/*.directive('branchLoaded', function() {
	    return function(scope, element, attrs) {
	    	alert(document.getElementById("ISR_All_104797_104801"));
	      };
	  });*/
}).call(this);


