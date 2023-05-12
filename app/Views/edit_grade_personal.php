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
      <h3 class="font-weight-bolder pr-10 mb-0">Tugas 2</h3>
      <p>Topik 2 - Konsep Dasar Bahasa dan Automata</p>
    </div>
    </div>
    <div class="row mt-2">
        <div class="col-md-6">
        <h5>Waliam Mursyida</h5>
         <p>19081070100xx</p>
        </div>
        <div class="col-md-6">
            <p class="mb-2">Rata-rata nilai mahasiswa:</p>
            <h6>71.66</h6>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-md-6">
        <p class="text-muted"><em>tidak mengumpulkan tugas</em></p>
        </div>
        <div class="col-md-6">
            <p class="mb-2"><strong>Nilai Tugas 2</strong>:</p>
            <button class="btn btn-warning"><h3>70</h3></button>
        </div>
    </div>
    <div class="row">
        <!-- loading bar here -->
    </div>
</div>
<?= $this->endSection('content') ?>