/**
 * Created by Omar on 23/10/2015.
 */

angular.module('providerServices', [])

  .service('DataProvider', function () {
	  
		this.getVilles=function(){
			return [{"nom":"Paris","pk_user_ville":"40"},{"nom":"Lyon","pk_user_ville":"42"},{"nom":"Montpellier","pk_user_ville":"44"},{"nom":"Nice ","pk_user_ville":"46"}];
		}
		
		this.getZipCodes=function(){
			return [{"pk_user_code_postal":"40","libelle":"54245"},{"pk_user_code_postal":"42","libelle":"74237"},{"pk_user_code_postal":"44","libelle":"10654"},{"pk_user_code_postal":"46","libelle":"93402"},{"pk_user_code_postal":"48","libelle":"55857"}];
		}
		
		this.getCivilites=function(){
			return [{"pk_user_civilite":"44","libelle":"Madame"},{"pk_user_civilite":"42","libelle":"Mademoiselle"},{"pk_user_civilite":"40","libelle":"Monsieur"}];
		}
		
		this.getMetiers=function(){
			return [{"pk_user_metier":"40","libelle":"Restauration"},{"pk_user_metier":"42","libelle":"Hôtellerie"},{"pk_user_metier":"44","libelle":"Transport"},{"pk_user_metier":"46","libelle":"Bricolage"},{"pk_user_metier":"48","libelle":"Informatique"}];
		}
		
		this.getTransvers=function(){
			return [{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"},{"pk_user_competence_transverse":"44","libelle":"Souriant"}];
		}
		
		this.getJobs=function(){
			return [{"pk_user_competence":"60","libelle":"Conducteur"},{"pk_user_competence":"58","libelle":"Menuisier"},{"pk_user_competence":"54","libelle":"plombier"},{"pk_user_competence":"52","libelle":"Restauration"}];
		}

		this.getLangues=function(){
			return [{"pk_user_langue":"40","libelle":"Français"}];
		}
  })
  
  .service('UpdateDataProvider', function ($http){
	  // MISE A JOUR DATA FROM BD
  })
