/* ==================================================================
   RAI-KNOWLEDGE.JS  -  Library kata kunci R-AI (rencana cadangan)
   ------------------------------------------------------------------
   Dipakai saat model AI tidak bisa dihubungi: menjawab "itu apa?",
   definisi istilah sistem, dan untuk warna sekaligus jumlah objek.
   Fungsi window.raiKnowledgeReply(raw, data, lang):
     raw  -> teks user
     data -> { kuning, biru, merah, gagal, total }
     lang -> 'id' | 'en'
   Mengembalikan jawaban string, atau null bila tidak ada yang cocok.
   ================================================================== */
window.RAI_KNOWLEDGE = [
  {
    keys: ['biru', 'blue'],
    name: 'Biru', enName: 'Blue', countKey: 'biru',
    id: 'Biru adalah salah satu warna objek yang disortir R-LAB, bersama kuning dan merah.',
    en: 'Blue is one of the object colours R-LAB sorts, along with yellow and red.'
  },
  {
    keys: ['kuning', 'yellow'],
    name: 'Kuning', enName: 'Yellow', countKey: 'kuning',
    id: 'Kuning adalah salah satu warna objek yang disortir R-LAB, bersama biru dan merah.',
    en: 'Yellow is one of the object colours R-LAB sorts, along with blue and red.'
  },
  {
    keys: ['merah', 'red'],
    name: 'Merah', enName: 'Red', countKey: 'merah',
    id: 'Merah adalah salah satu warna objek yang disortir R-LAB, bersama kuning dan biru.',
    en: 'Red is one of the object colours R-LAB sorts, along with yellow and blue.'
  },
  {
    keys: ['error', 'eror', 'gagal'],
    name: 'Error', enName: 'errors', countKey: 'gagal',
    id: 'Objek error adalah yang gagal diklasifikasi atau masuk jalur salah. Jumlahnya dicatat ke laporan.',
    en: 'Error objects are the ones that failed classification or went to the wrong lane. They are logged in the report.'
  },
  {
    keys: ['warna', 'colors', 'colours', 'colour', 'color'],
    fn: function (d, isEn, wantCount) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      if (isEn) return 'R-LAB sorts three object colours: yellow, blue and red. Current: yellow ' + s.kuning +
        ', blue ' + s.biru + ', red ' + s.merah + ', error ' + s.gagal + ', total ' + s.total + '.';
      return 'R-LAB menyortir tiga warna objek: kuning, biru, dan merah. Saat ini kuning ' + s.kuning +
        ', biru ' + s.biru + ', merah ' + s.merah + ', error ' + s.gagal + ', total ' + s.total + '.';
    }
  },
  {
    keys: ['servo'],
    id: 'Servo adalah penggerak (aktuator) putar yang mengayunkan lengan penyortir R-LAB. Saat AI mendeteksi warna objek, servo menyapu objek ke jalur tujuannya.',
    en: 'A servo is a rotary actuator that swings the R-LAB sorting arm. When AI detects an object colour, the servo sweeps the object to its lane.'
  },
  {
    keys: ['arm', 'lengan'],
    id: 'Arm (lengan) adalah bagian mekanik R-LAB yang mengarahkan objek ke jalur yang benar. Mode Arm/Servo menentukan penggerak yang dipakai.',
    en: 'The arm is the mechanical part of R-LAB that guides objects to the correct lane. Arm/Servo mode picks the actuator in use.'
  },
  {
    keys: ['kamera', 'camera', 'webcam'],
    id: 'Kamera menangkap frame objek di jalur sortir, lalu model AI mengklasifikasikannya menjadi kuning, biru, atau merah.',
    en: 'The camera captures frames of objects on the line, then the AI model classifies each as yellow, blue, or red.'
  },
  {
    keys: ['model apa kamu', 'kamu pakai model', 'kamu pake model', 'r-ai pakai', 'otak r-ai', 'what model are you', 'which model are you'],
    id: 'Saya R-AI, gabungan dari beberapa model AI yang bekerja sama membantu memantau mesin sortir R-LAB.',
    en: 'I am R-AI, a combination of several AI models working together to help monitor the R-LAB sorting machine.'
  },
  {
    keys: ['teachable machine', 'machine learning', 'model ai', 'modelnya', 'klasifik'],
    id: 'Model AI R-LAB dilatih dengan Teachable Machine: model itu mengenali pola objek dan mengklasifikasikannya sebagai kuning, biru, atau merah dengan akurasi minimal 85 persen.',
    en: 'R-LAB\'s AI model is trained with Teachable Machine: it learns object patterns and classifies them as yellow, blue, or red with at least 85% accuracy.'
  },
  {
    keys: ['konveyor', 'conveyor', 'ban berjalan', 'belt'],
    id: 'Konveyor (ban berjalan) membawa objek satu per satu melewati kamera sehingga bisa disortir dan dihitung.',
    en: 'The conveyor belt carries objects one by one past the camera so they can be sorted and counted.'
  },
  {
    keys: ['sensor'],
    id: 'Sensor adalah alat pendeteksi yang memberi sinyal ke mesin. Di R-LAB, kamera membaca objek lalu model AI menentukan warnanya.',
    en: 'A sensor detects signals to feed the machine. In R-LAB, the camera reads objects and the AI model decides their colour.'
  },
  {
    keys: ['firebase', 'database', 'basis data'],
    id: 'Data sortir R-LAB disimpan di Firebase Realtime Database: hitungan kuning, biru, merah, error, dan total. Detail kredensialnya bersifat pribadi.',
    en: 'R-LAB stores sorting data in Firebase Realtime Database: yellow, blue, red, error counts and the total. Its credentials are private.'
  },
  {
    keys: ['gemini', 'groq', 'ai model'],
    id: 'Gemini adalah model AI buatan Google — salah satu dari beberapa model AI yang bergabung membentuk R-AI.',
    en: 'Gemini is Google\'s AI model — one of several AI models combined into R-AI.'
  },
  {
    keys: ['export', 'ekspor', 'xlsx', 'excel', 'pdf', 'csv', 'laporan', 'report'],
    id: 'Fitur export membuat laporan sortir ke Excel (XLSX), PDF, atau CSV berisi ringkasan total per warna dan tingkat keberhasilan.',
    en: 'The export feature creates a sorting report in Excel (XLSX), PDF, or CSV with per-colour totals and success rate.'
  },
  {
    keys: ['missort', 'miss-sort', 'salah sortir', 'salah urut'],
    id: 'Miss-sort (salah sortir) adalah objek yang jatuh ke jalur yang salah. Kamu bisa mencatatnya lewat R-AI supaya masuk laporan error.',
    en: 'Miss-sort means an object went to the wrong lane. You can log it via R-AI so it appears in the error report.'
  },
  {
    keys: ['force timeout', 'paksa timeout', 'timeout'],
    id: 'Force timeout memberi tahu mesin bahwa objek sudah lewat meskipun kamera tidak menangkapnya, supaya proses tidak menggantung.',
    en: 'Force timeout tells the machine an object has already passed even if the camera missed it, so the process does not hang.'
  },
  {
    keys: ['mode sortir', 'sorting mode', 'mode arm', 'mode servo'],
    id: 'R-LAB punya dua mode sortir: Arm (lengan penyapu) dan Servo. Pilih sesuai mekanik yang terpasang.',
    en: 'R-LAB has two sorting modes: Arm (sweeper arm) and Servo. Pick whichever matches your hardware.'
  },
  {
    keys: ['r-ai', 'r ai', 'r. ai'],
    id: 'Saya R-AI, asisten AI resmi R-LAB — gabungan dari beberapa model AI. Saya membantu memantau mesin sortir, membaca status, dan menjalankan perintah.',
    en: 'I am R-AI, the official AI assistant of R-LAB — a combination of several AI models. I help monitor the sorting machine, read status, and run commands.'
  }
];

