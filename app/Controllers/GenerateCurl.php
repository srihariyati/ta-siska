<?php

namespace App\Controllers;
use CodeIgniter\Controller;


class GenerateCurl extends BaseController
{
    public $main_url;

    public function __construct(){
        $this->main_url = 'https://cs.unsyiah.ac.id/~viska/moodle/webservice/rest/server.php';
    }
    
    public function curlGen($param){
        $data = http_build_query($param);
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL,$this->main_url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($curl, CURLOPT_POST, true);

        //kalau gapake ini gabisa akses moodle, karena masalah ssl
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT,10);

        $response= curl_exec($curl);
        curl_close($curl);

        $response = json_decode($response, true);
        return $response;
    }
}