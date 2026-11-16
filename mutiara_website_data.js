// =========================================================================
// DATA.JS - DATABASE AWAL TK MUTIARA HARAPAN (MUDAH DIUBAH / DI-BACKUP)
// =========================================================================

const INITIAL_STUDENTS = [
    { id: 1, name: "ABDUL KHOIRIE", gender: "L", nipd: "" },
    { id: 2, name: "ALFAEZA SALEH", gender: "L", nipd: "" },
    { id: 3, name: "ATHALLAH RAFIQ SYAHPUTRA", gender: "L", nipd: "" },
    { id: 4, name: "DAFFA AFFNAN FADLAN", gender: "L", nipd: "" },
    { id: 5, name: "DANIEL", gender: "L", nipd: "" },
    { id: 6, name: "DESVIA ADRIELLA TOBING", gender: "P", nipd: "" },
    { id: 7, name: "DOMINIK NAPATAR SIHOMBING", gender: "L", nipd: "" },
    { id: 8, name: "FELICYA BIRGITTA OCA", gender: "P", nipd: "" },
    { id: 9, name: "FEODORA TINDAON", gender: "P", nipd: "" },
    { id: 10, name: "FUTRI ENGJELIKA SILAEN", gender: "P", nipd: "" },
    { id: 11, name: "GERALDO SAMOSIR", gender: "L", nipd: "" },
    { id: 12, name: "JACELLYN FELECIA BORU NAINGGOLAN", gender: "P", nipd: "" },
    { id: 13, name: "MARTIN MIRACLE SITORUS", gender: "L", nipd: "" },
    { id: 14, name: "METHA MARIA HARIANJA", gender: "P", nipd: "" },
    { id: 15, name: "MUHAMMAD RAFFASYA NUGRAHA", gender: "L", nipd: "" },
    { id: 16, name: "ORLE SEPTIA BORU SINAGA", gender: "P", nipd: "" },
    { id: 17, name: "QIAN PUSPINATA", gender: "L", nipd: "26001" },
    { id: 18, name: "WIRA PRADANA", gender: "L", nipd: "" },
    { id: 19, name: "YULIANDA HUTAGALUNG", gender: "P", nipd: "" },
    { id: 20, name: "MUHAMMAD ADAM", gender: "L", nipd: "" },
    { id: 21, name: "DELIMA NABABAN", gender: "P", nipd: "" },
    { id: 22, name: "ALIANDO ALVARO KENZY", gender: "L", nipd: "" },
    { id: 23, name: "ANUGRAH SAPUTRA ZEGA", gender: "L", nipd: "" },
    { id: 24, name: "MUHAMMAD ALFAHRIANSYAH", gender: "L", nipd: "" },
    { id: 25, name: "FEODORA TINDAON", gender: "P", nipd: "" },
    { id: 26, name: "KRISTIAN", gender: "L", nipd: "" }
];

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "ANN-1",
        category: "PPDB",
        title: "Informasi Pendaftaran Murid Baru (PPDB) T.A. 2026/2027 ✨",
        date: "2026-06-01",
        content: "Penerimaan Peserta Didik Baru (PPDB) TK Mutiara Harapan telah dibuka di Kecamatan Tanjung Medan, Kabupaten Rokan Hilir, Riau."
    },
    {
        id: "ANN-2",
        category: "KEGIATAN",
        title: "Lomba Mewarnai & Cerdas Ceria Anak TK 🎨",
        date: "2026-11-20",
        content: "Ayo anak-anak hebat berlatih kuis bergambar dan games di portal sekolah untuk persiapan kegiatan ceria hari Jumat!"
    }
];

