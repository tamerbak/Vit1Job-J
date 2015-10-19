/**
 * Created by Tamer on 15/10/2015.
 */

angular.module('competenceCtrls', ['ionic', 'wsConnectors','ngCookies'])

  .controller('competenceCtrl', function ($scope, $cookieStore, $state, x2js, $rootScope, AuthentificatInServer) {
		// FORMULAIRE
		$scope.formData = {};
		
		// INIT
		$rootScope.jobyers=[];
		$rootScope.jobyerCurrent={};
		$scope.formData.jobyerCurrentIndice=1;
		$scope.formData.showButtRight=true;
		$scope.formData.showButtLeft=true;
			
		// RECUPERATION EMPLOYEUR ID
		employeId=$cookieStore.get('employeID');
		console.log("$cookieStore.get : "+$cookieStore.get('employeID'));
		// RECUPERATION SESSION ID
		$rootScope.sessionId=$cookieStore.get('sessionID');
		
		$scope.initForm = function(){
			$scope.formData.metier="Métier";
			$scope.formData.job="Job";
			$scope.formData.degre=10;
			$scope.formData.indisp="Les indispensables"; 
			$scope.formData.langue="Langue";
		}
		
		$scope.afficheList = function(){
			// GET LIST
			metiers=$cookieStore.get('metiers');
			langues=$cookieStore.get('langues');
			jobs=$cookieStore.get('jobs');
			transvers=$cookieStore.get('transvers');
			
			// AFFICHAGE
			console.log("metiers : "+metiers);
			console.log("langues : "+langues);
			console.log("jobs : "+jobs);
			console.log("transvers : "+transvers);
			
			// REDIRECTION VERS RECHERCHE
			$state.go("search");
		}
		
		$scope.addJobyer = function(){
			
			//$scope.njobyer+=1;
			// UPDATE INDICE
			$rootScope.jobyerCurrent={
				'metier': $scope.formData.metier, 
				'job': $scope.formData.job, 
				'degre': $scope.formData.degre, 
				'indisp': $scope.formData.indisp, 
				'langue': $scope.formData.langue,
				'indice': Number($scope.formData.jobyerCurrentIndice)
			};
			
			// UPDATE NB ITEMS
			$scope.formData.jobyerCurrentIndice+=1;
			
			// ADD IN LIST
			$rootScope.jobyers.push($rootScope.jobyerCurrent);
			
			// AFFICHAGE
			console.log("Jobeyers Total : "+$rootScope.jobyers.length);
			for(var obj in $rootScope.jobyerCurrent){
				console.log("Jobeyer Current["+obj+"] : "+$rootScope.jobyerCurrent[obj]);
			}
			
			// REFRESH BUTTONS
			$scope.refrechNavigation();
			$scope.initForm();
		}
		
		$scope.removeJobyer = function(){
			idex=Number($scope.formData.jobyerCurrentIndice);
			// DELETE OBJECT FROM LIST
			$rootScope.jobyers.splice(idex-1, 1);
			// UPDATE ALL INDICES
			for(var i=0; i<$rootScope.jobyers.length; i++){
				$rootScope.jobyers[i].indice=i+1;
			}
			
			if(idex)
			// LOAD OBJECT PREV
			$scope.loadPrevJobyer();
		}
		
		$scope.loadPrevJobyer = function(){
			
			idex=Number($scope.formData.jobyerCurrentIndice);
			if(idex==0 || idex==$rootScope.jobyers.length)	// IN EDGE
				return;
			
			// UPDATE CURRENT INDEX
			$scope.formData.jobyerCurrentIndice-=1;
			console.log("Feuille Actuelle N° : "+$scope.formData.jobyerCurrentIndice);
			console.log("All Jobeyers : "+$rootScope.jobyers.length);
			
			// UPDATE CURRENT JOBYER
			$rootScope.jobyerCurrent=$rootScope.jobyers[Number($scope.formData.jobyerCurrentIndice)-1];
			
			// CHARGER FORMULAIRE
			$scope.formData.metier=$rootScope.jobyerCurrent.metier;
			$scope.formData.job=$rootScope.jobyerCurrent['job']; 
			$scope.formData.degre=$rootScope.jobyerCurrent['degre'];
			$scope.formData.indisp=$rootScope.jobyerCurrent['indisp'];
			$scope.formData.langue=$rootScope.jobyerCurrent['langue'];
			
			// for(var obj in $rootScope.jobyerCurrent){
				// console.log("Jobeyer Current["+obj+"] : "+$rootScope.jobyerCurrent[obj]);
			// }
			// console.log("metier"+$scope.metier);
			// UPDATE INDICE
			$rootScope.jobyerCurrentIndice-=1;
			
			$scope.refrechNavigation();
		}
		
		$scope.loadNextJobyer = function(){
			
			idex=Number($scope.formData.jobyerCurrentIndice);
			if(idex==0 || idex==$rootScope.jobyers.length)	// IN EDGE
				return;
			
			// UPDATE CURRENT INDEX
			$scope.formData.jobyerCurrentIndice+=1;
			console.log("Feuille Actuelle N° : "+$scope.formData.jobyerCurrentIndice);
			console.log("All Jobeyers : "+$rootScope.jobyers.length);
			
			// UPDATE CURRENT JOBYER
			$rootScope.jobyerCurrent=$rootScope.jobyers[Number($scope.formData.jobyerCurrentIndice)-1];
			
			// CHARGER FORMULAIRE
			$scope.formData.metier=$rootScope.jobyerCurrent['metier'];
			$scope.formData.job=$rootScope.jobyerCurrent['job']; 
			$scope.formData.degre=$rootScope.jobyerCurrent['degre'];
			$scope.formData.indisp=$rootScope.jobyerCurrent['indisp'];
			$scope.formData.langue=$rootScope.jobyerCurrent['langue'];
			
			// UPDATE INDICE
			$rootScope.jobyerCurrentIndice+=1;
			
			$scope.refrechNavigation();
		}
		
		// REFRESH BUTTONS
		$scope.refrechNavigation=function(){
			
			idex=$scope.formData.jobyerCurrentIndice-1;
			console.log("idex : "+idex);
			// BUTTON NEXT
			//if(idex!=0 && idex!=$rootScope.jobyers.length && $rootScope.jobyers.length!=0)
			if(idex!=$rootScope.jobyers.length && $rootScope.jobyers.length!=0)
				$scope.formData.showButtRight=false;
			else
				$scope.formData.showButtRight=true;
			
			// BUTTON PREV
			//if(idex!=$rootScope.jobyers.length && $rootScope.jobyers.length!=0)
			if(idex!=0 && $rootScope.jobyers.length!=0)
				$scope.formData.showButtLeft=false;
			else
				$scope.formData.showButtLeft=true;
			
			console.log("$scope.formData.showButtLeft : "+$scope.formData.showButtLeft);
			console.log("$scope.formData.showButtRight : "+$scope.formData.showButtRight);
		}
		
		// PERSIST LIST JOBYERS
		$scope.saveJobyers=function(){
			
			hasSessionID=0;
			if($rootScope.sessionId)
				hasSessionID=1;
			else{
				AuthentificatInServer.getSessionId()
					.success(function (response){
						var jsonResp = x2js.xml_str2json(response);
						var jsonText = JSON.stringify (jsonResp);
						jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
						jsonResp = JSON.parse(jsonText);

						// GET SESSION ID
          				$rootScope.sessionId = jsonResp.amanToken.sessionId;
          				console.log("$rootScope.sessionId : "+$rootScope.sessionId);
		  				$cookieStore.put('sessionID', $rootScope.sessionId);
						hasSessionID=1;
					})
					.error(function (err){
						console.log("error : Récuperation Session ID");
						console.log("error In saveJobyers: "+err);
					});
			}
			
			if(hasSessionID){
				
				//  PERSIST IN BD
			}
		}
  });
