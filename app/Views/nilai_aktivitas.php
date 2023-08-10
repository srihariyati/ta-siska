<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>SISKA | Nilai Aktivitas</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>

<div class="container-lg mt-7 mb-3">
  <div class="row pl-2">
    <a href="<?= base_url('beranda/getEnrolledCourses/') ?>"><span id="backButton" class="btn material-icon fa-1x p-2 "><i class="bi bi-caret-left-fill text-secondary"></i></span>Beranda</a>
  </div>


  <div class="row d-flex flex-row">
    <div class="col-md-6" style="display: flex; align-items: center;">
      <h2 class="font-weight-bolder pr-10" id="courseTitle" data-token = "<?=$token?>" data-courseid="<?=$courseid?>"></h2>
    </div>

    <div class="col-md-6">
    </div>

  </div>

  <nav class="nav-menu mt-2">
    <a href="<?= base_url('course/getCourseInfo/' . $courseid) ?>" class="nav-menu-link ">Aktivitas</a>
    <a href="<?=base_url('gradebook/getGradebookView/' . $courseid)?>" class="nav-menu-link active">Nilai</a>
  </nav>

</div>

<div class="container-lg">
  <div class="row mt-4">
    <div class="col-md-0">
      <!-- button back --> 
      <!-- on click kembali ke halaman nilai -->
      <a href="<?=base_url('gradebook/getGradebookView/' .$courseid)?>"><span id="backButton" class="btn material-icon fa-2x p-2""><i class="bi bi-arrow-left-square-fill"></i></span></a>
    </div>
    <div class="col-md-4">
      <h3 class="font-weight-bolder pr-10 mb-0"  id="contentModule" data-cmid = "<?=$cmid?>" data-itemid = "<?=$itemid?>"></h3>
      <p id="contentName"></p>
    </div>

    <div class="col d-flex justify-content-end">
      <!-- nnananana -->
      <span id="btnEditAll" class=""></span>
      
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

<div class="container-lg mt-4 mb-4">
  
  <div id="gradeCard">
    <!--  -->
  </div>
  <span class="d-flex justify-content-end" id="backTopButton"></span>

<!--   
  tambah div baru untuk update all grade
  <div id="gradeCardEdit" class="hidden">
  </div>
   -->
</div>

<div class="container-lg">
  <div class="row mt-4 mb-5">

    <div class="col-md-6">
      <span id="studentGrade"></span>
    </div>

    <div class="col-md-6">
    </div>
  
  </div>
</div>

<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<script src= "<?=str_replace('/index.php', '', base_url()) .'/js/view/gradebook.js'?>"></script>

<script>
    $(document).ready(function() {
      getCourseName();
      getContentModuleInfo();    
      
      // Add click event handler to the Edit button 
      $('#gradeCard').on('click', '#btnEditGrade', function() {
        $('#btnEditAll').empty();
        var token = $('#courseTitle').data('token');
        var courseid = $('#courseTitle').data('courseid');
        var activityid = $('#contentModule').data('cmid');

        // Retrieve the index and corresponding data (index sesuai data pada card)
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

      $('#backtoTop').on('click',function(){
        scrollToTop();
      });
      

    
    });

</script>
<?= $this->endSection('jshere') ?>
<table class="table table-bordered"><body><tr><td>Participants</td><td><span id = "courseParticipant"><span></td<tr><tr><td>Submitted</td><td><span id = "submittedParticipant"></span></td ></tr></tbody></table>