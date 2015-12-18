# Angular---SPServicesREST-
Angular module that simplifies the use of Sharepoint 2013 REST Service Calls


#Usage

Include the SPServicesREST.js file above your app file in script tag

Include SPServiceREST as a dependancy in your app module

##Example:

```javascript
var myapp=angular.module("myApp",["SPServicesREST"])
```

Then reference the service in your controller

Currently 3 services are available
* SPRESTItemServices
* SPRESTListServices
* SPRESTUserServices

```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTItemServices',
                    'SPRESTListServices',
                    'SPRESTUserServices',
                    function($scope,$SPRESTItemServices,$SPRESTListServices,$SPRESTUserServices){}])
```


##Working Examples


##SPRESTItemServices --

Each Service Above has a set of functions
### SPRESTItemServices.getItems()
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTItemServices',
                    function($scope,$SPRESTItemServices){
                      $scope.retrieveListItems_oData=SPRESTItemServices.getItems({
                                                  siteURL:'http://mysharepoint.com/sites/mysite', //required string
                                                  listName:'myList', //required list name string
                                                  filters:{
                                                      orderby:'Title Asc',
                                                      select:['Title','Id'],
                                                      top:3
                                                  }
                                                }).then(function(response){console.log(response)})
                    
                    }])

````
The request above calls the Sharepoint REST API creating this URL string
 -- http://mysharepoint.com/sites/mysite/_api/web/lists/GetByTitle(‘myList’)/Items?$orderby=Title Asc&$select=Title,Id&$top=3
 
 A CAML Filter approach is also available please see below
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTItemServices',
                    function($scope,$SPRESTItemServices){
                      $scope.retrieveListItems_caml=SPRESTItemServices.getItems({
                                                  siteURL:'http://mysharepoint.com/sites/mysite', //required string
                                                  listName:'myList', //required list name string
                                                  caml:"<View><Query><OrderBy><FieldRef Name='Title' Ascending='TRUE'/></OrderBy><Rowlimit>3</Rowlimit></Query><ViewFields><FieldRef Name='Id'/><FieldRef Name='Title'/></ViewFields></View>"
                                                }).then(function(response){console.log(response)})
                    
                    }])

````
This will return the same results as the original example but it does not use OData. The Caml operater can be useful when working with null values date fields.
The service does not append the CAML to the url query string but instead passes the request in the header....

No need to worry about URL Query string length here!

### SPRESTItemServices.getContextInfo()

This function is used to grab the current context info of the site. In sharepoint 2013 add-ins(apps). The developer will not always have the ability to grab the requestDigest or the formDigestValue from a .NET control. Especially in an App Part.
This method will allow the developer to grab the value from the site context. Returns the site Context Object

```javascript

myapp.controller('myController',[
                    '$scope',
                    'SPRESTItemServices',
                    function($scope,$SPRESTItemServices){
                      $scope.retrieveSiteContext=SPRESTItemServices.getContextInfo('http://mysites.com/sites/mysitecollection')
                                                        .then(function(response){
                                                          console.log(response)
                                                          console.log(response.d.GetContextWebInformation.FormDigestValue)
                                                          })
                    
                    }])
```
The function calls the REST API
http://mysites.com/sites/mysitecollection/_api/contextinfo

### SPRESTItemServices.createItem()

To Be Written


##SPRESTListServices --

### SPRESTListServices.getList()

Example:
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTListServices',
                    function($scope,$SPRESTListServices){
                      $scope.retrieveListObj=SPRESTItemServices.getList({
                                                        siteUrl:'http://mySite.com/sites/mysitecollection', //required string
                                                        listName:'myList' //required string
                                                      })
                                                        .then(function(response){
                                                          console.log(response)
                                                          })
                    
                    }])
```

### SPRESTListServices.getField()
Example:
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTListServices',
                    function($scope,$SPRESTListServices){
                      $scope.getFieldObj=SPRESTItemServices.getField({
                                                        siteUrl:'http://mySite.com/sites/mysitecollection', //required string
                                                        listName:'myList' //required string
                                                        GUID:'{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}' //required guid
                                                      })
                                                        .then(function(response){
                                                          console.log(response)
                                                          })
                    
                    }])
```
### SPRESTListServices.getFields()


Example:
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTListServices',
                    function($scope,$SPRESTListServices){
                      $scope.getFieldObj=SPRESTItemServices.getFields({
                                                        siteUrl:'http://mySite.com/sites/mysitecollection', //required string
                                                        listName:'myList' //required string
                                                        
                                                      })
                                                        .then(function(response){
                                                          console.log(response)
                                                          })
                    
                    }])
```

##SPRESTUserServices --
### SPRESTListServices.getCurrentUser()

Example:
```javascript
myapp.controller('myController',[
                    '$scope',
                    'SPRESTUserServices',
                    function($scope,$SPRESTUserServices){
                      $scope.getFieldObj=SPRESTItemServices.getCurrentUser({
                                                        siteUrl:'http://mySite.com/sites/mysitecollection', //required string
                                                      })
                                                        .then(function(response){
                                                          console.log(response)
                                                          })
                    
                    }])
```





