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
  SheetClose,
} from "@/components/ui/sheet";
import { ToggleTheme } from "./toggle-theme";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sidebar fijo para escritorio */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white h-screen border-r shadow-sm fixed dark:bg-gray-900">
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
            <span>🛒</span>
            <span>Productos</span>
          </Link>
          <Link
            href="/pedidos"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>📦</span>
            <span>Pedidos</span>
          </Link>
          <Link
            href="/clientes"
            className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 dark:text-white dark:hover:text-gray-400"
          >
            <span>👨🏼‍🤝‍👨🏻</span>
            <span>Clientes</span>
          </Link>
          <Link
            href="/reportes"
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
        <div className="p-4 border-t">
          {/* <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
          >
            Cambiar Modo 🌙
          </Button> */}
          <ToggleTheme />
        </div>
      </aside>

      {/* Botón de menú para móviles */}
      <div className="md:hidden p-4 border-b flex items-center justify-between">
        {/* Logo siempre visible */}
        <div className="flex items-center gap-2">
          <Image
            src="/Granjita.svg"
            alt="Logo"
            width={56}
            height={56}
            priority
            // className="w-9 h-9"
          />
          <h1 className="text-2xl font-bold">La Granjita</h1>
        </div>

        {/* Botón para abrir el menú */}
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
                  <span className="mr-1">🛒</span>
                  Productos
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/pedidos"
                  className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                >
                  <span className="mr-1">📦</span>
                  Pedidos
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/clientes"
                  className="text-gray-700 hover:text-gray-900 block dark:text-white dark:hover:text-gray-400"
                >
                  <span className="mr-1">👨🏼‍🤝‍👨🏻</span>
                  Clientes
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/reportes"
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
              <ToggleTheme className="sr-only" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
