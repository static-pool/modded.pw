const FILES = [

  {
    paid: true, price: '€10.00', redirect: true,
    url: 'https://discord.com/invite/modding-community', id: '',
    title: 'Reflex CE v4',
    desc:  'Excellent cheat engine for Black Ops II — aimbot, anti-aim, hvh configs and much more.',
    platforms: ['ps3'], game: ['bo2'],
    tags: ['bo2', 'offhost menu', 'sprx', 'cex', 'dex', 'hen'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2026',
    preview: 'https://modded.pw/img/reflex-v4.jpg',
    yt: 'https://www.youtube.com/watch?v=iX-8a1TiH1c&t=162s',
  },
  
  {
    redirect:  true,
    url:       'https://xbflamzy.com',
    id:        '',
    title:     'xbFlamzy Menu',
    desc:      'Clean, feature packed host menu for COD 4 — aimbot, lobby mods, recovery, and much more.',
    platforms: ['x360'], game: 'cod4',
    tags:      ['cod4', 'host menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Aug 2025',
    preview: 'https://modded.pw/img/xbflamzy-cod4.jpg',
    yt: 'https://www.youtube.com/watch?v=RpeS5G7bHrg&t=52s',
  },

  {
    id:        'mods/BO2RecoveryTool.rar',
    title:     'Black Ops II Recovery Tool',
    desc:      'Quick and easy to use recovery tool - unlock all, custom classes, live monitoring, and much more.',
    platforms: ['ps3', 'x360'], game: 'bo2',
    tags:      ['bo2', 'tool'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '1.4 MB', date: 'Aug 2025',
    preview: 'https://modded.pw/img/bo2-recovery-tool.jpg',
    yt: 'https://www.youtube.com/watch?v=09fMOJCM4zM&t=7s',
  },

  {
    id:        'mods/UnlockAllTool.rar',
    title:     'All COD Unlock All Tool',
    desc:      'Unlock all for every major call of duty game - supporting xbox 360 and playstation 3.',
    platforms: ['ps3', 'x360'], game: 'gta5',
    tags:      ['all cod', 'tool'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '1.2 MB', date: 'Apr 2025',
    preview: 'https://modded.pw/img/unlock-all-tool.jpg',
    yt: 'https://www.youtube.com/watch?v=NRpJp-FTvdM',
  },

  {
    id:        'mods/RezzurectionV3.rar',
    title:     'Rezurrection v3 Menu',
    desc:      'All client menu for black ops multiplayer - aimbot, recovery, lobby mods, and much more.',
    platforms: ['x360'], game: 'bo1',
    tags:      ['bo1', 'host menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '103 KB', date: 'Mar 2025',
    preview: 'https://modded.pw/img/rezurrection-v3.jpg',
    yt: 'https://www.youtube.com/watch?v=y6PLUD6R9P0&t=13s',
  },

  {
    id:        'mods/EncoreV8.rar',
    title:     'Encore v8 Menu',
    desc:      'Simple but effective zombies menu for black ops - god mode, custom guns, aimbot, and much more.',
    platforms: ['x360'], game: 'bo1',
    tags:      ['bo1', 'zombies', 'host menu', 'gsc'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '495 KB', date: 'Mar 2025',
    preview: 'https://modded.pw/img/encore-v8.jpg',
    yt: 'https://www.youtube.com/watch?v=NmeO8PzkTME',
  },

  {
    id:        'mods/IndigoMW2.rar',
    title:     'Indigo Menu',
    desc:      'Clean and feature packed trickshot menu - custom binds, teleport, eb, and much more.',
    platforms: ['ps3'], game: 'mw2',
    tags:      ['mw2', 'host menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '3.5 MB', date: 'Mar 2025',
    preview: 'https://modded.pw/img/indigo.jpg',
    yt: 'https://www.youtube.com/watch?v=nUvJm03683g',
  },

  // Zhiva Host
  {
    id:        'mods/Zhiva.rar',
    title:     'Zhiva Host Menu',
    desc:      'Modern style design with a great amount of options - recovery, aimbot, player options, and much more.',
    platforms: ['x360'], game: ['bo1', 'mw2', 'mw3', 'ghosts'],
    tags:      ['bo1', 'mw2', 'mw3', 'ghosts', 'host menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '1.1 MB', date: 'Mar 2025',
    preview: [
      'https://modded.pw/img/zhiva-bo1.jpg',
      'https://modded.pw/img/zhiva-mw2.jpg'
    ],
    yt: [
      'https://www.youtube.com/watch?v=0sz7ppkc5Pw&t=2s',
      'https://www.youtube.com/watch?v=G3jA_ZoOu8I'
    ]
  },

  {
    id:        'mods/TacticCE.rar',
    title:     'Tactic CE',
    desc:      'Unique design with amazing features - aimbot, custom esp, bots, host options, and much more.',
    platforms: ['ps3', 'x360'], game: 'mw2',
    tags:      ['mw2', 'offhost menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '8.7 MB', date: 'Mar 2025',
    preview: 'https://modded.pw/img/tactic-mw2.jpg',
    yt: 'https://www.youtube.com/watch?v=l68dBcnkvIM',
  },

  {
    id:        'mods/AoyamaBO2.xex',
    title:     'Aoyama RME Menu',
    desc:      'Edited version of sunset - offhost player mods, lobby mods, and much more.',
    platforms: ['x360'], game: 'bo2',
    tags:      ['bo2', 'rme menu'],
    ft: 'XEX', ftClass: 'ft-mod',
    size: '70 KB', date: 'Feb 2025',
    preview: 'https://modded.pw/img/aoyama-bo2.jpg',
    yt: 'https://www.youtube.com/watch?v=7_Sujxnlkxc',
  },

  // Matrix Host + CE
  {
    id:        'mods/MatrixMods.xex',
    title:     'MatrixMods All COD Menu',
    desc:      'A clean and feature packed offhost and host menu - supports all major call of duty games.',
    platforms: ['x360'], game: ['bo2'],
    tags:      ['all cod', 'host menu', 'offhost menu'],
    ft: 'XEX', ftClass: 'ft-mod',
    size: '270 KB', date: 'May 2024',
    preview: [
      'https://modded.pw/img/matrix-ghosts.jpg',
      'https://modded.pw/img/matrix-bo1.jpg'
    ],
    yt: [
      'https://www.youtube.com/watch?v=FW-NXUWxaQo',
      'https://www.youtube.com/watch?v=brZqb_TxZFs'
    ],
  },

  // Zhiva CE
  {
    id:        'mods/Zhiva.rar',
    title:     'Zhiva CE',
    desc:      'A small but effective offhost menu for mw2 - aimbot, visuals, exploits, and much more.',
    platforms: ['x360'], game: ['mw2', 'bo1'],
    tags:      ['mw2', 'bo1', 'offhost menu'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '270 KB', date: 'May 2024',
    preview: [
      'https://modded.pw/img/zhiva-mw2-ce.jpg',
      'https://modded.pw/img/zhiva-bo1-ce.jpg'
    ],
    yt: [
      'https://www.youtube.com/watch?v=whBTgueW_h8',
      'https://www.youtube.com/watch?v=mnRqyhqCL4k'
    ],
  },

  {
    id:        'mods/purpleKush.xex',
    title:     'Purple Kush CE',
    desc:      'A purple themed offhost menu for bo1 zombies - god mode, weapons, visuals, and much more.',
    platforms: ['x360'], game: 'bo1',
    tags:      ['bo1', 'offhost menu', 'zombies'],
    ft: 'XEX', ftClass: 'ft-mod',
    size: '90 KB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/purple-kush-ce.jpg',
    yt: 'https://www.youtube.com/watch?v=97qqXb2vQ_M',
  },

  // Myten Host
  {
    paid: true, price: '€24.99',
    redirect:  true,
    url:       'https://myten.menu/',
    id:        '',
    title:     'Myten Menu',
    desc:      'Clean, feature packed, and regularly updated - visuals, bots, weapons, and much more.',
    platforms: ['x360'], game: ['ghosts', 'mw2'],
    tags:      ['ghosts', 'mw2', 'host menu', 'paid'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2024',
    preview: [
      'https://modded.pw/img/myten-ghosts.jpg',
      'https://modded.pw/img/myten-mw2.jpg'
    ],
    yt: [
      'https://www.youtube.com/watch?v=gU8UArX9b3A',
      'https://www.youtube.com/watch?v=PnWrZWUF0f0'
    ],
  },

  {
    id:        'mods/BO1RecoveryTool.rar',
    title:     'Black Ops I Recovery Tool',
    desc:      'A useful tool for account recoveries - advanced stats, classes, xuid spoofer, and much more.',
    platforms: ['x360'], game: 'bo1',
    tags:      ['bo1', 'tool', 'recovery'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '1.54 MB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/bo1-recovery-tool.jpg',
    yt: 'https://www.youtube.com/watch?v=VUnsaVbJZX4&t=36s',
  },

  {
    paid: true, price: '€19.99',
    redirect:  true,
    url:       'https://www.frenchmoddingteam.com/shop/application/39-bo3-fatality-ccapi-dex-cex',
    id:        '',
    title:     'Fatality Menu',
    desc:      'Stable menu with great recovery options, all client options, aimbot, recovery and much more.',
    platforms: ['ps3'], game: 'bo3',
    tags:      ['bo3', 'host menu', 'paid'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/fatality-bo3.jpg',
    yt: 'https://www.youtube.com/watch?v=mJsH5vMvKm8',
  },

  {
    paid: true, price: '€14.99',
    redirect:  true,
    url:       'https://www.frenchmoddingteam.com/shop/application/19-mw2-reborn-ccapi-dex-cex',
    id:        '',
    title:     'Reborn v4 Menu',
    desc:      'Stable menu with great designs, all client options, aimbot, recovery and much more.',
    platforms: ['ps3'], game: 'mw2',
    tags:      ['mw2', 'host menu', 'paid'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/reborn-mw2.jpg',
    yt: 'https://www.youtube.com/watch?v=to9I948GF1Y',
  },

  {
    paid: true, price: '€19.99',
    redirect:  true,
    url:       'https://www.frenchmoddingteam.com/shop/application/37-bo2-destiny-ccapi-dex-cex',
    id:        '',
    title:     'Destiny Menu',
    desc:      'Stable menu with great designs, all client options, aimbot, recovery and much more.',
    platforms: ['ps3'], game: 'bo2',
    tags:      ['bo2', 'host menu', 'paid'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/destiny-bo2.jpg',
    yt: 'https://www.youtube.com/watch?v=ZR3rUWHZRno',
  },

  {
    redirect:  true,
    url:       'https://xbguard.live/',
    id:        '',
    title:     'xbGuard CE v1.2.4',
    desc:      'Clean and highly performative offhost menu - aimbot, esp, anti aim, hvh configs, and much more.',
    platforms: ['x360'], game: 'bo2',
    tags:      ['bo2', 'offhost menu', 'paid'],
    ft: 'RAR', ftClass: 'ft-mod',
    size: '~ MB', date: 'Apr 2024',
    preview: 'https://modded.pw/img/xbguard-1.2.4.jpg',
    yt: 'https://www.youtube.com/watch?v=iaVOHPHudJQ',
  },

];

/* ── Inject cards into the grid ── */
(function () {
  const grid  = document.getElementById('grid');
  const empty = document.getElementById('empty');
  FILES.forEach(f => {
    const pc    = f.platforms.length > 1 ? 'both' : f.platforms[0];
    const games = Array.isArray(f.game) ? f.game : [f.game];

    // preview — string or array of strings
    const previews = Array.isArray(f.preview) ? f.preview
                   : f.preview ? [f.preview] : [];

    // yt — string or array of strings
    const yts = Array.isArray(f.yt) ? f.yt
              : f.yt ? [f.yt] : [];

    const el = document.createElement('div');
    el.className = `card ${pc}${f.paid ? ' paid' : ''}`;
    Object.assign(el.dataset, {
      title:     f.title,
      desc:      f.desc,
      platforms: f.platforms.join(' '),
      games:     games.join(' '),
      tags:      JSON.stringify(f.tags),
      ft:        f.ft,
      ftclass:   f.ftClass,
      size:      f.size,
      date:      f.date,
      thumb:     previews[0] || '',          // first image used on the card thumbnail
      previews:  JSON.stringify(previews),   // all images for lightbox
      yts:       JSON.stringify(yts),        // all videos for lightbox
      file:      f.id   || '',
      url:       f.url  || '',
      redirect:  f.redirect ? 'true' : 'false',
      paid:      f.paid ? 'true' : 'false',
      price:     f.price || '',
    });
    grid.insertBefore(el, empty);
  });
})();
