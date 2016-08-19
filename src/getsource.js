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

    var source = function (url, domelement, options, callback) {

        aHyperlink.href = url;
        var href = aHyperlink.href;
        var hash = aHyperlink.hash;
        var queryParams = getQueryParameters(aHyperlink);

        // Get the actual URL to the source code
        aHyperlink.href = ns.site.origin + ns.site.pathname + queryParams.file;
        var codeUrl = getCodeUrl(aHyperlink.href);

        var extension = codeUrl.match(extPattern);
        if (typeList.indexOf(extension[1]) === -1) {
            throw new Error('markupcode: unsupported file type - extension ' + extension[1]);
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    ns.markup(xmlhttp.responseText.split('\n'), domelement, extension[1], options, function (err, out) {
                        if (window.location.href !== href) {
                            window.history.pushState({}, '', href);
                        }
                        window.location.hash = '';  // reset hash
                        window.location.hash = hash;
                        if (callback) callback(err, out);
                    })
                }
                else {
                    throw new Error('markupcode: get source file returned status ' + xmlhttp.status);
                }
            }
        };
        xmlhttp.open('GET', codeUrl, true);
        xmlhttp.send();
    };

    /// ### Get source from localhost or GitHub if server not localhost
    // Determine location of source code
    function getCodeUrl(filepath, getRelative) {
        var src = '';

        // Links to the source code
        //  when server is github source is on master and/or gh-pages branches
        //  otherwise source is in the site directories
        var source = ns.github ? ns.github.source : ns.site.source;

        // Get actual origin and pathname to the source code
        // and remove origin and pathname assigned by the browser
        if (filepath.indexOf(ns.site.origin) === 0) {
            src = source.master;
            filepath = filepath.replace(ns.site.origin, '');
        }
        if (filepath.indexOf(ns.site.pathname) === 0) {
            src = source.pages;
            filepath = filepath.replace(ns.site.pathname, '');
        }

        // Return url with actual origin and pathname to the source code file
        if (getRelative){
            return filepath;
        }
        return src + filepath;
    }

    //
    function getQueryParameters(hyperlink) {
        return (hyperlink.search).replace(/(^\?)/, '')
            .split("&")
            .map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }.bind({}))[0];
    }

    // Add to namespace
    ns.source = source;
})(poc2go.markup);
