import Ssh from "views/Ssh.jsx";
import Nodes from "views/Nodes.jsx";
import Node from "views/Node.jsx";
import Pools from "views/Pools.jsx";
import Pool from "views/Pool.jsx";
import HistoryNodes from "views/HistoryNodes"

var routes = [
  {
    path: "/configuracion",
    name: "Configuración",
    icon: "fa fa-key",
    component: Ssh,
    layout: "/admin"
  },
  {
    path: "/nodos/:id",
    name: "Crear/Editar Nodo",
    icon: "fa fa-node",
    component: Node,
    layout: "/admin"
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
    path: "/psicinas",
    name: "Psicinas",
    icon: "fa fa-node",
    component: Pools,
    layout: "/admin",
    exact: true
  },
  {
    path: "/psicina",
    name: "Crear/Editar Psicina",
    icon: "fa fa-node",
    component: Pool,
    layout: "/admin"
  },
];
export default routes;
