<?php

namespace App\Controllers;
use CodeIgniter\Controller;


class Course extends BaseController{
    public function getcourseinfo($token, $courseid)
    {
        $token = $token;
        $courseid= $courseid;
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_courses_by_field",
            "field"=>"id",
            "value"=>$courseid,
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
        $arrayLength = count($response["courses"]);
        //dd($response);
      
        $course_info[] =[
            $token,
            $response["courses"][0]["id"],
            $response["courses"][0]["displayname"],
        ];

        //dd($course_info);
       $this->data['course_info'] = $course_info;
       return $this->getcoursecontent();
    }

    public function getcoursecontent(){
        $course_info = $this->data['course_info'];

        $token=$course_info[0][0];
        $courseid=  $course_info[0][1];
        $coursename= $course_info[0][2];
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_contents",
            "courseid"=>$courseid,
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
        $arrayLength = count($response);
        
        //dd($response);
        $i = 1;

        while( $i < $arrayLength){
            $course_contents_list[] =[
                $response[$i]["id"],
                $response[$i]["name"],
                $response[$i]["modules"],
            ];
            $i++;
        }
      
        
        //dd($course_contents_list[0][2][1]["name"]);
        //dd($content_module_lxist);
        //dd($course_contents_list);
        $mydata['course_contents_list'] = $course_contents_list;  
        $mydata['coursename'] =  $coursename; 
        return view ('visdat_tugas', $mydata); 
    }

    

}
