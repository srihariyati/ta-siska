<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Gradebook | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
<div class="container mt-7 mb-3">

      <div class="row">

        <div class="col-md-6">
        <!-- pake js aja? -->
        <h2 class="font-weight-bolder pr-10" id="courseTitle" data-courseid="<?= $courseid; ?>" data-token="<?= $token; ?>"></h2>
        </div>
        <div class="col-md-6">
        </div>

      </div>

      <nav class="nav-menu mt-2">
        <a href="#" class="nav-menu-link ">Aktivitas</a>
        <a href="#" class="nav-menu-link active">Nilai</a>
      </nav>
</div>


  <div class="container">
  <div class="row">
    <div class="col col-lg-6">
      <h3 class="font-weight-bolder pr-10 mb-0 mt-2">Gradebook</h3>
    </div>
    <div class="col col-lg-2"></div>
    <div class="col col-lg-2">
      <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Export</span>
        </button>   
        <ul class="dropdown-menu w-100" aria-labelledby="exportDropdown">
          <li><a id="exportPdf" class="dropdown-item export-btn" data-type="pdf" href="#">.pdf</a></li>
          <li><a id="exportExcel" class="dropdown-item export-btn" data-type="excel" href="#">.xlsx</a></li>
        </ul>
      </div>
    </div>

    <div class="col col-lg-2">
    <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Semua</span>
        </button>   
      
        <ul class="dropdown-menu w-100" aria-labelledby="modType">
          <li><a id="modQuiz" class="dropdown-item" data-type="quiz" href="#">Kuis</a></li>
          <li><a id="modAssign" class="dropdown-item" data-type="assign" href="#">Tugas</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- tabel  nilai kuis -->
  <div class="row mt-4">
    <div class="table-container">
      <table class="table table-sm table-hover" style="width:100%" id="tableGradebook"></table>
    </div>   
  </div>


</div>

<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/buttons.print.min.js"></script>
<script src="https://cdn.datatables.net/fixedheader/3.2.0/js/dataTables.fixedHeader.min.js"></script>
<script src="https://cdn.datatables.net/fixedcolumns/3.3.3/js/dataTables.fixedColumns.min.js"></script>

<script src = "/js/d3.v7.min.js"></script>
<script src= "/js/view/gradebook.js"></script>

<script>
    $(document).ready(function() {
    //$courseid
    //$token
    
    getCourseName();
    handleTableGradebook();

    // Export as PDF button click event handler
    $(document).on('click', '#exportPdf', function() {
      $('#tableGradebook').DataTable().button('.buttons-pdf').trigger();
    });

    $('#exportExcel').on('click', function(){
      $('#tableGradebook').DataTable().button('.buttons-excel').trigger();
     });    

     $('#modQuiz').on('click', function(){
     //select quiz
     //handle table quiz
     handleTableGradebookQuiz();
     });    

     $('#modAssign').on('click', function(){
     //select Assign
     handleTableGradebookAssign();
     });  

    });

  </script>
<?= $this->endSection('jshere') ?>