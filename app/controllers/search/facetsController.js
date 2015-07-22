/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/

//Define facetsController controller in 'app'
//---
// services required $rootScope, $scope, $routeParams, $http, $location, sharedProperties
listing.controller("facetsController", function($rootScope, $scope, $routeParams, $http, $location, sharedProperties){


//@function selectFacet()
//- @param term : the term we selected
//- @param parent : the parent facet
//- @param count : count of the term
//
//creates jsons {"term":"xxx","facet":"xxx","count":"xxx"}
//in active facets and calls findElements() from listingController in order to use the new
$scope.selectFacet = function(term, parent, count)
{

	var facet = {"term":term,"facet":parent,"count":count};

	var flag = false;
	/*check if facet is in active ones*/
	for(active in $scope.activeFacets){
		if(facet.term == $scope.activeFacets[active].term){
			flag=true
		}
	}

	/*push item in active facets if it's not in array*/
	if(!flag){
		$scope.activeFacets.push(facet);
	}

	$rootScope.currentPage = 1;
    $scope.findElements( false, 'classic' );
    $scope.update();

}


//@function deselectFacet()
//- @param term : the term we selected
//- @param parent : the parent facet
//- @param count : count of the term
//
//creates jsons {"term":"xxx","facet":"xxx","count":"xxx"}
//in active facets and calls findElements() from listingController in order to use the new
$scope.deselectFacet = function(facet)
{
	var index = $scope.activeFacets.indexOf(facet);
	if (index > -1){
	    $scope.activeFacets.splice(index, 1);
	}

	if($routeParams[facet.facet]) {
		$routeParams[facet.facet] = $routeParams[facet.facet].replace( facet.term + ',' ,'' ).replace( ',' + facet.term, '');
	}


    $scope.findElements( false, 'classic' );
}



});
