<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>SISKA | Aktivitas</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>

<div class="container-lg mt-7 mb-3">
        <div class="row pl-2">
        <a href="<?= base_url('beranda/getEnrolledCourses/') ?>"><span id="backButton" class="btn material-icon fa-1x p-2 "><i class="bi bi-caret-left-fill text-secondary"></i></span>Beranda</a>
        </div>
        
        <div class="row d-flex flex-row">    
          <div class="col-md-6" style="display: flex; align-items: center;">
            <h2 class="font-weight-bolder pr-10 m-1 mt-0" id="courseTitle" data-courseid="<?= $courseid; ?>" data-token="<?= $token; ?>"> <?= $coursename; ?> </h2>
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
      <span id="vis_grade_icon" class="btn material-icon fa-2x pb-4 p-0">
        <i class="bi bi-bar-chart-fill active"></i>
      </span>
      <span id="table_grade_icon" class="btn ml-1 material-icon fa-2x pl-3 pr-2 pb-4 p-0">
        <i class="bi bi-table"></i>
      </span>
    </div>

  </div>
</div>

<div class="container-lg">


  <div class="row">
    <div id="alert" class='w-100 ml-3 mr-3'></div>
  </div>
   
  <div class="row mt-3">
   
   
    <div class="col-md-6">
      
        <div id="load-1"></div>
        <!-- nama kuis, dan waktu kuis -->
        <div id="modTitle"></div>
        <div id="contentName"></div>
      
        <div id="openedDate"></div>
        <div id="closedDate"></div>
      
      <div class="row m-1">
          <div id="participant-quiz"></div>
      </div>
      
    </div>

    <div class="col-md-6">
      <span id="load-2"></span>
      <!-- tabel participant dan loadchart partiicpant-->
      <span id=tableParticipant></span>
      <div id=chartQuizGrades></div>
    </div>  
  </div>

  <div class="row mt-4">
    <div class="col-md-6"></div>

    <!-- tabel participant dan loadchart partiicpant-->
    <div class="col-md-6"><div id="chartParticipant"></div></div>
  </div>

  <div class="row mt-4">
    <!-- table disnii aktif jika user memlih view table -->
    <span id="load-table"></span>
    <div class="col"><span id="tableGradeAssignment"></span></div>   
  </div>
  <div class="row">
  <div id="ketIcon" class="mb-3 p-2"></div>   
  </div>

  <div class="row mb-5">
    <!-- table disnii aktif jika user memlih view table -->
    <span id="load-table"></span>    
    <div class="col"><span id="tableGradeQuiz"></span></div>   
  </div>
  
  <div class="row mt-0 mb-3 mr-4">
    <!-- QUIZ -->
    <div class="col-sm-4"><span id="descQuizQues"></span></div>
    <div class="col-sm-8 mb-5"><div id="chartQuizQues"></div></div>

    <!-- ASSIGN -->
    <div class="col-md-8"><div id="chartGradeAssignment"></div></div>
    <div class="col-md-4"><div id="lagendGradeAssignment"></div></div>

  </div>

  
    
</div>

<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
<script src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.2.3/js/buttons.print.min.js"></script>

<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/loadAnimation.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/course.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/chartAssign.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/view/chartQuiz.js'?>"></script>
<script src="<?=str_replace('/index.php', '', base_url()) .'/js/d3.v7.min.js'?>"></script>

<script>
    $(document).ready(function() {

      loadAnimation_sm("load-1");
      handleCourseContentChange();  
      $('#ketIcon').hide();     
      
        $('#course_content').on('change', function() {
          $('#ketIcon').hide();
          handleCourseContentChange(); //menampilkan dropdown 2 : topik/content  
          // Ganti ikon #table_grade_icon menjadi aktif
          $('#vis_grade_icon i').removeClass('bi-bar-chart-fill').addClass('bi-bar-chart-fill active');

          // Ganti ikon #vis_grade_icon menjadi nonaktif
          $('#table_grade_icon i').removeClass('bi-table active').addClass('bi-table');        
        });
        
        $('#content_module').on('change', function() {
          $('#ketIcon').hide();
          handleModuleChange();
        });
        
        $('#btnMhs').on('click', function(){
          handleMhsButton();
          $('#ketIcon').hide();
          
        });

        $('#vis_grade_icon').on('click', function(){
           //ambil mode untuk jenis aktivitas
           $('#ketIcon').hide();
           var modName = $('#mod').data('modname');
          console.log("modname di html", modName);

          if(modName == 'assign'){
            //hide visualisasi data tugas
            
            $('#chartGradeAssignment').show();
            $('#chartParticipant').show();

            //show tabel data tugas
            $('#tableGradeAssignment').hide();            

          }else if(modName == 'quiz'){
            //hide tabel
            $('#ketIcon').hide();
            $('#tableGradeQuiz').hide();

            //tampilkan visualisasi data
            $('#chartQuizGrades').show();
            $('#descQuizQues').show();
            $('#chartQuizQues').show(); 
            $('#participant-quiz').show();
          }
          //block button vis
          blockiconVis();

          //unblock button tabel
          activeiconTable();

          // Ganti ikon #table_grade_icon menjadi aktif
          $('#vis_grade_icon i').removeClass('bi-bar-chart-fill').addClass('bi-bar-chart-fill active');

          // Ganti ikon #vis_grade_icon menjadi nonaktif
          $('#table_grade_icon i').removeClass('bi-table active').addClass('bi-table');
          
        });

        $('#table_grade_icon').on('click', function(){     
          $('#ketIcon').hide();   
          //block icon table
          blockiconTable(); 

          //unblock icon vis
          activeiconVis();

          
          //ambil mode untuk jenis aktivitas
          var modName = $('#mod').data('modname');
          console.log("modname di html", modName);

          if(modName == 'assign'){
            //hide visualisasi data tugas
            $('#chartGradeAssignment').hide();
            $('#chartParticipant').hide();
            $('#lagendGradeAssignment').empty();

            //show tabel data tugas
            $('#tableGradeAssignment').show();
            

          }else if(modName == 'quiz'){
            //hide visualisasi data
            $('#chartQuizGrades').hide();
            $('#descQuizQues').hide();
            $('#chartQuizQues').hide(); 
            $('#participant-quiz').hide();        

            //tampilkan tabel quiz
            $('#ketIcon').show();
            $('#tableGradeQuiz').show();
          }

          // Ganti ikon #table_grade_icon menjadi aktif
          $('#table_grade_icon i').removeClass('bi-table').addClass('bi-table active');

          // Ganti ikon #vis_grade_icon menjadi nonaktif
          $('#vis_grade_icon i').removeClass('bi-bar-chart-fill active').addClass('bi-bar-chart');
          
        });
        
    });
  </script>

<?= $this->endSection('jshere') ?>
