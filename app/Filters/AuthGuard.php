<?php 

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class AuthGuard implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $isAuthRoute = strpos($request->uri->getPath(), 'auth') !== FALSE;
        $isLoggedIn = session('isLoggedIn');

        if ($isLoggedIn && $isAuthRoute) {
            return redirect()->to('beranda/getEnrolledCourses');
        } else if (!$isLoggedIn && !$isAuthRoute) {
            return redirect()->to('login/auth');
        } 
    }
    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        
    }
}