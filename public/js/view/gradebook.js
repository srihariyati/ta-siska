var courseId;
var token;
var table;

function handleTableGradebook() {
    courseId = $('#courseTitle').data('courseid');
    token = $('#courseTitle').data('token');
    console.log(token);

    $.ajax({
        url: `${BASE_URL}gradebook/getGradebook?token=${token}&courseid=${courseId}`,
        method: 'GET',
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
        url: `${BASE_URL}gradebook/getGradebook?token=${token}&courseid=${courseId}&mod=${mod}`,
        method: 'GET',
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
        url: `${BASE_URL}gradebook/getGradebook?token=${token}&courseid=${courseId}&mod=${mod}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            showTableGradebook(response);
        }
    });
}

function showTableGradebook(responseData) {
    if (table) {
        table.destroy();
    }

    $('#tableGradebook').empty();

    var dataTableData = [];
    var headerRow = [];
    responseData[0].grades.forEach(function(item) {
        headerRow.push(item.itemname);
    });

    responseData.forEach(function(user) {
        var rowData = [`<a href='${BASE_URL}/login/token' target='_blank'>${user.userfullname}</a>`];
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
    // $('#tableGradebook tbody tr').css('width', '500px');


    // // Calculate the mean for each column
    // table.columns().every(function() {
    //     var column = this;
    //     if (column.index() > 0) {
    //         var columnData = column.data();
    //         var columnMean = columnData.reduce(function(sum, value) {
    //             return sum + parseFloat(value);
    //         }, 0) / columnData.length;
    //         $(column.footer()).html(columnMean.toFixed(2));
    //     }
    // });

    $('.dt-buttons').hide();
}