import {useMemo,useState} from "react";
import {BarChart3,Calculator,FileText,Home,MessageCircle,Plus,Search,Settings,Sun,Users,Zap,ChevronRight} from "lucide-react";

type Lead={id:number;name:string;phone:string;city:string;source:string;consumption:number;status:string};
type Quote={id:number;client:string;consumption:number;panelPower:number;generation:number;panels:number;kwp:number;price:number;status:string};
type Msg={id:number;name:string;phone:string;text:string;time:string;unread:boolean};

const seedLeads:Lead[]=[
{id:1,name:"Carlos Mendes",phone:"(47) 99921-1144",city:"Blumenau - SC",source:"WhatsApp",consumption:550,status:"Em contato"},
{id:2,name:"Maria Fernandes",phone:"(47) 98872-5521",city:"Gaspar - SC",source:"Instagram",consumption:420,status:"Novo"},
{id:3,name:"Roberto Silva",phone:"(47) 99712-8820",city:"Itajaí - SC",source:"Indicação",consumption:800,status:"Orçamento"}
];
const seedQuotes:Quote[]=[{id:1,client:"Roberto Silva",consumption:800,panelPower:550,generation:65,panels:13,kwp:7.15,price:28600,status:"Enviado"}];
const seedMsgs:Msg[]=[
{id:1,name:"Carlos Mendes",phone:"(47) 99921-1144",text:"Gostaria de saber quanto fica um sistema para minha casa.",time:"14:38",unread:true},
{id:2,name:"Maria Fernandes",phone:"(47) 98872-5521",text:"Oi, vi o anúncio da SolarUsinas.",time:"14:21",unread:true},
{id:3,name:"Roberto Silva",phone:"(47) 99712-8820",text:"Conseguiu finalizar meu orçamento?",time:"13:55",unread:false}
];

