var courseId;
var token;

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

            // // Convert the responseData to a DataTable-compatible format
            // var dataTableData = [];

            // // Create table headers
            // var headerRow = ['Nama Mahasiswa'];
            // var gradeItems = response[0].grades;
            // gradeItems.forEach(function(item) {
            //     headerRow.push(item.itemname);
            // });
            // dataTableData.push(headerRow);

            // // Iterate over the responseData to create rows for each user
            // response.forEach(function(user) {
            //     var rowData = [];
            //     rowData.push(user.userfullname);

            //     if (user.grades && Array.isArray(user.grades)) {
            //         user.grades.forEach(function(item) {
            //             rowData.push(item.grade);
            //         });
            //     }

            //     dataTableData.push(rowData);
            // });

            // // Create DataTable instance
            // var table = $('#tableGradebook').DataTable({
            //     data: dataTableData,
            //     paging: false,
            //     searching: false,
            //     info: false
            // });

            // // Calculate column totals for the mean
            // var columnTotals = Array.from({ length: gradeItems.length }, function() {
            //     return 0;
            // });

            // table.columns().every(function() {
            //     var column = this;

            //     if (column.index() > 0) {
            //         var data = column.data();

            //         data.each(function(value, index) {
            //             if (!isNaN(value)) {
            //                 columnTotals[index - 1] += parseFloat(value);
            //             }
            //         });
            //     }
            // });

            // // Calculate and create footer cells for grade means
            // var meanFooterRow = ['MEAN'];
            // columnTotals.forEach(function(total) {
            //     var gradeMean = total / response.length;
            //     meanFooterRow.push(gradeMean.toFixed(2));
            // });

            // table.row.add(meanFooterRow).draw('page');
            showTableGradebook(response)
        }
    });
}


// function showTableGradebook(responseData) {
//     // Get the table element by ID
//     var table = document.getElementById('tableGradebook');

//     // Create table headers
//     var headerRow = document.createElement('tr');
//     var userFullNameHeader = document.createElement('th');
//     userFullNameHeader.textContent = 'Nama Mahasiswa';
//     userFullNameHeader.style.width = '200px'; // Set the width of the header column
//     headerRow.appendChild(userFullNameHeader);

//     // Create an array to store the column totals
//     var columnTotals = Array.from({ length: responseData[0].grades.length }, function() {
//         return 0;
//     });

//     // Iterate over the first item in the data to get the item names
//     var gradeItems = responseData[0].grades;
//     gradeItems.forEach(function(item, index) {
//         var itemNameHeader = document.createElement('th');
//         itemNameHeader.textContent = item.itemname;
//         itemNameHeader.style.width = '50px'; // Set the width of the header column
//         headerRow.appendChild(itemNameHeader);
//     });

//     // Append the header row to the table
//     table.appendChild(headerRow);

//     // Iterate over the responseData to create rows for each user
//     responseData.forEach(function(user) {
//         var row = document.createElement('tr');

//         // Add user full name cell
//         var userFullNameCell = document.createElement('td');
//         userFullNameCell.textContent = user.userfullname;
//         row.appendChild(userFullNameCell);

//         // Check if grades property exists and is an array
//         if (user.grades && Array.isArray(user.grades)) {
//             // Add grade cells for each item
//             user.grades.forEach(function(item, index) {
//                 var gradeCell = document.createElement('td');
//                 gradeCell.textContent = item.grade;
//                 gradeCell.style.width = '50px'; // Set the width of the grade column
//                 row.appendChild(gradeCell);

//                 // Accumulate the grade value for calculating the mean later
//                 columnTotals[index] += item.grade;
//             });
//         }

//         // Append the row to the table
//         table.appendChild(row);
//     });

//     // Create table footer
//     var tfoot = document.createElement('tfoot');
//     var tfootRow = document.createElement('tr');

//     // Create the "MEAN" cell for the first left column in the footer
//     var meanFooterCell = document.createElement('td');
//     meanFooterCell.textContent = 'MEAN';
//     tfootRow.appendChild(meanFooterCell);

//     // Calculate and create footer cells for grade means
//     columnTotals.forEach(function(total) {
//         var gradeMean = total / responseData.length; // Calculate the mean by dividing the total by the number of users
//         var gradeFooterCell = document.createElement('td');
//         gradeFooterCell.textContent = gradeMean.toFixed(2); // Set the mean value with 2 decimal places
//         tfootRow.appendChild(gradeFooterCell);
//     });

//     tfoot.appendChild(tfootRow);

//     // Append the table footer to the table
//     table.appendChild(tfoot);

//     console.log(responseData);
// }

// function showTableGradebook(responseData) {
//     // Create DataTable-compatible data array
//     var dataTableData = [];

