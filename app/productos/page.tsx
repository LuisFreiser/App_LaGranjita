"use client";

import { useState, useEffect } from "react";
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

type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  ultimaActualizacion: string;
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      toast.error("Error al cargar productos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCrearProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nuevoProducto = {
      nombre: formData.get("nombre") as string,
      cantidad: parseInt(formData.get("cantidad") as string),
      unidad: formData.get("unidad") as string,
    };

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        const productoCreado = await response.json();
        toast.success("Producto creado exitosamente");
        setProductos((prev) => [...prev, productoCreado]);
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al crear producto");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast.error("Error al crear producto");
    }
  };

  const handleEditarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productoSeleccionado) return;

    const formData = new FormData(e.currentTarget);

    const productoActualizado = {
      id: productoSeleccionado.id,
      nombre: formData.get("nombre") as string,
      cantidad: parseInt(formData.get("cantidad") as string),
      unidad: formData.get("unidad") as string,
    };

    try {
      const response = await fetch(
        `/api/productos/${productoSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoActualizado),
        }
      );

      if (response.ok) {
        const productoActualizadoRespuesta = await response.json();
        toast.success("Producto actualizado exitosamente");
        setProductos((prev) =>
          prev.map((p) =>
            p.id === productoSeleccionado.id ? productoActualizadoRespuesta : p
          )
        );
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("Error al actualizar producto");
    }
  };

  const handleEliminarProducto = async (id: number) => {
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Producto eliminado exitosamente");
        setProductos((prev) => prev.filter((producto) => producto.id !== id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto");
    }
  };

  const abrirModalEdicion = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setProductoSeleccionado(null);
                setModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {productoSeleccionado ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={
                productoSeleccionado
                  ? handleEditarProducto
                  : handleCrearProducto
              }
              className="grid gap-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  name="nombre"
                  placeholder="Nombre"
                  defaultValue={productoSeleccionado?.nombre || ""}
                  className="col-span-4"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  name="cantidad"
                  placeholder="Cantidad"
                  defaultValue={productoSeleccionado?.cantidad || ""}
                  className="col-span-4"
                  required
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  name="unidad"
                  placeholder="Unidad"
                  defaultValue={productoSeleccionado?.unidad || ""}
                  className="col-span-4"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-full">
                  {productoSeleccionado ? "Actualizar" : "Crear Producto"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-12 w-12 animate-spin" />
          <p>Cargando Productos...</p>
        </div>
      ) : (
        <Table className="hidden md:table border">
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.cantidad}</TableCell>
                <TableCell>{producto.unidad}</TableCell>
                <TableCell>
                  {formatearFecha(producto.ultimaActualizacion)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirModalEdicion(producto)}
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
                            ¿Estás seguro de eliminar este producto?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente el registro del producto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminarProducto(producto.id)}
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
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{producto.nombre}</h2>
              <span
                className={`px-2 py-1 rounded text-xs text-center ${
                  producto.cantidad > 10
                    ? "bg-green-100 text-green-800"
                    : producto.cantidad > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Stock: {producto.cantidad} {producto.unidad}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-sm">
                <span className="font-medium">Presentación:</span>{" "}
                {producto.unidad}
              </p>
              <p className="text-sm">
                <span className="font-medium">Última Actualización:</span>
                {new Date(producto.ultimaActualizacion).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => abrirModalEdicion(producto)}
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
                    <AlertDialogTitle>¿Eliminar Producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El producto será
                      eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleEliminarProducto(producto.id)}
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

      {!loading && productos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay productos registrados
        </div>
      )}
    </div>
  );
}
