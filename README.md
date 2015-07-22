# Abstract Finder

This is the implementation of an abstract finder which consumes the API that is served from Agro-Know over an elasticsearch repository. The same logic (with variations based on specific requirements) is followed from all our finders using AngularJS

----
# Main Purpose
of this finder-app is to have an open-source, lightweight, cross-platform solution for searching our data pools, and that is easy to embodied in every web site.
It's implemented using HTML, CSS and Javascript.

----
# Technologies
1. **AngularJS**

2. **Native AngularJS (Angular) directives for Twitter's Bootstrap.**
Small footprint (5kB gzipped!), NO 3rd party JS dependencies (jQuery, bootstrap JS) required!


3. **LESS CSS**

-----------
### Features
- Multiple formats can be added ( for now AKIF, AGRIF are implemented )
- Different type of facets per page, with different mapping
- Canned Queries
- Pagination : "Loading more" with "Scroll to top", or normal pagination.
- Responsiveness & mobile friendliness
- Routing

----
# Documentation.
AngularJS is an open-source JavaScript framework, maintained by Google, that assists with running single-page applications.
Its goal is to augment web-based applications with model-view-controller (MVC) capability, in an effort to make both development and testing easier.
 
**_ Note: See 'docs' folder for specific documentation of controllers and app_** 

## Single Page App Logic
Everything happens inside a single .html page. **index.html** is our main page.
`ng-app` directive defines which app will manage the specific block.
We have "akListing" module which is defined in /app/app.js file. Everything we have built is under this module.

The #akListing div is controlled by *mainController.js* ( ng-controller="mainController.js" ).
Inside #akListing we have a div with `ng-view` directive. This is used in combination with ngRoute(in app.js) in
order to render inside this div the specific html-template given by route.

## Routing
As explained before everything is rendered inside the div with ng-view directive.
All templates are in */templates* and the mapping is in `app.js` under `listing.config(['$routeProvider',function()])`.
So, for example we have in our page `<a href="#/educational/search/?q=food protection">`, which will call the `when('/educational/search/:search_param'` case and will
render `templates/akif_edu_search.html` inside the `ng-view` changing the url to `...doc_location/#/educational/search/?q=food%20protection`.

## App Structure
`/app/` folder contains app.js in which are defined the modules and the services we use.

`/app/controllers/` contains all the controllers we use.

..*`mainController.js` manages the app. Thus it contains for finder initialisation, search submission, reset search, sanitisation, truncate e.t.c and functions that are generally used.

..*`search/` contains the controllers for listing page ( facetsController.js, listingController.js, paginationController.js )

..*`view_item/` contains the viewItemController.js who manages the view item page.

## Configurations
In order to configure the finder we have two different options.

### **Configure finder from config/conf.json**
This file contains the configurations for the finder. It's read in mainController and set all the variables we need to have in our finder. In case there is an error in reading the configuration file the same variables are defined inside the .error promise. 
_Warning_: be careful in case there are defined specific configuration in mainController (see the next(2) option)

Available configurations in conf.json

- **baseUrl** : the base url of the API (it ends at /search-api/v1 )

- **enableFacets**: defines if we have the facets enabled or not

- **enablePaginationBottom**: true/false enables the bottom pagination

- **enablePaginationTop**: true/false enables the top pagination

- **enableLoadMore**:true/false enables the load more button. If it's enabled overwrites the pagination options and hides top-bottom pagination

- **facets**: array that defines which facets we want to have in finder. i.e.["set","language","contexts","learningResourceTypes","endUserRoles"]

- **limitPagination**: int that limits the pagination in case we have many results

- **limit_facets**: _Object_ of arrays that limits specific facets. For example if want to limit collections(set) just to 'aglrnedunhmc' we write { "set":["aglrnedunhmc"] }. If empty ({}) there is NO limitation.

- **limit_facets_number**: int that limits the number of results in every facet. _This shouldn't be empty_. If you need to have a lot or results just use a very big number.

- **mappings_file**: the file of the facets mappings between human and machine words. i.e. "../config/facets_mappings.json". 
_If the finder supports translations_ maybe we use different mapping file that is defined in mainController 

- **maxTextLength**: int that defines the length of the description in snippet.

- **pageSize**: int that defines the page size (used in both simple pagination and load more functionality)

- **selectedLanguage**: 2-letter code that defines the language that used in initialisation.

- **snippetElements**: array with the elements that we want to show in snippet. i.e. ["title","description","keywords"]
_If an element isn't defined in languageBlocks_ block in jsons we need to added manually inside the getSnippet function of listingController.


### **Overwrite finder's configuration in mainController controller** 
Note: this type of configuration is useful in case we need to have specific configuration for different types i.e. AKIF, AGRIF type or education, publication.

This configuration is defined inside mainController in function init_finder() which initialise the finder. Here we have to parameters. The first is for type and the second is for schema.
All the parameters that are defined above can be overwritten here giving the same functionality.

### UI configuration
The target here is to have the ability to configure very easy a simple finder. What we need is a _**logo**_ and a _**3-color-palette(hex)**_ in order to setup very easy a finder that is clean and matches a pre-defined interface.

**2 Steps we need**

- create logo.png image with the logo we need, with dimensions 960*160 and replace the existed logo.png in assets/images/ folder.

- go to /css/style.less and change the value of the variables
color_1, color_2, color_3.


----
# Usefull links
## Angular Directives
- https://docs.angularjs.org/guide/directive
- https://docs.angularjs.org/api/ng/directive
- http://stackoverflow.com/questions/13875466/what-is-an-angularjs-directive

## Angular Services, Providers, Factories
- http://stackoverflow.com/questions/15666048/angular-js-service-vs-provider-vs-factory

## Native AngularJS directives for Twitter's Bootstrap
- http://angular-ui.github.io/bootstrap/

## LESS CSS
- http://lesscss.org/features/
