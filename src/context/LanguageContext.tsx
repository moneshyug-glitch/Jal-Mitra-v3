import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'en';

export interface Translations {
  // Common & Branding
  appName: string;
  appTagline: string;
  jalMitra: string;
  helpline: string;
  support: string;
  call: string;
  close: string;
  cancel: string;
  save: string;
  share: string;
  print: string;
  offlineMode: string;
  active: string;

  // Tabs
  tabDashboard: string;
  tabBookings: string;
  tabStatement: string;
  tabIncrement: string;
  tabWaterTest: string;
  tabSettings: string;

  // Login Screen
  loginTitle: string;
  loginSubtitle: string;
  loginIdLabel: string;
  loginIdPlaceholder: string;
  loginPinLabel: string;
  loginPinPlaceholder: string;
  rememberMe: string;
  secureEncryption: string;
  openDashboard: string;
  loading: string;
  authorizedStaffOnly: string;
  loginFailedMsg: string;

  // Dashboard Tab
  hello: string;
  idPrefix: string;
  salaryMonth: string;
  monthlySummary: string;
  currentSuffix: string;
  performanceReport: string;
  monthlyBadge: string;
  newCustomers: string;
  regularAlternative: string;
  missedDeliveries: string;
  cutDeducted: string;
  penaltyDamage: string;
  negligenceCut: string;
  attendanceRecord: string;
  fullAttendance: string;
  daysLeave: string;
  attendanceBonusEligible: string;
  attendanceBonusNotEligible: string;
  monthlyNotice: string;

  // Net In-Hand Banner
  netPayableTitle: string;
  netPayableSubtitle: string;
  paidAmount: string;
  dueAmount: string;
  fullyPaidStatus: string;
  dueStatusPrefix: string;
  dueStatusSuffix: string;
  accountNormal: string;

  // 4 Stats
  statBaseSalary: string;
  statTotalIncentive: string;
  statTotalCut: string;
  statAdvanceExpenses: string;

  // Quick CTA
  viewDetailedStatement: string;
  nineItemsDescription: string;
  viewSalarySlip: string;
  shareAndPrintSlip: string;

  // Annual Increment Policy
  incrementPolicyTitle: string;
  incrementPolicySubtitle: string;
  incrementBadge: string;
  incrementPolicyIntro: string;
  cond1Title: string;
  cond1Badge: string;
  cond1Desc: string;
  cond2Title: string;
  cond2Badge: string;
  cond2Desc: string;
  incrementNote: string;

  // Statement Tab
  statementTitle: string;
  statementSubtitle: string;
  item1Title: string;
  item1Desc: string;
  item2Title: string;
  item2ListPrompt: string;
  item2Subheader: string;
  item2Rate: string;
  item3Title: string;
  item3ListPrompt: string;
  item3Subheader: string;
  item3Rate: string;
  item4Title: string;
  item4Desc: string;
  item5Title: string;
  item5Eligible: string;
  item5Ineligible: string;
  item6Title: string;
  item6DescPrefix: string;
  item7Title: string;
  item7DescNone: string;
  item7DescCount: string;
  item8Title: string;
  item8Desc: string;
  item9Title: string;
  item9Desc: string;
  netInHandTotal: string;
  officialSlipNotice: string;
  openSlipBtn: string;

  // Salary Slip Modal
  slipPaySlipTitle: string;
  slipMonthlySlip: string;
  staffNameLabel: string;
  staffIdLabel: string;
  roleLabel: string;
  roleValue: string;
  workAreaLabel: string;
  earningsTitle: string;
  deductionsTitle: string;
  grossTotal: string;
  totalDeductions: string;
  netInHandLabel: string;
  paymentMethod: string;
  digitallyVerified: string;
  issueDate: string;
  authorizedSignatory: string;
  shareWhatsApp: string;
  printPdf: string;

  // Water Test Tab
  waterTestTitle: string;
  waterTestSubtitle: string;
  familyMembersLabel: string;
  persons: string;
  weatherLabel: string;
  summer: string;
  normalWeather: string;
  winter: string;
  activityLabel: string;
  activityNormal: string;
  activityHard: string;
  recommendedIntakeTitle: string;
  forMembers: string;
  litresPerDay: string;
  jarsPerMonth: string;
  bestPlan: string;
  shareAdviceBtn: string;
  tdsTestTitle: string;
  tdsPlaceholder: string;
  pdsPurityStatus: string;

  // Settings Tab
  settingsTitle: string;
  dynamicThemingTitle: string;
  dynamicThemingDesc: string;
  appearanceTitle: string;
  lightMode: string;
  darkMode: string;
  systemAuto: string;
  languageTitle: string;
  appStatusTitle: string;
  appInstalled: string;
  browserMode: string;
  installAppBtn: string;
  supportTitle: string;
  logoutBtn: string;
  logoutConfirmTitle: string;
  logoutConfirmDesc: string;
  confirmLogout: string;

  // PWA Banner
  pwaInstallBannerTitle: string;
  pwaInstallBannerDesc: string;
  pwaInstallBtn: string;

  // Additional UI Keys
  loginDemoBtn: string;
  loginQuickTest: string;
  loginQuickFill: string;
  loginPreviewBtn: string;
  helplineShort: string;
  customersUnit: string;
  complaintsUnit: string;
  regularShort: string;
  alternativeShort: string;
  defaultLocation: string;
  networkErrorMsg: string;
  slipSlogan: string;
  slipRegularItem: string;
  slipAltItem: string;
  slipBonusItem: string;
  slipAttendanceItem: string;
  slipLeaveCut: string;
  slipMissedCut: string;
  slipDamageCut: string;
  slipAdvanceCut: string;
  appVersionText: string;
  sendEmail: string;
  areaLabel: string;
  logoPortalBadge: string;
  logoAppBadge: string;

