import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fechaInicio, fechaFin } = body;

    //Consultando la base de datos para buscar en la tabla pedidos
    const ventas = await prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: new Date(fechaInicio), //Gte = Mayor o igual
          lte: new Date(fechaFin), //Lte = Menor o igual
        },
        estado: "Entregado", // Filtra por estado "Entregado"
      },
      orderBy: {
        createdAt: "asc", // Ordena por fecha en orden ascendente
      },
      //Especifica qué campos incluir en la respuesta
      select: {
        cliente: true,
        producto: true,
        cantidad: true,
        precioTotal: true,
        createdAt: true,
      },
    });
    //Devuelve los datos ventas en formato JSON como respuesta.
    return NextResponse.json({ ventas });
    //Catch Captura cualquier error que ocurra en el bloque try
  } catch (error) {
    console.error("Error fetching ventas:", error);
    return NextResponse.json(
      { error: "Error fetching ventas" },
      { status: 500 }
    );
  }
}
