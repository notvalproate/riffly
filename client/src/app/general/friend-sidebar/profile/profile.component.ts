import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { Renderer2 } from '@angular/core';

import { UserInfoService } from '../../../../shared/services/user-info.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    private renderer: Renderer2 = inject(Renderer2);
    private clipboard: Clipboard = inject(Clipboard);
    private userInfoService: UserInfoService = inject(UserInfoService);

    faEllipsisVertical = faEllipsisVertical;
    faCopy = faCopy;

    dropdownClick: boolean = false;
    dropdownVisible: boolean = false;

    displayName : string = '';
    profileId : string = '';
    profileUrl : string = '';
    profilePictureUrl : string = '';

    ngOnInit(): void {
        this.renderer.listen('window', 'click', (e : Event) => {
            if(!this.dropdownClick) {
                this.dropdownVisible = false;
            }
            this.dropdownClick = false;
       });

       this.userInfoService.getUserInfo().subscribe({
            next: (resp: any) => {
                const info = resp.body;

                this.displayName = info.user.displayName;
                this.profileUrl = info.user.url;
                this.profileId = info.user.id;

                if(info.images) {
                    this.profilePictureUrl = info.images.default;
                }
            },
            error: (resp: any) => {
                console.log(resp.error);
            }
        });
    }

    copyId() : void {
        this.clipboard.copy(this.profileId);
    }

    displayDropdown() : void {
        this.dropdownVisible = true;
    }

    preventCloseOnClick() : void {
        this.dropdownClick = true;
    }
}
