<?= $this->extend('layout/navbar') ?>

<?= $this->section('title') ?>
<title>Beranda | SISKA</title>
<?= $this->endSection('title') ?>

<?= $this->section('content') ?>
  
    <div class="container mt-7 mb-3 ">
      <h3 class="font-weight-bolder">Selamat Datang, <?= $firstname ?>🎉</h3>
      <p>Silahkan pilih mata kuliah yang tersedia dibawah ini.</p>
      <hr class="mt-2 mb-3"/>
    </div>

  
    <div class="container">

      <div class="row">

        <?php foreach($enrolled_course as $ec):?>
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
           
            <img src="/img/Bush Pattern.png" class="bd-placeholder-img card-img-top"  width="100%" height="150">
            <!-- <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text> -->

            <div class="card-body">
              <p class="card-text"><?= $ec[2]; ?></p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="navbar-brand" href="/course/<?= $ec[0]; ?>/<?= $ec[1]; ?>">
                    <button type="button"class="btn btn-sm btn-outline-secondary">show</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <?php endforeach;?>
          <!-- sss -->
        
          
          <!--  -->
      </div>
    </div>
       
  <?= $this->endSection('content') ?>
