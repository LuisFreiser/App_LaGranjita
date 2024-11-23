"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function NuevoPedido() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(25);
  const [estado, setEstado] = useState("Pendiente");

  // Aquí enviamos los datos al backend o a la base de datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pedido = { cliente, producto, cantidad, estado };

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        alert("Pedido agregado correctamente");
        setCliente("");
        setProducto("");
        setCantidad(25);
        setEstado("Pendiente");
      } else {
        alert("Error al agregar el pedido");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con la API");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nuevo Pedido</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          <Input
            placeholder="Nombre del cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>

        {/* Producto */}
        <div>
          <label className="block text-sm font-medium mb-1">Producto</label>
          <Select
            value={producto}
            onValueChange={(value) => setProducto(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="huevitos">Huevitos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <Input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
            min={1}
            required
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Estado del Pedido
          </label>
          <Select value={estado} onValueChange={(value) => setEstado(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Completado">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón de enviar */}
        <Button type="submit" className="w-full">
          Guardar Pedido
        </Button>
      </form>
    </div>
  );
}
