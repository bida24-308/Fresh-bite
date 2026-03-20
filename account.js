// ACCOUNT PAGE: tabs & forms
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    initializeAccountTabs();
    initializeForms();
    loadAccountData();
    initializeNavigation();
    updateDashboard();
    FreshBite.Analytics.trackEvent('Page','ViewAccount','UserAccount');
  });

  function initializeAccountTabs(){
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      if(btn.classList.contains('logout')) return;
      btn.addEventListener('click', function(){
        const id = this.dataset.tab;
        showTab(id);
        document.querySelectorAll('.nav-btn').forEach(b=> b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  function showTab(id){
    document.querySelectorAll('.tab-content').forEach(t=> t.classList.remove('active'));
    const el = document.getElementById(id); if(el){ el.classList.add('active'); FreshBite.Analytics.trackEvent('Account','ViewTab', id); }
  }

  function initializeForms(){
    const profileForm = document.querySelector('form.account-form');
    if(profileForm){ profileForm.addEventListener('submit', handleProfileSubmit); }
    const prefForm = document.querySelector('form.preferences-form');
    if(prefForm){ prefForm.addEventListener('submit', handlePreferencesSubmit); }
  }

  function handleProfileSubmit(e){
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const v = FreshBite.FormValidator.validateForm({ name: `${data.firstName||''} ${data.lastName||''}`.trim(), email:data.email, phone:data.phone, zip:data.zip });
    if(!v.isValid){ v.errors.forEach(err=> FreshBite.showToast(err,'error')); return; }
    FreshBite.Storage.set('userProfile', data);
    FreshBite.showToast('Profile updated successfully!');
    FreshBite.Analytics.trackEvent('Account','UpdateProfile', data.email||'');
  }

  function handlePreferencesSubmit(e){
    e.preventDefault();
    const dietary = Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(cb=> cb.value);
    const cuisines = Array.from(document.querySelectorAll('input[name="cuisine"]:checked')).map(cb=> cb.value);
    const allergies = document.querySelector('textarea[name="allergies"]')?.value || '';
    const calorieTarget = document.querySelector('select[name="calorieTarget"]')?.value || '1500-2000';
    const prefs = { dietary, cuisines, allergies, calorieTarget };
    FreshBite.UserPreferences.set(prefs);
    FreshBite.Analytics.trackEvent('Account','UpdatePreferences', dietary.join(','));
  }

  function loadAccountData(){
    const profile = FreshBite.Storage.get('userProfile');
    if(profile){ Object.keys(profile).forEach(k=>{ const el = document.querySelector(`[name="${k}"]`); if(el) el.value = profile[k]; }); }
    const prefs = FreshBite.UserPreferences.get();
    if(prefs.dietary) prefs.dietary.forEach(v=>{ const el = document.querySelector(`input[name="dietary"][value="${v}"]`); if(el) el.checked = true; });
    if(prefs.cuisines) prefs.cuisines.forEach(v=>{ const el = document.querySelector(`input[name="cuisine"][value="${v}"]`); if(el) el.checked = true; });
    const sel = document.querySelector('select[name="calorieTarget"]'); if(sel) sel.value = prefs.calorieTarget || '1500-2000';
    const ta = document.querySelector('textarea[name="allergies"]'); if(ta) ta.value = prefs.allergies || '';
  }

  function initializeNavigation(){
    const logoutBtn = document.querySelector('.logout');
    if(logoutBtn){ logoutBtn.addEventListener('click', ()=>{ FreshBite.showToast('You have been logged out'); setTimeout(()=>{ window.location.href = '../index.html'; }, 800); }); }
    document.querySelectorAll('.account-settings-link').forEach(link=>{
      link.addEventListener('click', function(e){ e.preventDefault(); const tab = this.dataset.tab; const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`); btn?.click(); });
    });
  }

  function updateDashboard(){
    const selected = FreshBite.Storage.get('selectedPlan');
    if(selected){ const el = document.querySelector('.dashboard-card .status-badge'); if(el) el.textContent = `Active - ${selected.name} Plan`; }
  }
})();




