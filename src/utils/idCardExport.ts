import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { StaffInfo } from '../types';
import { Language } from '../context/LanguageContext';
import { formatIndianPhone } from './careerHelpers';

export interface IdCardCustomMeta {
  emergencyPhone: string;
  joinDate: string;
  dob?: string;
  validThru: string;
}

export interface IdCardExportParams {
  staff: StaffInfo;
  language: Language;
  photoDataUrl: string | null;
  meta: IdCardCustomMeta;
  displayLocation: string;
  cycleMonth?: string;
  side?: 'front' | 'back';
}

export function buildIdQrPayload(staff: StaffInfo, displayLocation: string, cycleMonth = 'November 2026'): string {
  return [
    'BHARAT PAYJAL - OFFICIAL STAFF ID',
    `ID: ${staff.id || 'BP001'}`,
    `Name: ${staff.name || 'Staff'}`,
    `Mobile: ${formatIndianPhone(staff.phone) || '-'}`,
    `Role: Authorized Jal Mitra`,
    `Zone: ${displayLocation}`,
    `Cycle: ${cycleMonth}`,
    'Helpline: +91 7860393198',
  ].join('\n');
}

export async function generateIdQrDataUrl(
  staff: StaffInfo,
  displayLocation: string,
  cycleMonth = 'November 2026',
  darkColor = '#002244'
): Promise<string> {
  const payload = buildIdQrPayload(staff, displayLocation, cycleMonth);
  return QRCode.toDataURL(payload, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: darkColor,
      light: '#ffffff',
    },
  });
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillStyle?: string | CanvasGradient,
  strokeStyle?: string,
  lineWidth = 2
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function drawIndianFlag(ctx: CanvasRenderingContext2D, x: number, y: number, w = 26, h = 18) {
  const stripeH = h / 3;
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, 3);
  ctx.clip();
  ctx.fillStyle = '#FF9933';
  ctx.fillRect(x, y, w, stripeH);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y + stripeH, w, stripeH);
  ctx.fillStyle = '#138808';
  ctx.fillRect(x, y + stripeH * 2, w, stripeH);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, stripeH * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#000080';
  ctx.fill();
  ctx.restore();
}

