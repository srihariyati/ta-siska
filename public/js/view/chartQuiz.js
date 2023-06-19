function chartQuizGrades() {
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizGrades").clientWidth;
    var height = document.getElementById("chartQuizGrades").clientWidth / 1.5 - margin.top - margin.bottom;
    console.log(width);

    // Data nilai grade mahasiswa
    var data = [
        { grade: '100', jumlah: 10 },
        { grade: '90', jumlah: 8 },
        { grade: '80', jumlah: 15 },
        { grade: '70', jumlah: 6 },
        { grade: '60', jumlah: 14 },
        { grade: '50', jumlah: 2 },
        { grade: '0', jumlah: 5 }
    ];
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
        .domain([0, (d3.max(data, function(d) { return d.jumlah; }) + 2)])
        .range([height, 0]);

    //menampilkan yAxis
    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .style("font-size", "16px");

    //menampilkan xAxis
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
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
        .data(data)
        .enter()
        .append("rect")
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr("x", function(d) { return xScale(d.grade); })
        .attr("y", function(d) { return yScale(d.jumlah); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.jumlah); })
        .attr("fill", function(d) {
            if (d.grade > 50) {
                var opacity = 1 - ((d.grade - 50) / 100); //1
                return "rgba(34, 115, 98, " + opacity + ")"; // Warna hijau dengan tingkat kejernihan yang berkurang
            } else {
                var opacity = 1 - ((50 - d.grade) / 100);
                return "rgba(255, 0, 0, " + opacity + ")"; // Warna merah dengan tingkat kejernihan yang berkurang
            }
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
        });


    // Membuat elemen tooltip
    var tooltip = d3.select("#chartQuizGrades")
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

}

function chartQuizQues() {
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizQues").clientWidth;
    var height = document.getElementById("chartQuizQues").clientWidth / 1.5 - margin.top - margin.bottom;
    console.log(width);

    // Data nilai grade mahasiswa
    var data = [
        { q: 'Q1', t: 5, f: 1 },
        { q: 'Q2', t: 4, f: 5 },
        { q: 'Q3', t: 1, f: 6 },
        { q: 'Q4', t: 6, f: 3 },
        { q: 'Q5', t: 1, f: 2 },
        { q: 'Q6', t: 4, f: 1 },
        { q: 'Q7', t: 10, f: 2 },
        { q: 'Q8', t: 4, f: 5 },
        { q: 'Q9', t: 7, f: 6 },
        { q: 'Q10', t: 2, f: 7 },
    ];

    // Membuat elemen SVG
    var svg = d3.select("#chartQuizQues")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var chart = svg.append('g')
        .attr("transform", "translate(" + (margin.left * 10) + "," + margin.top + ")");

    // Skala x (nilai huruf)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.q; }))
        .range([0, width])
        .padding(0.1);

    // Skala y (jumlah mahasiswa)
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.t + d.f; })])
        .range([height, 0]);

    //menampilkan yAxis
    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .style("font-size", "16px");

    //menampilkan xAxis
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
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


    /// Membuat elemen batang
    chart.selectAll("rect.t")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.q); })
        .attr("y", function(d) { return yScale(d.t); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return yScale(0) - yScale(d.t); })
        .attr("fill", "rgba(34, 115, 98)") // Warna hijau solid
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`<strong>Pertanyaan: ${d.q}</strong><br/>${d.t} Mahasiswa Benar`)
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
        });

    chart.selectAll("rect.f")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.q); })
        .attr("y", function(d) { return yScale(d.t + d.f); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return yScale(d.t) - yScale(d.t + d.f); })
        .attr("fill", "rgba(255, 0, 0)") // Warna merah solid
        .on("mouseover", function(event, d) { // Pass the event object as the first argument
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`<strong>Pertanyaan: ${d.q}</strong><br/>${d.f} Mahasiswa Salah`)
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
        });


    // Membuat elemen tooltip
    var tooltip = d3.select("#chartQuizQues")
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

    //append to #descQues
    var descQues = '<p> <strong>10 Pertanyaan</strong></p><p class = "mb-0" > Rata - rata kelulusan per pertanyan: </p><p class = "mt-0"> <strong> 60.98 % </strong></p>';
    $('#descQuizQues').append(descQues);

}