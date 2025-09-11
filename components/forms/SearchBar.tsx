'use client'

import { useState, useCallback, useTransition, memo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CheckStatus } from '@/types/database'
import { cn } from '@/lib/utils/tailwind'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
  onFilterChange?: (filters: CheckStatus[]) => void
  className?: string
}

export const SearchBar = memo(function SearchBar({ 
  placeholder = "商品名で検索...", 
  onSearch,
  onFilterChange,
  className 
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [filters, setFilters] = useState<CheckStatus[]>([])
  const [, startTransition] = useTransition()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // 状態更新を非同期で実行
    startTransition(() => {
      onSearch?.(newValue)
    })
  }, [onSearch])

  const handleClear = useCallback(() => {
    setValue('')
    onSearch?.('')
  }, [onSearch])

  const toggleFilter = useCallback((status: CheckStatus) => {
    const newFilters = filters.includes(status)
      ? filters.filter(f => f !== status)
      : [...filters, status]
    setFilters(newFilters)
    
    startTransition(() => {
      onFilterChange?.(newFilters)
    })
  }, [filters, onFilterChange])

  const clearFilters = useCallback(() => {
    setFilters([])
    startTransition(() => {
      onFilterChange?.([])
    })
  }, [onFilterChange])

  return (
    <div className={cn("relative w-full flex gap-2", className)}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          id="search-input"
          name="search"
          value={value}
          onChange={handleChange}
          className="pl-10 pr-10 h-11"
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 h-full px-3 py-0 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-11 w-11 relative">
            <Filter className="h-4 w-4" />
            {filters.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-3">
            <div className="font-medium text-sm">アラートでフィルター</div>
            <div className="space-y-2">
              <label htmlFor="filter-yellow" className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="filter-yellow"
                  name="statusFilter"
                  value="YELLOW"
                  checked={filters.includes('YELLOW')}
                  onChange={() => toggleFilter('YELLOW')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">警告</span>
              </label>
              <label htmlFor="filter-red" className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="filter-red"
                  name="statusFilter"
                  value="RED"
                  checked={filters.includes('RED')}
                  onChange={() => toggleFilter('RED')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">危険</span>
              </label>
            </div>
            {filters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full text-xs"
              >
                フィルターをクリア
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})
