function chartQuizGrades(data) {
    console.log(data);
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizGrades").clientWidth;
    var height = document.getElementById("chartQuizGrades").clientWidth / 1.5 - margin.top - margin.bottom;
    console.log(width);

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
    console.log(data);
    var countQues = data.length;
    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartQuizQues").clientWidth;
    var height = document.getElementById("chartQuizQues").clientWidth / 1.5 - margin.top - margin.bottom;
    console.log(width);

    var data = data;

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
        .domain([0, (d3.max(data, function(d) { return Math.max(d.correct, d.incorrect); }) + 2)])
        .range([height, 0]);

    //menampilkan yAxis
    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .style("font-size", "16px");

    //menampilkan xAxis
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
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

    //buat barchart untuk t
    // Membuat barchart untuk t
    chart.selectAll('.bar-t')
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
            // Show tooltip
            var mouseCoords = d3.pointer(event, this);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            tooltip.style("opacity", 1)
                .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.correct} Mahasiswa Benar </strong>`)
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
        .duration(3000) // Durasi transisi dalam milidetik
        .delay(function(_, i) { return i * 100; }) // Penundaan transisi untuk setiap elemen
        .attr('y', function(d) { return yScale(d.correct); }) // Menggeser elemen ke posisi vertikal yang tepat
        .attr('height', function(d) { return height - yScale(d.correct); }); // Mengubah tinggi elemen menjadi yang diinginkan


    // Membuat barchart untuk f
    chart.selectAll('.bar-f')
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

            tooltip.style("opacity", 1)
                .html(`Pertanyaan : ${d.slot}<br/><strong> ${d.incorrect} Mahasiswa Salah</strong>`)
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
        .duration(3000) // Durasi transisi dalam milidetik
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
    //append to #descQues
    var descQues = '<p> <strong>' + countQues + ' Pertanyaan</strong></p><p class = "mb-0" > Rata - rata kelulusan per pertanyan: </p><p class = "mt-0"> <strong> 60.98 % </strong></p>';
    $('#descQuizQues').append(descQues);

}