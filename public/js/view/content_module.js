function handleCourseContentChange() {
    // mengambil content id untuk membuat dependent dropdown untuk module assign dan kuis
    // function dijalankan ketika user memilih content/topik mata kuliah pada dropdown menu pertama
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');

    console.log(contentId);

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
    console.log(courseId);

    $.ajax({
        url: `${BASE_URL}course/getModule?token=${token}&courseid=${courseId}&cmid=${moduleId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {

            console.log(response);
            $('#modTitle').empty();
            $('#openedDate').empty();
            $('#closedDate').empty();

            for (var i = 0; i < response.length; i++) {
                var module = response[i];

                //if response assign
                if (module.mod == "assign") {
                    console.log("assign nich");
                    //return halaman visdat tugas
                    for (var i = 0; i < response.length; i++) {
                        var module = response[i];
                        var modName = '<h3 class="font-weight-bolder pr-10 mb-0">' + module.assignName + '</h3>';

                        // var dueDateTimestamp = module.dueDate * 1000; // Convert to milliseconds
                        // var dueDateFormatted = moment(dueDateTimestamp).format('DD MMMM YYYY, hh:mm A');
                        //var dueDate = '<p class="mt-2 mb-0" id="dueDate"><strong>Due Date</strong>: ' + dueDateFormatted + '</p>';
                        // var unixTimestamp = module.dueDate; // Unix timestamp in seconds
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


                    //if response quiz
                } else if (module.mod == 'quiz') {
                    console.log("quiz nich");
                    //return halamn visdat kuis
                    for (var i = 0; i < response.length; i++) {
                        var module = response[i];
                        var modName = '<h3 class="font-weight-bolder pr-10 mb-0">' + module.quizName + '</h3>';
                        $('#modTitle').append(modName);
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