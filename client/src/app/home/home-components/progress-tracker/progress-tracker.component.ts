import { Component , OnInit, OnDestroy, Input} from '@angular/core';
import { ProgressData } from '../../../interfaces/ProgressData';


@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [],
  templateUrl: './progress-tracker.component.html',
  styleUrl: './progress-tracker.component.scss'
})
export class ProgressTrackerComponent implements OnInit, OnDestroy{
  @Input() progressData?: ProgressData;
  
  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }

  msToMinutesString(ms: number) {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor(ms % (1000 * 60) / 1000);

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
}
