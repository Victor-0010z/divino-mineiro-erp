import { Plus } from "lucide-react";
import { fornecedoresMock } from "@/lib/mock-data";
import { moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { EntityTable } from "@/components/entity-table";
import { StatusBadge } from "@/components/status-badge";
export default function Fornecedores(){return <><PageHeading title="Fornecedores" description="Dados comerciais, contatos e histórico de compras." action={<button className="btn-primary"><Plus size={17}/>Novo fornecedor</button>}/><EntityTable headers={["Fornecedor","Documento","Responsável","Contato","Categorias","Total comprado","Status"]}>{fornecedoresMock.map(f=><tr key={f.id}><td className="font-semibold">{f.nomeFantasia}</td><td>{f.documento}</td><td>{f.responsavel}</td><td>{f.telefone}<p className="text-xs text-foreground/45">{f.email}</p></td><td>{f.categorias.join(", ")}</td><td>{moeda(f.totalComprado)}</td><td><StatusBadge status={f.ativo?"ATIVO":"INATIVO"}/></td></tr>)}</EntityTable></>}
