"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sidebar fijo para escritorio */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white h-screen border-r shadow-sm fixed">
        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">La Granjita</h1>
        </div>

        {/* Menú */}
        <nav className="flex-1 p-4 space-y-6">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/productos"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>🛒</span>
            <span>Productos</span>
          </Link>
          <Link
            href="/pedidos"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>📦</span>
            <span>Pedidos</span>
          </Link>
          <Link
            href="/clientes"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>👨🏼‍🤝‍👨🏻</span>
            <span>Clientes</span>
          </Link>
          <Link
            href="/reportes"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>📈</span>
            <span>Reportes</span>
          </Link>
          <Link
            href="/ajustes"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>🔧</span>
            <span>Ajustes</span>
          </Link>
        </nav>

        {/* Botón de modo oscuro */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
          >
            Cambiar Modo 🌙
          </Button>
        </div>
      </aside>

      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4 border-b flex items-center justify-between bg-white">
        {/* Logo siempre visible */}
        <h1 className="text-2xl font-bold">La Granjita</h1>

        {/* Botón para abrir el menú */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" aria-label="Abrir menú lateral">
              ☰
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                La Granjita
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 space-y-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Dashboard
              </Link>
              <Link
                href="/productos"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Productos
              </Link>
              <Link
                href="/pedidos"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Pedidos
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
