<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Gradebook Personal | SISKA</title>
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
        <a href="#" class="nav-menu-link ">Tugas</a>
        <a href="#" class="nav-menu-link active">Mahasiswa</a>
      </nav>
</div>


  <div class="container">
  <div class="row">
    <div class="col col-lg-6">
      <h3 class="font-weight-bolder pr-10 mb-0 mt-2">Gradebook Mahasiswa</h3>
    </div>
    <div class="col col-lg-2"></div>
    <div class="col col-lg-2">
      <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Export</span>
        </button>   
       

        <div class="dropdown-menu w-100 " aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item " href="#">.pdf</a>
          <a class="dropdown-item" href="#">.xlsx</a>
        </div>
      </div>
    </div>

    <div class="col col-lg-2">
    <div class="dropdown">
        <button class="btn btn-light dropdown-toggle w-100 text-left btn-flex" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span>Semua</span>
        </button>   
       

        <div class="dropdown-menu w-100 " aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#">Tugas</a>
          <a class="dropdown-item" href="#">Kuis</a>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-5">
    <div class="col-md-4">
      <h5>Waliam Mursyida</h5>
      <p>19081070100xx</p>
    </div>
    <div class="col-md-2">
      <p class="mb-2">Grade Mahasiswa</p>
      <h5>🏆98.70</h5>
    </div>
    <div class="col-md-6 mt-3">
      <p></p>
      <p>Dengan Mean nilai mahasiswa : 87.65</p>
    </div>
  </div>

  <div class="row mt-2">
    <!-- visdat disini -->
  </div>
  <?= $this->endSection('content') ?>