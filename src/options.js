/// ### Set parser options based on the file extension
/// Javascript, HTML, Style Sheets, JSON
///
/// Takes a `type` and optional option object
///   - the option object can change the `raw`, `hideCode`, and/or `hideComment` flags
///   > values based on the `type` can not be overridden
///
///
/// Options to the parser
///   - raw: markup the file as a single code block
///   - hideCode: Only show the comment blocks
///   - hideComment: Only show the code blocks
///   - type: 'js', 'html', 'css', 'json'
///     - ext: tag to use on the start of code blocks
///     - lineCmntTag: token that is used for single line comment
///     - codeblockCmntBeg: token that is used for block comments in code
///     - blockCmntBeg: token that is used for start of comment block
///     - blockCmntEnd: token that is used for end of comment block
///
/// {{{img.paperclip}}}
(function (ns) {
    "use strict";

    var options = function (type, opt) {
        opt = opt || {};
        opt.raw = opt.raw || false;
        opt.lineNumbers = opt.lineNumbers || true;
        opt.hideCode = opt.hideCode || false;
        opt.hideComment = opt.hideComment || false;

        switch (type) {
            case 'js' :
                opt.ext = 'js';
                opt.lineCmntTag = '///';
                opt.codeblockCmntBeg = '/*';
                opt.blockCmntBeg = '/**';
                opt.blockCmntEnd = '*/';
                break;
            case 'html' :
                opt.ext = 'html';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = '<!--';
                opt.blockCmntBeg = '<!---';
                opt.blockCmntEnd = '-->';
                break;
            case 'css' :
                opt.ext = 'css';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = '/*';
                opt.blockCmntBeg = '/**';
                opt.blockCmntEnd = '*/';
                break;
            case 'json' :
                opt.ext = 'json';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = null;
                opt.blockCmntBeg = null;
                opt.blockCmntEnd = null;
                break;
            default:
                break;
        }
        return opt;
    };

    // Add to namespace
    ns.options = options;
})(poc2go.markup);
