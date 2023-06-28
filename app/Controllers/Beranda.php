<?php

namespace App\Controllers;
use CodeIgniter\Controller;


class Beranda extends BaseController
{

    public function __construct()
    {
        $this->session = \Config\Services::session();
    }
    //untuk mendapatkan userid dan fisrtname
    public function getSiteInfo(){

        $token = session('token');
        
        
        $status = true;
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_webservice_get_site_info",
            ];
        $data = http_build_query($param);
        $url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
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
        //dd($response);
        $webservice_site_info[] =[
            $url,
            $token,
            $response["firstname"],
            $response["userid"],
        ];

        session()->set('webservice_site_info', $webservice_site_info);
        return redirect()->to('Beranda/getEnrolledCourses');

    }

    public function getEnrolledCourses(){      
        $webservice_site_info = session('webservice_site_info');

        $main_url = $webservice_site_info[0][0];
        $token =$webservice_site_info[0][1];
        $userid = $webservice_site_info[0][3];

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_enrol_get_users_courses",
            "userid"=>$userid,
            ];

        $data = http_build_query($param);
        $url = $main_url;
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL,$url);
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

        $i = 0;

        while( $i < $arrayLength){
            $enrolled_course[] =[
                $token,
                $response[$i]["id"],
                $response[$i]["displayname"],
            ];
            $i++;   
        }           
        
        //dd($enrolled_course);
        $mydata['enrolled_course'] = $enrolled_course;
        $mydata['firstname'] = $webservice_site_info[0][2];

        //dd($mydata);
        return view ('beranda', $mydata);
        //$this->load()->view('beranda', $mydata);
        //return redirect()->to("beranda2/$mydata");          
    }

    public function set($token){
        echo $token;
    }
}