function chartQuizGrades(data) {
    //console.log(data);
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizGrades").clientWidth;
    var height = document.getElementById("chartQuizGrades").clientWidth / 1.2 - margin.top - margin.bottom;
    //console.log(width);

    var data = data;
    // Membuat elemen SVG
    var svg = d3.select("#chartQuizGrades")
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
        .domain([0, (d3.max(data, function(d) { return d.jumlah; }) + 10)])
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

    // Membuat elemen batang untuk proses brushing
    //elemen ini yang akan dipilih pada saat select brush (focusbar)
    //elemen akan dioverlay dengan brush
    chart.selectAll("rect")
        .attr("class","bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr("x", function(d) { return xScale(d.grade); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth())
        .attr('height', 0) // Mulai dengan tinggi 0
        .attr("class", function(d) { //set fill in chart.css
            if (d.grade > 50) {
                return "bar-green";
            } else {
                return "bar-red";
            }
        })
        .transition() // Menerapkan transisi
        .duration(1000) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.jumlah); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.jumlah); }); // Mengubah tinggi elemen menjadi yang diinginkan

    // Membuat elemen tooltip
    var tooltip = d3.select("#chartQuizGrades")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //membuat text axis
    svg.append('text')
        .attr('x', -(height - margin.bottom-margin.top) / 2-(3*margin.top))
        .attr('y', margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Jumlah Mahasiswa')
        .style("font-size", "15px");

    chart.append('text')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height + margin.bottom - 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Nilai')
        .style("font-size", "15px");

    //menambahkan lagend
    // Tambahkan elemen SVG baru untuk legenda
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - margin.right -120) + "," + (margin.top + 20) + ")"); // Adjust the '120' for horizontal alignment

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
        .text("Nilai > 50")
        .style("font-size", "14px");

    // Buat persegi panjang hijau
    legend.append("rect")
        .attr("x",110)
        .attr("y", 5)
        .attr("rx",5)
        .attr("ry",5)
        .attr("width", 25)
        .attr("height", 25)
        .attr('class', 'bar-red') //chart.css


    legend.append("text")
        .attr("x", 140)
        .attr("y", 20) 
        .attr("alignment-baseline", "middle")
        .text("Nilai <50")
        .style("font-size", "14px");

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

        //console.log(filteredData);

        // Log the selected data to the console
        var selectedData = filteredData.map(function(d) {
            return { grade: d.grade, jumlah: d.jumlah };
        });


        //jika user tidak berhasil select data
        if (filteredData.length != 0 ){
            focusBarGrade(data, filteredData, width, height, chart, margin,svg);
        } else{
            $('#chartQuizGrades').empty();
            chartQuizGrades(data);
        }
        
    }
    
    ///###############
    //yang tampil pada user adalah chart ini
    //timpa rect sebelumnya agar bisa di hovering
    //chartsebelumnya sudah teroverlay dengan brush
      // Skala x (nilai huruf)
    // var xScaleA = d3.scaleBand()
    //     .domain(data.map(function(d) { return d.grade; }))
    //     .range([0, width])
    //     .padding(0.1);

    // // Skala y (jumlah mahasiswa)
    // var yScaleA = d3.scaleLinear()
    //     .domain([0, (d3.max(data, function(d) { return d.jumlah; }) + 5)])
    //     .range([height, 0]);

     // Membuat elemen batang
     chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr("x", function(d) { return xScale(d.grade); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth())
        .attr('height', 0) // Mulai dengan tinggi 0
        .attr("class", function(d) { //set fill in chart.css
            if (d.grade > 50) {
                return "bar-green"; //merah transparant //rgba of hex #227362 //0 agar transparant
            } else {
                return "bar-red"; //merah transparant // rgba of hex #FF0000
            }
        })
        .on("mouseover", function(event, d) { // Pass the event object as the first argument //0 agar transparant
            // Show tooltip
            var mouseCoords = d3.pointer(event);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            //console.log(mouseX);

            tooltip.style("opacity", 1)
                .html(`<strong>Nilai: ${d.grade}</strong><br/>${d.jumlah} Mahasiswa`)
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
        .duration(1000) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.jumlah); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.jumlah); }); // Mengubah tinggi elemen menjadi yang diinginkan

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

