//Width and height
			var w = 1000;
			var h = 500;
			var padding = 40;
      var bool = false;

			var dataset, nestedData, xScale, yScale, xAxis, yAxis;  //Empty, for now

			//For converting strings to Dates
			var parseTime = d3.timeParse("%Y");

			//For converting Dates to strings
			var formatTime = d3.timeFormat("%b %e");

			//Function for converting CSV values from strings to Dates and numbers
			var rowConverter = function(d) {
				return {
					symbol: d.symbol,
					when: parseTime(d.date),
					level: parseFloat(d.level),
          level2: parseFloat(d.level2),
          level3: parseFloat(d.level3),
					male: parseFloat(d.male),
					female: parseFloat(d.female),
					maleCategory2: parseFloat(d.maleCategory2),
					femaleCategory2: parseFloat(d.femaleCategory2),
					maleCategory3: parseFloat(d.maleCategory3),
					femaleCategory3: parseFloat(d.femaleCategory3)

				};
			}

      var svg;
      //New
       var lineGen = d3.line()
        .x( function(d){ return xScale(d.when) } )
        .y( function(d){ return yScale(d.level) } );
      // Note an ordinal scale can have an implicit domain
      var symbolScale = d3.scaleOrdinal(d3.symbols);

      var colorScale = d3.scaleOrdinal(d3.schemeCategory20);


			//Load in the data for all ages 12 and over
			d3.csv("cansim.csv", rowConverter, function(data) {

        nestedData = d3.nest().key( function(d) { return d.symbol } )
						      .entries(data);

				//Copy data into global dataset
        dataset = data;

				//Create scale functions
				xScale = d3.scaleTime()
							   .domain(d3.extent(dataset, function(d) { return d.when; }))
							   .range([padding, w - padding-300]);

				yScale = d3.scaleLinear()
							   .domain(d3.extent(dataset, function(d) { return d.level; }))
							   .range([h - padding, padding]);


				//Define X axis
				xAxis = d3.axisBottom().scale(xScale);

				//Define Y axis
				yAxis = d3.axisLeft().scale(yScale);

         lineGen = d3.line()
					.x( function(d){ return xScale(d.when) } )
					.y( function(d){ return yScale(d.level) } );

          lineGen2 = d3.line()
 					.x( function(d){ return xScale(d.when) } )
 					.y( function(d){ return yScale(d.level2) } );

          lineGen3 = d3.line()
 					.x( function(d){ return xScale(d.when) } )
 					.y( function(d){ return yScale(d.level3) } );

				//Create SVG element
				 svg = d3.select("#graph")
							.append("svg")
							.attr("width", w)
							.attr("height", h);

		  	svg.selectAll("path")
						 							 .data(nestedData)
						 							 .enter()
						 							 .append("path")

						 							 .attr("class", "line")

						 							 .style("stroke", function(d) { return colorScale( d.key ); } )
						 							 .attr("d", function(d) { return lineGen(d.values) } )
						 							 .on("mouseover", function(d){
						 								 d3.select(this)
						 								 .style("stroke-width", "6px");

														 var circleUnderMouse = this;
															 d3.selectAll('path').transition().style('opacity',function () {
																	 return (this === circleUnderMouse) ? 1.0 : 0.2;
															 })
															 d3.selectAll('circle').transition().style('opacity',0.2);
						 							 })
						 							 .on("mouseout", function(d){
						 								 d3.select(this)
						 								 .style("stroke-width", "2px");

														 d3.selectAll('path').transition().style('opacity',1.0);
														  d3.selectAll('circle').transition().style('opacity',1.0);
						 							 });
      //create circles
       svg.selectAll("circle")
                       				   .data(data)
                       				   .enter()
                       				   .append("circle")
                                 .attr("fill", function(d) { return colorScale( d.symbol ); } )
                       				   .attr("cx", function(d) {
                       				   		return xScale(d.when);
                       				   })
                       				   .attr("cy", function(d) {
                       				   		return yScale(d.level);
                       				   })
                       				   .attr("r", 3)
                                 .on("mouseover", function(d) {
																	 d3.select(this).attr("r", 5);

                        					//Get this bar's x/y values, then augment for the tooltip
                        					var xPosition = parseFloat(d3.select(this).attr("cx")) +140 ;
                        					var yPosition = parseFloat(d3.select(this).attr("cy")) +50;

                        					//Update the tooltip position and value
                        					d3.select("#tooltip")
                        						.style("left", xPosition + "px")
                        						.style("top", yPosition + "px")
                        						.select("#value")
                        						.html("Percentage: "+d.level+"%"+ "<br/>"+"Male: "+ d.male+ "%"+ "<br/>"+"Female: "+ d.female+ "%"+ "<br/>"+ " Province: "+d.symbol);

                        					//Show the tooltip
                        					d3.select("#tooltip").classed("hidden", false);

                        			   })
                        			   .on("mouseout", function() {
																  d3.select(this).attr("r", 3);
                        					//Hide the tooltip
                        					d3.select("#tooltip")
                                  .classed("hidden", true);
                        			   });



	   			//Create X axis
	   			svg.append("g")
	   				.attr("class", "x axis")
	   				.attr("transform", "translate(0," + (h - padding) + ")")
	   				.call(xAxis);

	   			//Create Y axis
	   			svg.append("g")
	   				.attr("class", "y axis")
	   				.attr("transform", "translate(" + padding + ",0)")
	   				.call(yAxis);

						//add x axis title
           						svg.append("text")
           						.attr("class", "xAxis title")
           						.attr("text-anchor", "end")
           						.attr("x", w - 155)
               				.attr("y", h - 15)
               				.text("Obese or overweight");

           						//add y axis title
           						svg.append("text")
           						.attr("class", "yAxis title")
           						.attr("text-anchor", "end")
           						.attr("x", w - 900)
               				.attr("y", h - 470)
               				.text("Percentage");

            // A simple legend based on an ordinal scale
    				var legend = svg.append("g")
    					.attr("class", "legend")
    					.attr("transform", "translate(" + (w - 300) +  "," + (padding) + ")");
    				legend.append("rect")
    					.attr("class" , "legend-rect" )
    					.attr("width" , "45")
    					.attr("height", "135");
    				var legendgroups = legend.selectAll("g")
    					.data(nestedData)
    					.enter()
    					.append("g")
    					.attr("transform", function(d,i) {
    						return "translate(" + 10 + "," + (i+1) * 11 + ")" ;
    					});
    				legendgroups.append("text")
    					.text(function (d) { return d.key })
    					.attr("x", 10 )
    					.attr("y", 8 );
    				legendgroups.append("rect")
    					.attr("fill", function(d) { return colorScale( d.key ); } )
    					.attr("height", 8)
    					.attr("width", 8);

			});

      var update = function(){
        d3.select("#button").style("background", "purple");
        d3.select("#button4").style("background", "teal");
        d3.select("#button2").style("background","teal");
        d3.select("#button3").style("background", "teal");

        d3.csv("ca.csv", rowConverter, function(data) {

          var nestedData2 = d3.nest().key( function(d) { return d.symbol } )
  						      .entries(data);

  				//Copy data into global dataset
          var  dataset2 = data;
          console.log(dataset2);
          xScale.domain(d3.extent(dataset2, function(d) { return d.when; }));
          yScale.domain(d3.extent(dataset2, function(d) { return d.level; }));


          svg.selectAll("circle")
                 .data(data)
                 .transition()
                 .duration(1000)
                 .delay(200)
                 .attr("cx", function(d) {
                    return xScale(d.when);
                 })
                 .attr("cy", function(d) {
                    return yScale(d.level);
                 })
                 ;
								 svg.selectAll("circle").on("mouseover", function(d) {
										 d3.select(this).attr("r", 5);

										//Get this bar's x/y values, then augment for the tooltip
										var xPosition = parseFloat(d3.select(this).attr("cx")) +140 ;
										var yPosition = parseFloat(d3.select(this).attr("cy")) +50;

										//Update the tooltip position and value
								 //Update the tooltip position and value
 								d3.select("#tooltip")
 									.style("left", xPosition + "px")
 									.style("top", yPosition + "px")
 									.select("#value")
									.html("Percentage: "+d.level+"%"+ "<br/>"+"Male: "+ d.male+ "%"+ "<br/>"+"Female: "+ d.female+ "%"+ "<br/>"+ " Province: "+d.symbol);


 								//Show the tooltip
 								d3.select("#tooltip").classed("hidden", false);

 							 })
 							 .on("mouseout", function() {
 								d3.select(this).attr("r", 3);
 								//Hide the tooltip
 								d3.select("#tooltip")
 								.classed("hidden", true);
 							 });
          svg.selectAll("path")
             				   .data(nestedData2)
                       .transition()
                       .duration(1000)
                       .delay(200)
             				   .style("stroke", function(d) { return colorScale( d.key ); } )
             				   .attr("d", function(d) { return lineGen(d.values) } );

                       //Update X axis
             					svg.select(".x.axis")
             				    	.transition()
             				    	.duration(1000)
             						.call(xAxis);

             					//Update Y axis
             					svg.select(".y.axis")
             				    	.transition()
             				    	.duration(1000)
             						.call(yAxis);

  			});


      };

      var update2 = function(){
        d3.select("#button").style("background", "teal");
        d3.select("#button4").style("background", "teal");
        d3.select("#button2").style("background", "purple");
        d3.select("#button3").style("background", "teal");

        xScale.domain(d3.extent(dataset, function(d) { return d.when; }));
  			yScale.domain(d3.extent(dataset, function(d) { return d.level; }));



        svg.selectAll("circle")
               .data(dataset)
               .transition()
               .duration(1000)
               .delay(200)
               .attr("cx", function(d) {
                  return xScale(d.when);
               })
               .attr("cy", function(d) {
                  return yScale(d.level);
               });

							 svg.selectAll("circle").on("mouseover", function(d) {
										d3.select(this).attr("r", 5);

									 //Get this bar's x/y values, then augment for the tooltip
									 var xPosition = parseFloat(d3.select(this).attr("cx")) +140 ;
									 var yPosition = parseFloat(d3.select(this).attr("cy")) +50;

									 //Update the tooltip position and value
									 d3.select("#tooltip")
										 .style("left", xPosition + "px")
										 .style("top", yPosition + "px")
										 .select("#value")
										 .html("Percentage: "+d.level+"%"+ "<br/>"+"Male: "+ d.male+ "%"+ "<br/>"+"Female: "+ d.female+ "%"+ "<br/>"+ " Province: "+d.symbol);


									 //Show the tooltip
									 d3.select("#tooltip").classed("hidden", false);

									})
									.on("mouseout", function() {
									 d3.select(this).attr("r", 3);
									 //Hide the tooltip
									 d3.select("#tooltip")
									 .classed("hidden", true);
									});
        svg.selectAll("path")
                     .data(nestedData)
                     .transition()
                     .duration(1000)
                     .delay(200)
                     .style("stroke", function(d) { return colorScale( d.key ); } )
                     .attr("d", function(d) { return lineGen(d.values) } );

                     //Update X axis
                    svg.select(".x.axis")
                        .transition()
                        .duration(1000)
                      .call(xAxis);

                    //Update Y axis
                    svg.select(".y.axis")
                        .transition()
                        .duration(1000)
                      .call(yAxis);
      };
      var update3 = function(){
        d3.select("#button").style("background", "teal");
        d3.select("#button4").style("background", "teal");
        d3.select("#button2").style("background","teal" );
        d3.select("#button3").style("background", "purple");

        xScale.domain(d3.extent(dataset, function(d) { return d.when; }));
        yScale.domain(d3.extent(dataset, function(d) { return d.level2; }));
        svg.selectAll("circle")
               .data(dataset)
               .transition()
               .duration(1000)
               .delay(200)
               .attr("cx", function(d) {
                  return xScale(d.when);
               })
               .attr("cy", function(d) {
                  return yScale(d.level2);
               });
					 svg.selectAll("circle").on("mouseover", function(d) {
								 d3.select(this).attr("r", 5);

								//Get this bar's x/y values, then augment for the tooltip
								var xPosition = parseFloat(d3.select(this).attr("cx")) +140 ;
								var yPosition = parseFloat(d3.select(this).attr("cy")) +50;

								//Update the tooltip position and value
								d3.select("#tooltip")
									.style("left", xPosition + "px")
									.style("top", yPosition + "px")
									.select("#value")
									.html("Percentage: "+d.level+"%"+ "<br/>"+"Male: "+ d.maleCategory3+ "%"+ "<br/>"+"Female: "+ d.femaleCategory3+ "%"+ "<br/>"+ " Province: "+d.symbol);


								//Show the tooltip
								d3.select("#tooltip").classed("hidden", false);

							 })
							 .on("mouseout", function() {
								d3.select(this).attr("r", 3);
								//Hide the tooltip
								d3.select("#tooltip")
								.classed("hidden", true);
							 });

        svg.selectAll("path")
                     .data(nestedData)
                     .transition()
                     .duration(1000)
                     .delay(200)
                     .style("stroke", function(d) { return colorScale( d.key ); } )
                     .attr("d", function(d) { return lineGen2(d.values) } );

                     //Update X axis
                    svg.select(".x.axis")
                        .transition()
                        .duration(1000)
                      .call(xAxis);

                    //Update Y axis
                    svg.select(".y.axis")
                        .transition()
                        .duration(1000)
                      .call(yAxis);
      };

      var update4 = function(){
        d3.select("#button").style("background", "teal");
        d3.select("#button4").style("background", "purple");
        d3.select("#button2").style("background","teal" );
        d3.select("#button3").style("background", "teal" );

        xScale.domain(d3.extent(dataset, function(d) { return d.when; }));
        yScale.domain(d3.extent(dataset, function(d) { return d.level3; }));
        svg.selectAll("circle")
               .data(dataset)
               .transition()
               .duration(1000)
               .delay(200)
               .attr("cx", function(d) {
                  return xScale(d.when);
               })
               .attr("cy", function(d) {
                  return yScale(d.level3);
               })
              ;
							svg.selectAll("circle").on("mouseover", function(d) {
										d3.select(this).attr("r", 5);

									 //Get this bar's x/y values, then augment for the tooltip
									 var xPosition = parseFloat(d3.select(this).attr("cx")) +140 ;
									 var yPosition = parseFloat(d3.select(this).attr("cy")) +50;

									 //Update the tooltip position and value
									 d3.select("#tooltip")
										 .style("left", xPosition + "px")
										 .style("top", yPosition + "px")
										 .select("#value")
										 .html("Percentage: "+d.level+"%"+ "<br/>"+"Male: "+ d.maleCategory3+ "%"+ "<br/>"+"Female: "+ d.femaleCategory3+ "%"+ "<br/>"+ " Province: "+d.symbol);


									 //Show the tooltip
									 d3.select("#tooltip").classed("hidden", false);

									})
									.on("mouseout", function() {
									 d3.select(this).attr("r", 3);
									 //Hide the tooltip
									 d3.select("#tooltip")
									 .classed("hidden", true);
									});
        svg.selectAll("path")
                     .data(nestedData)
                     .transition()
                     .duration(1000)
                     .delay(200)
                     .style("stroke", function(d) { return colorScale( d.key ); } )
                     .attr("d", function(d) { return lineGen3(d.values) } );

                     //Update X axis
                    svg.select(".x.axis")
                        .transition()
                        .duration(1000)
                      .call(xAxis);

                    //Update Y axis
                    svg.select(".y.axis")
                        .transition()
                        .duration(1000)
                      .call(yAxis);
      };
