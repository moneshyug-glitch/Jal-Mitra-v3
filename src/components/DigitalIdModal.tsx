import React, { useEffect, useState } from 'react';
import {
  X,
  RotateCw,
  Camera,
  Trash2,
  Download,
  FileDown,
  Share2,
  Check,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  Phone,
  MapPin,
  Droplet,
  Calendar,
} from 'lucide-react';
import { StaffInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  IdCardCustomMeta,
  buildSingleIdCardBlob,
  downloadIdCardPDF,
  downloadIdCardPNG,
  generateIdQrDataUrl,
} from '../utils/idCardExport';
import { formatIndianPhone } from '../utils/careerHelpers';

interface DigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffInfo;
  staffPhoto: string | null;
  onPickPhoto: () => void;
  onRemovePhoto: () => void;
  cycleMonth?: string;
}

function getMetaStorageKey(staffId: string) {
  const safeId = (staffId || 'BP001').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  return `bp_id_meta_${safeId}`;
}

export const DigitalIdModal: React.FC<DigitalIdModalProps> = ({
  isOpen,
  onClose,
  staff,
  staffPhoto,
  onPickPhoto,
  onRemovePhoto,
  cycleMonth = 'November 2026',
}) => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const [side, setSide] = useState<'front' | 'back'>('front');
  const [showEditor, setShowEditor] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [busyAction, setBusyAction] = useState<'png' | 'pdf' | 'share' | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const defaultJoinText = staff.joiningDateDisplay || staff.joinDate || '----';
  const defaultDobText = staff.dob || '';

  const [meta, setMeta] = useState<IdCardCustomMeta>({
    emergencyPhone: staff.phone || '7860393198',
    joinDate: defaultJoinText,
    dob: defaultDobText,
    validThru: 'Dec 2027',
  });

  const displayLocation =
    !staff.location || (language === 'en' && staff.location === 'भारत पेयजल हरदोई 🇮🇳')
      ? t.defaultLocation
      : staff.location;

  useEffect(() => {
    if (!isOpen) return;
    const metaKey = getMetaStorageKey(staff.id);
    const apiJoin = staff.joiningDateDisplay || staff.joinDate || '----';
    const apiDob = staff.dob || '';
    try {
      const savedMetaRaw = localStorage.getItem(metaKey);
      if (savedMetaRaw) {
        const parsed = JSON.parse(savedMetaRaw) as Partial<IdCardCustomMeta>;
        setMeta({
          emergencyPhone: parsed.emergencyPhone || staff.phone || '7860393198',
          joinDate: apiJoin !== '----' ? apiJoin : parsed.joinDate || '----',
          dob: apiDob || parsed.dob || '',
          validThru: parsed.validThru || 'Dec 2027',
        });
      } else {
        setMeta({
          emergencyPhone: staff.phone || '7860393198',
          joinDate: apiJoin,
          dob: apiDob,
          validThru: 'Dec 2027',
        });
      }
    } catch {
      // Ignore storage read error
    }
  }, [isOpen, staff.id, staff.phone, staff.joinDate, staff.joiningDateDisplay, staff.dob]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    generateIdQrDataUrl(staff, displayLocation, cycleMonth)
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [isOpen, staff, displayLocation, cycleMonth]);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleMetaUpdate = (patch: Partial<IdCardCustomMeta>) => {
    setMeta((prev) => {
      const next = { ...prev, ...patch };
      const metaKey = getMetaStorageKey(staff.id);
      try {
        localStorage.setItem(metaKey, JSON.stringify(next));
      } catch {
        // Ignore storage write error
      }
      return next;
    });
  };

  const handleRemovePhotoClick = () => {
    onRemovePhoto();
    showToast(isHi ? 'डिफ़ॉल्ट जल मित्र आइकन सेट किया गया' : 'Reset to default Jal Mitra badge');
  };

  const exportParams = {
    staff,
    language,
    photoDataUrl: staffPhoto,
    meta,
    displayLocation,
    cycleMonth,
    side,
  };

  const handleDownloadPng = async () => {
    if (busyAction) return;
    setBusyAction('png');
    try {
      const fileName = await downloadIdCardPNG(exportParams);
      showToast(`${t.idCardSavedMsg} (${fileName})`);
    } catch {
      showToast(isHi ? 'इमेज सेव करने में समस्या आई' : 'Failed to save ID image');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (busyAction) return;
    setBusyAction('pdf');
    try {
      const fileName = await downloadIdCardPDF(exportParams);
      showToast(`${t.idCardSavedMsg} (${fileName})`);
    } catch {
      showToast(isHi ? 'PDF तैयार करने में समस्या आई' : 'Failed to generate PDF');
    } finally {
      setBusyAction(null);
    }
  };

  const handleShareCard = async () => {
    if (busyAction) return;
    setBusyAction('share');
    try {
      const { blob, fileName } = await buildSingleIdCardBlob({ ...exportParams, side: 'front' });
      const file = new File([blob], fileName, { type: 'image/png' });

      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${staff.name} — Bharat Payjal Jal Mitra ID`,
          text: isHi
            ? `भारत पेयजल आधिकारिक जल मित्र पहचान पत्र\nनाम: ${staff.name}\nID: ${staff.id}\nमाह: ${cycleMonth}`
            : `Bharat Payjal Official Jal Mitra ID Card\nName: ${staff.name}\nID: ${staff.id}\nCycle: ${cycleMonth}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        showToast(isHi ? 'ID कार्ड इमेज डाउनलोड हो गई — अब शेयर करें!' : 'ID card PNG downloaded — ready to share!');
      }
    } catch {
      // Cancelled by user
    } finally {
      setBusyAction(null);
    }
  };

  if (!isOpen) return null;

  const serialCode = `BP-JM-2026-${(staff.id || 'BP001').toUpperCase()}`;
  const cleanZone = displayLocation.replace('🇮🇳', '').trim();
  const logoSrc = '/assets/aistudio/Untitled_design_20261022_071518_0000_fe0422fd.png';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t.idCardModalTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {t.idCardModalTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-3.5 max-h-[82vh] overflow-y-auto no-scrollbar">
          {/* Segmented Front / Back Toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setSide('front')}
              className={`min-h-[40px] rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                side === 'front'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.idCardFront}
            </button>
            <button
              type="button"
              onClick={() => setSide('back')}
              className={`min-h-[40px] rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                side === 'back'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.idCardBack}
            </button>
          </div>

          {/* Official Portrait ID Card Container */}
          <div className="mx-auto w-full max-w-[330px]" style={{ perspective: '1200px' }}>
            <div
              onClick={() => setSide((s) => (s === 'front' ? 'back' : 'front'))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSide((s) => (s === 'front' ? 'back' : 'front'));
                }
              }}
              aria-label={t.idCardFlipHint}
              className="relative w-full cursor-pointer select-none transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: '510px',
              }}
            >
              {/* ================= FRONT FACE (Matching Official Reference Format) ================= */}
              <div
                className="w-full rounded-[22px] bg-white text-slate-900 shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  minHeight: '510px',
                }}
              >
                {/* Top Indian Tricolor Precision Strip */}
                <div className="grid grid-cols-3 h-[4px] w-full shrink-0">
                  <div className="bg-[#FF9933]" />
                  <div className="bg-white" />
                  <div className="bg-[#138808]" />
                </div>

                {/* Deep Navy-Teal Header */}
                <div
                  className="px-4 pt-3.5 pb-11 text-white relative shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #002244 0%, #003a70 55%, #005b7f 100%)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center shrink-0">
                        <img
                          src={logoSrc}
                          alt="Bharat Payjal"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-white leading-tight truncate">
                          {t.idCardHeaderTitle}
                        </h3>
                        <p className="text-[9px] font-bold tracking-wider text-sky-100 uppercase leading-tight truncate">
                          {t.idCardHeaderSub}
                        </p>
                      </div>
                    </div>

                    {/* Top-Right VERIFIED Badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-white shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-300 text-emerald-950 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="text-[10px] font-extrabold tracking-wide">
                        {t.idCardVerifiedTag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Centered Circular Avatar */}
                <div className="-mt-10 relative z-20 flex flex-col items-center px-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-white p-1 ring-4 ring-sky-100 shadow-md overflow-hidden">
                      <img
                        src={staffPhoto || '/pwa-192x192.png'}
                        alt={staff.name}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-xs"
                      aria-hidden="true"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>

                  {/* Bold Centered Name + Warm Amber Role Banner */}
                  <h4 className="mt-2.5 text-xl font-extrabold text-slate-900 leading-tight text-center text-balance">
                    {staff.name}
                  </h4>

                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900">
                    <Droplet className="w-3.5 h-3.5 text-sky-600 fill-sky-500 shrink-0" />
                    <span className="text-[11px] font-extrabold tracking-tight">
                      {t.idCardRoleBanner}
                    </span>
                  </div>
                </div>

                {/* Clean Single-Column 7-Row Identity Table (with DOB & Joining Date, no Blood Group) */}
                <div className="px-3.5 pt-3 pb-2">
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 divide-y divide-slate-200/70">
                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {isHi ? 'कर्मचारी ID (Staff ID)' : 'Staff ID'}
                      </span>
                      <strong className="text-[#0f2942] font-extrabold tabular-nums shrink-0">
                        {staff.id || 'BP001'}
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {isHi ? 'पंजीकृत मोबाइल' : 'Registered Mobile'}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums shrink-0">
                        {formatIndianPhone(staff.phone) || '+91 7054198443'}
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {t.idCardDobLabel}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums shrink-0">
                        {meta.dob || staff.dob || '----'}
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {t.idCardJoiningLabel}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums shrink-0">
                        {meta.joinDate || staff.joiningDateDisplay || staff.joinDate || '----'}
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {t.idCardDeptLabel}
                      </span>
                      <strong className="text-slate-900 font-bold truncate">
                        {t.idCardDeptValue}
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {t.idCardStatusLabel}
                      </span>
                      <strong className="text-emerald-600 font-extrabold inline-flex items-center gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span>{t.idCardStatusValue}</span>
                      </strong>
                    </div>

                    <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 font-medium truncate">
                        {t.idCardCycleLabel}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums shrink-0">
                        {cycleMonth}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Official Seal & Signature Row */}
                <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 p-0.5 shrink-0 overflow-hidden">
                      <img
                        src="/pwa-192x192.png"
                        alt="Official Seal"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        {t.idCardSealTitle}
                      </span>
                      <span className="block text-[11px] font-extrabold text-[#0f2942] truncate">
                        {t.idCardSealValue}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 leading-tight">
                    <span className="block text-xs font-extrabold italic text-[#003a70] underline decoration-2 underline-offset-2">
                      Bharat Peyjal
                    </span>
                    <span className="block text-[9px] font-semibold text-slate-400 mt-1">
                      {t.authorizedSignatory}
                    </span>
                  </div>
                </div>

                {/* Proud Deep Navy Footer Band */}
                <div className="bg-[#002b54] px-3 py-2.5 text-center shrink-0">
                  <p className="text-[11px] font-extrabold text-amber-300 leading-tight">
                    {t.idCardProudMember}
                  </p>
                  <p className="text-[9px] font-medium text-sky-100/85 mt-0.5 tabular-nums">
                    {isHi ? 'हेल्पलाइन: +91 7860393198' : 'Helpline: +91 7860393198'} • Drink Pure, Live Pure
                  </p>
                </div>
              </div>

              {/* ================= BACK FACE (Verification QR + Emergency & Address) ================= */}
              <div
                className="absolute inset-0 w-full rounded-[22px] bg-white text-slate-900 shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  minHeight: '510px',
                }}
              >
                <div>
                  <div className="grid grid-cols-3 h-[4px] w-full">
                    <div className="bg-[#FF9933]" />
                    <div className="bg-white" />
                    <div className="bg-[#138808]" />
                  </div>
                  <div
                    className="px-4 py-3 text-center text-white"
                    style={{
                      background: 'linear-gradient(135deg, #002244 0%, #004c73 100%)',
                    }}
                  >
                    <h4 className="text-xs font-extrabold tracking-wide uppercase">
                      {isHi ? 'प्रमाणीकरण एवं विवरण' : 'Verification & Details'}
                    </h4>
                    <p className="text-[10px] font-mono text-amber-300 font-semibold mt-0.5 tabular-nums">
                      {serialCode}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-extrabold text-[#003366] mb-0.5">
                      {isHi ? 'आधिकारिक प्रमाण पत्र' : 'Official Certification'}
                    </p>
                    <p className="text-[10px] leading-relaxed text-slate-700 font-medium">
                      {t.idCardAuthNote}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50/70 border border-slate-200/80 divide-y divide-slate-200/70 text-[10px]">
                    <div className="px-2.5 py-2 flex justify-between items-center gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#003366]" />
                        {t.workAreaLabel.replace(':', '')}
                      </span>
                      <strong className="text-slate-900 font-bold truncate">{cleanZone}</strong>
                    </div>

                    <div className="px-2.5 py-2 flex justify-between items-center gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sky-700" />
                        {t.idCardJoinDate}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums">{meta.joinDate}</strong>
                    </div>

                    <div className="px-2.5 py-2 flex justify-between items-center gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-700" />
                        {t.idCardEmergencyContact}
                      </span>
                      <strong className="text-slate-900 font-bold tabular-nums">
                        +91 {meta.emergencyPhone || staff.phone || '7860393198'}
                      </strong>
                    </div>
                  </div>

                  {/* Real Scannable QR Verification Block */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                    <div className="shrink-0 p-1 rounded-lg border border-slate-200 bg-white">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="Staff Verification QR" className="w-16 h-16 block" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[10px] font-extrabold text-[#003366]">
                        {isHi ? 'डिजिटल QR सत्यापन' : 'Digital QR Verification'}
                      </p>
                      <p className="text-[9px] text-slate-600 leading-snug">
                        {isHi
                          ? 'कैमरे से QR स्कैन कर स्टाफ पहचान की पुष्टि करें।'
                          : 'Scan QR with any camera to verify staff identity.'}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-700">hi@bharatpeyjal.in.net</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[9px] text-amber-900 font-medium leading-snug text-center">
                    {t.idCardFoundNote}
                  </div>
                </div>

                <div className="bg-[#002b54] text-amber-300 text-center py-2 text-[9px] font-bold tracking-wider">
                  DRINK PURE, LIVE PURE • BHARAT PAYJAL
                </div>
              </div>
            </div>
          </div>

          {/* Flip Affordance Hint */}
          <button
            type="button"
            onClick={() => setSide((s) => (s === 'front' ? 'back' : 'front'))}
            className="w-full py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t.idCardFlipHint}</span>
          </button>

          {/* Photo & Details Customization Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPickPhoto}
              className="flex-1 min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Camera className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>
                {staffPhoto
                  ? t.idCardUploadPhoto
                  : isHi
                  ? 'ID कार्ड पर फोटो लगाएं'
                  : 'Upload ID Photo'}
              </span>
            </button>

            {staffPhoto && (
              <button
                type="button"
                onClick={handleRemovePhotoClick}
                className="min-h-[44px] px-3 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                title={t.idCardRemovePhoto}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowEditor((v) => !v)}
              className={`flex-1 min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                showEditor
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>{t.idCardEditDetails}</span>
            </button>
          </div>

          {/* Collapsible Card Details Editor */}
          {showEditor && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-2.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.idCardDobLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={meta.dob || ''}
                    onChange={(e) => handleMetaUpdate({ dob: e.target.value })}
                    placeholder="12/05/1998"
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.idCardJoinDate}
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={meta.joinDate}
                    onChange={(e) => handleMetaUpdate({ joinDate: e.target.value })}
                    placeholder="15 Oct 2026"
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.idCardEmergencyContact}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={meta.emergencyPhone}
                  onChange={(e) => handleMetaUpdate({ emergencyPhone: e.target.value.replace(/\D/g, '') })}
                  placeholder="7860393198"
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          {feedbackMsg && (
            <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Export & Share Actions */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              disabled={busyAction !== null}
              onClick={handleDownloadPng}
              className="min-h-[46px] px-2.5 py-2 rounded-2xl text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all touch-press disabled:opacity-60 whitespace-nowrap"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">{busyAction === 'png' ? t.idCardSaving : t.idCardDownloadPng}</span>
            </button>

            <button
              type="button"
              disabled={busyAction !== null}
              onClick={handleDownloadPdf}
              className="min-h-[46px] px-2.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all touch-press disabled:opacity-60 whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 shrink-0" />
              <span className="truncate">{busyAction === 'pdf' ? t.idCardSaving : t.idCardDownloadPdf}</span>
            </button>

            <button
              type="button"
              disabled={busyAction !== null}
              onClick={handleShareCard}
              className="min-h-[46px] px-2.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all touch-press disabled:opacity-60 whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{busyAction === 'share' ? t.idCardSaving : t.idCardShareBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
