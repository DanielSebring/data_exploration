// All coding done by Daniel Sebring for INFO 474: Interactive Data Visualization, program assignment 2: Building a Data Exploration Tool
// of course, couldn't have done it without a little help from my friends, credit to 
// Mike Freeman - for lots of the base code and layout, designed after https://github.com/INFO-474/m8-scales/blob/complete/exercise-3/js/main.js
// WebTutsDepot- they have a great handy little tutorial on a quick and dirty way to make a adjustable, readable, range slider

$(function() {  
    // initial setup- here we're creating global variables that we want to access across different functions
    var xScale, yScale, currentCountries;
    var countryObjects = [];        // this will store the aggregate data
    var countryMap = new Object();  // made this to have a quick check that we're only storing data for a accepted subset of countries
    var falseCodes = [];            // this will store an array of codes that are in the data but don't correspond to singular countries


    var measure = "total"; // the var that keeps track of the measure (total refugees, refugees over population, or refugees /GDP per capita)
    var average = "2013"; // this var keeps track of whether the user wants 5 years of data or the most recent year of data


    // margins for setting up the D3 svg
    var margin = {
        left: 70,
        bottom: 100,
        top: 50,
        right: 50
    };

    // these will control the portion of the svg that becomes out sweet graph
    var height = 600 - margin.bottom - margin.top;
    var width = 1200 - margin.left - margin.right;


    // first step is to lay out the website- preparing the canvas, if you will

    var svg = d3.select('#vis')
        .append('svg')
        .attr('height', 600)
        .attr('width', 1200);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', height)
        .attr('width', width);
        
        // this label is what is put under all the x-axis ticks- will be the "codes" of countries
    var xAxisLabel = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        .attr('class', 'axis');
        
        // this label is what is put beside all the y-axis ticks- will be the numbers of refugees or computed total of other measures
    var yAxisLabel = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('class', 'axis');
        
        // this will be the label that descrbes the x Axis (Country)
    var xAxisText = svg.append('text')
        .attr('transform', 'translate(' + (margin.left + width / 2) + ',' + (height + margin.top + 40) + ')')
        .attr('class', 'title');
        
        // this will be the label that descrbes the y Axis (Total/GDP/or refugees per capita)
    var yAxisText = svg.append('text')
        .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + height / 2) + ') rotate(-90)')
        .attr('class', 'title');
        
        // this is totally arbitrary to the set of data I'm using.  It incudes 
    falseCodes = ["EMU", "NAC", "ARB", "CSS", "EAP", "EAS", "ECA", "ECS", "EUU", "FCS", "HPC", "HIC", "INX", "LCN", "LAC", "LDC", "LIC", "LMY", "MEA", "MIC", "NOC", "OEC", "OED", "OSS", "PSS", "SAS", "SSA", "SSF", "SST", "UMC", "WLD", "MNA", "LMC"];


    /*************************************DATA PROCESSING STEPS*************************************/

    // this function will go through the first csv and pull out information on the refugee population by year, the country code, and 
    // will compute the average refugee amount over 5 years
    d3.csv('data/refugees/refugee_amounts.csv', function(error, allData) {
        for (var i = 0; i < allData.length; i++) {
            if (isRealCountry(allData, i)) {              
                // refugee numbers are stored as strings, so in order to properly add and divide to get the five year total,
                //  we have to convert all strings to ints before attempting to add and divide
                var fiveYearAvg = (
                    (betterParseInt(convertToInt(allData[i]["2013"])) +
                    betterParseInt(convertToInt(allData[i]["2012"])) +
                    betterParseInt(convertToInt(allData[i]["2011"])) +
                    betterParseInt(convertToInt(allData[i]["2010"])) +
                    betterParseInt(convertToInt(allData[i]["2009"]))) / 5
                ); 
                // the basic shell of how the data objects will look after aggregation, we'll also add
                // data about the population size, gdp per capita, and region the country resides in, but
                // that'll get pulled from different data sets
                var countryObj = {
                    "name": allData[i]["Country Name"],
                    "code": allData[i]["Country Code"],
                    "1994": betterParseInt(allData[i]["1994"]),
                    "1995": betterParseInt(allData[i]["1995"]),
                    "1996": betterParseInt(allData[i]["1996"]),
                    "1997": betterParseInt(allData[i]["1997"]),
                    "1998": betterParseInt(allData[i]["1998"]),
                    "1999": betterParseInt(allData[i]["1999"]),
                    "2000": betterParseInt(allData[i]["2000"]),
                    "2001": betterParseInt(allData[i]["2001"]),
                    "2002": betterParseInt(allData[i]["2002"]),
                    "2003": betterParseInt(allData[i]["2003"]),
                    "2004": betterParseInt(allData[i]["2004"]),
                    "2005": betterParseInt(allData[i]["2005"]),
                    "2006": betterParseInt(allData[i]["2006"]),
                    "2007": betterParseInt(allData[i]["2007"]),
                    "2008": betterParseInt(allData[i]["2008"]),
                    "2009": betterParseInt(allData[i]["2009"]),
                    "2010": betterParseInt(allData[i]["2010"]),
                    "2011": betterParseInt(allData[i]["2011"]),
                    "2012": betterParseInt(allData[i]["2012"]),
                    "2013": betterParseInt(allData[i]["2013"]),
                    "2014": betterParseInt(allData[i]["2014"]),
                    "average": fiveYearAvg
                }
                // we store the name of the country in a map so we can conveniently check later whether we have a
                // country that exists by that name in the data. 
                countryMap[allData[i]["Country Name"]] = true;
                countryObjects[i] = countryObj;
            }
        }
        
        // the next task is to parse a different data set for population data
        d3.csv('data/refugees/population_data.csv', function(error, allData) {
            // we iterate through the list of all the data that d3 generated
            for (var i = 0; i < allData.length; i++) {
                    // this check is universal throughout the data processing, so wrote a quick way to use it
                if (isRealCountry(allData, i)) {
                    // to grab the location of the country in the object arrays (it get's sorted and needs a way)
                    // to find where it should be looking for the elements of the same name (will no longer be alphabetical)
                    var arrayLocation = getJSONIndexByName(countryObjects, allData[i]["Country Name"]);
                    countryObjects[arrayLocation]["pop"] = allData[i]["2014"]; 
                }
            }
        });
        
        // this uses a similar format to parse 
        d3.csv('data/refugees/country_regions.csv', function(error, allData) {
            for (var i = 0; i < allData.length; i++) {
                if (isRealCountry(allData, i)) {
                    var arrayLocation = getJSONIndexByName(countryObjects, allData[i]["Country Name"]);
                    countryObjects[arrayLocation]["region"] = allData[i]["Region"];
                }
            }
        });

        d3.csv('data/worldFactbook/gdp-capita.csv', function(error, allData) {
            for (var i = 0; i < allData.length; i++) {
                if (get(countryMap, allData[i]["Country"])) {
                    var arrayLocation = getJSONIndexByName(countryObjects, allData[i]["Country"]);
                    countryObjects[arrayLocation]["gdp"] = allData[i]["GDP Per Capita"];
                } 
            }
            filterData();
            draw(currentCountries);
        });
        
        
        // the above might be able to be written into a single function for reusability
        
     /*************************************END DATA PROCESSING STEPS*************************************/


        var setScales = function(data) {
            console.log(data);
            // for scales: 
            // input domain: the range of possible input data values (if you have 100, 200, 300, 400, and 500, 100 to 500 would be the domain)
            // output range: the range of possible output values (often display values in pixels)
            var countries = data.map(function(d) {
                return d.code
            });     
            
            var yMin = Infinity;
            var yMax = -Infinity;
            

            
            if (measure == "total") {
                yMax = d3.max(data, function(d) { return (+betterParseInt(d[average]) / 1.0)})
                console.log("yMax " + yMax);
                yMin = d3.min(data, function(d) { return (+betterParseInt(d[average]) / 1.0)})//data[document.getElementById("slider1").value][measure];
            } else if (measure == "gdp") {
                yMax = d3.max(data, function(d) { return (+betterParseInt(d[average]) / betterParseInt(d["gdp"]))})
                console.log("yMax " + yMax);
                yMin = d3.min(data, function(d) { return (+betterParseInt(d[average]) / betterParseInt(d["gdp"]))})  //(data[document.getElementById("slider1").value][measure] / data[0]["gdp"]);
            } else {
                yMax = d3.max(data, function(d) { return (+betterParseInt(d[average]) / betterParseInt(d["pop"]))})
                console.log("yMax " + yMax)
                yMin = d3.min(data, function(d) { return (+betterParseInt(d[average]) / betterParseInt(d["pop"]))}) //yMax = (data[0][measure] / data[0]["pop"]);
            }
            // TODO info about xscale
            xScale = d3.scale.ordinal().rangeBands([0, width], .2).domain(countries);
            // TODO info about yscale
            yScale = d3.scale.linear().range([height, 0]).domain([0, yMax]);
            console.log("213123123213 height " + height)
        }


        var setAxes = function() {
            console.log("setting axes");
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(d3.format('2s'));

 
            xAxisLabel.transition().duration(1000).call(xAxis);

            yAxisLabel.transition().duration(1000).call(yAxis);
            //if (measure == 'total') {
                
            //} else if (measure == 'gdp') {}
            var year = "";
            if (average = "2013") {
               year = "2013" 
            } else {
                year = "2009-2013"
            }
            yAxisText.text('Number of Refugees in ' + year)
            xAxisText.text('Country')
            
        }

        var filterData = function() {
            console.log("filtering dat data"); 
            currentCountries = countryObjects
            .sort(function(a, b) {
                if (measure == 'total') {
                    //things

                    return (betterParseInt(b[average]) - betterParseInt(convertToInt(a[average])))
                } if (measure == 'gdp') {
                    //gdp things
                    return ((betterParseInt(b[average]) / betterParseInt(b["gdp"])) - ((betterParseInt(a[average]) / betterParseInt(a["gdp"]))))
                } else {
                    //pop things
                    return ((betterParseInt(b[average]) / betterParseInt(b["pop"])) - ((betterParseInt(a[average]) / betterParseInt(a["pop"]))))
                }
              
                //if (average == "2013") {
                 //   console.log("only 2013!");
                   
                //} else {
                 //   console.log("5 year data");
                  //  return parseInt(convertToInt(b["average"])) - parseInt(convertToInt(a["average"]))
               // }
              
            })
            currentCountries = currentCountries.slice(0, (parseInt(document.getElementById("slider1").value) + 1));
            console.log("sliced countries " , currentCountries);
            
        }
        
        
        /* color from here: http://bl.ocks.org/weiglemc/6185069 */
        var color = d3.scale.category10();

        var draw = function(data) {
            console.log("drawing dat data")
            setScales(data);

            setAxes();
            
            console.log("inDraw data!!!" , data); 
            var bars = g.selectAll('rect').data(data);
            
            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.code)
                })
                .attr('y', height)
                .attr('height', 0)
                .attr('width', xScale.rangeBand())
                .attr('class', 'bar')
                .attr('title', function(d) {
                    return d.name
                })
                .style("fill", function(d) { return color(d.region)})

            bars.exit().remove();

            bars.transition()
                .duration(1000)
                .delay(function(d, i) {
                    return i * 50
                })
                .attr('x', function(d) {
                    return xScale(d.code)
                })
                .attr('y', function(d) {
                    console.log("yScale:" , yScale);
                    return yScale(d[average])
                })
                .attr('height', function(d) {
                    return height - yScale(d[average])
                })
                .attr('width', xScale.rangeBand())
                .attr('title', function(d) {
                    return d.name
                });
        }

        $("input").on('change', function() {
            
            measure = $("input:radio[name='options']:checked").val();
            average = $("input:radio[name='options_average']:checked").val();         
            console.log("clicked");
            filterData();
            draw(currentCountries);
        });



        $("rect").tooltip({
            'container': 'body',
            'placement': 'top'
        });

    });

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }


    function convertToInt(stringNum) {
        if (stringNum == "") {
            return 0
        } else {
            return stringNum;
        }
    }
    function isRealCountry(allData, index) {
        return (allData[index].hasOwnProperty("Country Code")) && (allData[index]["Country Code"].length == 3) && (!isInArray(allData[index]["Country Code"], falseCodes));
    }
    
    function get(map, key) {
        return map[key];
    }
    
    function getJSONIndexByName(objects, key) {
        for (var i = 0; i < objects.length; i++) {
            if (typeof objects[i] != 'undefined' && objects[i]["name"] == key) {
                return i;
            } 
        }
    }
    
    function betterParseInt(stringNum) {
        if (stringNum == "") {
            return 0
        } else {
            return parseInt(stringNum);
        }
    }


  
});
/***** END DATA PROCESSING *******/