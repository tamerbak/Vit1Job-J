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

    .state('employersTab', {
      url: '/employersTab',
      abstract: true,
      templateUrl: 'templates/employersTab.html',
    })

    .state('employersTab.list', {
      url: '/listEmployers',
      views: {
        'employersTab-list': {
          templateUrl: 'templates/employersList.html',
          controller: 'employersListCtrls'
        }
      }
    })

    .state('employersTab.map', {
      url: '/map',
      views: {
        'employersTab-map': {
          templateUrl: 'templates/employersMap.html',
          controller: 'employersMapCtrls'
        }
      }
    })

    .state('employersTab.options', {
      url: '/options',
      views: {
        'employersTab-options': {
          templateUrl: 'templates/employersOptions.html',
          controller: 'employersOptionsCtrls'
        }
      }
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
    .state('disponibilite', {
      url: '/disponibilite',
      templateUrl: 'templates/disponibilite.html',
      controller: 'disponibiliteCtrl'
    })
    .state('offres', {
      url: '/offres',
      templateUrl: 'templates/offres.html',
      controller: 'offresCtrl'
    })
    .state('offreTabs', {
      url: '/offreTabs/:offre',
      cache: false,
      abstract: true,
      templateUrl: 'templates/offreTabs.html',
      controller: 'offreTabsCtrl'
    })
    .state('contract', {
      url: '/contract',
      params: {jobyer: null},
      templateUrl: 'templates/createContract.html',
      controller: 'contractCtrl'
    })
    .state('offreTabs.job', {
      url: '/job/:offre',
      views: {
        'offreTabs-job': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/job.html'
        }
      }
    })
    .state('offreTabs.qualites', {
      url: '/qualites',
      views: {
        'offreTabs-qualites': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/qualites.html'
        }
      }
    })
    .state('offreTabs.langues', {
      url: '/langues',
      views: {
        'offreTabs-langues': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/langues.html'
        }
      }
    })
    .state('offreTabs.agenda', {
      url: '/agenda',
      views: {
        'offreTabs-agenda': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/agenda.html'
        }
      }
    })
    .state('competence', {
      url: '/competence',
      templateUrl: 'templates/competences.html',
      controller: 'competenceCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
