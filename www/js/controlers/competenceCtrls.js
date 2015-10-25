/**
 * Created by Tamer on 15/10/2015.
 */

angular.module('competenceCtrls', ['ionic', 'wsConnectors','ngCookies', 'globalServices', 
		'providerServices', 'parsingServices'])
	
	/**.directive('clickEvent', function() {
		return function(scope, element, attrs){
			var clickingCallback = function() {
				alert('clicked!')
			};
			element.bind('click', clickingCallback);
		}
	})**/
	.controller('competenceCtrl', function ($scope, $cookieStore, $state, x2js, $rootScope, AuthentificatInServer,
						Global, DataProvider, PullDataFromServer, PersistInServer, LoadList, formatString) {
		// FORMULAIRE
		$scope.formData = {};

		// ALL JOBYERS
		$rootScope.jobyers=[];
		$rootScope.jobyerCurrent={};

		// NAVIGATION
		$scope.formData.showButtRight=true;
		$scope.formData.showButtLeft=true;

		$scope.initAll = function(){

			// GET LIST
			$scope.formData={
				'currentFeuille': 1,
				'allFeuilles': 1,
				'maitrise': 'Débutant',
				'maitriseIcon': 'icon ion-ios-rainy calm',
				'metiers': DataProvider.getMetiers(),
				'langues': DataProvider.getLangues(),
				'jobs': DataProvider.getJobs(),
				'transvers': DataProvider.getTransvers(),
				};

			// FEUILLE N°0
			$rootScope.jobyerCurrent['indice']=1;
			$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE MAIS C'EST UNDIFINED

			$scope.refrechNavigation();
		};

		$scope.rangeChange = function() {
			rangeModel=$scope.formData.degre;
			console.log("rangeModel : "+rangeModel);
			if (rangeModel <= 25 ){
        		$scope.formData.maitrise = "Débutant";
        		$scope.formData.maitriseIcon = "icon ion-ios-rainy calm";
      		}

      		else if (rangeModel > 25 && rangeModel <= 50 ) {
        		$scope.formData.maitrise = 'Habitué';
        		$scope.formData.maitriseIcon = "icon ion-ios-cloudy-outline calm";
      		}

      		else if (rangeModel > 50 && rangeModel <= 75 ){
        		$scope.formData.maitrise = 'Confirmé';
        		$scope.formData.maitriseIcon = "icon ion-ios-partlysunny-outline calm";
      		}
      		else if (rangeModel > 75 && rangeModel <= 100 ){
        		$scope.formData.maitrise = 'Waouh!';
        		$scope.formData.maitriseIcon = "icon ion-ios-sunny-outline calm";
      		}
		};

		$scope.afficheList = function(){
			//console.log("Formulaire : "+JSON.stringify($scope.formData));
			//AFFICHAGE
			console.log("All Jobyers : "+JSON.stringify($rootScope.jobyers));
		};

		$scope.addJobyer = function(){
			// VALIDATION DES CHAMPS
			metier=$scope.formData.metier;
			job=$scope.formData.job;
			degre=$scope.formData.degre;
			indisp=$scope.formData.indisp;
			langue=$scope.formData.langue;
			maitrise=$scope.formData.maitrise;
			maitriseIcon=$scope.formData.maitriseIcon;

			if(!$scope.isValid(metier) || !$scope.isValid(job) || !$scope.isValid(indisp) || !$scope.isValid(langue)){
				Global.showAlertValidation("Tous les champs sont requis");
				return;
			}


			// RECUPERER JOBYER Current
			jobyerCurrent=$rootScope.jobyerCurrent;
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
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].maitrise=maitrise;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].maitriseIcon=maitriseIcon;

				// UPDATE IN VIEW
				$scope.formData.currentFeuille=jobyerCurrent.indice+1;;
				$scope.formData.allFeuilles=$rootScope.jobyers.length;

				console.log("Old Jobyer : "+JSON.stringify($rootScope.jobyers[Number(jobyerCurrent.indice)-1]));
				// ADD NEW JOBYER
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=jobyerCurrent.indice+1;
				$rootScope.jobyerCurrent['metier']=metier;
				$rootScope.jobyerCurrent['job']=job;
				$rootScope.jobyerCurrent['degre']=degre;
				$rootScope.jobyerCurrent['indisp']=indisp;
				$rootScope.jobyerCurrent['langue']=langue;
				$rootScope.jobyerCurrent['maitrise']=maitrise;
				$rootScope.jobyerCurrent['maitriseIcon']=maitriseIcon;
				$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE ///MAIS C'EST UNDIFINED

				console.log("New Jobyer : "+JSON.stringify($rootScope.jobyers[Number($rootScope.jobyerCurrent.indice)-1]));

				// REFRESH BUTTONS
				//$scope.refrechNavigation();
			}

			$scope.refrechNavigation();
		}

		$scope.removeJobyer = function(){
			if($rootScope.jobyers.length<=1)
				return;
			
			idex=Number($scope.formData.currentFeuille);
			// DELETE OBJECT FROM LIST
			$rootScope.jobyers.splice(idex-1, 1);
			// UPDATE ALL INDICES
			for(var i=0; i<$rootScope.jobyers.length; i++){
				$rootScope.jobyers[i].indice=i+1;
			}

			$scope.refrechNavigation();

			if(idex<=1){
				// LOAD OBJECT NEXT
				$scope.formData.currentFeuille+=1;
				$scope.loadJobyer(idex+1);
			}else{
				// LOAD OBJECT PREV
				$scope.formData.currentFeuille-=1;
				$scope.loadJobyer(idex-1);
			}
			
			// UPDATE NBRE ITEMS
			$scope.formData['allFeuilles']=$rootScope.jobyers.length;
		}

		// LOAD NEXT FEUILLE
		$scope.loadNextJobyer = function(){
			
			var idex=Number($scope.formData.currentFeuille);
			console.log("Je suis ds loadNextJobyer -> Last Feuille = "+idex);
			if(idex === 0)
				idex=1;
			
			// TEST
			if(idex>=$rootScope.jobyers.length || idex<=0)	// IN OUT-BOUND
				return;
				
			// UPDATE FEUILLE
			idex+=1;
			$scope.formData.currentFeuille=idex;
			console.log("loadNextJobyer : currentFeuille = "+idex);
			
			$scope.refrechNavigation();

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];
			
			//console.log("formData : "+JSON.stringify($scope.formData));
			$scope.$apply(function(){});
		}
			
		// LOAD FEUILLE N°i
		$scope.loadJobyer = function(idex){
			
			// UPDATE FEUILLE
			$scope.formData.currentFeuille=idex;
			console.log("loadJobyer : currentFeuille = "+idex);
			
			$scope.refrechNavigation();

			if(idex>$rootScope.jobyers.length || idex<1)	// IN OUT-BOUND
				return;

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];
		}

		// LOAD PREV FEUILLE
		$scope.loadPrevJobyer = function(){
			
			var idex=Number($scope.formData.currentFeuille);
			console.log("Je suis ds loadPrevJobyer -> Last Feuille = "+idex);
			if(idex === 0)
				idex=1;
			
			// TEST
			if(idex>$rootScope.jobyers.length || idex<=0)	// IN OUT-BOUND
				return;
				
			// UPDATE FEUILLE
			idex-=1;
			if(idex===0)
				idex=1;
			$scope.formData.currentFeuille=idex;
			console.log("loadPrevJobyer : currentFeuille = "+idex);
			
			$scope.refrechNavigation();

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];
			
			//console.log("formData : "+JSON.stringify($scope.formData));
			$scope.$apply(function(){});
		}
		
		// REFRESH BUTTONS
		$scope.refrechNavigation=function(){

			idex=Number($scope.formData.currentFeuille);
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
		}

		// PERSIST LIST JOBYERS
		$scope.saveJobyers=function(){

			// RECUPERATION DU LAST JOBYER[FEUILLE COURANTE]
			idex=Number($scope.formData.currentFeuille)-1;
			
			// MODIFICATION JOBYER COURANT
			$rootScope.jobyers[idex].metier=$scope.formData.metier;
			$rootScope.jobyers[idex].job=$scope.formData.job;
			$rootScope.jobyers[idex].degre=$scope.formData.degre;
			$rootScope.jobyers[idex].indisp=$scope.formData.indisp;
			$rootScope.jobyers[idex].langue=$scope.formData.langue;
			$rootScope.jobyers[idex].maitrise=$scope.formData.maitrise;
			$rootScope.jobyers[idex].maitriseIcon=$scope.formData.maitriseIcon;

			// RECUPERATION CONNEXION
			connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			employeId=connexion.employeID;
			console.log("connexion : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');

			console.log("Offres A Persister : "+JSON.stringify($rootScope.jobyers));

			hasSessionID=0;
			if(sessionId)
				hasSessionID=1;
			else{	// RECUPERATION SESSION-ID
				AuthentificatInServer.getSessionId()
					.success(function (response){
						var jsonResp = x2js.xml_str2json(response);
						var jsonText = JSON.stringify (jsonResp);
						jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
						jsonResp = JSON.parse(jsonText);

						// GET SESSION ID
          				sessionId = jsonResp.amanToken.sessionId;
          				console.log("New sessionId : "+sessionId);
		  				$cookieStore.put('sessionID', sessionId);
						hasSessionID=1;
					})
					.error(function (err){
						console.log("error : Récuperation Session ID");
						console.log("error In saveJobyers: "+err);
					});
			}

			if(hasSessionID){
				console.log("Je suis dans : hasSessionID");
				
				//  PERSIST IN BD - OFFRE
				//LoadList.loadList("user_langue", sessionId)
				//PullDataFromServer.pullDATA("user_langue", sessionId, "identifiant", 21, 21)
				//PullDataFromServer.pullDATA("user_maitrise_langue_offre", sessionId, "fk_user_langue", 40, 40)
				PersistInServer.persistInOffres(employeId, "Titre_2", "Description_2", new Date().getTime(), new Date().getTime()+2592000 , sessionId, employeId)
					.success(function (response){
						console.log("response : "+response);
						
						// RECUPERATION EMPLOYEUR ID
						offre=formatString.formatServerResult(response);
						if(offre.dataModel.status || offre.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
							$cookieStore.put('offreID', Number(offre.dataModel.status));
						}
						
						// DONNEES ONT ETE SAUVEGARDES
						console.log("offreID a été bien récuperé : "+$cookieStore.get('offreID'));
						
						offreId=$cookieStore.get('offreID');
						if(offreId){
							// PARCOURIR ALL JOBYERS
							for(var i=0; i<$rootScope.jobyers.length; i++){
								offre=$rootScope.jobyers[i];
								if(offre.job){
									// PERSISTENCE IN COMPETANCE
									PersistInServer.persistInOffres_Competences(sessionId, Number(offre.job), Number(offreId))
										.success(function (response){
											console.log("success : persistInOffres_Competences"+response);
										}).error(function (err){
												console.log("error : insertion DATA");
												console.log("error In persistInOffres_Competences: "+err);
										});
								}
								if(offre.indisp){
									// PERSISTENCE IN TRANSVERS
									PersistInServer.persistInOffres_Transvers(sessionId, Number(offre.indisp), Number(offreId))
										.success(function (response){
											console.log("success : persistInOffres_Transvers"+response);
										}).error(function (err){
												console.log("error : insertion DATA");
												console.log("error In persistInOffres_Transvers: "+err);
										});
								}
								if(offre.langue){
									console.log("langue : "+offre.langue);
									// PERSISTENCE IN LANGUES
									PersistInServer.persistInOffres_Langues(sessionId, Number(offre.langue), Number(offreId))
										.success(function (response){
											console.log("success : persistInOffres_Langues"+response);
										}).error(function (err){
												console.log("error : insertion DATA");
												console.log("error In persistInOffres_Langues: "+err);
										});
								}
							}
							
							// SHOW MODAL
							Global.showAlertPassword("Merci! Vos Offres sont été bien publiés.");
							// REDIRECTION VERS SEARCH
							$state.go("search");
						}
						
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In PullDataFromServer.pullDATA: "+err);
					});
			}
		}

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "competence" ){
				console.log("Initialisation : beforeEnter");
				$scope.formData['currentFeuille']=1;
				$scope.formData['allFeuilles']=1;

				// FEUILLE N°1
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=1;
				$rootScope.jobyers=[];
				$rootScope.jobyers.push($rootScope.jobyerCurrent);
			}
		});

		$scope.isValid=function(field){

			return !isNaN(Number(field));
		}

  });
