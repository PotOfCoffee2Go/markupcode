/**
 Mark up code document at the given `codeUrl` into the div `domelement`
 using the optional option overrides and optional callback.

 Callback signature is (err, out) - where `out` is the structure defined
 in [markupcode.js](../src/markupcode.js).

 The getCodeUrl function allows testing on localhost (ie: leaves the
 url untouched). If the server is not localhost will change url to
 go to GitHub for the raw source to mark up.
 */
(function (ns) {
    "use strict";

    /// ### Markup source code using [Markdown](//daringfireball.net/projects/markdown/)
    /// {{{img.paperclip}}}

    // aHyperlink is used to get the parts of a URL
    var aHyperlink = document.createElement('a');
    // List of code file extensions which can be parsed for markdown comments
    var typeList = ['js', 'html', 'css', 'json', 'md'];
    // Regex that gets the extension from a filename
    var extPattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;


    function source(qstring, domelement, options, callback) {

        aHyperlink.href = qstring;
        var href = aHyperlink.href;
        var hash = aHyperlink.hash;

        // Get the actual URL to the source code
        var queryParams = getQueryParameters(aHyperlink);
        var codeUrl = ns.getCodeUrl(queryParams.markup);

        var extension = codeUrl.match(extPattern);
        if (typeList.indexOf(extension[1]) === -1) {
            throw new Error('markupcode: unsupported file type - extension ' + extension[1]);
        }

        // Get the source code text and mark it up
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    ns.markup(xmlhttp.responseText.split('\n'), domelement, extension[1], options, function (err, output) {
                        if (hash) {
                            document.getElementById(hash.replace('#', '')).scrollIntoView(true);
                        }
                        var input = {
                            href: href,
                            qstring: aHyperlink.search,
                            hash: hash,
                            domelement: domelement,
                            options: output.options,
                            scrollTop: document.getElementById(domelement.replace('#', '')).parentNode.scrollTop
                        };
                        if (callback) callback(err, input, output);
                    })
                }
                else {
                    throw new Error('markupcode: get source file returned status ' + xmlhttp.status);
                }
            }
        };
        xmlhttp.open('GET', codeUrl, true);
        xmlhttp.send();
    }

    // Returns the querystring from a element href
    function getQueryParameters(hyperlink) {
        return (hyperlink.search).replace(/(^\?)/, '')
            .split("&")
            .map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }.bind({}))[0];
    }

    // Handle browser history
    function history(state, callback) {
        source(state.qstring, state.domelement, state.options, function (err, input, output) {
            input.scrollTop = state.scrollTop;
            if (callback) callback(err, input, output);
        })
    }

    // Add to namespace
    ns.source = source;
})(poc2go.markup);
