import { ShoppingBag, Timer, TrendingUp, Store, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const StoreShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-amber-500 to-orange-600 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-50" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-black tracking-widest uppercase mb-6 shadow-xl shadow-white/5">
              <Zap size={16} className="text-yellow-300" />
              <span>HZLR.store Live</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6 drop-shadow-md">
              Anything.<br />
              <span className="text-yellow-300">In 15 Minutes.</span>
            </h2>
            
            <p className="text-lg text-white/90 mb-10 leading-relaxed font-medium max-w-lg">
              We've evolved. HZLR.store is our new A-tier quick-commerce engine. By syncing the deepest local merchant inventory with our massive army of gig workers, we've cracked the code for instant delivery.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                {
                  icon: Store,
                  title: "Local Merchants",
                  description: "Scale your business online. Live inventory sync, 0% listing fee, automatic gig-dispatch.",
                },
                {
                  icon: Timer,
                  title: "Hyperlocal Magic",
                  description: "Groceries? Meds? Food? Get it faster than you can drive there. Powered by HZLR Gig.",
                },
              ].map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-orange-500 flex items-center justify-center mb-4">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="font-black mb-2 tracking-wide">{feature.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/store" className="bg-white hover:bg-yellow-50 text-orange-600 font-black py-4 px-8 rounded-2xl flex items-center justify-center transition-all shadow-2xl shadow-yellow-900/20 group">
                 Shop Now <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link to="/signup?mode=merchant" className="bg-orange-700/50 hover:bg-orange-700/70 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center transition-all border border-orange-400/30 backdrop-blur-md">
                 Partner as a Store
               </Link>
            </div>
          </motion.div>
          
          {/* Right Content - Interactive Phone Mockup */}
          <motion.div 
             initial={{ opacity: 0, y: 50, rotate: 5 }}
             whileInView={{ opacity: 1, y: 0, rotate: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, type: "spring" }}
             className="relative mx-auto w-full max-w-sm"
          >
            {/* Phone Frame */}
            <div className="relative bg-white rounded-[3rem] border-[8px] border-orange-200/50 shadow-2xl overflow-hidden aspect-[9/19] flex flex-col p-6 items-center ring-4 ring-white/20">
                
                {/* Status Bar */}
                <div className="w-24 h-6 bg-orange-100/50 rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2" />

                <div className="w-full mt-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-black text-orange-500 tracking-wider">Delivering to</p>
                            <p className="text-xs font-black text-slate-800 flex items-center gap-1">Home <ChevronRight size={12}/></p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <ShoppingBag size={14} className="text-slate-600" />
                        </div>
                    </div>

                    {/* Banner */}
                    <motion.div 
                        animate={{ scale: [1, 1.02, 1] }} 
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-white shadow-lg"
                    >
                        <h4 className="font-black italic text-lg leading-tight uppercase">50% OFF</h4>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Late Night Munchies</p>
                    </motion.div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {['🍎', '🍞', '🥩', '💊', '🍫', '🍦', '🥤', '🔋'].map((emoji, i) => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                                {emoji}
                            </div>
                        ))}
                    </div>

                    {/* Live Order Tracker Mock */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-orange-50 rounded-2xl p-4 border border-orange-200 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-50" />
                        <div className="flex justify-between items-center mb-3 text-xs font-black">
                           <span className="text-slate-800 flex items-center gap-1.5"><Timer size={14} className="text-orange-500" /> Arriving in</span>
                           <span className="text-orange-600 text-base">08:42</span>
                        </div>
                        <div className="h-1.5 bg-orange-200/50 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: "0%" }}
                             animate={{ width: "70%" }}
                             transition={{ duration: 2, ease: "easeOut" }}
                             className="h-full bg-orange-500" 
                           />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aman is picking up your order...</p>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Floating Elements */}
            <motion.div 
               animate={{ y: [-10, 10, -10] }} 
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="absolute -right-12 top-20 bg-white p-3 rounded-2xl shadow-2xl border border-orange-100 flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <TrendingUp size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Revenue</p>
                   <p className="font-black text-slate-800 tracking-tight">₹45,200 <span className="text-green-500 text-xs">Today</span></p>
                </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
