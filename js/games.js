const GAMES = [
  { id: 'gta5',   label: 'GTA 5'   },
  { id: 'mw1',    label: 'MW1'     },
  { id: 'mw2',    label: 'MW2'     },
  { id: 'mw3',    label: 'MW3'     },
  { id: 'ghosts', label: 'Ghosts'  },
  { id: 'bo1',    label: 'BO1'     },
  { id: 'bo2',    label: 'BO2'     },
  { id: 'bo3',    label: 'BO3'     },
];

/* ── Auto-render game filter chips ── */
(function () {
  const row = document.getElementById('game-filter-row');
  if (!row) return;
  GAMES.forEach(g => {
    const btn = document.createElement('button');
    btn.className   = 'chip chip-game';
    btn.dataset.game = g.id;
    btn.textContent  = g.label;
    row.appendChild(btn);
  });
})();
