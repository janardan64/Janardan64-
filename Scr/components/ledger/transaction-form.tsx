
"use client"

import * as React from "react"
import { Plus, IndianRupee, Calendar as CalendarIcon, Loader2, Sparkles, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { aiExpenseCategorization } from "@/ai/flows/ai-expense-categorization"
import { Transaction } from "@/app/lib/types"

interface TransactionFormProps {
  onAdd: (tx: Omit<Transaction, "id">) => void
  onAddComplete?: () => void
}

const COMMON_CATEGORIES = [
  "Vegetables", "Petrol", "Personal Mobile", "Groceries", "Food & Drinks", 
  "Transport", "Utilities", "Entertainment", "Shopping", "Rent", 
  "Healthcare", "Salary", "Other"
]

export function TransactionForm({ onAdd, onAddComplete }: TransactionFormProps) {
  const [amount, setAmount] = React.useState<string>("")
  const [note, setNote] = React.useState<string>("")
  const [category, setCategory] = React.useState<string>("Other")
  const [date, setDate] = React.useState<Date | null>(null)
  const [isCategorizing, setIsCategorizing] = React.useState(false)
  const [isAutoUpdate, setIsAutoUpdate] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!date) setDate(new Date())
    const interval = setInterval(() => {
      if (isAutoUpdate) setDate(new Date())
    }, 10000)
    return () => clearInterval(interval)
  }, [isAutoUpdate, date])

  const handleAutoCategorize = async () => {
    if (!note.trim()) return
    setIsCategorizing(true)
    try {
      const result = await aiExpenseCategorization({ description: note })
      if (result.category) setCategory(result.category)
    } catch (error) {
      console.error(error)
    } finally {
      setIsCategorizing(false)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    const now = new Date()
    if (isSameDay(selectedDate, now)) {
      setDate(now)
      setIsAutoUpdate(true)
    } else {
      setDate(selectedDate)
      setIsAutoUpdate(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(parseFloat(amount)) || !date) return

    setIsSubmitting(true)
    onAdd({
      amount: parseFloat(amount),
      note: note.trim() || "No description",
      date: date.toISOString(),
      category
    })
    
    setAmount("")
    setNote("")
    setCategory("Other")
    setDate(new Date())
    setIsAutoUpdate(true)
    setIsSubmitting(false)
    onAddComplete?.()
  }

  return (
    <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
      <CardHeader className="bg-primary text-primary-foreground pb-10 pt-8">
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-2xl font-bold tracking-tight">Add Expense</CardTitle>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <IndianRupee className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Amount</p>
          <div className={cn(
            "text-5xl font-headline font-bold transition-all duration-300",
            amount ? "running-total-pulse text-white" : "text-primary-foreground/30"
          )}>
            ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : "0"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Value</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-14 text-xl font-bold rounded-2xl bg-muted/30 border-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Description</label>
            <div className="flex gap-3">
              <Input
                placeholder="e.g. Coffee, Grocery"
                className="h-14 rounded-2xl bg-muted/30 border-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 shrink-0 rounded-2xl"
                onClick={handleAutoCategorize}
                disabled={!note.trim() || isCategorizing}
              >
                {isCategorizing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {COMMON_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-14 rounded-2xl bg-muted/30 border-none text-left font-medium">
                    <CalendarIcon className="mr-3 h-4 w-4 text-accent" />
                    {date ? format(date, isAutoUpdate ? "MMM d, h:mm a" : "PPP") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-3xl" align="start">
                  <Calendar mode="single" selected={date || undefined} onSelect={handleDateSelect} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button type="submit" className="w-full h-16 text-xl font-headline font-bold rounded-2xl mt-4" disabled={!amount || isSubmitting}>
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="mr-3 h-6 w-6" />}
            Save Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
