//appendload
function loadAnimation_sm(id) {
    var load = '<div class="spinner-border spinner-border-sm" role="status"></div>';
    load += '<p> Memuat data...</p>'
    $('#' + id).append(load);
}

function loadAnimation_lg(id) {
    var load = '<div class="d-flex justify-content-center"><div class="spinner-border spinner-border-lg m-5" role="status"></div></div>';
    load += '<p class="text-center"> Memuat data...</p>'
    $('#' + id).append(load);
}

function removeAnimation(id) {
    $('#' + id).empty();
}