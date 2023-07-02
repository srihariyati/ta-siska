// Declare a global variable
var courseParticipant;
var openedDate;
var closedDate;
var token;

function handleCourseContentChange() {
    // mengambil content id untuk membuat dependent dropdown untuk module assign dan kuis
    // function dijalankan ketika user memilih content/topik mata kuliah pada dropdown menu pertama
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');

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
                emptyPage();
                var option = '<option value="0"  style="font-style: italic;">Tidak Ada Tugas/Kuis</option>';
                $('#content_module').append(option);

                var contentName = '<p> Tidak ada Kuis/Tugas yang tersedia</p>';
                $('#contentName').append(contentName);

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
    token = $('#courseTitle').data('token');
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
            openedDate = response.openedDate;
            closedDate = response.closedDate;

            var formattedOpenedDate = formatUnixTimestamp(openedDate);
            var formattedClosedDate = formatUnixTimestamp(closedDate);

            var showOpenedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
            var showClosedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';
            $('#modTitle').append(modName);
            $('#openedDate').append(showOpenedDate);
            $('#closedDate').append(showClosedDate);

            //ambil data grade
            getGradeQuiz(response.quizId);
            getQuizQues(response.quizId);
        }
    });

}

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

            openedDate = response.openedDate;
            closedDate = response.closedDate;

            var formattedOpenedDate = formatUnixTimestamp(openedDate);
            var formattedClosedDate = formatUnixTimestamp(closedDate);

            //append opened date dan closed date
            var showOpenedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
            var showClosedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';

            //append table participant khusus assign
            var tableParticipant = '<table class="table table-bordered"><body><tr><td>Participants</td><td><span id = "courseParticipant"><span></td></tr><tr><td>Submitted</td><td><span id = "submittedParticipant"></span></td ></tr><tr><td>Late Submitted</td><td><span id = "lateSubmittedParticipant"></span></td ></tr></tbody></table>';

            $('#modTitle').append(modName);
            $('#openedDate').append(showOpenedDate);
            $('#closedDate').append(showClosedDate);
            $('#tableParticipant').append(tableParticipant);

            //ambil data participant tugas
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

function emptyPagetable() {
    $('#chartParticipant').empty();
    $('#chartGradeAssignment').empty();
    $('#lagendGradeAssignment').empty();
    $('#tableGradeAssignment').empty();
    $('#chartQuizQues').empty();
    $('#descQuizQues').empty();
    $('#chartQuizGrades').empty();
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

            //submitted participant
            var submittedParticipant = response.length;
            $('#submittedParticipant').append(submittedParticipant);

            //late submitted participant
            //get jadwal closed tugas
            var lateSubmittedParticipant = 0;
            for (var i = 0; i < response.length; i++) {
                var module = response[i];

                var late = closedDate - module.timemodified;


                if (late < 0) { //kalau telat (nilai minus){
                    lateSubmittedParticipant++;
                }

            }
            $('#lateSubmittedParticipant').append(lateSubmittedParticipant);


            var chartTitle = '<h6>Persentase Pengumpulan Tugas</h6>'
            $('#chartParticipant').append(chartTitle);

            // chartAssign.js
            //buat untuk yang telah mengumpulkan tugas

            console.log("dari get subbmiteed par :coursepart", courseParticipant);
            window.chartParticipant(courseParticipant, submittedParticipant, assignName);
        }

    });
}

