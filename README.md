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

## Deployment
Deployment is done with Drone CI and consists of 2 pipelines.
- The first pipeline is triggered when a PR or commit is pushed to the master branch. This deploys the static files of the site, which means mainly the homepage.
- The second pipeline is triggered when a custom build is triggered from ci.joomla.org. This needs additional parameters and wont work without it!

### CMS API documentation deployment
To generate the CMS API documentation, go to https://ci.joomla.org/joomla/api.joomla.org and click on "New Build" in the top right corner. In the popup, set "Branch" to "master" and type in "JTYPE" for "key" under "Parameters" and "cms" as value for that key. **You have to click "add" to actually add this!** Besides saving the parameter, this also adds another parameter and we have to type in "JVERSION" as key and the tag-name of the release as value. Remember to click "Add" again!

This checks out the tag from joomla/joomla-cms and then builds the documentation with phpDocumentor including the class hierarchy diagram. This is then automatically uploaded to the api.joomla.org server.

### Framework API documentation deployment
To generate the CMS API documentation, go to https://ci.joomla.org/joomla/api.joomla.org and click on "New Build" in the top right corner. In the popup, set "Branch" to "master" and type in "JTYPE" for "key" under "Parameters" and "framework" as value for that key. **You have to click "add" to actually add this!** Besides saving the parameter, this also adds another parameter and we have to type in "JVERSION" as key and the major version of the framework you want to build. Remember to click "Add" again!

This checks out all framework packages from the packages.yml file with the Robo.li script (vendor/bin/robo checkout:repos --fw=2) into one common folder, then runs phpDocumentor on this, including the class hierarchy diagram, and then uploads that to the corresponding folder on api.joomla.org. **Right now this only supports the version 2 of the framework.**
