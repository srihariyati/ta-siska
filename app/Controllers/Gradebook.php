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

        $personalGrade =[];
        $gradeRawAll=[];

        $gradeSums = [];
      
        $gradeCounts = [];

        foreach($response_gradebook as $rg){

            //----[START] MENGHITUNG MEAN UNTUK TIAP GRADE RAW BERDASARKAN GRADEID----//
            //ambil semua data iditem/grade dan graderaw
            foreach($rg['gradeitems'] as $rgi){
                if($rgi['itemmodule']=='assign'||$rgi['itemmodule']=='quiz'){
                    $gradeRawAll[]=[
                        'idgrade'=>$rgi['id'],
                        'graderaw'=>$rgi['graderaw']
                    ];
                }
            }
        }
        //data $gradeRawAll berisi data yang berulang
        foreach ($gradeRawAll as $grade) {
               
            //looping untuk tiap idgrade
            $idgrade = $grade['idgrade'];
            $graderaw = $grade['graderaw'];
        
            //jika idgrade belum ada ddialam array $gradesum
            if (!isset($gradeSums[$idgrade])) {
                //deklarasi awal nilainya 0 jika data grade belum ada
                //id grade dijadikan index   
                $gradeSums[$idgrade] = 0; //jumlah dr seluruh grade
                $gradeCounts[$idgrade] = 0; //banyaknya dr seluruh grade
            }

            $gradeSums[$idgrade] += $graderaw; //proses sum data grade raw untuk id yang sama
            $gradeCounts[$idgrade]++; //menghitung banyaknya data yang dihitung               
        }

        foreach ($gradeSums as $idgrade => $sum) {
                
            $mean = $sum / $gradeCounts[$idgrade]; //lakukan perhitungan mean
            $mean = number_format($mean, 2);
            $gradeMeans[] = [
                "idgrade" => $idgrade,
                "sum"=>$sum,
                "count"=> $gradeCounts[$idgrade],
                "mean" => $mean,                
            ];
        }

        foreach($response_gradebook as $rg){
            $gradeItems = [];
            if($rg['userid']==$userid){
                $userid = $rg['userid'];
                $courseid = $rg['courseid'];
                $userfullname = $rg['userfullname'];
                
                //ambil grade
                foreach($rg['gradeitems'] as $gi){
                    //ambil grade quiz dan assign aja
                    if($gi['itemmodule']=='assign'||$gi['itemmodule']=='quiz'){
                        foreach($gradeMeans as $gm){
                            if($gm['idgrade']==$gi['id']){
                    
                                $gradeItems[]= [
                                    'gradeid' => $gi['id'],
                                    'itemname'=> $gi['itemname'],
                                    'graderaw' => $gi['graderaw'],
                                    'grademean'=> $gm['mean'],
                                  ];
                            }
                        }
                    }
                    
                    
                }

                $personalGrade=[
                    'userid'=>$rg['userid'],
                    'courseid'=>$rg['courseid'],
                    'userfullname'=>$rg['userfullname'],
                    'gradeitems'=> $gradeItems,
                ];
            }
        }

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

        $mydata['module_grade'] = $modulelGrade;
        return view('module_gradebook', $mydata);
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