  // Digital ID Card
  idCardBtn: string;
  idCardBtnSub: string;
  idCardModalTitle: string;
  idCardFront: string;
  idCardBack: string;
  idCardFlipHint: string;
  idCardUploadPhoto: string;
  idCardRemovePhoto: string;
  idCardEditDetails: string;
  idCardDownloadPng: string;
  idCardDownloadPdf: string;
  idCardShareBtn: string;
  idCardVerifiedRole: string;
  idCardOrgSubtitle: string;
  idCardBloodGroup: string;
  idCardEmergencyContact: string;
  idCardValidThru: string;
  idCardJoinDate: string;
  idCardAuthNote: string;
  idCardFoundNote: string;
  idCardOfficeAddress: string;
  idCardScanVerify: string;
  idCardSaving: string;
  idCardSavedMsg: string;
  idCardHeaderTitle: string;
  idCardHeaderSub: string;
  idCardVerifiedTag: string;
  idCardRoleBanner: string;
  idCardDeptLabel: string;
  idCardDeptValue: string;
  idCardStatusLabel: string;
  idCardStatusValue: string;
  idCardCycleLabel: string;
  idCardSealTitle: string;
  idCardSealValue: string;
  idCardProudMember: string;
  idCardDobLabel: string;
  idCardJoiningLabel: string;

  // Bookings & Career / Increment & Sidebar extras
  bookingsTitle: string;
  bookingsSubtitle: string;
  bookingsPendingTab: string;
  bookingsDeliveredTab: string;
  bookingsAlertTitle: string;
  bookingsViewBtn: string;
  bookingsEmptyTitle: string;
  bookingsEmptyPending: string;
  bookingsEmptyDelivered: string;
  bookingsTodayBadge: string;
  bookingsPendingBadge: string;
  bookingsUpcomingBadge: string;
  bookingsDoneBadge: string;
  bookingsAllDuty: string;
  bookingsYourDuty: string;
  bookingsDateTimeLabel: string;
  bookingsJarUnit: string;
  bookingsCustomerLabel: string;
  bookingsDueCollectLabel: string;
  bookingsTotalBill: string;
  bookingsAdvancePaid: string;
  bookingsRemainingDue: string;
  bookingsNotePrefix: string;
  bookingsCallBtn: string;
  bookingsNoNumber: string;
  bookingsOpenMapBtn: string;
  bookingsDetailsBtn: string;
  bookingsNoLocation: string;
  bookingsMapLinkAttached: string;

  careerHeaderTitle: string;
  careerTotalRecordBadge: string;
  careerTenureLabel: string;
  careerIncentiveLabel: string;
  careerIncentiveSub: string;
  careerCustomersLabel: string;
  careerIncrementCountLabel: string;
  careerIncrementEarnedSub: string;
  careerIncrementProgressSub: string;
  careerTimesUnit: string;
  incTrackerTitle: string;
  incTrackerSub: string;
  incEligibleBadge: string;
  incInProgressLabel: string;
  incTarget1Tag: string;
  incTarget2Tag: string;
  incTargetCustLabel: string;
  incTargetMonthLabel: string;
  incDoneBadge: string;
  dashIncCardTitle: string;
  dashIncEligibleShort: string;
  changePhotoBtn: string;
  instagramFollowLabel: string;
  instagramFollowBadge: string;
  sidebarBookingsLabel: string;
  sidebarPayslipLabel: string;
  sidebarPayslipNew: string;
  sidebarIncrementLabel: string;
}

