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

    var showMean = '<p class="mb-0">Rata-rata nilai mahasiswa:</p><h4 class="font-weight-bold" id="mean">' + mean + '</h4>';
    var showSubmissionPercent = '<p class="mb-0">Ketepatan waktu pengumpulan tugas: </p><h4 class ="font-weight-bold">91 %</h4>';
    // console.log('Mean grade:', mean);
    $('#meanGrade').append(showMean);
    $('#submissionPercent').append(showSubmissionPercent);
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

            var buttonEditAll = '<button type="button" id="editAll" class="btn btn-warning bnt-sm">Ubah Semua</button>';
            $('#btnEditAll').append(buttonEditAll);


            //btnEditAll on click
            //kirim data response
            $('#btnEditAll').on('click', '#editAll', function() {
                getEditGradeModuleAll(response);
            });
            //

            //append kedalam card untuk setiap data
            //yang di masukkan adalahh smeua, kalau bis jadikan
            // data- aja yang id id itu

            //cek mod
            if (response[0]['itemmodule'] == 'assign') {
                //mod assign
                for (var i = 0; i < response.length; i++) {

                    var module = response[i];
                    console.log(module.itemnumber);
                    var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body d-flex align-items-center">';
                    gradeCard += '<h6 class="card-title" id="studentName-' + i + '" data-userid="' + module.userid + '">' + module.userfullname + '</h6>';
                    gradeCard += '</div></div><div class="col-md-4"><div class="card-body d-flex align-items-center">';

                    if (module.submissionstatus == 'submitted ontime') {
                        var status = 'Mengumpulkan tugas tepat waktu';
                    } else if (module.submissionstatus == 'late submitted') {
                        var status = 'Telat mengumpulkan tugas';
                    } else {
                        var status = 'Tidak dapat menemukan tugas'
                    }

                    var gradeColor = module.grade >= 50 ? 'text-success' : 'text-danger'; // Set text color to green (success) if grade is greater than or equal to 50

                    gradeCard += '<p class="card-text text-center" id="status-' + i + '"><small class="text-muted">' + status + '</small></p></div></div>';
                    gradeCard += '<div class="col-md-2"><div class="card-body d-flex align-items-center">';
                    gradeCard += '<h4 class="card-title text-center ' + gradeColor + '" id="grade-' + i + '" data-mod="' + module.itemmodule + '" data-itemnumber="' + module.itemnumber + '">' + module.grade + '</h4></div></div>';
                    gradeCard += '<div class="col-md-2"><div class="card-body d-flex align-items-center"><button type="button" class="btn btn-outline-secondary btn-sm" id="btnEditGrade" data-index="' + i + '">Ubah</button></div></div>';
                    gradeCard += '</div></div>';
                    console.log(gradeCard);
                    $('#gradeCard').append(gradeCard);

                    //hitung ketepatan waktu pengumpulan tugas
                    //append ke ke view

                }

            } else if (response[0]['itemmodule'] == 'quiz') {
                for (var i = 0; i < response.length; i++) {

                    var module = response[i];
                    var gradeCard = '<div class="card mb-3"><div class="row"><div class="col-md-4"> <div class="card-body">';
                    gradeCard += '<h6 class="card-title">' + module.userfullname + '</h6>';
                    gradeCard += '</div></div><div class="col-md-6"><div class="card-body"><p class="card-text">';
                    gradeCard += '</div></div><div class="col-md-2"><div class="card-body">';
                    gradeCard += '<h5 class="card-title">' + module.grade + '</h5>';
                    gradeCard += '</div></div></div></div>';
                    $('#gradeCard').append(gradeCard);

                }

            }
            getMeanGradeModule(response);
        }

    });
}

function getEditGradeModule(courseid, activityid, token, studentId, studentName, grade, itemModule, itemNumber, mean, status) {

    var studentInfo = '<h3 class="font-weight-bolder pr-10 mb-0">' + studentName + '</h3>';
    studentInfo += '<p class="card-text text-left"><small class="text-muted">' + status + '</small></p>';
    var meanGrade = '<p class="mb-0">Rata-rata nilai mahasiswa:</p><h4 class="font-weight-bold">' + mean + '</h4>';

    // Append the input element and button to studentGrade
    var studentGrade = '<div>';
    studentGrade += '<label for="gradeInput">Nilai Mahasiswa</label>';
    studentGrade += '<div class="input-group input-group-lg">';
    studentGrade += '<input type="text" class="form-control"  id="gradeInput" value="' + grade + '">';
    studentGrade += '<div class = "input-group-append">';
    studentGrade += '<button class="btn btn-primary" type="button" id="updateButton">Ubah</button>';
    studentGrade += '<button class = "btn btn-danger" type = "button" onclick="window.location.reload()">Batal</button>';
    studentGrade += '</div></div></div>';

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

        // Mengirim data ke AJAX
        // Gantilah dengan kode AJAX sesuai kebutuhan Anda
        // Misalnya:
        $.ajax({
            url: `${BASE_URL}gradebook/updateModuleGrade`,
            method: 'GET',
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

    var buttonEditAll = '<button type="button" data-count="' + response.length + '" class="btn btn-success" id="updateButton">Ubah Semua</button>';
    buttonEditAll += '<button class = "btn btn-danger ml-2" type = "button" onclick="window.location.reload()">Batal</button>';
    $('#btnEditAll').append(buttonEditAll);
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
    console.log(dataGrade);
    $.ajax({
        url: `${BASE_URL}gradebook/updateModuleGradeAll`,
        method: 'GET',
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
    //kirim array grade ke ajax


    //value didalam array 
    // studentid: studentId,
    // itemModule: itemModule,
    // itemNumber: itemNumber,
    //gradeValue
    //{studentid, itemmodule, itemnumber, gradevalue}

    // if($itemModule=='assign'){
    //     $source='assignment';
    //     $component='mod_assign';
    // }else if($itemModule =='quiz'){
    //     $source='quiz';
    //     $component='mod_quiz';
    // }

    // ke controller loop untuk semua data


    //append input untuk semua data
    //get data asssignment mod
    //Ajax here



    //get data quiz mod

}