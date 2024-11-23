"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  ultimaActualizacion: string;
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    nombre: "",
    cantidad: 0,
    unidad: "",
  });
  const [editProducto, setEditProducto] = useState<Partial<Producto> | null>(
    null
  );

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`/api/productos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProductos((prev) => prev.filter((producto) => producto.id !== id));
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error al eliminar el producto", error);
      }
    }
  };

  const handleCrearProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.cantidad) {
      toast.error("Nombre y cantidad son obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        toast.success("Producto creado exitosamente");
        const newProducto = await response.json();
        setProductos((prev) => [...prev, newProducto]);
        setNuevoProducto({ nombre: "", cantidad: 0, unidad: "" });
      } else {
        toast.error("Error al crear el producto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el producto");
    }
  };

  const handleEditarProducto = async () => {
    if (!editProducto) return;

    try {
      await fetch(`/api/productos/${editProducto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProducto),
      });
      toast.success("Producto actualizado");
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editProducto.id ? { ...p, ...editProducto } : p
        )
      );
      setEditProducto(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el producto");
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="container mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 dark:shadow-slate-700">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Agregar Producto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              placeholder="Nombre"
              value={nuevoProducto.nombre || ""}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  nombre: e.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Cantidad"
              value={nuevoProducto.cantidad || ""}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  cantidad: Number(e.target.value),
                })
              }
            />
            <Input
              placeholder="Unidad"
              value={nuevoProducto.unidad || ""}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  unidad: e.target.value,
                })
              }
            />
            <DialogClose asChild>
              <Button onClick={handleCrearProducto}>Crear Producto</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead>Acciones</TableHead>
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
                {new Date(producto.ultimaActualizacion).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditProducto(producto)}
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Producto</DialogTitle>
                    </DialogHeader>
                    {editProducto && (
                      <div className="grid gap-4">
                        <Input
                          placeholder="Nombre"
                          value={editProducto.nombre || ""}
                          onChange={(e) =>
                            setEditProducto({
                              ...editProducto,
                              nombre: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={editProducto.cantidad || ""}
                          onChange={(e) =>
                            setEditProducto({
                              ...editProducto,
                              cantidad: Number(e.target.value),
                            })
                          }
                        />
                        <Input
                          placeholder="Unidad"
                          value={editProducto.unidad || ""}
                          onChange={(e) =>
                            setEditProducto({
                              ...editProducto,
                              unidad: e.target.value,
                            })
                          }
                        />
                        <DialogClose asChild>
                          <Button onClick={handleEditarProducto}>
                            Guardar Cambios
                          </Button>
                        </DialogClose>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(producto.id)}
                  className="ml-2"
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
