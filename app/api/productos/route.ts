import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();

  const { nombre, cantidad, unidad, ultimaActualizacion } = body;

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        cantidad,
        unidad,
        ultimaActualizacion: new Date(ultimaActualizacion),
      },
    });
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
