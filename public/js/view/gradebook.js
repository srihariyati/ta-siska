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
    console.log(gradeData);

    //proses group barchart here with gradeData
    //gunakan d3.js


    //ngambil mean data dari semua grade 
    //pake controller yang ada




}