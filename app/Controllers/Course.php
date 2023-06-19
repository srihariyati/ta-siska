<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use Illuminate\Http\Request;
use Config\Services;


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

    public function getQuizAssign()
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
                        'cmid' => $quiz['coursemodule'],
                        'groupId' => $quiz['groupingid'],
                        'quizId' => $quiz['id'],
                        'quizName'=> $quiz['name'],
                        'openedDate'=> $quiz['timeopen'],
                        'closedDate'=>$quiz['timeclose']
                    ];
                    //dd($quiz['coursemodule']);
                }
            }

            //dd($filteredQuiz);
            return $this->response->setJSON( $filteredQuiz);


        } else if ($response["cm"]["modname"]== "assign"){
           //mod_assign_get_assignments
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
                        'cmId'=> $assign['cmid'],
                        'assignId' => $assign['id'],
                        'assignName'=> $assign['name'],
                        'openedDate'=> $assign['allowsubmissionsfromdate'],
                        'closedDate'=>$assign['duedate'],
                        'groupId' => $response["cm"]["groupingid"]
                    ];
                   //dd($filteredAssign);
                }
            }
            

            return $this->response->setJSON($filteredAssign);      
        }

    
    }

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
        $url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);
        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response_courseparticipant = curl_exec($curl);
        curl_close($curl);

        $response_courseparticipant = json_decode($response_participant, true);
        $arrayLength = count($response_participant);

        //dd($arrayLength);

        foreach($response_participant as $participant){
            if($participant['roles'][0]['shortname'] == "student"){
                $courseParticipant[] =[
                    'id' => $participant['id'],
                    'username'=> $participant["username"],
                    'fullname'=> $participant["fullname"]
                   ];
            }
          
        }
        return $this->response->setJSON($courseParticipant);  
        
    }


    public function getSubmittedParticipant()
    {
        $token = $this->request->getVar('token');
        $assignid = $this->request->getVar('assignid');
        $groupid = $this ->request->getVar('groupid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_list_participants",
            "assignid"=>$assignid,
            "groupid"=> $groupid,
            "filter"=>"",  
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

        $response_submittedparticipant = curl_exec($curl);
        curl_close($curl);

        $response_submittedparticipant = json_decode($response_submittedparticipant, true);
        $arrayLength = count($response_submittedparticipant);
        //dd($response_submittedparticipant);

        foreach($response_submittedparticipant as $participant){
            if($participant['roles'][0]['shortname']=='student'){
                if($participant['submissionstatus']=='submitted'){
                $submittedParticipant[] = [
                    'id' => $participant['id'],
                    'username'=> $participant["username"],
                    'fullname'=> $participant["fullname"],
                    'roles'=>$participant['roles'][0]['shortname']
                ];
            }
            }
            
        }


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
        $url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,$url);
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
            $url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL,$url);
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
        // data respone dibawa ke controller lagi melalui function js
        // untuk mendapatkan fullname dari user

        //cek jika userid grade == userid participant
        // get fullname dan username participant
        //dd($gradeList);
        return $this->response->setJSON($gradeList);
    }



    

    }
}
