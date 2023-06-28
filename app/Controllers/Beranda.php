<?php

namespace App\Controllers;
use CodeIgniter\Controller;


class Beranda extends BaseController
{

    public $main_url;
    public $token;
    public $userid;

    public function __construct()
    {
        $this->session = \Config\Services::session();
        $this->main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
        $this->token = session('token');
    }

    //untuk mendapatkan userid dan fisrtname
    public function getSiteInfo(){
        $status = true;
        $param =[
            "wstoken" =>$this->token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_webservice_get_site_info",
            ];

        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response = curl_exec($curl);
        curl_close($curl);

        $response = json_decode($response, true);

        $webservice_site_info =[
            'userid'=>$response["userid"],
            'firstname'=>$response["firstname"],
        ];
        //dd($webservice_site_info);

        session()->set('webservice_site_info', $webservice_site_info);
        return redirect()->to('Beranda/getEnrolledCourses');

    }

    public function getEnrolledCourses(){      
        $webservice_site_info = session('webservice_site_info');
        $userid = $webservice_site_info['userid'];

        //mendapatkan mata kuliah yang di enrol oleh $userid
        $param =[
            "wstoken" =>$this->token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_enrol_get_users_courses",
            "userid"=>$userid,
            ];

        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response = curl_exec($curl);
        curl_close($curl);

        $response = json_decode($response, true);
        gettype($response);
        $arrayLength = count($response);

        foreach($response as $ec){
            $enrolled_course[] =[
                'token'=> $this->token,
                'courseid'=>$ec["id"],
                'coursedisplayname'=>$ec["displayname"],
            ];
        }

        $mydata['enrolled_course'] = $enrolled_course;
        $mydata['firstname'] = $webservice_site_info['firstname'];

        //dd($mydata);
        return view ('beranda', $mydata);        
    }

}