export default function App(){
 const [page,setPage]=useState("Dashboard");
 const [leads,setLeads]=useState(seedLeads),[quotes,setQuotes]=useState(seedQuotes),[msgs,setMsgs]=useState(seedMsgs);
 const [selected,setSelected]=useState<Msg|null>(seedMsgs[0]),[search,setSearch]=useState("");
 const [leadModal,setLeadModal]=useState(false),[quoteModal,setQuoteModal]=useState(false);
 const stats=useMemo(()=>({leads:leads.length,active:leads.filter(x=>x.status!=="Novo").length,quotes:quotes.length,sales:quotes.filter(x=>x.status==="Aprovado").length}),[leads,quotes]);

 const addLead=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);setLeads(x=>[{id:Date.now(),name:String(f.get("name")),phone:String(f.get("phone")),city:String(f.get("city")),source:String(f.get("source")),consumption:Number(f.get("consumption")||0),status:"Novo"},...x]);setLeadModal(false);e.currentTarget.reset()};
 const addQuote=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const c=Number(f.get("consumption")||0),p=Number(f.get("panelPower")||550),g=Number(f.get("generation")||65),n=Math.max(1,Math.ceil(c/g));setQuotes(x=>[{id:Date.now(),client:String(f.get("client")),consumption:c,panelPower:p,generation:g,panels:n,kwp:Number((n*p/1000).toFixed(2)),price:Number(f.get("price")||0),status:"Rascunho"},...x]);setQuoteModal(false);e.currentTarget.reset()};

 const menu=[["Dashboard",Home],["Mensagens",MessageCircle],["Leads",Users],["Orçamentos",FileText],["Calculadora Solar",Calculator],["Relatórios",BarChart3]] as const;
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><img src="/solar-usinas-logo.png"/><div><b>Solar<span>Usinas</span></b><small>ENERGIA QUE TRANSFORMA</small></div></div>
   <nav>{menu.map(([n,I])=><button key={n} className={page===n?"active":""} onClick={()=>setPage(n)}><I size={19}/>{n}</button>)}</nav>
   <div className="bottom"><button onClick={()=>setPage("Configurações")}><Settings size={18}/>Configurações</button><div className="profile"><div className="avatar">SU</div><div><b>Administrador</b><small>SolarUsinas</small></div></div></div>
  </aside>
  <main className="main">
   <header><div><h1>{page}</h1><p>Gestão simples da operação comercial.</p></div><div className="actions"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."/></div>{(page==="Leads"||page==="Orçamentos")&&<button className="primary" onClick={()=>page==="Leads"?setLeadModal(true):setQuoteModal(true)}><Plus size={18}/>{page==="Leads"?"Novo lead":"Novo orçamento"}</button>}</div></header>

   {page==="Dashboard"&&<section><div className="hero"><div><span>☀️ SolarUsinas CRM</span><h2>Transforme contatos em projetos solares.</h2><p>Tenha leads, conversas e orçamentos em um só lugar.</p></div><button onClick={()=>setPage("Orçamentos")}>Criar orçamento <ChevronRight size={17}/></button></div><div className="cards">
    <Card title="Leads" value={stats.leads} icon={<Users/>} note="+ novos contatos"/><Card title="Em prospecção" value={stats.active} icon={<Zap/>} note="em atendimento"/><Card title="Orçamentos" value={stats.quotes} icon={<FileText/>} note="cadastrados"/><Card title="Vendas" value={stats.sales} icon={<Sun/>} note="aprovadas"/>
   </div><div className="grid2"><div className="panel"><h3>Funil comercial</h3><div className="funnel"><div><span>Novo</span><b>{leads.filter(x=>x.status==="Novo").length}</b></div><div><span>Em contato</span><b>{leads.filter(x=>x.status==="Em contato").length}</b></div><div><span>Orçamento</span><b>{leads.filter(x=>x.status==="Orçamento").length}</b></div><div><span>Venda</span><b>{stats.sales}</b></div></div></div><div className="panel"><h3>Atalhos</h3><div className="shortcuts"><button onClick={()=>setLeadModal(true)}><Users/>Novo lead</button><button onClick={()=>setQuoteModal(true)}><Calculator/>Calcular sistema</button><button onClick={()=>setPage("Mensagens")}><MessageCircle/>Abrir mensagens</button></div></div></div></section>}

   {page==="Mensagens"&&<Messages msgs={msgs} selected={selected} setSelected={(m)=>{setSelected(m);setMsgs(x=>x.map(a=>a.id===m.id?{...a,unread:false}:a))}}/>}
   {page==="Leads"&&<LeadPage leads={leads.filter(x=>(x.name+x.phone+x.city).toLowerCase().includes(search.toLowerCase()))} onNew={()=>setLeadModal(true)}/>}
   {page==="Orçamentos"&&<QuotePage quotes={quotes.filter(x=>x.client.toLowerCase().includes(search.toLowerCase()))} onNew={()=>setQuoteModal(true)}/>}
   {page==="Calculadora Solar"&&<SolarCalc/>}
   {page==="Relatórios"&&<Reports leads={leads} quotes={quotes}/>}
   {page==="Configurações"&&<div className="empty"><Settings size={42}/><h2>Configurações</h2><p>Parâmetros da calculadora e integrações serão conectados ao banco na próxima etapa.</p></div>}
  </main>
  {leadModal&&<Modal title="Novo lead" close={()=>setLeadModal(false)}><form className="form" onSubmit={addLead}><label>Nome<input name="name" required/></label><label>WhatsApp<input name="phone" required/></label><label>Cidade<input name="city"/></label><label>Origem<select name="source"><option>WhatsApp</option><option>Instagram</option><option>Facebook</option><option>Indicação</option><option>Site</option></select></label><label>Consumo médio (kWh)<input name="consumption" type="number" min="0"/></label><button className="primary full">Salvar lead</button></form></Modal>}
  {quoteModal&&<Modal title="Novo orçamento" close={()=>setQuoteModal(false)}><form className="form" onSubmit={addQuote}><label>Cliente<input name="client" required/></label><label>Consumo mensal (kWh)<input name="consumption" type="number" min="1" required/></label><label>Potência da placa (W)<input name="panelPower" type="number" defaultValue="550"/></label><label>Geração estimada por placa (kWh/mês)<input name="generation" type="number" defaultValue="65"/></label><label>Valor do orçamento (R$)<input name="price" type="number" min="0" step="0.01"/></label><div className="hint"><Calculator size={17}/>Quantidade de placas = consumo ÷ geração por placa, arredondado para cima.</div><button className="primary full">Salvar orçamento</button></form></Modal>}
 </div>
}
function Card({title,value,icon,note}:{title:string;value:number;icon:React.ReactNode;note:string}){return <div className="card"><div className="icon">{icon}</div><div><span>{title}</span><strong>{value}</strong><small>{note}</small></div></div>}
function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="overlay"><div className="modal"><div className="modalHead"><h2>{title}</h2><button onClick={close}>×</button></div>{children}</div></div>}
function LeadPage({leads,onNew}:{leads:Lead[];onNew:()=>void}){return <section><div className="sectionTitle"><div><h2>Leads</h2><p>Controle dos potenciais clientes.</p></div><button className="primary" onClick={onNew}><Plus size={18}/>Novo lead</button></div><div className="tableWrap"><table><thead><tr><th>Cliente</th><th>WhatsApp</th><th>Cidade</th><th>Consumo</th><th>Status</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td><b>{l.name}</b><small>{l.source}</small></td><td>{l.phone}</td><td>{l.city}</td><td>{l.consumption?l.consumption+" kWh":"—"}</td><td><span className="status">{l.status}</span></td></tr>)}</tbody></table></div></section>}
function QuotePage({quotes,onNew}:{quotes:Quote[];onNew:()=>void}){return <section><div className="sectionTitle"><div><h2>Orçamentos</h2><p>Projetos e propostas cadastrados.</p></div><button className="primary" onClick={onNew}><Plus size={18}/>Novo orçamento</button></div><div className="tableWrap"><table><thead><tr><th>Cliente</th><th>Consumo</th><th>Placas</th><th>Potência</th><th>Valor</th><th>Status</th></tr></thead><tbody>{quotes.map(q=><tr key={q.id}><td><b>{q.client}</b></td><td>{q.consumption} kWh</td><td><strong>{q.panels}</strong> × {q.panelPower}W</td><td>{q.kwp} kWp</td><td>{q.price?"R$ "+q.price.toLocaleString("pt-BR",{minimumFractionDigits:2}):"—"}</td><td><span className="status">{q.status}</span></td></tr>)}</tbody></table></div></section>}
function Messages({msgs,selected,setSelected}:{msgs:Msg[];selected:Msg|null;setSelected:(m:Msg)=>void}){return <section className="messages"><div className="msgList">{msgs.map(m=><button key={m.id} className={selected?.id===m.id?"selected":""} onClick={()=>setSelected(m)}><div className="avatar">{m.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><b>{m.name}</b><small>{m.text}</small></div><time>{m.time}</time>{m.unread&&<i/>}</button>)}</div><div className="chat">{selected?<><div className="chatHead"><div className="avatar">{selected.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><b>{selected.name}</b><small>{selected.phone}</small></div></div><div className="chatBody"><div className="bubble">{selected.text}</div><div className="bubble reply">Olá! 👋 Vou verificar as informações para você e preparar o melhor sistema.</div></div><div className="chatInput"><input placeholder="Digite uma mensagem..."/><button>Enviar</button></div></>:<div className="empty">Selecione uma conversa.</div>}</div></section>}
function SolarCalc(){const[c,setC]=useState(600),[p,setP]=useState(550),[g,setG]=useState(65);const n=Math.max(1,Math.ceil(c/g)),kwp=n*p/1000;return <section className="calc"><div className="calcForm"><span className="eyebrow">☀️ DIMENSIONAMENTO RÁPIDO</span><h2>Calculadora Solar</h2><p>Informe o consumo e os parâmetros das placas.</p><label>Consumo mensal (kWh)<input type="number" value={c} onChange={e=>setC(Number(e.target.value))}/></label><label>Potência da placa (W)<input type="number" value={p} onChange={e=>setP(Number(e.target.value))}/></label><label>Geração estimada por placa (kWh/mês)<input type="number" value={g} onChange={e=>setG(Number(e.target.value))}/></label></div><div className="result"><Sun size={42}/><span>SISTEMA RECOMENDADO</span><strong>{n} placas</strong><p>{n} × {p} W</p><div><b>{kwp.toFixed(2)} kWp</b><small>Potência instalada</small></div><hr/><small>Fórmula: {c} ÷ {g} = {Math.ceil(c/g)} placas</small></div></section>}
function Reports({leads,quotes}:{leads:Lead[];quotes:Quote[]}){return <section><div className="sectionTitle"><div><h2>Relatórios</h2><p>Visão resumida da operação.</p></div></div><div className="cards"><Card title="Total de leads" value={leads.length} icon={<Users/>} note="base cadastrada"/><Card title="Orçamentos" value={quotes.length} icon={<FileText/>} note="propostas"/><Card title="Placas calculadas" value={quotes.reduce((a,q)=>a+q.panels,0)} icon={<Sun/>} note="nos orçamentos"/></div></section>}
