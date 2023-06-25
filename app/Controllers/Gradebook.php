<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;

class Gradebook extends BaseController
{   
    private $token;
    private $courseid;

    public function __construct(){
        //setting dynamic!!!!
        $this->token = '774ccae9ca7328a2e4b977f5ebfa6770';
        $this->courseid = 3;

        //kalau bisa ada global variabel untuk user username/nim, dan course name

        // $this->token = $token;
        // $this->courseid = $courseid;

        //data course bisa diambil dari token dan courseid dari geGradebookView 
        // pada href visdat_tugas line 24
    }

    // public function getGradebookView($token, $courseid)
    public function getGradebookView()
    {
        $token = $this->token;
        $courseid = $this->courseid;

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

        $token = $course_info[0][0];
        $courseid = $course_info[0][1];
        $coursename = $course_info[0][2];

        $mydata['course_info']= $course_info;
        $mydata['coursename'] =  $coursename; 
        $mydata['courseid'] = $courseid;
        $mydata['token'] = $token;
        return view('gradebook', $mydata);
    }

    public function getGradebook()
    {
        // $token = $this->request->getVar('token');
        // $courseid = $this->request->getVar('courseid');
        $mod = $this->request->getVar('mod');

        $token = $this->token;
        $courseid = $this->courseid;

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
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

        $response_gradebook = $response["usergrades"];

       //dd($response_gradebook);
        $gradebook =[];
        

        if($mod =='quiz'){
            foreach($response_gradebook as $gb){
                $userid = $gb['userid'];
                $userfullname = $gb['userfullname'];
                $grades = [];
    
                foreach($gb['gradeitems'] as $gbitems){
    
                    //hanya mengambil quiz dan tugas
                    if($gbitems['itemmodule']=='quiz'){
    
                        $grades[] =[
                            'itemid'=>$gbitems['id'],
                            'itemname'=> $gbitems['itemname'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule']
                        ];
                    }
                }
    
                $gradebook[]=[
                    'userid'=>$userid,
                    'userfullname'=>$userfullname,
                    'grades'=>$grades
                ];
                
            }
            return $this->response->setJSON($gradebook);

        } else if ($mod =='assign'){
            foreach($response_gradebook as $gb){
                $userid = $gb['userid'];
                $userfullname = $gb['userfullname'];
                $grades = [];
    
                foreach($gb['gradeitems'] as $gbitems){
    
                    //hanya mengambil quiz dan tugas
                    if($gbitems['itemmodule']=='assign'){
    
                        $grades[] =[
                            'itemid'=>$gbitems['id'],
                            'itemname'=> $gbitems['itemname'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule']
                        ];
                    }
                }
    
                $gradebook[]=[
                    'userid'=>$userid,
                    'userfullname'=>$userfullname,
                    'grades'=>$grades
                ];
                
            }
            return $this->response->setJSON($gradebook);
        } else {

            //dd($gradebook);
            foreach($response_gradebook as $gb){
                $userid = $gb['userid'];
                $userfullname = $gb['userfullname'];
                $grades = [];
    
                foreach($gb['gradeitems'] as $gbitems){
    
                    //hanya mengambil quiz dan tugas
                    if($gbitems['itemmodule']=='quiz' || $gbitems['itemmodule']=='assign'){
    
                        $grades[] =[
                            'itemid'=>$gbitems['id'],
                            'itemname'=> $gbitems['itemname'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule']
                        ];
                    }
                }
    
                $gradebook[]=[
                    'userid'=>$userid,
                    'userfullname'=>$userfullname,
                    'grades'=>$grades
                ];
                
            }
            return $this->response->setJSON($gradebook);

        }

        
    }

    public function getPersonalGrade(){

        $userid = $this->request->getVar('userid');
        
        //harusnya token dan courseid adalah global variabel
        $token = $this->token;
        $courseid =  $this->courseid;

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
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

        $response_gradebook = $response["usergrades"];

       //dd($response_gradebook);
        $personalGrade =[];

        //pilih data denga userid==$userid
        
        foreach($response_gradebook as $rg){
            if($rg['userid']==$userid){
                $personalGrade=[
                    'userid'=>$rg['userid'],
                    'courseid'=>$rg['courseid'],
                    'userfullname'=>$rg['userfullname'],
                    'gradeitems'=>$rg['gradeitems'],
                ];
            }
        }

        //dapatkan coursename, courseid
        //dd($personalGrade);
        // return view('gradebook', $data);
        //return kehalaman baru dengan $mydata dengan isi semua data
        $mydata['token'] = $token;
        $mydata['personal_grade'] = $personalGrade;
        return view('personal_gradebook', $mydata);

        //set mod here to return response
    }

    public function getModuleGrade(){
        $itemid = $this->request->getVar('itemid');

        //harusnya token dan courseid adalah global variabel
        $token = $this->token;
        $courseid = $this->courseid;

        //get item id
        //plih data grade dari semua user yang item id nya ==$item id

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
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

        $response_gradebook = $response["usergrades"];

       //dd($response_gradebook);
        $modulelGrade =[];

        foreach($response_gradebook as $rg){
            $userfullname = $rg['userfullname'];
            $userid = $rg['userid'];


            foreach($rg['gradeitems'] as $gi){
                if($gi['id']==$itemid){
                    $gradeid = $gi['id'];
                    $itemname = $gi['itemname'];
                    $itemtype = $gi['itemtype'];
                    $grade = $gi['graderaw'];

                    $modulelGrade[]=[
                        'userid'=>$userid,
                        'gradeid'=>$gradeid,
                        'userfullname'=>$userfullname,
                        'itemname'=>$itemname,
                        'itemtype'=>$itemtype,
                        'grade'=>$grade
                    ];
                }
                
            }
            
        }

        dd($modulelGrade);
        ///return halaman untuk show dan edit nilai 
    }

    public function getStudentInfo(){ 

        $userid = $this->request->getVar('userid');
        $token = $this->request->getVar('token');
        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_user_get_users_by_field",
            "field"=>"id",
            "values[0]"=>$userid

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

        return $this->response->setJSON($response);
    
    }
    
}