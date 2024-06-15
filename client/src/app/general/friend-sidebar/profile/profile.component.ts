import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    faEllipsisVertical = faEllipsisVertical;
    faCopy = faCopy;

    renderer: Renderer2 = inject(Renderer2);
    clipboard: Clipboard = inject(Clipboard);

    dropdownClick: boolean = false;
    dropdownVisible: boolean = false;

    ngOnInit(): void {
        this.renderer.listen('window', 'click',(e : Event)=>{
            if(!this.dropdownClick) {
                this.dropdownVisible = false;
            }
            this.dropdownClick = false;
       });
    }

    copyId() : void {
        this.clipboard.copy("testcopy");
    }

    displayDropdown() : void {
        this.dropdownVisible = true;
    }

    preventCloseOnClick() : void {
        this.dropdownClick = true;
    }
}
