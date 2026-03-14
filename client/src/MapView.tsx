import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

type Client = {
id:number
nome:string
municipio:string
endereco:string
}

type Props = {
clients:Client[]
}

const icon = new L.Icon({
iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
iconSize:[25,41],
iconAnchor:[12,41]
})

export default function MapView({clients}:Props){

return(

<div className="h-[500px] w-full rounded-xl overflow-hidden shadow">

<MapContainer
center={[-29.69,-51.46]}
zoom={8}
style={{height:"100%",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{clients.map(client=>{

return(

<Marker
key={client.id}
position={[-29.69,-51.46]}
icon={icon}
>

<Popup>

<strong>{client.nome}</strong>

<br/>

{client.municipio}

</Popup>

</Marker>

)

})}

</MapContainer>

</div>

)

}