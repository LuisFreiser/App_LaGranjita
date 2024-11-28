"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Usando shadcn
import { Input } from "@/components/ui/input"; // Usando shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Tabla Shadcn
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Importación necesaria para gráficos

export default function ReporteVentas() {
  type Venta = {
    cliente: string;
    producto: string;
    cantidad: number;
    precioTotal: number;
    createdAt: string;
  };

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [graficoDatos, setGraficoDatos] = useState({
    labels: [] as string[], // Inicialmente no hay etiquetas
    datasets: [
      {
        label: "Ingresos por Día",
        data: [], // Inicialmente no hay datos
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de las barras
      },
    ],
  });

  const generarReporte = async () => {
    const response = await fetch("/api/reportes/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fechaInicio, fechaFin }),
    });

    const data = await response.json();
    setVentas(data.ventas);

    // Procesar datos para el gráfico
    const ventasPorDia = data.ventas.reduce(
      (acc: Record<string, number>, venta: Venta) => {
        const fecha = new Date(venta.createdAt).toLocaleDateString();
        acc[fecha] = (acc[fecha] || 0) + venta.precioTotal;
        return acc;
      },
      {}
    );

    setGraficoDatos({
      labels: Object.keys(ventasPorDia),
      datasets: [
        {
          label: "Ingresos por Día",
          data: Object.values(ventasPorDia),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  const calcularIngresosTotales = () => {
    return ventas
      .reduce((total, venta) => total + venta.precioTotal, 0)
      .toFixed(2);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporte de Ventas por Día</h1>
      <div className="flex gap-4 mb-4">
        <Input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          placeholder="Fecha de Inicio"
        />
        <Input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          placeholder="Fecha de Fin"
        />
        <Button onClick={generarReporte}>Generar Reporte</Button>
      </div>

      {ventas.length > 0 && (
        <div>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Ingresos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta, index) => (
                <TableRow key={index}>
                  <TableCell>{venta.cliente}</TableCell>
                  <TableCell>{venta.producto}</TableCell>
                  <TableCell>
                    {new Date(venta.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{venta.cantidad}</TableCell>
                  <TableCell>S/. {venta.precioTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* Fila para el total */}
              <TableRow className="font-bold bg-gray-100">
                <TableCell colSpan={4} className="text-right">
                  Total:
                </TableCell>
                <TableCell>S/. {calcularIngresosTotales()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6">
            <Bar data={graficoDatos} />
          </div>
        </div>
      )}
    </div>
  );
}