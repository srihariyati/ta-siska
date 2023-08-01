<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?= $this->renderSection('title') ?>
  
    <link rel="icon" type="image/x-icon" href="<?=str_replace('/index.php', '', base_url()) .'/img/logo_siska.svg'?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


    <!-- Bootstrap CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    

    <!-- Include the DataTables CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.3.6/css/buttons.dataTables.min.css">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.css" rel="stylesheet">
    
    <!-- Include Column Width plugin CSS -->    
    <link rel="canonical" href="https://getbootstrap.com/docs/4.1/examples/sticky-footer/">
    
    <!-- costum css -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/bootstrap.min.css'?>">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/navbar.css'?>">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/chart.css'?>">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/table.css'?>">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/sticky-footer.css'?>">
    <link rel="stylesheet" href="<?=str_replace('/index.php', '', base_url()) .'css/bootstrap-icons.css'?>">
    
    
</head>
<body>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>


<nav class="navbar navbar-expand-md navbar-light fixed-top bg-light">
  <div class="navbar_left">
    <div class="logo">
      <a class="navbar-brand" href="<?= base_url('beranda/getEnrolledCourses/') ?>">
        <img src="<?=str_replace('/index.php', '', base_url()) .'/img/logo_siska_2.svg'?>" width="350" height="46" class="d-inline-block align-top" alt="">
      </a>
    </div>
  </div>

  <div class="navbar_right pr-5">
    <div class="profile">
      <div class="icon_wrap">
        <img src="<?=str_replace('/index.php', '', base_url()) .'/img/profile.png'?>" alt="profile_pic">
        <span></span>
        <i class="fas fa-chevron-down ml-2"></i>
      </div>

      <div class="profile_dd">
        <div class="profile_ul">
          <div class="m-3">
            <a class="logout" href="<?= base_url('login/logout/') ?>">
              <span class="picon">
                  <i class="fas fa-sign-out-alt m-2"></i>
              </span>Logout
            </a>
          </div>        
        </div>

      </div>
      
    </div>
  </div>
</nav>


<?= $this->renderSection('content') ?>

<footer class="footer">
  <div class="container-lg">
    <span class="text-muted">Copyright © 2023 Universitas Syiah Kuala. All Right Reserved.</span>
  </div>
</footer>

  <script> const BASE_URL = "<?= base_url() ?>"</script>
 
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.js"></script>
  <script src="<?=str_replace('/index.php', '', base_url()) .'/js/bootstrap.bundle.min.js'?>"></script>

  
  <script src="https://kit.fontawesome.com/b99e675b6e.js"></script>
  <script>
      $(".profile .icon_wrap").click(function(){
        $(this).parent().toggleClass("active");
        $(".notifications").removeClass("active");
      });

      $(".notifications .icon_wrap").click(function(){
        $(this).parent().toggleClass("active");
        $(".profile").removeClass("active");
      });

      $(".show_all .link").click(function(){
        $(".notifications").removeClass("active");
        $(".popup").show();
      });

      $(".close, .shadow").click(function(){
        $(".popup").hide();
      });
</script>

<?= $this->renderSection('jshere') ?>

</body>
</html>
