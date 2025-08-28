
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { ShoppingBag, Home, Package, ShoppingCart, User as UserIcon, Settings, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
  };

  const handleLogin = () => {
    User.loginWithRedirect(window.location.href);
  };

  const isAdmin = user?.role === 'admin';
  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Premium Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                LuxStore
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to={createPageUrl("Home")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("Home") 
                    ? "text-amber-600 bg-amber-50" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to={createPageUrl("Cart")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                      isActive("Cart") 
                        ? "text-amber-600 bg-amber-50" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to={createPageUrl("Orders")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("Orders") 
                        ? "text-amber-600 bg-amber-50" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Orders</span>
                  </Link>

                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            (isActive("AdminDashboard") || isActive("AdminOrders"))
                              ? "text-amber-600 bg-amber-50" 
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}>
                           <Settings className="w-4 h-4" />
                           <span>Admin</span>
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link to={createPageUrl("AdminDashboard")} className="w-full">
                             <Settings className="w-4 h-4 mr-2" />
                             Dashboard
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to={createPageUrl("AdminOrders")} className="w-full">
                             <ClipboardList className="w-4 h-4 mr-2" />
                             Manage Orders
                           </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:block text-slate-700">{user.full_name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <UserIcon className="w-4 h-4 mr-2" />
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LuxStore</span>
              </div>
              <p className="text-slate-400">Premium e-commerce experience with luxury products and exceptional service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to={createPageUrl("Home")} className="block hover:text-amber-400 transition-colors">Home</Link>
                <Link to={createPageUrl("Cart")} className="block hover:text-amber-400 transition-colors">Cart</Link>
                <Link to={createPageUrl("Orders")} className="block hover:text-amber-400 transition-colors">Orders</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <div className="space-y-2">
                <p className="text-slate-400">24/7 Customer Support</p>
                <p className="text-slate-400">Free Shipping Over $100</p>
                <p className="text-slate-400">30-Day Returns</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LuxStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
