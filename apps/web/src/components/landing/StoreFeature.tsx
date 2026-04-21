import { ShoppingBag, Timer, TrendingUp, Store } from "lucide-react";
import { Link } from "react-router-dom";

export const StoreFeature = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 text-amber-700 text-sm font-bold border border-amber-200 mb-6">
              <ShoppingBag size={16} />
              <span>NEW VERTICAL</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
              Introducing <span className="text-amber-500">HZLR.store</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We've expanded beyond gig labor. HZLR.store is a lightning-fast quick-commerce platform empowering local merchants, satisfying everyday customer needs, and giving our workers a new way to earn through hyper-local delivery.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                {
                  icon: Store,
                  title: "For Local Merchants",
                  description: "Bring your store online instantly without complex IT. Synced pricing, live queues, and automatic dispatch.",
                },
                {
                  icon: Timer,
                  title: "For Customers",
                  description: "Order anything from nearby stores and get it delivered in 15-30 minutes through our reliable gig-dispatch engine.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/store" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-amber-500/25">
                 Shop on HZLR.store
               </Link>
               <Link to="/signup?mode=merchant" className="bg-white hover:bg-amber-50 text-amber-700 font-bold py-3.5 px-8 rounded-xl flex items-center justify-center transition-all border border-amber-200">
                 Join as a Merchant
               </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-xl" />
            <div className="relative bg-white rounded-[2rem] border border-amber-100 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8 text-center ring-1 ring-black/5">
                <div className="space-y-6 max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 relative">
                        <ShoppingBag size={40} />
                        <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-foreground">Hyperlocal Delivery</h4>
                      <p className="text-sm text-muted-foreground mt-2">Our existing army of verified gig-workers handle the last-mile logistics, ensuring store-to-door delivery within record times.</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-xl p-4 text-left border">
                        <div className="flex justify-between text-xs font-bold mb-2">
                           <span className="text-muted-foreground">Order #8921</span>
                           <span className="text-amber-500">Out for delivery</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                           <div className="h-full bg-amber-500 w-[70%]" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
