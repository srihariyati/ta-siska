<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return view('login');
    }
    public function beranda()
    {
        return view('beranda');
    }
    public function tabel_kuis()
    {
        return view('tbl_kuis');
    }
    public function tabel_tugas()
    {
        return view('tbl_tugas');
    }
    public function edit_gradebook_all()
    {
        return view('edit_gradebook_all');
    }

}
