var ui = {
    
    /**
     * Count of blocked messages by the filter
     * @type {int}
     */
    blockCount: 0,
    
    /**
     * Count of total messages parsed by filter
     * @type {int}
     */
    messageCount: 0,
    
    /**
     * Initialize the UI
     *
     * @return {void}
     */
    initialize: function uiInitialize() {
        this.blockCount = 0;
        this.messageCount = 0;
        $('.chat-buttons-container').append(
            '<a class="button glyph-only float-left" title="Viewer List">' +
                'Blocked <span id="tsb-block-count">0</span> of <span id="tsb-message-count">0</span>' +
            '</a>'
        ); 
    },
    
    /**
     * Increment blocked message count
     *
     * @return {void}
     */
    incrementBlocked: function uiIncrementBlocked() {
        $('#tsb-block-count').text(ui.blockCount++);
    },
    
    /**
     * Increment total messages count
     *
     * @reuturn {void}
     */
    incrementMessages: function uiIncrementMessage() {
        var $el = $('#tsb-message-count');
        if ($el.hasOwnProperty('0') === false) {
            // User changed URLs to a new stream, re-initialize UI
            ui.initialize();
        }
        $el.text(ui.messageCount++);
    }
};