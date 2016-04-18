
// feuille de style principale
require("../css/secretary.css");

// Chargement d'angular
var angular = require("angular");

// Elements d'interface
var angularMaterial = require("angular-material");
require("angular-material/angular-material.css");

// Messages d'erreur pour champs input
require("angular-messages");

// Transition douces animées
require("angular-animate");

// gestion des urls
require("angular-route");

// déclarer un module pour le cabinet médical, avec comme dépendance angular-material
var officeModule = angular.module("officeModule", [angularMaterial, 'ngMessages', 'ngAnimate']);

// enregistrer le service de traitement des données
require("./utils/datahandler.js")(officeModule);

// définir le composant cabinet medical
require("./components/medicalOffice/medicalOffice-component.js")(officeModule);

// définir le composant infirmier
require("./components/nurse/nurse-component.js")(officeModule);

// définir le composant patient
require("./components/patient/patient-component.js")(officeModule);

// définir le composant patient
require("./components/patientForm/patientForm-component.js")(officeModule);

// affichage d'informations sur le cabinet
require("./components/displayOfficeInformations/displayOfficeInformations-component.js")(officeModule);

// affichage d'informations sur le cabinet
require("./components/jsonPrettyPrint/jsonPrettyPrint-component.js")(officeModule);

// recherche de patients
require("./components/searchForm/searchForm-component.js")(officeModule);

// recherche de patients
require("./components/visit/visit-component.js")(officeModule);

// affichage dans une carte
require("./components/showAdressOnMap/showAdressOnMap-component.js")(officeModule);

// service d'affichage de message
require("./utils/mdtoast-service.js")(officeModule);

