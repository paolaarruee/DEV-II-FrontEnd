export interface Usuario {
  id? : string;
  email: string;
  senha?: string;
  roles: string;
}

export interface Curso{
  id: string;
  nomeCurso: string;
}

export interface Authorization {
  Authorization: string;
  Roles: Role;
}

export enum Role {
  ROLE_ALUNO = 1,
  ROLE_SERVIDOR = 2,
  ROLE_SESTAGIO = 3,
  ROLE_DIRETOR = 4,
}
