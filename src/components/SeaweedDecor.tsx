'use client'

export default function SeaweedDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-24 left-0 right-0 z-0 flex justify-between opacity-40">
      <div className="hidden md:block w-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.3),transparent_60%)] rounded-tr-[60%] rounded-br-[60%] translate-x-[-40%] animate-[sway_6s_ease-in-out_infinite]" />
      <div className="hidden md:block w-20 h-40 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.3),transparent_60%)] rounded-tl-[60%] rounded-bl-[60%] translate-x-[40%] animate-[sway_7s_ease-in-out_infinite]" />
      <style jsx>{`
        @keyframes sway { 0%,100%{ transform: rotate(-1deg); } 50%{ transform: rotate(1.5deg); } }
      `}</style>
    </div>
  )
}