window.raiKnowledgeReply = function (raw, d, lang) {
  try {
    const clean = String(raw || '').trim();
    if (!clean) return null;
    const t = ' ' + clean.toLowerCase() + ' ';
    const has = function () {
      for (var i = 0; i < arguments.length; i++) if (t.indexOf(arguments[i]) !== -1) return true;
      return false;
    };
    const isEn = lang === 'en';
    const wantCount = has('berapa', 'berapa total', 'jumlah', 'how many', 'totalnya', 'hitung', 'sebanyak');
    const list = window.RAI_KNOWLEDGE || [];
    for (var i = 0; i < list.length; i++) {
      const e = list[i];
      if (!e || !e.keys) continue;
      let hit = false;
      for (var j = 0; j < e.keys.length; j++) {
        const k = String(e.keys[j]).toLowerCase();
        if (k && t.indexOf(k) !== -1) { hit = true; break; }
      }
      if (!hit) continue;
      if (typeof e.fn === 'function') return e.fn(d, isEn, wantCount);
      let def = isEn ? (e.en || '') : (e.id || '');
      if (e.countKey) {
        const num = d && typeof d[e.countKey] === 'number' ? d[e.countKey] : 0;
        const nm = isEn && e.enName ? e.enName : e.name;
        if (wantCount) return nm + ': ' + num + '.';
        def += ' ' + (isEn
          ? (num ? 'Counted ' + num + ' ' + String(nm).toLowerCase() + ' so far.' : 'No ' + String(nm).toLowerCase() + ' data yet.')
          : (num ? 'Sudah ada ' + num + ' objek berwarna ' + String(nm).toLowerCase() + ' diproses.' : 'Belum ada data objek berwarna ' + String(nm).toLowerCase() + '.'));
      }
      return def || null;
    }
    return null;
  } catch (e) { return null; }
};