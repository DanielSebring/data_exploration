$(function() {
	console.log("Hello!!!!!");
	var xScale, yScale;
	var countryObjects = [];
	var countryMap = new Object();
	/*DATA PROCESSING STEPS*/
	
	
	d3.csv('data/refugees/refugee_amounts.csv', function (error, allData) {
		
		// from here we want the last 5 years of refugee data and the names of the countries
		var falseCodes = ["ARB" , "CSS" , "EAP" , "EAS" , "ECA" , "ECS" , "EUU" , "FCS" , "HPC"
			, "HIC" , "INX" , "LCN" , "LAC" , "LDC" , "LIC" , "LMY" , "MEA" , "MIC" , "NOC" , "OED" , "OSS" , "PSS" , "SSA" , "SSF" , "SST" , "UMC" , "WLD", "MNA", "LMC"];
		
			
		for (var i = 0; i < allData.length; i++) {
			if ((allData[i].hasOwnProperty("Country Code")) && (allData[i]["Country Code"].length == 3) && (!isInArray(allData[i]["Country Code"], falseCodes))) {
				//console.log(allData[i]["Country Name"]);
				//console.log(allData[i]["Country Code"]);
				countryMap[allData[i]["Country Code"]] = i;
				
				var countryObj = {
					"name": allData[i]["Country Name"],
					"code": allData[i]["Country Code"],
					"1994": allData[i]["1994"],
					"1995": allData[i]["1995"],
					"1996": allData[i]["1996"],
					"1997": allData[i]["1997"],
					"1998": allData[i]["1998"],
					"1999": allData[i]["1999"],
					"2000": allData[i]["2000"],
					"2001": allData[i]["2001"],
					"2002": allData[i]["2002"],
					"2003": allData[i]["2003"],
					"2004": allData[i]["2004"],
					"2005": allData[i]["2005"],
					"2006": allData[i]["2006"],
					"2007": allData[i]["2007"],
					"2008": allData[i]["2008"],
					"2009": allData[i]["2009"],
					"2010": allData[i]["2010"],
					"2011": allData[i]["2011"],
					"2012": allData[i]["2012"],
					"2013": allData[i]["2013"],
					"2014": allData[i]["2014"]				
				}
			//console.log("just finished " + countryObj.name);
			countryObjects.push(countryObj);
			}
			
		}
		console.log(countryMap);
	});
	
	d3.csv('data/refugees/population_data.csv', function (error, allData) {
		for(var i = 0; i < allData.length; i++) {
			if ((allData[i].hasOwnProperty("Country Code")) && (allData[i]["Country Code"].length == 3)) {
				var arrayLocation = get(countryMap, allData[i]["Country Code"]);
				countryObjects[arrayLocation]["population"] = allData[i]["2014"];
			}
			console.log(allData[i]);
		}
		
		// from here we want the population of each country and then merge that with the earlier countries
		//console.log("populations: ", allData);
	});
	
	d3.csv('data/refugees/country_regions.csv', function (error, allData) {
		// here we need to assign the regions to the countries from earlier
		//console.log("regions: " , allData);
	});
	
	d3.csv('data/worldFactbook/gdp-capita.csv', function(error, allData) {
		//console.log("gdp per capita: " , allData);
	});
	
	/***** END DATA PROCESSING *******/
	
	
});

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function get(map, key) {
	return map[key];
}