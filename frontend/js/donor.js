/**
 * HemoPulse - Donor Search & Registration Logic
 */

// Global search state
let currentDonorsList = [];

/**
 * Initialize Find Donor Page
 */
async function initFindDonorPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const bloodGroupParam = urlParams.get('bloodGroup');
  const cityParam = urlParams.get('city');

  const bgSelect = document.getElementById('filter-blood-group');
  const cityInput = document.getElementById('filter-city');

  if (bgSelect && bloodGroupParam) bgSelect.value = bloodGroupParam;
  if (cityInput && cityParam) cityInput.value = cityParam;

  await searchDonors();

  // Attach event listeners
  const filterForm = document.getElementById('donor-search-form');
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchDonors();
    });
  }

  const availCheckbox = document.getElementById('filter-available-only');
  if (availCheckbox) {
    availCheckbox.addEventListener('change', () => searchDonors());
  }
}

/**
 * Fetch and Render Donors based on Filters
 */
async function searchDonors() {
  const resultsContainer = document.getElementById('donors-results-grid');
  const countFeedback = document.getElementById('results-count-feedback');
  const loadingIndicator = document.getElementById('search-loading');

  const bg = document.getElementById('filter-blood-group')?.value || 'all';
  const city = document.getElementById('filter-city')?.value || '';
  const availableOnly = document.getElementById('filter-available-only')?.checked;

  if (loadingIndicator) loadingIndicator.classList.remove('hidden');

  try {
    let queryUrl = `${API_BASE}/donors?bloodGroup=${encodeURIComponent(bg)}&city=${encodeURIComponent(city)}`;
    if (availableOnly) {
      queryUrl += '&available=true';
    }

    const res = await fetch(queryUrl);
    const json = await res.json();

    if (loadingIndicator) loadingIndicator.classList.add('hidden');

    if (json.success) {
      currentDonorsList = json.data;
      renderDonorsGrid(currentDonorsList);

      if (countFeedback) {
        const bgLabel = bg === 'all' ? 'All Groups' : bg;
        const cityLabel = city.trim() ? `in "${city.trim()}"` : 'across all locations';
        countFeedback.innerHTML = `Found <strong class="text-primary font-bold">${json.count} verified donors</strong> for <strong>${bgLabel}</strong> ${cityLabel}.`;
      }
    } else {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="col-span-full p-8 text-center bg-red-50 rounded-xl border border-red-100">
            <p class="text-red-700 font-medium">Failed to load donors: ${json.message}</p>
          </div>
        `;
      }
    }
  } catch (err) {
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    console.error('Search error:', err);
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="col-span-full p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
          <p class="text-gray-600">Unable to connect to the donor network. Please ensure the backend server is running at ${API_BASE}.</p>
        </div>
      `;
    }
  }
}

/**
 * Render Donor Cards
 */
