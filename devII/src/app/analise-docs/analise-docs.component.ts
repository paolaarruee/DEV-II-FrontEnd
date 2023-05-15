import { Component, ElementRef, ViewChild } from '@angular/core';

import { saveAs } from 'file-saver';

import { Aluno } from '../shared/interfaces/aluno';
import { DocsService } from '../core/services/docs/docs.service';
import { DocFile } from '../shared/interfaces/doc';

@Component({
  selector: 'app-analise-docs',
  templateUrl: './analise-docs.component.html',
  styleUrls: ['./analise-docs.component.scss'],
})
export class AnaliseDocsComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public filesMock: Array<DocFile> = [
    { name: 'asd.txt', binary: new Blob([]) },
    { name: 'das.txt', binary: new Blob([]) },
  ];

  public constructor(private docsService: DocsService) { }

  public download(file: DocFile): void {
    saveAs(file.binary, file.name);
  }

  public upload(): void {
    const fileList: FileList | null = this.fileInputRef.nativeElement?.files;

    if (!(fileList && fileList.length)) {
      return;
    }

    const formData: FormData = new FormData();

    for (let i = 0; i < fileList.length; i++) {
      formData.append("file", fileList[i]);
    }

    this.docsService.uploadDocs(formData).subscribe((res) => console.log(res))
  }
}
