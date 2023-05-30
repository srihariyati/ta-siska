<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Visualisasi Data Tugas | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
<div class="container mt-7 mb-3">

      <div class="row">

        <div class="col-md-6">
          <h2 class="font-weight-bolder pr-10">Teori Bahasa dan Automata Ganjil 21/22 Kelas A</h2>
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
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Topik 2 - Konsep Bahasa dan AutomataAAAAAAAAAAAAAAAAAAAAAA</span>
        </button>   
       

        <div class="dropdown-menu w-100 " aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>

    <div class="col col-lg-4">
    <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Topik 2 - Konsep Bahasa dan AutomataAAAAAAAAAAAAAAAAAAAAAA</span>
        </button>   
       

        <div class="dropdown-menu w-100 " aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
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
      <h3 class="font-weight-bolder pr-10 mb-0">Kuis 2</h3>
      <p>Topik 2 - Konsep Dasar Bahasa dan Automata</p>

      <p class="mt-2 mb-0"><strong>Opened</strong> : Friday, 3 September 2021, 12:00 AM</p>
      <p><strong>Closed</strong> : Tuesday, 21 September 2021, 11:59 PM</p>
    </div>
    <div class="col-md-6">
    <table class="table table-bordered">
        <tbody>
          <tr>
            <td>Participants</td>
            <td>86</td>
          </tr>
          <tr>
            <td>Submitted</td>
            <td>86</td>
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