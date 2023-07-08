var courseId;
var token;
var table;

function handleTableGradebook() {
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');
    console.log(token);
    console.log(courseId);

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
    //get instance id 
    //var instanceid = 
    //dapatkan courseId
    console.log(courseId, token);

    if (table) {
        table.destroy();
    }

    $('#tableGradebook').empty();

    console.log(responseData);

    var dataTableData = [];
    var headerRow = [];
    responseData[0].grades.forEach(function(item) {
        headerRow.push(`<a href="${BASE_URL}gradebook/getModuleGradeView?itemid=${item.itemid}&token=${token}&courseid=${courseId}&cmid=${item.cmid}" style="text-decoration:none;">${item.itemname}</a>`);
    });

    responseData.forEach(function(user) {
        var rowData = [`<a href='${BASE_URL}gradebook/getPersonalGrade?userid=${user.userid}&token=${token}&courseid=${courseId}' style="text-decoration:none;" method="GET">${user.userfullname}</a>`];
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

function getCourseName() {
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');

    console.log(token);
    console.log(courseId);

    //ajax to controller yang punya course info 
    $.ajax({
        url: `${BASE_URL}gradebook/getCourseName`,
        data: {
            token: token,
            courseid: courseId,
        },
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(1111);
            console.log('js:ocurseinfo', response.displayname);
            var courseName = response.displayname;
            $('#courseTitle').append(courseName);


        },
        error: function(xhr, status, error) {
            // Handle the error
            console.log(error);
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

function getContentModuleInfo() {
    var cmid = $('#contentModule').data('cmid');
    var itemid = $('#contentModule').data('itemid');
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');

    //ambil informasi contentmodule berdasarkan cmid
    //ajax get content module information
    $.ajax({
        url: `${BASE_URL}gradebook/getModuleInfo`,
        method: 'GET',
        data: {
            token: token,
            courseid: courseId,
            cmid: cmid,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);

            $('#contentModule').empty();
            var contentname = response.cname;
            var instanceid = response.instanceid;
            var modulename = response.cmname;
            $('#contentModule').append(modulename);
            $('#contentName').append(contentname);

            //untuk dapatjalan assignid
            getModuleGrade(instanceid, cmid, courseId, token, itemid);

            //append instance id ke dalam html
            //lalu ambil untuk dapat submission status


        }
    });
}

function getMeanGradeModule(module_grade) {
    console.log(module_grade);

    // Calculate the mean grade
    var sum = 0;
    for (var i = 0; i < module_grade.length; i++) {
        sum += module_grade[i].grade;
    }

    var mean = (sum / module_grade.length).toFixed(2);

    // console.log('Mean grade:', mean);
    $('#meanGrade').append(mean);
}

function getSubmissionTimeliness() {

    var token = $('#courseTitle').data('token');
    var courseId = $('#courseTitle').data('courseid');
    var assignId = $('#contentModule').data('id');

    //get all course participant

    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant?token=${token}&courseid=${courseId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            courseParticipant = response.length;
            console.log("course participant : " + courseParticipant);
        }
    });

    //get submission participant
    $.ajax({
        url: `${BASE_URL}course/getSubmittedParticipant?token=${token}&assignid=${assignId}&groupid=${groupId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var submittedParticipant = response.length;
            console.log("submittedparticipant : " + submittedParticipant);
        }
    });



}

function getModuleGrade(instanceid, cmid, courseId, token, itemid) {
    $('#gradeCard').empty();
    //need itemid
    console.log(instanceid, cmid, courseId, token);
    $.ajax({
        url: `${BASE_URL}gradebook/getModuleGrade`,
        method: 'GET',
        data: {
            token: token,
            courseid: courseId,
            cmid: cmid,
            instanceid: instanceid,
            itemid: itemid
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            //append kedalam card untuk setiap data
            //yang di masukkan adalahh smeua, kalau bis jadikan
            // data- aja yang id id itu
            for (var i = 0; i < response.length; i++) {
                var module = response[i];
                var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body">';
                gradeCard += '<h6 class="card-title">' + module.userfullname + '</h6>';
                gradeCard += '</div></div><div class="col-md-6"><div class="card-body"><p class="card-text">';

                if (module.submissionstatus == 'submitted ontime') {
                    var status = 'Mengumpulkan tugas tepat waktu';
                } else if (module.submissionstatus == 'late submitted') {
                    var status = 'Telat mengumpulkan tugas';
                } else {
                    var status = 'Tidak dapat menemukan tugas'
                }
                gradeCard += '<p class="card-text"><small class="text-muted">' + status + '</small></p>';
                gradeCard += '</div></div><div class="col-md-2"><div class="card-body">';
                gradeCard += '<h5 class="card-title">' + module.grade + '</h5>';
                gradeCard += '</div></div></div></div>';
                $('#gradeCard').append(gradeCard);

            }
            getMeanGradeModule(response);
        }

    });
}