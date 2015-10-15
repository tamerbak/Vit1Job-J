/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('wsConnectors', ['ionic'])

  .service('AuthentificatInServer', function ($http){
    this.pullSessionId=function(){

      var soapMessage=
        '<fr.protogen.connector.model.AmanToken>'+
        '<username>administrateur</username>'+
        '<password>1234</password>'+
        '<nom></nom>'+
        '<appId>FRZ48GAR4561FGD456T4E</appId>'+
        '<sessionId></sessionId>'+
        '<status></status>'+
        '<id>0</id>'+
        '<beanId>0</beanId>'+
        '</fr.protogen.connector.model.AmanToken>';
      //console.log(soapMessage);

      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/aman',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };
  })

  .service('PullDataFromServer', function ($http){
      this.pullDATA=function(entity, sessionId, field, gt, lt){
        sopMessage = '<fr.protogen.connector.model.DataModel>'+
          '<entity>'+entity+'</entity>'+
          '<dataMap/><rows />'+
          '<token>'+
          '<username/>'+
          '<password/>'+
          '<nom>Jakjoud Abdeslam</nom>'+
          '<appId>FRZ48GAR4561FGD456T4E</appId>'+
          '<sessionId>'+sessionId+'</sessionId>'+
          '<status>SUCCES</status>'+
          '<id>206</id>'+
          '<beanId>0</beanId>'+
          '</token>'+
          '<expired></expired>'+
          '<unrecognized></unrecognized>'+
          '<status></status>'+
          '<operation>GET</operation>'+
          '<clauses>'+
          '<fr.protogen.connector.model.SearchClause>'+
          '<field>'+field+'</field>'+
          '<clause></clause>'+
          '<gt>'+gt+'</gt>'+
          '<lt>'+lt+'</lt>'+
          '<type>TEXT</type>'+
          '</fr.protogen.connector.model.SearchClause>'+
          '</clauses>'+
          '<page>1</page>'+
          '<pages>5</pages>'+
          '<nbpages>0</nbpages>'+
          '<iddriver>0</iddriver>'+
          '<ignoreList></ignoreList>'+
          '</fr.protogen.connector.model.DataModel>';

        // ENVOI AU SERVEUR
        return $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
          headers: {
            "Content-Type": "text/xml"
          },
          data: sopMessage
        });
      }
    })

  .service('PersistInServer', function ($http){
    this.pullSessionId=function(
		id, nom, prenom, cin, description, lambert, ville, zipCode, adress1, adress2,
		civilite, birthDate, numSS, nationalite, phone, email, password){

      var soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_employeur</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
						'<fr.protogen.connector.model.DataEntry>'+	// ID Salarié
							'<label>&lt;![CDATA[ID Salarié]]&gt;</label>'+
          					'<attributeReference>pk_user_salarie</attributeReference>'+
          					'<type>PK</type>'+
          					'<value>&lt;![CDATA['+id+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Nom
          					'<label>&lt;![CDATA[Nom]]&gt;</label>'+
          					'<attributeReference>nom</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+nom+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Prénom
          					'<label>&lt;![CDATA[Prénom]]&gt;</label>'+
          					'<attributeReference>prenom</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+prenom+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// CIN
          					'<label>&lt;![CDATA[CIN]]&gt;</label>'+
          					'<attributeReference>cin</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+cin+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Description profil
          					'<label>&lt;![CDATA[Description profil]]&gt;</label>'+
          					'<attributeReference>description_profil</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+description+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Coordonnées Lambert
          					'<label>&lt;![CDATA[Coordonnées Lambert]]&gt;</label>'+
          					'<attributeReference>coordonnees_lambert</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+lambert+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Ville
          					'<label>&lt;![CDATA[Ville]]&gt;</label>'+
          					'<attributeReference>fk_user_ville</attributeReference>'+
          					'<type>fk_user_ville</type>'+
							'<list/>'+
          					'<value>&lt;![CDATA['+ville+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Code postal
          					'<label>&lt;![CDATA[Code postal]]&gt;</label>'+
          					'<attributeReference>fk_user_code_postal</attributeReference>'+
          					'<type>fk_user_code_postal</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+zipCode+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Adresse 1
          					'<label>&lt;![CDATA[Adresse 1]]&gt;</label>'+
          					'<attributeReference>adresse_1</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress1+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Adresse 2
          					'<label>&lt;![CDATA[Adresse 2]]&gt;</label>'+
          					'<attributeReference>adresse_2</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress2+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Civilité
          					'<label>&lt;![CDATA[Civilité]]&gt;</label>'+
          					'<attributeReference>fk_user_civilite</attributeReference>'+
          					'<type>fk_user_civilite</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+civilite+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Date de naissance
          					'<label>&lt;![CDATA[Date de naissance]]&gt;</label>'+
          					'<attributeReference>date_de_naissance</attributeReference>'+
          					'<type>DATE</type>'+
          					'<value>&lt;![CDATA['+birthDate+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Numéro SS
          					'<label>&lt;![CDATA[Numéro SS]]&gt;</label>'+
          					'<attributeReference>numero_ss</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+numSS+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Nationalité
          					'<label>&lt;![CDATA[Nationalité]]&gt;</label>'+
          					'<attributeReference>fk_user_nationalite</attributeReference>'+
          					'<type>fk_user_nationalite</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+nationalite+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Téléphone
          					'<label>&lt;![CDATA[Téléphone]]&gt;</label>'+
          					'<attributeReference>telephone</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+phone+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Email
          					'<label>&lt;![CDATA[Email]]&gt;</label>'+
          					'<attributeReference>email</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+email+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Mot de passe
          					'<label>&lt;![CDATA[Mot de passe]]&gt;</label>'+
          					'<attributeReference>mot_de_passe</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+password+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
			'<username></username>'+
			'<password></password>'+
			'<nom>Jakjoud Abdeslam</nom>'+
			'<appId>FRZ48GAR4561FGD456T4E</appId>'+
			'<sessionId>f54bcd23-5ab0-4f9a-a937-59a42505a008</sessionId>'+
			'<status>SUCCES</status>'+
			'<id>206</id>'+
			'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>GET</operation>'+
			'<clauses>'+
			'<fr.protogen.connector.model.SearchClause>'+
			'<field>libelle</field>'+
			'<clause></clause>'+
			'<gt>jav</gt>'+
			'<lt></lt>'+
			'<type>TEXT</type>'+
			'</fr.protogen.connector.model.SearchClause>'+
			'</clauses>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };
  })

