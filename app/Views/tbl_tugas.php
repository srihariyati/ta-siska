<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Tabel Tugas | SISKA</title>
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

  <!-- nama kuis, dan waktu kuis -->
  <div class="row mt-4">
    <div class="col-md-6">
      <h3 class="font-weight-bolder pr-10 mb-0">Kuis 2</h3>
      <p>Topik 2 - Konsep Dasar Bahasa dan Automata</p>
    </div>
    
  </div>
  <div class="row mt-4"> 
    <div class="col-md-6">
      <p><strong>Opened</strong> : Friday, 3 September 2021, 12:00 AM</p><br>  
    </div>     
  </div>
  <div class="row mt-0"> 
    <div class="col-md-6"> 
    <p><strong>Closed</strong> : Tuesday, 21 September 2021, 11:59 PM</p>
    </div>
  </div>
  <!-- tabel  nilai kuis -->
  <div class="row mt-4">
  <table class="table table-sm table-striped ml-2">
  <thead>
    <tr>
     
      <th scope="col">Nama Mahasiswa</th>
      <th scope="col">Grade</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
      <th scope="col">Q4</th>
      <th scope="col">Q5</th>
      <th scope="col">Q6</th>
      <th scope="col">Q7</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Mark</td>
      <td>100</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Jacob</td>
      <td>50</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
      <td>❌</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Lee</td>
      <td>90</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

  </div>
</div>
<?= $this->endSection('content') ?>
