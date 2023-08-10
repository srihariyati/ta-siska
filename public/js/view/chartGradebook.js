function showPersonalGradeChart(gradeData) {
    data = gradeData;
    console.log(data);

    //menentukan leabr dan tinggi svg
    var width = document.getElementById("PersonalGradeChart").clientWidth;
    var height = 400;

    //menentukan margin pembatas
    var margin = { top: 20, right: 50, bottom: 100, left: 5 };

    //membuat svg
    var svg = d3.select("#PersonalGradeChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var chart = svg.append('g')
        .attr("transform", "translate(" + (margin.left * 10) + "," + margin.top + ")");

    // Skala x (nilai huruf)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.itemname; }))
        .range([0, width])
        .padding(0.3);

    // Skala y (jumlah mahasiswa)
    var yScale = d3.scaleLinear()
        .domain([0, (d3.max(data, function(d) { return Math.max(d.graderaw, d.grademean); }) + 50)])
        .range([height, 0]);

    //menampilkan yAxis
    chart.append('g')
        .attr('class', 'y-axis')
        .transition()
        .duration(500) 
        .call(d3.axisLeft(yScale).ticks(5))
        .style("font-size", "16px");

    //menampilkan xAxis
    chart.append('g')
        .attr('class', 'x-axis')   
        .attr('transform', `translate(0, ${height})`)
        .transition()
        .duration(500) 
        .call(d3.axisBottom(xScale))
        .style("font-size", "16px")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)") //tulisan pada x axis miring 45 derajat
        .style("text-anchor", "end");

    //buat background grid
    chart.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize(-height, 0, 0)
            .tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke-opacity', 0.5);

    chart.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft()
            .scale(yScale)
            .tickSize(-width, 0, 0) // Set tickSize to 0 for removing the outline border
            .tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke-opacity', 0.5);

    //buat barchart untuk graderaw
    // Membuat barchart untuk graderaw
    
    chart.selectAll('.bar-graderaw')
        .attr("class","bar-raw")
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-graderaw') // chart.css
        .attr('x', function(d) { return xScale(d.itemname); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu itemname akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .transition() // Menerapkan transisi
        .duration(500)
        .delay(function(_, i) { return i * 100; })
        .attr('y', function(d) { return yScale(d.graderaw); })
        .attr('height', function(d) { return height - yScale(d.graderaw); })


    // Membuat barchart untuk grademean
    chart.selectAll('.bar-grademean')
        .attr("class","bar-mean")
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-grademean') //chart.css
        .attr('x', function(d) { return xScale(d.itemname) + xScale.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2)
        .attr('height', 0) // Mulai dengan tinggi 0
        .transition() // Menerapkan transisi
        .duration(200) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.grademean); })
        .attr('height', function(d) { return height - yScale(d.grademean); })

    //membuat text x axis
    svg.append('text')
        .attr('x', -((height - margin.left) / 2))
        .attr('y', margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Nilai')
        .style("font-size", "14px");

    //membuat text y axis
    chart.append('text')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height + margin.bottom - 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Tugas/Kuis')
        .style("font-size", "14px");

    //tooltip while hovering

    // Membuat elemen tooltip
    var tooltip = d3.select("#PersonalGradeChart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    chart.append('style').text(`
        .grid line {
            stroke-width: 0.2;
        }
        .tooltip {
            position: absolute;
            pointer-events: none;
            opacity: 0;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            transition: opacity 0.3s ease-in-out;
        }`);


         //menambahkan lagend
    // Tambahkan elemen SVG baru untuk legenda
    var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - margin.right -80) + "," + (margin.top + 10) + ")"); // Adjust the '120' for horizontal alignment

    // Buat persegi panjang merah
    legend.append("rect")
        .attr("x",0)
        .attr("y", 5)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 25)
        .attr("height", 25)
        .attr('class', 'bar-green') //chart.css


    legend.append("text")
        .attr("x", 30)
        .attr("y", 20) 
        .attr("alignment-baseline", "middle")
        .text("Nilai Mahasiwa")
        .style("font-size", "14px");

    // Buat persegi panjang hijau
    legend.append("rect")
        .attr("x",0)
        .attr("y", 35)
        .attr("rx",5)
        .attr("ry",5)
        .attr("width", 25)
        .attr("height", 25)
        .attr('class', 'bar-grademean') //chart.css


    legend.append("text")
        .attr("x", 30)
        .attr("y", 50) 
        .attr("alignment-baseline", "middle")
        .text("Nilai Rata-rata")
        .style("font-size", "14px");



         // buat brush untuk user filter data
    var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("end", brushed);

// Append the brush to the chart
var brushArea = chart.append("g")
    .attr("class", "brush")
    .call(brush);

function brushed(event) {
    if (!event.selection) return; // Ignore brush deselection
    var selectedRange = event.selection;
    var selectedData = data.filter(function(d) {
        return (selectedRange[0] <= xScale(d.itemname)) && (xScale(d.itemname) <= selectedRange[1]);
    });
    
    //jika user tidak berhasil select data
    if (selectedData.length != 0 ){
        focusBar(data, selectedData, width, height, chart, margin,svg);
    } else{
        $('#chartQuizQues').empty();
        showPersonalGradeChart(data);
    }

    console.log(selectedData);
}



 //buat barchart untuk graderaw
    // Membuat barchart untuk graderaw
    chart.selectAll('.bar-raw') //call class
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-graderaw') // chart.css
        .attr('x', function(d) { return xScale(d.itemname); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu itemname akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`${d.itemname}<br/><strong>Nilai Mahasiswa: ${d.graderaw}</strong>`)
                .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
                .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
                .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
                .style("color", "black") // Set text color to black
                .style("z-index", 1) // Set higher z-index to appear in front
                .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
                .style("font-size", "14px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        })
        .transition() // Menerapkan transisi
        .duration(200)
        .delay(function(_, i) { return i * 100; })
        .attr('y', function(d) { return yScale(d.graderaw); })
        .attr('height', function(d) { return height - yScale(d.graderaw); })
        //jika sudah selesai load semua bar tampilkan nilai diatas bar
        .on('end', function(_, i) {
            if (i === data.length - 1) {
                chart.selectAll(".label-grade-raw")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("class", "text-above-raw")                   
                    .attr("x", function(d) { return xScale(d.itemname) + xScale.bandwidth() / 4; })
                    .attr("y", function(d) { return yScale(d.graderaw) - 9; })
                    .attr("transform", function(d) {
                        return `rotate(-90 ${xScale(d.itemname) + xScale.bandwidth() / 4},${yScale(d.graderaw) - 10})`;
                    }) // Rotate the text
                    .transition() // Menerapkan transisi
                    .duration(1000) // Durasi transisi dalam milidetik
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("fill", "black")
                    .text(function(d) { return d.graderaw; });                
            }
        });

    // Membuat barchart untuk grademean
    chart.selectAll('.bar-mean') //calll class
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-grademean') //chart.css
        .attr('x', function(d) { return xScale(d.itemname) + xScale.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2)
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`${d.itemname}<br/><strong>Nilai Rata-rata: ${d.grademean}</strong>`)
                .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
                .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
                .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
                .style("color", "black") // Set text color to black
                .style("z-index", 1) // Set higher z-index to appear in front
                .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
                .style("font-size", "14px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        })
        .transition() // Menerapkan transisi
        .duration(200) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.grademean); })
        .attr('height', function(d) { return height - yScale(d.grademean); })
        .on('end', function(_, i) {
            if (i === data.length - 1) {
                 // Add text labels for grades above each bar
                 chart.selectAll(".label-grade-mean")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("class", "text-above-mean")
                    .attr("x", function(d) { return xScale(d.itemname) + xScale.bandwidth(); })
                    .attr("y", function(d) { return yScale(d.grademean) + 9 })
                    .attr("transform", function(d) {
                        return `rotate(-90 ${xScale(d.itemname) + xScale.bandwidth() / 4},${yScale(d.grademean) - 10})`;
                    }) // Rotate the text
                    .transition()
                    .duration(1000)
                    .attr("text-anchor", "end")
                    .style("font-size", "12px")
                    .style("fill", "black")
                    .text(function(d) { return d.grademean; });
            }
        });

    

}

function focusBar(data, filteredData, width, height, chart, margin, svg){
    console.log("focusbar");
    // Create the 'esc' group for the icon
   var esc = chart.append("g")
   .attr("class", "iconesc")
   .attr("transform", "translate(" + (width - margin.right - 1050) + "," + (margin.top-10) + ")"); // Adjust the x and y position as needed

    // Append a 'foreignObject' to the 'esc' group
    var foreignObject = esc.append("foreignObject")
        .attr("width", 64) // Set the width of the foreignObject to accommodate the icon
        .attr("height", 64)
        .style("cursor", "pointer") // Change the cursor on hover to indicate interactivity
        .on("click", function() {
            $('#PersonalGradeChart').empty();          
            //kembalikan ke data semula
            showPersonalGradeChart(data);
        }); 

    // Append the icon using regular HTML within the 'foreignObject'
    foreignObject
        .html('<span class="btn-esc"><button type="button" class="btn btn-secondary fa-1x btn-sm"><i class="bi bi-arrows-fullscreen"></i></button></span>');
        // Add the onclick action to the button with the ID "btn-esc" using D3.js

 // Skala x (nilai huruf)
 var xScaleB = d3.scaleBand()
 .domain(filteredData.map(function(d) { return d.itemname; }))
 .range([0, width])
 .padding(0.3);

// Skala y (jumlah mahasiswa)
var yScaleB = d3.scaleLinear()
 .domain([0, (d3.max(filteredData, function(d) { return Math.max(d.graderaw, d.grademean); }) + 50)])
 .range([height, 0]);


// Update the Y axis
chart.select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(yScaleB).ticks(5));

  // Update the X axis
  chart.select(".x-axis")
      .transition()
      .duration(500)
      .call(d3.axisBottom(xScaleB));   

    // Select all existing bars and remove them
    chart.selectAll("rect")
    .remove();

    chart.selectAll(".text-above-raw")
        .remove();
     //buat barchart untuk graderaw
    // Membuat barchart untuk graderaw
    chart.selectAll('.bar-graderaw')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-graderaw') // chart.css
        .attr('x', function(d) { return xScaleB(d.itemname); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScaleB.bandwidth() / 2) //per dua karena dalam satu itemname akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`${d.itemname}<br/><strong>Nilai Mahasiswa: ${d.graderaw}</strong>`)
                .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
                .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
                .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
                .style("color", "black") // Set text color to black
                .style("z-index", 1) // Set higher z-index to appear in front
                .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
                .style("font-size", "14px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        })
        .transition() // Menerapkan transisi
        .duration(500)
        .delay(function(_, i) { return i * 100; })
        .attr('y', function(d) { return yScaleB(d.graderaw); })
        .attr('height', function(d) { return height - yScaleB(d.graderaw); })
        .on('end', function(_, i) {
            if (i === filteredData.length - 1) {
                chart.selectAll(".label-grade-raw")
                    .data(filteredData)
                    .enter()
                    .append("text")
                    .attr("class", "text-above-raw")                   
                    .attr("x", function(d) { return xScaleB(d.itemname) + xScaleB.bandwidth() / 4; })
                    .attr("y", function(d) { return yScaleB(d.graderaw) - 10; })
                    .transition() // Menerapkan transisi
                    .duration(1000) // Durasi transisi dalam milidetik
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("fill", "black")
                    .text(function(d) { return d.graderaw; });                
            }
        });

    chart.selectAll(".text-above-mean")
            .remove();
    // Membuat barchart untuk grademean
    chart.selectAll('.bar-grademean')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-grademean') //chart.css
        .attr('x', function(d) { return xScaleB(d.itemname) + xScaleB.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScaleB.bandwidth() / 2)
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`${d.itemname}<br/><strong>Nilai Rata-rata: ${d.grademean}</strong>`)
                .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
                .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
                .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
                .style("color", "black") // Set text color to black
                .style("z-index", 1) // Set higher z-index to appear in front
                .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
                .style("font-size", "14px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        })
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScaleB(d.grademean); })
        .attr('height', function(d) { return height - yScaleB(d.grademean); })
        .on('end', function(_, i) {
            if (i === filteredData.length - 1) {
                chart.selectAll(".label-grade-mean")
                    .data(filteredData)
                    .enter()
                    .append("text")
                    .attr("class", "text-above-mean")                   
                    .attr("x", function(d) { return xScaleB(d.itemname) + xScaleB.bandwidth()*0.75; })
                    .attr("y", function(d) { return yScaleB(d.grademean) - 10 })
                    .transition() // Menerapkan transisi
                    .duration(1000) // Durasi transisi dalam milidetik
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("fill", "black")
                    .text(function(d) { return d.grademean;}); 
                 
            }
        });



        // Membuat elemen tooltip
    var tooltip = d3.select("#PersonalGradeChart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


chart.append('style').text(`
    .grid line {
        stroke-width: 0.2;
    }
    .tooltip {
        position: absolute;
        pointer-events: none;
        opacity: 0;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        transition: opacity 0.3s ease-in-out;
    }`);



}