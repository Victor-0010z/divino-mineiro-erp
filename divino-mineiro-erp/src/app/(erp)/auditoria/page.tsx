import { PageHeading } from "@/components/page-heading";
import { EntityTable } from "@/components/entity-table";
const eventos=[
 ["22/09/2026 09:12","Carlos Andrade","Login realizado","Autenticação","192.168.1.10"],
 ["22/09/2026 08:44","Fernanda Lopes","Boleto cadastrado","Contas a pagar","192.168.1.22"],
 ["21/09/2026 16:03","Carlos Andrade","Solicitação aprovada","Compras","192.168.1.10"],
 ["21/09/2026 14:50","Fernanda Lopes","Pagamento confirmado","Diaristas","192.168.1.22"]
];
export default function Auditoria(){return <><PageHeading title="Histórico de atividades" description="Registro das ações importantes realizadas no sistema."/><EntityTable headers={["Data e hora","Usuário","Ação","Módulo","IP"]}>{eventos.map((e,i)=><tr key={i}>{e.map((v,j)=><td className={j===2?"font-semibold":""} key={j}>{v}</td>)}</tr>)}</EntityTable></>}
