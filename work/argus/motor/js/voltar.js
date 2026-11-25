// ARGUS · o voltar: o botão "‹ …" do topo, ou o voltar do aparelho
()=>{const b=[...document.querySelectorAll('button,a,[data-act]')].find(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.top<280&&/^‹|^voltar/i.test((e.getAttribute('aria-label')||e.textContent||'').trim())});if(b){b.click();return 'botão ‹'}history.back();return 'voltar do aparelho'}
