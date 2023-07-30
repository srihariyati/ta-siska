// Declare a global variable
var courseParticipant;
var openedDate;
var closedDate;
var token;

//////////////////////////////General/////////////////////////////////
function handleCourseContentChange() {
    $('#alert').empty();
    // mengambil content id untuk membuat dependent dropdown untuk module assign dan kuis
    // function dijalankan ketika user memilih content/topik mata kuliah pada dropdown menu pertama
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');

    console.log('courseId : ' + courseId);
    console.log('contentId : ' + contentId);


    $.ajax({

        url: `${BASE_URL}course/getCourseModule`,
        method: 'POST',
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
                //matikan load 
                window.removeAnimation("load-1");
                var option = '<option value="0"  style="font-style: italic;">Tidak Ada Tugas/Kuis</option>';
                $('#content_module').append(option);
                
                //append sweet alert
                sweetAlertFail();
                


            } else {
                for (var i = 0; i < response.length; i++) {

                    var module = response[i]; //moduleId == cmid //instanceid == quiz/assign id
                    // var option = '<option value=' + module.moduleId + '>' + module.moduleName + '</option>';
                    var option = '<option value=' + module.instance + ',' + module.modulemod + '>' + module.moduleName + '</option>';
                    $('#content_module').append(option);

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

//////////////////////////////Assign/////////////////////////////////
function getAssign(token, courseId, instanceid) {
    console.log('getassign', token, courseId, instanceid);

    emptyPage();
    loadAnimation_sm("load-1");

    //make loadanimation untuk id show yang dipakai oleh assign



    //ajax to get assign controller
    //ajax to get Quiz controller
    $.ajax({
        url: `${BASE_URL}course/getAssign`,
        method: 'POST',
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
            var showOpenedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Dibuka</strong>  : ' + formattedOpenedDate + ' </p>';
            var showClosedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Ditutup</strong> : ' + formattedClosedDate + ' </p>';

            var tableParticipant = `
            <table class="table table-bordered table-participant">
                <body>
                    <tr>
                        <td>Peserta Mata Kuliah</td>
                        <td><span id = "courseParticipant"><span></td>
                    </tr>
                    <tr>
                        <td>Mengumpulkan</td>
                        <td><span id = "submittedParticipant"></span></td >
                    </tr>
                    <tr>
                        <td>Telat Mengumpulkan</td>
                        <td><span id = "lateSubmittedParticipant"></span></td >
                    </tr>
                    <tr>
                        <td>Mengumpulkan Tepat Waktu</td>
                        <td><span id = "ontimeSubmittedParticipant"></span></td >
                    </tr>
                </tbody>
            </table>`;

            window.removeAnimation("load-1");
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

function getGradeAssignment() {
    var courseId = $('#courseTitle').data('courseid');
    //instanceid==quizid/assignid
    var instanceid = $('#content_module').val().split(',')[0];
    var assignId = instanceid;
    var counts = {};
    //ajax here
    $.ajax({
        url: `${BASE_URL}course/getGradeAssignment`,
        method: 'POST',
        data:{
            token:token,
            assignid:assignId,
            courseid:courseId,
        },
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

function handleTableAssign(courseId, assignId) {
    window.loadAnimation_lg("load-table");
    //ajax here
    $.ajax({
        url: `${BASE_URL}course/getGradeAssignment`,
        method: 'POST',
        data:{
            token:token,
            assignid:assignId,
            courseid:courseId,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            //append table here
            //append table participant khusus assign
            var tableGrade = '<table  id="table_assign" class="table table-sm table-striped"><thead><tr><th scope="col">NIM</th><th scope="col">Nama Mahasiswa</th><th scope="col">Grade</th><th scope="col">Nilai Huruf</th></tr></thead><tbody></tbody></table>';
            $('#tableGradeAssignment').append(tableGrade);
            window.removeAnimation("load-table");
            showTableGradeAssignment(response);
            //data akhir akan berisi id, userid, username, fullname, grade, lettergrade
            //data ini yang akan ditampilkan dalam tabel


        }
    });
}

function showTableGradeAssignment(responseData) {
    console.log(responseData);

    var data=[];
    responseData.forEach(function(item){
        var rowData=[];
        rowData=[item.username, item.fullname];
        
        //buat kondisi nilai >50 dan <50
        if (item.grade < 50) {
            rowData.push(`<span style="color: red;"><strong>${item.grade}</strong></span>`);
        } else {
            rowData.push(`<span style="color: green;"><strong>${item.grade}</strong></span>`);
        }

        //buat kondisi nilai >50 dan <50
        if (item.lettergrade == 'A'||'AB'||'B') {
            rowData.push(`<span style="color: red;"><strong>${item.lettergrade}</strong></span>`);
        } else {
            rowData.push(`<span style="color: green;"><strong>${item.lettergrade}</strong></span>`);
        }

        data.push(rowData);
    });

    console.log(data);

    //buat datatables
    table = $('#table_assign').DataTable({
        destroy: true,
        data: data,
        scrollY:"500px",
        scrollX: true,
        footer: true,
        autoWidth: false,
        paging: false,
        searching: true,
        info: true,
        dom: 'lfrtip',
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/id.json',
        },
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
    });
    $('.dt-buttons').hide();
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
        url: `${BASE_URL}course/getCourseParticipant`,
        method: 'POST',
        data :{
            token:token,
            courseid:courseId,
        },
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
        url: `${BASE_URL}course/getSubmittedParticipant`,
        method: 'POST',
        data:{
            token:token,
            assignid:assignId,
        },
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

//////////////////////////////Quiz//////////////////////////////////
function getQuiz(token, courseId, instanceid) {
    
    console.log('quiz', token, courseId, instanceid);
    emptyPage();
    loadAnimation_lg("load-2");

    //ajax to get Quiz controller
    $.ajax({

        url: `${BASE_URL}course/getQuiz`,
        method: 'POST',
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

            var showOpenedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Dibuka</strong>  : ' + formattedOpenedDate + '</p>';
            var showClosedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Ditutup</strong> : ' + formattedClosedDate + '</p>';

            //hapus load animation setelah empty dan sebelum append
            window.removeAnimation('load-1');
            $('#modTitle').append(modName);
            $('#openedDate').append(showOpenedDate);
            $('#closedDate').append(showClosedDate);         

            //ambil data grade
            getGradeQuiz(response.quizId);
        }
    });

}

function getGradeQuiz(quizId) {
    blockiconVis();
    console.log(quizId);
    var courseId = $('#courseTitle').data('courseid');
    var counts = {};
    //var dataUser=[];
    // var participant;
    //ambil list participant pada course untuk proses looping pada function
    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant`,
        method: 'POST',
        data :{
            token: token,
            courseid: courseId,
        },
        dataType: 'json',
        success: function(response) {
            var participant = response;
            console.log(participant); 

            $.ajax({               
                url: `${BASE_URL}course/getGradeQuiz`,
                method: 'POST',
                data:{
                    token:token,
                    quizid:quizId,
                    participant:participant,
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
                    const dataQuizGrades = [];
        
                    // Iterate over the object keys
                    for (let grade in counts) {
                        // Create an object with grade and jumlah properties
                        const obj = { grade: grade, jumlah: counts[grade] };
                        dataQuizGrades.push(obj);
                    }
        
                    //remove load animation
                    window.removeAnimation('load-2');
                    window.chartQuizGrades(dataQuizGrades);
                    //end chart 1
        
        
                    //chart quiz 2
                    //get questions in all data response
                    var questions = [];
                    for (var i = 0; i < response.length; i++) {
                        var ques = response[i].questions;
        
                        for (var j = 0; j < ques.length; j++) {
                            //console.log(ques[j]);
                            //couting jumlah slot corret dan incorret/no answered
                            //hitung jumlah slot
                            // {slot:jumlahslot}
                            questions.push(ques[j]);
        
                        }
        
                    }
                    getQuizQues(questions);
                }
            });      
            // for (var i = 0; i < response.length; i++) {
            //     //kirim userid dan studentname(fullname)
            //     var studentname = response[i].fullname;
            //     var userid = response[i].id;

            //     //list of studentid and studentname
            //     dataUser.push({ userid: userid, studentname: studentname });
            // }    

            //kirim userid kedalam function

            //ambil data userid participantnya
            //lalu lakukan looping mengunakan funtion mod_quiz_get_user_attempts
           
        }
    });


    
}

function getQuizQues(questionsData) {
    console.log(questionsData);
    const countBySlot = {};
    let output = [];

    questionsData.forEach(data => {
        const { slot, status } = data;
        if (!countBySlot[slot]) {
            countBySlot[slot] = { slot: 'Q' + slot, correct: 0, incorrect: 0 };
        }

        if (status === 'Correct') {
            countBySlot[slot].correct++;
        } else { //incorrect dan not answered
            countBySlot[slot].incorrect++; //data yan dihasilkan dmulai dari index 1(index sesuai nama slot), dan gabia dibaca oleh data.map, jadi harus dicobert dulu
        }
    });
    

    //convert dalam format tanpa nomor index (mengahpus nomor index)
    const mappedData = Object.values(countBySlot).map(item => ({
        slot: item.slot,
        correct: item.correct,
        incorrect: item.incorrect
    }));
    console.log(countBySlot);
    console.log(mappedData);

    window.chartQuizQues(mappedData);
}

function handleTableQuiz(quizId) {
    blockiconTable();
    console.log('tble quiz');
    console.log(token);
    //ambil data yang sama kayak data di gradequiz
    var courseId = $('#courseTitle').data('courseid');
    var counts = {};
    //ambil list participant pada course

    window.loadAnimation_lg("load-table");
    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant`,
        method: 'POST',
        data:{
            token:token,
            courseid:courseId,
        },
        dataType: 'json',
        success: function(response) {
            var participant = response;
            console.log(participant); 

            $.ajax({
                url: `${BASE_URL}course/getGradeQuiz`,
                method :'POST',
                data: {
                    token: token,
                    quizid: quizId,
                    participant: participant,
                },
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    //transformasi data kedalam format row table
                    var dataTableData = [];

                    response.forEach(function(item) {
                        var rowData=[];
                        // Extract the desired properties from the item
                        rowData.username = item.username;
                        rowData.studentname = item.studentname;
                        rowData.grade = item.grade;


                        /// Iterate through each question in the 'questions' array and extract the status for each slot
                       item.questions.forEach(function (question) {
                            rowData['Q' + question.slot] = question.status;
                        });
                                        
                        dataTableData.push(rowData);
                    });
                    console.log(dataTableData);


                    //generate baris header
                    //kolom paling akhir sebanyak jumlah slot quiz
                    var countingques = (response[0]['questions']).length;
                    console.log(countingques);
                    
                    //kolom paling akhir sebanyak jumlah slot quiz
                    var countingques = (response[0]['questions']).length;
                    console.log(countingques);
                    var tableGrade = '<table  id="table_quiz" class="table table-sm table-striped"><thead><tr><th scope="col">NIM</th><th scope="col">Nama Mahasiswa</th><th scope="col">Nilai</th>';
                    // Generate <th> elements for Q1, Q2, Q3, ..., Qn
                    for (var i = 1; i <= countingques; i++) {
                        tableGrade += '<th scope="col">Q' + i + '</th>';
                    }

                    $('#tableGradeQuiz').append(tableGrade);

                    window.removeAnimation("load-table");
                    showTableGradeQuiz(dataTableData);
                }
            });
        }
    });
}

function showTableGradeQuiz(data){
    $('#ketIcon').show();
    
    var dataTableData=[];
    //buat row data dulu
    data.forEach(function(item,key) {
        var rowData=[];
        rowData =[item.username, item.studentname];

        //buat kondisi nilai >50 dan <50
        if (item.grade < 50) {
            rowData.push(`<span style="color: red;"><strong>${item.grade}</strong></span>`);
          } else {
            rowData.push(`<span style="color: green;"><strong>${item.grade}</strong></span>`);
          }

        //buat kondisi jika answeres pakai icon 
        const getIconByQValue = (value) => {
            if (value === "Correct") {
            return '<i class="bi bi-check-square-fill text-success"></i>';
            } else if (value === "Incorrect") {
            return '<i class="bi bi-x-square-fill text-danger"></i>';
            } else if (value === "Not answered") {
            return '<i class="bi bi-question-circle-fill text-warning"></i>';
            }
            return value;
        };

        //sorting agar Q muncul berurutan
        const sortedQKeys = Object.keys(item)
            .filter(key => key.startsWith("Q"))
            .sort((a, b) => {
            const indexA = parseInt(a.slice(1));
            const indexB = parseInt(b.slice(1));
            return indexA - indexB;
        });

        for (const key of sortedQKeys) {
            rowData.push(getIconByQValue(item[key]));
        }
         

        dataTableData.push(rowData);
    });
    console.log(dataTableData);
    //buat datatables
    table = $('#table_quiz').DataTable({
        destroy: true,
        data: dataTableData,
        scrollY:"500px",
        scrollX: true,
        footer: true,
        autoWidth: false,
        paging: false,
        searching: true,
        info: true,
        dom: 'lfrtip',
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/id.json',
        },
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
    });
    $('.dt-buttons').hide();


    var keticon =`    
        <i class="bi bi-question-circle-fill text-warning mr-2"></i><span class="mr-4">: Tidak Dijawab</span>
        <i class="bi bi-check-square-fill text-success mr-2"></i><span class="mr-4">: Benar</span>
        <i class="bi bi-x-square-fill text-danger mr-2"></i><span class="mr-4">: Salah</span>       
    `;
    $('#ketIcon').append(keticon);

}


//////////////////////////////General//////////////////////////////
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
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        };
    
        const locale = 'id-ID';
        return new Date(unixTimestamp * 1000).toLocaleString(locale, options);
}

function sweetAlertFail(){
    var alert = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <b>Tidak ada Kuis/Tugas yang tersedia</b>, silahkan pilih topik lainnya
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
    $('#alert').append(alert);
}

function blockiconVis(){
    // Disable pointer events to prevent further clicks on the icon
    $('#vis_grade_icon').css('pointer-events', 'none');
}

function blockiconTable(){
    // Disable pointer events to prevent further clicks on the icon
    $('#table_grade_icon').css('pointer-events', 'none');

}