import { Routes } from "@angular/router";

const router: Routes = [
    {
        path: '',
        loadComponent: () => import('./class-rooms')
    }
]

export default router;