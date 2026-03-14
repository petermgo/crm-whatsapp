import { useEffect, useState } from "react"
import axios from "axios"
import Login from "./Login"

import { MessageCircle, MapPin, Send, Search } from "lucide-react"

const API_URL = "https://crm-whatsapp-w2an.onrender.com"

type Client = {
  id:number
  nome:string
  telefone:string
  municipio:string
  modelo:string
  endereco:string
}

export default function App(){

const[logged,setLogged]=useState(false)

const[clients,setClients]=useState<Client[]>([])
const[search,setSearch]=useState("")
const[city,setCity]=useState("TODAS")
const[model,setModel]=useState("TODOS")

const[selectedClients,setSelectedClients]=useState<number[]>([])
const[messageTemplate,setMessageTemplate]=useState("")

useEffect(()=>{

if(logged) loadClients()

},[logged])

async function loadClients(){

const res=await axios.get(`${API_URL}/clients`)
setClients(res.data)

}

if(!logged){

return <Login onLogin={()=>setLogged(true)}/>

}

async function importFile(e:any){

const file=e.target.files[0]

const formData=new FormData()

formData.append("file",file)

await axios.post(`${API_URL}/upload`,formData)

loadClients()

}

const cities=["TODAS",...Array.from(new Set(clients.map(c=>c.municipio)))]
const models=["TODOS",...Array.from(new Set(clients.map(c=>c.modelo)))]

const filteredClients=clients.filter(client=>{

const matchName=client.nome.toLowerCase().includes(search.toLowerCase())
const matchCity=city==="TODAS"||client.municipio===city
const matchModel=model==="TODOS"||client.modelo===model

return matchName&&matchCity&&matchModel

})

function toggleClient(id:number){

if(selectedClients.includes(id)){

setSelectedClients(selectedClients.filter(c=>c!==id))

}else{

setSelectedClients([...selectedClients,id])

}

}

function openWhatsApp(client:Client){

const message=messageTemplate
.replace("{nome}",client.nome.split(" ")[0])
.replace("{modelo}",client.modelo)

const url=`https://api.whatsapp.com/send?phone=${client.telefone}&text=${encodeURIComponent(message)}`

window.open(url,"_blank")

}

function openMap(client:Client){

const address=encodeURIComponent(client.endereco+" "+client.municipio)

const url=`https://www.google.com/maps/search/?api=1&query=${address}`

window.open(url,"_blank")

}

function sendWhatsApp(){

const selected=clients.filter(c=>selectedClients.includes(c.id))

selected.forEach((client,index)=>{

const message=messageTemplate
.replace("{nome}",client.nome.split(" ")[0])
.replace("{modelo}",client.modelo)

const url=`https://api.whatsapp.com/send?phone=${client.telefone}&text=${encodeURIComponent(message)}`

setTimeout(()=>{

window.open(url,"_blank")

},index*1200)

})

}

function campanhaPecas(){

setMessageTemplate(`Olá {nome}! 👋

Me chamo Pedro Gabriel da SLC Máquinas.

Temos condições especiais em peças para o modelo {modelo}.`)

}

function campanhaRevisao(){

setMessageTemplate(`Olá {nome}! 🔧

Sou Pedro Gabriel da SLC Máquinas.

Estou entrando em contato para verificar peças para o modelo {modelo}.`)

}

function campanhaPromocao(){

setMessageTemplate(`Olá {nome}! 🎯

Sou Pedro Gabriel da SLC Máquinas.

Estamos com promoções em peças para o modelo {modelo}.`)

}

return(

<div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">

<header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow">

<h1 className="text-2xl font-bold">CRM Comercial</h1>

<p className="text-blue-100">
Pedro Gabriel • SLC Máquinas
</p>

</header>

<div className="max-w-7xl mx-auto p-6">

{/* CARDS */}

<div className="grid md:grid-cols-3 gap-4 mb-6">

<div className="bg-white rounded-xl shadow-md p-6">

<p className="text-gray-500">Clientes</p>
<p className="text-3xl font-bold text-blue-600">{clients.length}</p>

</div>

<div className="bg-white rounded-xl shadow-md p-6">

<p className="text-gray-500">Cidades</p>
<p className="text-3xl font-bold text-indigo-600">{cities.length-1}</p>

</div>

<div className="bg-white rounded-xl shadow-md p-6">

<p className="text-gray-500">Modelos</p>
<p className="text-3xl font-bold text-purple-600">{models.length-1}</p>

</div>

</div>

{/* FILTROS */}

<div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3 items-center">

<Search className="text-gray-500"/>

<input
placeholder="Buscar cliente..."
className="border rounded-lg p-2 flex-1"
value={search}
onChange={e=>setSearch(e.target.value)}
/>

<select
className="border rounded-lg p-2"
value={city}
onChange={e=>setCity(e.target.value)}
>
{cities.map((c,i)=>(<option key={i}>{c}</option>))}
</select>

<select
className="border rounded-lg p-2"
value={model}
onChange={e=>setModel(e.target.value)}
>
{models.map((m,i)=>(<option key={i}>{m}</option>))}
</select>

<input type="file" onChange={importFile}/>

</div>

{/* CAMPANHAS */}

<div className="bg-white p-5 rounded-xl shadow mb-6">

<h3 className="font-semibold mb-3">
Campanhas rápidas
</h3>

<div className="flex gap-2 mb-3 flex-wrap">

<button
onClick={campanhaPecas}
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

Peças

</button>

<button
onClick={campanhaRevisao}
className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">

Revisão

</button>

<button
onClick={campanhaPromocao}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">

Promoção

</button>

</div>

<textarea
rows={5}
value={messageTemplate}
onChange={e=>setMessageTemplate(e.target.value)}
className="w-full border rounded-lg p-3"
/>

<button
onClick={sendWhatsApp}
className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg">

<Send size={18}/>
Enviar WhatsApp

</button>

</div>

{/* DESKTOP TABLE */}

<div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-3"></th>
<th>Cliente</th>
<th>Cidade</th>
<th>Modelo</th>
<th>WhatsApp</th>
<th>Mapa</th>

</tr>

</thead>

<tbody>

{filteredClients.map(client=>(

<tr key={client.id} className="border-t hover:bg-slate-50">

<td className="p-3">

<input
type="checkbox"
checked={selectedClients.includes(client.id)}
onChange={()=>toggleClient(client.id)}
/>

</td>

<td className="font-medium">{client.nome}</td>
<td>{client.municipio}</td>

<td>

<span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
{client.modelo}
</span>

</td>

<td>

<button
onClick={()=>openWhatsApp(client)}
className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg">

<MessageCircle size={18}/>
WhatsApp

</button>

</td>

<td>

<button
onClick={()=>openMap(client)}
className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg">

<MapPin size={18}/>
Mapa

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* MOBILE */}

<div className="md:hidden space-y-4">

{filteredClients.map(client=>(

<div key={client.id} className="bg-white rounded-xl shadow p-4">

<div className="flex justify-between items-start mb-2">

<div>

<p className="font-semibold text-lg">
{client.nome}
</p>

<p className="text-gray-500 text-sm">
{client.municipio}
</p>

</div>

<input
type="checkbox"
checked={selectedClients.includes(client.id)}
onChange={()=>toggleClient(client.id)}
/>

</div>

<div className="mb-3">

<span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
Modelo: {client.modelo}
</span>

</div>

<div className="flex gap-2">

<button
onClick={()=>openWhatsApp(client)}
className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-lg">

<MessageCircle size={18}/>
WhatsApp

</button>

<button
onClick={()=>openMap(client)}
className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg">

<MapPin size={18}/>
Mapa

</button>

</div>

</div>

))}

</div>

</div>

</div>

)

}