function getGradeAssignment() {
    var courseId = $('#courseTitle').data('courseid');
    //instanceid==quizid/assignid
    var instanceid = $('#content_module').val().split(',')[0];
    var assignId = instanceid;
    var counts = {};
    //ajax here
    $.ajax({
        url: `${BASE_URL}course/getGradeAssignment?token=${token}&assignid=${assignId}&courseid=${courseId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);

            //hitung jumlah nilai a b c
            // Calculate the mean grade

            for (var i = 0; i < response.length; i++) {
                var lettergrade = response[i].lettergrade;
                //console.log(lettergrade);

                if (!counts.hasOwnProperty(lettergrade)) {
                    counts[lettergrade] = 0;

                }

                // Increment the count for the letter
                counts[lettergrade]++;

            }
            console.log(counts);
            const dataArray = [];

            // Iterate over the object keys
            for (let grade in counts) {
                // Create an object with grade and jumlah properties
                const obj = { grade: grade, jumlah: counts[grade] };
                dataArray.push(obj);
            }

            console.log(dataArray);
            window.chartAssign(dataArray);
        }
    });
}

function handleTableQuiz(quizId) {
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
}

function handleTableAssign(courseId, assignId) {
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

function handleTable(modName) {
    token = $('#courseTitle').data('token');
    var courseId = $('#courseTitle').data('courseid');

    //instanceid==quizid/assignid
    var instanceid = $('#content_module').val().split(',')[0];

    //hilangkn chart dan gantikan dengan table
    emptyPagetable();

    if (modName == 'quiz') {
        handleTableQuiz(instanceid);
    } else
    if (modName == 'assign') {
        handleTableAssign(courseId, instanceid);
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

function getGradeQuiz(quizId) {
    console.log(quizId);
    var courseId = $('#courseTitle').data('courseid');
    var counts = {};
    //ambil list participant pada course
    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant?token=${token}&courseid=${courseId}`,
        metho: 'GET',
        dataType: 'json',
        success: function(response) {
            var participant = response;
            console.log(participant);

            const dataUser = [];
            for (var i = 0; i < response.length; i++) {
                var userid = response[i].id;
                dataUser.push(userid);
            }

            //kirim userid kedalam function

            //ambil data userid participantnya
            //lalu lakukan looping mengunakan funtion mod_quiz_get_user_attempts
            $.ajax({
                url: `${BASE_URL}course/getGradeQuiz`,
                data: {
                    token: token,
                    quizid: quizId,
                    datauser: dataUser,
                },
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    //start chart 1
                    for (var i = 0; i < response.length; i++) {
                        var grade = response[i].grade;
                        //console.log(grade);

                        if (!counts.hasOwnProperty(grade)) {
                            counts[grade] = 0;

                        }

                        // Increment the count for the 
                        counts[grade]++;

                    }
                    console.log(counts);
                    const dataArray = [];

                    // Iterate over the object keys
                    for (let grade in counts) {
                        // Create an object with grade and jumlah properties
                        const obj = { grade: grade, jumlah: counts[grade] };
                        dataArray.push(obj);
                    }

                    console.log(dataArray);
                    // Data nilai grade mahasiswa
                    var dataQuizGrade = dataArray;
                    window.chartQuizGrades(dataQuizGrade);
                    //end chart 1


                    //chart quiz 2
                    //get questions in all data response
                    for (var i = 0; i < response.length; i++) {
                        var ques = response[i].questions;
                        for (var j = 0; j < ques.length; j++) {
                            console.log(ques[j]);

                        }

                    }
                }
            });
        }
    });
}

function getQuizQues(quizId) {
    console.log(quizId);

    //ambil data quiz mhs menggunakan function
    $.ajax({
        url: `${BASE_URL}course/getQuizGrade?token=${token}&quizid=${quizId}`,
        metho: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('getgradequiz', response);
        }
    });

    // tingkat kelulusan dalam %
    var dataQuizQues = [
        { q: 'Q1', t: 20, f: 13 },
        { q: 'Q2', t: 10, f: 23 },
        { q: 'Q3', t: 15, f: 17 },
        { q: 'Q4', t: 10, f: 20 },
        { q: 'Q5', t: 20, f: 24 },
        { q: 'Q6', t: 20, f: 40 },
        { q: 'Q7', t: 10, f: 30 },
        { q: 'Q8', t: 33, f: 0 },
        { q: 'Q9', t: 10, f: 30 },
        { q: 'Q10', t: 35, f: 0 },
    ];
    window.chartQuizQues(dataQuizQues);
}

function showTableGradeQuiz() {
    //append data into row and cell

}