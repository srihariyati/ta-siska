var courseParticipant; // Declare a global variable

function handleCourseContentChange() {
    // mengambil content id untuk membuat dependent dropdown untuk module assign dan kuis
    // function dijalankan ketika user memilih content/topik mata kuliah pada dropdown menu pertama
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');

    console.log('courseId : ' + courseId);
    console.log('contentId : ' + contentId);


    $.ajax({

        url: `${BASE_URL}course/getCourseModule`,
        method: 'GET',
        data: {
            courseid: courseId,
            contentid: contentId,
            token: token
        },
        dataType: 'json',
        success: function(response) {
            console.log("getCourseModule : ");
            console.log(response);
            $('#content_module').empty();
            $('#contentName').empty();

            if (response.length == 0) {
                var option = '<option value="0"  style="font-style: italic;">Tidak Ada Tugas/Kuis</option>';
                $('#content_module').append(option);

            } else {
                for (var i = 0; i < response.length; i++) {

                    var module = response[i]; //moduleId == cmid //instanceid == quiz/assign id
                    // var option = '<option value=' + module.moduleId + '>' + module.moduleName + '</option>';
                    var option = '<option value=' + module.instance + ',' + module.modulemod + '>' + module.moduleName + '</option>';
                    $('#content_module').append(option);

                    //langsung append nama module nya disini aja gak sih? sekalian nama id dan mod nya


                    var instanceid = module.instance;
                    var modulemod = module.modulemod;
                    //kenapa ga kirim assign/kuis id kesini?
                    //setelah dikirim langsung jalanin function untuk dapat data kuis dan tugas

                    //if modulemod quiz getQuiz(token, courseId, instanceid)
                    //if modulemod assign getAssign()
                }

                // if (modulemod == 'quiz') {
                //     getQuiz(token, courseId, instanceid);
                // } else if (modulemod == 'assign') {
                //     console.log('assign boss');
                //     getAssign(token, courseId, instanceid);
                // }

                //tidak didalam looping karena akkan menampilkan sebanyak jumlah index didalam response
                var contentName = '<p>' + module.contentName + '</p>';
                $('#contentName').append(contentName);


            }
            //handleContentModuleChange();
            handleModuleChange();
        },
        error: function(xhr, status, error) {
            console.error(error);
        }

    });
}

function handleModuleChange() {
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');
    var instanceid = $('#content_module').val().split(',')[0];
    var modulemod = $('#content_module').val().split(',')[1];

    console.log(modulemod);

    if (modulemod == 'quiz') {
        getQuiz(token, courseId, instanceid);
    } else if (modulemod == 'assign') {
        getAssign(token, courseId, instanceid);
    }
}

function getQuiz(token, courseId, instanceid) {
    console.log('quiz', token, courseId, instanceid);
    emptyPage();
    //ajax to get Quiz controller
    $.ajax({

        url: `${BASE_URL}course/getQuiz`,
        method: 'GET',
        data: {
            token: token,
            courseid: courseId,
            instanceid: instanceid,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response.quizName);

            var modName = '<h3 class="font-weight-bolder pr-10 mb-0"  id="mod" data-modname="' + response.mod + '">' + response.quizName + '</h3>';
            var openedDate = response.openedDate;
            var closedDate = response.closedDate;

            var formattedOpenedDate = formatUnixTimestamp(openedDate);
            var formattedClosedDate = formatUnixTimestamp(closedDate);

            var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
            var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';
            $('#modTitle').append(modName);
            $('#openedDate').append(openedDate);
            $('#closedDate').append(closedDate);

            //ambil data grade
            getGradeQuiz();
        }
    });

} //menerima parameter token, courseid, dan instance id


