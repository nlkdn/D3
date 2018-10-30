//Draw Function
function draw(data){
		// Margin, Height, Weight for SVG
        const margin = 50,
              width = 800 - margin,
              height = 500 - margin;
		
		// Chart title
		d3.select('body')
			.append('h2')
			.text('Basball player Stats');
			
		// Create SVG element
        const svg = d3.select('body')
                .append('svg')
                .attr('width', width+margin)
                .attr('height', height+margin);
		
		// X-axis scale
        const xAvg = d3.scaleLinear()
                .domain([0,d3.max(data, d => d["avg"])])
                .range([margin,width]);

		// Y-Axis scale		
        const yHR = d3.scaleLinear()
                .domain([0,d3.max(data, d => d["HR"])])
                .range([height,margin]);
		
		// Draw X-axis
        const xAxis = d3.axisBottom(xAvg)
                        .ticks(20);
        
		// Draw Y-axis
        const yAxis = d3.axisLeft(yHR)
                        .ticks(10);
		
		// Div element for tooltip
		const div = d3.select("body")
						.append("div")	
						.attr("class", "tooltip")				
						.style("opacity", 0);
		
		// X-Axis position 
		d3.select("svg")
        .append('g')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis);
		
		// Y-Axis position 
        d3.select("svg")
        .append('g')
        .attr('transform',"translate(" + margin + ",0)")
        .call(yAxis)

		// Add Bubbles
        d3.select('svg')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
		// Bubble position
        .attr("cx", d => xAvg(d["avg"]))
        .attr("cy", d => yHR(d["HR"]))
		// Bubble radius
        .attr("r", function(d){
                if (d['BMI']>30) {
                        return 4+4;
                } else
                if (d['BMI']>25) {
                        return 4+2;
                } else
                {
                        return 4;
                }
        })
		
		//Coloring Bubbles
        .attr("fill", function(d){
                if (d['handedness']=='L') {
                        return '#7fc97f';
                } else
                if (d['handedness']=='R') {
                        return '#beaed4';
                } else
                {
                        return '#fdc086';
                }
        })
		.attr('stroke','black')
		.attr('stroke-width','0.5')
		
		// Adding tooltip
		.on("mouseover", function(d) {	
			d3.select(this).style('stroke-width','1.5');
			div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html( 'Name: ' + d['name'] +'<br>'+
						'Handedness: ' + d.handedness +'<br>'+
						'Height: ' + d.height +' inches <br>'+
						'Weight: ' +d.weight+' lb <br>'+
						'Batting Avg: ' +d.avg+'<br>'+
						'Home Runs: ' +d.HR+'<br>'+
						'BMI: ' + d.BMI )
                .style("left", (d3.event.pageX+10) + "px")		
                .style("top", (d3.event.pageY -100) + "px");	
            })					
        .on("mouseout", function(d) {
			d3.select(this).style('stroke-width','0.5');			
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
		
		//Adding legends
		const legend  = svg.append('g')
			.attr('class','legend')
			.attr('transform', "translate(" + (margin+50)+ "," + margin + ")")
			.selectAll('g')
			.data(["L","R","B"])
			.enter().append('g');
		
		legend.append('circle')
			.attr('cy', (d,i) => i*30 )
			.attr('r', d => 3)	
			.attr('fill',function(d){
				if (d ==='L') {
					return '#7fc97f';
				} else
				if (d ==='R') {
					return '#beaed4';
				} else
				{
					return '#fdc086';
				}
			})
			.attr('stroke','black')
			.attr('stroke-width','0.5');
				
		legend.append('text')
			.attr('y', (d,i) => i*30+5 )
			.attr('x', 10)
			.text(d => d);
		
		const legend1  = svg.append('g')
			.attr('class','legend1')
			.attr('transform', "translate(" + (margin+100)+ "," + margin + ")")
			.selectAll('g')
			.data(["Normal","Overweight","Obese"])
			.enter().append('g');
		
		legend1.append('circle')
			.attr('cy', (d,i) => i*30 )
			.attr('r', function(d){
                if (d ==='Obese') {
                        return 4+4;
                } else
                if (d ==='Overweight') {
                        return 4+2;
                } else
                {
                        return 4;
                }
				})
			.attr('fill','lightgrey')
			.attr('stroke','black')
			.attr('stroke-width','0.5');
		
		legend1.append('text')
			.attr('y', (d,i) => i*30+5 )
			.attr('x', 12)
			.text(d => d);
		
		//Axis text
		svg.append("text")             
			.attr("transform", "translate(" + (width/2) + " ," + (height + 30) + ")")
			.style("text-anchor", "middle")
			.text("Batting Avg");
			
		svg.append("text")             
			.attr("transform", "translate(" + (margin-30) + " ," + (height/2) + ") rotate(270)")
			.style("text-anchor", "middle")
			.text("Home Runs");

}
// Load data
d3.csv('baseball_data.csv',function(d){
	return  {
			name: d.name,
			handedness: d.handedness,
			height: +d.height,
			weight: +d.weight,
			avg: +d.avg,
			HR: +d.HR,
			BMI:d3.format(".2f")((+d.weight/2.205)/((+d.height*0.0254)**2).toFixed(2))
			};
	})
	.then(d => draw(d));