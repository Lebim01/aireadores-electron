import Ssh from "views/Ssh.jsx";
import Nodes from "views/Nodes.jsx";
import Node from "views/Node.jsx";
import Pools from "views/Pools.jsx";
import Pool from "views/Pool.jsx";
import HistoryNodes from "views/HistoryNodes"
import MapNodes from "views/MapNodes"

var routes = [
  {
    path: "/nodos/:id",
    name: "Crear/Editar Nodo",
    icon: "fa fa-node",
    component: Node,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/nodos",
    name: "Lista de nodos",
    icon: "fa fa-node",
    component: Nodes,
    layout: "/admin",
    exact: true
  },
  {
    path: "/historial-nodos",
    name: "Historial de nodos",
    icon: "fa fa-node",
    component: HistoryNodes,
    layout: "/admin"
  },
  {
    path: "/mapa-nodos",
    name: "Mapa de nodos",
    icon: "fa fa-node",
    component: MapNodes,
    layout: "/admin"
  },
  {
    path: "/piscinas",
    name: "Piscinas",
    icon: "fa fa-node",
    component: Pools,
    layout: "/admin",
    exact: true
  },
  {
    path: "/piscinas/:id",
    name: "Crear/Editar Piscina",
    icon: "fa fa-node",
    component: Pool,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/configuracion",
    name: "Configuración",
    icon: "fa fa-key",
    component: Ssh,
    layout: "/admin"
  },
];
export default routes;
