import { Component, OnInit, inject } from '@angular/core';
import { NamesListComponent } from './names-list/names-list.component';
import { CommonModule } from '@angular/common';
import { FriendService } from '../services/friend.service';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [CommonModule, NamesListComponent],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss'
})
export class FriendListComponent implements OnInit {
    private friendService : FriendService = inject(FriendService);

    friends_list : any = [];
    pending_list : any = [];
    request_list : any = [];

    type : number = 0;

    ngOnInit(): void {
        this.getAllFriends();
    }

    getAllFriends() : void {
        this.friendService.getAllFriends().subscribe({
            next: (res: any) => {
                const friends = res.body.friends;

                this.friends_list = friends.list;
                this.pending_list = friends.pending;
                this.request_list = friends.requests;

                console.log(friends);
            },
            error: (error: any) => {
                console.log(error);
            }
        })
    }

    displayFriends() : void {
        this.type = 0;
    }

    displayPending() : void {
        this.type = 1;
    }

    displayRequests() : void {
        this.type = 2;
    }

    updateLists(event : boolean) : void {
        this.getAllFriends();
    }
}

