"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { NavModule as NavModuleType } from "@/types";
import { NavPage } from "./NavPage";

interface NavModuleProps {
  module: NavModuleType;
}

export function NavModule({ module }: NavModuleProps) {
  const [expanded, setExpanded] = useState(module.expanded ?? false);
  const Icon = module.icon;

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span>{module.label}</span>
        </span>
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="ml-4 overflow-hidden border-l border-sidebar-border pl-3"
          >
            <div className="mt-0.5 flex flex-col gap-0.5">
              {module.pages.map((page) => (
                <NavPage key={page.href} page={page} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
