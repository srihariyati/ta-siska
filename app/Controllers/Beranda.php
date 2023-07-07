<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use App\Controllers\GenerateCurl;
use App\Controllers\Login;

class Beranda extends BaseController
{

    public $token;
    public $userid;

    public function __construct()
    {
        $this->session = \Config\Services::session();
        $this->token = session('token');
    }

    public function getEnrolledCourses(){      
       $this->userid = session('userid');

        //mendapatkan mata kuliah yang di enrol oleh $userid
        $param =[
            "wstoken" =>$this->token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_enrol_get_users_courses",
            "userid"=> $this->userid,
            ];

        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

        foreach($response as $ec){
            $enrolled_course[] =[
                'courseid'=>$ec["id"],
                'coursedisplayname'=>$ec["displayname"],
            ];
        }
        
        //kirim session token ke beranda
        //kirim session firstname ke beranda
        $login = new Login();
        $response_userinfo =  $login->getUserInfo($this->token);
       
        session()->set('token', $this->token);
        session()->set('user_firstname', $response_userinfo['firstname']);

        //$mydata['enrolled_course'] = $enrolled_course;
        $mydata = [
            'enrolled_course' => $enrolled_course,
            'token'=>session('token'),
            'user_firstname'=>session('user_firstname')
        ];
       
        return view ('beranda', $mydata);        
    }

}