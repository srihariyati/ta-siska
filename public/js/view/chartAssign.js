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


function chartGrade() {
    console.log("chart grade");

    // Kasih margin yang rapi
    var margin = { top: 20, right: 50, bottom: 50, left: 5 };

    // buat ukuran grafik
    var width = document.getElementById("chartGradeAssignment").clientWidth;
    var height = document.getElementById("chartGradeAssignment").clientWidth / 1.5 - margin.top - margin.bottom;

    // Data nilai grade mahasiswa
    var data = [
        { grade: 'A', jumlah: 10 },
        { grade: 'AB', jumlah: 8 },
        { grade: 'B', jumlah: 20 },
        { grade: 'BC', jumlah: 6 },
        { grade: 'C', jumlah: 14 },
        { grade: 'D', jumlah: 2 },
        { grade: 'E', jumlah: 5 }
    ];

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
        .padding(0.05);

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
            .tickSize(-height, 1, 0)
            .tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke-opacity', 0.5);

    chart.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft()
            .scale(yScale)
            .tickSize(-width, 0, 1)
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
            if (d.grade === 'A' || d.grade === 'AB' || d.grade === 'B' || d.grade === 'BC') {
                var opacity = 1 - ((d.grade.charCodeAt(0) - 65) * 0.2);
                return "rgba(34, 115, 98, " + opacity + ")"; // Warna hijau dengan tingkat kejernihan yang berkurang
            } else {
                var opacity = 1 - ((d.grade.charCodeAt(0) - 67) * 0.2);
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
                .style("z-index", 1); // Set higher z-index to appear in front
        })
        .on("mouseout", function(d) {
            // Hide tooltip
            tooltip.style("opacity", 0);
        });


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
}





// function chartGarade() {
//     console.log("chart grade assignmnet");
//     // Data nilai grade mahasiswa
//     var data = [
//         { grade: 'A', jumlah: 10 },
//         { grade: 'AB', jumlah: 8 },
//         { grade: 'B', jumlah: 12 },
//         { grade: 'BC', jumlah: 6 },
//         { grade: 'C', jumlah: 4 },
//         { grade: 'D', jumlah: 2 },
//         { grade: 'E', jumlah: 5 }
//     ];

//     //deklarasi nilai untuk ukuran canvas svg
//     //mengambil lebar maksimum dari elemen dgn id chartGrdeAssignment
//     var width = document.getElementById("chartGradeAssignment");
//     var height = 300;
//     var margin = { top: 50, bottom: 50, left: 50, right: 50 };

//     var svg = d3.select('#chartGradeAssignment')
//         .append('svg')
//         .attr('width', width - margin.left - margin.right)
//         .attr('height', height - margin.top - margin.bottom)
//         .attr('viewBox', [0, 0, width, height]);


//     var xScale = d3.scaleBand()
//         .domain(data.map(function(d) { return d.grade; }))
//         .range([0, width])
//         .padding(0.2);

//     var yScale = d3.scaleLinear()
//         .domain([0, d3.max(data, function(d) { return d.jumlah; })])
//         .range([height, 0]);

//     svg
//         .append('g')
//         .attr('fill', 'royalBlue')
//         .selectAll('rect')
//         .data(data.sort((a, b) => d3.descending(a.jumlah, b.jumlah)))
//         .join('rect')
//         .attr('x', (d, i) => xScale(i))
//         .attr('y', d => yScale(d.jumlah))
//         .attr('title', (d) => d.jumlah)
//         .attr('class', 'rect')
//         .attr('height', d => yScale(0) - yScale(d.jumlah))
//         .attr('width', xScale.bandwidth());




// }