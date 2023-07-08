<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use App\Controllers\GenerateCurl;

class Gradebook extends BaseController
{   
    private $token;
    private $courseid;
    private $main_url;

    public function __construct(){
        //setting dynamic!!!!

        $this->main_url='https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
        $this->session = \Config\Services::session();
        //kalau bisa ada global variabel untuk user username/nim, dan course name

        // $this->token = $token;
        // $this->courseid = $courseid;

        //data course bisa diambil dari token dan courseid dari geGradebookView 
        // pada href visdat_tugas line 24
    }

    public function getGradebookView($courseid){
        $token = $this->session->get('token');
        $courseid = $courseid;

        //kirim ke view gradebook
        $mydata=[
            'courseid' => $courseid,
            'token'=>$token,
        ];
        return view('gradebook', $mydata);

    }

    public function getGradebook(){

        $mod = $this->request->getVar('mod');
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseId');
        //dd($courseid, $token, $mod);

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
            "courseid"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);
        
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
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');
        


        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
            "courseid"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);
        

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
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');

        //get item id
        //plih data grade dari semua user yang item id nya ==$item id

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"gradereport_user_get_grade_items",
            "courseid"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

        $response_gradebook = $response["usergrades"];

        //ambil data telat mengumpulkan atau tidak??
        //instance a te;at mengumpulkan
        //ambil mod nya dulu
        //jalankan

        

       //dd($response_gradebook);
        $modulelGrade =[];

        foreach($response_gradebook as $rg){
            $userfullname = $rg['userfullname'];
            $userid = $rg['userid'];


            foreach($rg['gradeitems'] as $gi){
                if($gi['id']==$itemid){
                    $cmid = $gi['cmid'];
                    $modulelGrade[]=[
                        'userid'=>$userid,
                        'gradeid'=>$gi['id'],
                        'userfullname'=>$userfullname,
                        'itemname'=> $gi['itemname'],
                        'itemmodule'=> $gi['itemmodule'],
                        'cmid'=>$cmid,
                        'grade'=>$gi['graderaw'],
                    ];
                }
                
            }
            
        }
        $dataaa=$this->getSubmissionStatus();
        dd($dataaa);
     
        session()->set('token', $token);
        $mydata=[
            'token'=>session('token'),
            'courseid'=>$courseid,
            'cmid'=>$cmid,
            'module_grade'=>$modulelGrade
        ];
 
        //kirim token jadi session
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
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

        return $this->response->setJSON($response);
    
    }

    public function getModuleInfo(){
        $token = $this->request->getVar('token');
        $courseid = $this->request->getVar('courseid');
        $cmid = $this->request->getVar('cmid');

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_contents",
            "courseid"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);

        foreach ($response as $cm){
            $contentid = $cm['id'];
            $contentname = $cm['name'];

            //ambil semua list modules
            foreach ($cm['modules'] as $cmm){
                //pilih modules dengan cmid==$cmid
                if($cmm['id']==$cmid){
                    $modules = [
                        'cid'=>$contentid,
                        'cname'=>$contentname,
                        'cmid'=>$cmm['id'],
                        'cmname'=>$cmm['name'],
                        'instanceid'=>$cmm['instance'], // instance == quiz/assign id 
                        'cmmod'=>$cmm['modname']
                    ];
                }
                
            }
        }

        return $this->response->setJSON($modules);
    }

    public function getCourseName(){
        
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');


        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_course_get_courses_by_field",
            "field"=>"id",
            "value"=>$courseid,
        ];

        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);
        // /dd($response);

        $coursename = $response["courses"][0];
        return $this->response->setJSON($coursename);
    }

    public function getSubmissionStatus(){
        //untuk di module grade mod assign
        $token ='774ccae9ca7328a2e4b977f5ebfa6770';
        $assignid = 1; //instance id
        $courseid = 3;

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_submissions",
            "assignmentids[0]"=>$assignid,
        ];

        $curlGen = new GenerateCurl();
        $response_submission =  $curlGen->curlGen($param);

        //buat perhitungan kumpul tepat waktu atau kumpul telat
        //nilai minus maka telat

        $response_submission = $response_submission['assignments'][0];
        $duedate=$this->getDueDate($token, $courseid, $assignid);

        foreach($response_submission['submissions'] as $submission){
            $status=$submission['status'];
            $time=$duedate['duedate']-$submission['timemodified'];

            if ($status=='submitted'){
                if ($time<0){
                    $status='late submitted';
                }else{
                    $status=$submission['status'].' ontime';
                }
            }else{
                $status=$submission['status'];
            }
            
            $submissionstatus[]=[
                'assignid'=>$assignid,
                'userid'=>$submission['userid'],
                'status'=>$submission['status'],
                'latestatus'=>$status
            ];
          

        }
        dd($submissionstatus);
        return $response_submission['assignments'][0];
    }

    public function getDueDate($token, $courseid, $assignid){

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"mod_assign_get_assignments",
            "courseids[0]"=>$courseid,
        ];
        
        $curlGen = new GenerateCurl();
        $response_assign =  $curlGen->curlGen($param);

        foreach($response_assign['courses'][0]['assignments'] as $assign){
            if($assign['id']==$assignid){
                $dueDate=[
                    'assignid'=>$assign['id'],
                    'duedate'=>$assign['duedate']
                ];
            }
            
        }
       return $dueDate;
    }
    
}