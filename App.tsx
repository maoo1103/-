import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './screens/Home';
import { Creator } from './screens/Creator';
import { Baking } from './screens/Baking';
import { FinalView } from './screens/FinalView';
import { AppState, CakeConfig } from './types';
import { DEFAULT_CAKE } from './constants';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [cakeConfig, setCakeConfig] = useState<CakeConfig>(DEFAULT_CAKE);

  const handleFinishCreation = (config: CakeConfig) => {
    setCakeConfig(config);
    setAppState(AppState.BAKING);
  };

  const handleBakingFinished = () => {
    setAppState(AppState.FINAL);
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {appState === AppState.HOME && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Home setAppState={setAppState} />
          </motion.div>
        )}

        {appState === AppState.CREATOR && (
          <motion.div 
             key="creator"
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
             className="w-full h-full"
          >
             <Creator onBack={() => setAppState(AppState.HOME)} onFinish={handleFinishCreation} />
          </motion.div>
        )}

        {appState === AppState.BAKING && (
           <motion.div 
              key="baking"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full"
           >
              <Baking config={cakeConfig} onFinished={handleBakingFinished} />
           </motion.div>
        )}

        {appState === AppState.FINAL && (
            <motion.div 
               key="final"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="w-full h-full"
            >
               <FinalView config={cakeConfig} onRestart={() => setAppState(AppState.HOME)} />
            </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default App;