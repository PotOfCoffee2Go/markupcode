/// ### Code block line numbering
///
/// Core functions of the GitHub project
/// [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js).

/// {{{img.paperclip}}}
// Given the code block, results of source code markup, and index of
//  the code block on the page;
// Create display of the code line numbers
(function (ns) {
    "use strict";

    function linenumber(idx, element, out) {
        if (typeof element !== 'object') return;
        var startNbr = out ? out.codeBlockStartingNbrs[idx] : 0;
        var parent = element.parentNode;
        var lines = getCountLines(parent.textContent);

        if ((out && lines) || (lines > 1)) {
            var l = '';
            for (var i = startNbr, count = lines + startNbr; i < count; i++) {
                l += ((out ? out.lineNbrs[i] : i) + 1) + '\n';
            }

            var linesPanel = document.createElement('code');
            linesPanel.className = 'hljs hljs-line-numbers';
            linesPanel.style.float = 'left';
            linesPanel.textContent = l;

            parent.insertBefore(linesPanel, element);
        }
    }

    // Count the number of lines in the code block
    function getCountLines(text) {
        if (text.length === 0) return 0;

        var regExp = /\r\n|\r|\n/g;
        var lines = text.match(regExp);
        lines = lines ? lines.length : 0;

        if (!text[text.length - 1].match(regExp)) {
            lines += 1;
        }

        return lines;
    }

    // Add to namespace
    ns.linenumber = linenumber;
})(poc2go.markup);
