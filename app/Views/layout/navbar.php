<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?= $this->renderSection('title') ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.css" rel="stylesheet">

     <!-- Include the DataTables CSS -->
     <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.4/css/jquery.dataTables.min.css">
     <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.3.6/css/buttons.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.3/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    
    <!-- Include Column Width plugin CSS -->    
    
    <!-- costum css -->
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/chart.css">
    <link rel="stylesheet" href="/css/table.css">
    
</head>
<body>
  <nav class="navbar navbar-expand-md navbar-light fixed-top bg-light">
    <div class="navbar_left">
      <div class="logo">
        <a class="navbar-brand" href="#">
          <img src="/img/logo_siska_2.svg" width="350" height="46" class="d-inline-block align-top" alt="">
        </a>
      </div>
    </div>

    <div class="navbar_right pr-5">
     
      <div class="profile">
        <div class="icon_wrap">
          <img src="/img/profile.png" alt="profile_pic">
          <span></span>
          <i class="fas fa-chevron-down ml-2"></i>
        </div>

        <div class="profile_dd">
          <ul class="profile_ul">
            <li class="profile_li"><a class="profile" href="#"><span class="picon"><i class="fas fa-user-alt"></i>
                </span>Profile</a>
            </li>
            <li><a class="logout" href="/"><span class="picon"><i class="fas fa-sign-out-alt"></i></span>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>

  <?= $this->renderSection('content') ?>

  <script> const BASE_URL = "<?= base_url() ?>"</script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.min.js"></script>
  <script src="/js/bootstrap.bundle.min.js"></script> 
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
