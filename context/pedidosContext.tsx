"use client";
import React, { createContext, useContext, useState } from "react";

type Pedido = {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  estado: string;
};

type PedidosContextType = {
  pedidos: Pedido[];
  agregarPedido: (pedido: Omit<Pedido, "id">) => void;
};

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const PedidosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const agregarPedido = (pedido: Omit<Pedido, "id">) => {
    const nuevoPedido = { ...pedido, id: pedidos.length + 1 };
    setPedidos([...pedidos, nuevoPedido]);
  };

  return (
    <PedidosContext.Provider value={{ pedidos, agregarPedido }}>
      {children}
    </PedidosContext.Provider>
  );
};

export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error("usePedidos debe ser usado dentro de un PedidosProvider");
  }
  return context;
};
