**INFO 474 Data Exploration Tool**

This tool is generated with data provided from the WorldBank refugee dataset and the World Factbook country information dataset from [this Github page!] (https://github.com/curran/data)  The data was combined from these two resources to provide a better look at the situation- it would be much more helpful to see data about the countries wealth and population in the context of the refugee crisis, rather than just looking solely at the numbers of refugees in each country. 

The visualization tool is designed with an entity like a charity or the UN in mind- someone who is monitoring the overall situation of refugees across the world and deciding where to allocate resources based on the severity of the problem.  This indiviudal would likely want to see a couple of different things.

**Main Controls**
1. The current refugee situation (the number of refugees in each country.  
2. Refugees by GDP- this involves looking at refugee data aggregated into groups by the region of the world.  
3. Influx/outflow trends by population- these countries don't exist in a vacuum.

In addition, I've built in a button to switch between viewing the data in an absolute format and then viewing in the context of the countries GDP (# refugees / GDP per capita) or population (# refugees / population), which should enable someone to see areas that might not have the most overall refugees but might be hurting or having more trouble housing them because of a lower population or lower overall resources.

**Improvements that Could be Made**

1.  Data processing is a monster resource hog.  This thing takes crazy amounts of time to process.  If this was a production visualization, I would imagine I would just run the processing once and store the output (the array of JSON objects that store names, codes, populations, averages, gdp, region, all the goods) and then just use that one data set without reprocessing each time.