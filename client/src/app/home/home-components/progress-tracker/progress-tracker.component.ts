import { Component , OnInit, OnDestroy, input} from '@angular/core';
import { PollingService } from '../../../services/polling.service';
import { ProgressData } from '../../../interfaces/ProgressData';


@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [],
  templateUrl: './progress-tracker.component.html',
  styleUrl: './progress-tracker.component.scss'
})
export class ProgressTrackerComponent implements OnInit, OnDestroy{
  @input progressData?: ProgressData;
  
  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }
}
