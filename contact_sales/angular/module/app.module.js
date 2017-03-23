// Copyright 2015 Alec Thilenius
// All rights reserved.
var app = angular.module('app', [
  'angular-google-analytics',
  'angular-md5',
  'angular.filter',
  'lbServices',
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'noCAPTCHA',
  'signature',
  'tc.chartjs',
  'ui.bootstrap',
  'ui.router',
  'uiGmapgoogle-maps',
  'infinite-scroll'
]).value('THROTTLE_MILLISECONDS', 10);

var redirectReady = false;

/** @ngInject */
function appRun($rootScope, $state, Analytics, $location, Person, navigate) {
  // Load current user if there is one
  Person.getCurrent().$promise.then(p => {
    // currentUser set in navigate service
    redirectReady = true;
  }).finally(() => redirectReady = true);
  // Manyally track Google Analytics pages so that '/' doesn't bounce
  $rootScope.$on('$stateChangeSuccess',
    (event, toState, toParams, fromState, fromParams) => {
      // Ignore all '/' reverse proxy requests in Analytics
      if (toState.name !== '/') {
        Analytics.trackPage($location.path() +
          toState.name.replace(/\./g, '/'),
          toState.name);
      }
    });
};

app.run(appRun);

//==============================================================================
//  DEBUG
//==============================================================================
/** @ngInject */
function debugRun($q, $http, Person, LoopBackAuth, ContactEntry, Customer,
  Address, Dealmaker, Document, baseData, PotentialCustomer) {
  window.q = $q;
  window.$http = $http;
  window.Person = Person;
  window.LoopBackAuth = LoopBackAuth;
  window.ContactEntry = ContactEntry;
  window.Customer = Customer;
  window.Address = Address;
  window.Dealmaker = Dealmaker;
  window.Document = Document;
  window.baseData = baseData;
  window.PotentialCustomer = PotentialCustomer;

};

app.run(debugRun);
//==============================================================================
//  DEBUG
//==============================================================================

/** @ngInject */
function logoutHttpInterceptor($q, $rootScope, $location, LoopBackAuth) {
  return {
    responseError: rejection => {
      if (rejection.status === 401 && redirectReady) {
        console.log('401 Logout: ', rejection);
        // Clear the loopback values from client browser for safe logout
        LoopBackAuth.clearUser();
        LoopBackAuth.clearStorage();
        $rootScope.currentUser = null;
        $location.nextAfterLogin = $location.path();
        $location.path('/login');
      }
      return $q.reject(rejection);
    }
  };
};

/** @ngInject */
function appConfigure($compileProvider, $httpProvider, AnalyticsProvider,
  noCAPTCHAProvider) {
  // Setup Google Anylitics
  AnalyticsProvider
  // Manually track pages (see appRun)
    .trackPages(false)
    .setAccount('UA-80074104-1')
    .setDomainName('none');
  noCAPTCHAProvider.setSiteKey('6LefxhEUAAAAAK-qxEzw87evItUrLl0oDfvYIwzg');
  // Allow 'tel' in href tags
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|mailto):/);
  // Register the logout on Invalid Authentication handler
  $httpProvider.interceptors.push(logoutHttpInterceptor);
};

app.config(appConfigure);
