<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Visualisasi Data Tugas | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>

<div class="container-lg mt-5 mb-3">

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

<div class="container-lg">
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

    <div class="col col-lg-2 d-flex gap-4">
      <span id="vis_grade_icon" class="btn ml-1 material-icon fa-2x pb-2 p-0">
        <i class="bi bi-bar-chart-fill active"></i>
      </span>
      <span id="table_grade_icon" class="btn ml-1 material-icon fa-2x pl-4 pb-2 p-0">
        <i class="bi bi-table"></i>
      </span>
    </div>

  </div>
</div>

<div class="container-lg">

  
   
  <div class="row mt-3">
    <div id="alert" class='w-100 ml-3 mr-3'></div>
   
    <div class="col-md-6">
      <div id="load-1"></div>
      <!-- nama kuis, dan waktu kuis -->
      <div id="modTitle"></div>
      <div id="contentName"></div>
     
      <div id="openedDate"></div>
      <div id="closedDate"></div>
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
  <div class="row mt-4 mb-5">
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
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/loadAnimation.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/course.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/chartAssign.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/chartQuiz.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/d3.v7.min.js'?>"></script>

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

        $('#table_grade_icon').on('click', function(){
          var modName = $('#mod').data('modname');
          console.log("modname di html", modName);
          handleTable(modName);

          // Ganti ikon #table_grade_icon menjadi aktif
          $('#table_grade_icon i').removeClass('bi-table').addClass('bi-table active');

          // Ganti ikon #vis_grade_icon menjadi nonaktif
          $('#vis_grade_icon i').removeClass('bi-bar-chart-fill active').addClass('bi-bar-chart');

          //block button table
          

        });
        $('#vis_grade_icon').on('click', function(){
          handleCourseContentChange();

          //ganti ganti icon vis jadi active
          var iconvis =`<i class="bi bi-bar-chart-fill active"></i>`;
          $('#vis_grade_icon').empty();
          $('#vis_grade_icon').append(iconvis);

          //ganti icon table jadi nonactive
          var icontable =`<i class="bi bi-table"></i>`;
          $('#table_grade_icon').empty();
          $('#table_grade_icon').append(icontable);

          //block button vis
          
        });

        $('#btnMhs').on('click', function(){
          handleMhsButton();
        });

    });
  </script>
<?= $this->endSection('jshere') ?>
