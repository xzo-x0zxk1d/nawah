'use client';
import { useState } from 'react';
import MatterSimulation from '@/components/simulations/MatterSimulation';
import GasPressureSimulation from '@/components/simulations/GasPressureSimulation';
import AtomSimulation from '@/components/simulations/AtomSimulation';
import { FlaskConical, Wind, Atom } from 'lucide-react';

const sims = [
  { id: 'matter', label: 'حالات المادة', icon: <FlaskConical size={22} />, color: 'nawah-teal' },
  { id: 'gas', label: 'ضغط الغاز', icon: <Wind size={22} />, color: 'purple-400' },
  { id: 'atom', label: 'نموذج الذرة', icon: <Atom size={22} />, color: 'yellow-400' },
];

export default function LabPage() {
  const [active, setActive] = useState('matter');

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm mb-4">
            🔬 مختبر نواة الافتراضي
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            التجارب الافتراضية
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            محاكاة علمية آمنة وتفاعلية. تعلّم من خلال التجربة والاستكشاف.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {sims.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                active === s.id
                  ? 'bg-nawah-teal text-nawah-900 shadow-lg shadow-nawah-teal/30'
                  : 'bg-nawah-800 text-slate-300 border border-nawah-700 hover:border-nawah-teal/40'
              }`}
              style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Simulation */}
        <div className="sim-container p-2 md:p-6 rounded-2xl">
          {active === 'matter' && <MatterSimulation />}
          {active === 'gas' && <GasPressureSimulation />}
          {active === 'atom' && <AtomSimulation />}
        </div>
      </div>
    </div>
  );
}
