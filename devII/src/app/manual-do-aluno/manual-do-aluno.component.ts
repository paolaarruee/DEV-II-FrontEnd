import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';



@Component({
  selector: 'app-manual-do-aluno',
  templateUrl: './manual-do-aluno.component.html',
  styleUrls: ['./manual-do-aluno.component.scss'],
  providers: [MatTabsModule, MatExpansionModule],
  
})
export class ManualDoAlunoComponent {

}