const DEFAULT_MATERIALS = [
    {
        id: "TK-01",
        mapel: "Mengenal Hewan & Alam",
        level: "EASY",
        title: "Sahabat Hewan di Sekitar Kita 🦁",
        desc: "Mengenal ciri-ciri, suara, dan makanan hewan lucu di sekitar kita.",
        storyText: "Di sebuah peternakan yang hijau, tinggal seekor sapi yang ramah, ayam yang rajin berkokok di pagi hari, dan kelinci putih yang suka melompat-lompat makan wortel.",
        imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80",
        questions: [
            {
                text: "Hewan mana yang telinganya panjang dan suka makan wortel?",
                imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
                options: ["🐰 Kelinci", "🐊 Buaya", "🐟 Ikan", "🐍 Ular"],
                answerIndex: 0
            },
            {
                text: "Hewan apa yang berkokok 'Kukuruyuk' setiap pagi hari?",
                imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80",
                options: ["🐱 Kucing", "🐓 Ayam Jantan", "🐶 Anjing", "🐸 Katak"],
                answerIndex: 1
            },
            {
                text: "Hewan besar yang memiliki belalai panjang adalah...",
                imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80",
                options: ["🦒 Jerapah", "🐘 Gajah", "🐒 Monyet", "🦆 Bebek"],
                answerIndex: 1
            }
        ]
    },
    {
        id: "TK-02",
        mapel: "Buah, Sayur & Warna",
        level: "EASY",
        title: "Buah Segar & Warna Pelangi 🍓",
        desc: "Belajar mengenal nama buah-buahan sehat beserta warnanya yang cerah.",
        storyText: "Ibu membeli keranjang berisi buah-buahan segar. Ada pisang berwarna kuning, apel berwarna merah manis, dan jeruk yang kaya vitamin.",
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
        questions: [
            {
                text: "Apa warna buah pisang yang sudah matang?",
                imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
                options: ["🟡 Kuning", "🔵 Biru", "⚫ Hitam", "🟣 Ungu"],
                answerIndex: 0
            },
            {
                text: "Buah manakah yang kulitnya berduri tajam tetapi rasanya manis?",
                imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80",
                options: ["🍎 Apel", "🍇 Anggur", "🍍 Nanas", "🍉 Semangka"],
                answerIndex: 2
            },
            {
                text: "Sayuran berwarna oranye yang bagus untuk kesehatan mata adalah...",
                imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
                options: ["🥦 Brokoli", "🥕 Wortel", "🍆 Terong", "🌽 Jagung"],
                answerIndex: 1
            }
        ]
    },
    {
        id: "TK-03",
        mapel: "Berhitung & Angka Ceria",
        level: "EASY",
        title: "Petualangan Berhitung 1 sampai 10 🔢",
        desc: "Melatih kemampuan membilang benda dan penjumlahan sederhana anak TK.",
        storyText: "Di taman bermain, Rara melihat 2 kupu-kupu biru terbang di atas bunga. Tak lama kemudian datang lagi 2 kupu-kupu kuning bergabung bersama mereka.",
        imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80",
        questions: [
            {
                text: "Hitung ada berapa bola di gambar ini: ⚽ ⚽ ⚽ ⚽ ⚽",
                imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80",
                options: ["3 Bola", "5 Bola", "7 Bola", "2 Bola"],
                answerIndex: 1
            },
            {
                text: "2 kupu-kupu ditambah 2 kupu-kupu sama dengan...",
                imageUrl: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=80",
                options: ["3 Kupu-kupu", "4 Kupu-kupu", "6 Kupu-kupu", "1 Kupu-kupu"],
                answerIndex: 1
            },
            {
                text: "Angka berapakah yang muncul tepat setelah angka 7?",
                imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
                options: ["6", "8", "9", "5"],
                answerIndex: 1
            }
        ]
    },
    {
        id: "TK-04",
        mapel: "Huruf, Kata & Bahasa Inggris",
        level: "MEDIUM",
        title: "Serunya Belajar Bahasa Inggris Dasar 🇬🇧",
        desc: "Mengenal kosakata benda, hewan, dan sapaan bahasa Inggris untuk anak TK.",
        storyText: "Every morning at TK Mutiara Harapan, teacher says 'Good Morning!'. Look at the sky, the sun is shining bright and a cute cat is playing in the yard.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
        questions: [
            {
                text: "Apa bahasa Inggris dari hewan Kucing? 🐱",
                imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
                options: ["Dog", "Cat", "Bird", "Fish"],
                answerIndex: 1
            },
            {
                text: "Apa bahasa Inggris dari buah Apel? 🍎",
                imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
                options: ["Banana", "Orange", "Apple", "Grape"],
                answerIndex: 2
            },
            {
                text: "Jika kita bertemu guru di pagi hari, kita mengucapkan...",
                imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                options: ["Good Night", "Good Morning", "Goodbye", "Thank You"],
                answerIndex: 1
            }
        ]
    },
    {
        id: "TK-05",
        mapel: "Bentuk, Transportasi & Profesi",
        level: "MEDIUM",
        title: "Kendaraan & Cita-Cita Hebatku 🚀",
        desc: "Mengenal berbagai alat transportasi darat, laut, udara serta profesi.",
        storyText: "Budi ingin menjadi pilot agar bisa menerbangkan pesawat tinggi di awan. Sedangkan Siti ingin menjadi dokter untuk membantu orang yang sakit agar cepat sembuh.",
        imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80",
        questions: [
            {
                text: "Kendaraan mana yang terbang tinggi di udara? ✈️",
                imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
                options: ["🚢 Kapal Laut", "✈️ Pesawat Terbang", "🚂 Kereta Api", "🚲 Sepeda"],
                answerIndex: 1
            },
            {
                text: "Siapakah yang bertugas memeriksa dan mengobati pasien di rumah sakit?",
                imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80",
                options: ["👨‍⚕️ Dokter", "👨‍🍳 Koki", "👨‍🚒 Pemadam Kebakaran", "👮 Polisi"],
                answerIndex: 0
            },
            {
                text: "Bentuk geometri dari roda mobil dan jam dinding adalah...",
                imageUrl: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=80",
                options: ["🔺 Segitiga", "⭕ Lingkaran", "🟥 Persegi", "⭐ Bintang"],
                answerIndex: 1
            }
        ]
    }
];

const DEFAULT_READING = [
    { id: "R-1", title: "1. Belajar Membaca Suku Kata (ID)", lang: "id-ID", words: ["MAMA", "PAPA", "BUKU", "BOLA", "SAYA", "GURU", "ROTI", "SUSU"] },
    { id: "R-2", title: "2. Nama Hewan Lucu (ID)", lang: "id-ID", words: ["KUCING", "KELINCI", "GAJAH", "JERAPAH", "BEBEK", "AYAM", "IKAN"] },
    { id: "R-3", title: "3. English Animals Phonics (EN)", lang: "en-US", words: ["CAT", "DOG", "DUCK", "FISH", "BIRD", "LION", "TIGER"] },
    { id: "R-4", title: "4. English Colors & Fruits (EN)", lang: "en-US", words: ["RED", "BLUE", "YELLOW", "GREEN", "APPLE", "BANANA", "ORANGE"] }
];
