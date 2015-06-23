// INJECTOR
//
// This script is the primary script we launch,
// which pushes our real script into the DOM.
// We need run our script from the DOM due to
// Chrome's isolated execution environment for
// extensions. In order to hijack the twitch chat
// we must be running from Twitch's version of the
// isolated DOM.
// See: https://developer.chrome.com/extensions/content_scripts#execution-environment

(function tsbInjector() {
    
    'use strict';
    
    // Get options for the extension
    settings.load(function (settings) {
        
        // Add settings to the DOM
        
        var s = document.createElement('script');
        
        s.type = 'text/javascript';
        s.appendChild(document.createTextNode(
            '(function () {' +
                'tsb = {' +
                    'ui: null,' +
                    'settings: {' +
                        'blockstring: [],' +
                        'options: null' +
                    '}' +    
                '};' + 
                'tsb.settings.options = ' + JSON.stringify(settings.options) + ';' +
                'tsb.settings.blockstring = ' + JSON.stringify(settings.blockstring) + ';' +
            '}());' 
        ));
        
        document.body.appendChild(s);
        
        // Add filters to the DOM
        
        s = document.createElement('script');
        
        s.type = 'text/javascript';
        s.src  = chrome.extension.getURL('js/resource.min.js');
        
        document.body.appendChild(s);
        
        // Add filters sourcemap
        
        s = document.createElement('script');
        
        s.type = 'text/javascript';
        s.src  = chrome.extension.getURL('js/resource.min.js.map');
        
        document.body.appendChild(s);
        
//        // Add filters to the DOM
//        
//        s = document.createElement('script');
//        
//        s.type = 'text/javascript';
//        s.src  = chrome.extension.getURL('js/filters.js');
//        
//        document.body.appendChild(s);
//        
//        // Add UI to the DOM
//        
//        s = document.createElement('script');
//        
//        s.type = 'text/javascript';
//        s.src  = chrome.extension.getURL('js/ui.js');
//        
//        document.body.appendChild(s);
//        
//        // Add script to the DOM
//        
//        s = document.createElement('script');
//        
//        s.type = 'text/javascript';
//        s.src  = chrome.extension.getURL('js/bootstrap.js');
//        
//        document.body.appendChild(s);
    });    
}());