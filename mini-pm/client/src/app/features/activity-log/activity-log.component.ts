import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { ActivityLogService, ActivityLog } from '../../core/activity-log.service';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  logs: ActivityLog[] = [];
  displayedColumns = ['action', 'user', 'created_at'];

  constructor(private svc: ActivityLogService) {}

  ngOnInit() {
    this.svc.getAll().subscribe(x => this.logs = x);
  }
}