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

                        var openedDate = module.openedDate;
                        var closedDate = module.closedDate;

                        var formattedOpenedDate = formatUnixTimestamp(openedDate);
                        var formattedClosedDate = formatUnixTimestamp(closedDate);

                        var openedDate = '<p class="mt-2 mb-0" id="openedDate"><strong>Opened Date</strong> : ' + formattedOpenedDate + '</p>';
                        var closedDate = '<p class="mt-0 mb-0" id="closedDate"><strong>Closed Date</strong> : ' + formattedClosedDate + '</p>';

                        $('#modTitle').append(modName);
                        $('#openedDate').append(openedDate);
                        $('#closedDate').append(closedDate);

                        getCourseParticipant(token, courseId);
                        getSubmittedParticipant(token, module.assignId, module.groupId);

                        //ambil data participant tugas
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

function getCourseParticipant(token, courseId) {
    console.log(token);
    console.log(courseId);
    $('#courseParticipant').empty();


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


function getSubmittedParticipant(token, assignId, groupId) {

    console.log(token);
    console.log(assignId);
    console.log(groupId);

    //kolom submitted assignment
    //function mod_assign_list_participants :mendapatkan user dengan
    //ketentuan role:student dan submited:true
    $.ajax({
        url: `${BASE_URL}course/getSubmittedParticipant?token=${token}&assignid=${assignId}&groupid=${groupId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var submitedParticipant = response.length;
            console.log("submittedparticipant : " + submitedParticipant);
        }

    });


}