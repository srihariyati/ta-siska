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
        //dd($response_gradebook);
        

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
                            'itemnumber'=>$gbitems['itemnumber'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule'],
                            'cmid'=>$gbitems['cmid']
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
                            'itemnumber'=>$gbitems['itemnumber'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule'],
                            'cmid'=>$gbitems['cmid']
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

            //dd($response_gradebook);
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
                            'itemnumber'=>$gbitems['itemnumber'],
                            'grade'=> $gbitems['graderaw'],
                            'itemmodule'=>$gbitems['itemmodule'],
                            'cmid'=>$gbitems['cmid']
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
    ///sehaurusnya sending itemid aja ke view, baru diproses pake js pake ajax
    //

    public function getModuleGradeView(){
        $itemid = $this->request->getVar('itemid');
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');
        $cmid = $this->request->getVar('cmid');
       

        $mydata=[
            'token'=>session('token'),
            'courseid'=>$courseid,
            'cmid'=>$cmid,
            'itemid'=>$itemid
        ];

        return view('module_gradebook', $mydata);
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
        $cmid=$this->request->getVar('cmid');
        $instanceid=$this->request->getVar('instanceid');

        //item id!=cmid

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

       //dd($response_gradebook);
        $modulelGrade =[];
        $modmodule='default';

        foreach($response_gradebook as $rg){
            $userfullname = $rg['userfullname'];
            $userid = $rg['userid'];

            foreach($rg['gradeitems'] as $gi){
                if($gi['id']==$itemid){
    
                    $cmid = $gi['cmid'];
                    $modmodule = $gi['itemmodule'];

                    $moduleGrade[]=[
                        'userid'=>$userid,
                        'userfullname'=>$userfullname,
                        'itemid'=>$gi['id'],
                        'instanceid'=>  $instanceid,
                        'itemname'=> $gi['itemname'],
                        'itemnumber'=>$gi['itemnumber'],
                        'itemmodule'=> $gi['itemmodule'],
                        'cmid'=>$cmid,
                        'grade'=>$gi['graderaw'],
                    ];
                }
                
            }
            
        }
        // /dd($moduleGrade);
        if($modmodule=='assign'){
            //buat data status submission
            $submissionstatus = $this->getSubmissionStatus($token, $instanceid, $courseid);
            //dd($submissionstatus);  
            
            foreach($moduleGrade as $mg){
                foreach($submissionstatus as $ss){
                    if($mg['userid']==$ss['userid']){


                        //perbaharui moduleGrade
                        //tambahkan status submissionya kedalam moduleGrade
                        //looping untuk setiap data userid di dalam moduleGrade,
                        $moduleGradeFix[]=[
                            'userid'=>$mg['userid'],
                            'userfullname'=>$mg['userfullname'],
                            'itemid'=>$mg['itemid'],
                            'instanceid'=>$mg['instanceid'],
                            'itemname'=>$mg['itemname'],
                            'itemnumber'=>$mg['itemnumber'],
                            'itemmodule'=> $mg['itemmodule'],
                            'cmid'=>$mg['cmid'],
                            'grade'=>$mg['grade'],
                            'submissionstatus'=>$ss['submissionstatus']
                        ];

                    }
                }
            }
            //dd($moduleGradeFix);
        }else if($modmodule=='quiz'){
            $moduleGradeFix=$moduleGrade;
        }

        // return to ajax

        ///return halaman untuk show dan edit nilai 
        return $this->response->setJSON($moduleGradeFix);
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

    public function getSubmissionStatus($token, $assignid, $courseid){

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
                'submissionstatus'=>$status
            ];
          

        }
        //dd($submissionstatus);
        return $submissionstatus;
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


    public function updateModuleGrade(){
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');

        $activityid = $this->request->getVar('activityid');
        $studentid = $this->request->getVar('studentid');
        $itemModule = $this->request->getVar('itemModule');
        $itemNumber = $this->request->getVar('itemNumber');
        $grade = $this->request->getVar('grade');

        if($itemModule=='assign'){
            $source='assignment';
            $component='mod_assign';
        }else if($itemModule =='quiz'){
            $source='quiz';
            $component='mod_quiz';
        }

        $param =[
            "wstoken" =>$token,
            "moodlewsrestformat"=>"json",
            "wsfunction"=>"core_grades_update_grades",
            "courseid"=>$courseid,
            "source"=>$source,
            "component"=>$component,
            "activityid"=>$activityid,
            "itemnumber"=>  $itemNumber,
            "grades[0][studentid]"=>$studentid,
            "grades[0][grade]"=> $grade
        ];
        
        $curlGen = new GenerateCurl();
        $response =  $curlGen->curlGen($param);
        
        //kasih sweet alert
        //jika status invalid langsung bilang salah password
        //return redirect()->back()->with('updateStatus', 'Yeay! Nilai berhasil diubah');

        return $this->response->setJSON($response);
    }

    public function updateModuleGradeAll(){
        //loop for all data
        //data grade
        //data mod
        //data token
        $courseid = $this->request->getVar('courseid');
        $token = $this->request->getVar('token');
        $activityid = $this->request->getVar('activityid');
        $itemModule = $this->request->getVar('itemModule');
        $dataGrade = $this->request->getVar('dataGrade');
        

        //isi didalam array{}}
        if($itemModule=='assign'){
            $source='assignment';
            $component='mod_assign';
        }else if($itemModule =='quiz'){
            $source='quiz';
            $component='mod_quiz';
        }
        
        foreach($dataGrade as $dg){
            $param =[
                "wstoken" =>$token,
                "moodlewsrestformat"=>"json",
                "wsfunction"=>"core_grades_update_grades",
                "courseid"=>$courseid,
                "source"=>$source,
                "component"=>$component,
                "activityid"=>$activityid,
                "itemnumber"=>  $dg['itemNumber'],
                "grades[0][studentid]"=>$dg['studentId'],
                "grades[0][grade]"=> $dg['grade']
            ];
            
            $curlGen = new GenerateCurl();
            $response =  $curlGen->curlGen($param);
        }
        return $this->response->setJSON($response);
    }
    
}