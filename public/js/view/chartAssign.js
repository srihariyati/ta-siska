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
                return "green"; // Warna batang saat persentase terpenuhi
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
    //Kasih margin yang rapi
    //buat y axis dan x axis
    // buat rounded radius pada bar
    // buat hover action
    // buat grid background


    // Data nilai grade mahasiswa
    var data = [
        { grade: 'A', jumlah: 10 },
        { grade: 'AB', jumlah: 8 },
        { grade: 'B', jumlah: 12 },
        { grade: 'BC', jumlah: 6 },
        { grade: 'C', jumlah: 4 },
        { grade: 'D', jumlah: 2 },
        { grade: 'E', jumlah: 5 }
    ];

    // Ukuran grafik
    var width = 400;
    var height = 300;

    // Skala x (nilai huruf)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.grade; }))
        .range([0, width])
        .padding(0.2);

    // Skala y (jumlah mahasiswa)
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.jumlah; })])
        .range([height, 0]);

    // Membuat elemen SVG
    var svg = d3.select("#chartGradeAssignment")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Membuat elemen batang
    var bars = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.grade); })
        .attr("y", function(d) { return yScale(d.jumlah); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.jumlah); })
        .attr("fill", function(d) {
            if (d.grade === 'A' || d.grade === 'AB' || d.grade === 'B' || d.grade === 'BC') {
                var opacity = 1 - ((d.grade.charCodeAt(0) - 65) * 0.2);
                return "rgba(0, 128, 0, " + opacity + ")"; // Warna hijau dengan tingkat kejernihan yang berkurang
            } else {
                var opacity = 1 - ((d.grade.charCodeAt(0) - 67) * 0.2);
                return "rgba(255, 0, 0, " + opacity + ")"; // Warna merah dengan tingkat kejernihan yang berkurang
            }
        });

    // Menambahkan label jumlah mahasiswa
    var labels = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) { return xScale(d.grade) + xScale.bandwidth() / 2; })
        .attr("y", function(d) { return yScale(d.jumlah) - 5; })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) { return d.jumlah; })
        .style("fill", "white");

    function yAxis(g) {
        g.attr('transform', 'translate(${margin.lect}, 0)')
            .call(d3.axisLeft(y).ticks(null, data.format))
            .attr('font-size', '20px')
    }

    function xAxis(g) {
        g.attr('transform', 'translate(0, ${height-margin.bottom})')
            .call(d3.axisBottom(x).tickFormat(i => data[i].grade))
            .attr('font-size', '20px')

    }

    svg.append('g')
        .call(xAxis)
        .call(yAxis)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .call(d3.axisLeft(yScale));

}