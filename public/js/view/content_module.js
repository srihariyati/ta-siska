function handleCourseContentChange() {
    var contentId = $('#course_content').val();
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');

    console.log(contentId);

    $.ajax({
        url: `${BASE_URL}get-course-module?courseid=${courseId}&contentid=${contentId}&token=${token}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            $('#content_module').empty();
            for (var i = 0; i < response.length; i++) {
                var module = response[i];
                var option = '<option value=' + module.moduleId + '>' + module.moduleName + '</option>';
                $('#content_module').append(option);
            }
            handleContentModuleChange();

        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function handleContentModuleChange() {
    var moduleId = $('#content_module').val();
    console.log(moduleId);


}