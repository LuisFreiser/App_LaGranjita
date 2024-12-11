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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  // Estado de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5; // Cantidad de pedidos por página

  //USANDO FETCH PARA LLAMAR A LA API Y OBTENER LOS PEDIDOS
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

  //USANDO FETCH PARA LLAMAR A LA API Y OBTENER LOS PRODUCTOS
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

  //USANDO USEEFFECT PARA CARGAR PEDIDOS Y PRODUCTOS CADA VEZ QUE EL COMPONENTE SE RENDERICE
  useEffect(() => {
    fetchPedidos();
    fetchProductos();
  }, []);

  //FUNCION PARA CREAR UN NUEVO PEDIDO
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

  //FUNCION PARA EDITAR UN PEDIDO
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

  //FUNCION PARA ELIMINAR UN PEDIDO
  const handleEliminarPedido = async (id: number) => {
    try {
      const response = await fetch("/api/pedidos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
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
  //FUNCION PARA ABRIR EL MODAL DE EDITAR UN PEDIDO
  const abrirModalEdicion = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };
  //CONSTANTE QUE ALMACENA Y FILTRA LOS PRIMEROS 10 PEDIDOS
  const primeras10Filas = pedidos.slice(0, 10);

  // FUNCIONES DE PAGINACIÓN DE DASHBOARD PEDIDOS

  // Calcular total de pedidos para la Páginacion
  const pedidosPaginados = pedidos.slice(
    (paginaActual - 1) * pedidosPorPagina,
    paginaActual * pedidosPorPagina
  );

  // Calcular total de páginas
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  // Funciones de Limk de Paginación
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  {
    /* TABLA LISTA DE PEDIDOS */
  }
  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Pedidos</h1>

        {/* BOTON DIALOGO DE NUEVO PEDIDO */}
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

      {/* CARGANDO LISTA DE PEDIDOS */}
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
            {pedidosPaginados.map((pedido) => (
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

      {/* COMPONENTE DE PAGINACIÓN */}
      <div className="hidden md:block">
        {totalPaginas >= 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={paginaAnterior}
                  className={
                    paginaActual === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* GENERAR NUMERO DE PAGINAS */}
              {[...Array(totalPaginas)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => irAPagina(index + 1)}
                    isActive={paginaActual === index + 1}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={paginaSiguiente}
                  className={
                    paginaActual === totalPaginas
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* CARDS EN MODO MÓVILES */}

      <div className="md:hidden space-y-4">
        {primeras10Filas.map((pedido) => (
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

      {/* ESTADO TABLA PEDIDOS VACÍO */}
      {!loading && pedidos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay pedidos registrados
        </div>
      )}
    </div>
  );
}
