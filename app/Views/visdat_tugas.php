<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Visualisasi Data Tugas | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
<style>
     
         
      </style>

<div class="container mt-7 mb-3">

      <div class="row">

        <div class="col-md-6">
        <h2 class="font-weight-bolder pr-10" id="courseTitle" data-courseid="<?= $courseid; ?>" data-token="<?= $token; ?>"> <?= $coursename; ?> </h2>

        </div>

        <div class="col-md-6">
        </div>

      </div>
      <nav class="nav-menu mt-2">
        <a href="#" class="nav-menu-link active">Tugas</a>
        <a href="#" class="nav-menu-link">Mahasiswa</a>
      </nav>
</div>
<div class="container">
  <div class="row">
    <div class="col col-lg-6">

      <div class="dropdown">
        <select class="custom-select dropdown-toggle w-100 text-left btn-flex" id="course_content" >
          <?php foreach($course_contents_list as $cc):?>
          <option value="<?=$cc[0]; ?>"><?= $cc[1]; ?></option>
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
      <!-- nama kuis, dan waktu kuis -->
      <span id="modTitle"></span>
      <span id="contentName"></span>
     
      <span id="openedDate"></span>
      <span id="closedDate"></span>
    </div>

    <div class="col-md-6">
      <!-- tabel participant dan loadchart partiicpant-->
      <span id=tableParticipant></span>
    </div>  
  </div>

  <div class="row mt-6">

    <div class="col-md-6"></div>
    <div class="col-md-6">
      <!-- tabel participant dan loadchart partiicpant-->
      <div id="chartParticipant"></div>
    </div>
  
  </div>
  <div class="row mt-4">
    <!-- table disnii aktif jika user memlih view table -->
    <div id="tableGradeAssignment"></div>
    <table class="table table-sm table-striped ml-2">
  <thead>
    <tr>
     
      <th scope="col">Nama Mahasiswa</th>
      <th scope="col">Grade</th>
      <th scope="col">Nilai Huruf</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Mark</td>
      <td>100</td>
      <td>A</td>
    </tr>
    <tr>
      <td>Jacob</td>
      <td>50</td>
      <td>C</td>
    </tr>
    <tr>
      <td>Lee</td>
      <td>86</td>
      <td>AB</td>
    </tr>
  </tbody>
</table>
  </div>

  <div class="row mt-6">
    <div class="col-md-6">
      <div id="chartGradeAssignment"></div>
    </div>
      <div class="col-md-6">
        <div id="lagendGradeAssignment"></div>
      </div>
  </div>
    
</div>
<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/js/view/contentModule.js"></script>
<script src="/js/view/chartAssign.js" ></script>
<script src = "/js/d3.v7.min.js"></script>

<script>
    $(document).ready(function() {
      handleCourseContentChange();
      
        $('#course_content').on('change', function() {
            handleCourseContentChange();
        });
        
        $('#content_module').on('change', function() {
            handleContentModuleChange();
        });
        $('#table_grade').on('click', function(){
          handletableAssignment();
        });
        $('#vis_grade').on('click', function(){
          handleCourseContentChange();
        });

    });
  </script>
<?= $this->endSection('jshere') ?>
