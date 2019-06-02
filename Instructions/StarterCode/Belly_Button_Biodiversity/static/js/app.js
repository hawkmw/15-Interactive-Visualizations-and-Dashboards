function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`metadata/${sample}`).then(function(data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
   // Use `.html("") to clear any existing metadata
    panel.html("");
  
    Object.entries(data).forEach(([key,value]) => {
      console.log(key,value)
      var sample_value = panel.append("p")
      sample_value.text(`${key}: ${value}`)
    });
  });
}
//********************************************************************************
//*********************************************************************************
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // ***************************************************************
  d3.json(`samples/${sample}`).then(function(data) {
  
    //**********************PIE CHART*****************************************************************************************
      // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_trace = {
      labels: data.otu_ids.slice(0,10),
      values: data.sample_values.slice(0,10),
      type: 'pie'
    };

    var pie_data = [pie_trace];

    var pie_layout = {
      title: `Sample #${sample} - Top 10 OTU IDs`
    };

    Plotly.newPlot('pie', pie_data, pie_layout);

    //**************************BUBBLE PLOT*******************************************************************************
     // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var bubble_trace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values, 
        color: data.otu_ids,
      },
      text: data.otu_labels
    };
    
    var data = [bubble_trace];
    
    var bubble_layout = {
      title: `Biodiversity of Sample #${sample}`,
      showlegend: false,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Sequences Found'}
    };
    
    Plotly.newPlot('bubble', data, bubble_layout);

  });

    
}

//*************************************************************************************************************************************** */
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
