/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/



//Define listingController controller in 'app'
//---

 listing.controller("listingController", function($rootScope, $routeParams, $scope, $http, $location, sharedProperties){

	// variable to calculate the progress of http get request
	$scope.http_get_prog = 37;

	//@function findElements(init, pagination_type) : creates the request for Search API and makes the call
	//- @param init : true if function called in initialization.
	//- @param init
	$rootScope.findElements = function(init, pagination_type)
	{
		//enable loading indicator : true/false
		$scope.loading = true;
		//enable error message : true/false
		$scope.error = false;

		//If query defined in URL
		if($routeParams.q){
			$rootScope.query = $routeParams.q;
		}

		//Search '*' @ initial search
		if(init){
			if(!$rootScope.query) {
				$rootScope.query = 'q=*';
			}

			//URL facets
			var flg = true; //needed for clearing the activeFacets at first time
			//check url
			for(i in $scope.facets) {

		    	if($scope.facets[i] in $routeParams) {
					var terms = $routeParams[$scope.facets[i].toString()].split(',');
					//separate different terms of same facet
					for(j in terms) {
						var facet = { 'facet' : $scope.facets[i].toString() , 'term' : terms[j]} ;
						//push item in activeFacets, if it's not in the array
						$scope.activeFacets.push(facet);
					}
		    	}
			}

			$scope.results = [];
		}

		//If there are facets defined in settings add them in query
		var query_facets = '';
		var query_active_facets = '';

		if($scope.enableFacets){
		//create the query for the AVAILABLE FACETS
			if($scope.facets.length>0) {
		    	query_facets +='&facets=';
		    	for(facet in $scope.facets) {
		    		facet==0 ? query_facets += $scope.facets[facet] : query_facets += ","+$scope.facets[facet];
		    	}
			}
		//create the query for ACTIVE FACETS
			//check activeFacets
			if($scope.activeFacets.length>0) {
				
			    	for(facet in $scope.activeFacets) {
					query_active_facets=', {\"language\":\"anyOfFacet\", \"expression\":\"';
					query_active_facets += $scope.activeFacets[facet].facet+': '+ $scope.activeFacets[facet].term+',';
					query_active_facets+='\"}';
			    		
			    	}
				
			}
	  	}

		//add PAGINATION in query
		var query_pagination = '&page_size='+$scope.pageSize+'&page='+$scope.currentPage;

		//limit facets number per facet
		var limitFacetsNumber = '&facet_size='+$scope.limit_facets_number;

		//facets limitation
		var limitFacets = '';
		for(i in $scope.limit_facets) {
			limitFacets += '&' + i + "=";
			for(j in $scope.limit_facets[i]) {
				if(j!=$scope.limit_facets[i].length-1) {
					limitFacets += $scope.limit_facets[i][j]+',';
				}
				else {
					limitFacets += $scope.limit_facets[i][j];
				}
			}
		}

		//create the FINAL QUERY
		//the  followings DOESN'T shown in URL
		//i.e
		//- query_facets : '&facets=set,language,contexts'
		//- query_pagination : '&page_size=15&page=1'
		//- limitFacets : '&set=oeintute&language=en,fr'
		//- limitFacetsNumber : '&limitFacetsNumber'
		//var query = $scope.api_path + $scope.schema + '?' + $rootScope.query.toLowerCase() + query_facets + query_active_facets + query_pagination + limitFacets + limitFacetsNumber;
		

//?json={\"clause\": [{\"language\": \"VSQL\",\"expression\": \"@@@@\"}],  \"resultInfo\": \"display\",\"resultListOffset\": 0,\"resultListSize\": 12,\"idListOffset\": 0,\"uiLanguage\": \"en\",\"facets\": [\"provider\",\"language\",\"contentType\",\"date\"],\"idListSize\": 12,\"resultFormat\": \"json\",\"resultSortkey\": \"\"}&engine=InMemory&callback=JSON_CALLBACK
		
		var query_language = "VSQL";
		var expression = $rootScope.query.toLowerCase();
		var resultInfo = "display";
		var resultListOffset = ($rootScope.currentPage-1)*10;
		var resultListSize = 10;
		var idListOffset = ($rootScope.currentPage-1)*10;
		var uiLanguage = "en";
		var facets = "[";
		for (item in $scope.facets) {
			facets+='\"'+$scope.facets[item]+'\",';
		}
		facets = facets.substring(0, facets.length - 1);
		facets += "]";	
		var idListSize = 10;
		var resultFormat = "json"
		var resultSortKey = "";
		//var collections = ",{\"language\": \"anyOf\", \"expression\": \"collection:phalese,attaingnant,petrucci,ott,earlymusic,gardano,antico\"}";
		collections= "";
		
//var query="http://83.212.122.220:8080/ecloud/api/ariadne/restp?json={\"clause\": [{\"language\":\"VSQL\",\"expression\":\""+expression+"\"}],\"resultInfo\": \"display\",\"resultListOffset\":0,\"resultListSize\":12,\"idListOffset\":0,\"uiLanguage\":\"en\",\"facets\": [\"provider\",\"language\",\"format\",\"rights\",\"classification\"],\"idListSize\":12,\"resultFormat\":\"json\",\"resultSortkey\":\"\"}&engine=InMemory&callback=JSON_CALLBACK";
		var query = $scope.api_path+'?json={\"clause\": [{\"language\": \"'+query_language+'\",\"expression\": \"'+expression+'\"}'+query_active_facets+collections+'], \"resultInfo\": \"display\",\"resultListOffset\": '+resultListOffset+',\"resultListSize\": '+resultListSize+',\"idListOffset\": 0,\"uiLanguage\": \"'+uiLanguage+'\",\"facets\": '+facets+',\"idListSize\": '+idListSize+',\"resultFormat\": \"'+resultFormat+'\",\"resultSortkey\": \"'+resultSortKey+'\"}&engine=InMemory&callback=JSON_CALLBACK';
		//add parameters to URL
		//active facets
		var activeFacetSplit = query_active_facets.split('&');
		for(tempfacet in $routeParams){
			if(tempfacet!=0){
				/* console.log(tempfacet); */
				/*$location.search(activeFacetSplit[tempfacet].split('=')[0],activeFacetSplit[tempfacet].split('=')[1]); */
			}
		}

		//CHECK IF USER called the loading more or the classic pagination
		if ( pagination_type == 'classic') {
			$scope.search(query);
		} else {
			$scope.searchMore(query);
		}


	}

	//function `search()` works with PAGINATION.
	//Serves content per page
	$scope.search = function(query) {
	$scope.results.length=0;
$http.jsonp(query).success(function(data) {
			  var country = "Unknown Country";
			  var datetime = (new Date()).toISOString();
			  var thisJson = {}; /* get country code */
			  jQuery.get("http://ipinfo.io", function(response) {
			    country = response.country;
				var thisJson = {"actor" : {"objectType": "person", "id": country+"_User", "image": { "url": "", "width": 72, "height": 72 }, "displayName": "User from " + country , "url": "" }, "verb": "searched", "object": { "objectType":"searchTerm", "url": "http://greenlearningnetwork.org/cmme-finder/#/educational/search/?q=" + $rootScope.query, "displayName": $rootScope.query}, "published": datetime };

			  $http.post('http://as-ecm.appspot.com/api/activities/add', JSON.stringify(thisJson)).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });

			  }, "jsonp");
			/*Add facets*/
			if($scope.enableFacets) {
				$scope.inactiveFacets.length = 0;/*clear results*/
				
				var clear_facets = '{';
				for (counter in data.result.facets) {
					for (item in $scope.facets) {
						if (data.result.facets[counter].field == $scope.facets[item]) {
							clear_facets+='\"'+$scope.facets[item]+'\": {';
							for (term in data.result.facets[counter].numbers) {
								clear_facets+='\"'+data.result.facets[counter].numbers[term].val.replace("	 ","").replace(/(?:\r\n|\r|\n)/g, '').replace('					','')+'\":'+data.result.facets[counter].numbers[term].count;
								if (term < data.result.facets[counter].numbers.length-1) {
									clear_facets+=','
								}
								
							}
							clear_facets+='},';
						}
						
					}
				}
				clear_facets = clear_facets.substring(0, clear_facets.length - 1);
				clear_facets+='}';
				
				$scope.inactiveFacets.push(JSON.parse($scope.sanitize(clear_facets)));

			}
			$scope.results.length = 0;
			//Print snippets
			//$scope.results.length = 0;//clear results
			angular.forEach(data.result.metadata, function(result, index){
			  	//Listing Results
			  	var json = $scope.getSnippet(result, $scope.snippetElements);
			  	if(json!=null) {
			  		$scope.results.push(json);
			  	}
			});
			$scope.loading = false;
			sharedProperties.setTotal(data.result.nrOfResults);
			$scope.update();

		});
		//.error(function(error) {
		//	    $scope.loading = false;
		//	    $scope.error = true;
		//	    console.log("Error on $http.get in searchMore(): " + query);
		//});
	}


	//function `searchMore()` works with LOAD MORE.
	//Append content per page
	$scope.searchMore = function(query) {
		console.log(query);
		$http.jsonp(query).success(function(data) {
			  var country = "Unknown Country";
			  var datetime = (new Date()).toISOString();
			  var thisJson = {}; /* get country code */
			  jQuery.get("http://ipinfo.io", function(response) {
			    country = response.country;
				var thisJson = {"actor" : {"objectType": "person", "id": country+"_User", "image": { "url": "", "width": 72, "height": 72 }, "displayName": "User from " + country , "url": "" }, "verb": "searched", "object": { "objectType":"searchTerm", "url": "http://greenlearningnetwork.org/cmme-finder/#/educational/search/?q=" + $rootScope.query, "displayName": $rootScope.query}, "published": datetime };

			  $http.post('http://as-ecm.appspot.com/api/activities/add', JSON.stringify(thisJson)).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });

			  }, "jsonp");

			

			console.log(data.result);
			/*Add facets*/
			if($scope.enableFacets) {
				$scope.inactiveFacets.length = 0;/*clear results*/
				
				var clear_facets = '{';
				for (counter in data.result.facets) {
					for (item in $scope.facets) {
						if (data.result.facets[counter].field == $scope.facets[item]) {
							clear_facets+='\"'+$scope.facets[item]+'\": {';
							for (term in data.result.facets[counter].numbers) {
								var index = data.result.facets[counter].numbers[term].val.indexOf("http://semium.org/time/");
								if (index == -1) {

									clear_facets+='\"'+data.result.facets[counter].numbers[term].val.replace("	 ","").replace(/(?:\r\n|\r|\n)/g, '').replace('					','')+'\":'+data.result.facets[counter].numbers[term].count;
								
									if (term < data.result.facets[counter].numbers.length-1) {
										clear_facets+=',';
									}
								}
								else {
									if (term == data.result.facets[counter].numbers.length-1) {
										clear_facets = clear_facets.substring(0, clear_facets.length - 1);
									}
								}
								
							}
							clear_facets+='},';
						}
						
					}
				}
				clear_facets = clear_facets.substring(0, clear_facets.length - 1);
				clear_facets+='}';
				$scope.inactiveFacets.push(JSON.parse($scope.sanitize(clear_facets)));

			}
			//Print snippets
			//$scope.results.length = 0;//clear results
			angular.forEach(data.result.metadata, function(result, index){
				if (result.contextUri.contextUri_0 != undefined) {
					result.contextUri = result.contextUri.contextUri_0;
				}
				
			  	//Listing Results
			  	var json = $scope.getSnippet(result, $scope.snippetElements);
			  	if(json!=null) {
					
					
			  		$scope.results.push(json);
					
			  	}
			});
			console.log( $scope.results );
			$scope.loading = false;
			sharedProperties.setTotal(data.result.nrOfResults);
			$scope.update();

		});
		//.error(function(error) {
		//	    $scope.loading = false;
		//	    $scope.error = true;
		//	    console.log("Error on $http.get in searchMore(): " + query);
		//});
	}


	//gets the json and create a new one based on the specs of the snippet_elements
	//- @param thisJson : json from result
	//- @param snippet_elements : array with selected elements we want to show in listing (i.e. title, description...)
	$scope.getSnippet = function(thisJson, snippet_elements)
	{	
		var equals = "";
		var temp="";
			
		for(index in snippet_elements)
		{
			for (field in thisJson) {
				if(snippet_elements[index] == field) {
						
						if (typeof (thisJson[field]) === "object") {
							if (field == "title")
							{
								if (Object.getOwnPropertyNames(thisJson[field]).length > 1 && thisJson[field].title_0!=undefined) {
equals += "\"" + snippet_elements[index] + "\" : \"" + thisJson[field].title_0.replace(/["']/g, "")+"\",";
								} 
								else {
									equals += "\"" + snippet_elements[index] + "\" : \"" + thisJson[field][0].value.replace(/["']/g, "")+"\",";
								}
							}
							else {
								if (field =="description") {
									for (description in thisJson[field]) {
									
										text =thisJson[field][description];
										text = text.replace("&lt;","");
										equals += "\"" + snippet_elements[index] + "\" : \"" + $scope.truncate(text, $scope.maxTextLength, ' ...').replace(/\"/g, "\\\"")+"\",";
										break;
									}
								}
							}
						}
						else {
							var div = document.createElement("div");
							div.innerHTML = thisJson[field];
							var text = div.textContent || div.innerText || "";
							text = text.replace("<head>", "").replace("</head>", "").replace("<body>", "").replace("</body>", "").replace("</html>", "").replace("<html>", "").replace("<br>","");
							equals += "\"" + snippet_elements[index] + "\" : \"" + $scope.truncate(text, $scope.maxTextLength, ' ...').replace(/\"/g, "\\\"")+"\",";
						}
					}
			}
		}
		equals = equals.substring(0, equals.length - 1);
		temp = '{' + equals + '}';
			//return every snippet as JSON
			return JSON.parse($scope.sanitize(temp));
	}

});
