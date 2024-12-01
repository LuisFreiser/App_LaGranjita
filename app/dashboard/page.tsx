"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, DollarSign, ShoppingCart, Loader2 } from "lucide-react";

type Pedido = {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  estado: string;
  precioTotal: number;
  createdAt: string;
  medioDePago: string;
};

type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
};

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 4; // Cantidad de pedidos por página

  // Función para calcular ventas del día
  const calcularVentasHoy = () => {
    const hoy = new Date();
    return pedidos
      .filter((pedido) => {
        const fechaPedido = new Date(pedido.createdAt);
        return (
          fechaPedido.toDateString() === hoy.toDateString() &&
          pedido.estado === "Entregado" // Opcional: solo pedidos entregados
        );
      })
      .reduce((total, pedido) => {
        // Asume que tienes un campo precio o calculas el total del pedido
        return total + (pedido.precioTotal || 0);
      }, 0);
  };

  // FUNCION PARA OBTENER LOS PEDIDOS
  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/pedidos");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        console.error("Error al obtener los pedidos");
      }
    } catch (error) {
      console.error("Error al conectar con la API", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNCION PARA OBTENER LOS PRODUCTOS
  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos");
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error("Error al obtener los productos");
      }
    } catch (error) {
      console.error("Error al conectar con la API", error);
    }
  };

  // USE EFFECT PARA OBTENER LOS PEDIDOS Y PRODUCTOS AL RENDERIZAR EL COMPONENTE
  useEffect(() => {
    fetchPedidos();
    fetchProductos();
  }, []);

  // Filtrar pedidos pendientes
  const pedidosPendientes = pedidos.filter(
    (pedido) => pedido.estado === "Pendiente"
  );

  // Calcular pedidos para la página actual
  const pedidosPaginados = pedidosPendientes.slice(
    (paginaActual - 1) * pedidosPorPagina,
    paginaActual * pedidosPorPagina
  );

  // Calcular total de páginas
  const totalPaginas = Math.ceil(pedidosPendientes.length / pedidosPorPagina);

  // Funciones de paginación
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
    setPaginaActual(pagina);
  };

  const calcularStockTotal = () => {
    return productos.reduce((total, producto) => total + producto.cantidad, 0);
  };

  // FUNCION PARA ENTREGAR, CANCELAR PEDIDOS Y REDUCIR STOCK DE PRODUCTOS

  // const handleEntregarPedido = async (
  //   pedidoId: number,
  //   medioDePago: string
  // ) => {
  //   try {
  //     const response = await fetch(`/api/pedidos/${pedidoId}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ estado: "Entregado", medioDePago: medioDePago }),
  //     });

  //     if (response.ok) {
  //       toast.success("Pedido entregado exitosamente");
  //       fetchPedidos();
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.error || "Error al entregar el pedido");
  //     }
  //   } catch (error) {
  //     console.error("Error al entregar el pedido:", error);
  //     toast.error("Error al entregar el pedido");
  //   }
  // };

  const handleEntregarPedido = async (
    pedidoId: number,
    medioDePago: string
  ) => {
    try {
      // Log inicial de pedidos y productos
      console.log("Pedidos disponibles:", JSON.stringify(pedidos, null, 2));
      console.log("Productos disponibles:", JSON.stringify(productos, null, 2));

      // Encontrar el pedido específico en la lista de pedidos local
      const pedidoLocal = pedidos.find((p) => p.id === pedidoId);

      if (!pedidoLocal) {
        throw new Error(
          `Pedido con ID ${pedidoId} no encontrado en la lista local`
        );
      }

      console.log(
        "Pedido local encontrado:",
        JSON.stringify(pedidoLocal, null, 2)
      );

      // Verificaciones de seguridad
      if (!pedidoLocal.producto) {
        throw new Error(
          `El pedido no tiene un producto definido: ${JSON.stringify(
            pedidoLocal
          )}`
        );
      }

      // Buscar el producto correspondiente
      const productoDelPedido = productos.find(
        (p) =>
          p.nombre.trim().toLowerCase() ===
          pedidoLocal.producto.trim().toLowerCase()
      );

      // Log de búsqueda de producto
      console.log("Nombre del producto buscado:", pedidoLocal.producto);
      console.log("Producto encontrado:", productoDelPedido);

      if (!productoDelPedido) {
        throw new Error(`Producto no encontrado: "${pedidoLocal.producto}". 
        Productos disponibles: ${productos.map((p) => p.nombre).join(", ")}`);
      }

      // Calcular nueva cantidad de stock
      const nuevaCantidad = productoDelPedido.cantidad - pedidoLocal.cantidad;

      // Validar stock
      if (nuevaCantidad < 0) {
        throw new Error(`Stock insuficiente para ${productoDelPedido.nombre}. 
        Stock actual: ${productoDelPedido.cantidad}, 
        Cantidad solicitada: ${pedidoLocal.cantidad}`);
      }

      // Actualizar pedido en el backend
      const updatePedidoResponse = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "Entregado",
          medioDePago: medioDePago,
        }),
      });

      if (!updatePedidoResponse.ok) {
        const errorData = await updatePedidoResponse.json();
        throw new Error(errorData.error || "Error al actualizar pedido");
      }

      // Actualizar producto
      const updateProductoResponse = await fetch(
        `/api/productos/${productoDelPedido.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: productoDelPedido.nombre,
            cantidad: nuevaCantidad,
            ultimaActualizacion: new Date().toISOString(),
          }),
        }
      );

      if (!updateProductoResponse.ok) {
        const errorData = await updateProductoResponse.json();
        throw new Error(`Error al actualizar producto: ${errorData.error}`);
      }

      // Notificaciones y actualización
      toast.success("Pedido entregado y stock actualizado");
      fetchPedidos();
      fetchProductos();
    } catch (error) {
      console.error("Error al entregar pedido:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al entregar pedido"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Cabecera */}
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Sección de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Pedidos Pendientes</CardTitle>
            <ShoppingCart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {pedidos.filter((pedido) => pedido.estado === "Pendiente").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Stock Actual</CardTitle>
            <Package className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {calcularStockTotal()} unidades
            </p>
            <div className="text-sm text-gray-500 mt-2">
              {productos.map((producto) => (
                <div key={producto.id}>
                  {producto.nombre}: {producto.cantidad}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 hover:border-green-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Ventas del Día</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {`S/.${calcularVentasHoy()}`}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Ingresos totales de hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABLA DE PEDIDOS PENDIENTES */}
      <div className="container mt-4 mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
        <h2 className="text-xl font-semibold mb-4">Pedidos Pendientes</h2>
        {loading ? (
          <div className="flex h-full">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>Cargando pedidos...</p>
          </div>
        ) : pedidos.filter((pedido) => pedido.estado === "Pendiente").length >
          0 ? (
          <>
            <Table className="border">
              <TableHeader>
                <TableRow className="bg-slate-100">
                  {/* <TableHead>ID</TableHead> */}
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosPaginados.map(
                  (
                    pedido // Aquí estás usando pedidosPaginados
                  ) => (
                    <TableRow key={pedido.id}>
                      {/* <TableCell>{pedido.id}</TableCell> */}
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell>{pedido.producto}</TableCell>
                      <TableCell>
                        {new Date(pedido.createdAt).toLocaleDateString("es-PE")}
                      </TableCell>
                      <TableCell>{pedido.cantidad}</TableCell>
                      <TableCell>S/.{pedido.precioTotal.toFixed(2)}</TableCell>

                      <TableCell>
                        {/* Aquí estás usando handleEntregarPedido */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Entregado</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Confirmar Entrega de Pedido
                              </DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4">
                              <Select
                                value={pedido.medioDePago || ""}
                                onValueChange={(value) => {
                                  // Actualiza el estado local del medio de pago
                                  setPedidos((prevPedidos) =>
                                    prevPedidos.map((p) =>
                                      p.id === pedido.id
                                        ? { ...p, medioDePago: value }
                                        : p
                                    )
                                  );
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar Medio de Pago" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Efectivo">
                                    Efectivo
                                  </SelectItem>
                                  <SelectItem value="Yape">Yape</SelectItem>
                                </SelectContent>
                              </Select>
                              <DialogClose asChild>
                                <Button
                                  onClick={() =>
                                    handleEntregarPedido(
                                      pedido.id,
                                      pedido.medioDePago
                                    )
                                  }
                                >
                                  Guardar Cambios
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>

            {/* COMPONENTE DE PAGINACIÓN */}
            {totalPaginas > 1 && (
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
          </>
        ) : (
          <p>No hay pedidos pendientes.</p>
        )}
      </div>
    </div>
  );
}
