/*
* This file is used in the AngularJS application for Natuurhulpcentrum.
* The functions inside this file allow for dynamic routing which is needed in order to establish a connection to the Angular 5 version.
* */

var dynamicRouting = {
    baseUrlV3: null,

    loadEnvironmentConfig: function () {
        var request = $.get('/api-v2/environment');
        request.then(function (result) {
            dynamicRouting.baseUrlV3 = 'http://' + result.ROUTING_V3_HOST + (result.ROUTING_V3_PORT == '' ? '' : (':' + result.ROUTING_V3_PORT)) + result.ROUTING_V3_PATH;
        });
        return request;
    },
    redirectToDynamicRoute: function (route) {
        if (dynamicRouting.baseUrlV3 == undefined)
            dynamicRouting.loadEnvironmentConfig().then(function () {
                window.location = dynamicRouting.baseUrlV3 + route;
            });
        else
            window.location = dynamicRouting.baseUrlV3 + route;
    }
};


