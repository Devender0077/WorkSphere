import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Check, Loader2, RefreshCw } from 'lucide-react';

const FaceEnrollModal = ({ open, onClose, onEnroll }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [step, setStep] = useState('prepare'); // prepare | capturing | captured | processing | done
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!open) return;
    setStep('prepare');
    setCaptured(null);
    setError('');
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
        setStream(s);
        if (videoRef.current) { videoRef.current.srcObject = s; }
        setStep('capturing');
      } catch (e) {
        setError('Unable to access camera. Please allow camera access and try again.');
      }
    })();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line
  }, [open]);

  const capture = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const w = v.videoWidth, h = v.videoHeight;
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(v, 0, 0, w, h);
    const data = c.toDataURL('image/jpeg', 0.85);
    setCaptured(data);
    setStep('captured');
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  const retake = async () => {
    setCaptured(null);
    setStep('prepare');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStep('capturing');
    } catch (e) { setError('Camera error'); }
  };

  const enroll = async () => {
    setStep('processing');
    // Fake a scan progress
    await new Promise((r) => setTimeout(r, 1200));
    onEnroll && onEnroll(captured);
    setStep('done');
    setTimeout(() => { onClose(); }, 800);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl rounded-2xl bg-card border border-border shadow-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[18px] font-bold text-foreground">Enroll Face ID</h3>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-4">Align your face inside the circle. Make sure the room is well lit and remove glasses if possible.</p>

        {error ? (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 px-4 py-3 text-[13px]">{error}</div>
        ) : (
          <div className="relative mx-auto w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            {step !== 'captured' ? (
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src={captured} alt="capture" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 pointer-events-none grid place-items-center">
              <div className="h-[72%] aspect-square rounded-full border-4 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
            {step === 'processing' && (
              <div className="absolute inset-0 bg-black/40 grid place-items-center text-white">
                <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Analyzing face…</div>
              </div>
            )}
            {step === 'done' && (
              <div className="absolute inset-0 bg-primary/80 grid place-items-center text-white">
                <div className="flex items-center gap-2"><Check className="h-6 w-6" /> Face enrolled</div>
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-5 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
          {step === 'captured' ? (
            <>
              <button onClick={retake} className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary"><RefreshCw className="h-4 w-4" /> Retake</button>
              <button onClick={enroll} className="flex-1 h-11 rounded-xl bg-primary text-white text-[13.5px] font-semibold hover:bg-primary/90">Enroll Face</button>
            </>
          ) : (
            <button onClick={capture} disabled={step !== 'capturing'} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold disabled:opacity-60"><Camera className="h-4 w-4" /> Capture</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceEnrollModal;
