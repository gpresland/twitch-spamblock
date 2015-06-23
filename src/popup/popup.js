(function () {
    $(document).ready(function () {
        settings.load(function (settings) {
            var i, html, option, stringblock, value;
            // Toggle setting changes
            for (i in settings.options) {
                option = settings.options[i];
                value = (option.value) ? 'checked="checked"' : '';
                html = '<li>' +
                    '<div class="option-text" title="' + option.tooltip + '">' + option.description +
                    '<div class="option-controls">' +
                        '<div class="switch">' +
                            '<input id="toggle-' + option.name + '" class="toggle toggle-round" type="checkbox" ' + value + '>' +
                            '<label for="toggle-' + option.name + '"></label>' +
                        '</div>' +
                    '</div>' +
                '</li>';
                $('#' + option.category + '-options').append(html);
                $('#toggle-' + option.name).change(optionChange(option));
            }
            // Blockstring change
            stringblock = settings.blockstring.join(';');
            if (stringblock.length > 0) {
                stringblock += ';';
            }
            $('#blockstring').val(stringblock);
            $('#blockstring').bind('input propertychange', blockstringChange);
        });
    });
}());


/**
 * Event for toggle switch change
 *
 * @return {void}
 */
function optionChange(option) {
    return function () {
        option.value = document.getElementById('toggle-' + option.name).checked;
        settings.options[option.name].value = option.value;
        settings.save();
        updatePageSettings();
    };
}

/**
 * Event for blockstring list change
 *
 * @return {void}
 */
function blockstringChange() {
    var blockstring, strings;
    blockstring = $('#blockstring').val().trim().toLowerCase();
    strings = blockstring.split(';').filter(function (s) {
        if (s.length > 0) return s;
    });
    settings.blockstring = strings;
    settings.save();
    updatePageSettings();
}
    
/**
 * Send message to background script to update page settings
 *
 * @return {void}
 */
function updatePageSettings() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var port = chrome.tabs.connect(tabs[0].id, {name: "twitch-spamblock"});
        port.postMessage({
            options: settings.options,
            blockstring: settings.blockstring
        });
    });
}