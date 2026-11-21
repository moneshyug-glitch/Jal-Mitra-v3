import { jsPDF } from 'jspdf';
import { MonthData, StaffInfo } from '../types';
import { Language } from '../context/LanguageContext';

interface GenerateSlipParams {
  staff: StaffInfo;
  monthData: MonthData;
  language: Language;
  paid: number;
  pending: number;
  displayLocation: string;
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
  fillStyle?: string,
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

export async function generateSalarySlipPDF({
  staff,
  monthData: d,
  language,
  paid,
  pending,
  displayLocation,
}: GenerateSlipParams): Promise<string> {
  const isHi = language === 'hi';

  // High-resolution A4 canvas (1240 x 1754 px)
  const W = 1240;
  const H = 1754;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  const fontStack = `'Poppins', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  // Crisp White Paper Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Outer Card Frame
  drawRoundedRect(ctx, 56, 56, W - 112, H - 112, 28, '#ffffff', '#cbd5e1', 3);

  // Header Accent Bar
  drawRoundedRect(ctx, 56, 56, W - 112, 18, 12, '#003366');

  // Load Official Logo
  let logoImg = await loadImage('/assets/aistudio/Untitled_design_20261022_071518_0000_fe0422fd.png');
  if (!logoImg) {
    logoImg = await loadImage('/logo.png');
  }

  let cursorY = 104;
  if (logoImg) {
    const targetH = 140;
    const ratio = logoImg.width / Math.max(1, logoImg.height);
    const targetW = Math.min(340, targetH * ratio);
    ctx.drawImage(logoImg, (W - targetW) / 2, cursorY, targetW, targetH);
    cursorY += targetH + 18;
  } else {
    ctx.font = `800 40px ${fontStack}`;
    ctx.fillStyle = '#003366';
    ctx.textAlign = 'center';
    ctx.fillText(isHi ? 'भारत पेयजल' : 'BHARAT PAYJAL', W / 2, cursorY + 48);
    cursorY += 80;
  }

  // Slogan & Contact
  ctx.textAlign = 'center';
  ctx.font = `500 22px ${fontStack}`;
  ctx.fillStyle = '#475569';
  ctx.fillText(
    isHi
      ? 'स्वच्छ जल • समृद्ध भारत | हरदोई, उत्तर प्रदेश (पिन: 241001)'
      : 'Pure Water • Healthy India | Hardoi, Uttar Pradesh (PIN: 241001)',
    W / 2,
    cursorY
  );
  cursorY += 32;

  ctx.font = `700 20px ${fontStack}`;
  ctx.fillStyle = '#64748b';
  ctx.fillText(
    isHi
      ? 'हेल्पलाइन: 7860393198 | ईमेल: hi@bharatpeyjal.in.net'
      : 'Helpline: 7860393198 | Support: hi@bharatpeyjal.in.net',
    W / 2,
    cursorY
  );
  cursorY += 36;

  // Month Badge
  const monthBadgeText = isHi
    ? `मासिक वेतन पर्ची — ${d.month}`
    : `Monthly Salary Slip — ${d.month}`;
  ctx.font = `700 24px ${fontStack}`;
  const badgeW = Math.max(440, ctx.measureText(monthBadgeText).width + 80);
  drawRoundedRect(ctx, (W - badgeW) / 2, cursorY, badgeW, 52, 26, '#f1f5f9', '#cbd5e1', 2);
  ctx.fillStyle = '#0f172a';
  ctx.fillText(monthBadgeText, W / 2, cursorY + 34);
  cursorY += 80;

  // Divider Line
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(96, cursorY);
  ctx.lineTo(W - 96, cursorY);
  ctx.stroke();
  cursorY += 38;

  // Staff Information 2x2 Grid
  const leftColX = 104;
  const rightColX = W / 2 + 30;
  ctx.textAlign = 'left';

  const drawField = (x: number, y: number, label: string, value: string, bold = true) => {
    ctx.font = `500 20px ${fontStack}`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, x, y);
    ctx.font = `${bold ? '700' : '600'} 25px ${fontStack}`;
    ctx.fillStyle = '#0f172a';
    ctx.fillText(value, x, y + 32);
  };

  drawField(leftColX, cursorY, isHi ? 'कर्मचारी का नाम:' : 'Staff Name:', staff.name || '-');
  drawField(rightColX, cursorY, isHi ? 'स्टाफ पहचान संख्या (ID):' : 'Staff ID:', staff.id || '-');
  cursorY += 76;

  drawField(
    leftColX,
    cursorY,
    isHi ? 'पद / भूमिका:' : 'Designation / Role:',
    isHi ? 'जल मित्र (डिलीवरी पार्टनर)' : 'Jal Mitra (Delivery Partner)',
    false
  );
  drawField(rightColX, cursorY, isHi ? 'कार्य क्षेत्र:' : 'Service Zone:', displayLocation, false);
  cursorY += 60;

  // Light Divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, cursorY);
  ctx.lineTo(W - 96, cursorY);
  ctx.stroke();
  cursorY += 42;

  // Two Columns: Earnings & Deductions
  const colW = (W - 240) / 2;
  const earnX = 104;
  const dedX = earnX + colW + 40;

  // Section Headers
  ctx.textAlign = 'left';
  ctx.font = `800 22px ${fontStack}`;
  ctx.fillStyle = '#047857';
  ctx.fillText(isHi ? 'अर्जित आय (EARNINGS)' : 'EARNINGS', earnX, cursorY);

  ctx.fillStyle = '#be123c';
  ctx.fillText(isHi ? 'कटौतियां (DEDUCTIONS)' : 'DEDUCTIONS', dedX, cursorY);

  cursorY += 16;
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(earnX, cursorY);
  ctx.lineTo(earnX + colW, cursorY);
  ctx.stroke();

  ctx.strokeStyle = '#fecdd3';
  ctx.beginPath();
  ctx.moveTo(dedX, cursorY);
  ctx.lineTo(dedX + colW, cursorY);
  ctx.stroke();

  cursorY += 36;

  const drawRow = (
    x: number,
    y: number,
    w: number,
    label: string,
    amount: string,
    amountColor: string,
    isBold = false
  ) => {
    ctx.textAlign = 'left';
    ctx.font = `${isBold ? '700' : '500'} 22px ${fontStack}`;
    ctx.fillStyle = isBold ? '#0f172a' : '#475569';
    ctx.fillText(label, x, y);

    ctx.textAlign = 'right';
    ctx.font = `700 23px ${fontStack}`;
    ctx.fillStyle = amountColor;
    ctx.fillText(amount, x + w, y);
  };

  const earnRows = [
    {
      label: isHi ? 'फिक्स सैलरी:' : 'Base Salary:',
      val: `₹${d.baseSalary.toLocaleString('en-IN')}`,
      color: '#0f172a',
    },
    {
      label: isHi ? 'रेगुलर टंकी इंसेंटिव:' : 'Regular Tanki Incentive:',
      val: `+₹${d.regIncentiveTotal.toLocaleString('en-IN')}`,
      color: '#059669',
    },
    {
      label: isHi ? 'अल्टरनेटिव इंसेंटिव:' : 'Alternative Incentive:',
      val: `+₹${d.altIncentiveTotal.toLocaleString('en-IN')}`,
      color: '#059669',
    },
    {
      label: isHi ? '200 टंकी टारगेट बोनस:' : '200 Tanki Target Bonus:',
      val: `+₹${d.bookingPercentBonus.toLocaleString('en-IN')}`,
      color: '#059669',
    },
    {
      label: isHi ? '100% हाज़िरी इनाम:' : '100% Attendance Reward:',
      val: `+₹${d.attendanceBonus.toLocaleString('en-IN')}`,
      color: '#059669',
    },
  ];

  const dedRows = [
    {
      label:
        d.halfDays && d.halfDays > 0
          ? isHi
            ? 'छुट्टी / हाफ डे कटौती:'
            : 'Leave / Half-Day Cut:'
          : isHi
          ? 'छुट्टी वेतन कटौती:'
          : 'Leave Salary Deduction:',
      val: `-₹${d.leaveCut.toLocaleString('en-IN')}`,
      color: '#e11d48',
    },
    {
      label: isHi ? 'छूटी डिलीवरी जुर्माना:' : 'Missed Delivery Penalty:',
      val: `-₹${d.missedDeliveries.toLocaleString('en-IN')}`,
      color: '#e11d48',
    },
    {
      label: isHi ? 'लापरवाही / नुकसान:' : 'Negligence / Damage:',
      val: `-₹${d.damagePenalty.toLocaleString('en-IN')}`,
      color: '#e11d48',
    },
    {
      label: isHi ? 'अग्रिम / एडवांस लिया:' : 'Advance Taken:',
      val: `-₹${d.advanceTaken.toLocaleString('en-IN')}`,
      color: '#e11d48',
    },
  ];

  for (let i = 0; i < 5; i++) {
    const rowY = cursorY + i * 48;
    const e = earnRows[i];
    drawRow(earnX, rowY, colW, e.label, e.val, e.color);

    if (dedRows[i]) {
      const ded = dedRows[i];
      drawRow(dedX, rowY, colW, ded.label, ded.val, ded.color);
    }
  }

  cursorY += 5 * 48 + 8;

  // Totals Divider
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(earnX, cursorY);
  ctx.lineTo(earnX + colW, cursorY);
  ctx.moveTo(dedX, cursorY);
  ctx.lineTo(dedX + colW, cursorY);
  ctx.stroke();

  cursorY += 36;
  drawRow(
    earnX,
    cursorY,
    colW,
    isHi ? 'सकल आय (Gross Total):' : 'Gross Total:',
    `₹${(d.baseSalary + d.totalIncentive).toLocaleString('en-IN')}`,
    '#059669',
    true
  );
  drawRow(
    dedX,
    cursorY,
    colW,
    isHi ? 'कुल कटौतियां:' : 'Total Deductions:',
    `-₹${(d.totalPenalties + d.advanceTaken).toLocaleString('en-IN')}`,
    '#e11d48',
    true
  );

  cursorY += 56;

  // Net Payable In-Hand Highlight Box
  drawRoundedRect(ctx, 96, cursorY, W - 192, 134, 22, '#f8fafc', '#cbd5e1', 2);
  ctx.textAlign = 'left';
  ctx.font = `800 22px ${fontStack}`;
  ctx.fillStyle = '#475569';
  ctx.fillText(
    isHi ? 'शुद्ध देय वेतन (NET IN-HAND)' : 'NET PAYABLE IN-HAND',
    130,
    cursorY + 52
  );
  ctx.font = `500 22px ${fontStack}`;
  ctx.fillStyle = '#64748b';
  ctx.fillText(
    isHi ? 'बैंक खाता / नकद भुगतान' : 'Bank Transfer / Cash Payment',
    130,
    cursorY + 92
  );

  ctx.textAlign = 'right';
  ctx.font = `900 54px ${fontStack}`;
  ctx.fillStyle = '#0284c7';
  ctx.fillText(`₹${d.inHand.toLocaleString('en-IN')}`, W - 130, cursorY + 86);

  cursorY += 164;

  // Paid vs Due Two Boxes
  const boxW = (W - 216) / 2;
  drawRoundedRect(ctx, 96, cursorY, boxW, 108, 18, '#ecfdf5', '#a7f3d0', 2);
  drawRoundedRect(ctx, 96 + boxW + 24, cursorY, boxW, 108, 18, '#fffbeb', '#fde68a', 2);

  ctx.textAlign = 'left';
  ctx.font = `700 21px ${fontStack}`;
  ctx.fillStyle = '#047857';
  ctx.fillText(isHi ? 'भुगतान हुआ (Paid):' : 'Paid Amount:', 126, cursorY + 40);
  ctx.font = `800 32px ${fontStack}`;
  ctx.fillStyle = '#064e3b';
  ctx.fillText(`₹${paid.toLocaleString('en-IN')}`, 126, cursorY + 82);

  ctx.font = `700 21px ${fontStack}`;
  ctx.fillStyle = '#b45309';
  ctx.fillText(isHi ? 'बकाया रकम (Due):' : 'Pending Due:', 96 + boxW + 54, cursorY + 40);
  ctx.font = `800 32px ${fontStack}`;
  ctx.fillStyle = '#78350f';
  ctx.fillText(`₹${pending.toLocaleString('en-IN')}`, 96 + boxW + 54, cursorY + 82);

  cursorY += 156;

  // Footer Stamp Divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, cursorY);
  ctx.lineTo(W - 96, cursorY);
  ctx.stroke();

  cursorY += 48;

  // Verification Badge + Issue Date
  ctx.textAlign = 'left';
  ctx.font = `700 23px ${fontStack}`;
  ctx.fillStyle = '#059669';
  ctx.fillText('✓', 100, cursorY);
  ctx.fillStyle = '#1e293b';
  ctx.fillText(
    isHi ? 'डिजिटल रूप से सत्यापित एवं अनुमोदित' : 'Digitally Verified & Approved',
    132,
    cursorY
  );

  ctx.font = `500 20px ${fontStack}`;
  ctx.fillStyle = '#64748b';
  const issueStr = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN');
  ctx.fillText(`${isHi ? 'जारी दिनांक:' : 'Issue Date:'} ${issueStr}`, 100, cursorY + 38);

  // Authorized Signatory Box on Right
  drawRoundedRect(ctx, W - 260, cursorY - 20, 150, 100, 14, '#f8fafc', '#cbd5e1', 2);
  ctx.textAlign = 'center';
  ctx.font = `800 20px ${fontStack}`;
  ctx.fillStyle = '#003366';
  ctx.fillText('BHARAT', W - 185, cursorY + 24);
  ctx.fillText('PAYJAL', W - 185, cursorY + 50);

  ctx.font = `700 18px ${fontStack}`;
  ctx.fillStyle = '#475569';
  ctx.fillText(isHi ? 'प्राधिकृत हस्ताक्षर' : 'Authorized Signatory', W - 185, cursorY + 108);

  // Build A4 PDF with jsPDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');

  const safeId = (staff.id || 'STAFF').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeMonth = (d.month || 'Slip').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '');
  const fileName = `Bharat_Payjal_Slip_${safeId}_${safeMonth}.pdf`;

  pdf.save(fileName);
  return fileName;
}
