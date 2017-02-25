# Joomla! API Documentation

This repository hosts the source files used to build the [Joomla! API Documentation](https://api.joomla.org) website.

## Static Files

The following static files are used for the general website

- `index.html` is the site's homepage
- `results.html` is the search results page; this uses Google's Custom Search platform
- `.htaccess` and `robots.txt` should be self explanatory

## phpDocumentor Template

Most of the other files in this repository are used by [phpDocumentor](https://www.phpdoc.org/) for generating the API documentation.  A general structure can be found in the `template.xml` file.

Most of the static media assets in this repository (CSS, JavaScript, and images) are used within the generated documentation; some of the images are template assets or used by the homepage.

## Website Structure

The live website currently has the following top level directories.  The generated documentation is not checked into version control.

- `cms-2.5` contains the API documentation for the Joomla! 2.5 branch
- `cms-3` contains the API documentation for the Joomla! 3.x branch
- `framework-1` contains the API documentation for the Joomla! Framework 1.x branch
- `framework-2` contains the API documentation for the Joomla! Framework 2.x branch

The following directories are no longer indexed by search engines but are still present on the server.

- `1.5` contains the API documentation for the Joomla! 1.5 branch
- `11.4` contains the API documentation for the Joomla! Platform 11.4 release
- `12.1` contains the API documentation for the Joomla! Platform 12.1 release
