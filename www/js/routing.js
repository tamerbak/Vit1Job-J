/**
 * Created by HODAIKY on 24/10/2015.
 */
'use strict';

starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })

    .state('search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'searchCtrl'

    })

    .state('connection', {
      url: '/connection',
      templateUrl: 'templates/connections.html',
      controller: 'connectCtrl'

    })

    .state('profile', {
      url: "/profile",
      templateUrl: "templates/profile.html",
      controller: "ProfileCtrl"
    })

    .state('list', {
      url: '/list',
      templateUrl: 'templates/listEmployers.html',
      controller: 'listCtrl'

    })

    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'

    })
	/*
    .state('listNext', {
      url: '/listNext',
      templateUrl: 'templates/listEmployersNext.html',
      controller: 'listNextCtrl'

    })
	*/
    .state('cPhone', {
      url: '/cPhone',
      templateUrl: 'templates/connexionPhone.html',
      controller: 'cPhoneCtrl'
    })

    .state('cMail', {
      url: '/cMail',
      templateUrl: 'templates/connexionMail.html',
      controller: 'cMailCtrl'
    })
    .state('saisieCiviliteJobeyer', {
      url: '/saisieCivilite',
      templateUrl: 'templates/saisieCiviliteJobeyer.html',
      controller: 'saisieCiviliteJobeyerCtrl'
    })

    .state('adresseTravail', {
      url: '/adresseTravail',
      templateUrl: 'templates/adresseTravail.html',
      controller: 'adresseTravailCtrl'
    })

    .state('adressePersonel', {
      url: '/adressePersonel',
      templateUrl: 'templates/adressePersonel.html',
      controller: 'adressePersonelCtrl'
    })

    .state('competence', {
      url: '/competence',
      templateUrl: 'templates/competences.html',
      controller: 'competenceCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
