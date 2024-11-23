"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NuevoProducto() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [unidad, setUnidad] = useState("docena");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const producto = {
      nombre,
      cantidad,
      unidad,
      ultimaActualizacion: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      if (response.ok) {
        alert("Producto agregado correctamente");
        router.push("/productos"); // Redirigir a la lista de productos
      } else {
        alert("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error al conectar con la API", error);
      alert("Hubo un problema al guardar el producto.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del producto</Label>
              <Input
                id="nombre"
                placeholder="Ej. Huevos de codorniz"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad disponible</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="unidad">Unidad de medida</Label>
              <Input
                id="unidad"
                placeholder="Ej. docena"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Guardar Producto</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
