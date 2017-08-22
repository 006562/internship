/* Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
    See full license at the bottom of this file. */

/// <reference path="App.js" />

(function () {
   "use strict";
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();  
        });     
    };
})();
