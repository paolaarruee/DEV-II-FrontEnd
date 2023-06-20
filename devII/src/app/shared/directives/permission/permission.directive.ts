import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Role } from '../../interfaces/usuario';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Directive({
  selector: '[permission]',
})
export class PermissionDirective {
  public constructor(
    private viewRef: ViewContainerRef,
    private tempRef: TemplateRef<any>,
    private authService: AuthenticationService
  ) {}

  @Input() public permission!: Role;

  public ngOnChanges(): void {
    const userRole: Role | null = this.authService.role;

    if (userRole === null) {
      return;
    }

    const userHasPermission: boolean = this.permission === userRole;

    if (userHasPermission) {
      this.viewRef.createEmbeddedView(this.tempRef);
      return;
    }

    this.viewRef.clear();
  }
}
