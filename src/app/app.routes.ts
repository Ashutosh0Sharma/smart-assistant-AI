import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ChatComponent } from './pages/chat/chat.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FaqManagementComponent } from './pages/faq-management/faq-management.component';

export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'faq-management', component: FaqManagementComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'analytics', component: AnalyticsComponent }
];
