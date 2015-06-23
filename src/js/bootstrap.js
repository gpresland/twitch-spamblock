/**
 * Applies filters to received Twitch room messages, blocking ones that fail the filter
 *
 * @param  {object}  msg  The Twitch room message object
 * @return {object} 
 */
function msgFilter(msg) {
    
    msg = filtering.apply(msg);
    
    // Catch errors occuring in message filtering
    if (typeof msg === 'undefined' ||
        typeof msg.tsb === 'undefined') {
        return;
    }

    ui.incrementMessages();

    if (msg.tsb.block === true) {
        // Message was blocked
        ui.incrementBlocked();
        return;
    }

    return msg;
};

/**
 * Initializes the chat hook to intercept the joining of chat rooms
 *
 * @return {void}
 */
function initializeChatHook() {

    var chat = require("web-client/views/chat")["default"],
        original_didInsertElement = chat.prototype.didInsertElement;

    chat.prototype.didInsertElement = function () {

        original_didInsertElement.apply(this, arguments);

        // Initialize chat room message hook
        initializeMessageHook(msgFilter);

        // Initialize custom UI injection
        ui.initialize();
    };
};

/**
 * Initializes the chat room messages hook to intercept chat messages
 *
 * @param  {object} callback  The callback to run on a newly received message
 * @return {void} 
 */
function initializeMessageHook(callback) {
    
    var room = require("web-client/models/room")["default"],
        original_addMessage = room.prototype.addMessage,
        original_send = room.prototype.send;

    room.prototype.addMessage = function(msg) {
        msg = typeof callback === 'function' && callback(msg);
        return original_addMessage.apply(this, arguments);
    };

    room.prototype.send = function(msg){
        return original_send.apply(this, arguments);
    };
};

(function tcf() {
    
    'use strict';
    
    var TSB_VERSION = '0.0';
    
    if ($('.chat-lines').length) {
        
        // Chat has already been initialized, so
        // we only need to initialize the message
        // hook to capture chat room messages.
        initializeMessageHook(msgFilter);
        
        // Initialize custom UI injection
        ui.initialize();
        
    } else {
        
        // Chat room has not yet been launched, so
        // we set an initializer that waits for
        // the chat room to launch (user views a stream)
        // and automatically launch the message hook.
        initializeChatHook();
    }    
    
    console.log('Twitch SpamBlock extension version ' + TSB_VERSION + ' loaded');
    
}());