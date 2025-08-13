import { Routes } from "@angular/router";

const router: Routes = [
    {
        path: '',
        loadComponent: () => import('./students')
    },
    {
        path: 'create',
        loadComponent: () => import('./create/create')
    }
]

export default router;