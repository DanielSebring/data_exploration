**INFO 474 Data Exploration Tool**

This tool is generated with data provided from the WorldBank refugee dataset and the World Factbook country information dataset from [this Github page!] (https://github.com/curran/data)  The data was combined from these two resources to provide a better look at the situation- it would be much more helpful to see data about the countries wealth and population in the context of the refugee crisis, rather than just looking solely at the numbers of refugees in each country. 

The visualization tool is designed with an entity like a charity or the UN in mind- someone who is monitoring the overall situation of refugees across the world and deciding where to allocate resources based on the severity of the problem.  This indiviudal would likely want to see a couple of different things.

A colored bar chart is the optimal expression of this data for a couple of reasons.  When dealing with an important global health issue like the refugee crisis, it's important that you're accurately depicting all of the data.  A bar chart is a good way to have an easily readible display of the data, enabling the user to get a lot of accurate data just with initial judgements.  I've built in tooltips and a legend so that the user can get specific details on individual countries once they've looked at the trends and are trying to hone in on some things.  The bar chart is also nice because it's easy to support a lot of countries being shown, and 

**Main Controls**

1. The current refugee situation (the number of refugees in each country.  
2. Refugees by GDP- this involves looking at refugee data aggregated into groups by the region of the world.  
3. Refugees by population- these countries don't exist in a vacuum.

In addition, there's a button to switch between just the most recent data year (2013) and an aggregate of the last 5 years.

The combination of these controls allow for a couple of things.  First, the difference between the most recent year allows for answering two different questions- what countries are currently dealing with the most refugees, which might indicate a peak or higher amount of refugees coming in, or the countries that have been dealing with lots of refugees for a while, which could indicate those countries need more help because they've been delaing with a lot of refugees for a long time.

The different measures allow for a couple different questions to be answered.  First, since the user can select the total refugees in a country, they can  see what countiries have the most refugees outright, and where the highest amount of refugees that need to be helped in one place is.  In addition, since there is a refugees by GDP, you can see the countries that have the least amount of resources to supply to the refugees in their country.  Obviously a country isn't going to be using their whole GDP on refugees, but it's a nice way to compare the resources a country might have.  Finally, since the user can see the refugees by population, the user can see areas what have the highest percentage of refugee population, which could indicate they would have more difficulty mainting infrastructure for refugees and having space to house them all.

Regions of countries are encoded on the bars in the graph to enable a user to see what regions are struggling the most with refugees in the context of the different measures.  Since the bars correspond directly with the data, the user can get a good idea of the situation in different regions at a glance.

The final piece of control is a rangle slider that allows the user to select the number of countries displayed on the screen.  This doesn't change what data can be determined from the data, but is a bit of a user experience choice.

Link to the Live Visualisation: http://students.washington.edu/dseb/data_exploration/

Thanks to: 
1. Professor Freeman - for lots of the base code and layout, designed after https://github.com/INFO-474/m8-scales/blob/complete/exercise-3/js/main.js

2. WebTutsDepot- they have a great handy little tutorial on a quick and dirty way to make a adjustable, readable, range slider

3. Tooltips inspired by Justin Palmer’s Block 6476579 ← 3885304

4. Legend inspired by http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend