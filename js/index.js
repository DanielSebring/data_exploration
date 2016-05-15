// All coding done by Daniel Sebring for INFO 474: Interactive Data Visualization, program assignment 2: Building a Data Exploration Tool
// of course, couldn't have done it without a little help from my friends, credit to 
// Professor Freeman - for lots of the base code and layout, designed after https://github.com/INFO-474/m8-scales/blob/complete/exercise-3/js/main.js
// WebTutsDepot- they have a great handy little tutorial on a quick and dirty way to make a adjustable, readable, range slider
// Tooltips inspired by Justin Palmer’s Block 6476579 ← 3885304
// Legend inspired by http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend

$(function() {
    // initial setup- here we're creating global variables that we want to access across different functions
    var xScale, yScale, currentCountries;
    var countryObjects = []; // this will store the aggregate data
    var countryMap = new Object(); // made this to have a quick check that we're only storing data for a accepted subset of countries
    var falseCodes = []; // this will store an array of codes that are in the data but don't correspond to singular countries


    var measure = "total"; // the var that keeps track of the measure (total refugees, refugees over population, or refugees /GDP per capita)
    var average = "2013"; // this var keeps track of whether the user wants 5 years of data or the most recent year of data


    // margins for setting up the D3 svg
    var margin = {
        left: 75,
        bottom: 100,
        top: 50,
        right: 50
    };

    // these will control the portion of the svg that becomes out sweet graph
    var height = 750 - margin.bottom - margin.top;
    var width = 1200 - margin.left - margin.right;


    // first step is to lay out the website- preparing the canvas, if you will

    var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    var svg = d3.select('#vis')
        .append('svg')
        .attr('height', 750)
        .attr('width', 1200);

    // these data go with the legend, and determine how far to space different elements
    var legendRectSize = 18;
    var legendSpacing = 4;

    // this is the graph that will hold all the rectangles 
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
        .attr('transform', 'translate(' + (margin.left - 55) + ',' + (margin.top + (height / 1.25)) + ') rotate(-90)')
        .attr('class', 'title');

    // this is totally arbitrary to the set of data I'm using.  It incudes 
    falseCodes = ["CEB", "EMU", "NAC", "ARB", "CSS", "EAP", "EAS", "ECA", "ECS", "EUU", "FCS", "HPC", "HIC", "INX", "LCN", "LAC", "LDC", "LIC", "LMY", "MEA", "MIC", "NOC", "OEC", "OED", "OSS", "PSS", "SAS", "SSA", "SSF", "SST", "UMC", "WLD", "MNA", "LMC", "TWN"];


    /*************************************DATA PROCESSING STEPS*************************************/

    // this function will go through the first csv and pull out information on the refugee population by year, the country code, and 
    // will compute the average refugee amount over 5 years
    d3.csv('data/refugees/refugee_amounts.csv', function(error, allData) {
        for (var i = 0; i < allData.length; i++) {
            if (isRealCountry(allData, i)) {
                // refugee numbers are stored as strings, so in order to properly add and divide to get the five year total,
                //  we have to convert all strings to ints before attempting to add and divide
                var fiveYearAvg = (
                    (betterParseInt(allData[i]["2013"])) +
                        betterParseInt(allData[i]["2012"]) +
                        betterParseInt(allData[i]["2011"]) +
                        betterParseInt(allData[i]["2010"]) +
                        betterParseInt(allData[i]["2009"]) / 5
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

        d3.csv('data/worldFactbook/gdp.csv', function(error, allData) {
            for (var i = 0; i < allData.length; i++) {
                // this dataset has a different set of countries, so we check to make sure the countries it's giving 
                // us are ones we have data for, and we parse through to get the most recent year of data
                if (get(countryMap, allData[i]["Country Name"])) {
                    var gdpVal = returnMostRecentYear(allData, allData[i]["Country Name"]);
                    var arrayLocation = getJSONIndexByName(countryObjects, allData[i]["Country Name"]);
                }
                if (allData[i]["Year"] == gdpVal) {
                    var arrayLocation = getJSONIndexByName(countryObjects, allData[i]["Country Name"]);
                    countryObjects[arrayLocation]["gdp"] = allData[i]["Value"];
                }
            }
            filterData();
            draw(currentCountries);
        });

        // the above might be able to be written into a single function for reusability
        /*************************************END DATA PROCESSING STEPS*************************************/


        // this function tells the graph how to scale all the data, in terms of the range of values that are going to be displayed,
        // and defines how to make sure the data encompasses the full graph, no matter how many elements or the data measure
        var setScales = function(data) {
            // for scales: 
            // input domain: the range of possible input data values (if you have 100, 200, 300, 400, and 500, 100 to 500 would be the domain)
            // output range: the range of possible output values (often display values in pixels)
           
            var countries = data.map(function(d) {
                return d.code
            });
            
            // we set these to infinity so that later when we parse through the data to look for min and max, we can only be lower (or higher)
            var yMin = Infinity;
            var yMax = -Infinity;

            // we need to store the minimum values in an array, because if we sort by gdp then we sort smallest to largest, and can't find the 
            // min just by looking at the value of the first in the array
            var minsArray = [];
            
            // each of looks at the data in a different way to get different values and mins and maxes- 
            // total : just the number of refugees
            // gdp : country total GDP / number of refugees,
            // population: number of refugees / population
            if (measure == "total") {
                yMax = d3.max(data, function(d) {
                    return (+betterParseInt(d[average]) / 1.0)
                })
                yMin = d3.min(data, function(d) {
                    return (+betterParseInt(d[average]) / 1.0)
                }) 
            } else if (measure == "gdp") {
                yMax = d3.max(data, function(d) {
                    return betterParseInt(d["gdp"]) / betterParseInt(d[average])
                });
            } else {
                yMax = d3.max(data, function(d) {
                    return (+betterParseInt(d[average]) / betterParseInt(d["pop"]))
                })
                yMin = d3.min(data, function(d) {
                        return (+betterParseInt(d[average]) / betterParseInt(d["pop"]))
                })
            }
            
            // yScale finds the equation to multiply data values by to get the pixel value 
            // that will ensure all data points fit on the graph height wise 
            yScale = d3.scale.linear().range([height, 0]).domain([0, yMax]);
            
            // xScale finds the equation to multiply data values by to get the pixel value 
            // that will ensure all data points will fit nicely side by side
            xScale = d3.scale.ordinal().rangeBands([0, width], .2).domain(countries);
        }

        // since there are three measurement types and two refugee values to use (2013 or five year average)
        var setAxes = function() {
            
            // creates a d3 axis and places it on the bottom of the graph
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                
            // creates a d3 axis and places it on the left side of the graph
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickFormat(d3.format('2s'));

            // smoothly moves the axis values if it's changed
            xAxisLabel.transition().duration(1000).call(xAxis);

            yAxisLabel.transition().duration(1000).call(yAxis);


            // the next couple functions define how the yAxis is labeled- first it sets the year based off the value displaying and then
            // creates the text string that explains the equation to label the graph
            var year = "";
            if (average = "2013") {
                year = "2013"
            } else {
                year = "2009-2013"
            }

            if (measure == "total") {
                yAxisText.text('Total Number of Refugees in (' + year + ')')
            } else if (measure == "gdp") {
                yAxisText.text('Dollars per Refugee (GDP / Refugees) in (' + year + ')')
            } else {
                //pop
                yAxisText.text('Total Number of Refugees / Population in (' + year + ')')

            }
            // our xAxis is only ever going to be names of countries
            xAxisText.text('Country')

        }

        // each measure uses the same equation defined in the scales function to determine the values of the 
        // different measures depending on what the user has selected and then sorting all the data elements
        // according to that number
        var filterData = function() {
            currentCountries = countryObjects
                .sort(function(a, b) {
                    if (measure == 'total') {
                        // same equation as used with setting the scales
                        return (betterParseInt(b[average]) - betterParseInt(a[average]));
                    }
                    if (measure == 'gdp') {
                        // these large values are a little excessive, but they're used to ensure that any country that doesn't have a full
                        // full set of attributes because the datasets didn't include it gets moved to the very back of the data display array
                        // so we never have to worry about printing data that isn't complete
                        if (typeof a["gdp"] == undefined) {
                            return 100000000000000000000;
                        }
                        if (typeof b["gdp"] == undefined) {
                            return -10000000000000000000;
                        }
                        if (a[average] == 0) {
                            return 10000000000000000000;
                        } else if (b[average] == 0) {
                            return -10000000000000000000;
                        }
                        // same equation as used with setting the scales
                        return ((betterParseInt(a["gdp"]) / betterParseInt(a[average])) - (betterParseInt(b["gdp"]) / betterParseInt(b[average])));
                    } else {
                        // same equation as used with setting the scales
                        return ((betterParseInt(b[average]) / betterParseInt(b["pop"])) - ((betterParseInt(a[average]) / betterParseInt(a["pop"]))))
                    }
                })
            // since the user can select the amount of countries to display, this will cut off the dataset at the user selected value
            currentCountries = currentCountries.slice(0, (parseInt(document.getElementById("slider1").value)));
        }
        
        /* color from here: http://bl.ocks.org/weiglemc/6185069 */
        var color = d3.scale.category10();

        // the draw function is all the steps that need to be taken to make data appear on the g
        var draw = function(data) {
            // first the scales get defined based off the user's currently selected values
            setScales(data);

            setAxes();
            // assign data to the rectangle elements previously on the screen
            var bars = g.selectAll('rect').data(data.slice(0, (parseInt(document.getElementById("slider1").value))));

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
                .style("fill", function(d) {
                    console.log("filii213132asdaddng color for  ", d);
                    return color(d.region)
                })
                
                // the tooltips are the small litte boxes that pop up over the bars when you mouse over them
                .on("mouseout", function() {
                    tooltip.interrupt();
                    tooltip.style("opacity", 0);
                })
                .on("mouseover", function(d) {
                    tooltip.style("opacity", 0);
                    htmlString = "";

                    // the tooltip will have three different sets of equations to determine what value to display, they're the same that are used in setting the scales and drawing heights of the rectangles
                    if (measure == "gdp") {
                        // gdp
                        htmlString = "" + d["name"] + "<br><span class = 'smaller'> Dollars per Refugee: $" + ((betterParseInt(d["gdp"]) / betterParseInt(d[average]))).toLocaleString() + "</span>";
                    } else if (measure == "total") {
                        //total
                        htmlString = "" + d["name"] + "<br><span class = 'smaller'> Total Refugees: " + (betterParseInt(d[average])).toLocaleString() + "</span>";
                    } else {
                        //population
                        htmlString = "" + d["name"] + "<br><span class = 'smaller'> Refugees over Population: " + ((betterParseInt(d[average]) / betterParseInt(d["pop"]))).toLocaleString() + "</span";
                    }            
                    tooltip.html(htmlString)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 25) + "px");
                    tooltip.transition().delay(300).duration(500).style("opacity", 0.9);
                });

            // we need the legend to explain the colors of the data.  the legend will look at the data on the screen and display the colors
            // that are showing, and then it will parse a string that represents the region that each color stands for
            
            // this first function defines the area that the legend will take up, as well as some styling things
            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    // some of the values were already defined in the constructor, this is what puts the tooltip into position
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = 30 * legendRectSize;
                    var vert = (i * height - offset) + 105;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            // this puts the color rectangles on the legends
            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color);

            // appends the text that represents the regions
            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function(d) {
                    return d;
                });
                
            bars.exit().remove();

            // this function is used to move the bars to their positions based off the data they've been bound with 
            // it checks what the sure has selcted, runs our previous calculations, and then runs those values through our
            // scale functions to ensure they're the proper values for our graph size
            bars.transition()
                .duration(1000)
                .delay(function(d, i) {
                    return i * 50
                })
                .attr('x', function(d) {
                    return xScale(d.code)
                })
                .attr('y', function(d) {
                    //as a failsafe, check what is currently selected to be measured
                    average = $("input:radio[name='options_average']:checked").val();
                    if (measure == "total") {
                        return yScale(betterParseInt(d[average]));
                    } else if (measure == "gdp") {
                        return yScale(betterParseInt(d["gdp"]) / betterParseInt(d[average]));
                    } else {
                        return yScale(betterParseInt(d[average]) / betterParseInt(d["pop"]))
                    }
                })
                .attr('height', function(d) {
                    average = $("input:radio[name='options_average']:checked").val();
                    if (measure == "total") {
                        //total
                        return height - yScale(betterParseInt(d[average]));
                    } else if (measure == "gdp") {
                        //gdp
                        return height - yScale(betterParseInt(d["gdp"]) / betterParseInt(d[average]));
                    } else {
                        //pop
                        return height - yScale(betterParseInt(d[average]) / betterParseInt(d["pop"]));
                    }
                })
                .attr('width', xScale.rangeBand())
                .attr('title', function(d) {
                    return d.name
                });
        }

        //////////////////////////
        ///   HELPER FUNCTIONS ///
        //////////////////////////
        // these functions are one's that won't actually change the status of the graph, but assist other functions in reusable calcuations
        
        // triggers when the user changes one of the input items, and updates our variables with the new value
        $("input").on('change', function() {
            measure = $("input:radio[name='options']:checked").val();
            average = $("input:radio[name='options_average']:checked").val();
            // redraw because changed
            filterData();
            draw(currentCountries);
        });

        // defines where the tooltip will be
        $("rect").tooltip({
            'container': 'body',
            'placement': 'top'
        });

    });

    // whecks if an array contains a supplied value
    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }

    // checks to make sure the supplied string is one that we have all types of data for
    function isRealCountry(allData, index) {
        return (allData[index].hasOwnProperty("Country Code")) && (allData[index]["Country Code"].length == 3) && (!isInArray(allData[index]["Country Code"], falseCodes));
    }

    // allows us to use a Javascript object like a map and get the value of a key
    function get(map, key) {
        return map[key];
    }

    // looks through a list of JSON objects and returns the index of them 
    function getJSONIndexByName(objects, key) {
        for (var i = 0; i < objects.length; i++) {
            if (typeof objects[i] != 'undefined' && objects[i]["name"] == key) {
                return i;
            }
        }
    }

    // searches through the gdp data to find the year that has the most recent GDP data for a country
    function returnMostRecentYear(data, countryName) {
        for (var i = 0; i < data.length; i++) {
            if (data[i]["Country Name"] == countryName) {
                return data[i]["Year"];
            }
        }
        return 0;
    }

    // converts a string to an int, and will convert an empty string to 0
    function betterParseInt(stringNum) {
        if (stringNum == "") {
            return 0
        } else {
            return parseInt(stringNum);
        }
    }


});