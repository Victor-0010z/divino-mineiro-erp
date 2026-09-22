export type PerfilUsuario = "ADMINISTRADOR" | "GERENCIA";
export type StatusConta = "PENDENTE" | "PAGO" | "VENCIDO" | "CANCELADO";
export type StatusTarefa = "PENDENTE" | "EM_ANDAMENTO" | "AGUARDANDO" | "CONCLUIDA" | "CANCELADA";

export interface Usuario { id:string; nome:string; email:string; perfil:PerfilUsuario; status:"ATIVO"|"BLOQUEADO"|"INATIVO"; ultimoAcesso?:string }
export interface Fornecedor { id:string; nomeFantasia:string; documento:string; responsavel:string; telefone:string; email:string; categorias:string[]; ativo:boolean; totalComprado:number }
export interface ContaPagar { id:string; descricao:string; fornecedorId:string; fornecedorNome:string; linhaDigitavel:string; dataRecebimento:string; dataVencimento:string; valor:number; categoria:string; centroCusto:string; responsavel:string; status:StatusConta; recorrente:boolean }
export interface Diarista { id:string; nome:string; cpf:string; telefone:string; chavePix:string; banco:string; valorPadraoDiaria:number; ativo:boolean }
export interface RegistroDiaria { id:string; diaristaId:string; dataTrabalhada:string; periodo:"MANHA"|"TARDE"|"NOITE"|"DIA_INTEIRO"; valor:number; responsavelRegistro:string; status:"PENDENTE"|"PAGO"|"ATRASADO"|"CANCELADO"; pagamentoId?:string }
export interface PagamentoDiarista { id:string; diaristaId:string; diaristaNome:string; diariasIncluidas:string[]; valorTotal:number; chavePix:string; dataPagamento?:string; status:"PENDENTE"|"PAGO"|"ATRASADO"|"CANCELADO"; criadoEm:string }
export interface Solicitacao { id:string; numero:string; produto:string; fornecedorNome:string; solicitanteNome:string; dataNecessaria:string; valorTotal:number; prioridade:"BAIXA"|"MEDIA"|"ALTA"|"URGENTE"; status:string }
export interface Tarefa { id:string; titulo:string; responsavelNome:string; categoria:string; prioridade:"BAIXA"|"MEDIA"|"ALTA"|"URGENTE"; prazo:string; status:StatusTarefa }
