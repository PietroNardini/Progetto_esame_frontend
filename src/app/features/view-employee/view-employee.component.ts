// Importazione dei moduli Angular e di librerie utili
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Importazione dei tipi e servizi relativi agli utenti
import { UserService, Employee } from '../../core/user.service';

@Component({
  standalone: true,
  selector: 'app-view-employee',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit, OnDestroy {

  // Lista di tutti gli impiegati (usata se non c’è ID specificato)
  impiegati: Employee[] = [];

  // Impiegato selezionato (quando viene fornito un ID)
  selected: Employee | null = null;

  // Oggetto per raccogliere e gestire le sottoscrizioni (evita memory leak)
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute, // Accesso ai parametri della route (es. ID)
    private userSvc: UserService   // Servizio per recuperare i dati degli impiegati
  ) {}

  ngOnInit(): void {
    // Recupera il parametro "id" dalla URL (es. /employee/123)
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // Se è presente un ID → carica solo quell’impiegato
      const id = Number(idParam);
      this.sub.add(
        this.userSvc.getEmployeeById(id).subscribe(emp => {
          this.selected = emp;
        })
      );
    } else {
      // Se non c’è un ID → carica tutti gli impiegati
      this.sub.add(
        this.userSvc.getAllImpiegati().subscribe(list => {
          this.impiegati = list;
        })
      );
    }
  }

  // Rimozione delle sottoscrizioni quando il componente viene distrutto
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
