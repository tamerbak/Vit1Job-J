/**
 * Created by Omar on 16/10/2015.
 */

angular.module('fileServices', ['ionic', 'cb.x2js'])

  .service('UploadFile', function ($http) {

	  this.uploadFile=function(table, fileName, contenu, employeurID){

		var soapMessage=
			'<fr.protogen.connector.model.StreamedFile>'+
				'<identifiant>'+employeurID+'</identifiant>'+
				'<fileName>'+fileName+'</fileName>'+
				'<table>'+table+'</table>'+
				'<operation>PUT</operation>'+
				'<stream>'+contenu+'</stream>'+
			'</fr.protogen.connector.model.StreamedFile>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/fss',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  }


	  this.downloadFile=function(table, employeurID){

		var soapMessage=
			'<fr.protogen.connector.model.StreamedFile>'+
				'<identifiant>'+employeurID+'</identifiant>'+
				'<fileName></fileName>'+
				'<table>'+table+'</table>'+
				'<operation>GET</operation>'+
				'<stream></stream>'+
			'</fr.protogen.connector.model.StreamedFile>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/fss',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  }

	this.fileToBase64=function(file){
		result='';

		if(file){
			var reader = new FileReader();

			console.log("reader : "+reader);
			reader.onload = function(readerEvt) {
				var binaryString = readerEvt.target.result;
				result=btoa(binaryString);
			};

			reader.readAsBinaryString(file);
		}
		return result;
	}


  })
