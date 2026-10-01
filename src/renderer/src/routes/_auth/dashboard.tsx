import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  SignOut,
  Storefront,
  Receipt,
  ShoppingCart,
  CreditCard,
  Package,
  Money,
  User,
  MagnifyingGlass,
  CheckCircle,
  Trash
} from '@phosphor-icons/react'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage
})

interface PosItem {
  id: string
  name: string
  category: string
  price: number
  sku: string
  stock: number
}

interface CartItem extends PosItem {
  qty: number
}

const SAMPLE_CATALOG: PosItem[] = [
  { id: '1', name: 'Double Espresso', category: 'Beverage', price: 4.5, sku: 'COF-01', stock: 48 },
  { id: '2', name: 'Oat Milk Flat White', category: 'Beverage', price: 5.75, sku: 'COF-02', stock: 32 },
  { id: '3', name: 'Almond Croissant', category: 'Bakery', price: 4.25, sku: 'BAK-04', stock: 14 },
  { id: '4', name: 'Avocado Tartine', category: 'Kitchen', price: 12.5, sku: 'KT-12', stock: 9 },
  { id: '5', name: 'Matcha Iced Latte', category: 'Beverage', price: 6.2, sku: 'BEV-08', stock: 26 },
  { id: '6', name: 'Sourdough Loaf', category: 'Bakery', price: 8.0, sku: 'BAK-01', stock: 6 },
  { id: '7', name: 'Cold Brew 16oz', category: 'Beverage', price: 5.0, sku: 'COF-07', stock: 41 },
  { id: '8', name: 'Smoked Salmon Bagel', category: 'Kitchen', price: 13.5, sku: 'KT-03', stock: 11 }
]

