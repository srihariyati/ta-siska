function handleTableGradebook() {
    var courseId = $('#courseTitle').data('courseid');
    var token = $('#courseTitle').data('token');
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

function showTableGradebook(responseData) {
    // Get the table element by ID
    var table = document.getElementById('tableGradebook');

    // Create table headers
    var headerRow = document.createElement('tr');
    var userFullNameHeader = document.createElement('th');
    userFullNameHeader.textContent = 'Nama Mahasiswa';
    userFullNameHeader.style.width = '200px'; // Set the width of the header column
    headerRow.appendChild(userFullNameHeader);

    // Create an array to store the column totals
    var columnTotals = Array.from({ length: responseData[0].grades.length }, function() {
        return 0;
    });

    // Iterate over the first item in the data to get the item names
    var gradeItems = responseData[0].grades;
    gradeItems.forEach(function(item, index) {
        var itemNameHeader = document.createElement('th');
        itemNameHeader.textContent = item.itemname;
        itemNameHeader.style.width = '50px'; // Set the width of the header column
        headerRow.appendChild(itemNameHeader);
    });

    // Append the header row to the table
    table.appendChild(headerRow);

    // Iterate over the responseData to create rows for each user
    responseData.forEach(function(user) {
        var row = document.createElement('tr');

        // Add user full name cell
        var userFullNameCell = document.createElement('td');
        userFullNameCell.textContent = user.userfullname;
        row.appendChild(userFullNameCell);

        // Check if grades property exists and is an array
        if (user.grades && Array.isArray(user.grades)) {
            // Add grade cells for each item
            user.grades.forEach(function(item, index) {
                var gradeCell = document.createElement('td');
                gradeCell.textContent = item.grade;
                gradeCell.style.width = '50px'; // Set the width of the grade column
                row.appendChild(gradeCell);

                // Accumulate the grade value for calculating the mean later
                columnTotals[index] += item.grade;
            });
        }

        // Append the row to the table
        table.appendChild(row);
    });

    // Create table footer
    var tfoot = document.createElement('tfoot');
    var tfootRow = document.createElement('tr');

    // Create the "MEAN" cell for the first left column in the footer
    var meanFooterCell = document.createElement('td');
    meanFooterCell.textContent = 'MEAN';
    tfootRow.appendChild(meanFooterCell);

    // Calculate and create footer cells for grade means
    columnTotals.forEach(function(total) {
        var gradeMean = total / responseData.length; // Calculate the mean by dividing the total by the number of users
        var gradeFooterCell = document.createElement('td');
        gradeFooterCell.textContent = gradeMean.toFixed(2); // Set the mean value with 2 decimal places
        tfootRow.appendChild(gradeFooterCell);
    });

    tfoot.appendChild(tfootRow);

    // Append the table footer to the table
    table.appendChild(tfoot);

    console.log(responseData);
}