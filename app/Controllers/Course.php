<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use Illuminate\Http\Request;
use Config\Services;


class Course extends BaseController{
    use ResponseTrait;

    public $main_url;

    public function __construct(){
        $this->main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
    }

    public function getCourseInfo($token, $courseid, $mod)
    {
        $token = $token;
        $courseid= $courseid;
        $mod = $mod;
    
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_courses_by_field",
            "field"=>"id",
            "value"=>$courseid,
        ];
        
        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
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
      
        $course_info =[
            'token'=>$token,
            'courseid'=>$response["courses"][0]["id"],
            'displayname'=>$response["courses"][0]["displayname"],
        ];

        //dd($course_info);

       if ($mod=='gradebook'){ //jika gradebook.js yang akses
        return $this->response->setJSON($course_info);  
       }else if($mod == 'beranda'){ //jika beranda yang akses
        $this->data['course_info'] = $course_info;
        return $this->getcoursecontent();
       }
      
    }

    public function getCourseContent()
    {
        $course_info = $this->data['course_info'];

        $token = $course_info['token'];
        $courseid = $course_info['courseid'];
        $coursename = $course_info['displayname'];

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_contents",
            "courseid"=>$courseid,
        ];
        
        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
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
        
        
        $i = 1; //skip index 0 yang berisi 'General'

        while( $i < $arrayLength){
                $course_contents_list[] =[
                    'contentid'=>$response[$i]["id"],
                    'contentname'=>$response[$i]["name"],
                ]; 
            
            $i++;
        }
        //dd($course_contents_list);
        
        $mydata['course_contents_list'] = $course_contents_list;  
        $mydata['coursename'] =  $coursename; 
        $mydata['courseid'] = $courseid;
        $mydata['token'] = $token;

        return view ('visdat', $mydata);
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
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
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
        //mengambil semua content pada course
        $i = 1;

        //pilih content pada course (hanya pilih content yang id ==contentid)
         
        foreach($response as $cc){
            if($cc['id']==$contentid){
                $content_module =[
                    'contentid'=>$cc["id"],
                    'contentname'=>$cc["name"],
                    'contentmodules'=>$cc["modules"],
                ];
            }
        }


        //melakukan filter, memilih module yang ada didalam content yang dipilih
        //berdasarkan content id
        //hanya memilih module dalam mod kuis dan assign
        $filteredModules = [];
        foreach($content_module['contentmodules'] as $cm){
            if ($cm['modname'] == 'quiz' || $cm['modname'] == 'assign'){
                $filteredModules[] = [
                    'contentid'=>$content_module['contentid'],
                    'contentName'=>$content_module['contentname'],
                    'moduleId'=>$cm['id'],
                    'moduleName'=>$cm['name'],
                    'instance'=>$cm['instance'], //instance == quiz/assign id
                    'modulemod'=>$cm['modname']
                ];
            }
        }

       return $this->response->setJSON($filteredModules);
    }

    public function getQuiz(){
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $instanceid = $this->request->getVar('instanceid');
       
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_quiz_get_quizzes_by_courses",
            "courseids[0]"=>$courseid,
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

            $response_quiz = curl_exec($curl);
            curl_close($curl);

            $response_quiz = json_decode($response_quiz, true);
            $arrayLength = count($response_quiz);
           //dd($response_quiz["quizzes"]);

            $filteredQuiz = [];
           
            foreach($response_quiz['quizzes'] as $quiz){
                if ($quiz['id']==$instanceid){ //bisa ni diganti pake instance
                
                    $filteredQuiz = [
                        'mod' => "quiz",
                        'cmid' => $quiz['coursemodule'],
                        'groupId' => $quiz['groupingid'],
                        'quizId' => $quiz['id'],
                        'quizName'=> $quiz['name'],
                        'openedDate'=> $quiz['timeopen'],
                        'closedDate'=>$quiz['timeclose']
                    ];
                   
                }
            }
            // dd($filteredQuiz);
            return $this->response->setJSON( $filteredQuiz);
    }

    public function getAssign(){
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $instanceid = $this->request->getVar('instanceid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_assignments",
            "courseids[0]"=>$courseid,
            ];
        
            $data = http_build_query($param);
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL,$this->main_url);
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
                if ($assign['id']==$instanceid){
                    $filteredAssign = [
                        'mod'=> "assign",
                        'cmId'=> $assign['cmid'],
                        'assignId' => $assign['id'],
                        'assignName'=> $assign['name'],
                        'openedDate'=> $assign['allowsubmissionsfromdate'],
                        'closedDate'=>$assign['duedate'],
                        //'groupId' => $response["cm"]["groupingid"]
                    ];
                   //dd($filteredAssign);
                }
            }
            

            return $this->response->setJSON($filteredAssign);      
        }

    

    // public function getQuizAssign()
    // {
    //     $token = $this->request->getVar('token');
    //     $courseid = $this->request->getVar('courseid');
    //     $instanceid = $this->request->getVar('instance');

    //     //dapetin langung mod nya jadiin variabel
    //     //gaperlu lagi dong, langsung aja panggil si kuis pake data id quiz
    //     $param =[
    //         "wstoken" =>$token,
    //         "moodlewsrestformat"=>"json",
    //         "wsfunction"=>"core_course_get_course_module",
    //         "cmid"=>$cmid,
    //     ];
        
    //     $data = http_build_query($param);
    //     $curl = curl_init();
    //     curl_setopt($curl, CURLOPT_URL,$this->main_url);
    //     curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    //     curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    //     curl_setopt($curl, CURLOPT_POST, true);
    //     //kalau gapake ini gabisa akses moodle, karena masalah ssl
    //     curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    //     curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

    //     $response = curl_exec($curl);
    //     curl_close($curl);

    //     $response = json_decode($response, true);
    //     $arrayLength = count($response);

        
       
            


    //     } else if ($response["cm"]["modname"]== "assign"){
    //        //mod_assign_get_assignments
    //        $param =[
    //         "wstoken" =>$token,
    //         "moodlewsrestformat"=>"json",
    //         "wsfunction"=>"mod_assign_get_assignments",
    //         "courseids[0]"=>$courseid,
    //         ];
        
    //         $data = http_build_query($param);
    //         $curl = curl_init();
    //         curl_setopt($curl, CURLOPT_URL,$this->main_url);
    //         curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    //         curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    //         curl_setopt($curl, CURLOPT_POST, true);
    //         //kalau gapake ini gabisa akses moodle, karena masalah ssl
    //         curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    //         curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

    //         $response_assign = curl_exec($curl);
    //         curl_close($curl);

    //         $response_assign = json_decode($response_assign, true);
    //         $arrayLength = count($response_assign);

    //         //dd($response_assign['courses'][0]['assignments']);

    //         $filteredAssign = [];
    //         foreach($response_assign['courses'][0]['assignments'] as $assign){
    //             if ($assign['id']==$instanceid){
    //                 $filteredAssign[] = [
    //                     'mod'=> "assign",
    //                     'cmId'=> $assign['cmid'],
    //                     'assignId' => $assign['id'],
    //                     'assignName'=> $assign['name'],
    //                     'openedDate'=> $assign['allowsubmissionsfromdate'],
    //                     'closedDate'=>$assign['duedate'],
    //                     'groupId' => $response["cm"]["groupingid"]
    //                 ];
    //                //dd($filteredAssign);
    //             }
    //         }
            

    //         return $this->response->setJSON($filteredAssign);      
    //     }

    
    // }

    public function getCourseParticipant()
    {
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_enrol_get_enrolled_users",
            "courseid"=>$courseid,  
        ];

        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response_courseparticipant = curl_exec($curl);
        curl_close($curl);

        $response_courseparticipant = json_decode($response_courseparticipant, true);
        $arrayLength = count($response_courseparticipant);

        //dd($arrayLength);

        foreach($response_courseparticipant as $participant){
            $id =  $participant['id'];
            $username = $participant["username"];
            $fullname = $participant["fullname"];

            foreach($participant['roles'] as $role){
                if($role['shortname']== "student"){ //jika role adalh studen 
                    $courseParticipant[] =[
                        'id' => $participant['id'],
                        'username'=> $participant["username"],
                        'fullname'=> $participant["fullname"]
                       ];
                }
            }          
        }
    
        return $this->response->setJSON($courseParticipant);  
        
    }


    public function getSubmittedParticipant()
    {
        $token = $this->request->getVar('token');
        $assignid = $this->request->getVar('assignid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_submissions",
            "assignmentids[0]"=>$assignid,
            "status"=>'submitted'
        ];

        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response_submittedparticipant = curl_exec($curl);
        curl_close($curl);

        $response_submittedparticipant = json_decode($response_submittedparticipant, true);
        $arrayLength = count($response_submittedparticipant);
        

        $submittedParticipant = $response_submittedparticipant['assignments'][0]['submissions'];
        return $this->response->setJSON($submittedParticipant);

        

            
        

    }

    public function getGradeAssignment()
    {

        //mod_assign_get_grades
        // param : assignmentids[0]
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $assignid = $this->request->getVar('assignid');
       

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_grades",
            "assignmentids[0]"=>$assignid,  
        ];

        $data = http_build_query($param);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response_grade = curl_exec($curl);
        curl_close($curl);

        $response_grade = json_decode($response_grade, true);
        $arrayLength = count($response_grade);
       
        $grades = $response_grade["assignments"][0]["grades"];
        $response_grade= [];

        foreach( $grades as $g){
            $response_grade[] = [
                "gradeid"=>$g["id"],
                "userid"=>$g["userid"],
                "grade"=>$g["grade"],

            ];
            
        }
        //dd($response_grade);

        if ( $response_grade!=null){

          
           // "core_enrol_get_enrolled_users",
            // param"courseid"=>$courseid, 

            //get $courseParticipant
           // panggil wsfunction untuk mendapatkan course participant
           // cocokan userid participant dan userid grade

            //cek jika userid grade == userid participant
            // get fullname dan username participant
          
            $param =[
                "wstoken" =>$token,
                "moodlewsrestformat"=>"json",
                "wsfunction"=>"core_enrol_get_enrolled_users",
                "courseid"=>$courseid,  
            ];
      
          
            $data = http_build_query($param);
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL,$this->main_url);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
            curl_setopt($curl, CURLOPT_POST, true);
            //kalau gapake ini gabisa akses moodle, karena masalah ssl
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);
    
            $response_participant = curl_exec($curl);
            curl_close($curl);
    
            $response_participant = json_decode($response_participant, true);
            $arrayLength = count($response_participant);
    
            
    
            foreach($response_participant as $participant){
                if($participant['roles'][0]['shortname'] == "student"){
                    $courseParticipant[] =[
                        'userid' => $participant['id'],
                        'username'=> $participant["username"],
                        'fullname'=> $participant["fullname"]
                       ];
                }
              
            }

            //dd($response_grade, $courseParticipant);
            //dd($courseParticipant);
            
        
            $gradeList = [];
            foreach ($courseParticipant as $cp){
                foreach ($response_grade as $d){
                    if($cp['userid']==$d['userid']){
                        $grade = $d['grade'];
                        $letterGrade = '';

                        if ($grade >= 87) {
                            $letterGrade = "A";
                        } elseif ($grade >= 78) {
                            $letterGrade = "AB";
                        } elseif ($grade >= 69) {
                            $letterGrade = "B";
                        } elseif ($grade >= 60) {
                            $letterGrade = "BC";
                        } elseif ($grade >= 51) {
                            $letterGrade = "C";
                        } elseif ($grade >= 41) {
                            $letterGrade = "D";
                        } else {
                            $letterGrade = "E";
                        }

                        $gradeList[]=[
                            'idgrade'=>$d['gradeid'],
                            'userid'=>$d['userid'],
                            'fullname'=>$cp['fullname'],
                            'username'=>$cp['username'],
                            'grade'=>intval($d['grade']),
                            'lettergrade' => $letterGrade
                        ];
                    }
                }  
            }   
        }      
        // data respone dibawa ke controller lagi melalui function js
        // untuk mendapatkan fullname dari user

        //cek jika userid grade == userid participant
        // get fullname dan username participant
        //dd($gradeList);
        return $this->response->setJSON($gradeList);
    
    }

    public function getGradeQuiz()
    {
        $quizid =$this->request->getVar('quizid');

        //gunakan wsfunction


        $grade = [
            [
                "fullname"=>"AI",
                "grade"=>100,
                "q1"=>true,
                "q2"=>false,
                "q3"=>true,
                "q4"=>false,
                "q5"=>true,
            ],
            [
                "fullname"=>"AI",
                "grade"=>100,
                "q1"=>true,
                "q2"=>false,
                "q3"=>true,
                "q4"=>false,
                "q5"=>true,
            ],
        ];           
           
        return $this->response->setJSON($grade);
    }

    public function getQuizQues(){
        $$quizques = [
            [
                "fullname"=>"Ed",
                "grade"=>0,
                "q1"=>true,
                "q2"=>false,
                "q3"=>true,
                "q4"=>false,
                "q5"=>true,
            ],
            [
                "fullname"=>"Al",
                "grade"=>0,
                "q1"=>true,
                "q2"=>false,
                "q3"=>true,
                "q4"=>false,
                "q5"=>true,
            ],
        ];  
        return $this->response->setJSON($quizques);
    }
    
}
