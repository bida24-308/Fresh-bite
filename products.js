// PRODUCTS PAGE: filtering & cart
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    initializeProductFilters();
    initializeProductCards();
    loadMeals();
  });

  let currentFilters = { cuisine: [], diet: [], maxPrice: 15 };

  function initializeProductFilters(){
    document.querySelectorAll('.filter-checkbox').forEach(cb=> cb.addEventListener('change', handleFilterChange));
    const priceRange = document.getElementById('priceRange');
    if(priceRange){ priceRange.addEventListener('input', handlePriceChange); }
  }

  function handleFilterChange(e){
    const type = e.target.dataset.filter;
    const value = (e.target.parentElement?.textContent || '').trim();
    if(e.target.checked){ if(!currentFilters[type].includes(value)) currentFilters[type].push(value); }
    else { currentFilters[type] = currentFilters[type].filter(v=> v!==value); }
    applyFilters();
  }

  function handlePriceChange(e){
    currentFilters.maxPrice = parseFloat(e.target.value || '15');
    const priceDisplay = document.getElementById('priceDisplay');
    if(priceDisplay){ priceDisplay.textContent = `$5 - $${e.target.value}`; }
    applyFilters();
  }

  function applyFilters(){
    const cards = document.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach(card=>{
      const priceText = card.querySelector('.price')?.textContent || '$0.00';
      const price = parseFloat(priceText.replace('$','').trim()) || 0;
      const cuisine = (card.querySelector('.cuisine-tag')?.textContent || '').trim();
      const details = (card.querySelector('.meal-details')?.textContent || '').toLowerCase();
      let show = true;
      if(price > currentFilters.maxPrice) show = false;
      if(currentFilters.cuisine.length>0 && !currentFilters.cuisine.includes(cuisine)) show = false;
      if(currentFilters.diet.length>0){
        const hasDiet = currentFilters.diet.some(d=> details.includes(d.toLowerCase()));
        if(!hasDiet) show = false;
      }
      card.style.display = show ? 'block' : 'none';
      if(show) visible++;
    });
    let msg = document.querySelector('.no-results-message');
    const grid = document.querySelector('.products-grid');
    if(visible===0){
      if(!msg){ msg = document.createElement('div'); msg.className='no-results-message'; msg.innerHTML = '<div style="text-align:center;padding:2rem;grid-column:1/-1;"><p style="font-size:1.1rem;color:var(--text-light)">No meals match your filters. Try adjusting your preferences.</p></div>'; grid?.appendChild(msg); }
    } else if(msg){ msg.remove(); }
  }

  function initializeProductCards(){
    document.querySelectorAll('.btn-add').forEach(btn=> btn.addEventListener('click', handleAddToCart));
  }

  function handleAddToCart(e){
    e.preventDefault();
    const card = e.target.closest('.product-card');
    const mealName = card.querySelector('h3')?.textContent || 'Meal';
    const priceText = card.querySelector('.price')?.textContent || '$0.00';
    const price = parseFloat(priceText.replace('$','')) || 0;
    FreshBite.Cart.add({ id: Date.now(), name: mealName, price });
    const original = e.target.textContent; e.target.textContent = '✓ Added!'; e.target.style.background = 'var(--success-color)';
    setTimeout(()=>{ e.target.textContent = original; e.target.style.background = ''; }, 1500);
    FreshBite.Analytics.trackEvent('Cart','AddItem', mealName);
  }

  function loadMeals(){
    const meals = FreshBite.PricingAPI.getMeals();
    console.log('Loaded meals:', meals);
  }
})();

