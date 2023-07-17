<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login | SISKA</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.css" rel="stylesheet">
  <link rel="stylesheet" href="<?=base_url('/css/bootstrap.min.css')?>">
</head>
<body>
  <div class="px-4 py-5 px-md-5 text-center" style="background-color: #227362">
    <div class="container">
      <div class="row gx-lg-5 align-items-center">

        <div class="col-lg-6 mb-5 mb-lg-5 ">
          <img src="<?=base_url('/img/logo_siska_1.svg')?>" width="150" height="150" class="d-inline-block align-top" alt="">
          
          <h4 class="font-weight-bold mb-2 text-white">Sistem Informasi Kinerja Mahasiswa</h4>
          <p class="mt-2 mb-4 pl-5 pr-5 text-white">Sistem Informasi Visualisasi Data Kinerja Mahasiswa pada E-learning Universitas Syiah Kuala</p>
          
          <img src="<?=base_url('/img/dec_3circle.svg')?>" width="50" height="50" class="d-inline-block align-top" alt="">
        </div>

        <div class="col-lg-6 mb-5 mb-lg-0">
          
          <!-- card form login -->
          <div class="card pt-5">
            <div class="card-body py-5 px-md-5 ">

              <!-- Greetings Text -->
              <div class="text-center mb-12">
                <img src="<?=base_url('/img/logo_siska.svg')?>" width="60" height="60" class="d-inline-block align-top" alt="">
                <h1 class="font-weight-bold h3">
                  Selamat Datang!
                </h1>
                <p class="mt-2 mb-5 pl-4 pr-4">Silahkan login dengan menggunakan username dan password akun Moodle Anda</p>
              </div>

              <?php if (session()->getFlashdata('loginError')) : ?>
                <div class="mb-2 pr-5 pl-5 ">
                  <div class="alert alert-danger alert-dismissible fade show" role="alert">
                      <b>Opps!</b> <?php echo session()->getFlashdata('loginError'); ?>
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                </div>
                  
              <?php endif; ?>
              
              <form action="login/login" method="post">
                <div class="mb-2 pr-5 pl-5">
                  <!-- <label class="form-label" for="email">Email address</label> -->
                  <input type="text" class="form-control" name="username" placeholder="Username">
                </div>
                <div class="mb-5 pr-5 pl-5">
                  <!-- <label class="form-label" for="password">Password</label> -->
                  <input type="password" class="form-control" name="password" placeholder="Password" autocomplete="current-password">
                </div>
                
                <div class="mb-4 mt-2 pr-5 pl-5" >
                  
                  <!-- <a href="#" class="btn btn-primary btn-lg btn-block" id="loginButton">
                    Login
                  </a> -->
                  <button type="submit" class="btn btn-primary btn-lg btn-block">Login</button>
            
                </div>
              </form>

                <div class="text-center mb-5 mt-5 ">
                  <p class="pl-4 pr-4"><small> Copyright © 2023 Universitas Syiah Kuala. All Right Reserved.</small></p>
                </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.js"></script>
  <script src="<?=base_url('/js/bootstrap.bundle.min.js')?>" ></script>
  </body>
</html>
