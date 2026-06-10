import React, { useState, useEffect } from 'react';

export default function App() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');

  // תיקון ה-Progress Bar: שימוש ב-Mock לעדכון ההתקדמות מכיוון שה-Backend עדיין בפיתוח
  useEffect(() => {
    let interval;
    
    if (isDeploying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          
          // סימולציה של השלבים בארכיטקטורה (Terraform -> Ansible וכו')
          if (newProgress === 10) setStatus('Generating Job ID...');
          if (newProgress === 30) setStatus('Provisioning VMs on OCI with Terraform...');
          if (newProgress === 60) setStatus('Bootstrapping Vanilla K8s with Ansible...');
          
          if (newProgress >= 100) {
            setStatus('Cluster Deployed Successfully!');
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 600); // ניתן לשנות את מהירות התקדמות הבר כאן
    }
    
    // ניקוי הלולאה מונע מהאפליקציה להיתקע
    return () => clearInterval(interval);
  }, [isDeploying, progress]);

  const handleDeployClick = () => {
    setIsDeploying(true);
    setProgress(0);
    setStatus('API Handshake initiated...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-400">CliXLuster</h1>
        <p className="text-xl text-gray-400">1-Click Vanilla K8s on Oracle Cloud</p>
      </header>

      <main className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
        
        {!isDeploying ? (
          /* הכפתור החדש - מילה CLICK בגדול ובמרכז */
          <button
            onClick={handleDeployClick}
            className="w-full bg-blue-600 hover:bg-blue-500 transition-colors duration-300 rounded-lg py-8 px-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            <span className="text-5xl font-black mb-2 text-center tracking-wide">CLICK</span>
            <span className="text-lg text-center text-blue-100 font-medium">to deploy a cluster</span>
          </button>
        ) : (
          /* אזור ה-Progress Bar לאחר הלחיצה */
          <div className="w-full mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-300">{status}</span>
              <span className="text-sm font-medium text-blue-300">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {progress === 100 && (
              <button
                onClick={() => {
                  setIsDeploying(false);
                  setProgress(0);
                  setStatus('Idle');
                }}
                className="w-full mt-6 bg-green-600 hover:bg-green-500 transition-colors py-3 rounded-lg font-bold text-white shadow-md"
              >
                Done! Deploy Another
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}