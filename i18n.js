/* English / Bahasa Indonesia / Italiano switch for the main page.
   English lives in index.html; Indonesian and Italian live here, keyed by data-i18n.
   The choice is remembered in localStorage when the browser allows it. */
(function () {
    var ID = {
        'skip': 'Langsung ke isi',
        't1': 'NASA Space Apps Milano, 14 dan 15 November',
        't2': 'catatan saya terbuka di /notes',
        't3': 'HIPPO-C sudah ada di GitHub',
        't4': 'esai baru di Substack',

        'n.about': 'tentang',
        'n.work': 'karya',
        'n.notes': 'catatan',
        'n.faq': 'tanya jawab',

        'h.lede': 'Saya tumbuh di Garut, kota kecil di Jawa Barat, dengan mimpi menjadi astrofisikawan. Sekarang saya menjalani tahun kedua S2 astrofisika dan kosmologi di Padova. Saya menulis esai, membuat video, dan membuka catatan kuliah saya untuk siapa saja.',
        'h.c1': 'Riset VLBI yang sudah terbit',
        'h.c2': 'Pembicara DevFest Milano 2026',
        'h.c3': 'Pendiri Sadar Setara',
        'h.c4': 'Wakil Ketua PPI Triveneto',
        'h.b1': 'lihat karya saya',
        'h.b2': 'catatan saya',
        'h.cap': 'hari-hari di observatorium · foto saya sendiri',
        'h.eye': 'S2 astrofisika dan kosmologi · Università di Padova',
        'a.label': '00 · tentang',
        'id.study': 'Studi',
        'now.5': '<strong>Akhir pekan ini.</strong> NASA Space Apps Milano, 14 dan 15 November.',
        'id.motto2': 'hasil yang tidak bisa diulang orang lain belum menjadi pengetahuan',
        'k.bar': 'lompat ke bagian',
        'k.open': 'buka',
        'k.ph': 'Ketik nama bagian atau tautan',
        'k.values': 'nilai',
        'k.contact': 'kontak',

        'f.work': 'karya',
        'f.notes': 'catatan',
        'f.essays': 'esai',
        'f.code': 'kode',

        'a.h': 'Hai, saya Jessica. Salam kenal!',
        'a.p1': 'Sebagian besar waktu saya di Padova tidak dihabiskan memandangi langit malam lewat teleskop yang romantis. Waktu saya habis di meja, bergulat dengan persamaan medan Einstein, membongkar integral transfer radiasi, dan merapikan simbol Christoffel di kertas coretan.',
        'a.p2': 'Sebelum ke Padova saya kuliah Fisika di Universitas Gadjah Mada. Riset saya yang sudah terbit mengikuti 33 tahun pengamatan VLBI terhadap kuasar 4C31.61, untuk menguji seberapa stabil ia sebagai jangkar kerangka acuan langit (<a href="https://arxiv.org/abs/2401.12325">arXiv:2401.12325</a>).',
        'a.p3': 'Planet favorit saya WASP-12b. Satu tahunnya hanya sekitar satu hari, dan bintangnya pelan-pelan menelannya. Tahun ini saya mengamatinya melintas di depan bintang itu, di laboratorium dan di kode saya sendiri.',
        'a.p4': 'Di luar laboratorium saya menulis esai di <a href="https://yourastrophysicist.substack.com">Substack</a>, kebanyakan dalam bahasa Indonesia, dan membuat video sebagai <a href="https://www.youtube.com/@obspeaking">Observationally Speaking</a>.',
        'a.car': 'sehari di observatorium',

        'id.small': 'Pemegang kartu ini adalah astrofisikawan BRAT bersertifikat',
        'id.name': 'Nama',
        'id.based': 'Tinggal di',
        'id.italy': 'Italia',
        'id.from': 'Asal',
        'id.spec': 'Keahlian',
        'id.astro': 'data astro',
        'id.motto': 'Motto · hasil yang tidak bisa diulang orang lain belum menjadi pengetahuan',

        'now.1': '<strong>Kuliah.</strong> Exoplanetary Astrophysics, Astro-Statistics and Cosmology, Astrophysics Laboratory 2, Computational Astrophysics.',
        'now.2': '<strong>Lab.</strong> Fotometri transit WASP-12b dengan teleskop Copernico 1,82 m di Asiago.',
        'now.3': '<strong>Kode.</strong> <a href="https://github.com/doddamre/HIPPO-C">HIPPO-C</a>, proyek kelompok untuk Computational Astrophysics. Kami memodelkan transit HIP 67522 c dan melatih machine learning untuk mencari transit di data TESS.',
        'now.4': '<strong>Talk terakhir.</strong> <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a> di DevFest Milano.',

        'w.label': '01 · yang sudah saya kerjakan',
        'w.h': 'Karya',
        'w.sub': 'Jalan ke Padova melewati pers mahasiswa, lembaga riset, data kesehatan anak, dan sebuah gerakan di kampung halaman saya. Dari semua itu saya belajar satu hal. Organisasi yang baik adalah organisasi yang bisa ditanya dan bisa diandalkan.',
        'r1.h': 'Magang riset dan skripsi, <a href="https://www.brin.go.id/">BRIN</a>',
        'r1.m': 'Badan Riset dan Inovasi Nasional',
        'r1.d': 'Untuk magang dan skripsi saya mengikuti satu kuasar, 4C31.61, melalui 33 tahun pengamatan VLBI. Saya mengukur seberapa stabil posisinya dengan deviasi standar Allan, lewat pipeline Python yang saya tulis sendiri. Hasilnya terbit di Journal of Physics Conference Series.',
        'r2.h': 'Analis data, <a href="https://www.equityinitiative.org/">The Equity Initiative</a>',
        'r2.d': 'Sebelum ke Italia saya bekerja sebagai analis data untuk program penurunan stunting di NTT dan Jawa Barat. Setiap data selalu tentang orang-orang di balik angka, dan di sini mereka adalah anak-anak.',
        'r3.h': 'Ketua Litbang, <a href="https://balairungpress.com/">BPPM Balairung UGM</a>',
        'r3.d': 'Pelajaran pertama saya soal data terjadi di pers mahasiswa UGM yang berdiri sejak 1985. Saya memimpin divisi penelitian dan pengembangan, yang mengerjakan jajak pendapat, survei, dan analisis media untuk mahasiswa. Saya juga menjadi reporter dan editor di balairungpress.com dan menulis di Jurnal Balairung.',
        'r4.h': 'Pembicara, <a href="https://2026.devfestmilano.it/it/speakers/jessica-syafaq-muthmaina/">Google DevFest Milano 2026</a>',
        'r4.d': 'Pada Oktober 2026 saya membawakan lightning talk berjudul <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a>. Jawaban saya cukup satu kalimat. Siapa yang menerbitkan karya, dialah yang wajib memeriksanya.',
        'r5.h': 'Penulis',
        'r5.m': 'sejak 2020',
        'r5.d': 'Saya mulai menulis di <a href="https://syafaqmuth.medium.com/">Medium</a> pada 2020 dan tidak pernah benar-benar berhenti. Sekarang saya menulis tentang astrofisika, data, dan masyarakat di <a href="https://yourastrophysicist.substack.com/">Substack</a> dan <a href="https://omong-omong.com/user/yourastrophysicist/">Omong-Omong</a>, kebanyakan dalam bahasa Indonesia, supaya orang-orang di rumah juga bisa membacanya.',
        'o1.h': 'Wakil Ketua, PPI Triveneto',
        'o1.d': 'Di Padova saya menjadi Wakil Ketua PPI Triveneto. Visi kami sederhana, tanggap dan solutif. Pelajaran terbesar saya dari sana adalah bahwa yang paling menolong pelajar bukan acara, tapi jawaban yang tepat dan akurat.',
        'o2.h': 'PIC Italia, <a href="https://www.instagram.com/italiabergerak/">Italia Bergerak</a>',
        'o2.m': 'Italia · 2026',
        'o2.d': 'Sebagai PIC Italia untuk Italia Bergerak, saya ikut membawa film dokumenter <i>Pesta Babi</i> ke Teatro Ruzante, Padova, pada 29 Juni 2026, bersama Monday Screen dan Greenpeace Padova. Film tersebut merekam perampasan 2,5 juta hektare tanah adat untuk proyek agroindustri. Setelah pemutaran, sutradara Cypri Dale berdiskusi bersama penonton.',
        'o3.h': 'Pendiri, <a href="https://www.instagram.com/sadarsetara/">Sadar Setara</a>',
        'o3.m': 'Garut · sejak 2025',
        'o3.d': 'Garut adalah kampung halaman saya, dan isu gender di sana butuh ruang untuk dibicarakan. Maka saya mendirikan Sadar Setara, ruang belajar dan bersuara. Manifestonya kini terbit dalam bahasa Indonesia, Inggris, Italia, dan Prancis. Pada 27 Maret 2025 kami menggelar Aksi Kamisan pertama di Garut, untuk menolak revisi UU TNI dan menuntut supremasi sipil.',
        'o4.h': 'Salah satu pendiri, <a href="https://www.instagram.com/ruang_postulat/">Ruang Postulat</a>',
        'o4.m': 'sejak 2024',
        'o4.d': 'Bersama teman-teman saya mendirikan klub fisika teoretis, dan saya yang membuat kontennya. Kontennya sudah ditonton lebih dari 23.000 kali.',
        'p.h': 'riset yang terbit',
        'p2.m': 'Muthmaina · proyek pribadi, pracetak',
        'q.h': 'kata mereka',
        'q1': '"Selama magang dan skripsi di bawah bimbingan saya, Jessica meneliti stabilitas posisi kuasar dengan deviasi standar Allan untuk pengamatan VLBI. Ia menunjukkan cara berpikir analitis yang kuat, cepat beradaptasi dengan metode baru, dan sangat mandiri."',
        'q1.c': 'pembimbing riset, BRIN (diterjemahkan)',
        'q2': '"Kemampuannya memecahkan masalah dan dedikasinya membantunya melewati tuntutan teknis dan organisasi yang rumit dalam proyek MinerbaOne untuk Kementerian Energi dan Sumber Daya Mineral."',
        'q2.c': 'CEO, Volantis Technology (diterjemahkan)',
        'q3': '"Selama bertahun-tahun saya melihatnya tumbuh semakin percaya diri, tangguh, dan bertanggung jawab. Ia sangat berkomitmen pada tujuannya, terbuka pada arahan, dan mau bekerja keras untuk mengejar mimpinya."',
        'q3.c': 'dosen dan mentor, Universitas Gadjah Mada (diterjemahkan)',


        'm.label': '02 · yang saya pegang',
        'm.s': 'sebagai ilmuwan',
        'm.p': 'sebagai manusia',
        'm1': 'Hasil yang tidak bisa diulang orang lain belum menjadi pengetahuan.',
        'm1.c': 'dari talk saya <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a>, diterjemahkan',
        'm2': 'Siapa yang menerbitkan karya, dialah yang wajib memeriksanya.',
        'm2.c': 'talk yang sama, DevFest Milano 2026',
        'm3': 'Tidak ada hasil tanpa perhitungan atau sumber, langkah demi langkah, dan saya ikut membacanya.',
        'm3.c': 'dari <a href="https://yourastrophysicist.substack.com/p/the-telescope-also-has-a-selection">The Telescope Also Has a Selection Function</a>, diterjemahkan',
        'm4': 'Kenali instrumennya, atau gambarnya akan membohongimu dengan sangat sopan. Teleskop punya fungsi seleksi yang sejak awal menentukan apa yang tidak akan pernah kamu lihat.',
        'm5': 'Turunkan ulang hal-hal yang dianggap semua orang sudah selesai. Di situlah retakan lama ditemukan.',
        'm6': 'Belajarnya tetap milik saya. Mesin boleh membantu, tapi sayalah yang memegang kendali.',
        'm.same': 'esai yang sama',
        'h1': 'Belajar alam semesta bukan lomba lari.',
        'h1.c': 'dari <a href="https://yourastrophysicist.substack.com/p/belajar-alam-semesta-bukan-lomba">Belajar Alam Semesta Bukan Lomba Lari</a>',
        'h2': 'Pengetahuan tentang semesta yang mahaluas ini tidak pernah dimaksudkan untuk membuat kita merasa lebih pintar atau lebih tinggi dari orang lain.',
        'h2.c': 'dari <a href="https://yourastrophysicist.substack.com/p/melepaskan-ribuan-catatan-ke-ruang">Melepaskan Ribuan Catatan ke Ruang Terbuka</a>',
        'h3': 'Yang saya pelajari di sini adalah utang yang saya bawa pulang, dan tidak ada orang di rumah yang menunggu sebuah angka.',
        'h3.c': 'dari <a href="https://yourastrophysicist.substack.com/p/why-am-i-even-learning-this">why am i even learning this?</a>, diterjemahkan',
        'h4': 'Logika saintifik bukan barang mewah.',
        'h4.c': 'dari <a href="https://yourastrophysicist.substack.com/p/logika-saintifik-bukan-barang-mewah">Logika Saintifik Bukan Barang Mewah</a>',
        'h5': 'Menyimpan pengetahuan ini sendirian di lemari arsip terasa seperti sebuah keangkuhan yang egois.',
        'h5.c': 'dari Melepaskan Ribuan Catatan ke Ruang Terbuka',
        'h6': 'Saya mencintai apa yang saya pelajari, dan saya mencintai rumah. Saya membawa keduanya.',
        'h6.c': 'dari why am i even learning this?, diterjemahkan',

        'v.label': '03 · lima kata yang terus saya pegang',
        'v.h': 'Nilai',
        'v1': 'Memeriksa',
        'v1.d': 'Saya lebih memilih menerbitkan sedikit tapi bisa menunjukkan bagaimana saya sampai ke sana.',
        'v2': 'Terbuka',
        'v2.d': 'Catatan, kode, dan slide saya buka kalau bisa, supaya orang lain bisa menemukan kesalahan saya.',
        'v3': 'Sabar',
        'v3.d': 'Cahaya bintang yang meredup sedikit saja bisa memberi tahu bahwa ada satu dunia di sana. Kamu baru melihatnya kalau mau menunggu.',
        'v4': 'Rumah',
        'v4.d': 'Saya juga menulis dalam bahasa Indonesia, supaya yang saya pelajari bisa pulang.',
        'v5': 'Setara',
        'v5.d': 'Saya mendirikan Sadar Setara untuk kesetaraan gender dan hak asasi manusia di Garut, dan saya masih memegangnya.',

        'nt.label': '04 · otak kedua saya, dalam sepuluh peta',
        'nt.h': 'Catatan',
        'nt.sub': 'Di tahun pertama di Padova saya mencatat semuanya, dan catatan itu tumbuh menjadi lebih dari 1.100 halaman yang saling terhubung. Setiap mata kuliah punya petanya sendiri, dan setiap penurunan rumus menyimpan semua langkahnya. Pilih satu mata kuliah.',
        'nt.b': 'buka Your AstroNotes',
        'nt.s1': 'semester 1',
        'nt.s2': 'semester 2',

        'tm.label': '05 · atau tanya terminalnya',
        'tm.b': 'layar penuh',
        'tm.sub': 'Sebelum halaman ini ada, situs saya adalah sebuah terminal. Terminalnya masih di sini, dalam bahasa Inggris. Klik di dalamnya dan ketik <code>home</code>, atau cukup klik perintahnya. <code>notes</code> membuka otak kedua saya setelah kuis astronomi kecil.',

        'fq.label': '06 · pertanyaan yang sering saya dapat',
        'fq.h': 'Tanya jawab',
        'fq1': 'Sebenarnya kamu mengerjakan apa?',
        'fq1.a': 'Astrofisika dan kosmologi observasional. Sekarang artinya transit eksoplanet, statistik Bayesian, dan retrieval atmosfer. Sebelumnya posisi kuasar yang diukur dengan VLBI.',
        'fq2': 'Apa itu Your AstroNotes?',
        'fq2.a': 'Otak kedua saya dari tahun pertama S2 di Padova. Isinya lebih dari 1.100 catatan yang saling terhubung, satu peta untuk setiap dari sepuluh mata kuliah, dan penurunan rumus kosmologi yang ditulis tanpa melompati satu langkah pun. Semuanya ada di <a href="/notes/">yourastro.space/notes</a>.',
        'fq3': 'Kenapa ada kuis sebelum masuk ke catatan?',
        'fq3.a': 'Kuisnya cuma permainan, bukan gembok. Kuis tersebut hanya ada di terminal. Catatannya terbuka untuk siapa saja di <a href="/notes/">/notes</a>.',
        'fq4': 'Boleh saya pakai catatanmu untuk belajar?',
        'fq4.a': 'Silakan, karena itulah catatannya dibuka. Kalau ingin memakainya di tempat lain, kabari saya dulu.',
        'fq5': 'Kamu pakai AI?',
        'fq5.a': 'Ya, setiap hari. Claude Code mengubah transkrip kuliah saya menjadi catatan dan mencocokkannya dengan slide. Aturannya ketat. Apa pun yang tidak dikatakan dosen diberi label sebagai tambahan, angka yang belum pasti ditandai untuk dicek, dan tidak ada hasil tanpa perhitungan atau sumber. Belajarnya tetap milik saya. Saya menulis tentang ini di <a href="https://yourastrophysicist.substack.com/p/the-telescope-also-has-a-selection">The Telescope Also Has a Selection Function</a>.',
        'fq6': 'Kenapa kamu menulis dalam bahasa Indonesia?',
        'fq6.a': 'Karena orang-orang di rumah juga berhak membaca astrofisika dalam bahasanya sendiri. Sebagian esai saya berbahasa Inggris, sebagian besar berbahasa Indonesia.',
        'fq7': 'BRAT di sini artinya apa?',
        'fq7.a': 'Berisik, penasaran, sedikit keras kepala, dan senang menanyakan hal yang tidak ditanyakan orang lain di ruangan.',

        'c.label': 'mau mengajak saya bicara, menulis, atau berkolaborasi?',
        'c.h': 'Sapa saya',
        'c.b': 'tulis ke saya',
        'c.l': 'atau temukan saya di sini',
        'c.notion': 'portofolio dan CV',
        'foot': 'Padova, Italia · 45,4° LU, 11,9° BT · <a href="https://github.com/yourastrophysicist/yourastrophysicist">kode sumber</a> · HTML, CSS polos, dan sedikit JS'
    };

    var IT = {
        'skip': 'Vai al contenuto',
        't1': 'NASA Space Apps Milano, 14 e 15 novembre',
        't2': 'i miei appunti sono aperti su /notes',
        't3': 'HIPPO-C è su GitHub',
        't4': 'nuovi saggi su Substack',
        'id.motto2': 'un risultato che nessuno può rifare non è ancora conoscenza',

        'n.about': 'chi sono',
        'n.work': 'lavoro',
        'n.notes': 'appunti',
        'n.faq': 'domande',

        'k.bar': 'vai a una sezione',
        'k.open': 'apri',
        'k.ph': 'Scrivi una sezione o un link',
        'k.values': 'valori',
        'k.contact': 'contatti',

        'h.eye': 'Laurea magistrale in astrofisica e cosmologia · Università di Padova',
        'h.lede': 'Sono cresciuta a Garut, una piccola città di Giava Occidentale, sognando di diventare astrofisica. Ora sono al secondo anno della magistrale in astrofisica e cosmologia a Padova. Scrivo saggi, faccio video e lascio i miei appunti dei corsi aperti a chiunque.',
        'h.c1': 'Ricerca VLBI pubblicata',
        'h.c2': 'Speaker, DevFest Milano 2026',
        'h.c3': 'Fondatrice di Sadar Setara',
        'h.c4': 'Vicepresidente, PPI Triveneto',
        'h.b1': 'guarda il mio lavoro',
        'h.b2': 'i miei appunti',
        'h.cap': 'giornate in osservatorio · foto mie',


        'a.label': '00 · chi sono',
        'a.h': 'Ciao, sono Jessica. Piacere!',
        'a.p1': 'A Padova passo la maggior parte del tempo non a guardare il cielo notturno da un telescopio romantico, ma alla scrivania, a lottare con le equazioni di campo di Einstein, a smontare integrali di trasporto radiativo e a mettere in ordine simboli di Christoffel sulla carta di brutta.',
        'a.p2': 'Prima di Padova ho studiato Fisica all’Universitas Gadjah Mada. La mia ricerca pubblicata segue 33 anni di osservazioni VLBI del quasar 4C31.61, per verificare quanto sia stabile come punto di riferimento del sistema celeste (<a href="https://arxiv.org/abs/2401.12325">arXiv:2401.12325</a>).',
        'a.p3': 'Il mio pianeta preferito è WASP-12b. Il suo anno dura circa un giorno, e la sua stella lo sta lentamente inghiottendo. Quest’anno lo guardo passare davanti a quella stella, in laboratorio e nel mio codice.',
        'a.p4': 'Fuori dal laboratorio scrivo saggi su <a href="https://yourastrophysicist.substack.com">Substack</a>, soprattutto in indonesiano, e faccio video come <a href="https://www.youtube.com/@obspeaking">Observationally Speaking</a>.',
        'a.car': 'una giornata in osservatorio',

        'id.name': 'Nome',
        'id.based': 'Vive in',
        'id.italy': 'Italia',
        'id.from': 'Viene da',
        'id.spec': 'Specialità',
        'id.astro': 'dati astro',
        'id.study': 'Studi',
        'id.motto': 'Motto · un risultato che nessuno può rifare non è ancora conoscenza',

        'now.1': '<strong>Corsi.</strong> Exoplanetary Astrophysics, Astro-Statistics and Cosmology, Astrophysics Laboratory 2, Computational Astrophysics.',
        'now.2': '<strong>Laboratorio.</strong> Fotometria dei transiti di WASP-12b con il telescopio Copernico da 1,82 m ad Asiago.',
        'now.3': '<strong>Codice.</strong> <a href="https://github.com/doddamre/HIPPO-C">HIPPO-C</a>, progetto di gruppo per Computational Astrophysics. Modelliamo il transito di HIP 67522 c e alleniamo un modello di machine learning a trovare transiti nei dati TESS.',
        'now.4': '<strong>Ultimo talk.</strong> <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a> alla DevFest Milano.',
        'now.5': '<strong>Questo fine settimana.</strong> NASA Space Apps Milano, 14 e 15 novembre.',

        'w.label': '01 · quello che ho fatto finora',
        'w.h': 'Lavoro',
        'w.sub': 'La strada verso Padova è passata per un giornale studentesco, un ente di ricerca, i dati sulla salute dei bambini e un movimento nella mia città. Da tutto questo ho imparato una cosa. Un’organizzazione buona è un’organizzazione a cui si può chiedere e su cui si può contare.',
        'r1.h': 'Tirocinio di ricerca e tesi triennale, <a href="https://www.brin.go.id/">BRIN</a>',
        'r1.m': 'Agenzia nazionale per la ricerca e l’innovazione, Indonesia',
        'r1.d': 'Per il tirocinio e la tesi triennale ho seguito un quasar, 4C31.61, attraverso 33 anni di osservazioni VLBI. Ho misurato quanto resta stabile la sua posizione con la deviazione standard di Allan, in una pipeline Python scritta da me. Il lavoro è stato pubblicato sul Journal of Physics Conference Series.',
        'r2.h': 'Data analyst, <a href="https://www.equityinitiative.org/">The Equity Initiative</a>',
        'r2.d': 'Prima dell’Italia ho lavorato come data analyst sui programmi contro lo stunting a Nusa Tenggara Orientale e a Giava Occidentale. Ogni dataset parla delle persone dietro i numeri, e qui quelle persone erano bambini.',
        'r3.h': 'Responsabile ricerca e sviluppo, <a href="https://balairungpress.com/">BPPM Balairung UGM</a>',
        'r3.d': 'Le mie prime lezioni con i dati sono arrivate alla stampa studentesca dell’UGM, fondata nel 1985. Guidavo la divisione ricerca, che curava sondaggi, indagini e analisi dei media per gli studenti. Ero anche reporter e redattrice per balairungpress.com e scrivevo per il Jurnal Balairung.',
        'r4.h': 'Speaker, <a href="https://2026.devfestmilano.it/it/speakers/jessica-syafaq-muthmaina/">Google DevFest Milano 2026</a>',
        'r4.d': 'A ottobre 2026 ho tenuto un lightning talk intitolato <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a>. La mia risposta sta in una riga. Chi pubblica il lavoro deve anche verificarlo.',
        'r5.h': 'Autrice',
        'r5.m': 'dal 2020',
        'r5.d': 'Ho cominciato a scrivere su <a href="https://syafaqmuth.medium.com/">Medium</a> nel 2020 e non ho mai smesso davvero. Oggi scrivo di astrofisica, dati e società su <a href="https://yourastrophysicist.substack.com/">Substack</a> e <a href="https://omong-omong.com/user/yourastrophysicist/">Omong-Omong</a>, soprattutto in indonesiano, così anche chi è a casa può leggermi.',
        'o1.h': 'Vicepresidente, PPI Triveneto',
        'o1.d': 'A Padova sono diventata vicepresidente di PPI Triveneto. La nostra visione era semplice, essere reattivi e concreti. La lezione più grande che ne ho tratto è che ciò che aiuta di più gli studenti non è un evento, ma la risposta giusta e precisa.',
        'o2.h': 'Referente per l’Italia, <a href="https://www.instagram.com/italiabergerak/">Italia Bergerak</a>',
        'o2.m': 'Italia · 2026',
        'o2.d': 'Come referente per l’Italia di Italia Bergerak, ho contribuito a portare il documentario <i>Pesta Babi</i> (Pig Feast) al Teatro Ruzante di Padova il 29 giugno 2026, con Monday Screen e Greenpeace Padova. Il film racconta la sottrazione di 2,5 milioni di ettari di terre consuetudinarie per progetti agroindustriali. Dopo la proiezione, il regista Cypri Dale ha parlato con il pubblico.',
        'o3.h': 'Fondatrice, <a href="https://www.instagram.com/sadarsetara/">Sadar Setara</a>',
        'o3.m': 'Garut · dal 2025',
        'o3.d': 'Garut è la mia città, e lì le questioni di genere avevano bisogno di un posto dove parlarne. Così ho fondato Sadar Setara, uno spazio per imparare e prendere la parola. Il suo manifesto ora esiste in indonesiano, inglese, italiano e francese. Il 27 marzo 2025 abbiamo organizzato la prima Aksi Kamisan a Garut, contro la riforma della legge sulle forze armate (UU TNI) e per la supremazia civile.',
        'o4.h': 'Cofondatrice, <a href="https://www.instagram.com/ruang_postulat/">Ruang Postulat</a>',
        'o4.m': 'dal 2024',
        'o4.d': 'Con alcuni amici ho fondato un club di fisica teorica, e curo io i post. Hanno superato le 23.000 visualizzazioni.',
        'p.h': 'ricerca pubblicata',
        'p2.m': 'Muthmaina · progetto personale, preprint',
        'q.h': 'dicono di me',
        'q1': '“Durante il tirocinio e la tesi triennale sotto la mia supervisione, Jessica ha studiato la stabilità della posizione dei quasar usando la deviazione standard di Allan per le osservazioni VLBI. Ha mostrato un forte pensiero analitico, la capacità di adattarsi in fretta a metodi nuovi e un alto grado di autonomia.”',
        'q1.c': 'supervisore di ricerca, BRIN (tradotto)',
        'q2': '“Le sue capacità di risolvere problemi e la sua dedizione l’hanno aiutata ad affrontare le complesse esigenze tecniche e organizzative del progetto MinerbaOne per il Ministero dell’Energia e delle Risorse Minerarie.”',
        'q2.c': 'CEO, Volantis Technology (tradotto)',
        'q3': '“Negli anni l’ho vista crescere in sicurezza, tenacia e responsabilità. È molto determinata nei suoi obiettivi, aperta ai consigli e disposta a lavorare sodo per inseguire i suoi sogni.”',
        'q3.c': 'docente e mentore, Universitas Gadjah Mada (tradotto)',


        'm.label': '02 · ciò a cui mi tengo',
        'm.s': 'come scienziata',
        'm.p': 'come persona',
        'm1': 'Un risultato che nessuno può rifare non è ancora conoscenza.',
        'm1.c': 'dal mio talk <a href="https://github.com/yourastrophysicist/gdg-devfest-milano-2026">AI Wrote It, You Pushed It, Who Checks It?</a>, tradotto',
        'm2': 'Chi pubblica il lavoro deve anche verificarlo.',
        'm2.c': 'stesso talk, DevFest Milano 2026',
        'm3': 'Nessun risultato senza un calcolo o una fonte, passo per passo, e io li leggo.',
        'm3.c': 'da <a href="https://yourastrophysicist.substack.com/p/the-telescope-also-has-a-selection">The Telescope Also Has a Selection Function</a>, tradotto',
        'm4': 'Conosci lo strumento. Un telescopio ha una funzione di selezione che decide in anticipo cosa non vedrai mai, altrimenti l’immagine ti mente con grande cortesia.',
        'm5': 'Ricava di nuovo le cose che tutti danno per finite. È lì che si trovano le vecchie crepe.',
        'm6': 'Lo studio resta mio. Una macchina può aiutare, ma a guidarla resto io.',
        'm.same': 'stesso saggio',
        'h1': 'Imparare l’universo non è una gara.',
        'h1.c': 'da <a lang="id" href="https://yourastrophysicist.substack.com/p/belajar-alam-semesta-bukan-lomba">Belajar Alam Semesta Bukan Lomba Lari</a>, tradotto',
        'h2': 'La conoscenza di questo universo immenso non è mai stata pensata per farci sentire più intelligenti o più in alto degli altri. Dovrebbe renderci più gentili gli uni con gli altri.',
        'h2.c': 'da <a lang="id" href="https://yourastrophysicist.substack.com/p/melepaskan-ribuan-catatan-ke-ruang">Melepaskan Ribuan Catatan ke Ruang Terbuka</a>, tradotto',
        'h3': 'Quello che imparo qui è un debito che porto a casa, e a casa nessuno aspetta un numero.',
        'h3.c': 'da <a href="https://yourastrophysicist.substack.com/p/why-am-i-even-learning-this">why am i even learning this?</a>, tradotto',
        'h4': 'La logica scientifica non è un bene di lusso. Appartiene a tutti.',
        'h4.c': 'da <a lang="id" href="https://yourastrophysicist.substack.com/p/logika-saintifik-bukan-barang-mewah">Logika Saintifik Bukan Barang Mewah</a>, tradotto',
        'h5': 'Tenere la conoscenza chiusa in un cassetto è un orgoglio egoista, quindi i miei appunti restano aperti.',
        'h5.c': 'da <span lang="id">Melepaskan Ribuan Catatan ke Ruang Terbuka</span>, tradotto',
        'h6': 'Amo ciò che studio, e amo casa mia. Porto con me entrambe le cose.',
        'h6.c': 'da why am i even learning this?, tradotto',

        'v.label': '03 · cinque parole a cui torno sempre',
        'v.h': 'Valori',
        'v1': 'Verifica',
        'v1.d': 'Preferisco pubblicare meno e poter mostrare come ci sono arrivata.',
        'v2': 'Apertura',
        'v2.d': 'Appunti, codice e slide diventano pubblici quando possono, così qualcun altro può trovare i miei errori.',
        'v3': 'Pazienza',
        'v3.d': 'Un piccolo calo nella luce di una stella può dirti che lì c’è un intero mondo. Lo vedi solo se aspetti.',
        'v4': 'Casa',
        'v4.d': 'Scrivo anche in indonesiano, così quello che imparo può tornare indietro.',
        'v5': 'Parità',
        'v5.d': 'Ho fondato Sadar Setara per la parità di genere e i diritti umani a Garut, e ci credo ancora.',

        'nt.label': '04 · il mio secondo cervello, in dieci mappe',
        'nt.h': 'Appunti',
        'nt.sub': 'Nel primo anno a Padova ho scritto tutto, e gli appunti sono diventati più di 1.100 pagine collegate. Ogni corso ha la sua mappa, e ogni derivazione conserva tutti i suoi passaggi. Scegli un corso.',
        'nt.b': 'apri Your AstroNotes',
        'nt.s1': 'primo semestre',
        'nt.s2': 'secondo semestre',

        'tm.label': '05 · oppure chiedi al terminale',
        'tm.b': 'schermo intero',
        'tm.sub': 'Prima che esistesse questa pagina, il mio sito era un terminale. È ancora qui, in inglese. Clicca dentro e scrivi <code>home</code>, oppure clicca sui comandi. <code>notes</code> apre il mio secondo cervello dopo un piccolo quiz di astronomia.',

        'fq.label': '06 · le domande che mi fanno',
        'fq.h': 'Domande',
        'fq1': 'Di cosa ti occupi, esattamente?',
        'fq1.a': 'Astrofisica e cosmologia osservativa. In questo momento vuol dire transiti di esopianeti, statistica bayesiana e retrieval atmosferici. Prima erano le posizioni dei quasar misurate con il VLBI.',
        'fq2': 'Cos’è Your AstroNotes?',
        'fq2.a': 'Il mio secondo cervello del primo anno di magistrale a Padova. Contiene più di 1.100 note collegate, una mappa per ciascuno dei dieci corsi e derivazioni di cosmologia scritte senza saltare nessun passaggio. Si trova su <a href="/notes/">yourastro.space/notes</a>.',
        'fq3': 'Perché c’è un quiz prima degli appunti?',
        'fq3.a': 'È un gioco, non un lucchetto. Il quiz esiste solo nel terminale. Gli appunti sono pubblici su <a href="/notes/">/notes</a> per chiunque.',
        'fq4': 'Posso usare i tuoi appunti per studiare?',
        'fq4.a': 'Certo, sono aperti proprio per questo. Se vuoi riusarli altrove, scrivimi prima.',
        'fq5': 'Usi l’IA?',
        'fq5.a': 'Sì, ogni giorno. Claude Code trasforma le trascrizioni delle lezioni in appunti e li confronta con le slide. Le regole sono rigide. Tutto ciò che il docente non ha detto è segnato come aggiunta, i numeri incerti sono segnati da verificare, e nessun risultato senza un calcolo o una fonte. Lo studio resta mio. Ne ho scritto in <a href="https://yourastrophysicist.substack.com/p/the-telescope-also-has-a-selection">The Telescope Also Has a Selection Function</a>.',
        'fq6': 'Perché scrivi in indonesiano?',
        'fq6.a': 'Perché anche le persone a casa meritano l’astrofisica nella loro lingua. Alcuni saggi sono in inglese, la maggior parte in indonesiano.',
        'fq7': 'Cosa vuol dire BRAT qui?',
        'fq7.a': 'Rumorosa, curiosa, un po’ testarda, e felice di fare la domanda che nessun altro nella stanza fa.',

        'c.label': 'vuoi che parli, scriva o collabori con te?',
        'c.h': 'Scrivimi',
        'c.b': 'mandami una mail',
        'c.l': 'oppure trovami qui',
        'c.notion': 'portfolio e CV',
        'foot': 'Padova, Italia · 45,4° N, 11,9° E · <a href="https://github.com/yourastrophysicist/yourastrophysicist">codice sorgente</a> · HTML, CSS semplici e qualche riga di JS'
    };

    var KEY = 'yas-lang';
    var root = document.documentElement;
    var nodes = document.querySelectorAll('[data-i18n]');
    var buttons = document.querySelectorAll('.lang button');
    var phs = document.querySelectorAll('[data-i18n-ph]');
    var EN = {};
    nodes.forEach(function (n) { if (!(n.dataset.i18n in EN)) EN[n.dataset.i18n] = n.innerHTML; });
    phs.forEach(function (n) { EN[n.dataset.i18nPh] = n.placeholder; });

    function apply(lang) {
        var dict = lang === 'id' ? ID : lang === 'it' ? IT : EN;
        nodes.forEach(function (n) {
            var v = dict[n.dataset.i18n];
            if (v != null) n.innerHTML = v;
        });
        phs.forEach(function (n) { var v = dict[n.dataset.i18nPh]; if (v != null) n.placeholder = v; });
        root.lang = lang;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var nav = (navigator.language || '').toLowerCase().slice(0, 2);
    var start = (saved === 'en' || saved === 'id' || saved === 'it') ? saved : (nav === 'id' || nav === 'it' ? nav : 'en');
    if (start !== 'en') apply(start);

    buttons.forEach(function (b) {
        b.addEventListener('click', function () {
            apply(b.dataset.lang);
            try { localStorage.setItem(KEY, b.dataset.lang); } catch (e) {}
        });
    });
})();