//     // Add table headers
//     var headerRow = ['Nama Mahasiswa'];
//     var gradeItems = responseData[0].grades;
//     gradeItems.forEach(function(item) {
//         headerRow.push(item.itemname);
//     });
//     dataTableData.push(headerRow);

//     // Iterate over the responseData to create rows for each user
//     responseData.forEach(function(user) {
//         var rowData = [];
//         rowData.push(user.userfullname);

//         if (user.grades && Array.isArray(user.grades)) {
//             user.grades.forEach(function(item) {
//                 rowData.push(item.grade);
//             });
//         }

//         dataTableData.push(rowData);
//     });

//     // Create DataTable instance
//     var table = $('#tableGradebook').DataTable({
//         data: dataTableData,
//         paging: false,
//         searching: false,
//         info: false
//     });

//     // Calculate column totals for the mean
//     var columnTotals = Array.from({ length: gradeItems.length }, function() {
//         return 0;
//     });

//     table.columns().every(function() {
//         var column = this;

//         if (column.index() > 0) {
//             var data = column.data();

//             data.each(function(value, index) {
//                 if (!isNaN(value)) {
//                     columnTotals[index - 1] += parseFloat(value);
//                 }
//             });
//         }
//     });

//     // Calculate and create footer cells for grade means
//     var meanFooterRow = ['MEAN'];
//     columnTotals.forEach(function(total) {
//         var gradeMean = total / responseData.length;
//         meanFooterRow.push(gradeMean.toFixed(2));
//     });

//     table.row.add(meanFooterRow).draw('page');

//     console.log(responseData);
// }

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
    // Prepare the DataTables data array
    var dataTableData = [];

    // Add the header row
    var headerRow = ['Nama Mahasiswa'];
    responseData[0].grades.forEach(function(item) {
        headerRow.push(item.itemname);
    });
    dataTableData.push(headerRow);

    // Add the data rows
    responseData.forEach(function(user) {
        var rowData = [user.userfullname];
        user.grades.forEach(function(item) {
            rowData.push(item.grade);
        });
        dataTableData.push(rowData);
    });

    // Initialize DataTables
    var table = $('#tableGradebook').DataTable({
        data: dataTableData,
        destroy: true,
        columns: [
            { title: 'Nama Mahasiswa' },
            // Generate column definitions for each grade item
            ...responseData[0].grades.map(function(item) {
                return { title: item.itemname };
            })
        ],
        paging: true,
        searching: true,
        info: false,
        dom: 'Bfrtip', // Add the dom option for buttons
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
        ]
    });



    // Calculate the mean for each column
    table.columns().every(function() {
        var column = this;
        if (column.index() > 0) {
            var data = column.data();
            var columnMean = data.reduce(function(sum, value) {
                return sum + parseFloat(value);
            }, 0) / data.length;

            $(column.footer()).html(columnMean.toFixed(2));
        }
    });
    // Hide the buttons
    $('.dt-buttons').hide();
}

// function showTableGradebookQuiz(responseData) {

//     // Prepare the DataTables data array
//     var dataTableData = [];

//     // Add the header row
//     var headerRow = ['Nama Mahasiswa'];
//     responseData[0].grades.forEach(function(item) {
//         headerRow.push(item.itemname);
//     });
//     dataTableData.push(headerRow);

//     // Add the data rows
//     responseData.forEach(function(user) {
//         var rowData = [user.userfullname];
//         user.grades.forEach(function(item) {
//             rowData.push(item.grade);
//         });
//         dataTableData.push(rowData);
//     });

//     // Initialize DataTables
//     var table = $('#tableGradebook').DataTable({
//         destroy: true,
//         data: dataTableData,
//         columns: [
//             { title: 'Nama Mahasiswa' },
//             // Generate column definitions for each grade item
//             ...responseData[0].grades.map(function(item) {
//                 return { title: item.itemname };
//             })
//         ],
//         paging: true,
//         searching: true,
//         info: false,
//         dom: 'Bfrtip', // Add the dom option for buttons
//         buttons: [{
//                 extend: 'pdf',
//                 orientation: 'landscape',
//                 exportOptions: {
//                     columns: ':visible'
//                 },
//             },
//             {
//                 extend: 'excel',
//                 orientation: 'landscape',
//                 exportOptions: {
//                     columns: ':visible'
//                 },
//             },
//             'copy'
//         ]
//     });



//     // Calculate the mean for each column
//     table.columns().every(function() {
//         var column = this;
//         if (column.index() > 0) {
//             var data = column.data();
//             var columnMean = data.reduce(function(sum, value) {
//                 return sum + parseFloat(value);
//             }, 0) / data.length;

//             $(column.footer()).html(columnMean.toFixed(2));
//         }
//     });
//     // Hide the buttons
//     $('.dt-buttons').hide();
// }