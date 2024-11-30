"use client";
import { useState, useEffect } from "react";
import { Producto } from "@prisma/client"; // Asume que tienes el modelo Producto definido en tu base de datos

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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Loader2, CalendarDays } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Compra = {
  id: number;
  producto: string;
  fecha: string;
  cantidad: number;
  costoUnidad: number;
  costoTotal: number;
};

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fechaCompra, setFechaCompra] = useState<Date | undefined>(
    compraSeleccionada ? new Date(compraSeleccionada.fecha) : new Date()
  );

  // Estado para controlar el Popover de fecha de compras
  const [isOpen, setIsOpen] = useState(false);

  // Estados para controlar la carga de productos en el selector
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/compras");
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      toast.error("Error al cargar compras");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  // Función para llamar a la API y obtener productos en el selector
  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos"); // Crea este endpoint en tu API
      const data = await response.json();
      setProductos(data);
      setLoadingProductos(false);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // const handleCrearCompra = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);

  //   const nuevaCompra = {
  //     producto: formData.get("producto") as string,
  //     fecha: formData.get("fecha") as string,
  //     cantidad: parseInt(formData.get("cantidad") as string),
  //     costoUnidad: parseFloat(formData.get("costoUnidad") as string),
  //   };

  //   try {
  //     const response = await fetch("/api/compras", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(nuevaCompra),
  //     });

  //     if (response.ok) {
  //       toast.success("Compra creada exitosamente");
  //       fetchCompras();
  //       setModalOpen(false);
  //     }
  //   } catch (error) {
  //     toast.error("Error al crear compra");
  //     console.error(error);
  //   }
  // };

  const handleCrearCompra = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Obtener el producto seleccionado (asumiendo que el selector devuelve el ID)
    const productoId = formData.get("producto") as string;

    // Buscar los detalles del producto seleccionado
    const productoSeleccionado = productos.find(
      (p) => p.id === parseInt(productoId)
    );

    // Preparar datos de la nueva compra
    const nuevaCompra = {
      producto: productoSeleccionado ? productoSeleccionado.nombre : "", // Usa el nombre del producto
      fecha: fechaCompra ? fechaCompra.toISOString() : new Date().toISOString(),
      cantidad: parseInt(formData.get("cantidad") as string),
      costoUnidad: parseFloat(formData.get("costoUnidad") as string),
    };

    try {
      // Realizar la solicitud de creación de compra
      const response = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCompra),
      });

      if (response.ok) {
        // const compraCreada = await response.json();

        // Actualizar la cantidad del producto
        if (productoSeleccionado) {
          const actualizarProductoResponse = await fetch(
            `/api/productos/${productoSeleccionado.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: productoSeleccionado.nombre,
                cantidad:
                  (productoSeleccionado.cantidad || 0) + nuevaCompra.cantidad,
                unidad: productoSeleccionado.unidad,
              }),
            }
          );

          if (!actualizarProductoResponse.ok) {
            toast.error("Error al actualizar la cantidad del producto");
          }
        }

        // Refrescar datos
        toast.success("Compra creada exitosamente");
        fetchCompras();
        fetchProductos(); // Refrescar lista de productos
        setModalOpen(false);
      } else {
        // Manejar errores de la respuesta
        const errorData = await response.json();
        toast.error(errorData.error || "Error al crear compra");
      }
    } catch (error) {
      console.error("Error al crear compra:", error);
      toast.error("Error al crear compra");
    }
  };

  // const handleEditarCompra = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!compraSeleccionada) return;

  //   const formData = new FormData(e.currentTarget);

  //   const compraActualizada = {
  //     id: compraSeleccionada.id,
  //     producto: formData.get("producto") as string,
  //     fecha: formData.get("fecha") as string,
  //     cantidad: parseInt(formData.get("cantidad") as string),
  //     costoUnidad: parseFloat(formData.get("costoUnidad") as string),
  //   };

  //   try {
  //     const response = await fetch("/api/compras", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(compraActualizada),
  //     });

  //     if (response.ok) {
  //       toast.success("Compra actualizada exitosamente");
  //       fetchCompras();
  //       setModalOpen(false);
  //     }
  //   } catch (error) {
  //     toast.error("Error al actualizar compra");
  //     console.error(error);
  //   }
  // };

  const handleEditarCompra = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!compraSeleccionada) return;

    const formData = new FormData(e.currentTarget);

    // Obtener el producto seleccionado
    const productoId = formData.get("producto") as string;
    const productoSeleccionado = productos.find(
      (p) => p.id === parseInt(productoId)
    );

    const compraActualizada = {
      id: compraSeleccionada.id,
      producto: productoSeleccionado ? productoSeleccionado.nombre : "",
      fecha: fechaCompra ? fechaCompra.toISOString() : new Date().toISOString(),
      cantidad: parseInt(formData.get("cantidad") as string),
      costoUnidad: parseFloat(formData.get("costoUnidad") as string),
    };

    try {
      const response = await fetch("/api/compras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compraActualizada),
      });

      if (response.ok) {
        // Calcular la diferencia de cantidad
        const diferenciasCantidad =
          compraActualizada.cantidad - compraSeleccionada.cantidad;

        // Actualizar la cantidad del producto
        if (productoSeleccionado) {
          const actualizarProductoResponse = await fetch(
            `/api/productos/${productoSeleccionado.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: productoSeleccionado.nombre,
                cantidad:
                  (productoSeleccionado.cantidad || 0) + diferenciasCantidad,
                unidad: productoSeleccionado.unidad,
              }),
            }
          );

          if (!actualizarProductoResponse.ok) {
            toast.error("Error al actualizar la cantidad del producto");
          }
        }

        toast.success("Compra actualizada exitosamente");
        fetchCompras();
        fetchProductos();
        setModalOpen(false);
      }
    } catch (error) {
      toast.error("Error al actualizar compra");
      console.error(error);
    }
  };

  const handleEliminarCompra = async (id: number) => {
    try {
      const response = await fetch("/api/compras", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Compra eliminada exitosamente");
        fetchCompras();
      }
    } catch (error) {
      toast.error("Error al eliminar compra");
      console.error(error);
    }
  };

  const abrirModalEdicion = (compra: Compra) => {
    setCompraSeleccionada(compra);
    setModalOpen(true);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDateSelectCompra = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setFechaCompra(selectedDate);
      setIsOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Compras</h1>

        {/* BOTON DIALOGO PARA CREAR UNA NUEVA COMPRA */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setCompraSeleccionada(null);
                setModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {compraSeleccionada ? "Editar Compra" : "Nueva Compra"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={
                compraSeleccionada ? handleEditarCompra : handleCrearCompra
              }
              className="grid gap-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  name="producto"
                  defaultValue={
                    compraSeleccionada
                      ? productos
                          .find((p) => p.nombre === compraSeleccionada.producto)
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
                          value={producto.id.toString()} // Usa el ID como valor
                        >
                          {producto.nombre} (Stock: {producto.cantidad})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full col-span-4 sm:w-auto justify-start text-left"
                    >
                      {fechaCompra
                        ? format(fechaCompra, "dd/MM/yyyy", { locale: es })
                        : "Seleccionar fecha"}
                      <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaCompra}
                      onSelect={handleDateSelectCompra}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  name="cantidad"
                  placeholder="Cantidad"
                  defaultValue={compraSeleccionada?.cantidad || ""}
                  className="col-span-4"
                  required
                  min="1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  name="costoUnidad"
                  placeholder="Costo por Unidad"
                  step="0.01"
                  defaultValue={compraSeleccionada?.costoUnidad || ""}
                  className="col-span-4"
                  required
                  min="0"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-full">
                  {compraSeleccionada ? "Actualizar" : "Crear Compra"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-12 w-12 animate-spin" />
          <p>Cargando Compras...</p>
        </div>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Producto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compras.map((compra) => (
              <TableRow key={compra.id}>
                <TableCell>{compra.producto}</TableCell>
                <TableCell>{formatearFecha(compra.fecha)}</TableCell>
                <TableCell>{compra.cantidad}</TableCell>
                <TableCell>S/ {compra.costoUnidad.toFixed(2)}</TableCell>
                <TableCell>S/ {compra.costoTotal.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirModalEdicion(compra)}
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
                            ¿Estás seguro de eliminar esta compra?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente el registro de compra.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminarCompra(compra.id)}
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

      {!loading && compras.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay compras registradas
        </div>
      )}
    </div>
  );
}
