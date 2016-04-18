/**
 * Composant de représentation d'un patient.
 * @type Module patient-template|Module patient-template
 */

// récuperer le template et le css
var template = require('./patient-template.html');
require('./patient-component.css');


// utilitaires et constantes
var utils = require('../../utils/utils.js');
var constants = require('../../utils/constants.js');


var Controller = function ($mdDialog, $scope, datah, $mdToast) {

    // utilitaires
    this.datah = datah;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$scope = $scope;
    this.utils = utils;
    this.smallContent = "100px";
    this.largeContent = "200px";

    // copie des données pour modification dans le formulaire
    this.modificationsData = JSON.parse(JSON.stringify(this.data || {}));
    this.modificationsData.birthdate = new Date(this.modificationsData.birthdate);

    // données formattées à afficher en résumé
    var prettyBirthdate = this.utils.getPrettyDate(this.data.birthdate);
    this.summaryDatas = {
        "Née le": prettyBirthdate + " (" + this.data.age + " ans)",
        "Adresse": this.data.adressComplete
    };

    // les modes d'affichage du patient
    this.availablesDisplayModes = ["summary", "complete", "visits", "modification", "$mdToast"];
    this.setDisplayMode("summary");

    this.actions = datah.getActions();
};
Controller.$inject = ["$mdDialog", "$scope", constants.serviceDataHandler, "$mdToast"];

/**
 * Modifier l'affichage du composant. Par exemple: seulement qqu informations, 
 * les visites, le formulaire de modification, ...
 * @param {type} mode
 * @returns {undefined}
 */
Controller.prototype.setDisplayMode = function (mode) {

    if (this.availablesDisplayModes.indexOf(mode) === -1) {
        throw constants.INVALID_ARGUMENT + ": " + mode;
    }
    this.displayMode = mode;
};
/**
 * Demande confirmation puis supprime un utilisateur.
 * @returns {undefined}
 */
Controller.prototype.deletePatient = function () {

    // confirmer la suppression avec une boite de dialogue
    var vm = this;
    this.$mdDialog.show({
        controller: function () {
            this.data = vm.data;
            this.hide = function (answer) {
                vm.$mdDialog.hide(answer);
            };
        },
        controllerAs: "$ctrl",
        template: require("./suppressionDialog.html"),
        clickOutsideToClose: false
    })

            // boite fermée, vérifier la réponse
            .then(function (answer) {
                if (answer === true) {

                    // supprimer le patient
                    vm.datah.deletePatient(vm.data)

                            // suppression effective
                            .then(function (response) {
                                console.log(response);
                                utils.simpleToast(vm.$mdToast, "Suppression effective.");
                            })

                            // erreur lors de la suppression
                            .catch(function (response) {

                                console.log(response);

                                utils.simpleToast(vm.$mdToast,
                                        "Erreur lors de la suppression. Veuillez réessayer.",
                                        6000);

                            });

                    // notification du composant parent si necessaire
                    if (typeof vm.onPatientModified !== "undefined") {
                        vm.onPatientModified();
                    }
                }
            });

};

/**
 * Demande confirmation puis supprime un utilisateur.
 * @returns {undefined}
 */
Controller.prototype.showPatientAdressInDialog = function () {

    // confirmer la suppression avec une boite de dialogue
    var vm = this;
    this.$mdDialog.show({
        controller: function () {
            this.adress = vm.data.adressComplete + ", France";
            this.patientIdentity = vm.data.name + " " + vm.data.firstname;
            this.hide = function (answer) {
                vm.$mdDialog.hide(answer);
            };
        },
        controllerAs: "$ctrl",
        template: require("./mapDialog.html"),
        clickOutsideToClose: true
    });

};

/**
 * L'utilisateur vient de modifier le patient, notifier le parent si necessaire
 * @returns {undefined}
 */
Controller.prototype.formHasBeenValidated = function () {
    // notification du composant parent si necessaire
    if (typeof this.onPatientModified !== "undefined") {
        this.onPatientModified();
    }
};

module.exports = function (angularMod) {

    angularMod.component("patient", {
        bindings: {
            /**
             * Les données du patient à afficher
             */
            data: "<",
            /**
             * La listes des infirmiers disponibles. La liste est passée ici en paramètre 
             * pour éviter les appels à répétition 
             */
            nurses: "<",
            /**
             * Une fonction optionnelle qui sera appelée en cas de modification
             */
            onPatientModified: "&",
        },
        controller: Controller,
        template: template
    });
};
