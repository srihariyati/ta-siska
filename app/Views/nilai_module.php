<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Edit Gradebook | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
<div class="container mt-7 mb-3">

  <div class="row">

    <div class="col-md-6">
          <h2 class="font-weight-bolder pr-10" id="courseTitle" data-token = "<?=$token?>" data-courseid="<?=$courseid?>"></h2>
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
  <div class="row mt-4">
    <div class="col-md-6">
     <h3 class="font-weight-bolder pr-10 mb-0"  id="contentModule" data-cmid = "<?=$cmid?>" data-itemid = "<?=$itemid?>"></h3>
      <p id="contentName"></p>
    </div>

    <div class="col-md-6 d-flex justify-content-end">
      <!-- nnananana -->
      <span id="btnEditAll" class="pr-4"></span>
      
    </div>
  </div>    
  <div class="row mt-4">

    <div class="col-md-4">
      <span id="meanGrade"></span>
      <span id="studentInfo"><span>     
    </div>

    <div class="col-md-4">
      <span id="submissionPercent"></span> 
    </div>

  </div>
</div>

<!-- ini pake ajax aja nanti -->
<div class="container mt-4">
  
  <span id="gradeCard"></span>

  <div class="row mt-4">
  <div class="col-md-6">
    <span id="studentGrade"></span>
  <div>
  <div class="col-md-6"></div>
  </div>
  
 <!-- diisni berisi chart data -->
</div>

<?= $this->endSection('content') ?>
<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src= "<?=base_url('/js/view/gradebook.js')?>"></script>

<script>
    $(document).ready(function() {
   
      // var modmodule = $('#contentModule').data('mod');  
      // console.log(modmodule);   
     
      getCourseName();
      getContentModuleInfo();    
      
      // Add click event handler to the Edit button
      $('#gradeCard').on('click', '#btnEditGrade', function() {
        $('#btnEditAll').empty();
        var token = $('#courseTitle').data('token');
        var courseid = $('#courseTitle').data('courseid');
        var activityid = $('#contentModule').data('cmid');

        // Retrieve the index and corresponding data
        var index = $(this).data('index');
        var studentName = $('#studentName-' + index).text();
        var studentId = $('#studentName-' + index).data('userid');
        var grade = $('#grade-' + index).text();
        var itemModule = $('#grade-' + index).data('mod');
        var itemNumber = $('#grade-' + index).data('itemnumber');
        var mean = $('#mean').text();
        var status = $('#status-' + index).text();
        // console.log(studentName, grade, itemModule, itemNumber, mean, status);

        $('#meanGrade').empty();
        $('#submissionPercent').empty();
        $('#gradeCard').empty();  

        // Add your desired functionality here
        getEditGradeModule(courseid, activityid, token, studentId, studentName, grade, itemModule, itemNumber, mean, status);
      });


      $('#btnEditAll').on('click', '#updateButton', function() {
        var countData = $('#updateButton').data('count');
        console.log(countData);

        updateModuleGradeAll(countData);
        //kirim panjang respone
        // response.length
      });
      

    
    });

</script>
<?= $this->endSection('jshere') ?>
<table class="table table-bordered"><body><tr><td>Participants</td><td><span id = "courseParticipant"><span></td<tr><tr><td>Submitted</td><td><span id = "submittedParticipant"></span></td ></tr></tbody></table>