export async function renderFrontCardCanvas(params: IdCardExportParams): Promise<HTMLCanvasElement> {
  const { staff, language, photoDataUrl, meta, cycleMonth } = params;
  const isHi = language === 'hi';
  const W = 720;
  const H = 1100;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  const fontStack = `'Poppins', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  // Crisp White Card Body
  drawRoundedRect(ctx, 0, 0, W, H, 36, '#ffffff', '#cbd5e1', 3);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(36, 0);
  ctx.lineTo(W - 36, 0);
  ctx.quadraticCurveTo(W, 0, W, 36);
  ctx.lineTo(W, H - 36);
  ctx.quadraticCurveTo(W, H, W - 36, H);
  ctx.lineTo(36, H);
  ctx.quadraticCurveTo(0, H, 0, H - 36);
  ctx.lineTo(0, 36);
  ctx.quadraticCurveTo(0, 0, 36, 0);
  ctx.closePath();
  ctx.clip();

  // Deep Navy-Teal Header Gradient
  const headerGrad = ctx.createLinearGradient(0, 0, W, 240);
  headerGrad.addColorStop(0, '#002244');
  headerGrad.addColorStop(0.55, '#003a70');
  headerGrad.addColorStop(1, '#005b7f');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, 236);

  // Top Edge Indian Tricolor Accent Bar
  ctx.fillStyle = '#FF9933';
  ctx.fillRect(0, 0, W / 3, 9);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(W / 3, 0, W / 3, 9);
  ctx.fillStyle = '#138808';
  ctx.fillRect((W * 2) / 3, 0, W / 3, 9);

  // Top-Left Company Crest & Brand Text
  let logoImg = await loadImage('/assets/aistudio/Untitled_design_20261022_071518_0000_fe0422fd.png');
  if (!logoImg) logoImg = await loadImage('/logo.png');

  drawRoundedRect(ctx, 36, 36, 80, 80, 18, '#ffffff');
  if (logoImg) {
    const pad = 8;
    const avail = 80 - pad * 2;
    const ratio = Math.min(avail / logoImg.width, avail / logoImg.height);
    const dw = logoImg.width * ratio;
    const dh = logoImg.height * ratio;
    ctx.drawImage(logoImg, 36 + (80 - dw) / 2, 36 + (80 - dh) / 2, dw, dh);
  }

  ctx.textAlign = 'left';
  ctx.font = `800 32px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isHi ? 'भारत पेयजल' : 'Bharat Payjal', 134, 72);

  ctx.font = `700 17px ${fontStack}`;
  ctx.fillStyle = '#e0f2fe';
  ctx.fillText('OFFICIAL IDENTITY CARD', 134, 102);

  // Top-Right VERIFIED Badge
  drawRoundedRect(ctx, W - 208, 46, 172, 52, 26, 'rgba(16, 185, 129, 0.20)', 'rgba(52, 211, 153, 0.5)', 2);
  ctx.beginPath();
  ctx.arc(W - 178, 72, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#6ee7b7';
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 13px ${fontStack}`;
  ctx.fillStyle = '#064e3b';
  ctx.fillText('✓', W - 178, 73);
  ctx.textAlign = 'left';
  ctx.font = `800 18px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('VERIFIED', W - 158, 74);
  ctx.textBaseline = 'alphabetic';

  // Overlapping Centered Circular Portrait
  const cx = W / 2;
  const cy = 224;
  const r = 84;

  // Outer Soft Sky Ring + White Inner Ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
  ctx.fillStyle = '#e0f2fe';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  let avatarImg: HTMLImageElement | null = null;
  if (photoDataUrl) {
    avatarImg = await loadImage(photoDataUrl);
  }
  const mascotImg = await loadImage('/pwa-512x512.png');
  const finalAvatar = avatarImg || mascotImg;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  if (finalAvatar) {
    const scale = Math.max((r * 2) / finalAvatar.width, (r * 2) / finalAvatar.height);
    const dw = finalAvatar.width * scale;
    const dh = finalAvatar.height * scale;
    ctx.drawImage(finalAvatar, cx - dw / 2, cy - dh / 2, dw, dh);
  }
  ctx.restore();

  // Emerald Checkmark Badge on Portrait Bottom-Right
  ctx.beginPath();
  ctx.arc(cx + 60, cy + 62, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 22px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('✓', cx + 60, cy + 63);
  ctx.textBaseline = 'alphabetic';

  // Staff Name
  let y = 356;
  ctx.textAlign = 'center';
  ctx.font = `800 38px ${fontStack}`;
  ctx.fillStyle = '#0f172a';
  ctx.fillText(staff.name || 'Talib', W / 2, y);

  // Warm Cream Role Banner
  y += 18;
  const roleText = isHi ? 'अधिकृत जल मित्र (Official Staff)' : 'Authorized Jal Mitra (Official Staff)';
  ctx.font = `700 21px ${fontStack}`;
  const bannerW = Math.min(W - 96, Math.max(420, ctx.measureText(roleText).width + 88));
  drawRoundedRect(ctx, (W - bannerW) / 2, y, bannerW, 50, 25, '#fefce8', '#fde047', 2);

  // Small Droplet Marker inside Banner
  const textX = W / 2 + 12;
  const dropX = (W - bannerW) / 2 + 32;
  ctx.beginPath();
  ctx.arc(dropX, y + 28, 7.5, 0, Math.PI);
  ctx.lineTo(dropX, y + 15);
  ctx.closePath();
  ctx.fillStyle = '#0284c7';
  ctx.fill();

  ctx.fillStyle = '#7c2d12';
  ctx.fillText(roleText, textX, y + 33);

  // Single-Column 7-Row Official Details Card (with DOB & Joining Date, no Blood Group)
  y += 72;
  const boxX = 36;
  const boxW = W - 72;
  const rowH = 58;
  const infoRows: { label: string; value: string; valueColor: string; isStatus?: boolean }[] = [
    {
      label: isHi ? 'कर्मचारी ID (Staff ID)' : 'Staff ID',
      value: staff.id || 'BP001',
      valueColor: '#0f2942',
    },
    {
      label: isHi ? 'पंजीकृत मोबाइल' : 'Registered Mobile',
      value: formatIndianPhone(staff.phone) || '+91 7054198443',
      valueColor: '#0f172a',
    },
    {
      label: isHi ? 'जन्म तिथि (DOB)' : 'Date of Birth (DOB)',
      value: meta.dob || staff.dob || '----',
      valueColor: '#0f172a',
    },
    {
      label: isHi ? 'जुड़ने की तिथि (Joining)' : 'Joining Date',
      value: meta.joinDate || staff.joiningDateDisplay || staff.joinDate || '----',
      valueColor: '#0f172a',
    },
    {
      label: isHi ? 'विभाग (Department)' : 'Department',
      value: isHi ? 'शुद्ध पेयजल वितरण' : 'Pure Water Delivery',
      valueColor: '#0f172a',
    },
    {
      label: isHi ? 'सेवा स्थिति (Status)' : 'Service Status',
      value: isHi ? 'सक्रिय (Active)' : 'Active',
      valueColor: '#059669',
      isStatus: true,
    },
    {
      label: isHi ? 'सत्यापन माह (Cycle)' : 'Verification Cycle',
      value: cycleMonth || 'November 2026',
      valueColor: '#0f172a',
    },
  ];
  const boxH = rowH * infoRows.length;
  drawRoundedRect(ctx, boxX, y, boxW, boxH, 22, '#f8fafc', '#e2e8f0', 2);

  infoRows.forEach((row, idx) => {
    const ry = y + idx * rowH;
    const textBaselineY = ry + 36;

    ctx.textAlign = 'left';
    ctx.font = `500 20px ${fontStack}`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(row.label, boxX + 24, textBaselineY);

    ctx.textAlign = 'right';
    ctx.font = `700 21px ${fontStack}`;
    ctx.fillStyle = row.valueColor;
    ctx.fillText(row.value, boxX + boxW - 24, textBaselineY);

    if (row.isStatus) {
      const valW = ctx.measureText(row.value).width;
      ctx.beginPath();
      ctx.arc(boxX + boxW - 24 - valW - 13, textBaselineY - 6, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
    }

    if (idx < infoRows.length - 1) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(boxX + 24, ry + rowH);
      ctx.lineTo(boxX + boxW - 24, ry + rowH);
      ctx.stroke();
    }
  });

  // Official Seal & Signature Row
  y += boxH + 26;

  // Left: Small Circular Seal Badge
  const sealX = 76;
  const sealY = y + 30;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (mascotImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 30, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(mascotImg, sealX - 30, sealY - 30, 60, 60);
    ctx.restore();
  }

  ctx.textAlign = 'left';
  ctx.font = `700 15px ${fontStack}`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('OFFICIAL SEAL', 124, y + 22);
  ctx.font = `800 20px ${fontStack}`;
  ctx.fillStyle = '#0f2942';
  ctx.fillText(isHi ? 'भारत पेयजल सत्यापित' : 'Bharat Payjal Verified', 124, y + 50);

  // Right: Italic Signature + Authorized Signatory
  ctx.textAlign = 'right';
  ctx.font = `italic 800 24px ${fontStack}`;
  ctx.fillStyle = '#003a70';
  const sigText = 'Bharat Peyjal';
  ctx.fillText(sigText, W - 40, y + 26);

  const sigW = ctx.measureText(sigText).width;
  ctx.strokeStyle = '#003a70';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W - 40 - sigW, y + 32);
  ctx.lineTo(W - 40, y + 32);
  ctx.stroke();

  ctx.font = `600 17px ${fontStack}`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(isHi ? 'अधिकृत हस्ताक्षर' : 'Authorized Signatory', W - 40, y + 56);

  // Dark Navy Proud Footer
  const footerH = 104;
  const footerY = H - footerH;
  ctx.fillStyle = '#002b54';
  ctx.fillRect(0, footerY, W, footerH);

  // Crisp Indian Flag + Gold Proud Member Headline
  const proudStr = isHi ? 'भारत पेयजल परिवार के गौरवशाली सदस्य' : 'Proud Member of Bharat Payjal Family';
  ctx.font = `700 22px ${fontStack}`;
  const proudW = ctx.measureText(proudStr).width;
  const flagW = 26;
  const totalRowW = flagW + 10 + proudW;
  const rowStartX = (W - totalRowW) / 2;

  drawIndianFlag(ctx, rowStartX, footerY + 24, flagW, 18);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fcd34d';
  ctx.fillText(proudStr, rowStartX + flagW + 10, footerY + 41);

  ctx.textAlign = 'center';
  ctx.font = `500 18px ${fontStack}`;
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(
    isHi ? 'हेल्पलाइन: +91 7860393198 • Drink Pure, Live Pure' : 'Helpline: +91 7860393198 • Drink Pure, Live Pure',
    W / 2,
    footerY + 78
  );

  ctx.restore();
  return canvas;
}

