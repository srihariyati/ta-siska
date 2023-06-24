<?php

namespace App\Controllers;
use CodeIgniter\Controller;

class Gradebook extends BaseController
{
    public function getGradebookView($token, $courseid)
    {

        //get var idcourse
        //get all gradebook
        //return all gradebook, assign, quiz, fulname, usernmae/nim

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
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $mod = $this->request->getVar('mod');

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
        $token = '774ccae9ca7328a2e4b977f5ebfa6770';
        $courseid = '3';

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
                    'gradesitems'=>$rg['gradeitems'],
                ];
            }
        }
        //dapatkan coursename, courseid
       return ($personalGrade);
        // return view('gradebook', $data);
        //return kehalaman baru dengan $mydata dengan isi semua data
    }

    public function getModuleGrade(){
        $itemid = $this->request->getVar('itemid');

        //harusnya token dan courseid adalah global variabel
        $token = '774ccae9ca7328a2e4b977f5ebfa6770';
        $courseid = '3';

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
    
}