function DashboardPage(): React.JSX.Element {
  const { auth } = Route.useRouteContext()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'register' | 'orders' | 'inventory'>('register')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cart, setCart] = useState<CartItem[]>([
    { id: '2', name: 'Oat Milk Flat White', category: 'Beverage', price: 5.75, sku: 'COF-02', stock: 32, qty: 2 },
    { id: '3', name: 'Almond Croissant', category: 'Bakery', price: 4.25, sku: 'BAK-04', stock: 14, qty: 1 }
  ])
  const [isSuccessPaid, setIsSuccessPaid] = useState<boolean>(false)

  const handleSignOut = async (): Promise<void> => {
    await auth.signOut()
    navigate({ to: '/login' })
  }

  const addToCart = (item: PosItem): void => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id: string, delta: number): void => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta
            return nextQty > 0 ? { ...item, qty: nextQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = (): void => {
    setCart([])
  }

  const handleCompleteSale = (): void => {
    if (cart.length === 0) return
    setIsSuccessPaid(true)
    setTimeout(() => {
      setCart([])
      setIsSuccessPaid(false)
    }, 1800)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const tax = subtotal * 0.0825
  const total = subtotal + tax

  const filteredItems = SAMPLE_CATALOG.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex h-screen w-screen bg-[#181818] overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1F1F1F] border-r border-[#272727] flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Workstation Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-10 w-10 rounded-xl bg-[#272727] border border-[#313131] flex items-center justify-center text-white">
              <Storefront size={22} weight="bold" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">Kora POS</div>
              <div className="text-xs text-[#9B9B9B]">Station 01 · Active</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('register')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'register'
                  ? 'bg-[#272727] text-white shadow-sm'
                  : 'text-[#9B9B9B] hover:text-white hover:bg-[#272727]/50'
              }`}
            >
              <ShoppingCart size={18} weight={activeTab === 'register' ? 'fill' : 'regular'} />
              <span>Register & POS</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'orders'
                  ? 'bg-[#272727] text-white shadow-sm'
                  : 'text-[#9B9B9B] hover:text-white hover:bg-[#272727]/50'
              }`}
            >
              <Receipt size={18} weight={activeTab === 'orders' ? 'fill' : 'regular'} />
              <span>Shift Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'inventory'
                  ? 'bg-[#272727] text-white shadow-sm'
                  : 'text-[#9B9B9B] hover:text-white hover:bg-[#272727]/50'
              }`}
            >
              <Package size={18} weight={activeTab === 'inventory' ? 'fill' : 'regular'} />
              <span>Stock & Inventory</span>
            </button>
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="pt-4 border-t border-[#272727] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-lg bg-[#272727] border border-[#313131] flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {auth.user?.name || 'Cashier'}
              </div>
              <div className="text-xs text-[#9B9B9B] truncate font-mono">
                {auth.user?.email || 'operator@terminal'}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#272727] hover:bg-[#313131] text-rose-300 border border-[#313131] text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <SignOut size={16} />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Metrics Bar */}
        <header className="h-16 bg-[#1F1F1F] border-b border-[#272727] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-[#9B9B9B]">Daily Net Sales</div>
              <div className="text-base font-semibold text-white font-mono">$14,892.40</div>
            </div>
            <div className="h-8 w-px bg-[#272727]" />
            <div>
              <div className="text-xs text-[#9B9B9B]">Completed Orders</div>
              <div className="text-base font-semibold text-white font-mono">184 transactions</div>
            </div>
            <div className="h-8 w-px bg-[#272727]" />
            <div>
              <div className="text-xs text-[#9B9B9B]">Drawer Balance</div>
              <div className="text-base font-semibold text-white font-mono">$1,250.00</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#272727] text-xs text-emerald-400 border border-[#313131]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Terminal Online</span>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'register' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Catalog Area */}
              <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4">
                {/* Search and Category Filter */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9B9B9B]">
                      <MagnifyingGlass size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search items by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1F1F1F] border border-[#272727] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#9B9B9B]"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-1 bg-[#1F1F1F] p-1 rounded-xl border border-[#272727]">
                    {['All', 'Beverage', 'Bakery', 'Kitchen'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          selectedCategory === cat
                            ? 'bg-[#272727] text-white'
                            : 'text-[#9B9B9B] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="text-left p-4 rounded-xl bg-[#1F1F1F] border border-[#272727] hover:border-[#313131] hover:bg-[#272727]/60 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-between h-32 group"
                    >
                      <div>
                        <div className="text-xs font-mono text-[#9B9B9B]">{item.sku}</div>
                        <div className="text-sm font-semibold text-white mt-1 group-hover:text-amber-200 transition-colors">
                          {item.name}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#272727]">
                        <span className="text-sm font-mono font-semibold text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#9B9B9B]">{item.stock} in stock</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Order Ticket Area */}
              <div className="w-96 bg-[#1F1F1F] border-l border-[#272727] flex flex-col justify-between p-6 shrink-0">
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between pb-3 border-b border-[#272727]">
                    <div className="flex items-center gap-2">
                      <Receipt size={18} className="text-white" />
                      <span className="text-sm font-semibold text-white">Active Ticket</span>
                    </div>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash size={14} />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {cart.length === 0 ? (
                      <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                        <ShoppingCart size={32} className="text-[#6B7280] mb-2" />
                        <div className="text-sm font-medium text-[#9B9B9B]">No items selected</div>
                        <div className="text-xs text-[#6B7280] mt-1">
                          Click catalog items to add them to this sale ticket.
                        </div>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#272727] border border-[#313131]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                            <div className="text-xs text-[#9B9B9B] font-mono">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-3">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="h-6 w-6 rounded bg-[#1F1F1F] text-[#9B9B9B] hover:text-white flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="h-6 w-6 rounded bg-[#1F1F1F] text-[#9B9B9B] hover:text-white flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                            <div className="font-mono text-xs font-semibold text-white ml-2 w-12 text-right">
                              ${(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Totals & Charge Actions */}
                <div className="pt-4 border-t border-[#272727] space-y-3">
                  <div className="space-y-1.5 text-xs text-[#9B9B9B]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.25%)</span>
                      <span className="font-mono text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#272727]">
                      <span>Total Due</span>
                      <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {isSuccessPaid ? (
                    <div className="py-3 px-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
                      <CheckCircle size={18} weight="fill" />
                      <span>Sale finalized · Receipt sent</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        disabled={cart.length === 0}
                        onClick={handleCompleteSale}
                        className="py-2 px-3 rounded-xl bg-[#272727] hover:bg-[#313131] border border-[#313131] text-white text-sm font-semibold active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center gap-1.5 disabled:opacity-40"
                      >
                        <Money size={16} />
                        <span>Cash</span>
                      </button>

                      <button
                        disabled={cart.length === 0}
                        onClick={handleCompleteSale}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-[#EDEDED] text-black text-sm font-semibold active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center gap-1.5 disabled:opacity-40"
                      >
                        <CreditCard size={16} />
                        <span>Charge Card</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Shift Transactions</h2>
                <p className="text-xs text-[#9B9B9B] mt-1">Audit log of sales processed on this workstation</p>
              </div>

              <div className="rounded-xl border border-[#272727] bg-[#1F1F1F] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#272727] text-[#9B9B9B] border-b border-[#313131]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Cashier</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#272727] text-white font-mono">
                    <tr className="hover:bg-[#272727]/40">
                      <td className="p-3 font-semibold">#TXN-8924</td>
                      <td className="p-3 text-[#9B9B9B]">14:22:04</td>
                      <td className="p-3 font-sans">{auth.user?.name || 'Elena Vance'}</td>
                      <td className="p-3 font-sans">Credit Card</td>
                      <td className="p-3 text-right text-emerald-400">$34.50</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#272727]/40">
                      <td className="p-3 font-semibold">#TXN-8923</td>
                      <td className="p-3 text-[#9B9B9B]">14:18:51</td>
                      <td className="p-3 font-sans">{auth.user?.name || 'Elena Vance'}</td>
                      <td className="p-3 font-sans">Cash</td>
                      <td className="p-3 text-right text-emerald-400">$18.25</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#272727]/40">
                      <td className="p-3 font-semibold">#TXN-8922</td>
                      <td className="p-3 text-[#9B9B9B]">14:02:18</td>
                      <td className="p-3 font-sans">{auth.user?.name || 'Elena Vance'}</td>
                      <td className="p-3 font-sans">Apple Pay</td>
                      <td className="p-3 text-right text-emerald-400">$22.00</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Stock Level Monitoring</h2>
                <p className="text-xs text-[#9B9B9B] mt-1">Real-time local catalog quantities and alert flags</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#272727]">
                  <div className="text-xs text-[#9B9B9B]">Total Catalog SKUs</div>
                  <div className="text-2xl font-semibold text-white font-mono mt-1">42 items</div>
                </div>
                <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#272727]">
                  <div className="text-xs text-[#9B9B9B]">Low Stock Warnings</div>
                  <div className="text-2xl font-semibold text-amber-400 font-mono mt-1">2 items</div>
                </div>
                <div className="p-4 rounded-xl bg-[#1F1F1F] border border-[#272727]">
                  <div className="text-xs text-[#9B9B9B]">Catalog Sync Engine</div>
                  <div className="text-sm font-semibold text-white mt-1">Local SQLite Mirror</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#272727] bg-[#1F1F1F] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#272727] text-[#9B9B9B] border-b border-[#313131]">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">In Stock</th>
                      <th className="p-3 text-center">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#272727] text-white">
                    {SAMPLE_CATALOG.map((item) => (
                      <tr key={item.id} className="hover:bg-[#272727]/40">
                        <td className="p-3 font-mono">{item.sku}</td>
                        <td className="p-3 font-semibold">{item.name}</td>
                        <td className="p-3 text-[#9B9B9B]">{item.category}</td>
                        <td className="p-3 text-right font-mono">${item.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono">{item.stock}</td>
                        <td className="p-3 text-center">
                          {item.stock < 10 ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                              Low
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                              Optimal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