export async function renderBackCardCanvas(params: IdCardExportParams): Promise<HTMLCanvasElement> {
  const { staff, language, meta, displayLocation, cycleMonth } = params;
  const isHi = language === 'hi';
  const W = 720;
  const H = 1100;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  const fontStack = `'Poppins', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  drawRoundedRect(ctx, 0, 0, W, H, 36, '#ffffff', '#cbd5e1', 3);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(36, 0);
  ctx.lineTo(W - 36, 0);
  ctx.quadraticCurveTo(W, 0, W, 36);
  ctx.lineTo(W, H - 36);
  ctx.quadraticCurveTo(W, H, W - 36, H);
  ctx.lineTo(36, H);
  ctx.quadraticCurveTo(0, H, 0, H - 36);
  ctx.lineTo(0, 36);
  ctx.quadraticCurveTo(0, 0, 36, 0);
  ctx.closePath();
  ctx.clip();

  // Header
  const headerGrad = ctx.createLinearGradient(0, 0, W, 150);
  headerGrad.addColorStop(0, '#002244');
  headerGrad.addColorStop(1, '#004c73');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, 146);

  // Tricolor top bar
  ctx.fillStyle = '#FF9933';
  ctx.fillRect(0, 0, W / 3, 9);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(W / 3, 0, W / 3, 9);
  ctx.fillStyle = '#138808';
  ctx.fillRect((W * 2) / 3, 0, W / 3, 9);

  ctx.textAlign = 'center';
  ctx.font = `800 28px ${fontStack}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isHi ? 'प्रमाणीकरण एवं विवरण' : 'VERIFICATION & DETAILS', W / 2, 74);

  ctx.font = `600 18px monospace`;
  ctx.fillStyle = '#fcd34d';
  ctx.fillText(`SERIAL: BP-JM-2026-${(staff.id || 'BP001').toUpperCase()}`, W / 2, 114);

  // Authorization Certificate Box
  let y = 178;
  drawRoundedRect(ctx, 36, y, W - 72, 178, 22, '#f8fafc', '#e2e8f0', 2);
  ctx.textAlign = 'left';
  ctx.font = `700 19px ${fontStack}`;
  ctx.fillStyle = '#003366';
  ctx.fillText(isHi ? 'आधिकारिक प्रमाण पत्र' : 'OFFICIAL CERTIFICATION', 62, y + 40);

  ctx.font = `500 19px ${fontStack}`;
  ctx.fillStyle = '#334155';
  const authText = isHi
    ? 'यह प्रमाणित किया जाता है कि इस पहचान पत्र के धारक भारत पेयजल के अधिकृत "जल मित्र" (स्वच्छ पेयजल वितरण प्रतिनिधि) हैं।'
    : 'This certifies that the bearer is an authorized "Jal Mitra" (Pure Drinking Water Delivery Representative) of Bharat Payjal.';
  wrapText(ctx, authText, 62, y + 78, W - 124, 32);

  // Details Table Box
  y += 206;
  const rows = [
    { label: isHi ? 'कार्य क्षेत्र (Service Zone)' : 'Service Zone', val: displayLocation.replace('🇮🇳', '').trim() },
    { label: isHi ? 'जॉइनिंग दिनांक (Joined)' : 'Joining Date', val: meta.joinDate || staff.joinDate || '15 Oct 2026' },
    { label: isHi ? 'आपातकालीन संपर्क' : 'Emergency Contact', val: `+91 ${meta.emergencyPhone || staff.phone || '7860393198'}` },
    { label: isHi ? 'कार्यालय पता (Office)' : 'Office Address', val: isHi ? 'भारत पेयजल प्लांट, हरदोई - 241001' : 'Bharat Payjal Plant, Hardoi - 241001' },
  ];

  const rowH = 76;
  drawRoundedRect(ctx, 36, y, W - 72, rows.length * rowH, 22, '#f8fafc', '#e2e8f0', 2);
  rows.forEach((row, idx) => {
    const ry = y + idx * rowH;
    ctx.textAlign = 'left';
    ctx.font = `500 19px ${fontStack}`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(row.label, 62, ry + 45);

    ctx.textAlign = 'right';
    ctx.font = `700 20px ${fontStack}`;
    ctx.fillStyle = '#0f172a';
    ctx.fillText(row.val, W - 62, ry + 45);

    if (idx < rows.length - 1) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(62, ry + rowH);
      ctx.lineTo(W - 62, ry + rowH);
      ctx.stroke();
    }
  });

  // Scannable QR Verification Block
  y += rows.length * rowH + 26;
  drawRoundedRect(ctx, 36, y, W - 72, 186, 22, '#ffffff', '#cbd5e1', 2);

  const qrDataUrl = await generateIdQrDataUrl(staff, displayLocation, cycleMonth);
  const qrImg = await loadImage(qrDataUrl);
  if (qrImg) {
    ctx.drawImage(qrImg, 58, y + 18, 150, 150);
  }

  ctx.textAlign = 'left';
  ctx.font = `800 21px ${fontStack}`;
  ctx.fillStyle = '#003366';
  ctx.fillText(isHi ? 'डिजिटल सत्यापन (QR Scan)' : 'DIGITAL QR VERIFICATION', 230, y + 52);

  ctx.font = `500 17px ${fontStack}`;
  ctx.fillStyle = '#475569';
  wrapText(
    ctx,
    isHi
      ? 'किसी भी कैमरे से QR कोड स्कैन कर जल मित्र की पहचान और सक्रिय स्थिति की पुष्टि करें।'
      : 'Scan this QR code with any camera to verify staff identity and active status.',
    230,
    y + 84,
    W - 280,
    26
  );
  ctx.font = `700 17px ${fontStack}`;
  ctx.fillStyle = '#059669';
  ctx.fillText('hi@bharatpeyjal.in.net', 230, y + 156);

  // Return Note
  y += 206;
  drawRoundedRect(ctx, 36, y, W - 72, 74, 16, '#fffbeb', '#fde68a', 2);
  ctx.textAlign = 'center';
  ctx.font = `600 16px ${fontStack}`;
  ctx.fillStyle = '#92400e';
  ctx.fillText(
    isHi
      ? 'कार्ड मिलने पर भारत पेयजल कार्यालय हरदोई या 7860393198 पर सूचित करें।'
      : 'If found, please return to Bharat Payjal Hardoi or call 7860393198.',
    W / 2,
    y + 43
  );

  // Footer
  const footerH = 88;
  const footerY = H - footerH;
  ctx.fillStyle = '#002b54';
  ctx.fillRect(0, footerY, W, footerH);
  ctx.textAlign = 'center';
  ctx.font = `700 19px ${fontStack}`;
  ctx.fillStyle = '#fcd34d';
  ctx.fillText('DRINK PURE, LIVE PURE • BHARAT PAYJAL', W / 2, footerY + 38);
  ctx.font = `500 16px ${fontStack}`;
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('bharatpeyjal.in.net • +91 7860393198', W / 2, footerY + 68);

  ctx.restore();
  return canvas;
}

