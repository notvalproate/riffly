import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { List } from '../list';

@Component({
  selector: 'app-names-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './names-list.component.html',
  styleUrl: './names-list.component.scss'
})
export class NamesListComponent {
  @Input() list?: List[];
  @Input() type?: number;

  faCheck = faCheck;
  faXmark = faXmark;

  ngOnInit() {
    console.log(this.list);
    console.log(this.type);
  }

  addFriend(id: number){
    console.log(id);
  }

  rejectFriend(id: number){
    console.log(id);
  }
}
