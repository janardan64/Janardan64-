
"use client"

import * as React from "react"
import { TransactionForm } from "@/components/ledger/transaction-form"
import { TransactionList } from "@/components/ledger/transaction-list"
import { MonthlyRollup } from "@/components/ledger/monthly-rollup"
import { CategoryBreakdown } from "@/components/ledger/category-breakdown"
import { Navigation, ViewType } from "@/components/ledger/navigation"
import { Transaction } from "@/app/lib/types"
import { Wallet, Sparkles } from "lucide-react"
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns"

export default function LedgeLogDashboard() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [viewMonth, setViewMonth] = React.useState(new Date())
  const [currentView, setCurrentView] = React.useState<ViewType>("dashboard")
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load from LocalStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("ledgelog_transactions")
    if (saved) {
      try {
        setTransactions(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load data", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to LocalStorage
  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    const txWithId = { ...newTx, id: crypto.randomUUID() }
    const updated = [txWithId, ...transactions]
    setTransactions(updated)
    localStorage.setItem("ledgelog_transactions", JSON.stringify(updated))
  }

  const filteredTransactions = React.useMemo(() => {
    const start = startOfMonth(viewMonth)
    const end = endOfMonth(viewMonth)
    return transactions.filter(tx => 
      tx.date && isWithinInterval(new Date(tx.date), { start, end })
    )
  }, [transactions, viewMonth])

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="bg-primary p-4 rounded-2xl shadow-xl animate-pulse">
          <Wallet className="h-10 w-10 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 min-h-screen relative pb-32">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary leading-tight">LedgeLog</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] flex items-center gap-1">
              <Sparkles className="h-2 w-2 text-accent" /> Offline Local Ledger
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {currentView === "dashboard" && (
          <div className="space-y-10 animate-fade-in">
            <MonthlyRollup 
              transactions={transactions} 
              onMonthChange={setViewMonth} 
            />
            <CategoryBreakdown 
              transactions={transactions} 
              currentMonth={viewMonth} 
            />
          </div>
        )}

        {currentView === "add" && (
          <div className="animate-fade-in">
            <TransactionForm onAdd={handleAddTransaction} onAddComplete={() => setCurrentView("dashboard")} />
          </div>
        )}

        {currentView === "history" && (
          <div className="animate-fade-in">
            <TransactionList transactions={filteredTransactions} />
          </div>
        )}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <footer className="mt-16 text-center py-8 border-t border-muted/30 text-muted-foreground">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Privacy-First Local Storage</p>
        <p className="text-[10px] mt-2 opacity-30">© {new Date().getFullYear()} LedgeLog</p>
      </footer>
    </div>
  )
}
