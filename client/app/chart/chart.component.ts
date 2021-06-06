import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../service/app.service';
import { ChartService } from '../service/chart.service';
import { LoaderService } from '../service/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

    toggleSidebar = false;
    userList = [];
    filteredUserList = [];
    loggedInUser;
    chatingUser;
    message = '';
    messageList: any = [];
    deleteMessagesIds = [];

    constructor(
        private chartService: ChartService,
        private appService: AppService,
        private loaderService: LoaderService,
        private toastr: ToastrService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.getOtherUsers();
        this.getMessages();
    }

    getOtherUsers(): void {
        const userDetails = this.chartService.getUserDetails();
        this.loggedInUser = userDetails;
        this.chartService.getOtherUsers(userDetails._id).subscribe(response => {
            this.loaderService.hide();
            if (response.success) {
                this.userList = response.data;
                this.filteredUserList = this.userList;
                this.chatingUser = this.userList[0];
                this.createChat(this.chatingUser);
            }
        }, () => {
            this.loaderService.hide();
        })
    }

    createChat(chatingUser: any) {
        this.chatingUser = chatingUser;
        const room = `${this.loggedInUser._id}-${this.chatingUser._id}`;
        this.message = '';
        this.deleteMessagesIds = [];
        this.chartService.socket.emit('create',
            {
                room: room,
                _id: this.loggedInUser._id,
                chatingUser: chatingUser
            }
        );
        this.displayMessage({
            sender: this.loggedInUser._id,
            reciver: this.chatingUser._id
        })
    }

    sendMessage(): void {
        const room = `${this.loggedInUser._id}-${this.chatingUser._id}`;
        const token = sessionStorage.getItem('token');
        this.chartService.socket.emit('message',
            {
                room: room,
                message: this.message,
                from: this.loggedInUser,
                to: this.chatingUser,
                sender: this.loggedInUser._id,
                reciver: this.chatingUser._id,
                token: token
            }
        );
        this.message = '';
    }

    logout(): void {
        const userData = this.chartService.getUserDetails();
        this.chartService.socket.emit('logout', userData);
        sessionStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    searchInputs(event: any): void {
        const value = event.target.value;
        this.filteredUserList = this.userList.filter(el =>
            el.userName.toLowerCase().indexOf(value.toLowerCase()) != -1
        );
    }

    getMessages() {
        this.chartService.socket.on('message', (msg) => {
            console.log('message', msg);
        });
        this.chartService.socket.on('saveDataToDB', (response) => {
            if (response.success) {
                this.displayMessage(response);
            }
        });
    }

    displayMessage(response) {
        const req = {
            sender: response.sender,
            reciver: response.reciver
        }
        this.appService.post('/message/getMessage', req).subscribe((response: any) => {
            if (response.success) {
                this.messageList = response.data;
            }
        })
    }

    selectMsgForDelete(selectedMessage) {
        if (selectedMessage.sender === this.loggedInUser._id) {
            const index = this.deleteMessagesIds.findIndex(el => el === selectedMessage._id);
            if (index != -1) {
                this.deleteMessagesIds.splice(index, 1);
                selectedMessage.selected = false;
            } else {
                this.deleteMessagesIds.push(selectedMessage._id);
                selectedMessage.selected = true;
            }
        }
    }

    deleteSelectedMsg() {
        this.loaderService.show();
        this.appService.post('/message/deleteMsg', { seletedIds: this.deleteMessagesIds }).subscribe((response: any) => {
            if (response.success) {
                this.loaderService.hide();
                this.toastr.success(response.message);
                this.deleteMessagesIds = [];
                this.chartService.socket.emit('deleteMessage', {
                    sender: this.loggedInUser._id,
                    reciver: this.chatingUser._id,
                });
            }
        },
            (error) => {
                this.toastr.error(error);
                this.loaderService.hide();
            })
    }
}
