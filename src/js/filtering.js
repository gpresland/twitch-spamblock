var filtering = {

    DONGER_COMMONS: [
        172,
        186,
        662,
        664,
        860,
        865,
        3232,
        3234,
        3900,
        3901,
        5463,
        5465,
        5586,
        5589,
        7508,
        8226,
        8226,
        8636,
        8640,
        8736,
        8745,
        8779,
        8860,
        9472,
        9495,
        9499,
        9548,
        9552,
        9568,
        9581,
        9582,
        9583,
        9586,
        9632,
        9632,
        9633,
        9648,
        9673,
        9685,
        9730,
        9737,
        9788,
        9829,
        10023,
        10047,
        10061,
        11386,
        11807,
        12539,
        12541,
        12559,
        20033,
        20984,
        30410,
        42826,
        65439,
        65507
    ],

    SAFE_WORDS: [
        'loss',
        'lost',
        'no',
        'win',
        'won',
        'yes'
    ],

    FILTER_ORDER: [
        'command',
        'long',
        'short',
        'allcaps',
        'drawing',
        'donger',
        'cyrillic',
        'custom',
        'copypaste',
        'emotes',
        'lowercase',
        'cleanup'
    ],

    // Filters class
    filters: {
        allcaps: function filterAllCaps(msg) {
            var lower, lowerCount, upper, upperCount;
            lower = msg.tsb.text.match(/[a-z]/g);
            upper = msg.tsb.text.match(/[A-Z]/g);
            lowerCount = (lower !== null) ? lower.length : 0;
            upperCount = (upper !== null) ? upper.length : 0;
            if (upperCount > lowerCount) {
                msg.tsb.block = true;
            }
        },
        cleanup: function filterCleanup(msg) {
            msg.message = msg.message.trim().replace(/\s{2,}/g, ' ');
        },
        command: function filterCommands(msg) {
            if (msg.tsb.isCommand === true) {
                msg.tsb.block = true;
            }
        },
        copypaste: function filterCopyPaste(msg) {
            if (filtering.history.isRepeat(msg.tsb.text)) {
                msg.tsb.block = true;
            } else {
                filtering.history.add(msg.tsb.text);
            }
        },
        custom: function filterCustom(msg) {
            var i;
            for (i = 0; i < tsb.settings.blockstring.length; i++) {
                if (msg.tsb.text.toLowerCase().indexOf(tsb.settings.blockstring[i]) !== -1) {
                    msg.tsb.block = true;
                    break;
                }
            }
        },
        cyrillic: function filterCyrillic(msg) {
            if (/[\u0400-\u052F]/.test(msg.tsb.text)) {
                msg.tsb.block = true;   
            }
        },
        debug: function filterDebug(msg, optionName) {
            console.log('TSB {' + optionName + '} blocked: ' + msg.message);
        },
        donger: function filterDonger(msg) {
            var c, i;
            for (i = 0; i < msg.tsb.text.length; i++) {
                c = msg.tsb.text.charCodeAt(i);
                if (filtering.DONGER_COMMONS.indexOf(c) !== -1) {
                    msg.tsb.block = true;
                    break;
                }
            }
        },
        drawing: function filterDrawing(msg) {
            var c, i;
            for (i = 0; i < msg.tsb.text.length; i++) {
                c = msg.tsb.text.charCodeAt(i);
                if (c >= 9600 && c <= 9649) {
                    msg.tsb.block = true;
                    break;
                }
            }
        },
        emotes: function filterEmotes(msg) {
            msg.message = msg.tsb.text;
            if (msg.hasOwnProperty('tags') &&
                typeof msg.tags !== 'undefined' &&
                msg.tags.hasOwnProperty('emotes')) {
                msg.tags.emotes = {};
            }
        },
        long: function filterLong(msg) {
            if (msg.tsb.text.length >= 192) {
                msg.tsb.block = true;
            }
        },
        lowercase: function filterLowercase(msg) {
            msg.message = msg.message.toLowerCase();
        },
        short: function filterShort(msg) {
            var c, chars = [], i, text;
            // If less than 5 characters in the messages
            if (msg.tsb.text.replace(/s+/g, '').length < 5) {
                text = msg.tsb.text.toLowerCase().replace(/\W/g, '');
                // Check if short message is a safe word to use
                if (filtering.SAFE_WORDS.indexOf(text) === -1) {
                    msg.tsb.block = true;
                    return;
                }
            }
            // Check for multiple characters and not repeat (e.g. wwwwwwwww, kkkkk)
            for (i = 0; i < msg.tsb.text.length; i++) {
                c = msg.tsb.text.charCodeAt(i);
                if (chars.indexOf(c) === -1) {
                    chars.push(c);
                }
            }
            if (chars.length < 5) {
                msg.tsb.block = true;
                return;
            }
        }
    },

    //
    // History
    //
    // Used to track the history of received messages as to detect copy/pastes

    history: {
        
        log: [],
        
        add: function historyAdd(text) {
            this.log.unshift(text);
            if (this.log.length >= 100) {
                this.log.pop();
            }
        },
        
        isRepeat: function historyIsRepeat(text) {
            return (this.log.indexOf(text) !== -1) ? true : false;
        }
    },

    //
    // Filter Helpers
    //

    getEmotelessText: function getEmotelessText(msg) {
        if (msg.hasOwnProperty('tags') &&
            typeof msg.tags !== 'undefined' &&
            msg.tags.hasOwnProperty('emotes') &&
            typeof msg.tags.emotes !== 'undefined' &&
            Object.keys(msg.tags.emotes).length > 0) {
            var emote, emotes, end, i, key, length, newMessage, start;
            emotes = [];
            newMessage = msg.message;
            for (key in msg.tags.emotes) {
                emote = msg.tags.emotes[key];
                start = emote[0][0];
                end = emote[0][1];
                length = end - start + 1;
                emotes.push(msg.message.substr(start, length));
            }
            for (i = 0; i < emotes.length; i++) {
                // Escape RegExp reserved chars
                emotes[i] = emotes[i]
                    .replace('\\', '\\\\')
                    .replace('(', '\\(')
                    .replace(')', '\\)');
                newMessage = newMessage.replace(new RegExp(emotes[i], 'g'), '');
            }
            return newMessage;
        }
        return msg.message;
    },

    getEmoteCount: function getEmoteCount(msg) {
        if (msg.hasOwnProperty('tags') &&
            typeof msg.tags !== 'undefined' &&
            msg.tags.hasOwnProperty('emotes') &&
            typeof msg.tags.emotes !== 'undefined') {
            var c, key, l;
            c = 0;
            l = Object.keys(msg.tags.emotes).length;
            for (key in msg.tags.emotes) {
                c += msg.tags.emotes[key].length;
            }
            return c;
        } else {
            return 0;
        }
    },

    getIsCommand: function getIsCommand(msg) {
        if (msg.tsb.text.length > 2) {
           return /^![0-9A-Za-z]/.test(msg.tsb.text.trim());
        } else {
            return false;
        }
    },

    getWordCount: function getWordCount(msg) {
        var matches = msg.tsb.text.match(/\S+/g);
        return (matches) ? matches.length : 0;
    },

    /**
     * Initialize a message for Twitch SpamBlock processing
     *
     * @param  {object} msg  The message object
     * @return {void}
     */
    initMessage: function initMessage(msg) {

        // Append Twitch SpamBlock properties to message
        msg.tsb = {
            block: false,
            blockReason: null,
            emoteCount: 0,
            isCommand: null,
            text: '',
            wordCount: 0
        };

        // Text
        msg.tsb.text = this.getEmotelessText(msg);

        // Emote Count
        msg.tsb.emoteCount = this.getEmoteCount(msg);

        // Command
        msg.tsb.isCommand = this.getIsCommand(msg);

        // Word Count
        msg.tsb.wordCount = this.getWordCount(msg);
    },

    /**
     * Apply filters to a chat room message
     *
     * @return {void}
     */
    apply: function filteringApply(msg) {

        // Safety
        if (typeof msg === 'undefined') {
            return;
        }

        var debug, i, filterName, option;

        // Get debugging option
        debug = tsb.settings.options.debug;

        // Initialize Twitch SpamBlock on the message
        this.initMessage(msg);

        // Run message through every option
        for (i = 0; i < this.FILTER_ORDER.length; i++) {

            filterName = this.FILTER_ORDER[i];
            option     = tsb.settings.options[filterName];

            // Test message against filter
            if (option.value === true) {
                this.filters[option.name](msg);
            }

            // Do debugging options if enabled
            if (msg.tsb.block && debug.value === true) {
                this.filters.debug(msg, option.name);
                break;
            }
        }

        // Return back the filtered message
        return msg;
    }
};