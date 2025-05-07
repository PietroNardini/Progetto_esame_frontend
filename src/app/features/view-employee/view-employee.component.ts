// src/app/features/view-employee/view-employee.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { RouterModule, ActivatedRoute }  from '@angular/router';
import { Subscription }                  from 'rxjs';

import { UserService, Employee } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-view-employee',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit, OnDestroy {
  impiegati: Employee[] = [];
  selected: Employee | null = null;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.sub.add(
        this.userSvc.getEmployeeById(id).subscribe(emp => {
          this.selected = emp;
        })
      );
    } else {
      this.sub.add(
        this.userSvc.getAllImpiegati().subscribe(list => {
          this.impiegati = list;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}