<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use Illuminate\Http\Request;
use Config\Services;
use App\Controllers\GenerateCurl;


class Course extends BaseController{
    use ResponseTrait;

    public $main_url;

    public function __construct(){
        $this->main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
        $this->session = \Config\Services::session();
    }

    public function getCourseInfo($courseid){
        $token = $this->session->get('token');
       
        $courseid= $courseid;
      
    
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_courses_by_field",
            "field"=>"id",
            "value"=>$courseid,
        ];

        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);
      
        $course_info =[
            'token'=>$token,
            'courseid'=>$response["courses"][0]["id"],
            'displayname'=>ucwords($response["courses"][0]["displayname"]),
        ];
        $this->data['course_info'] = $course_info;
        return $this->getcoursecontent();
        
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
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

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

        
        //dd($mydata['course_contents_list']);
        return view ('aktivitas', $mydata);
    }

    public function getCourseModule()
    {
        // Get data from POST request
        $token = $this->request->getPost('token');
        $courseid = $this->request->getPost('courseid');
        $contentid = $this->request->getPost('contentid');


        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_contents",
            "courseid"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

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

        //dd($filteredModules);
       return $this->response->setJSON($filteredModules);
    }

    public function getQuiz(){
        $token = $this->request->getPost('token');
        $courseid = $this->request->getPost('courseid');
        $instanceid = $this->request->getPost('instanceid');
       
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_quiz_get_quizzes_by_courses",
            "courseids[0]"=>$courseid,
            ];
        
            $curlGen = new GenerateCurl();
            $response_quiz =  $curlGen->curlGen($param);

            $filteredQuiz = [];
            foreach($response_quiz['quizzes'] as $quiz){
                if ($quiz['id']==$instanceid){
                
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
            //dd($filteredQuiz);
            return $this->response->setJSON( $filteredQuiz);
    }

    public function getAssign(){
        $token = $this->request->getPost('token');
        $courseid = $this->request->getPost('courseid');
        $instanceid = $this->request->getPost('instanceid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_assignments",
            "courseids[0]"=>$courseid,
            ];
        
            $curlGen = new GenerateCurl();
            $response_assign =  $curlGen->curlGen($param);

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
            //dd($filteredAssign);
            return $this->response->setJSON($filteredAssign);      
    }

    public function getCourseParticipant()
    {
        $token = $this->request->getPost('token');
        $courseid = $this->request->getPost('courseid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_enrol_get_enrolled_users",
            "courseid"=>$courseid,  
        ];

        $curlGen = new GenerateCurl();
        $response_courseparticipant =  $curlGen->curlGen($param);

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
        $token = $this->request->getPost('token');
        $assignid = $this->request->getPost('assignid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_submissions",
            "assignmentids[0]"=>$assignid,
            "status"=>'submitted'
        ];

        $curlGen = new GenerateCurl();
        $response_submittedparticipant =  $curlGen->curlGen($param);
        
        $submittedParticipant = $response_submittedparticipant['assignments'][0]['submissions'];
        return $this->response->setJSON($submittedParticipant);      
    }

    public function getGradeAssignment()
    {

        //mod_assign_get_grades
        // param : assignmentids[0]
        $token = $this->request->getPost('token');
        $courseid = $this->request->getPost('courseid');
        $assignid = $this->request->getPost('assignid');
       

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_grades",
            "assignmentids[0]"=>$assignid,  
        ];

        $curlGen = new GenerateCurl();
        $response_grade =  $curlGen->curlGen($param);
       
        $grades = $response_grade["assignments"][0]["grades"];
        $response_grade= [];

        foreach( $grades as $g){
            //jika respongrade['grade']==null atau <0
            //maka jadikan 0
            $grade = $g["grade"];
            if ($grade === null || $grade < 0) {
                $grade = 0;
            }
            $response_grade[] = [
                "gradeid"=>$g["id"],
                "userid"=>$g["userid"],
                "grade"=> $grade,
            ];         
        }

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
      
          
            $curlGen = new GenerateCurl();
            $response_participant =  $curlGen->curlGen($param);
    
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
                       
                        if ($grade === null || $grade < 0) {
                            $grade = 0;
                        }
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
                            'grade'=>intval($grade),
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

    public function getGradeQuiz(){
        $token =  $this->request->getPost('token');       
        $quizid = $this->request->getPost('quizid');
        $participant = $this->request->getPost('participant');
        //dd($participant);

        $quizAttempt=[];
        $quizAttemptAll=[];
        $quizGrade=[];
        $quizGradeAll=[];
        $curlGen = new GenerateCurl();

        foreach($participant as $userid){
            //looping untuk wsfunction here
            $param =[
                "wstoken" =>$token,
                "moodlewsrestformat"=>"json",
                "wsfunction"=>"mod_quiz_get_user_attempts",
                "quizid"=> $quizid,
                "userid"=>$userid['id']
            ];
    
            $response =  $curlGen->curlGen($param);
            $attempsid = $response['attempts'];

            $arrayLength = count($attempsid);
            if($arrayLength>0){ //karena ada user yang gada attempt
                $quizAttempt=[
                    'quizid'=>$quizid,
                    'userid'=>$userid['id'],
                    'studentname'=>$userid['fullname'],
                    'username'=>$userid['username'],
                    'attemptsid'=>$attempsid[0]['id']
                ];
            }     
            
            array_push($quizAttemptAll,  $quizAttempt);
            
            //ambil attemptid untuk ws function mod_quiz_get_attempt_review 
            //untuk mendapatkan nilaigrade dan perpertanyaan
        
        }
        

        //ada yang attemptsid nya sama
        //handling error attempts id sama
        // $type = gettype($quizAttemptAll);
        // echo "Tipe data dari \$data adalah: $type";
        // die();
        // //ubah json->array
        // $arrayQuizAttempt =json_decode($quizAttemptAll);
    
        // //hapus duplikasi data 
        $quizAttemptUniqe = array_unique($quizAttemptAll, SORT_REGULAR);


        // Menghapus elemen array yang kosong (array dengan jumlah elemen 0)
        $quiz_Attempts_fix = array_filter($quizAttemptUniqe, function ($value) {
            return !empty($value);
        });

        //indexing ulang
        $quiz_Attempts = array_values( $quiz_Attempts_fix);

        // var_dump( $quiz_Attemptsss);
        // die();

        foreach($quiz_Attempts as $att){
            //looping untuk wsfunction here
            $param =[
                "wstoken" =>$token,
                "moodlewsrestformat"=>"json",
                "wsfunction"=>"mod_quiz_get_attempt_review",
                "attemptid"=> $att['attemptsid'],
            ];

            $response_grade =  $curlGen->curlGen($param);
          
            $questions=[];
            foreach($response_grade['questions'] as $ques){
                $questions[]=[
                    'slot'=>$ques['slot'],
                    'status'=>$ques['status'],
                ];
            }

            //jika respongrade['grade']==null atau <0
            //maka jadikan 0
            $grade = $response_grade['grade'];
            if ($grade === null || $grade < 0) {
                $grade = 0;
            }

            $quizGrade=[
                'quizid'=>$response_grade['attempt']['quiz'],
                'attemptsid'=>$att['attemptsid'],
                'userid'=>$response_grade['attempt']['userid'],
                'studentname'=>$att['studentname'],
                'username'=>$att['username'],
                'grade'=>$grade,
                'questions'=>$questions
                
            ];
            
            array_push($quizGradeAll,  $quizGrade);
        }
        // var_dump($quizGradeAll);
        // die();
        //dd($quizGradeAll);         
        //gunakan wsfunction untuk mendapatkan data
        //data idgrade, userid, grade, username(optional)
    
        return $this->response->setJSON($quizGradeAll);
    }
}
