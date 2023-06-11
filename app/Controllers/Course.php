<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use Illuminate\Http\Request;


class Course extends BaseController{
    use ResponseTrait;

    public function getCourseInfo($token, $courseid)
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

    public function getCourseContent()
    {
        $course_info = $this->data['course_info'];

        $token = $course_info[0][0];
        $courseid = $course_info[0][1];
        $coursename = $course_info[0][2];

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
                $response[$i]["modules"]
            ];
            $i++;
        }
   
        
        $mydata['course_contents_list'] = $course_contents_list;  
        $mydata['coursename'] =  $coursename; 
        $mydata['courseid'] = $courseid;
        $mydata['token'] = $token;
        return view ('visdat_tugas', $mydata); 
    }

    
    public function getCourseModule()
    {
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $contentid =  $this->request->getVar('contentid');

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
            $content_module[] =[
                $response[$i]["id"],
                $response[$i]["name"],
                $response[$i]["modules"],
            ];
            $i++;
        }
        
        $filteredModules = [];
        // Iterasi melalui array response
        foreach ($content_module as $course) {
            if ($course[0] == $contentid) {
                $filteredModules[] =[
                    'contentName'=> $course[1],
                    'modules' => $course[2],

                ] ;
                break;
            }
        }
       
        //dd($filteredModules[0]['contentName']);
        $result = [];
        

        foreach ($filteredModules[0]['modules'] as $module) {
            if ($module['modname'] == 'quiz' || $module['modname'] == 'assign') {
                $result[] = [
                    'contentName' =>$filteredModules[0]['contentName'],
                    'moduleId' => $module['id'],
                    'moduleName' => $module['name']
                ];
            }
        }
        //dd($result);    
        return $this->response->setJSON($result);
    }

    public function getModule()
    {
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $cmid = $this->request->getVar('cmid');

       

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_course_module",
            "cmid"=>$cmid,
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

        if ($response["cm"]["modname"] == "quiz"){
           //mod_quiz_get_quizzes_by_courses
           
           $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_quiz_get_quizzes_by_courses",
            "courseids[0]"=>$courseid,
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

            $response_quiz = curl_exec($curl);
            curl_close($curl);

            $response_quiz = json_decode($response_quiz, true);
            $arrayLength = count($response_quiz);
           //dd($response_quiz["quizzes"]);

            $filteredQuiz = [];
           
            foreach($response_quiz['quizzes'] as $quiz){
                if ($quiz['coursemodule']==$cmid){
                
                    $filteredQuiz[] = [
                        'mod' => "quiz",
                        'quizId' => $quiz['id'],
                        'quizName'=> $quiz['name'],
                        'timeOpen'=> $quiz['timeopen'],
                        'timeClose'=>$quiz['timeclose']
                    ];
                    //dd($quiz['coursemodule']);
                }
            }

            //dd($filteredQuiz);
            return $this->response->setJSON( $filteredQuiz);


        } else if ($response["cm"]["modname"]== "assign"){
           //mod_assign_get_assignments
           //dd($courseid);

           $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_assignments",
            "courseids[0]"=>$courseid,
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

            $response_assign = curl_exec($curl);
            curl_close($curl);

            $response_assign = json_decode($response_assign, true);
            $arrayLength = count($response_assign);

            //dd($response_assign['courses'][0]['assignments']);

            $filteredAssign = [];
            foreach($response_assign['courses'][0]['assignments'] as $assign){
                if ($assign['cmid']==$cmid){
                    $filteredAssign[] = [
                        'mod'=> "assign",
                        'assignId' => $assign['id'],
                        'assignName'=> $assign['name'],
                        'openedDate'=> $assign['allowsubmissionsfromdate'],
                        'closedDate'=>$assign['duedate'],
                    ];
                   // dd($filteredAssign);
                }
            }

            return $this->response->setJSON($filteredAssign);      
        }

    
    }

    

    

}
