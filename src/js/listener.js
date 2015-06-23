(function () {
    
    'use strict';
    
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name == "twitch-spamblock");
        port.onMessage.addListener(function(request, sender, sendResponse) {
            updatesOptions(request);
        });
    });

    function updatesOptions(settings) {
        var s = document.createElement('script');
        s.setAttribute('id', 'tsb-update-script');
        s.type = 'text/javascript';
        s.appendChild(document.createTextNode(
            '(function () {' +
                'tsb.settings.options = ' + JSON.stringify(settings.options) + ';' +
                'tsb.settings.blockstring = ' + JSON.stringify(settings.blockstring) + ';' +
            '}());' 
        ));
        document.body.appendChild(s);
        document.body.removeChild(document.getElementById('tsb-update-script'));
    }
}());