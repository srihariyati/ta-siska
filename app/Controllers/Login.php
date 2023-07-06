<?php

namespace App\Controllers;
use CodeIgniter\Controller;

class Login extends BaseController
{
    public function __construct()
    {
        $this->session = \Config\Services::session();
    }

    public function login(){
        // Mengambil input dari formulir
        $username = $this->request->getPost('username');
        $password = $this->request->getPost('password');

        $main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/login/token.php?';

        $param =[
            "username"=>$username,
            "password"=>$password,
            "service"=>'moodle_mobile_app',
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

        //dd($response);

        if($count==2){
            $status = 'success';
            $token = $response['token'];
        }else{
            $status = 'invalid';
        }
      
        if($status =='success'){
            // Set session data
            session()->set('token', $token);

            //redirect to controller
            return redirect()->to('beranda/getSiteInfo');
        }
        else{
            //kirim ke view untuk menampilkan sweet alert salah password
            //sweet alert
            // Redirect to Home controller's index method
            //return redirect()->to('home/index');
            return redirect()->back()->with('loginError', 'Login gagal! Username atau password salah!');

        }
    }


    public function generatetoken()
    {
        //autententikasi beerhasil maka generate token
        $status = true;
        if ($status){
            $username = "srihariyati";
            $password =  "Abcde$12345";
            $webservice = "moodle_mobile_app";
            
            $main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/login/token.php?';
            $param =[
                "username" =>$username,
                "password"=>$password,
                "service"=>$webservice,
                ];


            $data = http_build_query($param);
            $url = $main_url;
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL,$url);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
            curl_setopt($curl, CURLOPT_POST, true);
            //kalau gapake ini gabisa akses moodle, karena masalah ssl
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

            $response = curl_exec($curl);
            curl_close($curl);

            $response = json_decode($response, true);
            $token[] =[
                $response["token"],
            ];
            
            //$mydata['token'] = $token;
            //dd($token[0][0]);
            
            $token = $token[0][0];
            //echo $token;

            // Set session data
            session()->set('token', $token);

            //redirect to controller
            return redirect()->to('Beranda/getSiteInfo');
        }       
    }
}