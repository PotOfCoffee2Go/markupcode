/// ## PotOfCoffee2Go Markup Namespace (poc2go.markup)
/// Sets up the markup code namespace
///
/// > If building `./dist/markupcode.min.js`, this file must be before other markupcode js files.
/// Is already that way in [Gruntfile.js](../Gruntfile.js).
(function () {
    "use strict";

    if (typeof this.poc2go === 'undefined') this.poc2go = {};

    //  Create an 'a' element so we can get the URL elements of this site
    var site = document.createElement('a');
    // This site location without file name
    //site.href = window.location.href.match(/(.*\/).*/)[1];
    site.href = window.location.href;

    /**
     ### Initialize the PotOfCoffee2go MarkupCode namespace
     - name: Name of site
     - site host and path name
     - github info (when server is GitHub gh-pages)
     {{{img.paperclip}}}
     */

    var ns = poc2go.markup = {name: 'markupcode'};

    ns.site = {
        origin: window.location.origin,
        host: site.hostname,
        pathname: site.pathname,
        source: {
            master: site.origin,
            pages: site.href
                .replace(site.search,'')
                .replace(site.hash,'')
                .match(/(.*\/).*/)[1]
        }
    };

    // Assume site not from GitHub gh-pages
    ns.github = null;

    /// BUT, if site is a GitHub gh-pages site then will be getting sources from
    ///  the project's master and gh-pages branches
    var gitHubIdx = site.hostname.indexOf('github.io');
    if (gitHubIdx > -1) {
        // Add GitHub info to namespace
        var gitHub = {source:{}};
        gitHub.username = site.hostname.substring(0, gitHubIdx - 1);
        gitHub.repository = site.pathname.replace(/\//g, '');
        gitHub.source.master = '//raw.githubusercontent.com/' +
            gitHub.username + '/' +
            gitHub.repository + '/master';
        gitHub.source.pages = '//raw.githubusercontent.com/' +
            gitHub.username + '/' +
            gitHub.repository + '/gh-pages/';

        ns.github = gitHub;
    }


    /// ### Check for [highlightjs](//highlightjs.org/) namespace,
    ///   which (if code highlighting desired) is normally loaded by
    ///   index.html <head> section along with the preferred code highlighter
    /// If found tell marked to highlight the code blocks with it
    if (hljs) {
        marked.setOptions({
            highlight: function (code, lang) {
                return hljs.highlightAuto(code).value;
            }
        });
    }

    /// ### Get source code location (URL) for either localhost or GitHub branch
    // aHyperlink is used to get the parts of a URL
    var aHyperlink = document.createElement('a');
    // Determine location of source code
    ns.getCodeUrl = function getCodeUrl(relativeFilepath) {
        var src = '';
        aHyperlink.href = ns.site.origin + ns.site.pathname + relativeFilepath;
        var filepath = aHyperlink.href;

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
        return src + filepath;
    }


}).call(this);
