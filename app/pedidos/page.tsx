// "use client";

// import { useState, useEffect } from "react";
// import { Pedido } from "@prisma/client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// export default function PedidosPage() {
//   const [pedidos, setPedidos] = useState<Pedido[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editPedido, setEditPedido] = useState<Partial<Pedido> | null>(null);
//   const [nuevoPedido, setNuevoPedido] = useState<Partial<Pedido>>({
//     cliente: "",
//     producto: "",
//     cantidad: 0,
//     precioUnitario: 0,
//     estado: "Pendiente",
//   });
//   //Use State para el filtro de Productos en select
//   const [productos, setProductos] = useState<string[]>([]);

//   // FUNCION PARA CARGAR TODOS LOS PEDIDOS EN LA TABLA

//   const fetchPedidos = async () => {
//     try {
//       const response = await fetch("/api/pedidos");
//       const data = await response.json();
//       setPedidos(data);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Error al cargar pedidos");
//       setLoading(false);
//     }
//   };

//   // FUNCION PARA CREAR UN NUEVO PEDIDO

//   const handleCrearPedido = async () => {
//     // Validaciones
//     if (!nuevoPedido.cliente || !nuevoPedido.producto) {
//       toast.error("Cliente y producto son obligatorios");
//       return;
//     }
//     try {
//       const response = await fetch("/api/pedidos", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(nuevoPedido),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Pedido creado exitosamente");
//         fetchPedidos();
//         // Resetear el formulario de nuevo pedido
//         setNuevoPedido({
//           cliente: "",
//           producto: "",
//           cantidad: 0,
//           precioUnitario: 0,
//           estado: "Pendiente",
//         });
//       } else {
//         // Maneja específicamente el error de stock insuficiente
//         if (data.error === "Stock insuficiente") {
//           toast.error("Stock insuficiente para este producto");
//         } else {
//           toast.error(data.error || "Error al crear el pedido");
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error al crear el pedido");
//     }
//   };

//   // FUNCION PARA EDITAR UN PEDIDO

//   const handleEditarPedido = async () => {
//     if (!editPedido) return;

//     try {
//       await fetch("/api/pedidos", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editPedido),
//       });
//       toast.success("Pedido actualizado");
//       fetchPedidos();
//       setEditPedido(null);
//     } catch (error) {
//       console.error(error);
//       toast.error("Error al actualizar pedido");
//     }
//   };

//   // FUNCION PARA ELIMINAR UN PEDIDO X ID RUTA DE API ESTATICA

//   const handleEliminarPedido = async (id: number) => {
//     toast.custom(
//       (t) => (
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           <p className="text-red-600 font-bold mb-4">
//             ¿Estás seguro de que deseas eliminar este pedido?
//           </p>
//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={() => toast.dismiss(t)}
//               className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
//             >
//               Cancelar
//             </button>
//             <button
//               onClick={async () => {
//                 toast.dismiss(t);
//                 try {
//                   const response = await fetch("/api/pedidos", {
//                     method: "DELETE",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ id }),
//                   });

//                   // Verificar el estado de la respuesta
//                   if (!response.ok) {
//                     // Intentar obtener el mensaje de error del servidor
//                     const errorData = await response.json();
//                     throw new Error(
//                       errorData.error || "No se pudo eliminar el pedido"
//                     );
//                   }

//                   const data = await response.json();

//                   // Mensaje de éxito dependiendo de si se devolvió stock
//                   if (data.devueltoAlStock) {
//                     toast.success("Pedido eliminado. Stock actualizado.");
//                   } else {
//                     toast.success("Pedido eliminado");
//                   }

//                   // Actualizar la lista de pedidos
//                   fetchPedidos();
//                 } catch (error) {
//                   console.error("Error al eliminar pedido:", error);

