import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    faEllipsisVertical = faEllipsisVertical;
    faCopy = faCopy;

    clipboard: Clipboard = inject(Clipboard);

    dropdownVisible: boolean = false;

    copyId() : void {
        this.clipboard.copy("testcopy");
    }

    displayDropdown() : void {
        this.dropdownVisible = true;
    }
}
