import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Obtener todas las compras
export async function GET() {
  try {
    const compras = await prisma.compras.findMany({
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return NextResponse.json(
      { error: "Error al obtener compras" },
      { status: 500 }
    );
  }
}
// Crear nueva compra
export async function POST(request: NextRequest) {
  try {
    const { producto, fecha, cantidad, costoUnidad } = await request.json();

    const costoTotal = cantidad * costoUnidad;

    // Iniciar transacción para garantizar consistencia
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Crear compra
      const nuevaCompra = await prisma.compras.create({
        data: {
          producto,
          fecha: new Date(fecha),
          cantidad,
          costoUnidad,
          costoTotal,
        },
      });

      // 2. Buscar producto existente
      const productoExistente = await prisma.producto.findFirst({
        where: { nombre: producto },
      });

      // 3. Actualizar producto
      if (productoExistente) {
        await prisma.producto.update({
          where: { id: productoExistente.id },
          data: {
            cantidad: {
              increment: cantidad, // Incrementar la cantidad
            },
            ultimaActualizacion: new Date(),
          },
        });
      } else {
        // Opcional: Crear producto si no existe
        await prisma.producto.create({
          data: {
            nombre: producto,
            cantidad: cantidad,
            unidad: "unidad", // Ajusta según tu necesidad
            ultimaActualizacion: new Date(),
          },
        });
      }

      return nuevaCompra;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error al crear compra:", error);
    return NextResponse.json(
      { error: "Error al crear compra" },
      { status: 500 }
    );
  }
}

// Actualizar compra
export async function PUT(request: NextRequest) {
  try {
    const { id, producto, fecha, cantidad, costoUnidad } = await request.json();

    const costoTotal = cantidad * costoUnidad;

    // Iniciar transacción para manejar la actualización de compra y producto
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Obtener la compra original
      const compraOriginal = await prisma.compras.findUnique({
        where: { id: parseInt(id) },
      });

      // 2. Actualizar compra
      const compraActualizada = await prisma.compras.update({
        where: { id: parseInt(id) },
        data: {
          producto,
          fecha: new Date(fecha),
          cantidad,
          costoUnidad,
          costoTotal,
        },
      });

      // 3. Buscar producto existente
      const productoExistente = await prisma.producto.findFirst({
        where: { nombre: producto },
      });

      if (productoExistente) {
        // 4. Ajustar la cantidad del producto
        // Restar la cantidad original y sumar la nueva cantidad
        await prisma.producto.update({
          where: { id: productoExistente.id },
          data: {
            cantidad: {
              increment: cantidad - (compraOriginal?.cantidad || 0),
            },
            ultimaActualizacion: new Date(),
          },
        });
      }

      return compraActualizada;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    return NextResponse.json(
      { error: "Error al actualizar compra" },
      { status: 500 }
    );
  }
}

// Eliminar compra
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Iniciar transacción para manejar la eliminación de compra y actualización de producto
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Obtener detalles de la compra a eliminar
      const compraAEliminar = await prisma.compras.findUnique({
        where: { id: parseInt(id) },
      });

      // 2. Eliminar compra
      await prisma.compras.delete({
        where: { id: parseInt(id) },
      });

      // 3. Actualizar cantidad de producto si existe
      if (compraAEliminar) {
        const productoExistente = await prisma.producto.findFirst({
          where: { nombre: compraAEliminar.producto },
        });

        if (productoExistente) {
          await prisma.producto.update({
            where: { id: productoExistente.id },
            data: {
              cantidad: {
                decrement: compraAEliminar.cantidad,
              },
              ultimaActualizacion: new Date(),
            },
          });
        }
      }

      return { message: "Compra eliminada exitosamente" };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    return NextResponse.json(
      { error: "Error al eliminar compra" },
      { status: 500 }
    );
  }
}