const translations: Record<Language, Translations> = {
  hi: {
    appName: 'भारत पेयजल',
    appTagline: 'DRINK PURE, LIVE PURE',
    jalMitra: 'जल मित्र',
    helpline: 'हेल्पलाइन: 7860393198',
    support: 'सपोर्ट',
    call: 'कॉल करें',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    share: 'शेयर करें',
    print: 'प्रिंट करें',
    offlineMode: 'ऑफ़लाइन मोड — कैश्ड डेटा उपलब्ध',
    active: 'सक्रिय',

    tabDashboard: 'डैशबोर्ड',
    tabBookings: 'बुकिंग्स',
    tabStatement: 'वेतन हिसाब',
    tabIncrement: 'रिपोर्ट/नियम',
    tabWaterTest: 'वॉटर टेस्ट',
    tabSettings: 'सेटिंग्स',

    loginTitle: 'जल मित्र स्टाफ लॉगिन',
    loginSubtitle: 'मोबाइल नंबर या Staff ID और 4-अंकों का PIN दर्ज करें',
    loginIdLabel: 'मोबाइल नंबर या STAFF ID',
    loginIdPlaceholder: 'उदा: 7054198443 या BP001',
    loginPinLabel: '4-अंकों का गुप्त PIN',
    loginPinPlaceholder: '••••',
    rememberMe: 'मुझे याद रखें (Auto-Login)',
    secureEncryption: 'सुरक्षित 256-bit',
    openDashboard: 'डैशबोर्ड खोलें',
    loading: 'लोड हो रहा है...',
    authorizedStaffOnly: 'केवल अधिकृत जल मित्र',
    loginFailedMsg: 'लॉगिन असफल रहा। कृपया ID एवं PIN जांचें।',

    hello: 'नमस्ते,',
    idPrefix: 'ID:',
    salaryMonth: 'वेतन माह',
    monthlySummary: 'महीने का हिसाब',
    currentSuffix: '(चालू)',
    performanceReport: 'कार्य रिपोर्ट (Performance)',
    monthlyBadge: 'मासिक रिपोर्ट',
    newCustomers: 'नए ग्राहक',
    regularAlternative: 'रेगुलर + अल्टरनेटिव',
    missedDeliveries: 'छूटी डिलीवरी',
    cutDeducted: 'कटौती हुई',
    penaltyDamage: 'पेनल्टी/नुकसान',
    negligenceCut: 'लापरवाही कटौती',
    attendanceRecord: 'हाज़िरी रिकॉर्ड',
    fullAttendance: '100% हाज़िरी',
    daysLeave: 'दिन छुट्टी',
    attendanceBonusEligible: '+₹200 नकद इनाम मिला',
    attendanceBonusNotEligible: 'इनाम के पात्र नहीं',
    monthlyNotice: 'मासिक समीक्षा: समय पर स्वच्छ पानी पहुंचाएं, शिकायतें शून्य रखें और पूरा इंसेंटिव हासिल करें।',

    netPayableTitle: 'कुल बची शुद्ध सैलरी (NET PAYABLE)',
    netPayableSubtitle: 'इंसेंटिव जोड़कर और एडवांस व कटौतियां काटकर',
    paidAmount: '🟢 भुगतान हुआ (Paid)',
    dueAmount: '🟠 बकाया रकम (Due)',
    fullyPaidStatus: 'पूरा भुगतान हो चुका है',
    dueStatusPrefix: 'शेष ₹',
    dueStatusSuffix: 'बाद में देय है',
    accountNormal: 'हिसाब सामान्य',

    statBaseSalary: 'फिक्स सैलरी',
    statTotalIncentive: 'कुल इंसेंटिव',
    statTotalCut: 'कुल कटौती',
    statAdvanceExpenses: 'एडवांस + खर्चा',

    viewDetailedStatement: 'विस्तृत हिसाब',
    nineItemsDescription: '9 मदों का पूरा ब्यौरा',
    viewSalarySlip: 'वेतन पर्ची (Slip)',
    shareAndPrintSlip: 'शेयर व प्रिंट करें',

    incrementPolicyTitle: 'वार्षिक वेतन वृद्धि नीति (Increment)',
    incrementPolicySubtitle: 'Annual Appraisal & Career Growth',
    incrementBadge: 'सैलरी इंक्रीमेंट',
    incrementPolicyIntro: 'भारत पेयजल में आपकी निष्ठा, ईमानदारी और उत्कृष्ट सेवा का सम्मान करने हेतु वार्षिक वेतन वृद्धि का प्रावधान है। सैलरी इंक्रीमेंट के लिए निम्नलिखित 2 अनिवार्य पात्रता शर्तें पूर्ण करना आवश्यक है:',
    cond1Title: '1 वर्ष का पूर्ण सेवाकाल',
    cond1Badge: '12 माह अनिवार्य',
    cond1Desc: 'कर्मचारी का भारत पेयजल के साथ कम से कम 1 वर्ष (12 माह) का निरंतर, अनुशासित एवं समर्पित कार्यकाल पूरा होना आवश्यक है।',
    cond2Title: 'न्यूनतम 36 नए ग्राहक',
    cond2Badge: '36 ग्राहक / वर्ष',
    cond2Desc: 'पूरे सेवा वर्ष के दौरान न्यूनतम 36 नए सक्रिय ग्राहक संस्था से जोड़ना अनिवार्य है (औसतन केवल 3 ग्राहक प्रति माह)।',
    incrementNote: 'नोट: दोनों शर्तें पूर्ण होने पर वार्षिक समीक्षा (Appraisal) में आपकी सैलरी में सम्मानजनक वृद्धि (Increment) की जाएगी।',

    statementTitle: 'विस्तृत हिसाब विवरण',
    statementSubtitle: 'का 9-मदों का संपूर्ण लेखा-जोखा',
    item1Title: '1. मूल फिक्स वेतन (Base Fixed Salary)',
    item1Desc: 'मासिक बुनियादी वेतन',
    item2Title: '2. नई रेगुलर टंकी इंसेंटिव',
    item2ListPrompt: 'टंकी जुड़ीं • सूची देखने हेतु टैप करें',
    item2Subheader: '📌 जुड़ी हुई नई रेगुलर टंकियां',
    item2Rate: '@ ₹200 प्रति टंकी',
    item3Title: '3. अल्टरनेटिव टंकी इंसेंटिव',
    item3ListPrompt: 'टंकी जुड़ी • सूची देखने हेतु टैप करें',
    item3Subheader: '📌 जुड़ी हुई अल्टरनेटिव टंकियां',
    item3Rate: '@ ₹150 प्रति टंकी',
    item4Title: '4. 200 टंकी बुकिंग धमाका (Target Bonus)',
    item4Desc: 'विशेष मासिक लक्ष्य प्राप्ति इनाम',
    item5Title: '5. 100% हाज़िरी इनाम (Attendance Reward)',
    item5Eligible: 'पात्र (पूरे महीने 0 छुट्टी का नकद उपहार)',
    item5Ineligible: 'अपात्र',
    item6Title: '6. छुट्टी / हाफ डे वेतन कटौती',
    item6DescPrefix: 'दिन अनुपस्थित',
    item7Title: '7. पानी न पहुंचाने पर कटौती (Missed Delivery)',
    item7DescNone: 'कोई शिकायत कटौती नहीं',
    item7DescCount: 'बार पानी की शिकायत',
    item8Title: '8. लापरवाही पर हर्जाना (Penalty)',
    item8Desc: 'जार गुम होना अथवा सामग्री नुकसान',
    item9Title: '9. लिया गया एडवांस + खर्चा',
    item9Desc: 'कार्यालय अग्रिम भुगतान या फील्ड खर्च',
    netInHandTotal: 'कुल शुद्ध देय (Net In-Hand):',
    officialSlipNotice: 'यह पर्ची आधिकारिक वेतन प्रमाण के रूप में मान्य है।',
    openSlipBtn: 'पर्ची खोलें',

    slipPaySlipTitle: 'आधिकारिक वेतन पर्ची (Pay Slip)',
    slipMonthlySlip: 'मासिक वेतन पर्ची',
    staffNameLabel: 'कर्मचारी का नाम:',
    staffIdLabel: 'स्टाफ पहचान संख्या (ID):',
    roleLabel: 'पद / भूमिका:',
    roleValue: 'जल मित्र (डिलीवरी पार्टनर)',
    workAreaLabel: 'कार्य क्षेत्र:',
    earningsTitle: 'अर्जित आय (Earnings)',
    deductionsTitle: 'कटौतियां (Deductions)',
    grossTotal: 'सकल आय (Gross Total):',
    totalDeductions: 'कुल कटौतियां:',
    netInHandLabel: 'शुद्ध देय वेतन (Net In-Hand)',
    paymentMethod: 'बैंक खाता / नकद भुगतान',
    digitallyVerified: 'डिजिटल रूप से सत्यापित एवं अनुमोदित',
    issueDate: 'जारी दिनांक:',
    authorizedSignatory: 'प्राधिकृत हस्ताक्षर',
    shareWhatsApp: 'WhatsApp पर भेजें',
    printPdf: 'प्रिंट / सेव PDF',

    waterTestTitle: 'जल उपभोग एवं TDS कैलकुलेटर',
    waterTestSubtitle: 'ग्राहकों को सही पानी की मात्रा व प्लान समझाने हेतु टूल',
    familyMembersLabel: 'परिवार के सदस्य संख्या:',
    persons: 'व्यक्ति',
    weatherLabel: 'मौसम / तापमान:',
    summer: 'गर्मी (Summer)',
    normalWeather: 'सामान्य',
    winter: 'सर्दी (Winter)',
    activityLabel: 'दैनिक शारीरिक श्रम / कार्य:',
    activityNormal: 'सामान्य घरेलू/कार्यालय',
    activityHard: 'शारीरिक मेहनत / अधिक धूप',
    recommendedIntakeTitle: '📊 अनुशंसित दैनिक जल आवश्यकता',
    forMembers: 'सदस्यों हेतु',
    litresPerDay: 'लीटर / प्रतिदिन',
    jarsPerMonth: 'जार / माह',
    bestPlan: 'सर्वोत्तम प्लान:',
    shareAdviceBtn: 'ग्राहक को WhatsApp पर सलाह भेजें',
    tdsTestTitle: 'TDS मीटर शुद्धता जांच (Drinking Water Quality)',
    tdsPlaceholder: 'TDS दर्ज करें (उदा: 90)',
    pdsPurityStatus: 'शुद्धता स्तर (Purity Status):',

    settingsTitle: 'ऐप सेटिंग्स (Settings)',
    dynamicThemingTitle: 'डायनामिक थीमिंग (Material You Colors)',
    dynamicThemingDesc: 'अपनी पसंद अनुसार ऐप के बटन, हेडर व हाइलाइट्स का मुख्य रंग बदलें:',
    appearanceTitle: 'डार्क एवं लाइट मोड (Appearance)',
    lightMode: 'लाइट (Light)',
    darkMode: 'डार्क (Dark)',
    systemAuto: 'सिस्टम (Auto)',
    languageTitle: 'भाषा (Language)',
    appStatusTitle: 'एंड्रॉइड मोबाइल ऐप स्थिति',
    appInstalled: '📱 ऐप स्थापित है (Installed App)',
    browserMode: 'वेब ब्राउज़र मोड',
    installAppBtn: 'इंस्टॉल करें',
    supportTitle: 'सहायता एवं संस्थागत संपर्क (Support)',
    logoutBtn: 'लॉगआउट करें (Exit App)',
    logoutConfirmTitle: 'क्या आप लॉगआउट करना चाहते हैं?',
    logoutConfirmDesc: 'आपको पुनः लॉगिन करने हेतु PIN दर्ज करना होगा।',
    confirmLogout: 'हाँ, लॉगआउट',

    pwaInstallBannerTitle: 'एंड्रॉइड ऐप इंस्टॉल करें',
    pwaInstallBannerDesc: 'तेज़ स्पीड, ऑफ़लाइन सुविधा एवं फुल-स्क्रीन अनुभव',
    pwaInstallBtn: 'इंस्टॉल',

    loginDemoBtn: 'डेमो डेटा के साथ डैशबोर्ड खोलें →',
    loginQuickTest: 'Google Sheet टेस्ट:',
    loginQuickFill: 'BP001 (PIN 1234) भरें',
    loginPreviewBtn: 'डैशबोर्ड प्रीव्यू देखें (Explore App) →',
    helplineShort: 'हेल्प:',
    customersUnit: 'ग्राहक',
    complaintsUnit: 'शिकायत',
    regularShort: 'रेगुलर',
    alternativeShort: 'अल्टरनेटिव',
    defaultLocation: 'भारत पेयजल हरदोई 🇮🇳',
    networkErrorMsg: 'नेटवर्क कनेक्शन में त्रुटि। कृपया पुनः प्रयास करें।',
    slipSlogan: 'स्वच्छ जल • समृद्ध भारत | हरदोई, उत्तर प्रदेश (पिन: 241001)',
    slipRegularItem: 'रेगुलर टंकी इंसेंटिव:',
    slipAltItem: 'अल्टरनेटिव इंसेंटिव:',
    slipBonusItem: '200 टंकी टारगेट बोनस:',
    slipAttendanceItem: '100% हाज़िरी इनाम:',
    slipLeaveCut: 'छुट्टी वेतन कटौती:',
    slipMissedCut: 'छूटी डिलीवरी जुर्माना:',
    slipDamageCut: 'लापरवाही / नुकसान:',
    slipAdvanceCut: 'अग्रिम / एडवांस लिया:',
    appVersionText: 'वर्जन 2.4 • जल मित्र एडिशन 2026',
    sendEmail: 'ईमेल →',
    areaLabel: 'क्षेत्र:',
    logoPortalBadge: 'जल मित्र आधिकारिक पोर्टल',
    logoAppBadge: 'जल मित्र ऐप',

    idCardBtn: 'डिजिटल ID कार्ड',
    idCardBtnSub: 'आधिकारिक जल मित्र पहचान पत्र',
    idCardModalTitle: 'आधिकारिक जल मित्र पहचान पत्र',
    idCardFront: 'सामने (Front)',
    idCardBack: 'पीछे (Back)',
    idCardFlipHint: 'दूसरी तरफ देखने के लिए कार्ड पर टैप करें',
    idCardUploadPhoto: 'फ़ोटो बदलें',
    idCardRemovePhoto: 'फ़ोटो हटाएं',
    idCardEditDetails: 'विवरण बदलें',
    idCardDownloadPng: 'इमेज सेव (PNG)',
    idCardDownloadPdf: 'प्रिंट PDF',
    idCardShareBtn: 'शेयर करें',
    idCardVerifiedRole: 'अधिकृत जल मित्र',
    idCardOrgSubtitle: 'स्वच्छ जल • समृद्ध भारत',
    idCardBloodGroup: 'ब्लड ग्रुप',
    idCardEmergencyContact: 'आपातकालीन नंबर',
    idCardValidThru: 'वैधता',
    idCardJoinDate: 'जॉइनिंग',
    idCardAuthNote: 'यह प्रमाणित किया जाता है कि इस पहचान पत्र के धारक भारत पेयजल के अधिकृत "जल मित्र" (स्वच्छ पेयजल वितरण प्रतिनिधि) हैं।',
    idCardFoundNote: 'यदि यह कार्ड कहीं मिले, तो कृपया भारत पेयजल कार्यालय हरदोई (241001) या हेल्पलाइन 7860393198 पर सूचित करें।',
    idCardOfficeAddress: 'भारत पेयजल प्लांट, हरदोई, उ.प्र. - 241001',
    idCardScanVerify: 'स्कैन कर सत्यापन करें',
    idCardSaving: 'तैयार हो रहा है...',
    idCardSavedMsg: 'ID कार्ड सफलतापूर्वक सेव हो गया!',
    idCardHeaderTitle: 'भारत पेयजल',
    idCardHeaderSub: 'OFFICIAL IDENTITY CARD',
    idCardVerifiedTag: 'VERIFIED',
    idCardRoleBanner: 'अधिकृत जल मित्र (Official Staff)',
    idCardDeptLabel: 'विभाग (Department)',
    idCardDeptValue: 'शुद्ध पेयजल वितरण',
    idCardStatusLabel: 'सेवा स्थिति (Status)',
    idCardStatusValue: 'सक्रिय (Active)',
    idCardCycleLabel: 'सत्यापन माह (Cycle)',
    idCardSealTitle: 'OFFICIAL SEAL',
    idCardSealValue: 'भारत पेयजल सत्यापित',
    idCardProudMember: '🇮🇳 भारत पेयजल परिवार के गौरवशाली सदस्य',
    idCardDobLabel: 'जन्म तिथि (DOB)',
    idCardJoiningLabel: 'जुड़ने की तिथि (Joining)',

    bookingsTitle: 'शादी / फंक्शन बुकिंग्स',
    bookingsSubtitle: 'तारीख, ग्राहक, जार, लोकेशन और बकाया हिसाब',
    bookingsPendingTab: 'आगामी / पेंडिंग',
    bookingsDeliveredTab: 'पूरी हुई',
    bookingsAlertTitle: 'नई बुकिंग अलर्ट',
    bookingsViewBtn: 'देखें',
    bookingsEmptyTitle: 'कोई बुकिंग नहीं मिली',
    bookingsEmptyPending: 'अभी कोई आगामी शादी या फंक्शन बुकिंग पेंडिंग नहीं है।',
    bookingsEmptyDelivered: 'अभी कोई पूरी हुई बुकिंग दर्ज नहीं है।',
    bookingsTodayBadge: '🔥 आज डिलीवरी!',
    bookingsPendingBadge: '⏰ पेंडिंग',
    bookingsUpcomingBadge: '📅 आगामी',
    bookingsDoneBadge: '✓ डिलीवरी पूर्ण',
    bookingsAllDuty: 'सभी (ALL)',
    bookingsYourDuty: 'आपकी ड्यूटी',
    bookingsDateTimeLabel: 'डिलीवरी तारीख व समय',
    bookingsJarUnit: 'जार',
    bookingsCustomerLabel: 'ग्राहक का नाम',
    bookingsDueCollectLabel: 'बाकी लेने हैं',
    bookingsTotalBill: 'कुल बिल',
    bookingsAdvancePaid: 'एडवांस जमा',
    bookingsRemainingDue: 'बकाया',
    bookingsNotePrefix: 'नोट:',
    bookingsCallBtn: 'कॉल करें',
    bookingsNoNumber: 'नंबर नहीं',
    bookingsOpenMapBtn: 'मैप खोलें',
    bookingsDetailsBtn: 'डिटेल',
    bookingsNoLocation: 'लोकेशन दर्ज नहीं है',
    bookingsMapLinkAttached: 'Google Maps लोकेशन लिंक संलग्न है',

    careerHeaderTitle: 'भारत पेयजल के साथ मेरा सफर',
    careerTotalRecordBadge: 'कुल रिकॉर्ड',
    careerTenureLabel: 'कुल समय',
    careerIncentiveLabel: 'कुल इंसेंटिव कमाया',
    careerIncentiveSub: 'अब तक की कुल कमाई',
    careerCustomersLabel: 'कुल ग्राहक जोड़े',
    careerIncrementCountLabel: 'इंक्रीमेंट मिला',
    careerIncrementEarnedSub: 'वार्षिक इंक्रीमेंट अर्जित',
    careerIncrementProgressSub: 'पहला लक्ष्य प्रगति पर',
    careerTimesUnit: 'बार',
    incTrackerTitle: 'मेरी वेतन वृद्धि प्रगति',
    incTrackerSub: 'Live Increment Tracker',
    incEligibleBadge: '🎉 पात्र (Eligible)',
    incInProgressLabel: 'प्रगति पर',
    incTarget1Tag: 'लक्ष्य 1 • नए ग्राहक',
    incTarget2Tag: 'लक्ष्य 2 • सेवाकाल',
    incTargetCustLabel: 'लक्ष्य: 36',
    incTargetMonthLabel: 'लक्ष्य: 12 माह',
    incDoneBadge: '✓ पूर्ण',
    dashIncCardTitle: 'वेतन वृद्धि प्रगति',
    dashIncEligibleShort: 'पात्र ✓',
    changePhotoBtn: 'फोटो बदलें',
    instagramFollowLabel: 'Instagram पर फॉलो करें',
    instagramFollowBadge: 'Follow',
    sidebarBookingsLabel: 'शादी / फंक्शन बुकिंग्स',
    sidebarPayslipLabel: 'मेरी सैलरी स्लिप (Payslip)',
    sidebarPayslipNew: 'नया',
    sidebarIncrementLabel: 'मेरी रिपोर्ट व इंक्रीमेंट',
  },
  en: {
    appName: 'Bharat Payjal',
    appTagline: 'DRINK PURE, LIVE PURE',
    jalMitra: 'Jal Mitra',
    helpline: 'Helpline: 7860393198',
    support: 'Support',
    call: 'Call Now',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    share: 'Share',
    print: 'Print',
    offlineMode: 'Offline Mode — Cached data active',
    active: 'Active',

    tabDashboard: 'Home',
    tabBookings: 'Bookings',
    tabStatement: 'Salary',
    tabIncrement: 'Career',
    tabWaterTest: 'Water',
    tabSettings: 'Settings',

    loginTitle: 'Jal Mitra Staff Login',
    loginSubtitle: 'Enter Mobile Number or Staff ID and 4-digit PIN',
    loginIdLabel: 'Mobile Number or STAFF ID',
    loginIdPlaceholder: 'e.g. 7054198443 or BP001',
    loginPinLabel: '4-Digit Secret PIN',
    loginPinPlaceholder: '••••',
    rememberMe: 'Remember Me (Auto-Login)',
    secureEncryption: '256-bit Secure',
    openDashboard: 'Open Dashboard',
    loading: 'Loading...',
    authorizedStaffOnly: 'Authorized Jal Mitra Only',
    loginFailedMsg: 'Login failed. Please verify ID and PIN.',

    hello: 'Hello,',
    idPrefix: 'ID:',
    salaryMonth: 'Salary Month',
    monthlySummary: 'Monthly Statement',
    currentSuffix: '(Current)',
    performanceReport: 'Performance Report',
    monthlyBadge: 'Monthly Report',
    newCustomers: 'New Customers',
    regularAlternative: 'Regular + Alternative',
    missedDeliveries: 'Missed Deliveries',
    cutDeducted: 'Deducted',
    penaltyDamage: 'Penalty / Damage',
    negligenceCut: 'Negligence Cut',
    attendanceRecord: 'Attendance Record',
    fullAttendance: '100% Attendance',
    daysLeave: 'Days on Leave',
    attendanceBonusEligible: '+₹200 Cash Reward Earned',
    attendanceBonusNotEligible: 'Not eligible for reward',
    monthlyNotice: 'Monthly Review: Ensure timely pure water deliveries, keep complaints zero, and claim maximum incentives.',

    netPayableTitle: 'TOTAL NET IN-HAND (NET PAYABLE)',
    netPayableSubtitle: 'Including all incentives and after advance & penalty deductions',
    paidAmount: '🟢 Paid Amount',
    dueAmount: '🟠 Pending Due',
    fullyPaidStatus: 'Fully Paid & Cleared',
    dueStatusPrefix: 'Balance ₹',
    dueStatusSuffix: 'is payable soon',
    accountNormal: 'Account Normal',

    statBaseSalary: 'Base Salary',
    statTotalIncentive: 'Total Incentive',
    statTotalCut: 'Total Deductions',
    statAdvanceExpenses: 'Advance + Expenses',

    viewDetailedStatement: 'Detailed Statement',
    nineItemsDescription: 'Full breakdown of 9 financial heads',
    viewSalarySlip: 'Salary Slip',
    shareAndPrintSlip: 'Share & Print',

    incrementPolicyTitle: 'Annual Increment Policy',
    incrementPolicySubtitle: 'Annual Appraisal & Career Growth',
    incrementBadge: 'Salary Increment',
    incrementPolicyIntro: 'Bharat Payjal honors your loyalty, dedication, and service with an annual increment. Meeting these 2 mandatory eligibility criteria is required:',
    cond1Title: '1 Year Completed Service',
    cond1Badge: '12 Months Mandatory',
    cond1Desc: 'Staff must complete at least 1 year (12 months) of continuous, disciplined, and dedicated service with Bharat Payjal.',
    cond2Title: 'Minimum 36 New Customers',
    cond2Badge: '36 Customers / Year',
    cond2Desc: 'Onboard a minimum of 36 active customers during the service year (an average of just 3 customers per month).',
    incrementNote: 'Note: Upon satisfying both conditions, an honorable salary increment is granted in the annual appraisal.',

    statementTitle: 'Detailed Statement Breakdown',
    statementSubtitle: 'Complete 9-item financial accounting',
    item1Title: '1. Fixed Base Salary',
    item1Desc: 'Monthly baseline wages',
    item2Title: '2. New Regular Tanki Incentive',
    item2ListPrompt: 'tankis added • Tap to view list',
    item2Subheader: '📌 Newly Added Regular Tankis',
    item2Rate: '@ ₹200 per tanki',
    item3Title: '3. Alternative Tanki Incentive',
    item3ListPrompt: 'tankis added • Tap to view list',
    item3Subheader: '📌 Newly Added Alternative Tankis',
    item3Rate: '@ ₹150 per tanki',
    item4Title: '4. 200 Tanki Booking Target Bonus',
    item4Desc: 'Special monthly target achievement reward',
    item5Title: '5. 100% Attendance Reward',
    item5Eligible: 'Eligible (Full month 0 leave reward)',
    item5Ineligible: 'Ineligible',
    item6Title: '6. Leave / Half-Day Deduction',
    item6DescPrefix: 'days absent',
    item7Title: '7. Missed Water Delivery Penalty',
    item7DescNone: 'No missed delivery penalties',
    item7DescCount: 'missed delivery reports',
    item8Title: '8. Material Damage / Lost Jar Penalty',
    item8Desc: 'Negligence or lost jar deduction',
    item9Title: '9. Advance Drawn + Field Expenses',
    item9Desc: 'Office advance or field petty cash',
    netInHandTotal: 'Total Net In-Hand:',
    officialSlipNotice: 'This slip is valid as official salary documentation.',
    openSlipBtn: 'Open Slip',

    slipPaySlipTitle: 'Official Pay Slip',
    slipMonthlySlip: 'Monthly Salary Slip',
    staffNameLabel: 'Staff Name:',
    staffIdLabel: 'Staff ID:',
    roleLabel: 'Designation / Role:',
    roleValue: 'Jal Mitra (Delivery Partner)',
    workAreaLabel: 'Service Zone:',
    earningsTitle: 'Earnings',
    deductionsTitle: 'Deductions',
    grossTotal: 'Gross Total:',
    totalDeductions: 'Total Deductions:',
    netInHandLabel: 'Net Payable In-Hand',
    paymentMethod: 'Bank Transfer / Cash Payment',
    digitallyVerified: 'Digitally Verified & Approved',
    issueDate: 'Issue Date:',
    authorizedSignatory: 'Authorized Signatory',
    shareWhatsApp: 'Send on WhatsApp',
    printPdf: 'Print / Save PDF',

    waterTestTitle: 'Water Intake & TDS Calculator',
    waterTestSubtitle: 'Tool to advise customers on optimal hydration and plan',
    familyMembersLabel: 'Family Member Count:',
    persons: 'Persons',
    weatherLabel: 'Weather / Season:',
    summer: 'Summer',
    normalWeather: 'Normal',
    winter: 'Winter',
    activityLabel: 'Daily Activity Level:',
    activityNormal: 'Normal Desk / Home',
    activityHard: 'Active Labor / Sun Exertion',
    recommendedIntakeTitle: '📊 Recommended Daily Hydration',
    forMembers: 'For members',
    litresPerDay: 'Litres / Day',
    jarsPerMonth: 'Jars / Month',
    bestPlan: 'Best Plan:',
    shareAdviceBtn: 'Send Advice on WhatsApp',
    tdsTestTitle: 'TDS Purity Meter (Drinking Water Quality)',
    tdsPlaceholder: 'Enter TDS reading (e.g. 90)',
    pdsPurityStatus: 'Purity Level:',

    settingsTitle: 'App Settings',
    dynamicThemingTitle: 'Dynamic Theming (Material You Colors)',
    dynamicThemingDesc: 'Change the primary accent color across buttons, headers, and highlights:',
    appearanceTitle: 'Dark & Light Mode',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemAuto: 'System Auto',
    languageTitle: 'Language (भाषा)',
    appStatusTitle: 'Android Mobile App Status',
    appInstalled: '📱 App Installed (Standalone)',
    browserMode: 'Web Browser Mode',
    installAppBtn: 'Install App',
    supportTitle: 'Help & Corporate Support',
    logoutBtn: 'Logout (Exit App)',
    logoutConfirmTitle: 'Do you want to logout?',
    logoutConfirmDesc: 'You will need to enter your PIN to login again.',
    confirmLogout: 'Yes, Logout',

    pwaInstallBannerTitle: 'Install Android App',
    pwaInstallBannerDesc: 'Fast speed, offline capability, and edge-to-edge full screen',
    pwaInstallBtn: 'Install',

    loginDemoBtn: 'Open Dashboard with Sample Data →',
    loginQuickTest: 'Google Sheet Test:',
    loginQuickFill: 'Fill BP001 (PIN 1234)',
    loginPreviewBtn: 'Explore App Preview →',
    helplineShort: 'Help:',
    customersUnit: 'Customers',
    complaintsUnit: 'Complaints',
    regularShort: 'Regular',
    alternativeShort: 'Alternative',
    defaultLocation: 'Bharat Payjal Hardoi 🇮🇳',
    networkErrorMsg: 'Network connection error. Please try again.',
    slipSlogan: 'Pure Water • Healthy India | Hardoi, Uttar Pradesh (PIN: 241001)',
    slipRegularItem: 'Regular Tanki Incentive:',
    slipAltItem: 'Alternative Incentive:',
    slipBonusItem: '200 Tanki Target Bonus:',
    slipAttendanceItem: '100% Attendance Reward:',
    slipLeaveCut: 'Leave Salary Deduction:',
    slipMissedCut: 'Missed Delivery Penalty:',
    slipDamageCut: 'Negligence / Damage:',
    slipAdvanceCut: 'Advance Taken:',
    appVersionText: 'Version 2.4 • Jal Mitra Edition 2026',
    sendEmail: 'Email →',
    areaLabel: 'Zone:',
    logoPortalBadge: 'Jal Mitra Official Portal',
    logoAppBadge: 'Jal Mitra App',

    idCardBtn: 'Digital ID Card',
    idCardBtnSub: 'Official Jal Mitra Identity Badge',
    idCardModalTitle: 'Official Jal Mitra ID Card',
    idCardFront: 'Front Side',
    idCardBack: 'Back Side',
    idCardFlipHint: 'Tap card to flip front / back',
    idCardUploadPhoto: 'Change Photo',
    idCardRemovePhoto: 'Remove',
    idCardEditDetails: 'Edit Details',
    idCardDownloadPng: 'Save Image (PNG)',
    idCardDownloadPdf: 'Print PDF',
    idCardShareBtn: 'Share Card',
    idCardVerifiedRole: 'Authorized Jal Mitra',
    idCardOrgSubtitle: 'Pure Water • Healthy India',
    idCardBloodGroup: 'Blood Group',
    idCardEmergencyContact: 'Emergency Contact',
    idCardValidThru: 'Valid Thru',
    idCardJoinDate: 'Joined',
    idCardAuthNote: 'This certifies that the bearer is an authorized "Jal Mitra" (Pure Drinking Water Delivery Representative) of Bharat Payjal.',
    idCardFoundNote: 'If found, please return to Bharat Payjal Office, Hardoi (241001) or report to Helpline 7860393198.',
    idCardOfficeAddress: 'Bharat Payjal Plant, Hardoi, U.P. - 241001',
    idCardScanVerify: 'Scan to Verify',
    idCardSaving: 'Preparing...',
    idCardSavedMsg: 'ID Card saved successfully!',
    idCardHeaderTitle: 'Bharat Payjal',
    idCardHeaderSub: 'OFFICIAL IDENTITY CARD',
    idCardVerifiedTag: 'VERIFIED',
    idCardRoleBanner: 'Authorized Jal Mitra (Official Staff)',
    idCardDeptLabel: 'Department',
    idCardDeptValue: 'Pure Water Delivery',
    idCardStatusLabel: 'Service Status',
    idCardStatusValue: 'Active',
    idCardCycleLabel: 'Verification Cycle',
    idCardSealTitle: 'OFFICIAL SEAL',
    idCardSealValue: 'Bharat Payjal Verified',
    idCardProudMember: '🇮🇳 Proud Member of Bharat Payjal Family',
    idCardDobLabel: 'Date of Birth (DOB)',
    idCardJoiningLabel: 'Joining Date',

    bookingsTitle: 'Wedding / Function Bookings',
    bookingsSubtitle: 'Date, customer, jars, location & balance due',
    bookingsPendingTab: 'Upcoming / Pending',
    bookingsDeliveredTab: 'Completed',
    bookingsAlertTitle: 'New Booking Alert',
    bookingsViewBtn: 'View',
    bookingsEmptyTitle: 'No Bookings Found',
    bookingsEmptyPending: 'No upcoming wedding or function bookings pending.',
    bookingsEmptyDelivered: 'No completed bookings recorded yet.',
    bookingsTodayBadge: '🔥 Today!',
    bookingsPendingBadge: '⏰ Pending',
    bookingsUpcomingBadge: '📅 Upcoming',
    bookingsDoneBadge: '✓ Delivered',
    bookingsAllDuty: 'All Staff (ALL)',
    bookingsYourDuty: 'Your Duty',
    bookingsDateTimeLabel: 'Delivery Date & Time',
    bookingsJarUnit: 'Jars',
    bookingsCustomerLabel: 'Customer Name',
    bookingsDueCollectLabel: 'Balance Due',
    bookingsTotalBill: 'Total Bill',
    bookingsAdvancePaid: 'Advance Paid',
    bookingsRemainingDue: 'Due',
    bookingsNotePrefix: 'Note:',
    bookingsCallBtn: 'Call',
    bookingsNoNumber: 'No Number',
    bookingsOpenMapBtn: 'Open Map',
    bookingsDetailsBtn: 'Details',
    bookingsNoLocation: 'Location not entered',
    bookingsMapLinkAttached: 'Google Maps location link attached',

    careerHeaderTitle: 'My Journey with Bharat Payjal',
    careerTotalRecordBadge: 'Lifetime Record',
    careerTenureLabel: 'Total Tenure',
    careerIncentiveLabel: 'Total Incentive Earned',
    careerIncentiveSub: 'Lifetime incentive earned',
    careerCustomersLabel: 'Total Customers Added',
    careerIncrementCountLabel: 'Increments Earned',
    careerIncrementEarnedSub: 'Annual increment achieved',
    careerIncrementProgressSub: 'First milestone in progress',
    careerTimesUnit: 'Times',
    incTrackerTitle: 'My Increment Progress',
    incTrackerSub: 'Live Increment Tracker',
    incEligibleBadge: '🎉 Eligible',
    incInProgressLabel: 'In Progress',
    incTarget1Tag: 'Target 1 • New Customers',
    incTarget2Tag: 'Target 2 • Tenure',
    incTargetCustLabel: 'Target: 36',
    incTargetMonthLabel: 'Target: 12 Mo',
    incDoneBadge: '✓ Done',
    dashIncCardTitle: 'Salary Increment Progress',
    dashIncEligibleShort: 'Eligible ✓',
    changePhotoBtn: 'Change Photo',
    instagramFollowLabel: 'Follow on Instagram',
    instagramFollowBadge: 'Follow',
    sidebarBookingsLabel: 'Wedding / Function Bookings',
    sidebarPayslipLabel: 'My Salary Slip (Payslip)',
    sidebarPayslipNew: 'New',
    sidebarIncrementLabel: 'My Career & Increment',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bp_app_lang');
    return (saved as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bp_app_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const next: Language = language === 'hi' ? 'en' : 'hi';
    setLanguage(next);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'hi' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.hi,
    };
  }
  return context;
};

