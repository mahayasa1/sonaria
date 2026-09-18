import React from 'react';

/**
 * Warna & stop persis dari palet yang diberikan:
 * 0% #020617 · 15% #0A1128 · 30% #111827 · 50% #172554
 * 65% #1E3A8A · 80% #312E81 · 92% #4C1D95 · 100% #581C87
 */
const GRADIENT =
    'radial-gradient(ellipse 120% 90% at 50% 18%, #020617 0%, #0A1128 15%, #111827 30%, #172554 50%, #1E3A8A 65%, #312E81 80%, #4C1D95 92%, #581C87 100%)';

export default function OnboardingGradientBackground() {
    return (
        <div
            className="absolute inset-0"
            style={{ background: GRADIENT }}
            aria-hidden
        >
            {/* bintang halus */}
            <div
                className="absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                    backgroundImage:
                        'radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.5) 50%, transparent 51%),' +
                        'radial-gradient(1.5px 1.5px at 70% 15%, rgba(255,255,255,0.4) 50%, transparent 51%),' +
                        'radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.35) 50%, transparent 51%),' +
                        'radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.3) 50%, transparent 51%),' +
                        'radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.3) 50%, transparent 51%),' +
                        'radial-gradient(1.5px 1.5px at 60% 40%, rgba(255,255,255,0.25) 50%, transparent 51%)',
                    backgroundSize: '100% 100%',
                }}
            />
            {/* vignette halus di tepi bawah */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
    );
}