//                   // Manejo de errores más específico
//                   if (error instanceof Error) {
//                     toast.error(
//                       error.message || "No se pudo eliminar el pedido"
//                     );
//                   } else {
//                     toast.error(
//                       "Ocurrió un error desconocido al eliminar el pedido"
//                     );
//                   }
//                 }
//               }}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               Eliminar
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         duration: Infinity,
//         position: "top-center",
//         className: "custom-toast-container",
//       }
//     );
//   };

//   useEffect(() => {
//     // Lógica para cargar a select  productos desde la BD
//     const fetchProductos = async () => {
//       try {
//         const response = await fetch("/api/productos");
//         const data = await response.json();
//         setProductos(data.map((p: { nombre: string }) => p.nombre));
//       } catch (error) {
//         console.error("Error al cargar productos", error);
//       }
//     };
//     fetchProductos();
//     fetchPedidos();
//   }, []);

//   //LLAMANDO AL LOADER (CAEGANDO PEDIDOS)

//   if (loading)
//     return (
//       <div className="fixed inset-0 z-50 flex justify-center items-center h-full">
//         <Loader2 className="mr-2 h-12 w-12 animate-spin" />
//         <p>Cargando Pedidos...</p>
//       </div>
//     );

//   return (
//     <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
//       <h1 className="text-3xl font-bold mb-4">Pedidos</h1>

