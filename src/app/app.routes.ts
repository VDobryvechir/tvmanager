import { Routes } from '@angular/router';
import {AppHomeComponent} from './pages/home/app-home.component';
import {AppGroupComponent} from './pages/group/app-group.component';
import {AppPictureComponent} from './pages/picture/app-picture.component';
import {AppPresentationComponent} from './pages/presentation/app-presentation.component';
import {AppScreenComponent} from './pages/screen/app-screen.component';
import {AppTvpcComponent} from './pages/tvpc/app-tvpc.component';
import {AppVideoComponent} from './pages/video/app-video.component';
import {ScreenDetailComponent} from './pages/screen/detail/screen-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: AppHomeComponent },
    { path: 'group', component: AppGroupComponent },
    { path: 'picture', component: AppPictureComponent },
    { path: 'presentation', component: AppPresentationComponent },
    { path: 'screen', component: AppScreenComponent },
    { path: 'tvpc', component: AppTvpcComponent },
    { path: 'video', component: AppVideoComponent },
    { path: 'screen/:id', component: ScreenDetailComponent },
  
];
