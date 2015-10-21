/**
 * Created by Tamer on 14/10/2015.
 */


angular.module('cPhoneCtrls', ['ionic', 'parsingServices','wsConnectors', 'ngOpenFB', 'ngCookies'])

  .controller('cPhoneCtrl', function ($scope, $cookieStore, $state, x2js, AuthentificatInServer, PullDataFromServer, formatString, PersistInServer, LoadList){

	  // FORMULAIRE
	  $scope.formData = {};

	  $scope.country="France";
	  
	  $scope.connexionByPhone = function(){
		  
		for(var obj in $scope.formData){
			console.log("formData["+obj+"] : "+$scope.formData[obj]);
		}
		
		phone=$scope.formData.phone;
		country=$scope.formData.country;
		password=$scope.formData.password;

		var isNew=0;
		if(isEmpty(phone) || isEmpty(country) || isEmpty(password))
			return;

		// CONNEXION AU SERVEUR
		AuthentificatInServer.getSessionId()
			.success(function (response){

          var jsonResp = x2js.xml_str2json(response);
          var jsonText = JSON.stringify (jsonResp);
          jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
          jsonResp = JSON.parse(jsonText);

          // PUT SESSION ID
          sessionId = jsonResp.amanToken.sessionId;
          console.log("sessionId : "+sessionId);
		  $cookieStore.put('sessionID', sessionId);
		  
          // INTERROGE PHONE_TABLE
          PullDataFromServer.pullDATA("user_employeur", sessionId, "mot_de_passe", phone, phone)
            .success(function (resp){
              data=formatString.formatServerResult(resp);

              result=data.dataModel.rows;
              if(typeof result === 'undefined' || result.length<0 || result===""){
				  console.log('Aucune résultat trouvé');
				  // REDIRECTION VERS INSCRIPTION-1 : SAISIE CIVILITE
				  isNew=1;
			  }
			  else{
					// VERIFICATION DU PASSWORD
					var listEntry=[];
					listEntry=result.dataRow.dataRow.dataEntry;

					for(var i=0; i<listEntry.length; i++){
						var object=listEntry[i];

						for(var property in object) {
							if(property === 'attributeReference'){
								if(object[property] === password){
									// USER REEL - REDIRECTION VERS RECHERCHE
									$state.go("search");
								}
								else
									isNew=1;
							}
						}
					}
			  }

			  console.log("isNew : "+isNew);
			  if(isNew === 1){
				  // SYSTEME VERIFICATION TEL

				  // PERSIST IN BD - EMPLOYEUR
					PersistInServer.persistInEmployeur
						('', '', 0, 0, 0, '', '', phone, '', password, '', '', '', '', '', sessionId)
							.success(function (response){
								console.log("ID EMPLOYEUR : "+response);

								// RECUPERATION EMPLOYEUR ID
								employeur=formatString.formatServerResult(response);

								if(employeur.dataModel.status || employeur.dataModel.status !== 'FAILLURE')	// BIND IN COOKIES
									$cookieStore.put('employeID', employeur.dataModel.status);
									
								// LOAD LIST CIVILITES
								civilites=$cookieStore.get('civilites');
								if(!civilites){	
									LoadList.loadListCivilites(sessionId)
										.success(function (response){
											resp=formatString.formatServerResult(response);
											// DONNEES ONT ETE CHARGES
											console.log("les civilites ont été bien chargé");
											civiliteObjects=resp.dataModel.rows.dataRow;
											console.log("civiliteObjects : "+JSON.stringify(civiliteObjects));
											
											// GET CIVILITES
											civilites=[];
											civilite={}; // civilite.libelle | civilite.id

											civilitesList=[].concat(civiliteObjects);
											for(var i=0; i<civilitesList.length; i++){
												object=civilitesList[i].dataRow.dataEntry;
							
												// PARCOURIR LIST PROPERTIES
												civilite[object[0].attributeReference]=object[0].value;
												civilite[object[1].attributeReference]=object[1].value;
							
												if(civilite)
													civilites.push(civilite);
												civilite={}
											}
						
											console.log("civilites.length : "+civilites.length);
											// PUT IN SESSION
											$cookieStore.put('civilites', civilites);
										}).error(function (err){
											console.log("error : LOAD DATA");
											console.log("error in loadListCivilites : "+err);
										});
								}
								
								// PASSWORD INCORRECT - INSCRIPTION L2
								$state.go("saisieCiviliteEmployeur");
							}).error(function (err){
								console.log("error : insertion DATA");
								console.log("error : "+err);
							});
			  }			
            }).error(function (err){
              console.log("error : récuperation DATA");
              console.log("error : "+err);
            });
        })
        .error(function (data){
          console.log("error : récuperation JSessionId");
        });
     }
  
		$scope.initForm=function(){
			// GET LIST
			$scope.formData={
				'villes': $cookieStore.get('villes')};
		}
  })