/* ==================================================================
   RAI-KNOWLEDGE.JS  -  Library kata kunci R-AI (mode lokal / cadangan)
   ------------------------------------------------------------------
   Dipakai saat model AI online tidak bisa dihubungi: menjawab dari
   data mesin + pengetahuan R-LAB. Semua jawaban ID + EN.
   Fungsi window.raiKnowledgeReply(raw, data, lang):
     raw  -> teks user
     data -> { kuning, biru, merah, gagal, total }
     lang -> 'id' | 'en'
   Mengembalikan jawaban string. TIDAK PERNAH null untuk teks isi:
   selalu ada jawaban fallback kontekstual supaya semua pertanyaan
   habis terjawab.
   Identitas: R-AI = AI buatan R-LAB, gabungan beberapa model AI.
   ================================================================== */
window.RAI_KNOWLEDGE = [
  {
    keys: [' halo ', ' hallo ', ' hello ', ' hai ', ' hei ', ' hii ', 'pagi', 'siang', 'sore', 'malam', 'good morning', 'good afternoon', 'good evening', 'hey ', ' halo!', 'hai!'],
    id: 'Halo juga! Saya R-AI, AI buatan R-LAB. Mau cek status, total, warna, atau riwayat eror? Ketik "bantuan" untuk daftar lengkap.',
    en: 'Hello! I am R-AI, the AI made by R-LAB. Want to check status, totals, colours, or error history? Type "help" for the full list.'
  },
  {
    keys: ['bantuan', 'help', 'bisa apa', 'bisa ngapain', 'fitur apa', 'what can you do', 'perintah apa', 'cara pakai', 'cara pakai', 'cara menggunakan', 'how to use', 'panduan', 'tutorial', 'menu apa'],
    id: 'Saya bisa jawab: status/ringkasan, total, kuning/berapa, biru/berapa, merah/berapa, eror (berapa + kapan pertama/kedua/ketiga/terakhir/riwayat), warna, akurasi, dan istilah mesin (servo, arm, kamera, konveyor, hopper, solenoid, sensor, Teachable Machine, export, missort, timeout, pause, resume, mode, reset). Coba: "status", "total berapa?", atau "kapan eror terakhir?".',
    en: 'I can answer: status/summary, total, yellow/blue/red counts, errors (count + when first/second/third/last + history), colours, accuracy, and machine terms (servo, arm, camera, conveyor, hopper, solenoid, sensor, Teachable Machine, export, missort, timeout, pause, resume, mode, reset). Try: "status", "total?", or "when was the last error?".'
  },
  {
    keys: ['terima kasih', 'makasih', 'thanks', 'thank you', 'mantap', 'bagus', 'keren', 'hebat', 'good job', 'nice'],
    id: 'Sama-sama! Senang bisa membantu memantau mesin sortir R-LAB. Ada lagi yang mau dicek?',
    en: 'You are welcome! Happy to help monitor the R-LAB sorting machine. Anything else to check?'
  },
  {
    keys: ['maaf', 'sorry', 'ampun'],
    id: 'Tidak apa-apa! Silakan tanya apa saja soal mesin sortir R-LAB — status, angka, eror, atau istilah teknis.',
    en: 'No problem! Feel free to ask anything about the R-LAB sorting machine — status, numbers, errors, or technical terms.'
  },
  {
    keys: ['kamu siapa', 'siapa kamu', 'nama kamu', 'namamu', 'nama mu', 'siapa namamu', 'who are you', 'your name', 'what are you', 'kamu apa', 'kamu itu apa', 'kenal kan', 'perkenalkan'],
    id: 'Saya R-AI — AI buatan R-LAB, gabungan dari beberapa model AI. Tugas saya membantu memantau mesin sortir: membaca status, menjawab angka, mencatat eror, dan menjalankan perintah.',
    en: 'I am R-AI — an AI made by R-LAB, combining several AI models. I help monitor the sorting machine: reading status, answering numbers, logging errors, and running commands.'
  },
  {
    keys: ['model apa kamu', 'kamu pakai model', 'kamu pake model', 'r-ai pakai', 'otak r-ai', 'what model are you', 'which model are you', 'dibuat dari apa', 'buatan siapa', 'siapa yang buat', 'pabrikan', 'produsen'],
    id: 'Saya R-AI, AI buatan R-LAB — gabungan dari beberapa model AI yang bekerja sama membantu memantau mesin sortir.',
    en: 'I am R-AI, an AI made by R-LAB — a combination of several AI models working together to monitor the sorting machine.'
  },
  {
    keys: ['r-lab itu apa', 'apa itu r-lab', 'r lab apa', 'tentang r-lab', 'what is r-lab', 'about r-lab', 'r-lab adalah'],
    id: 'R-LAB adalah tim/produsen pembuat sistem Smart Sorting Factory: mesin penyortir objek berwarna (kuning, biru, merah) berbasis kamera + AI, lengkap dengan dashboard realtime, laporan export, dan asisten R-AI.',
    en: 'R-LAB is the team/maker behind the Smart Sorting Factory: a colour-sorting machine (yellow, blue, red) powered by camera + AI, with a realtime dashboard, export reports, and the R-AI assistant.'
  },
  {
    keys: ['tim ', 'developer', 'anggota', 'team ', 'crew', 'pengembang', 'siapa saja', 'team r-lab', 'tim r-lab', 'member'],
    id: 'Tim R-LAB (5 orang): Hamzah Aufa Ibrahim (Mekanik), Muhammad Alif Al Hafidz (Programmer Website & AI), Ahmad Bilal Alfatih (Programmer Otak Robot & Elektronika), Anandha Putra Biankan (Mekanik), Rafandra (Mekanik). Lihat halaman "R-LAB Team" untuk detailnya.',
    en: 'The R-LAB team (5 members): Hamzah Aufa Ibrahim (Mechanic), Muhammad Alif Al Hafidz (Website & AI Programmer), Ahmad Bilal Alfatih (Robot Brain & Electronics Programmer), Anandha Putra Biankan (Mechanic), Rafandra (Mechanic). See the "R-LAB Team" page for details.'
  },
  {
    keys: ['lomba', 'kompetisi', 'competition', 'contest', 'turnamen', 'tournament', 'kejuaraan', 'olimpiade'],
    id: 'R-LAB Smart Sorting Factory dirancang untuk kompetisi robotika & AI tingkat internasional: sistem sortir otonom penuh (kamera + AI + aktuator), dashboard realtime, dan laporan export sebagai bukti kerja.',
    en: 'The R-LAB Smart Sorting Factory is built for international-level robotics & AI competitions: a fully autonomous sorting system (camera + AI + actuator) with a realtime dashboard and exportable reports as proof of work.'
  },
  {
    keys: ['juri', 'judge', 'judging', 'penilaian', 'dinilai', 'scoring', 'score ', 'nilai ', 'kriteria', 'criteria'],
    id: 'Juri lomba biasanya menilai: cara kerja otonom, akurasi sortir (target ≥85%), inovasi, kerapian engineering (mekanik + wiring + kode), dan presentasi. Dasbor R-LAB menampilkan total, tingkat keberhasilan, dan riwayat eror sebagai bukti kuantitatif.',
    en: 'Judges typically score: autonomous operation, sorting accuracy (target ≥85%), innovation, engineering neatness (mechanics + wiring + code), and presentation. The R-LAB dashboard shows totals, success rate, and error history as quantitative proof.'
  },
  {
    keys: ['presentasi', 'presentation', 'demo day', 'pitching', 'paparan', 'menjelaskan ke juri', 'explain'],
    id: 'Tips presentasi ke juri internasional: (1) buka dengan masalah → solusi R-LAB dalam 30 detik, (2) demo live 1 objek per warna, (3) tunjukkan angka dashboard (total, akurasi, error), (4) jelaskan alur: kamera → Teachable Machine → servo/arm → Firebase, (5) tutup dengan rencana pengembangan. Jawab Inggris bila juri berbahasa Inggris — ganti bahasa via tombol ID/EN.',
    en: 'Tips for presenting to international judges: (1) open with problem → R-LAB solution in 30 seconds, (2) live-demo 1 object per colour, (3) show dashboard numbers (total, accuracy, errors), (4) explain the flow: camera → Teachable Machine → servo/arm → Firebase, (5) close with future plans. Answer in English for English-speaking judges — switch via the ID/EN button.'
  },
  {
    keys: ['inovasi', 'innovation', 'inovatif', 'innovative', 'unik', 'kelebihan', 'unggulan', 'advantage', 'baru'],
    id: 'Inovasi R-LAB: klasifikasi warna real-time dengan model AI latih-sendiri (Teachable Machine), aktuator presisi servo/arm, sinkronisasi cloud realtime Firebase, asisten AI bilingual R-AI, dan laporan export otomatis (XLSX/PDF/CSV).',
    en: 'R-LAB innovations: real-time colour classification with a self-trained AI model (Teachable Machine), precision servo/arm actuation, realtime Firebase cloud sync, the bilingual R-AI assistant, and automatic report export (XLSX/PDF/CSV).'
  },
  {
    keys: ['otonom', 'autonomous', 'otomatis penuh', 'mandiri', 'tanpa operator', 'self-'],
    id: 'Sistem R-LAB berjalan otonom: setelah model AI aktif dan konveyor jalan, objek terdeteksi, diklasifikasi, disortir, dan dicatat tanpa operator — hanya dipantau lewat dashboard.',
    en: 'R-LAB runs autonomously: once the AI model is live and the conveyor runs, objects are detected, classified, sorted, and logged with no operator — only monitored via the dashboard.'
  },
  {
    keys: ['micro:bit', 'microbit', 'mikrokontroler', 'microcontroller', 'arduino', 'esp32', 'uart', 'firmware', 'embedded'],
    id: 'Otak robot R-LAB memakai mikrokontroler (micro:bit) dengan firmware embedded yang berkomunikasi via protokol UART: menerima hasil klasifikasi AI lalu menggerakkan servo/aktuator dan membaca sensor.',
    en: 'R-LAB\'s robot brain uses a microcontroller (micro:bit) with embedded firmware communicating over UART: it receives AI classification results, then drives the servo/actuator and reads sensors.'
  },
  {
    keys: ['pengkabelan', 'wiring', 'kabel', 'cable', 'rangkaian', 'circuit', 'elektronika', 'electronics', 'catu daya', 'power supply', 'daya ', 'baterai', 'battery', 'voltase', 'tegangan'],
    id: 'Elektronika R-LAB: pastikan catu daya stabil untuk servo dan mikrokontroler, kabel sinyal rapi dan terkunci, ground bersama, dan pisahkan jalur daya motor dari jalur logika agar tidak ada noise yang mengacaukan klasifikasi.',
    en: 'R-LAB electronics: keep power stable for the servo and microcontroller, signal cables neat and locked, common ground, and separate motor power from logic lines to avoid noise disrupting classification.'
  },
  {
    keys: ['chassis', 'rangka', 'struktur', 'frame', 'mekanik', 'mechanical', 'fabrikasi', 'fabrication', 'rakitan', 'assembly'],
    id: 'Mekanik R-LAB: chassis kokoh hasil fabrikasi, aktuator sortir terpasang kaku tanpa goyang, dan belt konveyor sejajar kamera. Struktur yang kaku = timing sortir yang konsisten = akurasi tinggi di mata juri.',
    en: 'R-LAB mechanics: a rigid fabricated chassis, firmly mounted sorting actuator with no wobble, and a conveyor belt aligned to the camera. Rigid structure = consistent sort timing = high accuracy in judges\' eyes.'
  },
  {
    keys: ['kecepatan', 'speed', 'lambat', 'cepat', 'throughput', 'kapasitas', 'lemot', 'delay ', 'jeda waktu', 'timing'],
    id: 'Kecepatan konveyor ideal: cukup lambat agar frame kamera tajam (tidak blur), cukup cepat agar throughput tinggi. Kalau miss-sort naik saat cepat, turunkan kecepatan atau tambah jeda antar objek.',
    en: 'Ideal conveyor speed: slow enough for sharp camera frames (no blur), fast enough for high throughput. If miss-sorts rise at speed, slow down or add spacing between objects.'
  },
  {
    keys: ['cahaya', 'pencahayaan', 'lighting', 'lampu', 'lamp', 'gelap', 'dark', 'terang', 'bright', 'silau', 'bayangan', 'shadow'],
    id: 'Pencahayaan adalah penentu akurasi warna: pakai lampu putih difus dari atas, hindari silau dan bayangan bergerak. Di arena lomba yang lampunya beda, latih model dengan variasi cahaya atau kalibrasi ulang di tempat.',
    en: 'Lighting decides colour accuracy: use diffused white light from above, avoid glare and moving shadows. At competition venues with different lights, train with varied lighting or recalibrate on site.'
  },
  {
    keys: ['data latih', 'training data', 'sampel', 'sample', 'variasi', 'dataset besar', 'retrain', 'latih ulang', 'overfit', 'generalisasi'],
    id: 'Model kuat butuh data latih bervariasi: tiap warna difoto dari banyak sudut, jarak, dan kondisi cahaya (puluhan sampel per kelas). Bila di arena akurasi drop, latih ulang cepat dengan sampel dari kondisi arena.',
    en: 'A strong model needs varied training data: each colour photographed from many angles, distances, and lights (dozens of samples per class). If accuracy drops at the venue, quickly retrain with samples from venue conditions.'
  },
  {
    keys: ['pit area', 'pit ', 'booth', 'stand', 'arena', 'venue', 'meja lomba', 'persiapan lomba', 'checklist', 'ceklist'],
    id: 'Checklist arena lomba: (1) daya + kabel cadangan, (2) objek cadangan tiap warna, (3) laptop + hotspot cadangan, (4) export PDF terbaru sebagai bukti, (5) obeng & sparepart servo, (6) lap lensa kamera. Datang awal untuk kalibrasi cahaya arena.',
    en: 'Venue checklist: (1) spare power + cables, (2) spare objects per colour, (3) laptop + backup hotspot, (4) latest exported PDF as proof, (5) screwdriver & servo spares, (6) lens cloth. Arrive early to calibrate for venue lighting.'
  },
  {
    keys: ['aman', 'safety', 'keamanan', 'bahaya', 'safety switch', 'darurat', 'emergency'],
    id: 'Keamanan: jauhkan jari dari arm/servo saat aktif, matikan daya sebelum mengubah wiring, dan siapkan tombol stop darurat (atau perintah jeda). Juri menghargai tim yang memikirkan safety.',
    en: 'Safety: keep fingers clear of the arm/servo while active, cut power before touching wiring, and prepare an emergency stop (or the pause command). Judges value teams that think about safety.'
  },
  {
    keys: ['inggris', 'english ', 'bahasa inggris', 'translate to english', 'in english'],
    id: 'Siap, saya jawab dalam Bahasa Inggris bila tombol bahasa di posisi EN. R-AI bilingual penuh: UI, jawaban, dan suara mengikuti pilihan ID/EN. Contoh: tanya "what is the total?" untuk jawaban Inggris.',
    en: 'Got it — I reply in English when the language button is set to EN. R-AI is fully bilingual: UI, answers, and voice follow the ID/EN choice. Example: ask "what is the total?" for an English answer.'
  },
  {
    keys: ['biru', 'blue'],
    name: 'Biru', enName: 'Blue', countKey: 'biru',
    id: 'Biru adalah salah satu dari 3 warna objek yang disortir mesin R-LAB (kuning, biru, merah). Objek terdeteksi biru diarahkan ke jalur biru.',
    en: 'Blue is one of 3 colours sorted by R-LAB (yellow, blue, red). Objects detected as blue go to the blue lane.'
  },
  {
    keys: ['kuning', 'yellow'],
    name: 'Kuning', enName: 'Yellow', countKey: 'kuning',
    id: 'Kuning adalah salah satu warna objek yang disortir R-LAB. Konveyor membawa objek ke kamera, lalu servo/arm mengarahkannya ke jalur kuning.',
    en: 'Yellow is one of the colours sorted by R-LAB. The conveyor carries objects to the camera, then the servo/arm directs them to the yellow lane.'
  },
  {
    keys: ['merah', 'red'],
    name: 'Merah', enName: 'Red', countKey: 'merah',
    id: 'Merah adalah salah satu warna objek yang disortir R-LAB. Sistem menghitung total merah dan memantau akurasi klasifikasinya.',
    en: 'Red is one of the colours sorted by R-LAB. The system counts red objects and monitors classification accuracy.'
  },
  {
    keys: ['warna', 'colors', 'colours', 'colour', 'color', 'warna apa'],
    fn: function (d, isEn, wantCount) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      if (isEn) return 'R-LAB sorts three object colours: yellow, blue and red. Current: yellow ' + s.kuning +
        ', blue ' + s.biru + ', red ' + s.merah + ', error ' + s.gagal + ', total ' + s.total + '.';
      return 'R-LAB menyortir tiga warna objek: kuning, biru, dan merah. Saat ini kuning ' + s.kuning +
        ', biru ' + s.biru + ', merah ' + s.merah + ', error ' + s.gagal + ', total ' + s.total + '.';
    }
  },
  {
    keys: ['total', 'jumlah semua', 'berapa banyak', 'how many', 'jumlahnya', 'hitung', 'sebanyak', 'keseluruhan', 'rekap'],
    fn: function (d, isEn) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      const ok = (s.total || 0) - (s.gagal || 0);
      const rate = s.total > 0 ? Math.round(ok / s.total * 100) : 0;
      return isEn
        ? 'Total processed: ' + s.total + ' items (yellow ' + s.kuning + ', blue ' + s.biru + ', red ' + s.merah + ', error ' + s.gagal + '). Success rate ' + rate + '%.'
        : 'Total diproses: ' + s.total + ' barang (kuning ' + s.kuning + ', biru ' + s.biru + ', merah ' + s.merah + ', error ' + s.gagal + '). Tingkat keberhasilan ' + rate + '%.';
    }
  },
  {
    keys: ['status', 'ringkasan', 'laporan singkat', 'summary', 'report', 'keadaan', 'kondisi', 'gimana mesin', 'bagaimana mesin', 'info mesin', 'dashboard'],
    fn: function (d, isEn) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      const ok = (s.total || 0) - (s.gagal || 0);
      const rate = s.total > 0 ? Math.round(ok / s.total * 100) : 0;
      return isEn
        ? 'Machine status: total ' + s.total + ', yellow ' + s.kuning + ', blue ' + s.biru + ', red ' + s.merah + ', errors ' + s.gagal + ', success ' + rate + '%. Ask "when was the last error" for error timing.'
        : 'Status mesin: total ' + s.total + ', kuning ' + s.kuning + ', biru ' + s.biru + ', merah ' + s.merah + ', eror ' + s.gagal + ', keberhasilan ' + rate + '%. Tanya "kapan eror terakhir" untuk waktu eror.';
    }
  },
  {
    keys: ['kapan eror', 'kapan error', 'waktu eror', 'waktu error', 'jam eror', 'jam error', 'when error', 'when eror', 'eror pertama', 'error pertama', 'first error', 'eror kedua', 'error kedua', 'second error', 'eror ketiga', 'error ketiga', 'third error', 'eror terakhir', 'error terakhir', 'last error', 'latest error', 'riwayat eror', 'riwayat error', 'error history', 'daftar eror', 'catatan eror', 'eror ke-', 'error ke-'],
    fn: function (d, isEn) {
      return isEn
        ? 'Error timestamps are tracked in the dashboard log. In the main R-LAB dashboard ask "when was the first/second/third/last error" for the exact colour and time.'
        : 'Waktu eror tercatat di log dashboard. Di dashboard R-LAB utama, tanya "kapan eror pertama/kedua/ketiga/terakhir" untuk warna dan jam pastinya.';
    }
  },
  {
    keys: ['error', 'eror', 'gagal', 'fail', 'kegagalan'],
    name: 'Error', enName: 'errors', countKey: 'gagal',
    id: 'Objek error adalah yang gagal diklasifikasi atau masuk jalur yang salah. Setiap eror tercatat: kapan (tanggal+jamm), warna apa, dan penanganannya — "Timeout/Error" (otomatis 12 detik), "Force Timeout" (manual), atau "Manual QC" (miss-sort dicatat manual). Tanya "kapan eror pertama/terakhir" untuk detailnya.',
    en: 'Error objects failed classification or went to the wrong lane. Each error is logged with: when (date+time), which colour, and its handling — "Timeout/Error" (automatic 12s), "Force Timeout" (manual), or "Manual QC" (manually logged miss-sort). Ask "when was the first/last error" for details.'
  },
  {
    keys: ['akurasi', 'accuracy', 'akurat', 'tepat', 'presisi', 'keberhasilan', 'success rate', 'persentase benar', 'berapa persen'],
    fn: function (d, isEn) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      const ok = (s.total || 0) - (s.gagal || 0);
      const rate = s.total > 0 ? (ok / s.total * 100).toFixed(1) : '0.0';
      return isEn
        ? 'Current sorting accuracy: ' + rate + '% (' + ok + ' good out of ' + s.total + '). The Teachable Machine model targets at least 85% per-class confidence.'
        : 'Akurasi sortir saat ini: ' + rate + '% (' + ok + ' bagus dari ' + s.total + '). Model Teachable Machine menargetkan keyakinan minimal 85% per kelas.';
    }
  },
  {
    keys: ['servo', 'motor servo', 'penggerak'],
    id: 'Servo adalah motor penggerak putar yang mengayunkan lengan penyortir R-LAB. Saat AI mendeteksi warna objek, servo menyapu objek ke jalur tujuannya (kuning/biru/merah). Kalau servo macet, cek catu daya, kabel sinyal, dan sudut kalibrasinya.',
    en: 'A servo is the rotary motor that swings the R-LAB sorting arm. When AI detects an object colour, the servo sweeps it to its lane (yellow/blue/red). If it jams, check power, signal wiring, and angle calibration.'
  },
  {
    keys: ['arm', 'lengan', 'lengan sortir', 'sweeper', 'penyapu'],
    id: 'Arm (lengan) adalah bagian mekanik R-LAB yang mengarahkan objek ke jalur yang benar. Mode Arm/Servo menentukan penggerak yang dipakai — pilih sesuai mekanik yang terpasang.',
    en: 'The arm is the mechanical part of R-LAB that guides objects to the correct lane. Arm/Servo mode picks the actuator in use — match it to your installed hardware.'
  },
  {
    keys: ['kamera', 'camera', 'webcam', 'cam '],
    id: 'Kamera menangkap frame objek di jalur sortir, lalu model AI mengklasifikasikannya menjadi kuning, biru, atau merah. Tips: pastikan pencahayaan stabil, fokus tajam, dan beri izin kamera di browser (buka via localhost/HTTPS).',
    en: 'The camera captures frames of objects on the line, then the AI model classifies each as yellow, blue, or red. Tips: keep lighting stable, focus sharp, and allow camera permission (open via localhost/HTTPS).'
  },
  {
    keys: ['teachable machine', 'teachablemachine', 'machine learning', 'model ai', 'modelnya', 'klasifik', 'training', 'latih model', 'dataset', 'tensorflow', 'tm model'],
    id: 'Model AI R-LAB dilatih dengan Teachable Machine (berbasis TensorFlow.js): model mengenali pola objek dan mengklasifikasikannya sebagai kuning, biru, atau merah dengan target keyakinan minimal 85%. Latih tiap kelas dengan banyak variasi sudut dan cahaya supaya akurat.',
    en: 'R-LAB\'s AI model is trained with Teachable Machine (TensorFlow.js based): it learns object patterns and classifies them as yellow, blue, or red with at least 85% target confidence. Train each class with varied angles and lighting for accuracy.'
  },
  {
    keys: ['konveyor', 'conveyor', 'ban berjalan', 'belt', 'sabuk', 'lintasan'],
    id: 'Konveyor (ban berjalan) membawa objek satu per satu melewati kamera sehingga bisa disortir dan dihitung. Jaga jarak antar objek dan kecepatan stabil supaya klasifikasi tidak buram.',
    en: 'The conveyor belt carries objects one by one past the camera so they can be sorted and counted. Keep spacing and steady speed so classification stays sharp.'
  },
  {
    keys: ['hopper', 'penampung', 'wadah', 'bak'],
    id: 'Hopper adalah wadah penampung objek sebelum masuk konveyor. Isi secukupnya dan pastikan objek keluar satu per satu agar kamera mudah membaca warnanya.',
    en: 'The hopper holds objects before they enter the conveyor. Fill it moderately so objects exit one by one for easy colour reading.'
  },
  {
    keys: ['solenoid', 'katup', 'pendorong', 'pneumatik', 'aktuator'],
    id: 'Solenoid adalah aktuator listrik yang mendorong/menolak objek ke jalurnya — alternatif atau pelengkap servo/arm di sistem sortir R-LAB.',
    en: 'A solenoid is an electric actuator that pushes objects into their lane — an alternative or complement to the servo/arm in R-LAB.'
  },
  {
    keys: ['sensor', 'sensor apa', 'pendeteksi'],
    id: 'Sensor adalah alat pendeteksi yang memberi sinyal ke mesin. Di R-LAB, kamera membaca objek lalu model AI menentukan warnanya; sensor tambahan (jarak/cahaya) bisa memicu timing sortir.',
    en: 'A sensor detects signals for the machine. In R-LAB the camera reads objects and the AI decides the colour; extra sensors (distance/light) can trigger sort timing.'
  },
  {
    keys: ['kalibrasi', 'calibration', 'setting sudut', 'atur sudut', 'stel'],
    id: 'Kalibrasi menyetel sudut servo/arm, posisi kamera, dan ambang keyakinan AI supaya objek jatuh tepat di jalurnya. Ulangi kalibrasi tiap ganti objek atau posisi mekanik.',
    en: 'Calibration sets the servo/arm angles, camera position, and AI confidence threshold so objects land in the right lane. Recalibrate whenever objects or mechanics change.'
  },
  {
    keys: ['export', 'ekspor', 'xlsx', 'excel', 'pdf', 'csv', 'laporan', 'report', 'unduh', 'download laporan', 'cetak'],
    id: 'Fitur export membuat laporan sortir ke Excel (XLSX), PDF, atau CSV berisi ringkasan total per warna, tingkat keberhasilan, dan log detail. Di mode guest tombol export terkunci; minta admin untuk export.',
    en: 'Export builds a sorting report in Excel (XLSX), PDF, or CSV with per-colour totals, success rate, and detailed logs. In guest mode export is locked; ask an admin to export.'
  },
  {
    keys: ['missort', 'miss-sort', 'salah sortir', 'salah urut', 'salah jalur', 'salah masuk', 'nyasar'],
    id: 'Miss-sort (salah sortir) = objek jatuh ke jalur yang salah. Kamu bisa mencatatnya lewat perintah R-AI supaya masuk laporan error. Penyebab umum: timing servo telat, objek terlalu rapat, atau keyakinan AI rendah.',
    en: 'Miss-sort means an object went to the wrong lane. Log it via an R-AI command so it enters the error report. Common causes: late servo timing, crowded objects, or low AI confidence.'
  },
  {
    keys: ['timeout', 'paksa timeout', 'force timeout', 'macet', 'menggantung', 'hang', 'nggak jalan', 'tidak jalan', 'berhenti'],
    id: 'Force timeout memberi tahu mesin bahwa objek sudah lewat walau kamera tidak menangkapnya, supaya proses tidak menggantung. Kalau sering macet, cek pencahayaan, posisi kamera, dan koneksi model AI.',
    en: 'Force timeout tells the machine an object already passed even if the camera missed it, so the process never hangs. If stalls repeat, check lighting, camera position, and the AI model connection.'
  },
  {
    keys: ['jeda', 'pause', 'hentikan sementara', 'p ause'],
    id: 'Perintah jeda (pause) menghentikan sementara loop sortir/AI tanpa mematikan dashboard. Kirim "lanjut/resume" untuk melanjutkan.',
    en: 'The pause command temporarily stops the sorting/AI loop without killing the dashboard. Send "resume" to continue.'
  },
  {
    keys: ['lanjut', 'resume', 'teruskan', 'mulai lagi', 'jalan lagi'],
    id: 'Perintah lanjut (resume) meneruskan kembali loop sortir/AI setelah dijeda.',
    en: 'The resume command restarts the sorting/AI loop after a pause.'
  },
  {
    keys: ['mode sortir', 'sorting mode', 'mode arm', 'mode servo', 'ganti mode', 'ubah mode', 'pindah mode'],
    id: 'R-LAB punya dua mode sortir: Arm (lengan penyapu) dan Servo. Perintah "mode arm" / "mode servo" mengganti penggerak yang dipakai — sesuaikan dengan mekanik terpasang.',
    en: 'R-LAB has two sorting modes: Arm (sweeper arm) and Servo. The "arm mode" / "servo mode" commands switch the actuator — match your installed hardware.'
  },
  {
    keys: ['reset', 'atur ulang', 'nolkan', 'reset data', 'hapus data', 'mulai dari nol'],
    id: 'Reset mengosongkan hitungan (kuning, biru, merah, error, total) dan log. Hati-hati: data yang direset tidak bisa dikembalikan kecuali sudah di-export.',
    en: 'Reset clears the counters (yellow, blue, red, error, total) and logs. Careful: reset data cannot be recovered unless already exported.'
  },
  {
    keys: ['aturan', 'rule ', 'aturan sortir', 'atur aturan'],
    id: 'Aturan sortir menentukan ke mana tiap warna diarahkan dan ambang keyakinannya. Kelola aturan dari panel admin; mode guest hanya bisa melihat.',
    en: 'Sorting rules decide where each colour goes and the confidence threshold. Manage rules from the admin panel; guest mode is view-only.'
  },
  {
    keys: ['firebase', 'database', 'basis data', 'realtime db', 'konek', 'connect', 'hubungkan', 'tersambung', 'online'],
    id: 'Data sortir R-LAB tersimpan di Firebase Realtime Database: hitungan kuning, biru, merah, error, dan total — tersinkron realtime antara admin dan guest. Kredensialnya bersifat pribadi dan tidak saya bagikan.',
    en: 'R-LAB stores sorting data in Firebase Realtime Database: yellow, blue, red, error counts and totals — synced realtime between admin and guest. Credentials are private and I never share them.'
  },
  {
    keys: ['password', 'api key', 'apikey', 'kunci api', 'kunci', 'kredensial', 'credential', 'token', 'rahasia', 'secret', 'database apa', 'isi database', 'lihat database', 'config'],
    id: 'Maaf, itu privasi — saya tidak bisa membagikan password, API key, kredensial, atau isi database apa pun. Saya hanya menjawab data sortir dan pengetahuan R-LAB.',
    en: 'Sorry, that is private — I cannot share passwords, API keys, credentials, or any database contents. I only answer sorting data and R-LAB knowledge.'
  },
  {
    keys: ['suara', 'voice', 'mic ', 'mikrofon', 'microphone', 'bicara', 'ngomong', 'dengar'],
    id: 'R-AI mendukung input suara (mikrofon, speech-to-text) dan jawaban bersuara (text-to-speech). Ketuk ikon mic di panel chat, izinkan akses mikrofon, lalu bicara — misal "status" atau "total berapa?".',
    en: 'R-AI supports voice input (microphone, speech-to-text) and spoken replies (text-to-speech). Tap the mic icon in the chat panel, allow microphone access, then speak — e.g. "status" or "total?".'
  },
  {
    keys: ['bahasa', 'language', 'english', 'indonesia', 'ganti bahasa', 'translate'],
    id: 'R-AI bilingual: Indonesia dan Inggris. Ketuk tombol ID/EN di bar atas untuk ganti bahasa tampilan; saya otomatis menjawab sesuai bahasa pertanyaanmu.',
    en: 'R-AI is bilingual: Indonesian and English. Tap the ID/EN button in the top bar to switch display language; I auto-reply in your question language.'
  },
  {
    keys: ['tema', 'theme', 'gelap', 'terang', 'dark mode', 'light mode', 'mode malam'],
    id: 'Dashboard mendukung tema terang dan gelap. Ketuk ikon bulan/matahari di bar atas untuk berganti — pilihanmu tersimpan otomatis.',
    en: 'The dashboard supports light and dark themes. Tap the moon/sun icon in the top bar to switch — your choice is saved automatically.'
  },
  {
    keys: ['guest', 'tamu', 'admin', 'beda guest', 'beda admin', 'hak akses', 'login', 'masuk admin', 'keluar', 'logout'],
    id: 'Mode guest bersifat lihat-saja: bisa memantau angka dan tanya R-AI, tapi kontrol (mode, reset, aturan, export) terkunci. Mode admin (pakai password) membuka semua kontrol. Klik ikon rumah untuk kembali ke pilihan masuk.',
    en: 'Guest mode is view-only: you can watch numbers and ask R-AI, but controls (mode, reset, rules, export) are locked. Admin mode (password) unlocks everything. Tap the home icon to return to login choices.'
  },
  {
    keys: ['jam', 'waktu', 'pukul', 'tanggal', 'hari ini', 'time', 'clock', 'kapan'],
    fn: function (d, isEn) {
      const now = new Date();
      const s = now.toLocaleString(isEn ? 'en-US' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' });
      return isEn
        ? 'Current time: ' + s + '. For error timing, ask "when was the first/last error".'
        : 'Waktu sekarang: ' + s + '. Untuk waktu eror, tanya "kapan eror pertama/terakhir".';
    }
  },
  {
    keys: ['cuaca', 'weather', 'hujan', 'panas'],
    id: 'Saya fokus ke mesin sortir R-LAB, jadi tidak memantau cuaca. Tapi pastikan area sortir kering dan terang — kelembapan dan cahaya redup menurunkan akurasi kamera.',
    en: 'I focus on the R-LAB sorting machine, so I do not track weather. But keep the sorting area dry and bright — humidity and dim light lower camera accuracy.'
  },
  {
    keys: ['siapa', 'apa itu', 'apakah', 'bagaimana', 'kenapa', 'mengapa', 'dimana', 'kapan', 'berapa', 'what is', 'what are', 'who is', 'how ', 'why ', 'where ', 'when '],
    fn: function (d, isEn, wantCount, rawRef) {
      return null; // ditangani fallback pintar di bawah agar tidak membajak kata tanya umum
    }
  },
  {
    keys: ['objek', 'object', 'barang', 'benda', 'benda apa', 'bahan'],
    fn: function (d, isEn) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      return isEn
        ? 'Objects are the coloured items sorted by the machine (yellow/blue/red). So far: yellow ' + s.kuning + ', blue ' + s.biru + ', red ' + s.merah + ', total ' + s.total + '.'
        : 'Objek adalah barang berwarna yang disortir mesin (kuning/biru/merah). Sejauh ini: kuning ' + s.kuning + ', biru ' + s.biru + ', merah ' + s.merah + ', total ' + s.total + '.';
    }
  },
  {
    keys: ['unknown', 'tidak dikenal', 'tidak terdeteksi', 'abu-abu', 'abu ', 'grey', 'gray', 'warna lain'],
    id: 'Objek "Unknown"/tak dikenal adalah yang keyakinan AI-nya di bawah ambang (mis. <85%) sehingga tidak diklasifikasi ke kuning/biru/merah. Tambah data latih atau perbaiki cahaya untuk menguranginya.',
    en: 'Objects marked "Unknown" scored below the AI confidence threshold (e.g. <85%), so they were not classified yellow/blue/red. Add training samples or fix lighting to reduce them.'
  },
  {
    keys: ['deteksi', 'detect', 'klasifikasi', 'classify', 'mengenali', 'membaca warna', 'cara kerja', 'cara sortir', 'alur', 'proses sortir', 'skema', 'diagram'],
    id: 'Alur sortir R-LAB: (1) objek keluar hopper ke konveyor, (2) kamera menangkap frame, (3) model Teachable Machine mengklasifikasi warna (kuning/biru/merah), (4) servo/arm mendorong objek ke jalurnya, (5) hitungan + log tersimpan ke Firebase dan bisa di-export.',
    en: 'R-LAB sorting flow: (1) objects leave the hopper onto the conveyor, (2) the camera captures frames, (3) the Teachable Machine model classifies the colour (yellow/blue/red), (4) the servo/arm pushes each object to its lane, (5) counts + logs save to Firebase and can be exported.'
  },
  {
    keys: ['robot', 'robotik', 'robotics', 'otomatis', 'automation', 'otomasi', 'pabrik pintar', 'smart factory', 'industri'],
    id: 'Smart Sorting Factory R-LAB adalah miniatur pabrik pintar: robotika (servo/arm + konveyor), AI vision (kamera + Teachable Machine), dan dashboard web realtime (Firebase + export laporan) dalam satu sistem.',
    en: 'R-LAB\'s Smart Sorting Factory is a miniature smart factory: robotics (servo/arm + conveyor), AI vision (camera + Teachable Machine), and a realtime web dashboard (Firebase + report export) in one system.'
  },
  {
    keys: ['perawatan', 'maintenance', 'rawat', 'bersihkan', 'service', 'awet', 'rusak', 'bermasalah', 'gejala', 'solusi', 'tips', 'troubleshoot'],
    id: 'Perawatan R-LAB: bersihkan lensa kamera dan belt konveyor tiap hari, cek kekencangan arm/servo tiap minggu, pastikan pencahayaan stabil, dan latih ulang model AI bila akurasi turun di bawah 85%. Masalah umum: kamera gelap (cek izin/lampu), servo macet (cek daya/kabel), miss-sort sering (cek timing dan jarak objek).',
    en: 'R-LAB maintenance: clean the camera lens and conveyor belt daily, check arm/servo tightness weekly, keep lighting stable, and retrain the AI model if accuracy drops below 85%. Common issues: dark camera (check permission/lamp), jammed servo (check power/cables), frequent miss-sorts (check timing and object spacing).'
  },
  {
    keys: ['demo', 'tahap demo', 'beta', 'uji coba', 'dikembangkan', 'masih demo'],
    id: 'Benar — mode lokal R-AI masih tahap demo dan akan terus dikembangkan. Jawaban lokal bersifat terbatas dari data mesin; saat AI online terjangkau, jawaban menjadi jauh lebih lengkap.',
    en: 'Correct — R-AI local mode is still in demo and under continuous development. Local answers are limited to machine data; when online AI is reachable, answers become far richer.'
  }
];

