function init() {
  // select the dropdown menu with specific id and set a variable for it
  var selector = d3.select("#selDataset");
// read the data from json file and assign it argument "data" object
  d3.json("samples.json").then((data) => {
    console.log(data);
    // use names array to obtain ID numbers of all participants and set variable 
    var sampleNames = data.names;
    // iterates for each element in the array- a dropdown menu option is appended
    sampleNames.forEach((sample) => {
      selector
      // then given the text to show as its ID and value property
        .append("option")
        .text(sample)
        .property("value", sample);
    }); 

    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);
    buildGaugeChart(sampleNames[0]);
})}

init();

// the function is declared but not called here
// it is called by the onchange attribute of the menu in index.html
function optionChanged(newSample) {
  // function calls - the volunteer id within newSample will be passed through
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGaugeChart(newSample);
}
  // create visualizations for individual id chosen
  // takes sample (id #) as the argument
function buildMetadata(sample) {
  // pull dataset and refer to as "data"
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // filter object in array whose id property matches id passed above as sample
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // results returned as an array - first item is selected and assigned a variable
    var result = resultArray[0];
    // select specific div tag (on demographic panel in html file) and assign variable
    var PANEL = d3.select("#sample-metadata");
    // clear contents when another id is chosen
    PANEL.html("");
    // Demographic Information Panel
    PANEL.append("h6").text("ID:" + result.id);
    PANEL.append("h6").text("Ethnicity:" + result.ethnicity);
    PANEL.append("h6").text("Gender:" + result.gender);
    PANEL.append("h6").text("Age:" + result.age);
    PANEL.append("h6").text("Location:" + result.location);
    PANEL.append("h6").text("bbtype:" + result.bbtype);
    PANEL.append("h6").text("wfreq:" + result.wfreq);
  });
}

function buildCharts(sample) {

  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    // filter object in array whose id property matches id passed above as sample
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // results returned as an array - first item is selected and assigned a variable
    var result = resultArray[0];
  
  var otuIds = result.otu_ids  
  var otuLabel = result.otu_labels
  var sampleValues = result.sample_values

  toptenValues = sampleValues.slice(0,10).reverse();
  toptenOTUs = otuIds.slice(0,10).map(OTU => `OTU ${OTU}`).reverse();

// Trace for the OTU id data
var trace = {
  x: toptenValues,
  y: toptenOTUs,
  text: otuLabel.slice(0,10).reverse(),
  name: "OTU Results",
  type: "bar",
  orientation: "h"
};

var data = [trace];

// Render the plot to the div tag with id "plot"
Plotly.newPlot("bar", data);

// Bubble chart for relative frequency
var trace1 = {
  x: otuIds,
  y: sampleValues,
  text: otuLabel,
  mode: 'markers',
  marker: {
    color: otuIds,
    size: sampleValues
  }

};

var data1 = [trace1]

Plotly.newPlot("bubble", data1);
});
} 

function buildGaugeChart(wfreq) {
  // Enter a speed between 0 and 180
  var level = parseFloat(wfreq) * 20;
  console.log("LEVEL: " + level);
  /*
    This code to calculate needle and its position.
  */
  // Trig to calc meter point
  var degrees = 180 - level;
  console.log("DEGREES: "+ degrees);
  radius = .5;
  var radians = (degrees * Math.PI) / 180;
  console.log("RADIANCE: " + radians);
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  console.log('X angle: ' + x);
  console.log('Y angle: ' + y);
  console.log('DEGREES: ' + degrees);
  var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
  var mainPath = path1,
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);
  console.log("PATH: " + path);
  var data = [
    {
      type: 'scatter',
      x: [0],
      y:[0],
      marker: {size: 14, color:'850000'},
      showlegend: false,
      name: 'Freq',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
      textinfo: 'text',
      textposition:'inside',
      marker:
      {
        colors:["red","orange","yellow","green","blue","skyblue","purple","violet","pink","white"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: 'text',
      hole: .30,
      type: 'pie',
      showlegend: false
    }
  ];
  var layout = {
    shapes:[
      {
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ],
    title: "<b>Frequency of Belly Button Washes</b> <br>scrubs per week",
    height: 500, width: 700,
    xaxis: {
      zeroline:false, showticklabels:false,
      showgrid: false, range: [-1, 1]
    },
    yaxis: {
      zeroline:false, showticklabels:false,
      showgrid: false, range: [-1, 1]
    }
  };
Plotly.newPlot("gauge", data, layout);
};
