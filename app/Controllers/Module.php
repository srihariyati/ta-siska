<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;

class Module extends BaseController
{
    use ResponseTrait;
    public function getCourseModule(){
        $id = $this->request->getVar('id');
        
       
        $data = [
            [
                "id" => 1,
                "name" => "Course 1",
                "modules" => [
                    [
                        "id" => 101,
                        "name" => "Assign 1-1",
                        "mode" => "assign"
                        
                    ],
                    [
                        "id" => 102,
                        "name" => "Kuis 1-2",
                        "mode" => "quiz"
                    ],
                    [
                        "id" => 103,
                        "name" => "Module 1-3",
                        "mode" => "url"
                    ]
                ]
            ],
            [
                "id" => 2,
                "name" => "Course 2",
                "modules" => [
                    [
                        "id" => 201,
                        "name" => "Module 2-1",
                        "mode" => "url"
                    ],
                    [
                        "id" => 202,
                        "name" => "Module 2-2",
                        "mode" => "assign"
                    ],
                    [
                        "id" => 203,
                        "name" => "Module 2-3",
                        "mode" => "submission"
                    ]
                ]
            ]
        ];

        $filteredModules = [];
        // Iterasi melalui array response
        foreach ($data as $course) {
            if ($course['id'] == $id) {
                $filteredModules = $course['modules'];
                break;
            }
        }

        $result = [];

        foreach ($filteredModules as $module) {
            if ($module['mode'] == 'quiz' || $module['mode'] == 'assign') {
                $result[] = [
                    'moduleId' => $module['id'],
                    'moduleName' => $module['name']
                ];
            }
        }
        
        
        //dd($filteredModules);
        // Return the response
        //return $this->response->setJSON($respone);
        return $this->response->setJSON($result);
    }
}
