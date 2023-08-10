var courseId;
var token;
var table;

function handleTableGradebook() {
    $('#guide').empty();
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');
    console.log(token);
    console.log(courseId);

    sweetAlertLoad('Memuat tabel');
    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'POST',
        data: {
            token: token,
            courseid: courseId,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            swal.close();
            showTableGradebook(response);
            guideAlert('Tugas dan Kuis');
          
        }
    });
}

function handleTableGradebookQuiz() {   
    $('#guide').empty();
    var mod = 'quiz';
   sweetAlertLoad('Memuat tabel');
    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'POST',
        data: {
            token: token,
            courseid: courseId,
            mod: mod,
        },
        dataType: 'json',
        success: function(response) {
            Swal.close();
            console.log(response);
            showTableGradebook(response);
            guideAlert('Kuis');
         
        }
    });
}

function handleTableGradebookAssign() {
    $('#guide').empty();
    var mod = 'assign';
    sweetAlertLoad('Memuat tabel');

    console.log("handleTableGradebookAssign", courseId);
    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook`,
        method: 'POST',
        data: {
            token: token,
            courseid: courseId,
            mod: mod,
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            Swal.close();
            showTableGradebook(response);
            guideAlert('Tugas');
          
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
        var headerData=[`
            <form  method="POST" action="${BASE_URL}gradebook/getModuleGradeView">
            <input type="hidden" name="itemid" value="${item.itemid}">
            <input type="hidden" name="token" value="${token}">
            <input type="hidden" name="courseid" value="${courseId}">
            <input type="hidden" name="cmid" value="${item.cmid}">
            <button type="submit" class="btn" style="text-align:left; padding-left:0px">${item.itemname}</button>            
            </form> 
        `];
        headerRow.push(headerData);
       
    });
    

    responseData.forEach(function(user) {
        var rowData =[`
            <form  method="POST" action="${BASE_URL}gradebook/getPersonalGrade">
                <input type="hidden" name="userid" value="${user.userid}">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="courseid" value="${courseId}">
                <button type="submit" class="btn" style="text-align:left; padding-left:6px">${user.userfullname}</button>
            </form>       
        `];

        user.grades.forEach(function(item) {
            rowData.push(item.grade);
        });

        dataTableData.push(rowData);
    });

    console.log(dataTableData);

    table = $('#tableGradebook').DataTable({
        destroy: true,
        data: dataTableData,
        scrollX: true,
        footer: true,
        autoWidth: false,
        columnsDefs: [
            { width: '100%', targets: 0 },
        ],
        columns: [
            { title: 'Nama Mahasiswa' }, // Set title for 'Nama Mahasiswa' column
            ...headerRow.map(function(item) {
                return { title: item[0] }; // Set title for other columns
            })
        ],
        paging: false,
        searching: true,
        info: true,
        dom: 'Blfrtip',
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/id.json',
        },
        buttons: [{
                extend: 'pdf',
                className: 'hide-export',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':visible'
                },
            },
            {
                extend: 'excel',
                className: 'hide-export',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':visible'
                },
            },
        ],
        initComplete: function () {
            $('.dt-buttons').hide()
        }
    });
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
        method: 'POST',
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
        method: 'POST',
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
        method: 'POST',
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

    var showMean = '<p class="mb-0">Rata-rata nilai mahasiswa:</p><h4 class="font-weight-bold" id="mean">' + mean + '</h4>';
    //var showSubmissionPercent = '<p class="mb-0">Ketepatan waktu pengumpulan tugas: </p><h4 class ="font-weight-bold">91 %</h4>';
    // console.log('Mean grade:', mean);
    $('#meanGrade').append(showMean);
    //$('#submissionPercent').append(showSubmissionPercent);
}

function getSubmissionTimeliness() {

    var token = $('#courseTitle').data('token');
    var courseId = $('#courseTitle').data('courseid');
    var assignId = $('#contentModule').data('id');

    //get all course participant

    $.ajax({
        url: `${BASE_URL}course/getCourseParticipant`,
        method: 'POST',
        data:{
            token:token,
            courseid:courseId,
        },
        dataType: 'json',
        success: function(response) {
            courseParticipant = response.length;
            console.log("course participant : " + courseParticipant);
        }
    });

    //get submission participant
    $.ajax({
        url: `${BASE_URL}course/getSubmittedParticipant`,
        method: 'POST',
        data:{
            courseid:courseId,
            assignid:assignId,
            groupid:groupId,
        },
        dataType: 'json',
        success: function(response) {
            var submittedParticipant = response.length;
            console.log("submittedparticipant : " + submittedParticipant);
        }
    });
}

function getModuleGrade(instanceid, cmid, courseId, token, itemid) {
    $('#gradeCard').empty();
    sweetAlertLoad('Memuat data');

    $.ajax({
        url: `${BASE_URL}gradebook/getModuleGrade`,
        method: 'POST',
        data: {
            token: token,
            courseid: courseId,
            cmid: cmid,
            instanceid: instanceid,
            itemid: itemid
        },
        dataType: 'json',
        success: function(response) {
            Swal.close();
            console.log(response);

            var buttonEditAll = '<button type="button" id="editAll" class="btn btn-warning bnt-sm">Ubah Semua</button>';
            $('#btnEditAll').append(buttonEditAll);

            //tambahkan link kembali ke atas setelah semua card muncul
            $('#backTopButton').empty();
            var backtop =`<a href="#"> <i class="bi bi-arrow-up-square-fill pr-2"></i>Kembali ke atas</a>`;
            $('#backTopButton').append(backtop);

            //btnEditAll on click
            //kirim data response
            $('#btnEditAll').on('click', '#editAll', function() {
                getEditGradeModuleAll(response);
            });

            //cek mod
            if (response[0]['itemmodule'] == 'assign') {

                //hitung persentase submission
                var submittedontime = 0;
                var count = response.length;
                for (var i = 0; i < response.length; i++) {

                    //hitung jumlah data dengan submittedontime
                    if (response[i].submissionstatus == 'submitted ontime') {
                        submittedontime++;
                    }
                }
                var submissionPercent = ((submittedontime / count) * 100).toFixed(2);


                //mod assign
                var showSubmissionPercent = '<p class="mb-0">Ketepatan waktu pengumpulan tugas: </p><h4 class ="font-weight-bold">' + submissionPercent + '%  </h4>';
                $('#submissionPercent').append(showSubmissionPercent);
                for (var i = 0; i < response.length; i++) {

                    var module = response[i];
                    //console.log(module.itemnumber);
                    
                    if (module.submissionstatus == 'submitted ontime') {
                        var status = 'Mengumpulkan tugas tepat waktu';
                    } else if (module.submissionstatus == 'late submitted') {
                        var status = 'Telat mengumpulkan tugas';
                    } else {
                        var status = 'Tidak dapat menemukan tugas'
                    }

                    var gradeColor = module.grade >= 50 ? 'text-success' : 'text-danger'; // Set text color to green (success) if grade is greater than or equal to 50

                    var gradeCard = `
                        <div class="card mb-3">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card-body d-flex align-items-center">
                                        <h6 class="card-title" id="studentName-${i}" data-userid="${module.userid}">${module.userfullname}</h6>
                                    </div>
                                </div>
                                
                                <div class="col-md-4">
                                    <div class="card-body d-flex align-items-center">
                                        <p class="card-text text-center" id="status-${i}">
                                            <small class="text-muted">${status}</small>
                                        </p>
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <div class="card-body d-flex align-items-center">
                                        <h4 class="card-title text-center ${gradeColor}" id="grade-${i}" data-mod="${module.itemmodule}" data-itemnumber="${module.itemnumber}">${module.grade}</h4>
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <div class="card-body d-flex align-items-center">
                                        <button type="button" class="btn btn-outline-secondary btn-sm" id="btnEditGrade" data-index="${i}">Ubah</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `

                    console.log(gradeCard);
                    $('#gradeCard').append(gradeCard);

                    //hitung ketepatan waktu pengumpulan tugas
                    //append ke ke view

                }

            } else if (response[0]['itemmodule'] == 'quiz') {

                for (var i = 0; i < response.length; i++) {

                    var module = response[i];
                    console.log(module.itemnumber);
                    var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body d-flex align-items-center">';
                    gradeCard += '<h6 class="card-title" id="studentName-' + i + '" data-userid="' + module.userid + '">' + module.userfullname + '</h6>';
                    gradeCard += '</div></div><div class="col-md-4"><div class="card-body d-flex align-items-center">';

                    var gradeColor = module.grade >= 50 ? 'text-success' : 'text-danger'; // Set text color to green (success) if grade is greater than or equal to 50

                    gradeCard += '</div></div>';
                    gradeCard += '<div class="col-md-2"><div class="card-body d-flex align-items-center">';
                    gradeCard += '<h4 class="card-title text-center ' + gradeColor + '" id="grade-' + i + '" data-mod="' + module.itemmodule + '" data-itemnumber="' + module.itemnumber + '">' + module.grade + '</h4></div></div>';
                    gradeCard += '<div class="col-md-2"><div class="card-body d-flex align-items-center"><button type="button" class="btn btn-outline-secondary btn-sm" id="btnEditGrade" data-index="' + i + '">Ubah</button></div></div>';
                    gradeCard += '</div></div>';
                    console.log(gradeCard);
                    $('#gradeCard').append(gradeCard);

                }
                //$('#submissionPercent').empty();

            }
            getMeanGradeModule(response);
        }

    });
}

function getEditGradeModule(courseid, activityid, token, studentId, studentName, grade, itemModule, itemNumber, mean, status) {
    $('#backTopButton').empty();

    var studentInfo = '<h3 class="font-weight-bolder pr-10 mb-0">' + studentName + '</h3>';
    studentInfo += '<p class="card-text text-left"><small class="text-muted">' + status + '</small></p>';
    var meanGrade = '<p class="mb-0">Rata-rata nilai mahasiswa:</p><h4 class="font-weight-bold">' + mean + '</h4>';

    // Append the input element and button to studentGrade
    var studentGrade = `
        <div>
            <label for="gradeInput">Nilai Mahasiswa</label>
            <div class="input-group input-group-lg">
                <input type="text" class="form-control"  id="gradeInput" value="${grade}">
                <div class = "input-group-append">
                    <button class="btn btn-primary" type="button" id="updateButton">Ubah</button>
                    <button class = "btn btn-danger" type = "button" onclick="window.location.reload()">Batal</button>
                </div>
            </div>
        </div>
    `

    $('#studentInfo').append(studentInfo);
    $('#submissionPercent').append(meanGrade);
    $('#studentGrade').append(studentGrade);

    //go to controller to return view data user to edit
    //with url

    //nilai yang dinput harus angka dan minimal 0 serta maksimal 100
    $('#gradeInput').on('input', function() {
        var value = $(this).val();

        // Remove any non-numeric characters
        value = value.replace(/[^0-9]/g, '');

        // Limit the value to the range of 0 to 100
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }

        // Update the input value
        $(this).val(value);
    });

    // Menambahkan event listener pada tombol "Ubah"
    var updateButton = document.getElementById('updateButton');
    updateButton.addEventListener('click', function() {
        // Mengambil nilai dari input
        var gradeValue = document.getElementById('gradeInput').value;
        //console.log(courseid, activityid, token, studentId, itemModule, itemNumber, gradeValue);

       sweetAlertLoad('Mengubah data');
        // Misalnya:
        $.ajax({
            url: `${BASE_URL}gradebook/updateModuleGrade`,
            method: 'POST',
            data: {
                grade: gradeValue,
                courseid: courseid,
                activityid: activityid,
                studentid: studentId,
                itemModule: itemModule,
                itemNumber: itemNumber,
                token: token,
            },
            success: function(response) {

                // Aksi setelah berhasil mengirim data
                //jika respone == 0 
                //reload page
                if (response == 0) {
                    console.log(response);
                    Swal.close();

                    Swal.fire('Berhasil!', 'Yey! Berhasil mempengaruhi data', 'success');
                    //kasih delay
                    setTimeout(function() {
                        window.location.reload();
                    }, 2000); // 2000 milliseconds = 2 seconds delay
                } else {
                    Swal.fire('Gagal!', 'Gagal memperbarui data', 'error');
                    //kasih delay
                    setTimeout(function() {
                        window.location.reload();
                    }, 2000); // 2000 milliseconds = 2 seconds delay

                }
            },
            error: function(xhr, status, error) {
                // Aksi jika terjadi kesalahan saat mengirim data
            }
        });
    });

}

function getEditGradeModuleAll(response) {
    console.log(response);
    $('#gradeCard').empty();
    $('#submissionPercent').empty();
    $('#meanGrade').empty();
    $('#btnEditAll').empty();

    if (response[0]['itemmodule'] == 'assign') {
        //mod assign
        for (var i = 0; i < response.length; i++) {

            var module = response[i];
            var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body d-flex align-items-center">';
            gradeCard += '<h6 class="card-title" id="studentName-' + i + '" data-userid="' + module.userid + '"data-itemmodule="' + module.itemmodule + '" data-itemnumber="' + module.itemnumber + '">' + module.userfullname + '</h6>';
            gradeCard += '</div></div><div class="col-md-4"><div class="card-body d-flex align-items-center">';

            if (module.submissionstatus == 'submitted ontime') {
                var status = 'Mengumpulkan tugas tepat waktu';
            } else if (module.submissionstatus == 'late submitted') {
                var status = 'Telat mengumpulkan tugas';
            } else {
                var status = 'Tidak dapat menemukan tugas';
            }

            gradeCard += '<p class="card-text text-center" id="status-' + i + '"><small class="text-muted">' + status + '</small></p></div></div>';
            gradeCard += '<div class="col-md-2 d-flex justify-content-center"><div class="card-body ">';
            // Append the input element and button to studentGrade

            gradeCard += '<div class="input-group input-group-lg">';
            gradeCard += '<input type="number" class="form-control" min="0" max="100"  id="gradeInput-' + i + '" value="' + module.grade + '"></div>';
            gradeCard += '</div></div></div>';
            console.log(gradeCard);

            $('#gradeCard').append(gradeCard);

            //hitung ketepatan waktu pengumpulan tugas
            //append ke ke view
        }
    }
    if (response[0]['itemmodule'] == 'quiz') {
        //mod assign
        for (var i = 0; i < response.length; i++) {

            var module = response[i];
            var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body d-flex align-items-center">';
            gradeCard += '<h6 class="card-title" id="studentName-' + i + '" data-userid="' + module.userid + '"data-itemmodule="' + module.itemmodule + '" data-itemnumber="' + module.itemnumber + '">' + module.userfullname + '</h6>';
            gradeCard += '</div></div><div class="col-md-4"><div class="card-body d-flex align-items-center">';

            gradeCard += '</div></div>';
            gradeCard += '<div class="col-md-2 d-flex justify-content-center"><div class="card-body ">';
            // Append the input element and button to studentGrade

            gradeCard += '<div class="input-group input-group-lg">';
            gradeCard += '<input type="number" class="form-control" min="0" max="100"  id="gradeInput-' + i + '" value="' + module.grade + '"></div>';
            gradeCard += '</div></div></div>';
            console.log(gradeCard);

            $('#gradeCard').append(gradeCard);

            //hitung ketepatan waktu pengumpulan tugas
            //append ke ke view

        }
    }

    var buttonEditAll = '<button type="button" data-count="' + response.length + '" class="btn btn-success" id="updateButton">Ubah Semua</button>';
    buttonEditAll += '<button class = "btn btn-danger ml-2" type = "button" onclick="window.location.reload()">Batal</button>';
    $('#btnEditAll').append(buttonEditAll);

    //tambahkan link kembali ke atas setelah semua card muncul
    $('#backTopButton').empty();
    var backtop =`<a href="#"> <i class="bi bi-arrow-up-square-fill pr-2"></i>Kembali ke atas</a>`;
    $('#backTopButton').append(backtop);
}

function updateModuleGradeAll(countData) {
    var token = $('#courseTitle').data('token');
    var courseid = $('#courseTitle').data('courseid');
    var activityid = $('#contentModule').data('cmid');
    var itemModule = $('#studentName-0').data('itemmodule');


    console.log(token, courseid, activityid, itemModule);
    console.log(countData);

    // console.log(studentName, grade, itemModule, itemNumber, mean, status);
    //trigger btnEditAll on click
    //ambil semua value, masukkan kedalam array
    var dataGrade = [];
    for (var index = 0; index < countData; index++) {
        // Add an event listener to restrict input to numeric values
        $('#gradeInput-' + index).on('input', function() {
            var value = $(this).val();

            // Remove any non-numeric characters
            value = value.replace(/[^0-9]/g, '');

            // Limit the value to the range of 0 to 100
            if (value < 0) {
                value = 0;
            } else if (value > 100) {
                value = 100;
            }

            // Update the input value
            $(this).val(value);
        });


        //Retrieve the index and corresponding data

        var studentName = $('#studentName-' + index).text();
        var studentId = $('#studentName-' + index).data('userid');
        var grade = $('#gradeInput-' + index).val();
        var itemNumber = $('#studentName-' + index).data('itemnumber');

        //masukkan kedalam array
        // Create an object representing the data
        var dataObject = {
            studentName: studentName,
            studentId: studentId,
            grade: grade,
            itemNumber: itemNumber
        };

        // Push the data object into the array
        dataGrade.push(dataObject);
    }
    // Show loading alert before making the AJAX request
    sweetAlertLoad('Mengubah nilai');

    console.log(dataGrade);
    $.ajax({
        url: `${BASE_URL}gradebook/updateModuleGradeAll`,
        method: 'POST',
        data: {
            token: token,
            courseid: courseid,
            activityid: activityid,
            itemModule: itemModule,
            dataGrade: dataGrade
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            // Aksi setelah berhasil mengirim data
            //jika respone == 0 
            //reload page
            // Close the loading alert
            Swal.close();
            if (response == 0) {
                console.log(response);

                Swal.fire('Berhasil!', 'Yey! Berhasil memperbarui data', 'success');
                //kasih delay
                setTimeout(function() {
                    window.location.reload();
                }, 2000); // 2000 milliseconds = 2 seconds delay
            } else {
                Swal.fire('Gagal!', 'Gagal memperbarui data', 'error');
                //kasih delay
                setTimeout(function() {
                    window.location.reload();
                }, 2000); // 2000 milliseconds = 2 seconds delay

            }
        }
    });
}

function sweetAlertLoad(text) {
    Swal.fire({
        title: text,
        html: 'Silahkan tunggu...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

function guideAlert(tipe){
    var guide ='<div class="alert alert-success" role="alert">';
    guide += '<h4 class="alert-heading">Panduan💡</h4>',
    guide += '<ul style="list-style-type: disc !important; padding-left:px !important; margin-left:1em;">';
    guide += '<li>Klik salah satu '+tipe+' untuk <b>mengubah nilai</b></li>';
    guide += '<li>klik salah satu nama mahasiswa untuk melihat <b>visualisasi data nilai mahasiswa</b></li>';
    guide += '</ul></div>';

    $('#guide').append(guide);
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; 
}