function getAssign(token, courseId, instanceid) {
    console.log('getassign', token, courseId, instanceid);
    emptyPage();
    //ajax to get assign controller
    //ajax to get Quiz controller
    $.ajax({

        url: `${BASE_URL}course/getAssign`,
        method: 'GET',
        data: {
            token: token,
            courseid: courseId,
            instanceid: instanceid,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            var modName = '<h3 class="font-weight-bolder pr-10 mb-0" id="mod" data-modname="' + response.mod + '" >' + response.assignName + '</h3>';
            console.log('assign harusnya', modName);
            console.log("AssignId:" + response.assignId);

            var openedDate = response.openedDate;
            var closedDate = response.closedDate;

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
            //getParticipant(token, courseId, response.assignId, response.assignName, response.groupId);
            getCourseParticipant(token, courseId);
            getSubmittedParticipant(token, response.assignId, response.assignName);
            //append assign ID to data module.assignId

            //ambil data grade
            getGradeAssignment();

        }
    });
}


function emptyPage() {
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
    $('#tableGradeQuiz').empty();
}

// function handleContentModuleChange() {
//     // function dijalankan jika user sudah memilih content && module

//     // var moduleId = $('#content_module').val();
//     var instancemodule = $('#content_module').val();
//     var token = $('#courseTitle').data('token');
//     var courseId = $('#courseTitle').data('courseid');
//     var modName = $('#mod').data('modname');
//     console.log("modname di html", modName);


//     $.ajax({
//         url: `${BASE_URL}course/getQuizAssign`,
//         method: 'GET',
//         data: {
//             courseid: courseId,
//             instance: instancemodule,
//             token: token
//         },
//         dataType: 'json',
//         success: function(response) {
//             console.log("getQuizAssign : ");
//             console.log(response);
//             $('#modTitle').empty();
//             $('#openedDate').empty();
//             $('#closedDate').empty();
//             $('#tableParticipant').empty();
//             $('#chartParticipant').empty();
//             $('#chartGradeAssignment').empty();
//             $('#lagendGradeAssignment').empty();
//             $('#tableGradeAssignment').empty();
//             $('#chartQuizGrades').empty();
//             $('#chartQuizQues').empty();
//             $('#descQuizQues').empty();
//             $('#tableGradeQuiz').empty();

//             for (var i = 0; i < response.length; i++) {
//                 var module = response[i];

//                 //if response assign
//                 if (module.mod == "assign") {
//                     console.log('modName : Assign');
//                     //return halaman visdat tugas
//                     for (var i = 0; i < response.length; i++) {
//                         var module = response[i];
//                         var modName = '<h3 class="font-weight-bolder pr-10 mb-0" id="mod" data-modname="' + module.mod + '" >' + module.assignName + '</h3>';
//                         console.log(modName);
//                         console.log("AssignId:" + module.assignId);

//                         var openedDate = module.openedDate;
//                         var closedDate = module.closedDate;

//                         var formattedOpenedDate = formatUnixTimestamp(openedDate);
//                         var formattedClosedDate = formatUnixTimestamp(closedDate);

//                         //append opened date dan closed date
//                         var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
//                         var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';

//                         //append table participant khusus assign
//                         var tableParticipant = '<table class="table table-bordered"><body><tr><td>Participants</td><td><span id = "courseParticipant"><span></td<tr><tr><td>Submitted</td><td><span id = "submittedParticipant"></span></td ></tr></tbody></table>';

//                         $('#modTitle').append(modName);
//                         $('#openedDate').append(openedDate);
//                         $('#closedDate').append(closedDate);
//                         $('#tableParticipant').append(tableParticipant);

//                         //ambil data participant tugas
//                         getParticipant(token, courseId, module.assignId, module.assignName, module.groupId);

//                         //append assign ID to data module.assignId

//                         //ambil data grade
//                         getGradeAssignment();

//                     }

//                     //if response quiz
//                 } else if (module.mod == 'quiz') {
//                     console.log('modName : Quiz');
//                     //return halamn visdat kuis
//                     for (var i = 0; i < response.length; i++) {
//                         var module = response[i];
//                         var modName = '<h3 class="font-weight-bolder pr-10 mb-0"  id="mod" data-modname="' + module.mod + '">' + module.quizName + '</h3>';
//                         console.log(modName);
//                         var openedDate = module.openedDate;
//                         var closedDate = module.closedDate;

