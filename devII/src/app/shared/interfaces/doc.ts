export interface DocFile {
    assinado: boolean;
    paraDiretor: boolean;
    id: number;
    nome: string;
    documento?: Blob;
}