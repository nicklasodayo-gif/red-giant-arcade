import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Check, Copy, ExternalLink } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: string;
  couponCode?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  couponCode
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border-2 border-zinc-700 shadow-2xl p-6 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-black text-white uppercase tracking-wider mt-2">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-400 mt-1 max-w-xs">{subtitle}</p>}

        {/* QR Code Container */}
        <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-xl my-5 flex items-center justify-center border-4 border-amber-400">
          {qrUrl ? (
            <img src={qrUrl} alt="Reward QR Code" className="w-full h-full object-contain" />
          ) : (
            <div className="text-zinc-500 text-xs">Generating QR...</div>
          )}
        </div>

        {/* Coupon Code Block */}
        {couponCode && (
          <div className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 flex items-center justify-between mb-4">
            <div className="text-left">
              <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Voucher Code</span>
              <span className="text-sm font-black text-amber-400 tracking-wider font-mono">{couponCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        <p className="text-[11px] text-zinc-400 font-medium">
          📱 Scan with your phone camera to claim voucher or save score to your mobile device.
        </p>
      </div>
    </div>
  );
};
