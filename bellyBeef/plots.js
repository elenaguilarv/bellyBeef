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
})}

init();

// the function is declared but not called here
// it is called by the onchange attribute of the menu in index.html
function optionChanged(newSample) {
  // function calls - the volunteer id within newSample will be passed through
  buildMetadata(newSample);
  buildCharts(newSample);
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
    PANEL.append("h6").text(result.id);
    PANEL.append("h6").text(result.ethnicity);
    PANEL.append("h6").text(result.gender);
    PANEL.append("h6").text(result.age);
    PANEL.append("h6").text(result.location);
    PANEL.append("h6").text(result.bbtype);
    PANEL.append("h6").text(result.wfreq);
  });
}