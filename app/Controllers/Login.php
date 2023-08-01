<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use App\Controllers\GenerateCurl;

class Login extends BaseController
{
    public function __construct(){
        $this->session = \Config\Services::session();
    }

    public function auth() {
        return view('login');
    }

    public function login(){
        // Mengambil input dari formulir
        $username = $this->request->getPost('username');
        $password = $this->request->getPost('password');

        $main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/login/token.php?';

        $param =[
            "username"=>$username,
            "password"=>$password,
            "service"=>'ws-siska',
        ];
        $data = http_build_query($param);
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL,$main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);

        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response= curl_exec($curl);
        curl_close($curl);

        $response = json_decode($response, true);
        $count = count($response);

        if($count==2){
            //password dan username benar
            $status = 'success';
            $token = $response['token'];           
        }else{
            //password salah
            $status = 'invalid';
        }        

        if($status=='success'){
            //jika status success maka periksa apakah user site admin atau bukan
            //jika status success dan bukan admin maka beri alert bahwa akun bukan admin

            //check user siteadmin or not menggunakan function yang mereturn response dari ws core_webservice_get_site_info
            // Call the getUserInfo() function
            $response_checkuser = $this->getUserInfo($token);

            //jika user adalah siteadmin maka boleh login
            if($response_checkuser['userissiteadmin']==true){
              
                // Set session data
                $sessionData = [
                    'token' => $token,
                    'userid' => $response_checkuser['userid'],
                    'isLoggedIn' => TRUE,
                ];
                $this->session->set($sessionData);
                
                //redirect to controller untuk menampilkan daftar mata kuliah yang dimiliki oleh user
                //return redirect()->to('beranda/getSiteInfo'); //jika akun memiliki akses
                return redirect()->to('/');
            }else{
               //bukan admin beri alert bukan admin
                return redirect()->back()->with('loginError', 'Akun anda tidak memiliki akses ke sistem.');
            }

        }else if($status=='invalid'){
            //jika status invalid langsung bilang salah password
            return redirect()->back()->with('loginError', 'Username atau password salah.');
        }      
    }


    //digunakan juga untuk menampilkan nama user pada header bar
    public function getUserInfo($token){
        $param =[
            "wstoken"=>$token,
            "moodlewsrestformat"=>'json',
            "wsfunction"=>'core_webservice_get_site_info',
        ]; 

        $curlGen = new GenerateCurl();
        $response_checkuser =  $curlGen->curlGen($param);

        return $response_checkuser;
    }


    public function logout(){
        //delete session
        $this->session->destroy();
        return redirect()->to('/');
    }

}