function renderDonorsGrid(donors) {
  const container = document.getElementById('donors-results-grid');
  if (!container) return;

  if (donors.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 px-6 text-center bg-surface-container-lowest rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-[32px]">person_search</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Matching Donors Found</h3>
        <p class="text-gray-500 max-w-md mb-6 text-sm">
          No donors match your search parameters. Try broadening your blood group filter or search for neighboring cities.
        </p>
        <div class="flex flex-wrap gap-3">
          <button onclick="resetSearchFilters()" class="px-5 py-2.5 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Clear Filters
          </button>
          <a href="request.html" class="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-colors text-sm flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">emergency</span>
            Create Blood Requisition
          </a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = donors.map(donor => {
    const isAvail = donor.isAvailable;
    const statusPill = isAvail
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-emerald-700 border border-green-200"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Available Now</span>`
      : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200"><span class="w-2 h-2 rounded-full bg-gray-400"></span> Unavailable</span>`;

    let badgeClass = 'bg-primary text-white';
    if (donor.bloodGroup.includes('B')) badgeClass = 'bg-amber-700 text-white';
    if (donor.bloodGroup.includes('AB')) badgeClass = 'bg-emerald-700 text-white';

    const lastDonated = donor.lastDonationDate
      ? new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      : 'First-time Donor';

    return `
      <div class="interactive-card bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <!-- Header: Blood Type + Status -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl ${badgeClass} font-bold text-lg flex items-center justify-center shadow-md">
                ${donor.bloodGroup}
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-base leading-tight">${donor.name}</h3>
                <p class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[14px] text-gray-400">location_on</span>
                  ${donor.city}${donor.district ? ', ' + donor.district : ''}
                </p>
              </div>
            </div>
            ${statusPill}
          </div>

          <!-- Specs Table -->
          <div class="grid grid-cols-2 gap-2 p-3 bg-surface-container-low rounded-lg text-xs mb-4">
            <div>
              <span class="text-gray-500 block uppercase">Age / Gender</span>
              <span class="font-bold text-gray-800">${donor.age} yrs • ${donor.gender}</span>
            </div>
            <div>
              <span class="text-gray-500 block uppercase">Total Donations</span>
              <span class="font-bold text-primary">${donor.totalDonations || 1} Times</span>
            </div>
            <div class="col-span-2 pt-1 border-t border-gray-200/50 flex justify-between items-center text-gray-500">
              <span>Last Donated:</span>
              <span class="font-medium text-gray-800">${lastDonated}</span>
            </div>
          </div>

          ${donor.notes ? `<p class="text-xs text-gray-500 italic mb-4 line-clamp-1">"${donor.notes}"</p>` : ''}
        </div>

        <!-- Action CTAs -->
        <div class="flex gap-2 pt-2 border-t border-gray-100">
          <a href="tel:${donor.phone}" class="flex-1 py-2.5 px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
            <span class="material-symbols-outlined text-[16px]">call</span>
            Call Donor
          </a>
          <button onclick="viewDonorDetails('${donor._id}')" class="py-2.5 px-3 bg-surface-container hover:bg-surface-container-high text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">badge</span>
            Profile
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Reset Search Filters
 */
function resetSearchFilters() {
  const bgSelect = document.getElementById('filter-blood-group');
  const cityInput = document.getElementById('filter-city');
  const availCheck = document.getElementById('filter-available-only');

  if (bgSelect) bgSelect.value = 'all';
  if (cityInput) cityInput.value = '';
  if (availCheck) availCheck.checked = false;

  searchDonors();
}

/**
 * View Single Donor Details Modal
 */
function viewDonorDetails(donorId) {
  const donor = currentDonorsList.find(d => String(d._id) === String(donorId));
  if (!donor) return;

  openModal(`Donor Profile: ${donor.name}`, `
    <div class="space-y-4">
      <div class="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
        <div class="w-16 h-16 rounded-xl bg-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
          ${donor.bloodGroup}
        </div>
        <div>
          <h4 class="text-lg font-bold text-gray-900">${donor.name}</h4>
          <p class="text-sm text-gray-600">${donor.city}, ${donor.state || 'Maharashtra'}</p>
          <span class="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${donor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
            ${donor.isAvailable ? 'Available for Donation' : 'Currently Unavailable'}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="p-3 bg-gray-50 rounded-lg">
          <span class="text-xs text-gray-500 uppercase block">Phone Number</span>
          <a href="tel:${donor.phone}" class="font-bold text-primary hover:underline">${donor.phone}</a>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <span class="text-xs text-gray-500 uppercase block">Email Address</span>
          <a href="mailto:${donor.email}" class="font-medium text-gray-800 truncate block">${donor.email}</a>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <span class="text-xs text-gray-500 uppercase block">Age & Gender</span>
          <span class="font-medium text-gray-800">${donor.age} Years • ${donor.gender}</span>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <span class="text-xs text-gray-500 uppercase block">Total Donations</span>
          <span class="font-bold text-emerald-700">${donor.totalDonations || 1} Donations</span>
        </div>
      </div>

      ${donor.notes ? `
        <div class="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs">
          <strong>Donor Note:</strong> ${donor.notes}
        </div>
      ` : ''}

      <div class="pt-3 flex gap-3">
        <a href="tel:${donor.phone}" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-center flex items-center justify-center gap-2 shadow-md">
          <span class="material-symbols-outlined">call</span>
          Call ${donor.name.split(' ')[0]}
        </a>
        <button onclick="closeModal()" class="px-5 py-3 border border-gray-200 font-semibold rounded-xl hover:bg-gray-100">
          Close
        </button>
      </div>
    </div>
  `);
}

/**
 * Handle Donor Registration Form Submission
 */
async function handleDonorRegistration(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('donor-submit-btn');

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const bloodGroup = form.bloodGroup.value;
  const age = Number(form.age.value);
  const gender = form.gender.value;
  const city = form.city.value.trim();
  const district = form.district?.value?.trim() || '';
  const isAvailable = form.isAvailable ? form.isAvailable.checked : true;
  const lastDonationDate = form.lastDonationDate?.value || null;
  const notes = form.notes?.value?.trim() || '';

  // Client-side validations
  if (!name || !email || !phone || !bloodGroup || !city || !age) {
    showToast('Please fill in all mandatory registration fields.', 'error');
    return;
  }

  if (age < 18 || age > 65) {
    showToast('Donor age must be between 18 and 65 years.', 'error');
    return;
  }

  if (phone.length < 10) {
    showToast('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner inline-block w-4 h-4 mr-2 border-2"></span> Registering...`;
  }

  try {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        bloodGroup,
        age,
        gender,
        city,
        district,
        isAvailable,
        lastDonationDate,
        notes
      })
    });

    const json = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">how_to_reg</span> Complete Registration`;
    }

    if (json.success) {
      showToast('🎉 Congratulations! You are now registered as a lifesaving donor!', 'success');
      form.reset();

      // Show Virtual Donor ID Card Modal
      const registered = json.data;
      openModal('Donor Registration Verified!', `
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[36px]">verified</span>
          </div>

          <h3 class="text-xl font-bold text-gray-900">Welcome to the HemoPulse Lifesaving Grid!</h3>
          <p class="text-sm text-gray-500 max-w-sm mx-auto">
            Your profile has been saved to the database. Patients and hospitals searching for <strong>${registered.bloodGroup}</strong> in <strong>${registered.city}</strong> will now be able to connect with you.
          </p>

          <!-- Virtual Card -->
          <div class="p-5 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl shadow-xl text-left relative overflow-hidden">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xs uppercase tracking-widest opacity-80">National Donor Card</span>
              <span class="font-extrabold text-2xl">${registered.bloodGroup}</span>
            </div>
            <h4 class="text-lg font-bold">${registered.name}</h4>
            <p class="text-xs opacity-90">${registered.city} • Registered Active</p>
            <div class="mt-4 pt-3 border-t border-white/20 flex justify-between text-xs opacity-75">
              <span>ID: #${String(registered._id).slice(-8).toUpperCase()}</span>
              <span>HemoPulse Verified</span>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <a href="find-donor.html?bloodGroup=${registered.bloodGroup}&city=${encodeURIComponent(registered.city)}" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-center hover:bg-primary-container text-sm">
              View in Directory
            </a>
            <button onclick="closeModal()" class="px-5 py-3 border border-gray-200 font-semibold rounded-xl text-sm hover:bg-gray-100">
              Done
            </button>
          </div>
        </div>
      `);
    } else {
      showToast(json.message || 'Registration failed. Please try again.', 'error');
    }
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">how_to_reg</span> Complete Registration`;
    }
    showToast('Server communication error. Please ensure backend is active.', 'error');
  }
}

// Attach registration listener if present on page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('find-donor.html')) {
    initFindDonorPage();
  }

  const regForm = document.getElementById('donor-registration-form');
  if (regForm) {
    regForm.addEventListener('submit', handleDonorRegistration);
  }
});
