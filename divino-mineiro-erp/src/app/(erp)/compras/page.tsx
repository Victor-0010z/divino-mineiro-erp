import { Plus } from "lucide-react";
import { solicitacoesMock } from "@/lib/mock-data";
import { dataBr, moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { EntityTable } from "@/components/entity-table";
import { StatusBadge } from "@/components/status-badge";
export default function Compras(){return <><PageHeading title="Solicitações e compras" description="Acompanhe pedidos desde a solicitação até o pagamento." action={<button className="btn-primary"><Plus size={17}/>Nova solicitação</button>}/><EntityTable headers={["Número","Produto","Fornecedor","Solicitante","Necessário em","Valor","Prioridade","Status"]}>{solicitacoesMock.map(s=><tr key={s.id}><td className="font-semibold">{s.numero}</td><td>{s.produto}</td><td>{s.fornecedorNome}</td><td>{s.solicitanteNome}</td><td>{dataBr(s.dataNecessaria)}</td><td>{moeda(s.valorTotal)}</td><td><StatusBadge status={s.prioridade}/></td><td><StatusBadge status={s.status}/></td></tr>)}</EntityTable></>}
