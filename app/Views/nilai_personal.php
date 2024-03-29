<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Gradebook Personal | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
<div class="container mt-7 mb-3">

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


  <div class="container">
  <div class="row">
    <div class="col col-lg-6">
      <h3 class="font-weight-bolder pr-10 mb-0 mt-2">Nilai Mahasiswa (Gradebook)</h3>
    </div>
    <div class="col col-lg-2"></div>
    <div class="col col-lg-2">
      <div class="dropdown">
        <!-- <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Export</span>
        </button>    -->
       

        <div class="dropdown-menu w-100 " aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item " href="#">.pdf</a>
          <a class="dropdown-item" href="#">.xlsx</a>
        </div>
      </div>
    </div>

    <div class="col col-lg-2">
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
    <div class="col-md-2">
      
      <p class="mb-2">Grade Mahasiswa</p>
      <h5>🏆0</h5>
    </div>
    <div class="col-md-6 mt-3">
      <p></p>
      <p>Dengan Mean nilai mahasiswa : 0</p>
    </div>
  </div>

  <div class="row mt-2">
    <!-- visdat disini -->
    <div class="col"><div id="PersonalGradeChart"></div></div>   
  </div>


  <?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src = "<?=base_url('/js/d3.v7.min.js')?>"></script>
<script src= "<?=base_url('/js/view/gradebook.js')?>"></script>
<script src= "<?=base_url('/js/view/chartGradebook.js')?>"></script>

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