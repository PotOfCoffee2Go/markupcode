/**
 {{{img.poc2go}}} Created by PotOfCoffee2Go on 7/6/2016.
 */
/// {{{image img.beakers '26px 15px 15px 0' '80px'}}}
/**
 ## Format code files to markdown
 Text from a `.js`, `.html`, `.css`, `.json` files is parsed and formatted for presentation
 as a web page. Markdown and most HTML tags are allowed in the comments, Markdown
 should take care of most your needs.

 > Excuse the over documentation of this code. It should be re-written using regex expressions
 so commented heavily to assist in that rewrite - time permitting.
 */

(function (ns) {
    "use strict";

    var markdown = function (input, domelement, type, opt, callback) {
        if (!(input && domelement && type)) return;

        // opt = ns.options(type, opt);

        var compiled = Handlebars.compile(input.join('\n'));
        var handled = compiled(ns);
        var markedup = marked(handled);

        var out = {
            lines: [],
            lineNbrs: [],
            codeBlockStartingNbrs: [],
            options: opt
        };

        insertDoc(markedup, domelement, {hideCode: false}, out);
        if (callback) callback(null, out);
    };

    /// ### Helper functions

    /// Is the previous line a comment?
    function isPrevComment(flags, i) {
        return flags[i ? i - 1 : 0] !== ' ';
    }

    /// Is line a Single line comment?
    function isSingleComment(opt, input, i) {
        return opt.lineCmntTag && input[i].trim().indexOf(opt.lineCmntTag) === 0;
    }

    /// Is start of a Block comment?
    function isBlockComment(opt, input, i) {
        return opt.blockCmntBeg && input[i].trim().indexOf(opt.blockCmntBeg) === 0;
    }

    /// Is end of a Block comment?
    function isEndBlockComment(opt, input, i) {
        return opt.blockCmntEnd && input[i].indexOf(opt.blockCmntEnd) > -1;
    }

    /// Is a Code Block comment?
    function isCodeBlockComment(opt, input, i) {
        return opt.codeblockCmntBeg && input[i].indexOf(opt.codeblockCmntBeg) > -1;
    }

    /// Is JSDoc comment block?
    function isPrevJSDocBlockComment(flags, i) {
        return flags[i ? i - 1 : 0] === 'j';
    }

    /// Is JSDoc style comment?
    function isJSDocComment(input, i) {
        return input[i].substring(0, 3) === ' * ';
    }

    /// ### Insert marked up text into div
    function insertDoc(markedup, domelement, opt, out) {
        var el = document.getElementById(domelement.replace('#',''));

        el.innerHTML = markedup;

        var elements = document.querySelectorAll('pre code');
        Array.prototype.forEach.call(elements, function(block, i) {
            if (block.classList) {
                block.classList.add('hljs');
            }
            else {
                block.className += ' hljs';
            }
        });

        if (!opt.hideCode && opt.lineNumbers) {
            Array.prototype.forEach.call(elements, function(block, i){
                ns.linenumber(i, block, out);
            });
        }
    }

    /// ### Determine what lines are comments and which are code
    var markup = function (input, domelement, type, opt, callback) {

        if (!(input && domelement && type)) return;

        if (type === 'md') {
            markdown(input, domelement, type, opt, callback);
            return;
        }

        var expect = ' ';
        var blockWhitespace = 0;

        var flags = [];
        var lineNbr = [];

        opt = ns.options(type, opt);

        /// - Initialize flags indicating line is a comment or code
        ///   - Assume will be code
        ///   - Remove possible `CR` character at the end of input
        for (var i = 0, l = input.length; i < l; i++) {
            flags.push(' ');
            input[i] = input[i].replace('\r', '');
            lineNbr.push(i);
        }

        if (!opt.raw) {
            /// - Determine if first line is comment or code
            ///   - Assume first line is code
            ///   - If a Single or start of a Block comment
            ///     - Set first line to a comment
            if (isSingleComment(opt, input, 0) || isBlockComment(opt, input, 0)) {
                expect = 'c';
            }

            /// #### Flag each input line as a comment or code
            for (i = 0, l = flags.length; i < l; i++) {
                /// - Blank line?
                ///   - Flag same as prior line
                ///   - **to next line**
                if (input[i].trim() === '') {
                    flags[i] = flags[i ? i - 1 : 0];
                    continue;
                }
                /// - Single line comment?
                ///   - Flag as comment and expect next line to be code
                ///   - **to next line**
                if (isSingleComment(opt, input, i)) {
                    input[i] = input[i].trim().replace(/\/\/\/ ?/, '');
                    flags[i] = 'c'; // comment
                    expect = ' '; // code
                    continue;
                }
                /// - Handle JSDoc type comments
                ///   - In a comment block?
                ///     - this line is formatted JSDoc style comment?
                ///       - first line in JSDoc comment block?
                ///         - then set title of the comment to bold
                ///       - set the flags and **to next line**
                ///    - otherwise check for blank JSDoc comment?
                ///       - set the flags and **to next line**
                if (isPrevComment(flags, i)) {
                    if (isJSDocComment(input, i)) {
                        flags[i] = 'c'; // line is a comment
                        expect = 'c';   // expect next line will be a comment too
                        continue;
                    }
                    if (input[i] === ' *') {
                        input[i] = '';
                        flags[i] = 'c'; // comment
                        expect = 'c';
                        continue;
                    }
                }

                /// - Start of a code block comment ex: /* for javascript
                ///   - Is a *code* block comment `/*` but *not* a block comment `/**`?
                ///     - set as code line and expect next line to be code too
                ///     - **to next line**
                if (isCodeBlockComment(opt, input, i) && !isBlockComment(opt, input, i)) {
                    flags[i] = ' ';
                    expect = ' ';
                    continue;
                }
                /// - Start of block comment?
                ///   - Keep track of leading whitespace to shift text to the left
                ///     > need to do this because Markdown parser would make the text a code block
                ///   - Remove the comment chars. ex: `/**` for javascript
                ///   - Flag the line as a comment
                ///   - Is there an end of block comment too? (line like: `/** blah blah */`)
                ///     - remove the end comment chars.
                ///     - expect the next line to be a code line
                ///   - otherwise doesn't have an end block so
                ///     - could be the beginning of a JSDoc comment
                ///     - and a comment is expected on the next line
                ///   - **to next line**
                if (isBlockComment(opt, input, i)) {
                    blockWhitespace = input[i].search(/\S|$/);
                    input[i] = input[i].trim().replace(opt.blockCmntBeg, '');
                    flags[i] = 'c';
                    if (isEndBlockComment(opt, input, i)) {
                        input[i] = input[i]
                            .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                            .replace(opt.blockCmntEnd, '');
                        expect = ' ';
                    }
                    else {
                        flags[i] = 'j';
                        expect = 'c';
                    }
                    continue;
                }
                /// - End of comment and we are in a comment block
                ///   - Remove the end of comment chars.
                ///   - Stop removing leading spaces
                ///   - Set this line as a comment and expect next to be code
                ///   - **to next line**
                if (isEndBlockComment(opt, input, i) && isPrevComment(flags, i)) {
                    input[i] = input[i]
                        .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                        .replace(opt.blockCmntEnd, '');
                    blockWhitespace = 0;
                    flags[i] = 'c'; // comment
                    expect = ' ';
                    continue;
                }

                /// - Got here if none of the special conditions above were met
                ///   - Set flag to what this line was expected to be based on the previous line
                ///   - Remove leading chars so Markdown parser doesn't make them a code block
                ///     - in the event that leading whitespace has not be set
                ///       > happens when a comment block's first line is indented
                ///       - set the whitespace
                ///   - **to next line**
                flags[i] = expect;
                if (flags[i] !== ' ' && isPrevComment(flags, i) && input[i].search(/\S|$/) >= blockWhitespace) {
                    if (!blockWhitespace) {
                        blockWhitespace = input[i].search(/\S|$/);
                    }
                    input[i] = input[i].substring(blockWhitespace);
                }
            }

            /// ----
            /// Hide Comments
            /// {{{ image img.beaker '0 0 0 0' '180px' }}}
            i = flags.length;
            if (opt.hideComment) {
                while (i--) {
                    if (flags[i] !== ' ') {
                        flags.splice(i, 1);
                        lineNbr.splice(i, 1);
                        input.splice(i, 1);
                    }
                }
            }

            /// Hide Code
            if (opt.hideCode) {
                while (i--) {
                    if (flags[i] === ' ' && input[i].length) {
                        flags.splice(i, 1);
                        lineNbr.splice(i, 1);
                        input.splice(i, 1);
                    }
                }
            }
        }

        /// #### Output the comment and code lines based on the flags
        /// All of the lines have been flagged as code or comments

        /// Output each line inserting markdown code blocks as we go
        var out = {
            lines: [],
            lineNbrs: lineNbr,
            codeBlockStartingNbrs: [],
            options: opt
        };

        for (i = 0, l = flags.length; i < l; i++) {
            /// - Set JSDoc comment to a regular block comment
            ///   > to make the following code easier - at this point a comment is a comment
            if (flags[i] === 'j') {
                flags[i] = 'c';
            }

            /// Double quote Handlebars helper params that are in comment blocks
            //  unless already double quoted
            //  if (flags[i] === 'c' && /\{\{\{? *image/i.test(input[i]) && !/''/.test(input[i])) {
            //    input[i] = input[i].replace(/'/g,"''");
            //}

            /// - Output the first line
            ///  - Start a code block when appropriate
            if (i === 0) {
                if (flags[i] === ' ') {
                    out.lines.push('```' + opt.ext);
                    out.codeBlockStartingNbrs.push(i);
                }
                out.lines.push(input[i]);
                continue;
            }

            /// - When previous flag and current are the same
            ///   - Remain in the comment or code block
            if (flags[i] === flags[i - 1]) {
                out.lines.push(input[i]);
                continue;
            }
            /// - Switching from comment to code block
            ///   - insure blank line before code block
            ///   - start the code block
            if (flags[i] === ' ') {
                out.lines.push('');
                out.lines.push('```' + opt.ext);
                out.lines.push(input[i]);
                out.codeBlockStartingNbrs.push(i);
                continue;
            }
            /// - Switching from code to comment block
            ///   - end the code block
            if (flags[i] === 'c') {
                out.lines.push('```');
                out.lines.push(input[i]);
                continue;
            }

            /// - *Should never get here!*
            throw new Error('Markdown parsing of comments error')
        }

        /// - If in a code block, end it at file end
        if (flags[flags.length - 1] === ' ') {
            out.lines.push('```');
        }

        var handled = out.lines.join('\n');
        if (!opt.raw) {
            var compiled = Handlebars.compile(out.lines.join('\n'));
            handled = compiled(poc2go);
        }
        var markedup = marked(handled);

        insertDoc(markedup, domelement, opt, out);

        /// Return with the Markdown markup complete
        if (callback) callback(null, out);
    };

    // Add to namespace
    ns.markup = markup;
})(poc2go.markup);
