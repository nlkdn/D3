function draw(data){
        const margin = 75,
              width = 800 - margin,
              height = 500 - margin;

        const svg = d3.select('body')
                .append('svg')
                .attr('width', width+margin)
                .attr('height', height+margin);

        const xAvg = d3.scaleLinear()
                .domain([0,d3.max(data, d => d["avg"])])
                .range([margin,width]);

        const yHR = d3.scaleLinear()
                .domain([0,d3.max(data, d => d["HR"])])
                .range([height,margin]);

        const xAxis = d3.axisBottom(xAvg)
                        .ticks(20);
        
        const yAxis = d3.axisLeft(yHR)
                        .ticks(10);
        
        d3.select("svg")
        .append('g')
        //.attr('class', 'x-axis')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis);

        d3.select("svg")
        .append('g')
        //.attr('class','y-axis')
        .attr('transform',"translate(" + margin + ",0)")
        .call(yAxis)

        d3.select('svg')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle');
        
        d3.selectAll("circle")
        .attr("cx", d => xAvg(d["avg"]))
        .attr("cy", d => yHR(d["HR"]))
        .attr("r", function(d){
                if (d['BMI']>31) {
                        return 3*3;
                } else
                if (d['BMI']>25) {
                        return 3*2;
                } else
                {
                        return 3;
                }
        })
        .attr("fill", function(d){
                if (d['handedness']=='L') {
                        return 'green';
                } else
                if (d['handedness']=='R') {
                        return 'orange';
                } else
                {
                        return 'lightblue';
                }
        });

}

d3.csv('baseball_data.csv',function(d){
return  {
        name: d.name,
        handedness: d.handedness,
        height: +d.height,
        weight: +d.weight,
        avg: +d.avg,
        HR: +d.HR,
        BMI:(+d.weight/2.205)/((+d.height*0.0254)**2)
        };
})
.then(d => draw(d));




