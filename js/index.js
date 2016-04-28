$(function() {
	console.log("Hello!!!!!");
	var xScale, yScale, countryObjects;
	
	d3.csv('data/refugees/refugee_amounts.csv', function (error, allData) {
		
		// from here we want the last 5 years of refugee data and the names of the countries
		countryObjects = allData;
		console.log("refugee amounts: ", allData);
		allData.forEach(function() {
			console.log(this);
		})
	});
	
	d3.csv('data/refugees/population_data.csv', function (error, allData) {
		// from here we want the population of each country and then merge that with the earlier countries
		console.log("populations: ", allData);
	});
	
	d3.csv('data/refugees/country_regions.csv', function (error, allData) {
		// here we need to assign the regions to the countries from earlier
		console.log("regions: " , allData);
	});
	
	d3.csv('data/worldFactbook/gdp-capita.csv', function(error, allData) {
		console.log("gdp per capita: " , allData);
	});
});