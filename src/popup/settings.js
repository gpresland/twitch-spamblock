settings = {};

settings.options = {
    allcaps: {
        name: 'allcaps',
        category: 'hide',
        description: 'ALL CAPS',
        tooltip: 'Hide messages in ALL CAPS',
        value: false
    },
    cleanup: {
        name: 'cleanup',
        category: 'transform',
        description: 'Clean Up',
        tooltip: 'Trim and remove extra whitespace',
        value: false
    },
    command: {
        name: 'command',
        category: 'hide',
        description: 'Commands',
        tooltip: 'Hide bot commands e.g. !command',
        value: false
    },
    copypaste: {
        name: 'copypaste',
        category: 'hide',
        description: 'Copy Pastas',
        tooltip: 'Hide repeat copy & paste text',
        value: false
    },
    custom: {
        name: 'custom',
        category: 'hide',
        description: 'Custom Strings',
        tooltip: 'Block messages containing customs strings below',
        value: false
    },
    cyrillic: {
        name: 'cyrillic',
        category: 'hide',
        description: 'Cyrillic',
        tooltip: 'Hide Cyrillic (Russian) text',
        value: false
    },
    debug: {
        name: 'debug',
        category: 'other',
        description: 'Log Hidden to Console',
        tooltip: 'Shows hidden messages in the console',
        value: false
    },
    donger: {
        name: 'donger',
        category: 'hide',
        description: 'Dongers',
        tooltip: 'Hide dongers i.e. unicode art',
        value: false
    },
    drawing: {
        name: 'drawing',
        category: 'hide',
        description: 'Drawings',
        tooltip: 'Hide block drawings',
        value: false
    },
    emotes: {
        name: 'emotes',
        category: 'transform',
        description: 'Remove Emotes',
        tooltip: 'Hide all Twitch emotes',
        value: false
    },
    long: {
        name: 'long',
        category: 'hide',
        description: 'Long Messages',
        tooltip: 'Hide long messages',
        value: false
    },
    lowercase: {
        name: 'lowercase',
        category: 'transform',
        description: 'To Lowercase',
        tooltip: 'Make all messages lowercase',
        value: false
    },
    short: {
        name: 'short',
        category: 'hide',
        description: 'Short Messages',
        tooltip: 'Hide short messages',
        value: false
    }
};

// Custom string filter
settings.blockstring = [];

/**
 * Save settings to local storage
 *
 * @return {void}
 */
settings.save = function settingsSave() {
    
    var key;
    
    var saveSettings = {
        options: {},
        blockstring: settings.blockstring
        
    };
    
    for (key in settings.options) {
        saveSettings.options[key] = settings.options[key].value;
    }
    
    chrome.storage.sync.set(saveSettings, function () {
        // saved 
    });
};

/**
 * Clear all settings back to default values
 *
 * @return {void}
 */
settings.clear = function settingsClear() {
    
    chrome.storage.sync.clear();
};

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