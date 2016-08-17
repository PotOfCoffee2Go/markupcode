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
    var typeList = ['js', 'html', 'css', 'json', 'md'];
    var extPattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;

    var source = function (codeUrl, domelement, options, callback) {

        codeUrl = getCodeUrl(codeUrl);

        var extension = codeUrl.match(extPattern);
        if (typeList.indexOf(extension[1]) === -1) {
            throw new Error('markupcode: unsupported file type - extension ' + extension[1]);
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    ns.markup(xmlhttp.responseText.split('\n'), domelement, extension[1], options, function (err, out) {
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
    function getCodeUrl(filepath) {
        var src = '';
        // If URL is relative make it absolute so can parse it
        filepath = getAbsoluteUrl(filepath);

        // Links to the source code
        //  when server is github source is on master and/or gh-pages branches
        //  otherwise source is in the site directories
        var source = ns.github ? ns.github.source : ns.site.source;

        // Assign origin and path to the source code
        // and change the filepath to be relative
        var origin = window.location.origin;
        var pathname = window.location.pathname;
        if (filepath.indexOf(origin) === 0) {
            filepath = filepath.replace(origin, '');
                src = source.master;
        }
        if (filepath.indexOf(pathname) === 0) {
            filepath = filepath.replace(pathname, '');
                src = source.pages + '/';
        }

        // Return url to the source code file
        return src + filepath;
    }

    // Get the absolute URL given a relative URL
    //  Create an 'a' element
    //  Function that assigns the href to the element and returns it
    var aHyperlink = document.createElement('a');
    function getAbsoluteUrl(url) {
        aHyperlink.href = url;
        return aHyperlink.href;
    }

    // Add to namespace
    ns.source = source;
})(poc2go.markup);
