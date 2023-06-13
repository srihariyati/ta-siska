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
    // Data
    var data = [
        { grade: 'A', jumlah: 10 },
        { grade: 'AB', jumlah: 8 },
        { grade: 'B', jumlah: 12 },
        { grade: 'BC', jumlah: 6 },
        { grade: 'C', jumlah: 4 },
        { grade: 'D', jumlah: 2 },
        { grade: 'E', jumlah: 1 }
    ];

    // Ukuran grafik
    var width = 400;
    var height = 300;

    // Mengambil nilai maksimum jumlah mahasiswa
    var maxJumlah = d3.max(data, function(d) { return d.jumlah; });

    // Skala y
    var yScale = d3.scaleLinear()
        .domain([0, maxJumlah])
        .range([height, 0]);

    // Menentukan interval yang cocok untuk sumbu y
    var yTicks = yScale.ticks(5);

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
        .attr("x", function(d, i) { return i * (width / data.length); })
        .attr("y", function(d) { return yScale(d.jumlah); })
        .attr("width", width / data.length - 10)
        .attr("height", function(d) { return height - yScale(d.jumlah); })
        .attr("fill", "green");

    // Menambahkan label
    var labels = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i) { return i * (width / data.length) + (width / data.length) / 2; })
        .attr("y", function(d) { return yScale(d.jumlah) - 5; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.jumlah; })
        .style("fill", "white");

    // Menambahkan label grade
    var gradeLabels = svg.selectAll(".grade-label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i) { return i * (width / data.length) + (width / data.length) / 2; })
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.grade; })
        .style("fill", "black");

    // Menambahkan judul grafik
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Bar Chart")
        .style("fill", "black");

    // Menambahkan label pada sumbu y
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text("Jumlah Mahasiswa")
        .style("fill", "black");

    // Menggambar sumbu y
    var yAxis = d3.axisLeft(yScale)
        .tickValues(yTicks);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(30,0)")
        .call(yAxis);

}