//       {/* BOTON DIALOGO PARA CREAR UN NUEVO PEDIDO */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="mb-4">Nuevo Pedido</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Crear Nuevo Pedido</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <Input
//               placeholder="Cliente"
//               value={nuevoPedido.cliente || ""}
//               onChange={(e) =>
//                 setNuevoPedido({
//                   ...nuevoPedido,
//                   cliente: e.target.value,
//                 })
//               }
//             />
//             <Select
//               value={nuevoPedido.producto || ""}
//               onValueChange={(value) =>
//                 setNuevoPedido({
//                   ...nuevoPedido,
//                   producto: value,
//                 })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Seleccionar Producto" />
//               </SelectTrigger>
//               <SelectContent>
//                 {productos.map((producto) => (
//                   <SelectItem key={producto} value={producto}>
//                     {producto}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Input
//               type="number"
//               placeholder="Cantidad"
//               value={nuevoPedido.cantidad || ""}
//               onChange={(e) =>
//                 setNuevoPedido({
//                   ...nuevoPedido,
//                   cantidad: Number(e.target.value),
//                 })
//               }
//             />
//             <Input
//               type="number"
//               placeholder="Precio Unitario"
//               value={nuevoPedido.precioUnitario || ""}
//               onChange={(e) =>
//                 setNuevoPedido({
//                   ...nuevoPedido,
//                   precioUnitario: Number(e.target.value),
//                 })
//               }
//             />
//             <Select
//               value={nuevoPedido.estado || ""}
//               onValueChange={(value) =>
//                 setNuevoPedido({
//                   ...nuevoPedido,
//                   estado: value,
//                 })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Seleccionar Estado" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Pendiente">Pendiente</SelectItem>
//                 <SelectItem value="Entregado">Entregado</SelectItem>
//               </SelectContent>
//             </Select>
//             <DialogClose asChild>
//               <Button onClick={handleCrearPedido}>Crear Pedido</Button>
//             </DialogClose>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* TABLA EN DESKTOP PANTALLAS GRANDES */}
//       <div className="hidden md:block">
//         <Table className="border">
//           <TableHeader>
//             <TableRow className="bg-slate-100">
//               <TableHead>ID</TableHead>
//               <TableHead>Cliente</TableHead>
//               <TableHead>Producto</TableHead>
//               <TableHead>Cantidad</TableHead>
//               <TableHead>Estado</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead>Acciones</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {pedidos.map((pedido) => (
//               <TableRow key={pedido.id}>
//                 <TableCell>{pedido.id}</TableCell>
//                 <TableCell>{pedido.cliente}</TableCell>
//                 <TableCell>{pedido.producto}</TableCell>
//                 <TableCell>{pedido.cantidad}</TableCell>
//                 <TableCell>{pedido.estado}</TableCell>
//                 <TableCell>S/. {pedido.precioTotal.toFixed(2)}</TableCell>
//                 <TableCell className="flex items-center gap-2">
//                   {/* BOTON DIALOGO PARA EDITAR UN PEDIDO */}
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         onClick={() => setEditPedido(pedido)}
//                       >
//                         Editar
//                       </Button>
//                     </DialogTrigger>
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleEliminarPedido(pedido.id)}
//                     >
//                       Eliminar
//                     </Button>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Editar Pedido</DialogTitle>
//                       </DialogHeader>
//                       {editPedido && (
//                         <div className="grid gap-4">
//                           <Input
//                             placeholder="Cliente"
//                             value={editPedido.cliente || ""}
//                             onChange={(e) =>
//                               setEditPedido({
//                                 ...editPedido,
//                                 cliente: e.target.value,
//                               })
//                             }
//                           />
//                           <Input
//                             placeholder="Producto"
//                             value={editPedido.producto || ""}
//                             onChange={(e) =>
//                               setEditPedido({
//                                 ...editPedido,
//                                 producto: e.target.value,
//                               })
//                             }
//                           />
//                           <Input
//                             type="number"
//                             placeholder="Cantidad"
//                             value={editPedido.cantidad || ""}
//                             onChange={(e) =>
//                               setEditPedido({
//                                 ...editPedido,
//                                 cantidad: Number(e.target.value),
//                               })
//                             }
//                           />
//                           <Select
//                             value={editPedido?.estado || "Pendiente"}
//                             onValueChange={(value) =>
//                               setEditPedido({
//                                 ...editPedido,
//                                 estado: value,
//                               })
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Seleccionar Estado" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Pendiente">
//                                 Pendiente
//                               </SelectItem>
//                               <SelectItem value="Entregado">
//                                 Entregado
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <DialogClose asChild>
//                             <Button onClick={handleEditarPedido}>
//                               Guardar Cambios
//                             </Button>
//                           </DialogClose>
//                         </div>
//                       )}
//                     </DialogContent>
//                   </Dialog>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* PARA TARJETAS EN MOVILES */}
//       <div className="md:hidden grid gap-4">
//         {pedidos.map((pedido) => (
//           <div
//             key={pedido.id}
//             className="p-4 border rounded-lg bg-white shadow dark:bg-slate-800"
//           >
//             <h2 className="text-lg font-semibold mb-2">
//               Pedido #{pedido.id} - {pedido.cliente}
//             </h2>
//             <p>
//               <strong>Producto:</strong> {pedido.producto}
//             </p>
//             <p>
//               <strong>Cantidad:</strong> {pedido.cantidad}
//             </p>
//             <p>
//               <strong>Estado:</strong> {pedido.estado}
//             </p>
//             <p>
//               <strong>Total:</strong> S/ {pedido.precioTotal}
//             </p>
//             <div className="mt-2 flex items-center gap-2">
//               {/* BOTON DIALOGO PARA EDITAR UN PEDIDO */}
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="outline"
//                     onClick={() => setEditPedido(pedido)}
//                   >
//                     Editar
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Editar Pedido</DialogTitle>
//                   </DialogHeader>
//                   {editPedido && (
//                     <div className="grid gap-4">
//                       <Input
//                         placeholder="Cliente"
//                         value={editPedido.cliente || ""}
//                         onChange={(e) =>
//                           setEditPedido({
//                             ...editPedido,
//                             cliente: e.target.value,
//                           })
//                         }
//                       />
//                       <Input
//                         placeholder="Producto"
//                         value={editPedido.producto || ""}
//                         onChange={(e) =>
//                           setEditPedido({
//                             ...editPedido,
//                             producto: e.target.value,
//                           })
//                         }
//                       />
//                       <Input
//                         type="number"
//                         placeholder="Cantidad"
//                         value={editPedido.cantidad || ""}
//                         onChange={(e) =>
//                           setEditPedido({
//                             ...editPedido,
//                             cantidad: Number(e.target.value),
//                           })
//                         }
//                       />
//                       <Select
//                         value={editPedido?.estado || "Pendiente"}
//                         onValueChange={(value) =>
//                           setEditPedido({
//                             ...editPedido,
//                             estado: value,
//                           })
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Seleccionar Estado" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Pendiente">Pendiente</SelectItem>
//                           <SelectItem value="Entregado">Entregado</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <DialogClose asChild>
//                         <Button onClick={handleEditarPedido}>
//                           Guardar Cambios
//                         </Button>
//                       </DialogClose>
//                     </div>
//                   )}
//                 </DialogContent>
//               </Dialog>
//               <Button
//                 variant="destructive"
//                 onClick={() => handleEliminarPedido(pedido.id)}
//               >
//                 Eliminar
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Producto } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Pedido = {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  estado: string;
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pedidos");
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      toast.error("Error al cargar pedidos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos");
      const data = await response.json();
      setProductos(data);
      setLoadingProductos(false);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchProductos();
  }, []);

  const handleCrearPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productoId = formData.get("producto") as string;
    const productoSeleccionado = productos.find(
      (p) => p.id === parseInt(productoId)
    );

    const nuevoPedido = {
      cliente: formData.get("cliente") as string,
      producto: productoSeleccionado ? productoSeleccionado.nombre : "",
      cantidad: parseInt(formData.get("cantidad") as string),
      precioUnitario: parseFloat(formData.get("precioUnitario") as string),
      estado: formData.get("estado") as string,
    };

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPedido),
      });

      if (response.ok) {
        const pedidoCreado = await response.json();

        // Actualizar stock del producto
        if (productoSeleccionado) {
          const actualizarProductoResponse = await fetch(
            `/api/productos/${productoSeleccionado.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: productoSeleccionado.nombre,
                cantidad:
                  (productoSeleccionado.cantidad || 0) - nuevoPedido.cantidad,
                unidad: productoSeleccionado.unidad,
              }),
            }
          );

          if (!actualizarProductoResponse.ok) {
            toast.error("Error al actualizar el stock del producto");
          }
        }

        toast.success("Pedido creado exitosamente");
        fetchPedidos();
        fetchProductos();
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al crear pedido");
      }
    } catch (error) {
      console.error("Error al crear pedido:", error);
      toast.error("Error al crear pedido");
    }
  };

  const handleEditarPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pedidoSeleccionado) return;

    const formData = new FormData(e.currentTarget);
    const productoId = formData.get("producto") as string;
    const productoSeleccionado = productos.find(
      (p) => p.id === parseInt(productoId)
    );

    const pedidoActualizado = {
      id: pedidoSeleccionado.id,
      cliente: formData.get("cliente") as string,
      producto: productoSeleccionado ? productoSeleccionado.nombre : "",
      cantidad: parseInt(formData.get("cantidad") as string),
      precioUnitario: parseFloat(formData.get("precioUnitario") as string),
      estado: formData.get("estado") as string,
    };

    try {
      const response = await fetch("/api/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoActualizado),
      });

      if (response.ok) {
        // Calcular la diferencia de cantidad
        const diferenciasCantidad =
          pedidoActualizado.cantidad - pedidoSeleccionado.cantidad;

        // Actualizar stock del producto
        if (productoSeleccionado) {
          const actualizarProductoResponse = await fetch(
            `/api/productos/${productoSeleccionado.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: productoSeleccionado.nombre,
                cantidad:
                  (productoSeleccionado.cantidad || 0) - diferenciasCantidad,
                unidad: productoSeleccionado.unidad,
              }),
            }
          );

          if (!actualizarProductoResponse.ok) {
            toast.error("Error al actualizar el stock del producto");
          }
        }

        toast.success("Pedido actualizado exitosamente");
        fetchPedidos();
        fetchProductos();
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al actualizar pedido");
      }
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      toast.error("Error al actualizar pedido");
    }
  };

  const handleEliminarPedido = async (id: number) => {
    try {
      const response = await fetch("/api/pedidos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const pedidoEliminado = await response.json();

        // Si el pedido fue eliminado, devolver el stock
        if (pedidoEliminado) {
          const productoAfectado = productos.find(
            (p) => p.nombre === pedidoEliminado.producto
          );

          if (productoAfectado) {
            const actualizarProductoResponse = await fetch(
              `/api/productos/${productoAfectado.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nombre: productoAfectado.nombre,
                  cantidad:
                    (productoAfectado.cantidad || 0) + pedidoEliminado.cantidad,
                  unidad: productoAfectado.unidad,
                }),
              }
            );

            if (!actualizarProductoResponse.ok) {
              toast.error("Error al devolver el stock del producto");
            }
          }
        }

        toast.success("Pedido eliminado exitosamente");
        fetchPedidos();
        fetchProductos();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al eliminar pedido");
      }
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      toast.error("Error al eliminar pedido");
    }
  };

  const abrirModalEdicion = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Pedidos</h1>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setPedidoSeleccionado(null);
                setModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {pedidoSeleccionado ? "Editar Pedido" : "Nuevo Pedido"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={
                pedidoSeleccionado ? handleEditarPedido : handleCrearPedido
              }
              className="grid gap-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  name="cliente"
                  placeholder="Cliente"
                  defaultValue={pedidoSeleccionado?.cliente || ""}
                  className="col-span-4"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  name="producto"
                  defaultValue={
                    pedidoSeleccionado
                      ? productos
                          .find((p) => p.nombre === pedidoSeleccionado.producto)
                          ?.id.toString()
                      : undefined
                  }
                  required
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Seleccionar Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingProductos ? (
                      <SelectItem value="loading" disabled>
                        Cargando productos...
                      </SelectItem>
                    ) : productos.length === 0 ? (
                      <SelectItem value="no-products" disabled>
                        No hay productos disponibles
                      </SelectItem>
                    ) : (
                      productos.map((producto) => (
                        <SelectItem
                          key={producto.id}
                          value={producto.id.toString()}
                        >
                          {producto.nombre} (Stock: {producto.cantidad})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  name="cantidad"
                  placeholder="Cantidad"
                  defaultValue={pedidoSeleccionado?.cantidad || ""}
                  className="col-span-4"
                  required
                  min="1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  name="precioUnitario"
                  placeholder="Precio Unitario"
                  step="0.01"
                  defaultValue={pedidoSeleccionado?.precioUnitario || ""}
                  className="col-span-4"
                  required
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  name="estado"
                  defaultValue={pedidoSeleccionado?.estado || "Pendiente"}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-full">
                  {pedidoSeleccionado ? "Actualizar" : "Crear Pedido"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-12 w-12 animate-spin" />
          <p>Cargando Pedidos...</p>
        </div>
      ) : (
        <Table className="hidden md:table border">
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.cliente}</TableCell>
                <TableCell>{pedido.producto}</TableCell>
                <TableCell>{pedido.cantidad}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>S/ {pedido.precioTotal.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirModalEdicion(pedido)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de eliminar este pedido?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente el registro del pedido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminarPedido(pedido.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* CARDS EN MÓVILES */}
      <div className="md:hidden space-y-4">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{pedido.cliente}</h2>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  pedido.estado === "Entregado"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {pedido.estado}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-sm">
                <span className="font-medium">Producto:</span> {pedido.producto}
              </p>
              <p className="text-sm">
                <span className="font-medium">Cantidad:</span> {pedido.cantidad}
              </p>
              <p className="text-sm">
                <span className="font-medium">Precio Total:</span>
                S/ {pedido.precioTotal.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => abrirModalEdicion(pedido)}
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar Pedido?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El pedido será eliminado
                      permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleEliminarPedido(pedido.id)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {/* ESTADO VACÍO */}
      {!loading && pedidos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay pedidos registrados
        </div>
      )}
    </div>
  );
}
