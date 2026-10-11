/**
 * HemoPulse - Blood Donor Finder
 * Main Application Logic & API Client
 */

// Dynamically determine API Base URL
const API_BASE = window.location.port === '5000' ? '/api' : 'http://localhost:5000/api';

// Authentication Session Helpers
function getToken() {
  return localStorage.getItem('hemopulse_token');
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('hemopulse_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveUserSession(token, user) {
  localStorage.setItem('hemopulse_token', token);
  localStorage.setItem('hemopulse_user', JSON.stringify(user));
}

function clearUserSession() {
  localStorage.removeItem('hemopulse_token');
  localStorage.removeItem('hemopulse_user');
  window.location.reload();
}

// Toast Notifications System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[22px]">${icons[type] || 'info'}</span>
    <span class="flex-1 font-medium">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-700 ml-2">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4500);
}

// Reusable Modal Component
function openModal(title, contentHtml) {
  let modalOverlay = document.getElementById('global-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'global-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-box p-6 relative">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 id="global-modal-title" class="text-xl font-bold text-gray-900"></h3>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-700 p-1 rounded-lg">
            <span class="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <div id="global-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.getElementById('global-modal-title').textContent = title;
  document.getElementById('global-modal-content').innerHTML = contentHtml;
  modalOverlay.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('global-modal-overlay');
  if (modal) modal.classList.remove('active');
}

// Update Header Authentication & Navigation State
function setupNavbar() {
  const user = getCurrentUser();
  const authNavContainer = document.getElementById('nav-auth-container');
  if (authNavContainer) {
    if (user) {
      authNavContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col text-right">
            <span class="font-bold text-sm text-gray-900 leading-tight">${user.name}</span>
            <span class="text-xs text-primary font-semibold uppercase tracking-wider">${user.role}</span>
          </div>
          <a href="dashboard.html" class="p-2 text-primary hover:bg-red-50 rounded-lg transition-colors" title="Go to Dashboard">
            <span class="material-symbols-outlined text-[22px]">space_dashboard</span>
          </a>
          <button onclick="clearUserSession()" class="text-xs font-semibold px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      `;
    } else {
      authNavContainer.innerHTML = `
        <a href="login.html" class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
          Sign In
        </a>
        <a href="register.html" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container shadow-sm transition-all">
          <span class="material-symbols-outlined text-[18px]">favorite</span>
          Become Donor
        </a>
      `;
    }
  }

  // Active page link highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
      link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
      link.classList.remove('text-on-surface-variant');
    }
  });
}

// Live Ticker Feed
async function loadEmergencyTicker() {
  const tickerContainer = document.getElementById('live-sos-ticker');
  if (!tickerContainer) return;

  try {
    const res = await fetch(`${API_BASE}/requests/recent`);
    const json = await res.json();
    if (json.success && json.data.length > 0) {
      tickerContainer.innerHTML = json.data.map(req => `
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-red-200">local_hospital</span>
          <strong>${req.urgency.toUpperCase()}:</strong> ${req.bloodGroup} needed at ${req.hospitalName} (${req.city}) • ${req.units} Units
        </span>
        <span class="opacity-50">/</span>
      `).join('');
    }
  } catch (err) {
    console.warn('Ticker load notice:', err.message);
  }
}

// Live Statistics Loader
async function loadImpactStats() {
  const totalDonorsEl = document.getElementById('stat-total-donors');
  const availableDonorsEl = document.getElementById('stat-available-donors');

  try {
    const res = await fetch(`${API_BASE}/donors/stats/overview`);
    const json = await res.json();
    if (json.success && json.data) {
      if (totalDonorsEl) totalDonorsEl.textContent = Number(json.data.totalDonors).toLocaleString() + '+';
      if (availableDonorsEl) availableDonorsEl.textContent = Number(json.data.availableDonors).toLocaleString() + ' Active';
    }
  } catch (e) {
    console.warn('Stats load notice:', e.message);
  }
}

