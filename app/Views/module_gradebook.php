<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Edit Gradebook | SISKA</title>
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
  <div class="row mt-4">
    <div class="col-md-6">
      <h3 class="font-weight-bolder pr-10 mb-0">Kuis 2</h3>
      <p>Topik 2 - Konsep Dasar Bahasa dan Automata</p>
    </div>
  </div>    
  <div class="row mt-4">
    <div class="col-md-4">
      <p class="mb-0">Rata-rata nilai mahasiswa:</p>
      <h4 class="font-weight-bold">71</h4>
     
    </div>
    <div class="col-md-4">
      <p class="mb-0">Bobot penilaian:</p>
      <h4 class="font-weight-bold">21.9% dari 35%</h4>
    </div>
    <div class="col-md-4">
      <p class="mb-0">Ketepatan waktu pengumpulan tugas:</p>
      <h4 class="font-weight-bold">91%</h4>
    </div>
  </div>
</div>

<div class="container mt-4">
  <div class="card mb-3">
    <div class="row">
      <div class="col-md-4">
      <div class="card-body">
          <h6 class="card-title">Waliam Mursiyda</h6>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card-body">
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card-body">
          <h5 class="card-title">12</h5>
        </div>
      </div> 
    </div>
  </div>

  <div class="card mb-3">
    <div class="row">
      <div class="col-md-4">
      <div class="card-body">
          <h6 class="card-title">Waliam Mursiyda</h6>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card-body">
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card-body">
          <h5 class="card-title">12</h5>
        </div>
      </div> 
    </div>
  </div>
</div>

<?= $this->endSection('content') ?>