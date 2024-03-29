<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Visualisasi Data Tugas | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>

<div class="container mt-7 mb-3">

      <div class="row">

        <div class="col-md-6">
        <h2 class="font-weight-bolder pr-10" id="courseTitle" data-courseid="<?= $courseid; ?>" data-token="<?= $token; ?>"> <?= $coursename; ?> </h2>

        </div>

        <div class="col-md-6">
        </div>

      </div>
      <nav class="nav-menu mt-2">
        <a href="<?= base_url('course/getCourseInfo/' . $courseid) ?>"> <span id="btnCourse" class="nav-menu-link active">Aktivitas</span></a>
        <!-- kirim token dalam bentuk session -->
        <?php
          $session = session();
          $session->set('token', $token);
        ?>
        <!-- button on click ini dikirim ke  -->
        <a href="<?=base_url('gradebook/getGradebookView/' . $courseid)?>"><span id="btnMhs" class="nav-menu-link">Nilai</span></a>
      </nav>
</div>
<div class="container">
  <div class="row">
    <div class="col col-lg-6">

      <div class="dropdown">
        <select class="custom-select dropdown-toggle w-100 text-left btn-flex" id="course_content" >
          <?php foreach($course_contents_list as $cc):?>
          <option value="<?=$cc['contentid']; ?>"><?= $cc['contentname']; ?></option>
          <?php endforeach;?> 
        </select>  
      </div>
    </div>

    <div class="col col-lg-4">
    <div class="dropdown">
          <select class="custom-select dropdown-toggle w-100 text-left btn-flex" id="content_module" > 
        </select> 
      </div>
    </div>

    
    <div class="col-md-auto">
      <a href="#">
        <span id="vis_grade" class="material-symbols-outlined fa-3x">bar_chart</span>
      </a>
    </div>
    <div class="col-md-auto">
      <a href="#">
        <span id="table_grade" class="material-symbols-outlined fa-3x">table</span>
      </a>
    </div>
  </div>

<div class="container">
 
  <div class="row mt-6">
    <div class="col-md-6">
      <span id="load-1"></span>
      <!-- nama kuis, dan waktu kuis -->
      <span id="modTitle"></span>
      <span id="contentName"></span>
     
      <span id="openedDate"></span>
      <span id="closedDate"></span>
    </div>

    <div class="col-md-6">
      <span id="load-2"></span>
      <!-- tabel participant dan loadchart partiicpant-->
      <span id=tableParticipant></span>
      <div id=chartQuizGrades></div>
    </div>  
  </div>

  <div class="row mt-6">
    <div class="col-md-6"></div>

    <!-- tabel participant dan loadchart partiicpant-->
    <div class="col-md-6"><div id="chartParticipant"></div></div>
  </div>

  <div class="row mt-4">
    <!-- table disnii aktif jika user memlih view table -->
    <span id="load-table"></span>
    <div class="col"><span id="tableGradeAssignment"></span></div>   
  </div>

  <div class="row mt-4">
    <!-- table disnii aktif jika user memlih view table -->
    <span id="load-table"></span>
    <div class="col"><span id="tableGradeQuiz"></span></div>   
  </div>

  <!-- QUIZ -->
  <div class="row mt-6">
    <div class="col-sm-4"><span id="descQuizQues"></span></div>
    <div class="col-sm-8"><div id="chartQuizQues"></div></div>
  </div>


  <!-- ASSIGN -->
  <div class="row mt-6">
    <div class="col-md-6"><div id="chartGradeAssignment"></div></div>
    <div class="col-md-6"><div id="lagendGradeAssignment"></div></div>
  </div>
    
</div>
<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="<?=base_url('/js/view/loadAnimation.js')?>"></script>
<script src="<?=base_url('/js/view/course.js')?>"></script>
<script src="<?=base_url('/js/view/chartAssign.js')?>"></script>
<script src="<?=base_url('/js/view/chartQuiz.js')?>"></script>
<script src="<?=base_url('/js/d3.v7.min.js')?>"></script>

<script>
    $(document).ready(function() {
      loadAnimation_sm("load-1");
      handleCourseContentChange();
      
        $('#course_content').on('change', function() {
          handleCourseContentChange(); //menampilkan dropdown 2 : topik/content
        });
        
        $('#content_module').on('change', function() {

          handleModuleChange();
        });

        $('#table_grade').on('click', function(){
          var modName = $('#mod').data('modname');
          console.log("modname di html", modName);
          handleTable(modName);
        });
        $('#vis_grade').on('click', function(){
          handleCourseContentChange();
        });

        $('#btnMhs').on('click', function(){
          handleMhsButton();
        });

    });
  </script>
<?= $this->endSection('jshere') ?>
