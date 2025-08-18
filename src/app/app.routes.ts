import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ChatComponent } from './pages/chat/chat.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FaqManagementComponent } from './pages/faq-management/faq-management.component';

export const routes: Routes = [
    { path: "", pathMatch: 'full', redirectTo: 'dashboard' },
    { path: "", component: LandingComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    },
    { path: 'faq-management', loadComponent: ()=> import('./pages/faq-management/faq-management.component').then((m) => m.FaqManagementComponent)},
    { path: 'chat', loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent) },
    { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent) }
];
