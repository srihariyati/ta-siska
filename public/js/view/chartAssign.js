const gradeColors = {
    'A': 'rgba(34, 115, 98, 1)', // Green
    'AB': 'rgba(74, 189, 165, 1)', //green
    'B': 'rgba(255, 175, 16, 1)', //yellow
    'BC': 'rgba(255, 217, 143, 1)', //yellow
    'C': 'rgba(255, 217, 217, 1)', // pink
    'D': 'rgba(255, 0, 0, 1)',//red
    'E': 'rgba(204, 43, 43, 1)'//red
  };
function chartParticipant(courseParticipant, submittedParticipant, assignTitle) {
    console.log("chart participant");

    var persentase = ((submittedParticipant / courseParticipant) * 100).toFixed(2);;

    // Data persentase
    var data = [persentase]; // Misalnya, 50% loading

    // Mengambil lebar maksimum dari elemen dengan id "chartParticipant"
    var maxWidth = document.getElementById("chartParticipant").clientWidth;
    var height = 30;

    // Menghitung lebar batang berdasarkan persentase
    var barWidth = function(d) {
        return maxWidth * (d / 100);
    };

    // Membuat elemen SVG
    var svg = d3.select("#chartParticipant")
        .append("svg")
        .attr("width", maxWidth)
        .attr("height", height);

    // Membuat elemen latar belakang
    var background = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", maxWidth) // Lebar penuh
        .attr("height", height)
        .attr("rx", 10) // Radius sudut horizontal
        .attr("ry", 10) // Radius sudut vertikal
        .style("fill", "lightgray"); // Warna latar belakang

    // Membuat elemen batang dengan sudut melengkung
    var bar = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0) // Awalnya lebar 0
        .attr("height", height)
        .attr("rx", 10) // Radius sudut horizontal
        .attr("ry", 10) // Radius sudut vertikal
        .style("fill", function(d) {
            if (data[0] >= 50) {
                return "#227362"; // Warna batang saat persentase terpenuhi
            } else {
                return "lightgray"; // Warna batang saat persentase tidak terpenuhi
            }
        });

    // Animasi perubahan lebar batang
    bar.transition()
        .duration(1000) // Durasi animasi (ms)
        .attr("width", barWidth(data[0])); // Lebar batang sesuai dengan persentase

    // Menambahkan label persentase
    svg.append("text")
        .attr("x", function() {
            if (data[0] >= 50) {
                return barWidth(data[0]) - 5; // Menggeser teks ke ujung bar saat persentase terpenuhi
            } else {
                return 5; // Menggeser teks ke ujung kiri saat persentase tidak terpenuhi
            }
        })
        .attr("y", height / 2)
        .attr("text-anchor", function() {
            if (data[0] >= 50) {
                return "end"; // Teks persentase berada di ujung kanan saat persentase terpenuhi
            } else {
                return "start"; // Teks persentase berada di ujung kiri saat persentase tidak terpenuhi
            }
        })
        .attr("alignment-baseline", "middle")
        .style("fill", function(d) {
            if (data[0] >= 50) {
                return "white"; // Warna teks saat persentase terpenuhi
            } else {
                return "gray"; // Warna teks saat persentase tidak terpenuhi
            }
        })
        .style("font-size", "16px")
        .text(data[0] + "%");

    var descChart = '<p>' + data + '% dari mahasiswa telah mengumpulkan ' + assignTitle + '</p>'
    $('#chartParticipant').append(descChart);

}