//                         var formattedOpenedDate = formatUnixTimestamp(openedDate);
//                         var formattedClosedDate = formatUnixTimestamp(closedDate);

//                         var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
//                         var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';
//                         $('#modTitle').append(modName);
//                         $('#openedDate').append(openedDate);
//                         $('#closedDate').append(closedDate);

//                     }

//                     //ambil data grade
//                     getGradeQuiz();
//                 }

//             }
//         },
//         error: function(xhr, status, error) {
//             console.error(error);
//         }

//     });

// }

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
            console.log(response);
            courseParticipant = response.length;
            $('#courseParticipant').append(courseParticipant);

            console.log("course participant : " + courseParticipant);
        }
    });
}

function getSubmittedParticipant(token, assignId, assignName) {
    console.log(token);
    console.log(assignId);

    //$('#submittedParticipant').empty();
    $('#chartParticipant').empty();

    //kolom submitted assignment
    //function mod_assign_list_participants :mendapatkan user dengan
    //ketentuan role:student dan submited:true
    $.ajax({
        url: `${BASE_URL}course/getSubmittedParticipant?token=${token}&assignid=${assignId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {

            var submittedParticipant = response.length;
            console.log("submittedparticipant : " + submittedParticipant);

            $('#submittedParticipant').append(submittedParticipant);

            var chartTitle = '<h6>Persentase Pengumpulan Tugas</h6>'
            $('#chartParticipant').append(chartTitle);

            // chartAssign.js
            // 33 diganti dengan $courseParticipant

            console.log("dari get subbmiteed par :coursepart", courseParticipant);
            window.chartParticipant(courseParticipant, submittedParticipant, assignName);
        }

    });
}

function getGradeAssignment() {
    window.chartAssign();
}

function handleTable(modName) {


    var token = $('#courseTitle').data('token');
    var courseId = $('#courseTitle').data('courseid');
    var assignId = 1;
    var quizId = 1;

    //hilangkn chart dan gantikan dengan table
    $('#chartParticipant').empty();
    $('#chartGradeAssignment').empty();
    $('#lagendGradeAssignment').empty();
    $('#tableGradeAssignment').empty();
    $('#chartQuizQues').empty();
    $('#descQuizQues').empty();
    $('#chartQuizGrades').empty();

    if (modName == 'quiz') {
        console.log('tble quiz')
        $.ajax({
            url: `${BASE_URL}course/getGradeQuiz?token=${token}&quizid=${quizId}`,
            metho: 'GET',
            dataType: 'json',
            success: function(response) {


                // ++++++++++++++++++++++++++++++++++++++++++++++
                // Menghitung jumlah kolom berdasarkan data respons
                var jumlahKolom = Object.keys(response[0]).length;

                // Membuat string HTML untuk tabel
                var tableGrade = '<table id="table" class="table table-sm table-striped"><thead><tr>';

                // Menambahkan kolom-kolom pada kepala tabel
                for (var i = 0; i < jumlahKolom; i++) {
                    tableGrade += '<th scope="col">' + Object.keys(response[0])[i] + '</th>';
                }

                tableGrade += '</tr></thead><tbody>';

                // Menambahkan baris-baris pada tubuh tabel
                for (var j = 0; j < response.length; j++) {
                    tableGrade += '<tr>';
                    for (var k = 0; k < jumlahKolom; k++) {
                        tableGrade += '<td>' + response[j][Object.keys(response[0])[k]] + '</td>';
                    }
                    tableGrade += '</tr>';
                }

                tableGrade += '</tbody></table>';
                // ++++++++++++++++++++++++++++++++++++++++++++++
                console.log(response);
                $('#tableGradeQuiz').append(tableGrade);
            }

            //append to table
            //kolom :usernanme/nim mhs, nama mhs,grade, pertanyaan (true or false)


        });

    } else
    if (modName == 'assign') {
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

function showTableGradeQuiz() {
    //append data into row and cell

}