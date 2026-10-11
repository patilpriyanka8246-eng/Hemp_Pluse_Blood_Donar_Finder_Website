/**
 * HemoPulse - Blood Request & Emergency Broadcast Logic
 */

// Live Preview Updater
function updateRequisitionPreview() {
  const patientName = document.getElementById('req-patient')?.value || 'Patient Name';
  const hospitalName = document.getElementById('req-hospital')?.value || 'Hospital / Medical Facility';
  const bloodGroup = document.getElementById('req-blood-group')?.value || 'O-';
  const units = document.getElementById('req-units')?.value || '1';
  const urgency = document.getElementById('req-urgency')?.value || 'Urgent';
  const city = document.getElementById('req-city')?.value || 'City Location';
  const contactPerson = document.getElementById('req-contact-person')?.value || 'Contact Person';
  const reason = document.getElementById('req-reason')?.value || 'Emergency Medical Procedure';

  const previewBadge = document.getElementById('preview-blood-badge');
  const previewHospital = document.getElementById('preview-hospital');
  const previewUnits = document.getElementById('preview-units');
  const previewUrgency = document.getElementById('preview-urgency');
  const previewCity = document.getElementById('preview-city');
  const previewReason = document.getElementById('preview-reason');
  const previewContact = document.getElementById('preview-contact');

  if (previewBadge) previewBadge.textContent = bloodGroup;
  if (previewHospital) previewHospital.textContent = hospitalName;
  if (previewUnits) previewUnits.textContent = `${units} Units Required`;
  if (previewCity) previewCity.textContent = city;
  if (previewReason) previewReason.textContent = reason;
  if (previewContact) previewContact.textContent = `Coordinator: ${contactPerson}`;

  if (previewUrgency) {
    previewUrgency.textContent = `${urgency} Requirement`;
    if (urgency === 'Critical') {
      previewUrgency.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700';
    } else if (urgency === 'Urgent') {
      previewUrgency.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800';
    } else {
      previewUrgency.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800';
    }
  }
}

/**
 * Handle Blood Request Form Submission
 */
async function handleBloodRequestSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('req-submit-btn');

  const patientName = form.patientName.value.trim();
  const hospitalName = form.hospitalName.value.trim();
  const bloodGroup = form.bloodGroup.value;
  const units = Number(form.units.value);
  const urgency = form.urgency.value;
  const city = form.city.value.trim();
  const wardOrDept = form.wardOrDept?.value?.trim() || 'General Ward';
  const contactPerson = form.contactPerson.value.trim();
  const contactPhone = form.contactPhone.value.trim();
  const reason = form.reason?.value?.trim() || 'Emergency Need';
  const notes = form.notes?.value?.trim() || '';

  if (!patientName || !hospitalName || !bloodGroup || !units || !city || !contactPerson || !contactPhone) {
    showToast('Please complete all mandatory request fields.', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner inline-block w-4 h-4 mr-2 border-2"></span> Broadcasting Requisition...`;
  }

  try {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patientName,
        hospitalName,
        bloodGroup,
        units,
        urgency,
        city,
        wardOrDept,
        contactPerson,
        contactPhone,
        reason,
        notes
      })
    });

    const json = await res.json();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">crisis_alert</span> Broadcast Blood Requisition`;
    }

    if (json.success) {
      showToast('🚨 Emergency requisition broadcasted successfully!', 'success');
      form.reset();
      updateRequisitionPreview();
      loadActiveRequestsList();

      openModal('Emergency Broadcast Active', `
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[36px]">campaign</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Requisition Broadcasted to Donors</h3>
          <p class="text-sm text-gray-600 max-w-sm mx-auto">
            Your emergency demand for <strong>${bloodGroup}</strong> at <strong>${hospitalName}, ${city}</strong> is now live on the HemoPulse ticker.
          </p>
          <div class="pt-2">
            <button onclick="closeModal()" class="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-sm">
              Got It
            </button>
          </div>
        </div>
      `);
    } else {
      showToast(json.message || 'Failed to submit requisition.', 'error');
    }
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">crisis_alert</span> Broadcast Blood Requisition`;
    }
    showToast('Network error during broadcast.', 'error');
  }
}

/**
 * Load Active Community Requisitions List
 */
async function loadActiveRequestsList() {
  const container = document.getElementById('active-requests-feed');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/requests`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map(req => {
        let badgeColor = 'bg-primary text-white';
        if (req.bloodGroup.includes('B')) badgeColor = 'bg-amber-700 text-white';
        if (req.bloodGroup.includes('AB')) badgeColor = 'bg-emerald-700 text-white';

        let statusClass = 'bg-yellow-100 text-yellow-800';
        if (req.status === 'Fulfilled') statusClass = 'bg-green-100 text-green-800';
        if (req.status === 'In Progress') statusClass = 'bg-blue-100 text-blue-800';

        return `
          <div class="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl ${badgeColor} font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                ${req.bloodGroup}
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-900 text-sm md:text-base">${req.hospitalName} (${req.city})</h4>
                  <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${statusClass}">${req.status}</span>
                </div>
                <p class="text-xs text-gray-500">
                  Patient: <strong>${req.patientName}</strong> • ${req.units} Units • Urgency: <span class="font-semibold text-primary">${req.urgency}</span>
                </p>
                <p class="text-xs text-gray-400 mt-0.5">Contact: ${req.contactPerson} (${req.contactPhone})</p>
              </div>
            </div>

            <div class="flex gap-2 self-end md:self-center">
              <a href="tel:${req.contactPhone}" class="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1 shadow-sm">
                <span class="material-symbols-outlined text-[16px]">call</span>
                Respond
              </a>
              <button onclick="shareRequest('${req.bloodGroup}', '${req.hospitalName}', '${req.city}')" class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg">
                <span class="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="p-6 text-center bg-gray-50 rounded-xl text-gray-500 text-sm">
          No blood requests broadcasted yet. Submit one above to start.
        </div>
      `;
    }
  } catch (err) {
    console.warn('Active requests feed notice:', err.message);
  }
}

// Attach listeners
document.addEventListener('DOMContentLoaded', () => {
  const reqForm = document.getElementById('blood-request-form');
  if (reqForm) {
    reqForm.addEventListener('submit', handleBloodRequestSubmit);

    // Attach input listeners for live card preview
    const liveInputs = ['req-patient', 'req-hospital', 'req-blood-group', 'req-units', 'req-urgency', 'req-city', 'req-contact-person', 'req-reason'];
    liveInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateRequisitionPreview);
        el.addEventListener('change', updateRequisitionPreview);
      }
    });

    updateRequisitionPreview();
    loadActiveRequestsList();
  }
});
