### MarkupCode
This project is a library that parses in-line free-form documentation of code files.
The client side (browser) dynamically does all the work to translate the files
for presentation. Markdown is the markup language used to style the in-line
documentation as well as markdown files (.md) for higher level documentation 
(like readme.md file for example).

**Some of the design goals:**
 - Both code and code level documentation in the same file
   - Change the code, update the documentation (which is right there!)
   - Save it and done!
 - All markup parsed/compiled dynamically by the client browser
   - Will work when served even from the simplest `static` web server
 - Allow user to display/download raw, code only, and marked up files.
 - Toys! - themes, code highlighters, line numbering, in-line pictures and video

 
