/// ## PotOfCoffee2Go Markup Namespace (poc2go.markup)
/// Sets up the markup code namespace
///
/// > If building `./dist/markupcode.min.js`, this file must be before other markupcode js files.
/// Is already that way in [Gruntfile.js](../Gruntfile.js).
(function () {
    "use strict";

    this.poc2go = {};

    //  Create an 'a' element so we can get the URL elements of this site
    var site = document.createElement('a');
    // This site location without file name
    site.href = window.location.href.match(/(.*\/).*/)[1];

    /**
     ### Initialize the PotOfCoffee2go MarkupCode namespace
     - name: Name of site
     - site host and path name
     - github info (when server is GitHub gh-pages)
     {{{img.paperclip}}}
     */

    poc2go.markup = {name: 'markupcode'};

    poc2go.markup.site = {
        origin: site.origin,
        host: site.hostname,
        pathname: site.pathname,
        source: {
            master: site.origin,
            pages: site.href
        }
    };

    // Assume site not from GitHub gh-pages
    poc2go.markup.github = null;

    /// BUT, if site is a GitHub gh-pages site then will be getting sources from
    ///  the project's master and gh-pages branches
    var gitHubIdx = site.hostname.indexOf('github.io');
    if (gitHubIdx > -1) {
        // Add GitHub info to namespace
        var gitHub = {};
        gitHub.username = site.hostname.substring(0, gitHubIdx - 1);
        gitHub.repository = site.pathname.replace(/\//g, '');
        gitHub.source.master = '//raw.githubusercontent.com/' +
            gitHub.username + '/' +
            gitHub.repository + '/master';
        gitHub.source.pages = '//raw.githubusercontent.com/' +
            gitHub.username + '/' +
            gitHub.repository + '/gh-pages';

        poc2go.markup.github = gitHub;
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

}).call(this);
