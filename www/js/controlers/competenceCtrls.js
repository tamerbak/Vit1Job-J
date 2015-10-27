/**
 * Created by Tamer on 15/10/2015.
 */
/**
 * Modified by HODAIKY on 25/10/2015.
 */
'use strict';

starter
  .controller('competenceCtrl', function ($scope, localStorageService, $state, x2js, $rootScope, AuthentificatInServer, Global) {
		// FORMULAIRE
		$scope.formData = {};

    $scope.formData.maitriseIcon = "img/tree1_small.png";
		$scope.formData.maitrise = "Débutant";
    $scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;"

		// ALL JOBYERS
		$rootScope.jobyers=[];
		$rootScope.jobyerCurrent={};

		// NAVIGATION
		$scope.formData.showButtRight=true;
		$scope.formData.showButtLeft=true;

		$scope.initAll = function(){

			//$scope.formData={'currentFeuille': 1, 'allFeuilles': 1};

			console.log("Je suis ds initAll() - Competences");
			// GET LIST
			$scope.formData={
				'currentFeuille': 1,
				'allFeuilles': 1,
				'metiers': localStorageService.get('metiers'),
				'langues': localStorageService.get('langues'),
				'jobs': localStorageService.get('jobs'),
				'transvers': localStorageService.get('transvers'),
				};

			// FEUILLE N°0
			$rootScope.jobyerCurrent['indice']=1;
			$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE MAIS C'EST UNDIFINED

			$scope.refrechNavigation();
		};

		$scope.rangeChange = function() {
			var rangeModel=$scope.formData.degre;
			console.log("rangeModel : "+rangeModel);
			if (rangeModel <= 25 ){
        		$scope.formData.maitrise = "Débutant";
        		$scope.formData.maitriseIcon = "tree1_small.png";
            $scope.formData.maitriseWidth = "33px";
            $scope.formData.maitriseHeight = "50px";
      		}

      		else if (rangeModel > 25 && rangeModel <= 50 ) {
        		$scope.formData.maitrise = 'Habitué';
        		$scope.formData.maitriseIcon = "tree2_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;";
      		}

      		else if (rangeModel > 50 && rangeModel <= 75 ){
        		$scope.formData.maitrise = 'Confirmé';
        		$scope.formData.maitriseIcon = "tree3_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 59px;max-height: 77px;";
      		}
      		else if (rangeModel > 75 && rangeModel <= 100 ){
        		$scope.formData.maitrise = 'Waouh!';
        		$scope.formData.maitriseIcon = "tree4_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 60px;max-height: 80px;";
      		}
		};

		$scope.afficheList = function(){
			console.log("Formulaire : "+JSON.stringify($scope.formData));
			//AFFICHAGE
			console.log("All Jobyers : "+JSON.stringify($rootScope.jobyers));
		};

		$scope.addJobyer = function(){
			// VALIDATION DES CHAMPS
			var metier=$scope.formData.metier;
			var job=$scope.formData.job;
			var degre=$scope.formData.degre;
			var indisp=$scope.formData.indisp;
			var langue=$scope.formData.langue;

			if(!$scope.isValid(metier) || !$scope.isValid(job) || !$scope.isValid(indisp) || !$scope.isValid(langue)){
				Global.showAlertValidation("Vous avez entrer une valeur invalid");
				return;
			}


			// RECUPERER JOBYER Current
			var jobyerCurrent=$rootScope.jobyerCurrent;
			console.log("Indice jobyerCurrent : "+jobyerCurrent.indice);
			// VERIFICATION
			if(jobyerCurrent.indice && jobyerCurrent.indice>0){

				if(jobyerCurrent.indice<$rootScope.jobyers.length){ // IL S'AGIT D'UNE NAVIGATION
					$scope.loadJobyer(Number($rootScope.jobyers.length));
					return;
				}

				// UPDATE CURRENT JOBYER
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].metier=metier;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].job=job;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].degre=degre;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].indisp=indisp;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].langue=langue;

				// UPDATE IN VIEW
				$scope.formData.currentFeuille=jobyerCurrent.indice+1;
				$scope.formData.allFeuilles=$rootScope.jobyers.length+1;

				console.log("Old Jobyer : "+JSON.stringify($rootScope.jobyers[Number(jobyerCurrent.indice)-1]));
				// ADD NEW JOBYER
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=jobyerCurrent.indice+1;
				$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE MAIS C'EST UNDIFINED

				console.log("New Jobyer : "+JSON.stringify($rootScope.jobyers[Number($rootScope.jobyerCurrent.indice)-1]));

				// REFRESH BUTTONS
				$scope.refrechNavigation();
			}

			$scope.refrechNavigation();
		};

		$scope.removeJobyer = function(){
			var idex=Number($scope.formData.currentFeuille);
			// DELETE OBJECT FROM LIST
			$rootScope.jobyers.splice(idex-1, 1);
			// UPDATE ALL INDICES
			for(var i=0; i<$rootScope.jobyers.length; i++){
				$rootScope.jobyers[i].indice=i+1;
			}
			// UPDATE NBRE ITEMS
			$scope.formData['allFeuilles']=$rootScope.jobyers.length;
			$scope.formData['currentFeuille']=idex-1;

			$scope.refrechNavigation();

			// LOAD OBJECT PREV
			$scope.loadJobyer(idex);
		};

		// LOAD FEUILLE
		$scope.loadJobyer = function(idex){
			// UPDATE FEUILLE
			$scope.formData.currentFeuille=idex;
			$scope.refrechNavigation();

			if(idex>$rootScope.jobyers.length || idex<1)	// IN OUT-BOUND
				return;

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			// CHARGER FORMULAIRE
			$scope.formData.metier=$rootScope.jobyerCurrent['metier'];
			$scope.formData.job=$rootScope.jobyerCurrent['job'];
			$scope.formData.degre=$rootScope.jobyerCurrent['degre'];
			$scope.formData.indisp=$rootScope.jobyerCurrent['indisp'];
			$scope.formData.langue=$rootScope.jobyerCurrent['langue'];
		};

		// REFRESH BUTTONS
		$scope.refrechNavigation=function(){

			var idex=$scope.formData.currentFeuille;
			if(idex<1 || idex>$rootScope.jobyers.length)

				return;

			console.log("refrechNavigation : index = "+idex);

			// BUTTON NEXT - VERS IDEX++
			if($rootScope.jobyers.length && $rootScope.jobyers.length>1 && idex!=$rootScope.jobyers.length)
				$scope.formData.showButtRight=false;
			else
				$scope.formData.showButtRight=true;

			// BUTTON PREV
			if($rootScope.jobyers.length && $rootScope.jobyers.length>1 && idex>1)
				$scope.formData.showButtLeft=false;
			else
				$scope.formData.showButtLeft=true;

			console.log("$scope.formData.showButtLeft : "+$scope.formData.showButtLeft);
			console.log("$scope.formData.showButtRight : "+$scope.formData.showButtRight);
		};

		// PERSIST LIST JOBYERS
		$scope.saveJobyers=function(){

			// RECUPERATION DU LAST JOBYER
			var num=Number($scope.formData.allFeuilles);

			//$rootScope.jobyers[]metier=$scope.formData.metier;
			var job=$scope.formData.job;
			var degre=$scope.formData.degre;
			var indisp=$scope.formData.indisp;
			var langue=$scope.formData.langue;

			// RECUPERATION CONNEXION
			var connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("connexion : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var hasSessionID=0;
			if(sessionId)
				hasSessionID=1;
			else{
				AuthentificatInServer.getSessionId()
					.success(function (response){
						var jsonResp = x2js.xml_str2json(response);
						var jsonText = JSON.stringify (jsonResp);
						jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
						jsonResp = JSON.parse(jsonText);

						// GET SESSION ID
          				sessionId = jsonResp.amanToken.sessionId;
          				console.log("New sessionId : "+sessionId);
            localStorageService.set('sessionID', sessionId);
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
		};

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "competence" ){
				//$scope.initAll();
				$scope.formData['currentFeuille']=1;
				$scope.formData['allFeuilles']=1;

				// FEUILLE N°0
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=1;
				$rootScope.jobyers=[];
				$rootScope.jobyers.push($rootScope.jobyerCurrent);
			}
		});

		$scope.isValid=function(field){

			return !isNaN(Number(field));
		}

  })
;
