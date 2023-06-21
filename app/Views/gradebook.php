<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Gradebook | SISKA</title>
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
        <a href="#" class="nav-menu-link ">Tugas</a>
        <a href="#" class="nav-menu-link active">Mahasiswa</a>
      </nav>
</div>


  <div class="container">
  <div class="row">
    <div class="col col-lg-6">
      <h3 class="font-weight-bolder pr-10 mb-0 mt-2">Gradebook</h3>
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

  

  <!-- tabel  nilai kuis -->
  <div class="row mt-4">
  <div class="table-container">
    <table class="table table-sm table-striped" id="tableGradebook"></table>
  </div>   

  <!-- <table class="table table-sm  ml-2">
  <thead>
    <tr>
     
      <th scope="col">Nama Mahasiswa</th>
      <th scope="col">Tugas 1</th>
      <th scope="col">Kusi 1</th>
      <th scope="col">Tugas 1</th>
      <th scope="col">Kusi 1</th>
      <th scope="col">Tugas 1</th>
      <th scope="col">Kusi 1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Mark</td>
      <td>100</td>
      <td>A</td>
      <td>100</td>
      <td>A</td>
      <td>100</td>
      <td>A</td>
    </tr>
    <tr>
      <td>Jacob</td>
      <td>50</td>
      <td>C</td>
      <td>A</td>
      <td>100</td>
      <td>A</td>
      <td>100</td>
    </tr>
  </tbody>
  <tfoot>
  <tr>
      <th>Mean</th>
      <th>11.1</th>
      <th>90.2</th>
      <th>11.1</th>
      <th>90.2</th>
      <th>11.1</th>
      <th>90.2</th>
    </tr>
  </tfoot>
</table> -->

  </div>
</div>
<?= $this->endSection('content') ?>

<?= $this->section('jshere') ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src = "/js/d3.v7.min.js"></script>
<script src= "/js/view/gradebook.js"></script>

<script>
    $(document).ready(function() {
     handleTableGradebook();

    });
  </script>
<?= $this->endSection('jshere') ?>