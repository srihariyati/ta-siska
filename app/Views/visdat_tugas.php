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
        <span class="material-symbols-outlined fa-3x">bar_chart</span>
      </a>
    </div>
    <div class="col-md-auto">
      <a href="#">
        <span class="material-symbols-outlined fa-3x">table</span>
      </a>
    </div>
  </div>

<div class="container">
    <!-- nama kuis, dan waktu kuis -->
  <div class="row mt-4">
    <div class="col-md-6">
      <span id="modTitle"></span>
      <!-- <h3 class="font-weight-bolder pr-10 mb-0" id="modTitle"></h3> -->
      <span id="contentName"></span>
     
      <span id="openedDate"></span>
      <span id="closedDate"></span>

    </div>
    <div class="col-md-6">
    <table class="table table-bordered">
        <tbody>
          <tr>
            <td>Participants</td>
            <td> <span id="courseParticipant"><span></td>
          </tr>
          <tr>
            <td>Submitted</td>
            <td><span id="submittedParticipant"></span></td>
          </tr>       
        </tbody>
      </table>

      <!-- code loading bar here!-->
      dddd
    </div>
  </div>
  
  <div class="row mt-4">
    <div class="col-md-6">
        dddd
    <!-- kode visdat -->
    </div>
    <div class="col-md-6">
        <!-- kode lagend here -->
        dd
    </div>
  </div>
    
</div>
<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/js/view/contentModule.js"></script>
<script>
    $(document).ready(function() {
      handleCourseContentChange();
      
        $('#course_content').on('change', function() {
            handleCourseContentChange();
        });
        
        $('#content_module').on('change', function() {
            handleContentModuleChange();
        });

    });
  </script>
<?= $this->endSection('jshere') ?>
