/* Website click != received conversation != enrollment. The CRM joins only
   references actually received by the academy's WhatsApp inbox. */
(function () {
  'use strict';
  var endpoint = 'https://bmnyhaxvlifmwkcuglfh.supabase.co/rest/v1/website_contact_clicks';
  // Public, write-only analytics access; no contact read/update permission.
  var publicKey = 'sb_publishable_4c0czybZEViR4BOHtQbJTA_VGKsnS6W';
  var storageKey = 'tf_attribution_v1';
  var params = new URLSearchParams(window.location.search);
  var fields = {utm_source:'source',utm_medium:'medium',utm_campaign:'campaign',utm_content:'content',utm_term:'term',gclid:'gclid',gbraid:'gbraid',wbraid:'wbraid'};
  var attribution = {}, hasCampaign = false;
  Object.keys(fields).forEach(function (key) {
    var value = (params.get(key) || '').replace(/[\x00-\x1f]/g, '').slice(0,250);
    if (value) { attribution[fields[key]] = value; hasCampaign = true; }
  });
  if (attribution.gclid || attribution.gbraid || attribution.wbraid) {
    attribution.source = 'google'; attribution.medium = 'cpc';
  }
  var referrerHost = '';
  try { referrerHost = new URL(document.referrer).hostname; } catch (_) {}
  var externalReferrer = referrerHost && !/(^|\.)territoriofit\.com\.br$/.test(referrerHost);
  if (!hasCampaign && !externalReferrer) {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && saved.value && typeof saved.value === 'object' && !Array.isArray(saved.value)
          && typeof saved.value.source === 'string' && Date.now()-saved.at < 30*86400000 && Date.now() >= saved.at) {
        Object.keys(fields).forEach(function (key) {
          var field = fields[key];
          if (typeof saved.value[field] === 'string') attribution[field] = saved.value[field].slice(0,250);
        });
        if (typeof saved.value.referrer_host === 'string') attribution.referrer_host = saved.value.referrer_host.slice(0,150);
      }
    } catch (_) {}
  }
  if (!attribution.source) {
    attribution.source = /(^|\.)google\.[a-z.]+$/.test(referrerHost) ? 'google_organic' : externalReferrer ? referrerHost : 'direct';
  }
  if (!attribution.medium) attribution.medium = externalReferrer ? (/google_organic/.test(attribution.source) ? 'organic' : 'referral') : 'none';
  attribution.referrer_host = attribution.referrer_host || referrerHost.slice(0,150);
  attribution.landing_path = window.location.pathname.slice(0,250);
  if (hasCampaign || externalReferrer) {
    try { localStorage.setItem(storageKey,JSON.stringify({at:Date.now(),value:attribution})); } catch (_) {}
  }
  function reference() {
    var bytes = new Uint8Array(8); window.crypto.getRandomValues(bytes);
    return Array.from(bytes,function(b){return b.toString(16).padStart(2,'0');}).join('');
  }
  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(function (link,index) {
    var original = link.href;
    link.addEventListener('click',function () {
      var ref;
      try { ref = reference(); } catch (_) { return; } // Preserve native WhatsApp link if crypto unavailable.
      var url = new URL(original);
      var message = url.searchParams.get('text') || 'Olá! Vim pelo site da Território Fit e quero mais informações.';
      var intent = link.dataset.intent || (/experimental/i.test(message) ? 'experimental' : 'informacoes');
      var section = link.closest('section,header,footer');
      var placement = link.dataset.placement || ((section && (section.id || section.tagName.toLowerCase())) || 'site') + '-' + index;
      url.searchParams.set('text',message + '\n\nRef. TF-' + ref);
      link.href = url.toString();
      // No await/preventDefault: a measurement outage must never block WhatsApp.
      fetch(endpoint,{
        method:'POST',headers:{apikey:publicKey,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({reference:ref,attribution:attribution,intent:intent,placement:placement}),keepalive:true
      }).catch(function () {});
      if (typeof window.gtag === 'function') window.gtag('event','conversion',{
        send_to:'AW-689347562/uNNZCMrRl9QcEOq32sgC',transaction_id:ref,value:1.0,currency:'BRL'
      });
      if (typeof window.fbq === 'function') window.fbq('track','Lead',{}, {eventID:ref});
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:'whatsapp_click',transaction_id:ref,contact_intent:intent,cta_placement:placement});
    });
  });
})();
