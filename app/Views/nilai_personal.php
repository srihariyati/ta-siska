<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>SISKA | Nilai Personal</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>

<div class="container-lg mt-7 mb-3">
    <div class="row pl-2">
      <a href="<?= base_url('beranda/getEnrolledCourses/') ?>"><span id="backButton" class="btn material-icon fa-1x p-2 "><i class="bi bi-caret-left-fill text-secondary"></i></span>Beranda</a>
    </div>

    <div class="row">
      <div class="col-md-6">
        <h2 class="font-weight-bolder pr-10" id="courseTitle" data-token = "<?=$token?>" data-courseid="<?=$personal_grade['courseid']?>"></h2>
      </div> 
      <div class="col-md-6">
      </div>
    </div>

    <nav class="nav-menu mt-2">
      <a href="<?=base_url('course/getCourseInfo/'.$personal_grade['courseid'] ) ?>" class="nav-menu-link ">Aktivitas</a>
       <a href="<?=base_url('gradebook/getGradebookView/'.$personal_grade['courseid'] )?>" class="nav-menu-link active">Nilai</a>
    </nav>
</div>


<div class="container-lg">
  <div class="row d-flex flex-row">
    <!-- button back --> 
      <!-- on click kembali ke halaman nilai -->
    <a href="<?=base_url('gradebook/getGradebookView/' .$personal_grade['courseid'])?>"><span id="backButton" class="btn material-icon fa-2x p-2""><i class="bi bi-arrow-left-square-fill"></i></span></a>
    
    <div class="col col-lg-6" style="display: flex; align-items: center;">       
      <h3 class="font-weight-bolder pr-10" >Nilai Mahasiswa (Gradebook)</h3>
    </div> 

    <div class="col d-flex justify-content-end">
      <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButtonMod" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Semua</span>
        </button>   
      
        <ul class="dropdown-menu w-100" aria-labelledby="modType">
          <li><a id="modAll" class="dropdown-item" data-type="all" href="#">Semua</a></li>
          <li><a id="modQuiz" class="dropdown-item" data-type="quiz" href="#">Kuis</a></li>
          <li><a id="modAssign" class="dropdown-item" data-type="assign" href="#">Tugas</a></li>
        </ul>

      </div>
    </div>
  </div>

  <div class="row mt-5">

    <div class="col-md-4">
      <h4 id="StudentName" data-userid="<?=$personal_grade['userid']?>"><?=$personal_grade['userfullname']?></h4>
      <p id="StudentNIM"></p>
      <?php $personal_grade_items = json_encode($personal_grade['gradeitems']);?>
    </div>

    <div class="col-md-4">      
      <p class="mb-2">Nilai Rata-Rata Mahasiswa</p>
      <h5>🏆<?=$gradefinalmean?></h5>
    </div>

    <div class="col-md-4 mt-3">
    </div>

  </div>

  <div class="row mt-2 mb-5">
    <!-- visdat disini -->
    <div class="col mb-5"><div id="PersonalGradeChart"></div></div>   
  </div>

</div>


<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
<script src ="<?=str_replace('/index.php', '', base_url()) .'/js/d3.v7.min.js'?>"></script>
<script src= "<?=str_replace('/index.php', '', base_url()) .'/js/view/gradebook.js'?>"></script>
<script src= "<?=str_replace('/index.php', '', base_url()) .'/js/view/chartGradebook.js'?>"></script>

<script>
    $(document).ready(function() {
      var personalGradeItems = <?= $personal_grade_items ?>;

      getCourseName();  
      getStudentInfo();
      showPersonalGradeChart(personalGradeItems);
      console.log(personalGradeItems);
      

      $('#modAll').on('click', function(){
        $('#dropdownMenuButtonMod').empty();
        $('#dropdownMenuButtonMod').append('<span>Tugas</span>')
        $('#PersonalGradeChart').empty();
        showPersonalGradeChart(personalGradeItems);
      });  

      $('#modQuiz').on('click', function(){
        var personalGradeQuiz = [];

        personalGradeItems.forEach((gradeitems) => {
        //select Assign from personalGradeItems
        if(gradeitems.moditem == 'quiz'){
        personalGradeQuiz.push(gradeitems);
          }
        });
        $('#dropdownMenuButtonMod').empty();
        $('#dropdownMenuButtonMod').append('<span>Kuis</span>');
        $('#PersonalGradeChart').empty();
        showPersonalGradeChart(personalGradeQuiz);
     });    

     $('#modAssign').on('click', function(){
        var personalGradeAssign = [];

        personalGradeItems.forEach((gradeitems) => {
        //select Assign from personalGradeItems
        if(gradeitems.moditem == 'assign'){
          personalGradeAssign.push(gradeitems);
          //console.log(personalGradeAssign);
          }
        });

        $('#dropdownMenuButtonMod').empty();
        $('#dropdownMenuButtonMod').append('<span>Tugas</span>')
        $('#PersonalGradeChart').empty();
      showPersonalGradeChart(personalGradeAssign);
     });
     
      
      
    
    });

</script>
<?= $this->endSection('jshere') ?>