function focusBarGrade(data, filteredData, width, height, chart, margin,svg){        
        // Create the 'esc' group for the icon
        var esc = svg.append("g")
            .attr("class", "iconesc")
            .attr("transform", "translate(" + (width - margin.right - 430) + "," + (margin.top + 10) + ")"); // Adjust the x and y position as needed

        // Append a 'foreignObject' to the 'esc' group
        var foreignObject = esc.append("foreignObject")
            .attr("width", 64) // Set the width of the foreignObject to accommodate the icon
            .attr("height", 64)
            .style("cursor", "pointer") // Change the cursor on hover to indicate interactivity
            .on("click", function() {

                $('#chartQuizGrades').empty();
                //kembalikan ke data semula
                chartQuizGrades(data);
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
            .domain([0, (d3.max(filteredData, function(d) { return d.jumlah; }) + 10)])
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

           //update bar
            chart.selectAll("rect")
                .data(filteredData)
                .enter()
                .append("rect")
                .attr("ry", 5) // Radius sudut vertikal
                .attr("rx", 5) // Radius sudut vertikal
                .attr("x", function(d) { return xScaleB(d.grade); })
                .attr('y', height) // Mulai dari posisi bawah chart
                .attr('width', xScaleB.bandwidth())
                .attr('height', 0) // Mulai dengan tinggi 0
                .attr("class", function(d) { //set fill in chart.css
                    if (d.grade > 50) {
                        return "bar-green";
                    } else {
                        return "bar-red";
                    }
                })
                .on("mouseover", function(event, d) { // Pass the event object as the first argument
                    // Show tooltip
                    var mouseCoords = d3.pointer(event, this);
                    var mouseX = mouseCoords[0];
                    var mouseY = mouseCoords[1];

                    tooltip.style("opacity", 1)
                        .html(`<strong>Nilai: ${d.grade}</strong><br/>${d.jumlah} Mahasiswa`)
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
                .duration(1000) // Durasi transisi dalam milidetik
                .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
                .attr('y', function(d) { return yScaleB(d.jumlah); }) // Menggeser elemen ke posisi vertikal yang tepat
                .attr('height', function(d) { return height - yScaleB(d.jumlah); }); // Mengubah tinggi elemen menjadi yang diinginkan

                // Membuat elemen tooltip
                var tooltip = d3.select("#chartQuizGrades")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


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

function chartQuizQues(data) {
    //console.log(data);
    var countmhs = data[0]['incorrect'] + data[0]['correct'];

    ////console.log(((data[0]['correct']/countmhs)*100).toFixed(2)+'%');
    var countQues = data.length;
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizQues").clientWidth;
    var height = document.getElementById("chartQuizQues").clientWidth / 1.5 - margin.top - margin.bottom;
    //console.log(width);

    // Membuat elemen SVG
    var svg = d3.select("#chartQuizQues")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var chart = svg.append('g')
        .attr("transform", "translate(" + (margin.left * 10) + "," + margin.top + ")");

    // Skala x (nilai huruf)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.slot; }))
        .range([0, width])
        .padding(0.3);

    // Skala y (jumlah mahasiswa)
    var yScale = d3.scaleLinear()
        .domain([0, (d3.max(data, function(d) { return Math.max(d.correct, d.incorrect); }) + 10)])
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

    //  buat barchart untuk t
    // Membuat barchart untuk t
    chart.selectAll('.bar-t')
        .attr("class","bar-t-green")
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-green') // chart.css
        .attr('x', function(d) { return xScale(d.slot); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.correct); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.correct); }); // Mengubah tinggi elemen menjadi yang diinginkan


    // Membuat barchart untuk f
    chart.selectAll('.bar-f')
        .attr("class","bar-f-red")
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-red') //chart.css
        .attr('x', function(d) { return xScale(d.slot) + xScale.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart *untuk transisi
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart *untuk transisi
        .attr('height', 0) // Mulai dengan tinggi 0 *untuk transisi
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.incorrect); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.incorrect); }); // Mengubah tinggi elemen menjadi yang diinginkan


    //membuat text x axis
    svg.append('text')
        .attr('x', -(height - margin.bottom-margin.top) / 2-(3*margin.top))
        .attr('y', margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Jumlah Mahasiswa')
        .style("font-size", "15px");

    //membuat text y axis
    chart.append('text')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height + margin.bottom - 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Pertanyaan')
        .style("font-size", "15px");

    //tooltip while hovering

    // Membuat elemen tooltip
    var tooltip = d3.select("#chartQuizQues")
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
        .attr("transform", "translate(" + (width - margin.right -80) + "," + (margin.top + 20) + ")"); // Adjust the '120' for horizontal alignment

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
        .text("Benar")
        .style("font-size", "14px");

    // Buat persegi panjang hijau
    legend.append("rect")
        .attr("x",90)
        .attr("y", 5)
        .attr("rx",5)
        .attr("ry",5)
        .attr("width", 25)
        .attr("height", 25)
        .attr('class', 'bar-red') //chart.css


    legend.append("text")
        .attr("x", 120)
        .attr("y", 20) 
        .attr("alignment-baseline", "middle")
        .text("Salah")
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
        var selectedQuestions = data.filter(function(d) {
            return (selectedRange[0] <= xScale(d.slot)) && (xScale(d.slot) <= selectedRange[1]);
        });
        
        //jika user tidak berhasil select data
        if (selectedQuestions.length != 0 ){
            focusBarQues(data, selectedQuestions,countmhs, width, height, chart, margin,svg);
        } else{
            $('#chartQuizQues').empty();
            chartQuizQues(data);
        }

        //console.log(selectedQuestions);
    }


    //buat barchart yang bisa dihover
    // Membuat barchart untuk t
    chart.selectAll('bar-t-green')
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-green') // chart.css
        .attr('x', function(d) { return xScale(d.slot); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // // Show tooltip
            var mouseCoords = d3.pointer(event);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            //console.log(mouseX);

            var percentgrade = ((d.correct/countmhs)*100).toFixed(2);

            tooltip.style("opacity", 1)
                .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.correct} Mahasiswa <br>(${percentgrade}%) </strong>`)
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
        .attr('y', function(d) { return yScale(d.correct); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.correct); }); // Mengubah tinggi elemen menjadi yang diinginkan

    // Add text labels for grades above each bar
    chart.selectAll(".grade-label-t")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "text-above-t")
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .attr("x", function(d) { return xScale(d.slot) + xScale.bandwidth() / 4; })
        .attr("y", function(d) { return yScale(d.correct) - 10; })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "black")
        .text(function(d) { return d.correct; });


    // Membuat barchart untuk f
    chart.selectAll('bar-f-red')
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-red') //chart.css
        .attr('x', function(d) { return xScale(d.slot) + xScale.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart *untuk transisi
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart *untuk transisi
        .attr('height', 0) // Mulai dengan tinggi 0 *untuk transisi
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            var percentgrade = ((d.incorrect/countmhs)*100).toFixed(2);

            tooltip.style("opacity", 1)
            .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.incorrect} Mahasiswa <br>(${percentgrade}%) </strong>`)
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
        .attr('y', function(d) { return yScale(d.incorrect); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.incorrect); }); // Mengubah tinggi elemen menjadi yang diinginkan

    // Add text labels for grades above each bar
    chart.selectAll(".grade-label-f")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "text-above-f")
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .attr("x", function(d) { return xScale(d.slot) + xScale.bandwidth()*0.75; })
        .attr("y", function(d) { return yScale(d.incorrect) - 10; })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "black")
        .text(function(d) { return d.incorrect; });  


    
    //#####################################
    //menghitung persentase rata-rata 
    //looping untuk data didalam array
    let totalPercentageCorrect = 0;
    data.forEach((d, index) => {
        const correctValue = d.correct;
        const incorrectValue = d.incorrect;
        const total = correctValue + incorrectValue;
        const percentageCorrect = (correctValue / total) * 100;
        totalPercentageCorrect += percentageCorrect;
      });
      const averagePercentageCorrect = (totalPercentageCorrect / (data.length)).toFixed(2);
      //console.log(averagePercentageCorrect);
      
    //append to #descQues
    var descQues = '<p> <strong>' + countQues + ' Pertanyaan</strong></p><p class = "mb-0" > Persentase mahasiswa menjawab dengan benar</p><p class = "mt-0"> <strong> '+averagePercentageCorrect+'% </strong></p>';
    $('#descQuizQues').append(descQues);

}

