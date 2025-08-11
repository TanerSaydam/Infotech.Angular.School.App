import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login')
    },
    {
        path: '',
        loadComponent: () => import('./pages/layouts/layouts'),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home')
            },
            {
                path: 'students',
                loadComponent: () => import('./pages/students/students')
            }
        ]
    }
];