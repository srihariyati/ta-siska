var courseId;
var token;
var table;

function handleTableGradebook() {
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');
    console.log(token);

    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'GET',
        data: {
            token: token,
            courseId: courseId,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            showTableGradebook(response);
        }
    });
}

function handleTableGradebookQuiz() {
    var mod = 'quiz';
    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'GET',
        data: {
            token: token,
            courseId: courseId,
            mod: mod,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            showTableGradebook(response);
        }
    });
}

function handleTableGradebookAssign() {
    var mod = 'assign';

    console.log("handleTableGradebookAssign", courseId);
    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'GET',
        data: {
            token: token,
            courseId: courseId,
            mod: mod,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            showTableGradebook(response);
        }
    });
}

function showTableGradebook(responseData) {
    if (table) {
        table.destroy();
    }

    $('#tableGradebook').empty();

    var dataTableData = [];
    var headerRow = [];
    responseData[0].grades.forEach(function(item) {
        headerRow.push(`<a href="${BASE_URL}gradebook/getModuleGrade?itemid=${item.itemid}" style="text-decoration:none;">${item.itemname}</a>`);
    });

    responseData.forEach(function(user) {
        var rowData = [`<a href='${BASE_URL}gradebook/getPersonalGrade?userid=${user.userid}' style="text-decoration:none;" method="GET">${user.userfullname}</a>`];
        user.grades.forEach(function(item) {
            rowData.push(item.grade);
        });
        dataTableData.push(rowData);
    });

    console.log(dataTableData);

    table = $('#tableGradebook').DataTable({
        destroy: true,
        data: dataTableData,
        footer: true,
        autoWidth: false,
        columnsDefs: [{ width: '100%', targets: 0 }],
        columns: [
            { title: 'Nama Mahasiswa' }, // Set width for 'Nama Mahasiswa' column
            ...headerRow.map(function(item) {
                return { title: item }; // Set width for other columns
            })
        ],
        paging: true,
        searching: true,
        info: true,
        dom: 'lfrtip',
        buttons: [{
                extend: 'pdf',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':visible'
                },
            },
            {
                extend: 'excel',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':visible'
                },
            },
            'copy'
        ],
        // Define the footer callback function
        footerCallback: function(row, data, start, end, display) {
            var api = this.api();

            // Calculate the mean for each column (starting from the second column)
            api.columns().every(function() {
                var column = this;
                var columnIndex = column.index();

                if (columnIndex > 0) {
                    var columnData = column.data();
                    var columnMean = columnData.reduce(function(sum, value) {
                        return sum + parseFloat(value);
                    }, 0) / columnData.length;

                    // Set the mean value as the content of the footer for the current column
                    $(column.footer()).html(columnMean.toFixed(2));
                }
            });
        }

    });
    $('.dt-buttons').hide();
}

function getCourseInfo() {
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');

    var rute = 'gradebook';

    console.log(token);
    console.log(courseId);

    //ajax to controller yang punya course info 
    $.ajax({
        url: `${BASE_URL}course/getCourseInfo/${token}/${courseId}/${rute}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            for (var i = 0; i < response.length; i++) {
                var course = response[i];
                var courseName = course[2];

                $('#courseTitle').append(courseName);
            }

        }
    });

}

function getStudentInfo() {
    var userid = $('#StudentName').data('userid');
    token = $('#courseTitle').data('token');

    console.log(userid);

    //ajax to cntroller get student infomatin
    //ajax to controller yang punya course info 
    $.ajax({
        url: `${BASE_URL}gradebook/getStudentInfo`,
        method: 'GET',
        data: {
            userid: userid,
            token: token,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                var student = response[i];
                var username = student.username;
                console.log(username);

                $('#StudentNIM').append(username);
            }

        }
    });


}

function showPersonalGradeChart(gradeData) {
    data = gradeData;

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
        .domain([0, (d3.max(data, function(d) { return Math.max(d.graderaw, d.grademean); }) + 10)])
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

    //buat barchart untuk graderaw
    // Membuat barchart untuk graderaw
    chart.selectAll('.bar-graderaw')
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut vertikal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-graderaw') // chart.css
        .attr('x', function(d) { return xScale(d.itemname); })
        .attr('y', function(d) { return yScale(d.graderaw); })
        .attr('width', xScale.bandwidth() / 2) //per dua karena dalam satu itemname akan ada dua barchart
        .attr('height', function(d) { return height - yScale(d.graderaw); })
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
        });


    // Membuat barchart untuk grademean
    chart.selectAll('.bar-grademean')
        .data(data)
        .enter()
        .append('rect')
        .attr("ry", 5) // Radius sudut horizontal
        .attr("rx", 5) // Radius sudut vertikal
        .attr('class', 'bar-grademean') //chart.css
        .attr('x', function(d) { return xScale(d.itemname) + xScale.bandwidth() / 2; })
        .attr('y', function(d) { return yScale(d.grademean); })
        .attr('width', xScale.bandwidth() / 2)
        .attr('height', function(d) { return height - yScale(d.grademean); })
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
        });

    //membuat text x axis
    svg.append('text')
        .attr('x', -((height - margin.left) / 2))
        .attr('y', margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Nilai (Grade)')
        .style("font-size", "12px");

    //membuat text y axis
    chart.append('text')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height + margin.bottom - 20)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Tugas/Kuis')
        .style("font-size", "12px");

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
}

function getContentModuleInfo() {
    var cmid = $('#contentModule').data('cmid');
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');
    var rute = 'gradebook';

    //ambil informasi contentmodule berdasarkan cmid
    //

    //get course id
    //get module id
    //get content id

    console.log(cmid);
}