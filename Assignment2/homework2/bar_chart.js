function bar_chart(div_id,data){

    const margins = {left: 100, right: 200, top: 100, bottom: 100};
    const size = {width: 960, height: 600};
    var cur_topic = 'All';
    var f_data = data.filter(d => d.topic == cur_topic);

    // The droplist to select topics
    topic_list = ['All','alt.atheism', 'comp.graphics', 'comp.os.ms-windows.misc',
    'comp.sys.ibm.pc.hardware', 'comp.sys.mac.hardware', 'comp.windows.x',
    'misc.forsale', 'rec.autos', 'rec.motorcycles', 'rec.sport.baseball',
    'rec.sport.hockey', 'sci.crypt', 'sci.electronics', 'sci.med', 'sci.space',
    'soc.religion.christian', 'talk.politics.guns', 'talk.politics.mideast',
    'talk.politics.misc', 'talk.religion.misc']

    var dropdown = d3.select(div_id)
        .append("select")
        .attr("id","topiclist")
            .attr("transform", "translate(" + margins.left + "," + 0 + ")");

    var options = dropdown.selectAll("option")
        .data(topic_list)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
    
        
    // Add button and callback
    comm = new CommAPI("getDocuments", (ret) => {
        alert("Get Documents successfully!");
    });

    var exportButton = d3.select(div_id)
        .append("button")
        .attr("id","exportbutton")
        .text("Export Document")
        .on("click", function() {
            alert("Doucument has been sent.");
            comm.call({'t': cur_topic});
        });
    comm.call({'t': cur_topic});

    // define svg
    var svg = d3.select(div_id)
        .append('svg')
        .attr("width", size.width)
        .attr("height", size.height)
        .append("g")
            .attr("transform", "translate(" + margins.left + "," + 0 + ")");

    // define scales
    var x = d3.scale.linear()
        .domain([0, d3.max(f_data, d => d.count)])
        .range([0, size.width - margins.right - margins.left]);

    var y = d3.scale.ordinal()
        .domain(f_data.map(d => d.word))
        .rangeRoundBands([size.height - margins.bottom , margins.top], .1);

    // define axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0.5)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0.5)
        .orient("left");
    
    svg.append("g")
        .attr("class", "yaxis")
        .call(yAxis)
    
    svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + (size.height - margins.bottom) + ")")

    svg.append("g")
        .selectAll("rect")
        .data(f_data)
        .enter().append("rect")
            .attr("y", d => y(d.word))
            .attr("height", y.rangeBand())
            .attr("x", x(0))
            .attr('width', d => x(d.count));    

    // Add listener to the droplist
    d3.select("#topiclist").on("change", function() {
        applyFilter(this.value);
    });

    // Update the chart
    function applyFilter(value){

        cur_topic = value;

        f_data = data.filter(d => d.topic == value)

        x = d3.scale.linear()
            .domain([0, d3.max(f_data, d => d.count)])
            .range([0, size.width - margins.right - margins.left]);
        
        y = d3.scale.ordinal()
            .domain(f_data.map(d => d.word))
            .rangeRoundBands([size.height - margins.bottom , margins.top], .1);

        xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0.5)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0.5)
            .orient("left");

        svg.select(".xaxis")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".yaxis")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        svg.selectAll("rect")
            .data(f_data)
            .transition()
            .duration(1000)
            .attr("y", d => y(d.word))
            .attr("height", y.rangeBand())
            .attr("x", x(0))
            .attr('width', d => x(d.count));
    }
}
