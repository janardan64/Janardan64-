"use client"

import { Transaction } from "@/app/lib/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Tag, Calendar as CalendarIcon, ArrowUpRight, Clock } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 animate-fade-in">
        <div className="bg-muted p-4 rounded-full">
          <ShoppingBag className="h-8 w-8 opacity-20" />
        </div>
        <p className="font-medium">Your ledger is empty for this period.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
          Recent Activity
        </h3>
        <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-70">
          {transactions.length} Total
        </Badge>
      </div>
      <div className="grid gap-3">
        {transactions.map((tx, i) => (
          <div 
            key={tx.id} 
            className="group flex items-center justify-between p-4 bg-white rounded-xl border border-transparent hover:border-accent/20 hover:shadow-sm transition-all animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
                <Tag className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {tx.note}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                    <CalendarIcon className="h-3 w-3" />
                    {format(new Date(tx.date), "MMM d")}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {format(new Date(tx.date), "h:mm a")}
                  </span>
                  {tx.category && (
                    <Badge 
                      variant="secondary" 
                      className="text-[9px] py-0 px-2 h-4 font-bold uppercase tracking-widest bg-accent/10 text-accent border-none"
                    >
                      {tx.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="flex items-center justify-end text-lg font-headline font-bold text-foreground">
                <span className="text-muted-foreground text-sm font-normal mr-0.5">₹</span>
                {tx.amount.toLocaleString('en-IN')}
                <ArrowUpRight className="h-4 w-4 ml-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
