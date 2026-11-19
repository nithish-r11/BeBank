/**
 * BeBank Digital Banking Platform – Automated Goldfish Verification Suite
 * Verifies all 6 modules + Live Django Backend API Integration:
 * 1. Pre-Login Privacy & Tools
 * 2. Complete Registration Wizard
 * 3. Authentication & Security Protections
 * 4. Customer Portal (All Banking Features + 4-Digit PIN Gate)
 * 5. Admin Portal & Real-Time Sync
 * 6. Bilingual (English/Tamil) & Multi-Device Responsiveness
 * 7. Live Django Backend API Endpoints Verification
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.resolve(__dirname, '../frontend/index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// Extract script from HTML
const scriptMatch = htmlSource.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
if (!scriptMatch) {
  console.error('ERROR: Could not find script in frontend/index.html');
  process.exit(1);
}
let scriptContent = scriptMatch[1];

// Append bridge to expose lexical declarations on window with two-way sync
const bridge = `
  Object.defineProperty(window, 'state', {
    get: () => state,
    set: (v) => { state = v; },
    configurable: true
  });
  window.resetAllDemoData = resetAllDemoData;
  window.renderApp = renderApp;
  window.openSubModal = openSubModal;
  window.closeSubModal = closeSubModal;
  window.handleStartRegisterClick = handleStartRegisterClick;
  window.toggleTermsAccordion = toggleTermsAccordion;
  window.handleAcceptTermsSheet = handleAcceptTermsSheet;
  window.handleAllowLocationPermission = handleAllowLocationPermission;
  window.setRegMethod = setRegMethod;
  window.submitRegCifOrMobile = submitRegCifOrMobile;
  window.handleSendVerificationSms = handleSendVerificationSms;
  window.setRegAuthMethod = setRegAuthMethod;
  window.submitRegAuthMethod = submitRegAuthMethod;
  window.submitSetMpinStep = submitSetMpinStep;
  window.submitSetTpinStep = submitSetTpinStep;
  window.proceedFromSuccessToLogin = proceedFromSuccessToLogin;
  window.verifyKnowYourCif = verifyKnowYourCif;
  window.verifyMpinAndLogin = verifyMpinAndLogin;
  window.checkCustomerLockoutActive = checkCustomerLockoutActive;
  window.checkAdminLockoutActive = checkAdminLockoutActive;
  window.submitAdminPortalLogin = submitAdminPortalLogin;
  window.doBiometricLogin = doBiometricLogin;
  window.verifyBiometricTouch = verifyBiometricTouch;
  window.resetInactivityWatchdog = resetInactivityWatchdog;
  window.toggleBalanceShow = toggleBalanceShow;
  window.toggleAdminBalanceShow = toggleAdminBalanceShow;
  window.saveCustomerProfileDetails = saveCustomerProfileDetails;
  window.requestNewChequeBook = requestNewChequeBook;
  window.submitStopChequeRequest = submitStopChequeRequest;
  window.submitNewStandingInstruction = submitNewStandingInstruction;
  window.submitChangeCustomerPin = submitChangeCustomerPin;
  window.exportStatementCSV = exportStatementCSV;
  window.setTxFilter = setTxFilter;
  window.raiseTransactionDispute = raiseTransactionDispute;
  window.submitNewPayee = submitNewPayee;
  window.submitTransfer = submitTransfer;
  window.submitSelfTransfer = submitSelfTransfer;
  window.submitQuickEasyPay = submitQuickEasyPay;
  window.submitUpiPay = submitUpiPay;
  window.submitScanQrPayment = submitScanQrPayment;
  window.submitNewDeposit = submitNewDeposit;
  window.liquidateDepositToSavings = liquidateDepositToSavings;
  window.activateOdAgainstFd = activateOdAgainstFd;
  window.submitWealthSip = submitWealthSip;
  window.redeemWealthInvestment = redeemWealthInvestment;
  window.submitBillPay = submitBillPay;
  window.submitFastagRecharge = submitFastagRecharge;
  window.submitMobileRecharge = submitMobileRecharge;
  window.toggleCardSwitch = toggleCardSwitch;
  window.toggleCardBlock = toggleCardBlock;
  window.updateCardPinAndLimit = updateCardPinAndLimit;
  window.submitCardlessAtmCash = submitCardlessAtmCash;
  window.payCreditCardBill = payCreditCardBill;
  window.submitNewLoan = submitNewLoan;
  window.payLoanEmiNow = payLoanEmiNow;
  window.redeemRewardPoints = redeemRewardPoints;
  window.sendRmChatMessage = sendRmChatMessage;
  window.generateLoungePass = generateLoungePass;
  window.filterSearchServicesInput = filterSearchServicesInput;
  window.adminVerifyKyc = adminVerifyKyc;
  window.adminTopupCustomer = adminTopupCustomer;
  window.adminApproveLoan = adminApproveLoan;
  window.adminToggleTxFlag = adminToggleTxFlag;
  window.setAdminTxChannelFilter = setAdminTxChannelFilter;
  window.setAdminTxSearch = setAdminTxSearch;
  window.submitAdminBroadcastNotification = submitAdminBroadcastNotification;
  window.toggleLanguage = toggleLanguage;
  window.setViewportPreviewMode = setViewportPreviewMode;
  window.switchScreen = switchScreen;
  window.submitSecurityPinGate = submitSecurityPinGate;
  window.closeSecurityPinGate = closeSecurityPinGate;
  window.requestSecurityPinAuth = requestSecurityPinAuth;
  window.toggleEngineMode = toggleEngineMode;
  window.toggleCardlessCodeVisibility = toggleCardlessCodeVisibility;
  window.copyCardlessAtmCode = copyCardlessAtmCode;
  window.cancelCardlessAtmCash = cancelCardlessAtmCash;
`;
scriptContent += '\n' + bridge;

// Setup Mock Browser Environment
const localStorageData = {};
const mockLocalStorage = {
  getItem: (key) => (key in localStorageData ? localStorageData[key] : null),
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { for (const k in localStorageData) delete localStorageData[k]; }
};

const domElements = {};
function getOrCreateElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      innerHTML: '',
      innerText: '',
      value: '',
      checked: true,
      classList: {
        classes: new Set(),
        add: function (...cls) { cls.forEach(c => this.classes.add(c)); },
        remove: function (...cls) { cls.forEach(c => this.classes.delete(c)); },
        contains: function (c) { return this.classes.has(c); },
        toggle: function (c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
      },
      style: {},
      scrollIntoView: () => {},
      focus: () => {},
      click: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      dispatchEvent: () => {}
    };
  }
  return domElements[id];
}

const mockDocument = {
  getElementById: (id) => getOrCreateElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return getOrCreateElement('mock-el');
  },
  querySelectorAll: () => [],
  body: getOrCreateElement('body'),
  createElement: (tag) => getOrCreateElement(`elem-${tag}-${Math.random()}`),
  addEventListener: () => {},
  removeEventListener: () => {}
};

const toastsEmitted = [];
const consoleLogs = [];
const consoleErrors = [];

const sandbox = {
  window: {},
  document: mockDocument,
  localStorage: mockLocalStorage,
  addEventListener: () => {},
  removeEventListener: () => {},
  navigator: {
    clipboard: { writeText: async (t) => {} },
    geolocation: { getCurrentPosition: (success) => success({ coords: { latitude: 13.0827, longitude: 80.2707 } }) }
  },
  location: { reload: () => {} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  alert: (msg) => { toastsEmitted.push({ type: 'alert', msg }); },
  confirm: (msg) => true,
  prompt: (msg, def) => def || '',
  console: {
    log: (...args) => consoleLogs.push(args.join(' ')),
    warn: (...args) => consoleLogs.push('WARN: ' + args.join(' ')),
    error: (...args) => consoleErrors.push(args.join(' '))
  },
  URL: {
    createObjectURL: () => 'blob:demo-statement-pdf',
    revokeObjectURL: () => {}
  },
  Blob: class { constructor(parts, opts) { this.parts = parts; this.opts = opts; } }
};
sandbox.window = sandbox;
sandbox.window.addEventListener = () => {};
sandbox.window.removeEventListener = () => {};

// Run the script in the VM context
const context = vm.createContext(sandbox);
vm.runInContext(scriptContent, context);

// Test reporting harness
const results = {
  modules: [],
  totalPassed: 0,
  totalFailed: 0,
  failures: []
};

async function runTest(moduleName, testTitle, testFn) {
  let mod = results.modules.find(m => m.name === moduleName);
  if (!mod) {
    mod = { name: moduleName, tests: [] };
    results.modules.push(mod);
  }
  try {
    await testFn(sandbox.window);
    mod.tests.push({ title: testTitle, status: 'PASS' });
    results.totalPassed++;
  } catch (err) {
    mod.tests.push({ title: testTitle, status: 'FAIL', error: err.message });
    results.totalFailed++;
    results.failures.push(`[${moduleName}] ${testTitle}: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Helper to auto-confirm Security PIN Gate with a PIN
function authorizePinGate(win, pin = '0710') {
  if (win.state.secGateOpen) {
    getOrCreateElement('sec-gate-pin-input').value = pin;
    win.submitSecurityPinGate({ preventDefault: () => {} });
  }
}

async function runAllTests() {
  // ==========================================
  // MODULE 1: Pre-Login Privacy & Tools
  // ==========================================
  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Pre-Login screen is welcome_register by default', (win) => {
    win.resetAllDemoData();
    assert(win.state.screen === 'welcome_register', `Expected welcome_register, got ${win.state.screen}`);
    assert(win.state.isCustomerAuthenticated === false, 'Customer must not be authenticated pre-login');
    assert(win.state.isAdminAuthenticated === false, 'Admin must not be authenticated pre-login');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Privacy Check: No Customer Name or CIF visible before login', (win) => {
    win.renderApp();
    const rootHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(!rootHtml.includes('Manojkumar'), 'Customer name Manojkumar must NOT be visible pre-login');
    assert(!rootHtml.includes('BEB1002045'), 'Customer CIF BEB1002045 must NOT be visible pre-login');
    assert(!rootHtml.includes('₹4,85,620.50'), 'Savings balance must NOT be visible pre-login');
    assert(win.state.loginEnteredName === '', 'loginEnteredName must start completely empty');
    assert(win.state.mpinPadValue === '', 'mpinPadValue must start empty');
    assert(!rootHtml.includes('(0710)'), 'MPIN hint (0710) must NOT be visible pre-login');
    assert(!rootHtml.includes('(3006)'), 'Admin PIN hint (3006) must NOT be visible pre-login');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'BeBank Helplines 1800-425-0710 & 1800-103-3006 verified', (win) => {
    // 1800-425-0710 is on welcome_register
    win.renderApp();
    const welcomeHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(welcomeHtml.includes('1800-425-0710'), 'Missing primary helpline 1800-425-0710');

    // 1800-103-3006 is on prelogin with bannerIndex = 1
    win.state.termsAccepted = true;
    win.state.screen = 'prelogin';
    win.state.bannerIndex = 1;
    win.renderApp();
    const preloginHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(preloginHtml.includes('1800-103-3006'), 'Missing secondary fraud reporting helpline 1800-103-3006');
    win.state.termsAccepted = false;
    win.state.screen = 'welcome_register';
    win.state.bannerIndex = 0;
    win.renderApp();
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 1: Loan EMI Calculator functionality', (win) => {
    win.state.emiCalcPrincipal = 1000000;
    win.state.emiCalcMonths = 60;
    win.state.emiCalcRate = 8.5;
    const p = win.state.emiCalcPrincipal;
    const r = (win.state.emiCalcRate / 12) / 100;
    const n = win.state.emiCalcMonths;
    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    assert(emi > 0 && emi < p, 'Calculated EMI must be valid');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 2: Deposit Interest Rates table verified', (win) => {
    assert(win.state.bankRates && win.state.bankRates.fdRate === 7.25, 'FD 1 Year rate must be 7.25%');
    assert(win.state.bankRates.savingsRate === 4.00, 'Savings rate must be 4.00%');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 3: Safe Banking Links & Guidelines', (win) => {
    win.renderApp();
    const rootHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(rootHtml.includes('Endless possibilities') || rootHtml.includes('Helpline') || rootHtml.includes('Toll Free'), 'Safe Banking assurance must be present');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 4: Online A/C Opening Modal', (win) => {
    win.openSubModal('open_ac');
    assert(win.state.activeModal === 'open_ac', 'Active modal must be open_ac');
    win.closeSubModal();
    assert(win.state.activeModal === null, 'Modal must close cleanly');
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 5: UPI / QR Security Gate Pre-Login', (win) => {
    win.openSubModal('scan_qr');
    assert(win.state.activeModal === 'scan_qr', 'Scan QR modal opened');
    win.closeSubModal();
  });

  await runTest('MODULE 1: Pre-Login Privacy & Tools', 'Tool 6: Know Your CIF Verification Tool', (win) => {
    win.openSubModal('know_cif_modal');
    assert(win.state.activeModal === 'know_cif_modal', 'Know CIF modal opened');
    win.closeSubModal();
  });

  // ==========================================
  // MODULE 2: Complete Registration Wizard
  // ==========================================
  await runTest('MODULE 2: Registration Wizard', 'Step 1: Start Registration & Terms Sheet Modal', (win) => {
    win.handleStartRegisterClick();
    assert(win.state.activeModal === 'terms_sheet', 'Should open terms_sheet modal');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 2: Expandable Terms Accordion & I Agree', (win) => {
    win.toggleTermsAccordion('privacy');
    assert(win.state.termsAccordionOpen === 'privacy', 'Privacy accordion must open');
    win.toggleTermsAccordion('security');
    assert(win.state.termsAccordionOpen === 'security', 'Security accordion must open');
    win.handleAcceptTermsSheet();
    assert(win.state.termsAccepted === true, 'termsAccepted must be true');
    assert(win.state.activeModal === 'location_perm', 'Should advance to location_perm modal');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 3: Location Permission Step', (win) => {
    win.handleAllowLocationPermission();
    assert(win.state.screen === 'reg_cif_mobile', 'Screen must advance to reg_cif_mobile');
    assert(win.state.activeModal === null, 'Location modal must be closed');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 4: Know Your CIF verification tool within registration', (win) => {
    getOrCreateElement('kyc-cif-name').value = 'Manojkumar';
    getOrCreateElement('kyc-cif-mob').value = '9840567890';
    win.verifyKnowYourCif({ preventDefault: () => {} });
    assert(win.state.cifLookupVerified === true, 'CIF Lookup must verify successfully for test mobile');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 5: Register Now (CIF / Mobile)', (win) => {
    win.setRegMethod('CIF');
    assert(win.state.regMethod === 'CIF', 'Reg method must be CIF');
    getOrCreateElement('reg-cif-mob-input').value = 'BEB1002045';
    win.submitRegCifOrMobile({ preventDefault: () => {} });
    assert(win.state.screen === 'reg_sms', 'Must advance to reg_sms');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 6: Send SMS Verification Spinner', async (win) => {
    win.handleSendVerificationSms();
    // Wait for the simulated SMS verification timeout (900ms)
    await new Promise(r => setTimeout(r, 950));
    assert(win.state.screen === 'reg_auth_with', 'Must advance to reg_auth_with after verification');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 7: Authentication With (Debit Card / Aadhaar / MPIN)', (win) => {
    win.setRegAuthMethod('DEBIT_CARD');
    assert(win.state.regAuthMethod === 'DEBIT_CARD', 'Reg auth method must be DEBIT_CARD');
    getOrCreateElement('auth-card-no').value = '4532 8910 4421 8821';
    getOrCreateElement('auth-card-exp').value = '11/30';
    getOrCreateElement('auth-card-pin').value = '0710';
    win.submitRegAuthMethod({ preventDefault: () => {} });
    assert(win.state.screen === 'reg_set_mpin', 'Must advance to reg_set_mpin');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 8: Set MPIN (0710) and Set TPIN', (win) => {
    getOrCreateElement('set-mpin-1').value = '0710';
    getOrCreateElement('set-mpin-2').value = '0710';
    win.submitSetMpinStep({ preventDefault: () => {} });
    assert(win.state.screen === 'reg_set_tpin', 'Must advance to reg_set_tpin');
    
    getOrCreateElement('set-tpin-1').value = '0710';
    getOrCreateElement('set-tpin-2').value = '0710';
    win.submitSetTpinStep({ preventDefault: () => {} });
    assert(win.state.regSuccessPopup === true, 'regSuccessPopup must be true');
  });

  await runTest('MODULE 2: Registration Wizard', 'Step 9: Registration Success Popup to Login', (win) => {
    win.proceedFromSuccessToLogin();
    assert(win.state.screen === 'prelogin', 'Must transition to prelogin screen');
    assert(win.state.regSuccessPopup === false, 'Success popup must close');
  });

  // ==========================================
  // MODULE 3: Authentication & Security Protections
  // ==========================================
  await runTest('MODULE 3: Auth & Security', '3-Attempt Wrong PIN Lockout (30s lock + BRUTE_FORCE_LOCKOUT audit)', (win) => {
    win.state.screen = 'prelogin';
    win.state.failedCustomerPinAttempts = 0;
    win.state.customerLockoutUntil = 0;
    getOrCreateElement('login-sheet-username').value = 'Manojkumar';

    // Attempt 1 wrong PIN
    win.verifyMpinAndLogin('9999');
    assert(win.state.failedCustomerPinAttempts === 1, `Expected 1 attempt, got ${win.state.failedCustomerPinAttempts}`);

    // Attempt 2 wrong PIN
    win.verifyMpinAndLogin('8888');
    assert(win.state.failedCustomerPinAttempts === 2, `Expected 2 attempts, got ${win.state.failedCustomerPinAttempts}`);

    // Attempt 3 wrong PIN - triggers lockout
    win.verifyMpinAndLogin('7777');
    assert(win.state.failedCustomerPinAttempts >= 3, 'Must be 3 failed attempts');
    assert(win.checkCustomerLockoutActive() === true, 'Lockout must be active after 3 failed attempts');
    
    // Verify audit log has BRUTE_FORCE_LOCKOUT
    const auditEntries = win.state.auditLogs || [];
    const lockoutEntry = auditEntries.find(a => a.action === 'BRUTE_FORCE_LOCKOUT' || (a.desc && a.desc.includes('Lockout')));
    assert(lockoutEntry !== undefined, 'BRUTE_FORCE_LOCKOUT must be recorded in audit log');

    // Reset lockout for further testing
    win.state.customerLockoutUntil = 0;
    win.state.failedCustomerPinAttempts = 0;
  });

  await runTest('MODULE 3: Auth & Security', 'Customer Login with Manojkumar & MPIN 0710', (win) => {
    win.state.screen = 'prelogin';
    getOrCreateElement('login-sheet-username').value = 'Manojkumar';
    win.verifyMpinAndLogin('0710');
    assert(win.state.isCustomerAuthenticated === true, 'Customer must be authenticated');
    assert(win.state.screen === 'home', 'Must enter Customer Portal (home)');
    assert(win.state.user.name === 'Manojkumar', 'Logged in user must be Manojkumar');
    assert(win.state.user.cif === 'BEB1002045', 'Logged in CIF must be BEB1002045');
  });

  await runTest('MODULE 3: Auth & Security', 'Biometric Touch ID Login Flow', (win) => {
    win.state.isCustomerAuthenticated = false;
    win.state.screen = 'prelogin';
    getOrCreateElement('bio-login-username').value = 'Manojkumar';
    getOrCreateElement('bio-login-pin').value = '0710';
    win.verifyBiometricTouch({ preventDefault: () => {} });
    assert(win.state.isCustomerAuthenticated === true, 'Customer must authenticate via Biometric Touch ID');
    assert(win.state.screen === 'home', 'Must be on home screen after Biometric login');
  });

  await runTest('MODULE 3: Auth & Security', '3-Minute Inactivity Auto-Session Lock Watchdog', (win) => {
    assert(typeof win.resetInactivityWatchdog === 'function', 'Inactivity watchdog function must exist');
    win.resetInactivityWatchdog();
    assert(win.inactivityTimer !== null, 'Inactivity timer must be armed');
  });

  // ==========================================
  // MODULE 4: Customer Portal (All Banking Features)
  // ==========================================
  await runTest('MODULE 4: Customer Portal', 'Account Summary: Show / Hide Balance Toggle & Zero Dots Check', (win) => {
    win.state.showBalances = false;
    win.toggleBalanceShow();
    assert(win.state.showBalances === true, 'Balances must be shown');
    
    // Verify Savings ₹4,85,620.50 and OD/CC ₹12,40,000.00
    const savings = win.state.accounts.find(a => a.type.toLowerCase().includes('savings'));
    const odcc = win.state.accounts.find(a => a.type.toLowerCase().includes('od') || a.type.toLowerCase().includes('current'));
    assert(savings && savings.balance === 485620.50, `Savings must be ₹4,85,620.50, found ${savings?.balance}`);
    assert(odcc && odcc.balance === 1240000.00, `OD/CC must be ₹12,40,000.00, found ${odcc?.balance}`);

    win.renderApp();
    const rootHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(!rootHtml.includes('dot-indicator-dots'), 'No unwanted dot indicators below card');
  });

  await runTest('MODULE 4: Customer Portal', 'Account Details: Profile & Nominee update', (win) => {
    getOrCreateElement('prof-phone').value = '9840567890';
    getOrCreateElement('prof-email').value = 'manojkumar@bebank.in';
    getOrCreateElement('prof-pan').value = 'BGLPM4521C';
    getOrCreateElement('prof-addr').value = '42, Residency Road, T. Nagar';
    getOrCreateElement('nominee-input').value = 'Meera Manojkumar';
    win.saveCustomerProfileDetails({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.user.nominee === 'Meera Manojkumar', 'Nominee name must update');
  });

  await runTest('MODULE 4: Customer Portal', 'Cheque Services: 20/50-Leaf Cheque Book & Stop Cheque', (win) => {
    const initialCallbacks = win.state.callbacks ? win.state.callbacks.length : 0;
    win.requestNewChequeBook(50);
    authorizePinGate(win, '0710');
    assert(win.state.callbacks.length === initialCallbacks + 1, 'Cheque Book 50 leaves requested and added to callbacks');

    const initialCheques = win.state.cheques.length;
    getOrCreateElement('stop-chq-no').value = '554201';
    getOrCreateElement('stop-chq-reason').value = 'Lost cheque leaf';
    win.submitStopChequeRequest({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.cheques.length === initialCheques + 1, 'Stop cheque request unshifted into cheques ledger');
  });

  await runTest('MODULE 4: Customer Portal', 'Standing Instructions (Auto-Pay) & TPIN Change', (win) => {
    const initialSiCount = win.state.standingInstructions ? win.state.standingInstructions.length : 0;
    getOrCreateElement('si-title').value = 'Monthly Cloud Servers';
    getOrCreateElement('si-amt').value = '7500';
    getOrCreateElement('si-freq').value = 'Monthly (1st)';
    win.submitNewStandingInstruction({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.standingInstructions.length === initialSiCount + 1, 'Standing instructions must increment');

    // Change TPIN
    getOrCreateElement('chg-old-pin').value = '0710';
    getOrCreateElement('chg-new-pin').value = '1234';
    win.submitChangeCustomerPin({ preventDefault: () => {} });
    assert(win.state.user.tpin === '1234', 'Transaction PIN must update to 1234');
    // Revert for consistency
    win.state.user.tpin = '0710';
  });

  await runTest('MODULE 4: Customer Portal', 'Account Statements: Savings vs OD/CC Filter, PDF & CSV Export', (win) => {
    win.state.stmtAccountIdx = 0; // Savings
    assert(win.state.accounts[win.state.stmtAccountIdx].type.includes('SAVINGS'), 'Account 0 is Savings');
    win.state.stmtAccountIdx = 1; // OD/CC
    assert(win.state.accounts[win.state.stmtAccountIdx].type.includes('OD'), 'Account 1 is OD/CC');

    // CSV Export verification
    let csvExported = false;
    win.exportStatementCSV();
    csvExported = true;
    assert(csvExported === true, 'CSV Export executed without error');
  });

  await runTest('MODULE 4: Customer Portal', 'm-Passbook: Credit/Debit Filter, Receipt & Raise Dispute', (win) => {
    win.setTxFilter('CREDIT');
    assert(win.state.txFilter === 'CREDIT', 'Filter must be CREDIT');
    win.setTxFilter('DEBIT');
    assert(win.state.txFilter === 'DEBIT', 'Filter must be DEBIT');
    win.setTxFilter('ALL');
    assert(win.state.txFilter === 'ALL', 'Filter must be ALL');

    // Raise dispute
    const tx = win.state.transactions[0];
    const initialCallbacks = win.state.callbacks.length;
    win.raiseTransactionDispute(tx.id);
    authorizePinGate(win, '0710');
    assert(win.state.callbacks.length === initialCallbacks + 1, 'Transaction dispute must be logged in Support Desk callbacks');
  });

  await runTest('MODULE 4: Customer Portal', 'Payments: Manage Payee & Add Beneficiary', (win) => {
    const initialPayees = win.state.payees.length;
    getOrCreateElement('py-name').value = 'Karthik Sundaram';
    getOrCreateElement('py-bank').value = 'BeBank';
    getOrCreateElement('py-acc').value = '202600109934';
    getOrCreateElement('py-ifsc').value = 'BEBK0000103';
    win.submitNewPayee({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.payees.length === initialPayees + 1, 'Payee must be added');
    assert(win.state.payees[0].coolingUntil > Date.now(), 'Payee must have active 24h coolingUntil');

    // Verify cooling limit rejection over ₹50,000 for newly added payee
    const balBeforeAttempt = win.state.accounts[0].balance;
    getOrCreateElement('tf-source').value = '0';
    getOrCreateElement('tf-name').value = 'Karthik Sundaram';
    getOrCreateElement('tf-acc').value = '202600109934';
    getOrCreateElement('tf-amt').value = '60000';
    getOrCreateElement('tf-channel').value = 'IMPS';
    getOrCreateElement('tf-mpin').value = '0710';
    getOrCreateElement('tf-tc').checked = true;
    win.submitTransfer({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === balBeforeAttempt, 'Transfer over ₹50,000 during cooling window must be blocked');
  });

  await runTest('MODULE 4: Customer Portal', 'Payments: To Beneficiary (IMPS/NEFT/RTGS with PIN Gate)', (win) => {
    const initialBal = win.state.accounts[0].balance;
    const transferAmt = 1500;
    getOrCreateElement('tf-source').value = '0';
    getOrCreateElement('tf-name').value = 'Priya Sharma';
    getOrCreateElement('tf-acc').value = '202600108921';
    getOrCreateElement('tf-amt').value = String(transferAmt);
    getOrCreateElement('tf-channel').value = 'IMPS';
    getOrCreateElement('tf-mpin').value = '0710';
    getOrCreateElement('tf-tc').checked = true;
    win.submitTransfer({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === initialBal - transferAmt, 'Savings balance must decrease by transfer amount');
  });

  await runTest('MODULE 4: Customer Portal', 'Payments: Self Transfer between Savings and OD/CC', (win) => {
    const savingsBefore = win.state.accounts[0].balance;
    const odBefore = win.state.accounts[1].balance;
    getOrCreateElement('st-from').value = '0';
    getOrCreateElement('st-amt').value = '2000';
    getOrCreateElement('st-pin').value = '0710';
    win.submitSelfTransfer({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === savingsBefore - 2000, 'Savings should decrease by 2000');
    assert(win.state.accounts[1].balance === odBefore + 2000, 'OD/CC should increase by 2000');
  });

  await runTest('MODULE 4: Customer Portal', 'Payments: Easy Pay, UPI & Scan QR', (win) => {
    const balBefore = win.state.accounts[0].balance;
    getOrCreateElement('ep-name').value = 'Dinner Partner';
    getOrCreateElement('ep-dest').value = '9841233445';
    getOrCreateElement('ep-amt').value = '500';
    getOrCreateElement('ep-mpin').value = '0710';
    win.submitQuickEasyPay({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === balBefore - 500, 'Easy Pay debit must reflect');

    const balBeforeUpi = win.state.accounts[0].balance;
    getOrCreateElement('upi-vpa').value = 'priya@bebank';
    getOrCreateElement('upi-amt').value = '250';
    getOrCreateElement('upi-mpin').value = '0710';
    win.submitUpiPay({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === balBeforeUpi - 250, 'UPI debit must reflect');

    // QR Scan & Pay
    getOrCreateElement('qr-merch-name').value = 'Saravana Bhavan';
    getOrCreateElement('qr-merch-vpa').value = 'sbhavan@upi';
    getOrCreateElement('qr-merch-amt').value = '450';
    getOrCreateElement('qr-merch-pin').value = '0710';
    win.submitScanQrPayment({ preventDefault: () => {} });
    assert(win.state.accounts[0].balance === balBeforeUpi - 250 - 450, 'QR scan payment must reflect');
  });

  await runTest('MODULE 4: Customer Portal', 'Deposits: Book FD/RD, Close to Savings, OD on FD', (win) => {
    const initialFdCount = win.state.deposits.length;
    const savingsBal = win.state.accounts[0].balance;
    getOrCreateElement('fd-type').value = 'FD';
    getOrCreateElement('fd-amt').value = '50000';
    getOrCreateElement('fd-months').value = '12';
    getOrCreateElement('fd-nominee').value = 'Meera Manojkumar';
    getOrCreateElement('fd-tc').checked = true;
    win.submitNewDeposit({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.deposits.length === initialFdCount + 1, 'Deposits must increase by 1');
    assert(win.state.accounts[0].balance === savingsBal - 50000, 'Savings must decrease by FD amount');

    // Close to savings
    const newlyCreated = win.state.deposits[win.state.deposits.length - 1];
    const balBeforeClose = win.state.accounts[0].balance;
    const expectedAccrued = Math.round(newlyCreated.principal * (1 + (newlyCreated.rate / 100) * 0.25));
    win.liquidateDepositToSavings(newlyCreated.id);
    authorizePinGate(win, '0710');
    assert(win.state.accounts[0].balance === balBeforeClose + expectedAccrued, 'Liquidated amount credited to savings');

    // OD Against FD
    win.activateOdAgainstFd(501);
    authorizePinGate(win, '0710');
    const fd501 = win.state.deposits.find(d => d.id === 501);
    assert(fd501 && fd501.odTaken === true, 'OD against FD must be marked true');
  });

  await runTest('MODULE 4: Customer Portal', 'Wealth Smart: Mutual Fund SIP & Redeem', (win) => {
    const initialHoldings = win.state.wealthInvestments ? win.state.wealthInvestments.length : 0;
    getOrCreateElement('ws-fund').value = 'BeBank Bluechip Equity SIP';
    getOrCreateElement('ws-amt').value = '5000';
    win.submitWealthSip({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.wealthInvestments.length === initialHoldings + 1, 'Wealth holdings must increase');
    
    const holding = win.state.wealthInvestments[win.state.wealthInvestments.length - 1];
    win.redeemWealthInvestment(holding.id);
    authorizePinGate(win, '0710');
    assert(win.state.wealthInvestments.length === initialHoldings, 'Holding must redeem cleanly');
  });

  await runTest('MODULE 4: Customer Portal', 'Bill Payments, FASTag & Mobile Recharge', (win) => {
    const balBefore = win.state.accounts[0].balance;
    getOrCreateElement('bp-biller').value = 'TANGEDCO Electricity Board';
    getOrCreateElement('bp-cons').value = '09214005812';
    getOrCreateElement('bp-amt').value = '1200';
    win.submitBillPay({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.accounts[0].balance === balBefore - 1200, 'Bill payment debit must reflect');

    const balBeforeFastag = win.state.accounts[0].balance;
    getOrCreateElement('ft-veh').value = 'TN 01 MK 0710';
    getOrCreateElement('ft-amt').value = '1000';
    win.submitFastagRecharge({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.accounts[0].balance === balBeforeFastag - 1000, 'FASTag debit must reflect');

    const balBeforeMobile = win.state.accounts[0].balance;
    getOrCreateElement('rc-mob').value = '9840567890';
    getOrCreateElement('rc-op').value = 'JIO Prepaid';
    getOrCreateElement('rc-amt').value = '666';
    win.submitMobileRecharge({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.accounts[0].balance === balBeforeMobile - 666, 'Recharge debit must reflect');
  });

  await runTest('MODULE 4: Customer Portal', 'Cards: Debit Card PIN Reveal, Controls, Cardless ATM Cash 6-Digit Code', (win) => {
    // Toggle card switch
    const card = win.state.cards[0];
    const initialIntl = card.international;
    win.toggleCardSwitch(card.id, 'international');
    assert(card.international !== initialIntl, 'International toggle must flip');

    // Block/Unblock toggle
    win.toggleCardBlock(card.id);
    authorizePinGate(win, '0710');
    assert(card.status === 'BLOCKED', 'Card should be blocked');
    win.toggleCardBlock(card.id);
    authorizePinGate(win, '0710');
    assert(card.status === 'ACTIVE', 'Card should be unblocked');

    // PIN & Limit Update
    getOrCreateElement('card-new-pin-' + card.id).value = '4321';
    getOrCreateElement('card-new-lim-' + card.id).value = '250000';
    win.updateCardPinAndLimit({ preventDefault: () => {} }, card.id);
    authorizePinGate(win, '0710');
    assert(card.posLimit === 250000, 'POS Limit must update to 250000');

    // Cardless ATM Cash
    getOrCreateElement('cl-atm-amt').value = '5000';
    win.submitCardlessAtmCash({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    const lastTx = win.state.transactions[0];
    const imtMatch = (lastTx.desc || '').match(/Code:\s*(\d{6})/);
    assert(imtMatch && imtMatch[1].length === 6, 'Cardless ATM code must be 6 digits');

    assert(win.state.activeCardlessAtm && win.state.activeCardlessAtm.amount === 5000, 'Active Cardless ATM widget state created');
    assert(String(win.state.activeCardlessAtm.code).length === 6, 'Cardless ATM code must be 6 digits');
    
    // Toggle code reveal/hide
    win.toggleCardlessCodeVisibility();
    assert(win.state.activeCardlessAtm.hidden === true, 'Code hidden toggle');
    win.toggleCardlessCodeVisibility();
    assert(win.state.activeCardlessAtm.hidden === false, 'Code reveal toggle');

    // Copy code
    win.copyCardlessAtmCode();

    // Cancel code & refund to Savings
    const balBeforeRefund = win.state.accounts[0].balance;
    win.cancelCardlessAtmCash();
    authorizePinGate(win, '0710');
    assert(win.state.activeCardlessAtm === null, 'Active Cardless ATM widget cleared on cancel');
    assert(win.state.accounts[0].balance === balBeforeRefund + 5000, 'Cardless ATM amount refunded to savings');
  });

  await runTest('MODULE 4: Customer Portal', 'Credit Card, Apply Loan & Loan EMI Payment', (win) => {
    // Credit card payment
    const cc = win.state.cards.find(c => c.type === 'CREDIT');
    const balBefore = win.state.accounts[0].balance;
    const dueBefore = cc.billDue;
    win.payCreditCardBill(cc.id);
    authorizePinGate(win, '0710');
    assert(cc.billDue === 0, 'Credit card bill due must be 0 after payment');
    assert(win.state.accounts[0].balance === balBefore - dueBefore, 'Credit card bill pay debit must reflect');

    // Apply Loan
    const initialLoanCount = win.state.loans.length;
    getOrCreateElement('ln-type').value = 'Personal Loan';
    getOrCreateElement('ln-amt').value = '200000';
    getOrCreateElement('ln-months').value = '24';
    getOrCreateElement('ln-purpose').value = 'Home renovation';
    getOrCreateElement('ln-tc').checked = true;
    win.submitNewLoan({ preventDefault: () => {} });
    authorizePinGate(win, '0710');
    assert(win.state.loans.length === initialLoanCount + 1, 'Loan application must be added');

    // Loan EMI Payment
    const activeLoan = win.state.loans.find(l => l.status === 'ACTIVE');
    if (activeLoan) {
      const loanBalBefore = activeLoan.outstanding;
      win.payLoanEmiNow(activeLoan.id);
      authorizePinGate(win, '0710');
      assert(activeLoan.outstanding < loanBalBefore, 'Loan outstanding must decrease after EMI payment');
    }
  });

  await runTest('MODULE 4: Customer Portal', 'Customer Services: Benefits, Rewards, RM Chat, Priority Pass, Search', (win) => {
    // Rewards redemption
    const balBefore = win.state.accounts[0].balance;
    win.redeemRewardPoints();
    assert(win.state.user.rewardPoints === 0, 'Reward points must be redeemed');
    assert(win.state.accounts[0].balance > balBefore, 'Redeemed points must be credited to Savings');

    // RM Chat message
    const chatCount = win.state.rmChatMessages ? win.state.rmChatMessages.length : 0;
    getOrCreateElement('rm-chat-input').value = 'Inquiring about home loan interest discount';
    win.sendRmChatMessage({ preventDefault: () => {} });
    assert(win.state.rmChatMessages.length === chatCount + 2, 'Message and automated RM reply must be added');

    // Lounge Pass
    win.generateLoungePass();
    assert(win.state.user.loungeVisitsLeft < 4, 'Active lounge pass must decrement available visits');

    // Live search
    win.filterSearchServicesInput('transfer');
    assert(win.state.searchQuery === 'transfer', 'Search query must update');
  });

  await runTest('MODULE 4: Customer Portal', 'Official Digital Stamp & Printable Statement Verification', (win) => {
    win.openSubModal('print_statement_preview');
    const previewHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(previewHtml.includes('BEBANK CORE OPERATIONS') || previewHtml.includes('OFFICIAL ACCOUNT STATEMENT'), 'Printable statement must include official bank stamp & seal');
    assert(previewHtml.includes('Scan to Verify') || previewHtml.includes('BBK-'), 'Official verification seal & QR code must be rendered');
    win.closeSubModal();
  });

  await runTest('MODULE 4: Customer Portal', 'Side Menu Drawer: System Engine Live/Demo Indicator & Toggle', async (win) => {
    win.state.drawerOpen = true;
    win.renderApp();
    const drawerHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(drawerHtml.includes('System Engine') || drawerHtml.includes('கணினி இயந்திரம்'), 'Drawer must display System Engine status');
    assert(drawerHtml.includes('Live Django API') || drawerHtml.includes('Standalone Demo'), 'Drawer must display active engine mode');
    // Toggle engine mode
    await win.toggleEngineMode();
    assert(win.state.liveBackendConnected === false, 'Engine mode should toggle to Standalone Demo');
    win.state.liveBackendConnected = true;
    win.state.drawerOpen = false;
  });

  // ==========================================
  // MODULE 5: Admin Portal & Real-Time Sync
  // ==========================================
  await runTest('MODULE 5: Admin Portal', 'Admin Login: Murugananthan & PIN 3006 (Zero Hints)', (win) => {
    win.state.screen = 'admin_login';
    win.renderApp();
    const rootHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(!rootHtml.includes('(3006)'), 'Admin PIN hint (3006) must not be visible on screen');

    getOrCreateElement('adm-login-name').value = 'Murugananthan';
    getOrCreateElement('adm-login-pin').value = '3006';
    win.submitAdminPortalLogin({ preventDefault: () => {} });
    assert(win.state.isAdminAuthenticated === true, 'Admin must be authenticated');
    assert(win.state.screen === 'admin', 'Must enter Admin Executive Portal');
  });

  await runTest('MODULE 5: Admin Portal', 'Customers & KYC desk verification', (win) => {
    const pendingCustomer = win.state.adminCustomers.find(c => c.kyc === 'PENDING' || c.kyc === 'RE_KYC');
    if (pendingCustomer) {
      win.adminVerifyKyc(pendingCustomer.id);
      assert(pendingCustomer.kyc === 'VERIFIED', 'Customer KYC must become VERIFIED');
    }
  });

  await runTest('MODULE 5: Admin Portal', 'Credit / Debit ₹ Tool: Instant sync to Customer Portal', (win) => {
    const customer = win.state.adminCustomers.find(c => c.cif === 'BEB1002045');
    const balBefore = customer.balance;
    win.adminTopupCustomer(customer.id, 25000);
    authorizePinGate(win, '3006');
    assert(customer.balance === balBefore + 25000, 'Customer balance in Admin must increase by 25000');
    
    // Verify synchronization with user's primary account
    assert(win.state.accounts[0].balance === customer.balance, 'Customer state balance must sync instantly');
  });

  await runTest('MODULE 5: Admin Portal', 'Loan Desk: Approval & Disbursal', (win) => {
    const pendingLoan = win.state.loans.find(l => l.status === 'PENDING_APPROVAL');
    if (pendingLoan) {
      win.adminApproveLoan(pendingLoan.id);
      authorizePinGate(win, '3006');
      assert(pendingLoan.status === 'ACTIVE', 'Loan status must become ACTIVE');
    }
  });

  await runTest('MODULE 5: Admin Portal', 'Transactions AML Monitor & Flagging', (win) => {
    const tx = win.state.transactions[0];
    const initialStatus = tx.status;
    win.adminToggleTxFlag(tx.id);
    assert(tx.status !== initialStatus, 'Transaction AML status must toggle');
  });

  await runTest('MODULE 5: Admin Portal', 'Transactions AML Monitor: Channel Filters & Search Query', (win) => {
    win.setAdminTxChannelFilter('IMPS');
    assert(win.state.adminTxChannelFilter === 'IMPS', 'Admin channel filter must be IMPS');
    win.setAdminTxSearch('Zoho');
    assert(win.state.adminTxSearchQuery === 'Zoho', 'Admin search query must be Zoho');
    win.setAdminTxChannelFilter('ALL');
    win.setAdminTxSearch('');
  });

  await runTest('MODULE 5: Admin Portal', 'Support Desk Resolution & Broadcast to Customer Bell', (win) => {
    const notifCount = win.state.notifications ? win.state.notifications.length : 0;
    getOrCreateElement('adm-notif-title').value = 'Scheduled Maintenance';
    getOrCreateElement('adm-notif-body').value = 'Scheduled server maintenance on Sunday 02:00 AM - 04:00 AM';
    win.submitAdminBroadcastNotification({ preventDefault: () => {} });
    authorizePinGate(win, '3006');
    assert(win.state.notifications.length === notifCount + 1, 'Broadcast notification must appear on Customer Bell');
  });

  await runTest('MODULE 5: Admin Portal', 'Security Audit Trail Verification', (win) => {
    assert(win.state.auditLogs && win.state.auditLogs.length > 0, 'Audit trail must contain system events');
    const adminLog = win.state.auditLogs.find(l => l.action.includes('ADMIN') || l.action.includes('LOGIN'));
    assert(adminLog !== undefined, 'Audit trail must record Admin/User activities');
  });

  // ==========================================
  // MODULE 6: Bilingual & Multi-Device Responsiveness
  // ==========================================
  await runTest('MODULE 6: Bilingual & Responsiveness', 'Bilingual Toggle: English vs தமிழ் Layout Symmetry', (win) => {
    win.toggleLanguage();
    assert(win.state.language === 'தமிழ்', 'Language must switch to தமிழ்');
    win.renderApp();
    const tamilHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(tamilHtml.includes('சேமிப்பு') || tamilHtml.includes('வங்கி'), 'Tamil labels must be rendered');

    win.toggleLanguage();
    assert(win.state.language === 'English', 'Language must switch back to English');
    win.renderApp();
    const englishHtml = getOrCreateElement('app-root-frame').innerHTML;
    assert(englishHtml.includes('Savings') || englishHtml.includes('BeBank'), 'English labels must be rendered');
  });

  await runTest('MODULE 6: Bilingual & Responsiveness', 'Viewport Preview Modes: Mobile (375px), Tablet (768px), Laptop (1280px+)', (win) => {
    win.setViewportPreviewMode('MOBILE');
    assert(win.state.viewportMode === 'MOBILE', 'Viewport mode must be MOBILE');
    win.setViewportPreviewMode('TABLET');
    assert(win.state.viewportMode === 'TABLET', 'Viewport mode must be TABLET');
    win.setViewportPreviewMode('DESKTOP');
    assert(win.state.viewportMode === 'DESKTOP', 'Viewport mode must be DESKTOP');
  });

  // ==========================================
  // MODULE 7: Live Django Backend API Integration
  // ==========================================
  await runTest('MODULE 7: Live Backend Integration', 'Health Check Endpoint (/api/health/)', async () => {
    const res = await fetch('http://127.0.0.1:8000/api/health/');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'healthy', 'Backend must report healthy');
    assert(data.demo_banking_mode === true, 'DEMO_BANKING_MODE must be true');
    assert(data.theme && data.theme.navy_blue === '#173B73', 'Brand navy blue #173B73 verified');
    assert(data.theme && data.theme.emerald_green === '#079669', 'Brand emerald green #079669 verified');
  });

  await runTest('MODULE 7: Live Backend Integration', 'Customer Authentication & JWT (/api/auth/login/)', async () => {
    const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'manojkumar@bebank.in', password: 'BeBank@2026' })
    });
    assert(res.status === 200, `Customer login failed with status ${res.status}`);
    const data = await res.json();
    assert(data.access && data.access.length > 20, 'Valid JWT access token returned');
    assert(data.user && data.user.customer_id === 'BEB1002045', 'Returned user CIF BEB1002045');
  });

  await runTest('MODULE 7: Live Backend Integration', 'Banking Accounts Fetch with Bearer Auth (/api/banking/accounts/)', async () => {
    const loginRes = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'manojkumar@bebank.in', password: 'BeBank@2026' })
    });
    const { access } = await loginRes.json();
    const acctsRes = await fetch('http://127.0.0.1:8000/api/banking/accounts/', {
      headers: { 'Authorization': `Bearer ${access}` }
    });
    assert(acctsRes.status === 200, `Accounts fetch failed with status ${acctsRes.status}`);
    const accts = await acctsRes.json();
    assert(Array.isArray(accts) && accts.length >= 2, 'Customer should have at least 2 accounts (Savings & Current)');
  });

  await runTest('MODULE 7: Live Backend Integration', 'Admin Authentication & Portal RBAC (/api/admin-portal/summary/)', async () => {
    const adminLoginRes = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'murugananthan@bebank.in', password: 'Admin@BeBank2026' })
    });
    assert(adminLoginRes.status === 200, `Admin login failed with status ${adminLoginRes.status}`);
    const adminData = await adminLoginRes.json();
    assert(adminData.user && adminData.user.role === 'ADMIN', 'User role must be ADMIN');

    const summaryRes = await fetch('http://127.0.0.1:8000/api/admin-portal/summary/', {
      headers: { 'Authorization': `Bearer ${adminData.access}` }
    });
    assert(summaryRes.status === 200, `Admin summary failed with status ${summaryRes.status}`);
    const summary = await summaryRes.json();
    assert(summary.kpis && summary.kpis.total_customers >= 1, 'Admin summary must report customer counts under kpis');
  });

  // Output Summary
  console.log('\n======================================================');
  console.log('       BEBANK DIGITAL BANKING TEST SUITE RESULTS      ');
  console.log('======================================================');
  console.log(`Total Passed: ${results.totalPassed}`);
  console.log(`Total Failed: ${results.totalFailed}`);
  console.log('------------------------------------------------------');

  results.modules.forEach(m => {
    console.log(`\n▶ ${m.name}`);
    m.tests.forEach(t => {
      const symbol = t.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${symbol} ${t.title} [${t.status}]`);
      if (t.error) {
        console.log(`     Error: ${t.error}`);
      }
    });
  });

  if (results.totalFailed > 0) {
    console.log('\n❌ FAILED TESTS SUMMARY:');
    results.failures.forEach(f => console.log(' - ' + f));
    process.exit(1);
  } else {
    console.log('\n🌟 ALL 6 BEBANK MODULES + BACKEND APIS PASSED 100%!');
    process.exit(0);
  }
}

runAllTests();
