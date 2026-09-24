import type { ContaPagar, Diarista, Fornecedor, JornadaMotoboy, Motoboy, PagamentoDiarista, RegistroDiaria, Solicitacao, Tarefa, Usuario } from "@/types";

export const usuariosMock: Usuario[] = [
  { id:"u1", nome:"Carlos Andrade", email:"admin@divinomineiro.com.br", perfil:"ADMINISTRADOR", status:"ATIVO", ultimoAcesso:"2026-09-22T09:00:00" },
  { id:"u2", nome:"Fernanda Lopes", email:"gerente@divinomineiro.com.br", perfil:"GERENCIA", status:"ATIVO", ultimoAcesso:"2026-09-22T08:30:00" },
  { id:"u3", nome:"Rogério Pires", email:"rogerio@divinomineiro.com.br", perfil:"GERENCIA", status:"BLOQUEADO", ultimoAcesso:"2026-08-02T14:20:00" }
];
export const fornecedoresMock: Fornecedor[] = [
  { id:"f1", nomeFantasia:"Hortifruti Serra Verde", documento:"23.456.789/0001-11", responsavel:"João Batista", telefone:"(31) 3344-5566", email:"vendas@serraverde.com.br", categorias:["Hortifruti"], ativo:true, totalComprado:48250.9 },
  { id:"f2", nomeFantasia:"Frigorífico Boi Manso", documento:"34.567.890/0001-22", responsavel:"Marcos Vinícius", telefone:"(31) 3555-2211", email:"comercial@boimanso.com.br", categorias:["Carnes e Aves"], ativo:true, totalComprado:112400 },
  { id:"f3", nomeFantasia:"Vale das Águas", documento:"45.678.901/0001-33", responsavel:"Patrícia Nunes", telefone:"(31) 3212-9900", email:"pedidos@valedasaguas.com.br", categorias:["Bebidas"], ativo:true, totalComprado:36870.5 }
];
export const contasPagarMock: ContaPagar[] = [
  { id:"cp1", descricao:"Hortifruti — semana 38", fornecedorId:"f1", fornecedorNome:"Hortifruti Serra Verde", linhaDigitavel:"34191.79001 01043.510047 91020.150008 1 96380000048250", dataRecebimento:"2026-09-15", dataVencimento:"2026-09-25", valor:4825, categoria:"Hortifruti", centroCusto:"Cozinha", responsavel:"Fernanda Lopes", status:"PENDENTE", recorrente:true },
  { id:"cp2", descricao:"Carnes para o fim de semana", fornecedorId:"f2", fornecedorNome:"Frigorífico Boi Manso", linhaDigitavel:"23793.38128 60007.897120 12345.678901 8 96380000112400", dataRecebimento:"2026-09-10", dataVencimento:"2026-09-20", valor:11240, categoria:"Carnes e Aves", centroCusto:"Cozinha", responsavel:"Carlos Andrade", status:"VENCIDO", recorrente:false },
  { id:"cp3", descricao:"Reposição do estoque do bar", fornecedorId:"f3", fornecedorNome:"Vale das Águas", linhaDigitavel:"10491.09008 87654.321098 76543.210987 3 96380000036870", dataRecebimento:"2026-09-18", dataVencimento:"2026-10-05", valor:3687.05, categoria:"Bebidas", centroCusto:"Bar", responsavel:"Fernanda Lopes", status:"PENDENTE", recorrente:false },
  { id:"cp4", descricao:"Conta de energia", fornecedorId:"f1", fornecedorNome:"Cemig Distribuição", linhaDigitavel:"82660000012 3 45678901234 5 67890123456 7", dataRecebimento:"2026-09-05", dataVencimento:"2026-09-22", valor:3480.25, categoria:"Utilidades", centroCusto:"Administrativo", responsavel:"Fernanda Lopes", status:"PAGO", recorrente:true }
];
export const diaristasMock: Diarista[] = [
  { id:"d1", nome:"Maria das Graças Silva", cpf:"123.456.789-01", telefone:"(31) 99876-1122", chavePix:"123.456.789-01", banco:"Nubank", valorPadraoDiaria:150, ativo:true },
  { id:"d2", nome:"José Roberto Cardoso", cpf:"234.567.890-12", telefone:"(31) 99765-2233", chavePix:"jose.cardoso@email.com", banco:"Caixa", valorPadraoDiaria:140, ativo:true },
  { id:"d3", nome:"Aparecida Ferreira Dias", cpf:"345.678.901-23", telefone:"(31) 99654-3344", chavePix:"(31) 99654-3344", banco:"Inter", valorPadraoDiaria:160, ativo:true }
];
export const registrosDiariaMock: RegistroDiaria[] = [
  { id:"rd1", diaristaId:"d1", dataTrabalhada:"2026-09-15", periodo:"DIA_INTEIRO", valor:150, responsavelRegistro:"Fernanda Lopes", status:"PENDENTE" },
  { id:"rd2", diaristaId:"d1", dataTrabalhada:"2026-09-17", periodo:"DIA_INTEIRO", valor:150, responsavelRegistro:"Fernanda Lopes", status:"PENDENTE" },
  { id:"rd3", diaristaId:"d2", dataTrabalhada:"2026-09-14", periodo:"NOITE", valor:90, responsavelRegistro:"Carlos Andrade", status:"PAGO", pagamentoId:"pd1" },
  { id:"rd4", diaristaId:"d3", dataTrabalhada:"2026-09-18", periodo:"MANHA", valor:80, responsavelRegistro:"Fernanda Lopes", status:"ATRASADO" }
];
export const pagamentosDiaristaMock: PagamentoDiarista[] = [{ id:"pd1", diaristaId:"d2", diaristaNome:"José Roberto Cardoso", diariasIncluidas:["rd3"], valorTotal:90, chavePix:"jose.cardoso@email.com", dataPagamento:"2026-09-15", status:"PAGO", criadoEm:"2026-09-15T18:00:00" }];
export const solicitacoesMock: Solicitacao[] = [
  { id:"s1", numero:"SOL-2026-0041", produto:"Óleo de soja e sal", fornecedorNome:"Hortifruti Serra Verde", solicitanteNome:"Fernanda Lopes", dataNecessaria:"2026-09-23", valorTotal:404, prioridade:"MEDIA", status:"AGUARDANDO_APROVACAO" },
  { id:"s2", numero:"SOL-2026-0042", produto:"Carvão para churrasqueira", fornecedorNome:"A definir", solicitanteNome:"Fernanda Lopes", dataNecessaria:"2026-09-24", valorTotal:250, prioridade:"URGENTE", status:"APROVADO" }
];
export const tarefasMock: Tarefa[] = [
  { id:"t1", titulo:"Conferir estoque de bebidas", responsavelNome:"Fernanda Lopes", categoria:"Estoque", prioridade:"MEDIA", prazo:"2026-09-22", status:"EM_ANDAMENTO" },
  { id:"t2", titulo:"Negociar contrato de carnes", responsavelNome:"Carlos Andrade", categoria:"Fornecedores", prioridade:"ALTA", prazo:"2026-09-21", status:"PENDENTE" },
  { id:"t3", titulo:"Atualizar cardápio de outubro", responsavelNome:"Fernanda Lopes", categoria:"Operacional", prioridade:"BAIXA", prazo:"2026-09-28", status:"CONCLUIDA" },
  { id:"t4", titulo:"Revisar manutenção das coifas", responsavelNome:"Carlos Andrade", categoria:"Manutenção", prioridade:"URGENTE", prazo:"2026-09-19", status:"PENDENTE" }
];
export const motoboysMock: Motoboy[] = [
  {id:"m1",nome:"Alemão",telefone:"(11) 98888-1101",chavePix:"11988881101",valorDiaria:90,ativo:true,statusPagamento:"PENDENTE"},
  {id:"m2",nome:"Luiz",telefone:"(11) 98888-1102",chavePix:"luiz@email.com",valorDiaria:90,ativo:true,statusPagamento:"PENDENTE"},
  {id:"m3",nome:"Nelber",telefone:"(11) 98888-1103",chavePix:"11988881103",valorDiaria:90,ativo:true,statusPagamento:"PAGO"},
  {id:"m4",nome:"Nikolas",telefone:"(11) 98888-1104",chavePix:"11988881104",valorDiaria:90,ativo:true,statusPagamento:"PENDENTE"}
];
export const jornadasMotoboyMock: JornadaMotoboy[] = [
  {motoboyId:"m1",valores:[156.5,0,114,0,0,0],folgas:[1],fretes:[8,0,3,0,0,0]},
  {motoboyId:"m2",valores:[156.8,0,130,0,0,0],folgas:[1],fretes:[8,0,5,0,0,0]},
  {motoboyId:"m3",valores:[0,169.5,0,0,0,0],folgas:[0,2],fretes:[0,9,0,0,0,0]},
  {motoboyId:"m4",valores:[0,131.1,98.3,0,0,0],folgas:[0],fretes:[0,5,1,0,0,0]}
];
