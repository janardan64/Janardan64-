"use client"

import * as React from "react"
import { LayoutDashboard, Plus, History } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewType = "dashboard" | "add" | "history"

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-muted/20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-[2.5rem]">
      <div className="max-w-2xl mx-auto px-10 h-24 flex items-center justify-between">
        <button 
          onClick={() => onViewChange("dashboard")}
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all flex-1",
            currentView === "dashboard" ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-colors",
            currentView === "dashboard" ? "bg-primary/10" : ""
          )}>
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Stats</span>
        </button>

        <div className="relative -top-8 flex-shrink-0 px-6">
          <button 
            onClick={() => onViewChange("add")}
            className={cn(
              "h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all active:scale-90 border-[6px] border-background",
              currentView === "add" 
                ? "bg-accent text-white rotate-45 scale-110 shadow-accent/40" 
                : "bg-primary text-white shadow-primary/40"
            )}
          >
            <Plus className="h-10 w-10" />
          </button>
        </div>

        <button 
          onClick={() => onViewChange("history")}
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all flex-1",
            currentView === "history" ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-colors",
            currentView === "history" ? "bg-primary/10" : ""
          )}>
            <History className="h-6 w-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Log</span>
        </button>
      </div>
    </nav>
  )
}