function focusBarQues(data, filteredData,countmhs, width, height, chart, margin, svg){   
    //console.log("focusbar");
     // Create the 'esc' group for the icon
    var esc = svg.append("g")
    .attr("class", "iconesc")
    .attr("transform", "translate(" + (width - margin.right - 580) + "," + (margin.top + 10) + ")"); // Adjust the x and y position as needed

 // Append a 'foreignObject' to the 'esc' group
 var foreignObject = esc.append("foreignObject")
     .attr("width", 64) // Set the width of the foreignObject to accommodate the icon
     .attr("height", 64)
     .style("cursor", "pointer") // Change the cursor on hover to indicate interactivity
     .on("click", function() {
         $('#descQuizQues').empty();
         $('#chartQuizQues').empty();
         //kembalikan ke data semula
         chartQuizQues(data);
     }); 

 // Append the icon using regular HTML within the 'foreignObject'
 foreignObject
     .html('<span class="btn-esc"><button type="button" class="btn btn-outline-secondary fa-1x btn-sm"><i class="bi bi-arrows-fullscreen"></i></button></span>');
     // Add the onclick action to the button with the ID "btn-esc" using D3.js
 

 // Skala x (nilai huruf)
 var xScale = d3.scaleBand()
    .domain(filteredData.map(function(d) { return d.slot; }))
    .range([0, width])
    .padding(0.1);

 // Skala y (jumlah mahasiswa)
 var yScale = d3.scaleLinear()
    .domain([0, (d3.max(filteredData, function(d) { return Math.max(d.correct, d.incorrect); }) + 10)])
     .range([height, 0]);

    // Update the Y axis
    chart.select(".y-axis")
     .transition()
     .duration(500)
     .call(d3.axisLeft(yScale).ticks(5));

    // Update the X axis
    chart.select(".x-axis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale));        

    // Select all existing bars and remove them
    chart.selectAll("rect")
        .remove();

    chart.selectAll('.bar-t')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-green') // chart.css
        .attr('x', function(d) { return xScale(d.slot); })
        .attr('y', height) // Mulai dari posisi bawah chart
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart
        .attr('height', 0) // Mulai dengan tinggi 0
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // // Show tooltip
            var mouseCoords = d3.pointer(event);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            //console.log(mouseX);

            var percentgrade = ((d.correct/countmhs)*100).toFixed(2);

            tooltip.style("opacity", 1)
                .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.correct} Mahasiswa <br>(${percentgrade}%) </strong>`)
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
        .attr('y', function(d) { return yScale(d.correct); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.correct); }); // Mengubah tinggi elemen menjadi yang diinginkan


    chart.selectAll(".text-above-t")
        .remove();

    // tambahkan nilai diatas barchart
    // Add text labels for grades above each bar
    chart.selectAll(".text-above-t")
        .data(filteredData)
        .enter()
        .append("text")
        .transition() // Menerapkan transisi
        .duration(500) // Durasi transisi dalam milidetik
        .attr("x", function(d) { return xScale(d.slot) + xScale.bandwidth() / 4; })
        .attr("y", function(d) { return yScale(d.correct) - 10; })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "black")
        .text(function(d) { return d.correct; });

    // Membuat barchart untuk f
    chart.selectAll('.bar-f')
        .attr("class","bar-f-red")
        .data(filteredData)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-red') //chart.css
        .attr('x', function(d) { return xScale(d.slot) + xScale.bandwidth() / 2; })
        .attr('y', height) // Mulai dari posisi bawah chart *untuk transisi
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu q akan ada dua barchart *untuk transisi
        .attr('height', 0) // Mulai dengan tinggi 0 *untuk transisi
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            var percentgrade = ((d.incorrect/countmhs)*100).toFixed(2);

            tooltip.style("opacity", 1)
            .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.incorrect} Mahasiswa <br>(${percentgrade}%) </strong>`)
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
        .attr('y', function(d) { return yScale(d.incorrect); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.incorrect); }); // Mengubah tinggi elemen menjadi yang diinginkan

        chart.selectAll(".text-above-f")
            .remove();

        // tambahkan nilai diatas barchart
        // Add text labels for grades above each bar
        chart.selectAll(".text-above-f")
            .data(filteredData)
            .enter()
            .append("text")
            .transition() // Menerapkan transisi
            .duration(500) // Durasi transisi dalam milidetik
            .attr("x", function(d) { return xScale(d.slot) + xScale.bandwidth()*0.75; })
            .attr("y", function(d) { return yScale(d.incorrect) - 10; })
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .text(function(d) { return d.incorrect; });

        // Membuat elemen tooltip
        var tooltip = d3.select("#chartQuizQues")
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