export async function buildSingleIdCardBlob(params: IdCardExportParams): Promise<{ blob: Blob; fileName: string }> {
  const activeSide = params.side || 'front';
  const cardCanvas =
    activeSide === 'back' ? await renderBackCardCanvas(params) : await renderFrontCardCanvas(params);

  const blob = await new Promise<Blob>((resolve, reject) => {
    cardCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png', 1.0);
  });

  const safeId = (params.staff.id || 'STAFF').replace(/[^a-zA-Z0-9_-]/g, '');
  return {
    blob,
    fileName: `Bharat-Peyjal-ID-${safeId}${activeSide === 'back' ? '-Back' : ''}.png`,
  };
}

export async function downloadIdCardPNG(params: IdCardExportParams): Promise<string> {
  const { blob, fileName } = await buildSingleIdCardBlob(params);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return fileName;
}

export async function downloadIdCardPDF(params: IdCardExportParams): Promise<string> {
  const [frontCanvas, backCanvas] = await Promise.all([
    renderFrontCardCanvas(params),
    renderBackCardCanvas(params),
  ]);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const cardW = 76;
  const cardH = 116.1;
  const gap = 24;
  const startX = (pageW - (cardW * 2 + gap)) / 2;
  const startY = (pageH - cardH) / 2 + 6;

  const titleCanvas = document.createElement('canvas');
  titleCanvas.width = 1600;
  titleCanvas.height = 120;
  const tctx = titleCanvas.getContext('2d');
  if (tctx) {
    tctx.fillStyle = '#ffffff';
    tctx.fillRect(0, 0, 1600, 120);
    tctx.textAlign = 'center';
    tctx.font = `800 38px 'Poppins', 'Noto Sans Devanagari', sans-serif`;
    tctx.fillStyle = '#003366';
    tctx.fillText(
      params.language === 'hi'
        ? `भारत पेयजल — आधिकारिक जल मित्र ID कार्ड (${params.staff.name} · ${params.staff.id})`
        : `Bharat Payjal — Official Jal Mitra ID Card (${params.staff.name} · ${params.staff.id})`,
      800,
      58
    );
    tctx.font = `500 24px 'Poppins', 'Noto Sans Devanagari', sans-serif`;
    tctx.fillStyle = '#64748b';
    tctx.fillText(
      params.language === 'hi'
        ? 'प्रिंट व लैमिनेशन हेतु कटिंग गाइड के साथ (आगे एवं पीछे)'
        : 'Print-ready Front & Back layout with cut guides',
      800,
      100
    );
    pdf.addImage(titleCanvas.toDataURL('image/png'), 'PNG', 30, 12, pageW - 60, 18);
  }

  pdf.setDrawColor(148, 163, 184);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.rect(startX - 1.5, startY - 1.5, cardW + 3, cardH + 3);
  pdf.rect(startX + cardW + gap - 1.5, startY - 1.5, cardW + 3, cardH + 3);

  pdf.addImage(frontCanvas.toDataURL('image/png', 1.0), 'PNG', startX, startY, cardW, cardH);
  pdf.addImage(backCanvas.toDataURL('image/png', 1.0), 'PNG', startX + cardW + gap, startY, cardW, cardH);

  const safeId = (params.staff.id || 'STAFF').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `Bharat-Peyjal-ID-${safeId}.pdf`;
  pdf.save(fileName);
  return fileName;
}
