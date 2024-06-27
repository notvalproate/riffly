import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark , faCircleCheck } from '@fortawesome/free-solid-svg-icons';
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

  faCircleXmark = faCircleXmark;
  faCircleCheck = faCircleCheck;

  ngOnInit() {
    console.log(this.list);
    console.log(this.type);
    this.setStatus();
  }

  setStatus(){
    if(this.type == 0){
      const parentElement = document.querySelector('.parent');
      const childDivs = parentElement?.querySelectorAll('div');
      this.list?.forEach((element, index) => {
        if (element.status) {
          childDivs?.[index].classList.add('online');
          childDivs?.[index].classList.remove('offline');
        } else {
          childDivs?.[index].classList.add('offline');
          childDivs?.[index].classList.remove('online');
        }
      });
    } 
  }

  addFriend(id: number){
    console.log(id);
  }

  rejectFriend(id: number){
    console.log(id);
  }
}
