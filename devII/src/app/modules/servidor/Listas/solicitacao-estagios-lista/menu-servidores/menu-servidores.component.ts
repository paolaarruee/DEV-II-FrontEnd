import { Component, Output, EventEmitter} from '@angular/core';
import { Role } from 'src/app/shared/interfaces/usuario';

@Component({
  selector: 'app-menu-servidores',
  templateUrl: './menu-servidores.component.html',
  styleUrls: ['./menu-servidores.component.scss'],
})


export class MenuServidoresComponent {
  public readonly Roles: typeof Role = Role;
  navAtual = '';
  appAtual = '';

  @Output() trocaDeNav = new EventEmitter<string>();


  constructor() { }
    ngOnInit(): void {
  }

  setNavAtual(nav: string) {
    this.navAtual = nav;
    this.trocaDeNav.emit(nav);
  }

  reload() {
    location.reload();
  }
  
}
