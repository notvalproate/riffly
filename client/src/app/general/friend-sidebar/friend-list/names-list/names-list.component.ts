import { Component , EventEmitter, Input, Output, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-names-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './names-list.component.html',
  styleUrl: './names-list.component.scss'
})
export class NamesListComponent {
    private friendsService : FriendService = inject(FriendService);

    @Input() list? : any;
    @Input() type? : number;
    @Output() updateList : EventEmitter<boolean> = new EventEmitter<boolean>();

    faCheck = faCheck;
    faXmark = faXmark;
    processingRequest : boolean = false;

    removeFriend(id: string) {
        if (this.processingRequest) return;
        this.processingRequest = true;

        this.friendsService.removeFriend(id).subscribe({
            next: (res: any) => {
                this.updateList.emit(true);
            },
            error: (error: any) => {
                console.log("Could not remove friend");
            },
            complete: () => {
                this.processingRequest = false;
            }
        });
    }

    acceptFriend(id: string) {
        if (this.processingRequest) return;
        this.processingRequest = true;

        this.friendsService.acceptRequest(id).subscribe({
            next: (res: any) => {
                this.updateList.emit(true);
            },
            error: (error: any) => {
                console.log("Could not accept friend request");
            },
            complete: () => {
                this.processingRequest = false;
            }
        });
    }

    cancelFriend(id: string) {
        if (this.processingRequest) return;
        this.processingRequest = true;

        this.friendsService.cancelPending(id).subscribe({
            next: (res: any) => {
                this.updateList.emit(true);
            },
            error: (error: any) => {
                console.log("Could not cancel friend request");
            },
            complete: () => {
                this.processingRequest = false;
            }
        });
    }

    rejectFriend(id: string) {
        if (this.processingRequest) return;
        this.processingRequest = true;

        this.friendsService.rejectRequest(id).subscribe({
            next: (res: any) => {
                this.updateList.emit(true);
            },
            error: (error: any) => {
                console.log("Could not reject friend request");
            },
            complete: () => {
                this.processingRequest = false;
            }
        });
    }
}
