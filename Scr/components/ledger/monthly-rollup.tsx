
"use client"

import * as React from "react"
import { Transaction } from "@/app/lib/types"
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, addMonths, isSameDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PieChart, TrendingUp, CalendarDays } from "lucide-react"

interface MonthlyRollupProps {
  transactions: Transaction[]
  onMonthChange?: (date: Date) => void
}

export function MonthlyRollup({ transactions, onMonthChange }: MonthlyRollupProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const monthlyTotal = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return transactions
      .filter(tx => isWithinInterval(new Date(tx.date), { start, end }))
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions, currentMonth])

  const todayTotal = React.useMemo(() => {
    const today = new Date()
    return transactions
      .filter(tx => isSameDay(new Date(tx.date), today))
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions])

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-headline font-bold text-xl text-primary">Financial Summary</h2>
        <div className="flex items-center bg-white rounded-lg border p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 text-sm font-semibold min-w-[120px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none bg-white shadow-md border-l-4 border-l-accent overflow-hidden group">
          <CardContent className="p-6 relative">
            <CalendarDays className="absolute -right-4 -bottom-4 h-24 w-24 text-accent opacity-5 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Today's Total</p>
            <div className="text-3xl font-headline font-bold text-accent">
              ₹{todayTotal.toLocaleString('en-IN')}
            </div>
            <p className="mt-4 text-xs text-muted-foreground font-medium">{format(new Date(), "EEEE, MMM do")}</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-primary text-primary-foreground shadow-md overflow-hidden group">
          <CardContent className="p-6 relative">
            <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Monthly Spend</p>
            <div className="text-3xl font-headline font-bold">
              ₹{monthlyTotal.toLocaleString('en-IN')}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              {format(currentMonth, "MMMM")} View
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-md overflow-hidden group">
          <CardContent className="p-6 relative">
             <PieChart className="absolute -right-4 -bottom-4 h-24 w-24 text-primary opacity-5 group-hover:rotate-12 transition-transform duration-500" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Total Entries</p>
            <div className="text-3xl font-headline font-bold text-primary">
              {transactions.filter(tx => {
                const start = startOfMonth(currentMonth)
                const end = endOfMonth(currentMonth)
                return isWithinInterval(new Date(tx.date), { start, end })
              }).length}
            </div>
            <p className="mt-4 text-xs text-muted-foreground font-medium">Logged in {format(currentMonth, "MMMM")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