function chartAssign(data) {    
    //sorting dari ABC
    data.sort((a, b) => a.grade.localeCompare(b.grade));
    console.log(data);

    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartGradeAssignment").clientWidth - 100;
    var height = document.getElementById("chartGradeAssignment").clientWidth / 1.5 - margin.top - margin.bottom;
    console.log(width);
    var data = data;
    // Membuat elemen SVG
    var svg = d3.select("#chartGradeAssignment")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var chart = svg.append('g')
        .attr("transform", "translate(" + (margin.left * 10) + "," + margin.top + ")");

    // Skala x (nilai huruf)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.grade; }))
        .range([0, width])
        .padding(0.1);

    // Skala y (jumlah mahasiswa)
    var yScale = d3.scaleLinear()
        .domain([0, (d3.max(data, function(d) { return d.jumlah; }) + 5)])
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
        .style("font-size", "16px");


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


    // Membuat elemen batang
    chart.selectAll("rect")
        .attr("class","bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr("x", function(d) { return xScale(d.grade); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr("width", xScale.bandwidth())
        .attr('height', 0) // Mulai dengan tinggi 0
        .attr("fill", function(d) {
            return gradeColors[d.grade];
        })
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`<strong>Grade: ${d.grade}</strong><br/>${d.jumlah} Mahasiswa`)
                .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
                .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
                .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
                .style("color", "black") // Set text color to black
                .style("z-index", 1) // Set higher z-index to appear in front
                .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
                .style("font-size", "12px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        })
        .transition() // Menerapkan transisi
        .duration(1000)
        .delay(function(_, i) { return i * 100; })
        .attr("y", function(d) { return yScale(d.jumlah); })
        .attr("height", function(d) { return height - yScale(d.jumlah); });

         // Penundaan transisi untuk setiap elemen; // Durasi transisi dalam milidetik;


    // Membuat elemen tooltip
    var tooltip = d3.select("#chartGradeAssignment")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //membuat text axis
    svg.append('text')
        .attr('x', -((height - margin.left) / 2))
        .attr('y', margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Jumlah Mahasiswa')
        .style("font-size", "12px");

    chart.append('text')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height + margin.bottom - 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Nilai (Grades)')
        .style("font-size", "12px");

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
        var selectedGrades = xScale.domain().filter(function(d) {
            return (selectedRange[0] <= xScale(d)) && (xScale(d) <= selectedRange[1]);
        
        });
        // Filter the data based on the selected grades
        var filteredData = data.filter(function(d) {
            return selectedGrades.includes(d.grade);
        });

        console.log(filteredData);

        //jika user tidak berhasil select data
        if (filteredData.length != 0 ){
            focusBarAssign(data, filteredData, width, height, chart, margin,svg,gradeColors);
        } else{
            $('#chartGradeAssignment').empty();
            chartAssign(data);
        }
    }

    legendChartAssignment(data);
    

   // Membuat elemen batang
   chart.selectAll("bar")
   .data(data)
   .enter()
   .append("rect")
   .attr("ry", 5) // Radius sudut vertikal
   .attr("rx", 5) // Radius sudut vertikal
   .attr("x", function(d) { return xScale(d.grade); })
   .attr('y', height) // Mulai dari posisi bawah chart
   .attr("width", xScale.bandwidth())
   .attr('height', 0) // Mulai dengan tinggi 0
   .attr("fill", function(d) {
        return gradeColors[d.grade];
    })
   .on("mouseover", function(event, d) { // Pass the event object as the first argument
       // Show tooltip
       var mouseCoords = d3.pointer(event, this);
       var mouseX = mouseCoords[0];
       var mouseY = mouseCoords[1];

       tooltip.style("opacity", 1)
           .html(`<strong>Grade: ${d.grade}</strong><br/>${d.jumlah} Mahasiswa`)
           .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
           .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
           .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
           .style("color", "black") // Set text color to black
           .style("z-index", 1) // Set higher z-index to appear in front
           .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
           .style("font-size", "12px");
   })
   .on("mouseout", function(d) {
       // Hide tooltip
       tooltip.style("opacity", 0);
   })
   .transition() // Menerapkan transisi
   .duration(1000)
   .delay(function(_, i) { return i * 100; })
   .attr("y", function(d) { return yScale(d.jumlah); })
   .attr("height", function(d) { return height - yScale(d.jumlah); });

   // tambahkan nilai diatas barchart
   chart.selectAll(".grade-label")
   .data(data)
   .enter()
   .append("text")
   .attr("class", "text-above")
   .transition() // Menerapkan transisi
   .duration(500) // Durasi transisi dalam milidetik
   .attr("x", function(d) { return xScale(d.grade) + xScale.bandwidth() / 2; })
   .attr("y", function(d) { return yScale(d.jumlah)-10; })
   .attr("text-anchor", "middle")
   .style("font-size", "12px")
   .style("fill", "black")
   .text(function(d) { return d.jumlah; });






}

function focusBarAssign(data, filteredData, width, height, chart, margin,svg,gradeColors){
    $('#lagendGradeAssignment').empty()

// Create the 'esc' group for the icon
var esc = svg.append("g")
.attr("class", "iconesc")
.attr("transform", "translate(" + (width - margin.right - 480) + "," + (margin.top + 10) + ")"); // Adjust the x and y position as needed

// Append a 'foreignObject' to the 'esc' group
var foreignObject = esc.append("foreignObject")
 .attr("width", 64) // Set the width of the foreignObject to accommodate the icon
 .attr("height", 64)
 .style("cursor", "pointer") // Change the cursor on hover to indicate interactivity
 .on("click", function() {

     $('#chartGradeAssignment').empty();
     //kembalikan ke data semula
     $('#lagendGradeAssignment').empty()
     chartAssign(data);
 }); 

// Append the icon using regular HTML within the 'foreignObject'
foreignObject
 .html('<span class="btn-esc"><button type="button" class="btn btn-outline-secondary fa-1x btn-sm"><i class="bi bi-arrows-fullscreen"></i></button></span>');
 // Add the onclick action to the button with the ID "btn-esc" using D3.js


// Skala x (nilai huruf)
var xScaleB = d3.scaleBand()
 .domain(filteredData.map(function(d) { return d.grade; }))
 .range([0, width])
 .padding(0.1);

// Skala y (jumlah mahasiswa)
var yScaleB = d3.scaleLinear()
 .domain([0, (d3.max(filteredData, function(d) { return d.jumlah; }) + 5)])
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

 // Membuat elemen batang
 chart.selectAll("rect")
 .data(filteredData)
 .enter()
 .append("rect")
 .attr("ry", 5) // Radius sudut vertikal
 .attr("rx", 5) // Radius sudut vertikal
 .attr("x", function(d) { return xScaleB(d.grade); })
 .attr('y', height) // Mulai dari posisi bawah chart
 .attr("width", xScaleB.bandwidth())
 .attr('height', 0) // Mulai dengan tinggi 0
 .attr("fill", function(d) {
    return gradeColors[d.grade];
})
 .on("mouseover", function(event, d) { // Pass the event object as the first argument
     // Show tooltip
     var mouseCoords = d3.pointer(event, this);
     var mouseX = mouseCoords[0];
     var mouseY = mouseCoords[1];

     tooltip.style("opacity", 1)
         .html(`<strong>Grade: ${d.grade}</strong><br/>${d.jumlah} Mahasiswa`)
         .style("left", (mouseX + 20) + "px") // Position tooltip relative to mouse X-coordinate
         .style("top", (mouseY + 20) + "px") // Position tooltip relative to mouse Y-coordinate
         .style("background-color", "rgba(255, 255, 255, 0.8)") // Set background color to 50% white
         .style("color", "black") // Set text color to black
         .style("z-index", 1) // Set higher z-index to appear in front
         .style("box-shadow", "0 1px 4px rgba(0, 0, 0, 0.5)") // Add box-shadow effect
         .style("font-size", "12px");
 })
 .on("mouseout", function(d) {
     // Hide tooltip
     tooltip.style("opacity", 0);
 })
 .transition() // Menerapkan transisi
 .duration(1000)
 .delay(function(_, i) { return i * 100; })
 .attr("y", function(d) { return yScaleB(d.jumlah); })
 .attr("height", function(d) { return height - yScaleB(d.jumlah); });


 legendChartAssignment(filteredData);

  // Penundaan transisi untuk setiap elemen; // Durasi transisi dalam milidetik;
  chart.selectAll(".text-above")
  .remove();

// tambahkan nilai diatas barchart
chart.selectAll(".text-above")
    .data(filteredData)
    .enter()
    .append("text")
    .transition() // Menerapkan transisi
    .duration(500) // Durasi transisi dalam milidetik
    .attr("x", function(d) { return xScaleB(d.grade) + xScaleB.bandwidth() / 2; })
    .attr("y", function(d) { return yScaleB(d.jumlah)-10; })
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "black")
    .text(function(d) { return d.jumlah; });

// Membuat elemen tooltip
var tooltip = d3.select("#chartGradeAssignment")
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

function legendChartAssignment(data) {

    console.log(data);
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartGradeAssignment").clientWidth - 100;
    var height = document.getElementById("chartGradeAssignment").clientWidth / 1.5 - margin.top - margin.bottom;

    console.log(width);
    // Define the legend colors based on grades
    
      const gradeLagend = {
        'A': 'A >= 87', // Green
        'AB': '78 <= AB < 87  ', //green
        'B': '69 <= B < 78  ', //yellow
        'BC': '60 <= BC < 69  ', //yellow
        'C': '51 <= C < 60 ', // Red
        'D': '41 <= D <51',//red
        'E': 'E < 41',//red
      };


    // Create a new SVG element for the legend
    var svg = d3.select("#lagendGradeAssignment")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Create a legend group
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(10, ' + margin.top + ')'); // Apply the top margin

    // Bind the data to the legend group
    var legendItems = legend.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
            var x = 0; // Align all the rectangles at x = 0
            var y = i * 50; // Adjust the vertical spacing between legend items (rectangles)
            return 'translate(' + x + ', ' + y + ')';
        });

    // Add a square box to each legend item
    legendItems.append('rect')
        .attr('width', 30) // Adjust the width of the square box
        .attr('height', 30) // Adjust the height of the square box
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', function(d) {
            return gradeColors[d.grade];
        })

    // Add text labels to each legend item
    legendItems.append('text')
        .attr('x', 50) // Adjust the horizontal position of the text label
        .attr('y', 20) // Adjust the vertical position of the text label
        .text(function(d) {
            return gradeLagend[d.grade];
        })
        .style('font-size', '14px');
}