/* Normalisasi warna ke Kuning/Biru/Merah. Kembalikan string atau null.
   Dipakai export & dashboard supaya TIDAK PERNAH ada 'Unknown'. */
window.raiKnownWarna = function (w) {
  const s = String(w || '').toLowerCase();
  if (!s) return null;
  if (s.indexOf('kuning') !== -1 || s.indexOf('yellow') !== -1) return 'Kuning';
  if (s.indexOf('biru') !== -1 || s.indexOf('blue') !== -1) return 'Biru';
  if (s.indexOf('merah') !== -1 || s.indexOf('red') !== -1) return 'Merah';
  return null;
};
/* Isi warna kosong/Unknown dari baris tetangga terdekat (array urut waktu
   menaik). Mutasi langsung tiap baris (.warna). Baris tanpa warna valid
   mengambil warna tetangga terdekat; bila seluruh dataset buta, dibiarkan. */
window.raiFillWarna = function (rows) {
  try {
    if (!rows || !rows.length) return rows;
    const known = window.raiKnownWarna;
    let last = null, i = 0;
    for (i = 0; i < rows.length; i++) {
      const k = known(rows[i].warna);
      if (k) { rows[i].warna = k; last = k; }
    }
    let next = null;
    for (i = rows.length - 1; i >= 0; i--) {
      const k = known(rows[i].warna);
      if (k) { next = k; }
      else if (next) { rows[i].warna = next; }
      else if (last) { rows[i].warna = last; }
    }
  } catch (e) {}
  return rows;
};

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
      if (typeof e.fn === 'function') {
        const r = e.fn(d, isEn, wantCount);
        if (r) return r;
        continue; // fn null = lewati, jangan hentikan pencarian
      }
      let def = isEn ? (e.en || '') : (e.id || '');
      if (e.countKey) {
        const num = d && typeof d[e.countKey] === 'number' ? d[e.countKey] : 0;
        const nm = isEn && e.enName ? e.enName : e.name;
        if (wantCount) return nm + ': ' + num + '.';
        def += ' ' + (isEn
          ? (num ? 'Counted ' + num + ' ' + String(nm).toLowerCase() + ' so far.' : 'No ' + String(nm).toLowerCase() + ' data yet.')
          : (num ? 'Sudah ada ' + num + ' objek berwarna ' + String(nm).toLowerCase() + ' diproses.' : 'Belum ada data objek berwarna ' + String(nm).toLowerCase() + '.'));
      }
      if (def) return def;
    }
    // Fallback pintar: SEMUA pertanyaan dijawab — tidak pernah null untuk teks berisi huruf/angka
    if (/[a-z0-9\u00c0-\u024f]/i.test(clean)) {
      const s = d || { kuning: 0, biru: 0, merah: 0, gagal: 0, total: 0 };
      const ok = (s.total || 0) - (s.gagal || 0);
      const rate = s.total > 0 ? Math.round(ok / s.total * 100) : 0;
      const demo = isEn
        ? 'Note: local mode is still demo & under development. '
        : 'Catatan: mode lokal masih tahap demo & terus dikembangkan. ';
      const snap = isEn
        ? 'Current machine data: total ' + s.total + ' (yellow ' + s.kuning + ', blue ' + s.biru + ', red ' + s.merah + ', errors ' + s.gagal + ', success ' + rate + '%). '
        : 'Data mesin saat ini: total ' + s.total + ' (kuning ' + s.kuning + ', biru ' + s.biru + ', merah ' + s.merah + ', eror ' + s.gagal + ', keberhasilan ' + rate + '%). ';
      const guide = isEn
        ? 'I am R-AI (R-LAB AI). I answered from local R-LAB knowledge for "' + clean.slice(0, 80) + '". Try: "status", "total?", "when was the last error", or terms like servo, camera, conveyor, hopper, solenoid, export, missort.'
        : 'Saya R-AI (AI R-LAB). Saya jawab dari pengetahuan lokal R-LAB untuk "' + clean.slice(0, 80) + '". Coba: "status", "total berapa?", "kapan eror terakhir?", atau istilah seperti servo, kamera, konveyor, hopper, solenoid, export, missort.';
      return demo + snap + guide;
    }
    return null;
  } catch (e) { return null; }
};
