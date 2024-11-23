import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { estado } = await request.json();

    // Actualizar el estado del pedido
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: Number(id) },
      data: { estado },
    });

    return NextResponse.json(pedidoActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
