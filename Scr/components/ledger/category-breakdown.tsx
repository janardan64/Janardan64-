"use client"

import * as React from "react"
import { Transaction } from "@/app/lib/types"
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart as PieChartIcon } from "lucide-react"

interface CategoryBreakdownProps {
  transactions: Transaction[]
  currentMonth: Date
}

export function CategoryBreakdown({ transactions, currentMonth }: CategoryBreakdownProps) {
  const data = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    
    const monthlyTxs = transactions.filter(tx => 
      isWithinInterval(new Date(tx.date), { start, end })
    )

    const categories: Record<string, number> = {}
    monthlyTxs.forEach(tx => {
      const cat = tx.category || "Other"
      categories[cat] = (categories[cat] || 0) + tx.amount
    })

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, currentMonth])

  if (data.length === 0) return null

  const chartConfig = {
    value: {
      label: "Amount",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="font-headline text-xl font-bold text-primary">Spending Analysis</CardTitle>
          <CardDescription>How you're spending your funds this month</CardDescription>
        </div>
        <PieChartIcon className="h-5 w-5 text-muted-foreground opacity-50" />
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-2">
          <ChartContainer config={chartConfig}>
            <BarChart 
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                hide 
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-value)" 
                radius={[0, 4, 4, 0]}
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-2">
          {data.map((item, idx) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: idx === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                />
                <span className="text-sm font-semibold text-muted-foreground">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-foreground">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
