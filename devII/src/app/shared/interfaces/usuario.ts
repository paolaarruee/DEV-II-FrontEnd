export interface Usuario {
  email: string;
  senha: string;
  roles: string;
}

export interface Authorization {
  Authorization: string;
  Roles: Role;
}

export enum Role {
  ROLE_ALUNO, ROLE_SERVIDOR
}