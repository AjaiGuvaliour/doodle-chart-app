import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { AppService } from './app.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    socket;

    constructor(
        private appService: AppService,
        private loaderService: LoaderService
    ) { 
        this.socket = io('http://localhost:3000');
    }

    userLoggedIn(): void {

    }

    getUserDetails() {
        const userDetails = JSON.parse(sessionStorage.getItem('userDetail'));
        return userDetails;
    }

    getSocketDetail() {
        const socketDetail = sessionStorage.getItem('socket');
        return socketDetail;
    }

    getOtherUsers(id) {
        this.loaderService.show();
        return this.appService.get(`/user/userlist/${id}`);
    }
}
