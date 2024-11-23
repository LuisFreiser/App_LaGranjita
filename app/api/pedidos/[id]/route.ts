// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type Props = {
//   params: {
//     id: string;
//   };
// };

// export async function PATCH(request: NextRequest, context: Props) {
//   try {
//     const { estado } = await request.json();
//     const { id } = context.params;

//     // Actualizar el estado del pedido
//     const pedidoActualizado = await prisma.pedido.update({
//       where: { id: parseInt(id) },
//       data: { estado },
//     });

//     return NextResponse.json(pedidoActualizado, { status: 200 });
//   } catch (error) {
//     console.error("Error al actualizar el pedido:", error);
//     return NextResponse.json(
//       { error: "Error al actualizar el pedido" },
//       { status: 500 }
//     );
//   } finally {
//     // Es buena práctica desconectar el cliente de Prisma
//     await prisma.$disconnect();
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { estado } = await req.json();
    const id = params.id;

    const pedidoActualizado = await prisma.pedido.update({
      where: {
        id: parseInt(id),
      },
      data: { estado },
    });

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
