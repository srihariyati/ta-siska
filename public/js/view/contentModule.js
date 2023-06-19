function handleCourseContentChange() {
    // mengambil content id untuk membuat dependent dropdown untuk module assign dan kuis
    // function dijalankan ketika user memilih content/topik mata kuliah pada dropdown menu pertama
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');

    console.log('courseId : ' + courseId);
    console.log('contentId : ' + contentId);


    $.ajax({

        url: `${BASE_URL}course/getCourseModule?courseid=${courseId}&contentid=${contentId}&token=${token}`,
        method: 'GET',
        data: {
            courseid: courseId,
            contentid: contentId,
            token: token
        },
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("getCourseModule : ");
            console.log(response);
            $('#content_module').empty();
            $('#contentName').empty();

            if (response.length == 0) {
                var option = '<option value=""  style="font-style: italic;">Tidak Ada Tugas/Kuis</option>';
                $('#content_module').append(option);

            } else {
                for (var i = 0; i < response.length; i++) {
                    var module = response[i];
                    var option = '<option value=' + module.moduleId + '>' + module.moduleName + '</option>';

                    $('#content_module').append(option);
                }
                //tidak didalam looping karena akkan menampilkan sebanyak jumlah index didalam response
                var contentName = '<p>' + module.contentName + '</p>';
                $('#contentName').append(contentName);
            }
            handleContentModuleChange();


        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function handleContentModuleChange() {
    // function dijalankan jika user sudah memilih content && module

    var moduleId = $('#content_module').val();
    var token = $('#courseTitle').data('token');
    var courseId = $('#courseTitle').data('courseid');


    $.ajax({
        url: `${BASE_URL}course/getQuizAssign?token=${token}&courseid=${courseId}&cmid=${moduleId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("getQuizAssign : ");
            console.log(response);
            $('#modTitle').empty();
            $('#openedDate').empty();
            $('#closedDate').empty();
            $('#tableParticipant').empty();
            $('#chartParticipant').empty();
            $('#chartGradeAssignment').empty();
            $('#lagendGradeAssignment').empty();
            $('#tableGradeAssignment').empty();
            $('#chartQuizGrades').empty();
            $('#chartQuizQues').empty();
            $('#descQuizQues').empty();

            for (var i = 0; i < response.length; i++) {
                var module = response[i];

                //if response assign
                if (module.mod == "assign") {
                    console.log('modName : Assign');
                    //return halaman visdat tugas
                    for (var i = 0; i < response.length; i++) {
                        var module = response[i];
                        var modName = '<h3 class="font-weight-bolder pr-10 mb-0" >' + module.assignName + '</h3>';
                        console.log(modName);
                        console.log("AssignId:" + module.assignId);

                        var openedDate = module.openedDate;
                        var closedDate = module.closedDate;

                        var formattedOpenedDate = formatUnixTimestamp(openedDate);
                        var formattedClosedDate = formatUnixTimestamp(closedDate);

                        //append opened date dan closed date
                        var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
                        var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';

                        //append table participant khusus assign
                        var tableParticipant = '<table class="table table-bordered"><body><tr><td>Participants</td><td><span id = "courseParticipant"><span></td<tr><tr><td>Submitted</td><td><span id = "submittedParticipant"></span></td ></tr></tbody></table>';

                        $('#modTitle').append(modName);
                        $('#openedDate').append(openedDate);
                        $('#closedDate').append(closedDate);
                        $('#tableParticipant').append(tableParticipant);

                        //ambil data participant tugas
                        getParticipant(token, courseId, module.assignId, module.assignName, module.groupId);

                        //append assign ID to data module.assignId

                        //ambil data grade
                        getGradeAssignment();

                    }


                    //if response quiz
                } else if (module.mod == 'quiz') {
                    console.log('modName : Quiz');
                    //return halamn visdat kuis
                    for (var i = 0; i < response.length; i++) {
                        var module = response[i];
                        var modName = '<h3 class="font-weight-bolder pr-10 mb-0">' + module.quizName + '</h3>';

                        var openedDate = module.openedDate;
                        var closedDate = module.closedDate;

                        var formattedOpenedDate = formatUnixTimestamp(openedDate);
                        var formattedClosedDate = formatUnixTimestamp(closedDate);

                        var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
                        var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';
                        $('#modTitle').append(modName);
                        $('#openedDate').append(openedDate);
                        $('#closedDate').append(closedDate);

                    }

                    //ambil data grade
                    getGradeQuiz();
                }

            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }

    });

}

function formatUnixTimestamp(unixTimestamp) {
    return new Date(unixTimestamp * 1000).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function getParticipant(token, courseId, assignId, assignName, groupId) {
    getCourseParticipant(token, courseId);
    getSubmittedParticipant(token, assignId, groupId, assignName);

}

function getCourseParticipant(token, courseId) {
    console.log(token);
    console.log(courseId);
    $('#courseParticipant').empty();
    $('#submittedParticipant').empty();


    //kolom all participant
    //function core_enrol_get_enrolled_users
    //jumlah user yang enrol mata kuliah dengan role: student

    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant?token=${token}&courseid=${courseId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var courseParticipant = response.length;
            $('#courseParticipant').append(courseParticipant);

            console.log("course participant : " + courseParticipant);


        }
    });
}

function getSubmittedParticipant(token, assignId, groupId, assignName) {

    console.log(token);
    console.log(assignId);
    console.log(groupId);

    //$('#submittedParticipant').empty();
    $('#chartParticipant').empty();

    //kolom submitted assignment
    //function mod_assign_list_participants :mendapatkan user dengan
    //ketentuan role:student dan submited:true
    $.ajax({
        url: `${BASE_URL}course/getSubmittedParticipant?token=${token}&assignid=${assignId}&groupid=${groupId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var submittedParticipant = response.length;
            console.log("submittedparticipant : " + submittedParticipant);

            $('#submittedParticipant').append(submittedParticipant);

            var chartTitle = '<h6>Persentase Pengumpulan Tugas</h6>'
            $('#chartParticipant').append(chartTitle);

            // chartAssign.js
            window.chartParticipant(33, submittedParticipant, assignName);
        }

    });


}

function getGradeAssignment() {
    window.chartAssign();
}

function handletableAssignment() {
    var token = $('#courseTitle').data('token');
    var assignId = 1;
    var courseId = $('#courseTitle').data('courseid');
    //hilangkn chart dan gantikan dengan table
    $('#chartParticipant').empty();
    $('#chartGradeAssignment').empty();
    $('#lagendGradeAssignment').empty();
    $('#tableGradeAssignment').empty();


    //ajax here
    $.ajax({
        // url: `${BASE_URL}course/getGradeAssignment?token=${token}&assignid=${assignId}&courseid=${courseId}`,
        url: `${BASE_URL}course/getGradeAssignment?token=${token}&assignid=${assignId}&courseid=${courseId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            //append table here
            //append table participant khusus assign
            var tableGrade = '<table  id="table" class="table table-sm table-striped"><thead><tr><th scope="col">NIM</th><th scope="col">Nama Mahasiswa</th><th scope="col">Grade</th><th scope="col">Nilai Huruf</th></tr></thead><tbody></tbody></table>';
            $('#tableGradeAssignment').append(tableGrade);
            showTableGradeAssignment(response);
            //data akhir akan berisi id, userid, username, fullname, grade, lettergrade
            //data ini yang akan ditampilkan dalam tabel


        }
    });
}

function showTableGradeAssignment(responseData) {

    // Get the table element by its ID
    var table = document.getElementById("table");

    // Remove all existing rows from the table when user force click
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    // Sort the responseData array by username
    responseData.sort(function(a, b) {
        var usernameA = a.username.toUpperCase();
        var usernameB = b.username.toUpperCase();
        if (usernameA < usernameB) {
            return -1;
        }
        if (usernameA > usernameB) {
            return 1;
        }
        return 0;
    });

    // Loop through the response data and create table rows
    for (var i = 0; i < responseData.length; i++) {
        var row = table.insertRow(i + 1); // Insert a new row at index 'i + 1'

        var usernameCell = row.insertCell(0);
        usernameCell.textContent = responseData[i].username;

        var fullnameCell = row.insertCell(1);
        fullnameCell.textContent = responseData[i].fullname;

        var gradeCell = row.insertCell(2);
        gradeCell.textContent = responseData[i].grade;

        var letterGradeCell = row.insertCell(3);
        letterGradeCell.textContent = responseData[i].lettergrade;

        // Add CSS class based on grade value
        if (responseData[i].grade <= 50) {
            gradeCell.classList.add("red-text");
            letterGradeCell.classList.add("red-text");
        } else {
            gradeCell.classList.add("green-text");
            letterGradeCell.classList.add("green-text");
        }
    }

}

function getGradeQuiz() {
    window.chartQuizGrades();
    window.chartQuizQues();
}