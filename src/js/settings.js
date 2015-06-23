settings = {};

//
settings.options = {
    allcaps: {
        name: 'allcaps',
        value: false
    },
    cleanup: {
        name: 'cleanup',
        value: false
    },
    command: {
        name: 'command',
        value: false
    },
    copypaste: {
        name: 'copypaste',
        value: false
    },
    custom: {
        name: 'custom',
        value: false
    },
    cyrillic: {
        name: 'cyrillic',
        value: false
    },
    debug: {
        name: 'debug',
        value: false
    },
    donger: {
        name: 'donger',
        value: false
    },
    drawing: {
        name: 'drawing',
        value: false
    },
    emotes: {
        name: 'emotes',
        value: false
    },
    long: {
        name: 'long',
        value: false
    },
    lowercase: {
        name: 'lowercase',
        value: false
    },
    short: {
        name: 'short',
        value: false
    }
};

// Custom string filter
settings.blockstring = [];

/**
 * Load settings from local storage
 *
 * @param  {object} callback  The callback to run once settings are retreived
 * @return {void}
 */
settings.load = function settingsLoad(callback) {
    
    chrome.storage.sync.get(null, function (items) {
        
        var i;
        
        // Set options
        for (i in settings.options) {
            if (items.hasOwnProperty('options') &&
                typeof items.options !== 'undefined') {
                settings.options[i].value = items.options[i];
            } else {
                settings.options[i].value = false;
            }
        }
        
        // Set blockstring
        if (items.hasOwnProperty('blockstring')) {
            settings.blockstring = items.blockstring;
        }
        
        typeof callback === 'function' && callback({
            options: settings.options,
            blockstring: settings.blockstring
        });
    });
};