// Load Urgent Blood Requests on Index Spotlight
async function loadSpotlightRequests() {
  const container = document.getElementById('spotlight-requests-grid');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/requests/recent`);
    const json = await res.json();
    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.slice(0, 3).map(r => {
        let badgeColor = 'bg-primary text-on-primary';
        let barColor = 'bg-primary';
        if (r.bloodGroup.includes('B')) {
          badgeColor = 'bg-tertiary-container text-on-tertiary-container';
          barColor = 'bg-tertiary-container';
        } else if (r.bloodGroup.includes('AB')) {
          badgeColor = 'bg-secondary text-on-secondary';
          barColor = 'bg-secondary';
        }

        return `
          <article class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute top-0 left-0 right-0 h-1.5 ${barColor}"></div>
            <div>
              <div class="flex items-start justify-between gap-2 mb-space-md">
                <div>
                  <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md mb-2">
                    <span class="pulse-dot mr-1"></span>
                    ${r.urgency} Requirement
                  </div>
                  <h3 class="font-title-md text-title-md text-on-surface font-bold">${r.reason || 'Medical Requisition'}</h3>
                  <p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span class="material-symbols-outlined text-[16px] text-primary">local_hospital</span>
                    ${r.hospitalName}, ${r.city}
                  </p>
                </div>
                <div class="h-12 w-12 rounded-xl ${badgeColor} font-blood-group-tag text-blood-group-tag flex items-center justify-center shrink-0 shadow-md font-bold">
                  ${r.bloodGroup}
                </div>
              </div>
              <div class="grid grid-cols-2 gap-space-sm p-space-md bg-surface-container-low rounded-lg mb-space-md">
                <div>
                  <span class="font-label-md text-label-md text-on-surface-variant block uppercase">Units Needed</span>
                  <span class="font-title-md text-title-md text-primary font-bold">${r.units} Units</span>
                </div>
                <div>
                  <span class="font-label-md text-label-md text-on-surface-variant block uppercase">Patient</span>
                  <span class="font-body-md text-body-md text-on-surface font-medium truncate">${r.patientName}</span>
                </div>
                <div class="col-span-2 pt-1 border-t-0 flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <span class="material-symbols-outlined text-[16px]">person</span>
                  <span>Contact: ${r.contactPerson} (${r.contactPhone})</span>
                </div>
              </div>
            </div>
            <div class="pt-space-sm flex items-center gap-space-sm">
              <button onclick="respondToRequest('${r._id}', '${r.bloodGroup}', '${r.hospitalName}', '${r.contactPhone}')" class="flex-1 py-2.5 px-4 bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-lg shadow-sm transition-colors text-center active:scale-95 flex items-center justify-center gap-1.5" type="button">
                <span class="material-symbols-outlined text-[18px]">volunteer_activism</span>
                <span>Respond / Donate</span>
              </button>
              <button onclick="shareRequest('${r.bloodGroup}', '${r.hospitalName}', '${r.city}')" aria-label="Share Request" class="p-2.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg transition-colors" type="button">
                <span class="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
          </article>
        `;
      }).join('');
    }
  } catch (err) {
    console.warn('Spotlight load notice:', err.message);
  }
}

// Respond to Request Modal
function respondToRequest(id, bloodGroup, hospital, phone) {
  openModal(`Respond to Requisition #${id.slice(-4)}`, `
    <div class="space-y-4">
      <div class="p-4 bg-red-50 rounded-xl border border-red-100">
        <h4 class="font-bold text-red-900 mb-1 flex items-center gap-2">
          <span class="material-symbols-outlined text-red-600">emergency</span>
          Urgent Match: ${bloodGroup} Blood at ${hospital}
        </h4>
        <p class="text-sm text-red-700">Your direct donation can save a life today. Please reach out to the medical coordinator below immediately:</p>
      </div>

      <div class="p-4 bg-gray-50 rounded-xl space-y-2">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-500">Hospital Facility:</span>
          <span class="font-semibold text-gray-900">${hospital}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-500">Emergency Desk Phone:</span>
          <a href="tel:${phone}" class="font-bold text-primary hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">call</span>
            ${phone}
          </a>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <a href="tel:${phone}" class="flex-1 py-3 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary-container shadow-md flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">phone_forwarded</span>
          Call Hospital Now
        </a>
        <button onclick="closeModal()" class="px-5 py-3 border border-gray-200 font-semibold rounded-xl hover:bg-gray-100">
          Dismiss
        </button>
      </div>
    </div>
  `);
}

// Quick Share Helper
function shareRequest(bloodGroup, hospital, city) {
  const shareText = `URGENT BLOOD REQUIREMENT: ${bloodGroup} blood needed immediately at ${hospital}, ${city}. Please share to help save a life via HemoPulse Blood Donor Network.`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText);
    showToast('Requisition message copied to clipboard! Share on WhatsApp/SMS.', 'success');
  } else {
    showToast(shareText, 'info');
  }
}

// Hero Search form submission handler
function handleHeroSearch(event) {
  event.preventDefault();
  const bloodGroup = document.getElementById('blood-group')?.value || 'all';
  const city = document.getElementById('city-input')?.value || '';
  window.location.href = `find-donor.html?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`;
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  loadEmergencyTicker();
  loadImpactStats();
  loadSpotlightRequests();
});
