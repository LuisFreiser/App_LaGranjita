"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Bell, User } from "lucide-react";
import { ToggleTheme } from "./toggle-theme";
import Image from "next/image";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sidebar fijo para escritorio */}
      <aside className="fixed top-0 left-0 z-50 hidden md:flex md:flex-col md:w-64 bg-white h-screen border-r shadow-sm dark:bg-gray-900">
        {/* Logo */}
        <div className="p-4 border-b">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            priority
            className="w-40 h-40 mx-auto"
          />
          {/* <h1 className="text-2xl text font-bold">La Granjita</h1> */}
        </div>

        {/* Menú */}
        <nav className="flex-1 p-4 space-y-6">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/productos"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>📦</span>
            <span>Productos</span>
          </Link>
          <Link
            href="/pedidos"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>👨🏼‍🤝‍👨🏻</span>
            <span>Ventas</span>
          </Link>
          <Link
            href="/compras"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>🛒</span>
            <span>Compras</span>
          </Link>
          <Link
            href="/reportes/ventas"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>📈</span>
            <span>Reportes</span>
          </Link>
          <Link
            href="/ajustes"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>🔧</span>
            <span>Ajustes</span>
          </Link>
        </nav>

        {/* Botón de modo oscuro */}
        <div className="p-4 border-t ">
          <Button variant="outline" className="w-full">
            <span>🔧</span>
            <span>Configuración</span>
          </Button>
        </div>
      </aside>

      {/* Navbar superior */}
      <nav className="fixed top-0 left-0 right-0 z-60 bg-white dark:bg-gray-900 border-b shadow-sm h-20 md:h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/Granjita.svg"
            alt="Logo"
            width={56}
            height={56}
            priority
          />
          <h1 className="text-xl font-bold">La Granjita</h1>
        </div>

        <div className="hidden md:flex items-center space-x-2 ">
          {/* Botón de Modo Oscuro */}
          <ToggleTheme />

          {/* Botón de Alertas */}
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Botón de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Botón de menú para móviles */}

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" aria-label="Abrir menú lateral">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-52">
              <SheetHeader>
                <SheetTitle className=" pb-3 text-2xl border-b font-bold">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      priority
                      className="w-24 h-24 mx-auto"
                    />
                    {/* La Granjita */}
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 space-y-6">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">📊</span>
                    Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/productos"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">📦</span>
                    Productos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/pedidos"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">👨🏼‍🤝‍👨🏻</span>
                    Ventas
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/compras"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">🛒</span>
                    Compras
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/reportes/ventas"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">📈</span>
                    Reportes
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/ajustes"
                    className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                  >
                    <span className="mr-1">🔧</span>
                    Ajustes
                  </Link>
                </SheetClose>
              </nav>
              <div className="p-4 mt-10 border-t">
                <ToggleTheme />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
