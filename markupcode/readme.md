### MarkupCode Directory

This directory is used for local testing of the markdowncode source files.

index.html redirects to markupcode.html. Markupcode.html is the same as
the markupcode.html in the gh-pages branch except
the markupcode library source is loaded from the `src` directory instead
of getting markupcode.min.js from the CDN.

markupcode.css is the same except the header background color is pink instead
of blue.

#### To test:

Start your favorite web server on local machine with the root directory 
pointing to the project directory and go to http://localhost/markupcode
in a browser.

To simulate GitHub:

#### Add a line to your local `hosts` file

```
127.0.0.1 potofcoffee2go.github.io # Simulate GitHub
```

Fire up a server as described above, and go to
http://potofcoffee2go.github.io/markupcode in a browser.

*If you find that the browser keeps changing the protocol from 'http' to 'https'
then will need to bring up the browser developer tools and disable caching.
Where that option is varies from browser to browser.*

> Note: even though you will be running the markupcode from the `src` directory,
the source files being displayed will be from GitHub!


