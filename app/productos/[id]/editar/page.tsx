"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditarProducto() {
  const { id } = useParams();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [unidad, setUnidad] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`/api/productos/${id}`);
        if (response.ok) {
          const producto = await response.json();
          setNombre(producto.nombre);
          setCantidad(producto.cantidad);
          setUnidad(producto.unidad);
          setUltimaActualizacion(producto.ultimaActualizacion);
        } else {
          console.error("Error al obtener el producto");
        }
      } catch (error) {
        console.error("Error al conectar con la API", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, unidad }),
      });

      if (response.ok) {
        alert("Producto actualizado con éxito");
        router.push("/productos");
      } else {
        alert("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar el producto", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="unidad">Unidad</Label>
              <Input
                id="unidad"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Guardar Cambios</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
