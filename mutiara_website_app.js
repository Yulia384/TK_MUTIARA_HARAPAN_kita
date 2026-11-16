// =========================================================================
// APP.JS - LOGIKA INTERAKTIF, SUARA, GAMES, & CRUD (TAMBAH/UBAH/HAPUS)
// =========================================================================

let studentsData = JSON.parse(localStorage.getItem('mutiara_students_v2')) || INITIAL_STUDENTS;
let materialsData = JSON.parse(localStorage.getItem('mutiara_materials_v2')) || DEFAULT_MATERIALS;
let readingData = JSON.parse(localStorage.getItem('mutiara_reading_v2')) || DEFAULT_READING;
let submissionsData = JSON.parse(localStorage.getItem('mutiara_submissions_v2')) || [];
let announcementsData = JSON.parse(localStorage.getItem('mutiara_announcements_v2')) || DEFAULT_ANNOUNCEMENTS;

function showSyncToast(msg) {
    const toast = document.getElementById('syncToast');
    document.getElementById('syncToastText').textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function saveData(customMessage = "Perubahan berhasil disimpan!") {
    try {
        localStorage.setItem('mutiara_students_v2', JSON.stringify(studentsData));
        localStorage.setItem('mutiara_materials_v2', JSON.stringify(materialsData));
        localStorage.setItem('mutiara_reading_v2', JSON.stringify(readingData));
        localStorage.setItem('mutiara_submissions_v2', JSON.stringify(submissionsData));
        localStorage.setItem('mutiara_announcements_v2', JSON.stringify(announcementsData));
    } catch (err) {
        console.warn("Storage penuh (mungkin gambar terlalu besar), gunakan URL gambar.", err);
        alert("Penyimpanan browser penuh. Gunakan tautan/URL gambar daripada mengunggah foto berukuran besar.");
    }
    updateUI();
    showSyncToast(customMessage);
}

// =========================================================================
// BACKUP & RESTORE JSON (AGAR MUDAH DIPINDAHKAN / DIGANTI)
// =========================================================================
function exportBackupJSON() {
    const backup = {
        studentsData,
        materialsData,
        readingData,
        announcementsData,
        submissionsData
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Backup_TK_Mutiara_Harapan_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showSyncToast("File Backup JSON berhasil diunduh!");
}

function importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed.studentsData) studentsData = parsed.studentsData;
            if (parsed.materialsData) materialsData = parsed.materialsData;
            if (parsed.readingData) readingData = parsed.readingData;
            if (parsed.announcementsData) announcementsData = parsed.announcementsData;
            if (parsed.submissionsData) submissionsData = parsed.submissionsData;
            saveData("Data Backup berhasil dipulihkan!");
        } catch (err) {
            alert("Format file JSON tidak valid!");
        }
    };
    reader.readAsText(file);
}

// =========================================================================
// TEXT-TO-SPEECH (SUARA PELAFALAN ANAK)
// =========================================================================
function speakText(text, lang = 'id-ID') {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang;
        utterance.rate = 0.88;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }
}

function speakActiveQuestion() {
    const qText = document.getElementById('activeQuestionText').textContent;
    speakText(qText, 'id-ID');
}

function speakStoryText() {
    const sText = document.getElementById('activeStoryText').textContent;
    speakText(sText, 'id-ID');
}

function playPopSound() {
    const pop = document.getElementById('popAudio');
    if (pop) {
        pop.currentTime = 0;
        pop.play().catch(() => {});
    }
}

// =========================================================================
// NAVIGASI & MODAL HELPER
// =========================================================================
function sharePortalLink() {
    const currentUrl = window.location.href;
    const shareText = `Halo Ayah/Bunda & Anak-anak Hebat! Mari belajar & bermain kuis bergambar di Portal TK Mutiara Harapan:\n${currentUrl}`;
    if (navigator.share) {
        navigator.share({ title: "Mutiara Smart School", text: shareText, url: currentUrl }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert("Link website berhasil disalin! Silakan tempel di grup WhatsApp.");
        }).catch(() => {
            prompt("Salin link berikut:", currentUrl);
        });
    }
}

function switchTab(tabId) {
    const tabs = ['dashboard', 'leaderboard', 'info', 'materials', 'reading', 'games', 'students', 'excel'];
    tabs.forEach(t => {
        const section = document.getElementById(`tab-${t}`);
        if (section) {
            if (t === tabId) section.classList.remove('hidden');
            else section.classList.add('hidden');
        }
        const navBtn = document.getElementById(`nav-${t}`);
        if (navBtn) {
            if (t === tabId) navBtn.classList.add('bg-teal-50', 'text-teal-700', 'font-bold');
            else navBtn.classList.remove('bg-teal-50', 'text-teal-700', 'font-bold');
        }
    });

    if (tabId === 'games') {
        initAllGames();
    } else if (tabId === 'leaderboard') {
        renderLeaderboard();
    }
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function previewImageInput(inputId, imgId) {
    const url = document.getElementById(inputId).value;
    document.getElementById(imgId).src = url || 'https://via.placeholder.com/400x200?text=Preview+Gambar';
}

function handleLocalImageUpload(event, targetInputId, previewImgId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxW = 500;
            const scale = maxW / img.width;
            canvas.width = maxW;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById(targetInputId).value = compressedDataUrl;
            if (previewImgId) document.getElementById(previewImgId).src = compressedDataUrl;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateUI() {
    document.getElementById('headerStudentCount').textContent = studentsData.length;
    document.getElementById('stat-total-students').textContent = studentsData.length;
    document.getElementById('stat-total-materials').textContent = materialsData.length;
    document.getElementById('stat-total-submissions').textContent = submissionsData.length;

    renderStudentsTable(studentsData);
    renderMaterialsGrid();
    renderReadingCards();
    renderExcelTable();
    renderAnnouncements();
    renderLeaderboard();
}

// =========================================================================
// 1. CRUD PENGUMUMAN (TAMBAH, UBAH, HAPUS)
// =========================================================================
function renderAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    const dashBox = document.getElementById('dashboardAnnouncementBox');
    if (container) container.innerHTML = '';
    if (dashBox) dashBox.innerHTML = '';

    announcementsData.forEach(ann => {
        if (container) {
            container.innerHTML += `
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">${ann.category}</span>
                            <div class="space-x-2">
                                <button onclick="openAnnouncementModal('${ann.id}')" class="text-amber-600 hover:text-amber-800 text-xs font-bold" title="Ubah"><i class="fa-solid fa-pen-to-square"></i> Ubah</button>
                                <button onclick="deleteAnnouncement('${ann.id}')" class="text-red-500 hover:text-red-700 text-xs font-bold" title="Hapus"><i class="fa-solid fa-trash"></i> Hapus</button>
                            </div>
                        </div>
                        <h3 class="kids-title text-lg font-bold text-slate-800 mt-2">${ann.title}</h3>
                        <p class="text-[11px] text-slate-400 mt-0.5">${ann.date || ''}</p>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed">${ann.content}</p>
                    </div>
                </div>
            `;
        }
        if (dashBox) {
            dashBox.innerHTML += `
                <div class="bg-red-50 p-3.5 rounded-2xl border border-red-200">
                    <h4 class="font-bold text-xs text-red-900">${ann.title}</h4>
                    <p class="text-xs text-slate-600 mt-1">${ann.content}</p>
                </div>
            `;
        }
    });
}

function openAnnouncementModal(editId = null) {
    document.getElementById('addAnnouncementForm').reset();
    document.getElementById('annEditId').value = "";
    document.getElementById('announcementModalTitle').textContent = "Tambah Pengumuman Baru";

    if (editId) {
        const ann = announcementsData.find(a => a.id === editId);
        if (ann) {
            document.getElementById('announcementModalTitle').textContent = "Ubah Pengumuman";
            document.getElementById('annEditId').value = ann.id;
            document.getElementById('annCategory').value = ann.category;
            document.getElementById('annTitle').value = ann.title;
            document.getElementById('annDate').value = ann.date;
            document.getElementById('annContent').value = ann.content;
        }
    }
    openModal('addAnnouncementModal');
}

function handleSaveAnnouncement(e) {
    e.preventDefault();
    const editId = document.getElementById('annEditId').value;
    const payload = {
        id: editId || `ANN-${Date.now()}`,
        category: document.getElementById('annCategory').value,
        title: document.getElementById('annTitle').value,
        date: document.getElementById('annDate').value,
        content: document.getElementById('annContent').value
    };

    if (editId) {
        const idx = announcementsData.findIndex(a => a.id === editId);
        if (idx !== -1) announcementsData[idx] = payload;
        saveData("Pengumuman berhasil diubah!");
    } else {
        announcementsData.unshift(payload);
        saveData("Pengumuman baru diterbitkan!");
    }
    closeModal('addAnnouncementModal');
}

function deleteAnnouncement(id) {
    if (confirm("Hapus pengumuman ini?")) {
        announcementsData = announcementsData.filter(a => a.id !== id);
        saveData("Pengumuman dihapus!");
    }
}

// =========================================================================
// 2. CRUD KUIS BERGAMBAR (TAMBAH, UBAH, HAPUS SOAL & GAMBAR)
// =========================================================================
function openMaterialModal(editId = null) {
    document.getElementById('addMaterialForm').reset();
    document.getElementById('matEditId').value = "";
    document.getElementById('questionsContainer').innerHTML = "";
    document.getElementById('matImgPreview').src = "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=500&q=80";
    document.getElementById('materialModalTitle').textContent = "Buat Kuis Bergambar Baru";

    if (editId) {
        const mat = materialsData.find(m => m.id === editId);
        if (mat) {
            document.getElementById('materialModalTitle').textContent = "Ubah Kuis & Soal Bergambar";
            document.getElementById('matEditId').value = mat.id;
            document.getElementById('matMapel').value = mat.mapel;
            document.getElementById('matLevel').value = mat.level;
            document.getElementById('matTitle').value = mat.title;
            document.getElementById('matStoryText').value = mat.storyText || "";
            document.getElementById('matImageUrl').value = mat.imageUrl || "";
            document.getElementById('matImgPreview').src = mat.imageUrl || "";

            (mat.questions || []).forEach(q => addQuestionField(q));
        }
    } else {
        addQuestionField();
    }
    openModal('addMaterialModal');
}

function addQuestionField(qData = null) {
    const container = document.getElementById('questionsContainer');
    const qIdx = container.children.length;

    const div = document.createElement('div');
    div.className = "bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl space-y-3 text-xs relative";
    div.innerHTML = `
        <div class="flex justify-between items-center border-b border-slate-200 pb-2">
            <span class="font-bold text-purple-700 text-sm">Pertanyaan Soal #${qIdx + 1}</span>
            <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-red-500 hover:text-red-700 font-bold"><i class="fa-solid fa-trash"></i> Hapus Soal</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="block font-semibold text-slate-600 mb-1">Teks Pertanyaan (Akan Dibacakan Suara) *</label>
                <input type="text" class="q-text w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Contoh: Hewan apa yang berkokok pagi hari?" value="${qData ? qData.text : ''}" required>
            </div>
            <div>
                <label class="block font-semibold text-slate-600 mb-1">Gambar Soal (Link URL Gambar)</label>
                <input type="text" class="q-img w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://... (Opsional)" value="${qData && qData.imageUrl ? qData.imageUrl : ''}">
            </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input type="text" class="q-opt-0 w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Pilihan A (Bisa pakai Emoji)" value="${qData && qData.options[0] ? qData.options[0] : ''}" required>
            <input type="text" class="q-opt-1 w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Pilihan B" value="${qData && qData.options[1] ? qData.options[1] : ''}" required>
            <input type="text" class="q-opt-2 w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Pilihan C (Opsional)" value="${qData && qData.options[2] ? qData.options[2] : ''}">
            <input type="text" class="q-opt-3 w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Pilihan D (Opsional)" value="${qData && qData.options[3] ? qData.options[3] : ''}">
        </div>
        <div>
            <label class="block font-semibold text-slate-600 mb-1">Kunci Jawaban Benar:</label>
            <select class="q-ans w-full sm:w-64 px-3 py-2 border border-green-300 rounded-xl bg-green-50 font-bold text-green-900">
                <option value="0" ${qData && qData.answerIndex === 0 ? 'selected' : ''}>Pilihan A</option>
                <option value="1" ${qData && qData.answerIndex === 1 ? 'selected' : ''}>Pilihan B</option>
                <option value="2" ${qData && qData.answerIndex === 2 ? 'selected' : ''}>Pilihan C</option>
                <option value="3" ${qData && qData.answerIndex === 3 ? 'selected' : ''}>Pilihan D</option>
            </select>
        </div>
    `;
    container.appendChild(div);
}

function handleSaveMaterial(e) {
    e.preventDefault();
    const editId = document.getElementById('matEditId').value;
    const blocks = document.querySelectorAll('#questionsContainer > div');
    if (blocks.length === 0) {
        alert("Minimal harus ada 1 pertanyaan soal!");
        return;
    }

    const questions = [];
    blocks.forEach(b => {
        const opts = [
            b.querySelector('.q-opt-0').value.trim(),
            b.querySelector('.q-opt-1').value.trim(),
            b.querySelector('.q-opt-2').value.trim(),
            b.querySelector('.q-opt-3').value.trim()
        ].filter(Boolean);

        let ansIdx = parseInt(b.querySelector('.q-ans').value);
        if (ansIdx >= opts.length) ansIdx = 0;

        questions.push({
            text: b.querySelector('.q-text').value,
            imageUrl: b.querySelector('.q-img').value.trim(),
            options: opts,
            answerIndex: ansIdx
        });
    });

    const payload = {
        id: editId || `TK-${Date.now()}`,
        mapel: document.getElementById('matMapel').value,
        level: document.getElementById('matLevel').value,
        title: document.getElementById('matTitle').value,
        desc: `Kuis Interaktif ${document.getElementById('matMapel').value} (${questions.length} Soal)`,
        storyText: document.getElementById('matStoryText').value,
        imageUrl: document.getElementById('matImageUrl').value || 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80',
        questions
    };

    if (editId) {
        const idx = materialsData.findIndex(m => m.id === editId);
        if (idx !== -1) materialsData[idx] = payload;
        saveData("Modul kuis berhasil diperbarui!");
    } else {
        materialsData.unshift(payload);
        saveData("Modul kuis baru berhasil ditambahkan!");
    }
    closeModal('addMaterialModal');
}

function deleteMaterial(id) {
    if (confirm("Yakin ingin menghapus modul kuis ini?")) {
        materialsData = materialsData.filter(m => m.id !== id);
        saveData("Modul kuis berhasil dihapus!");
    }
}

function renderMaterialsGrid() {
    const grid = document.getElementById('materialsGrid');
    const mapelFilter = document.getElementById('mapelFilter').value;
    grid.innerHTML = '';

    const items = mapelFilter === 'ALL' ? materialsData : materialsData.filter(m => m.mapel === mapelFilter);

    items.forEach(mat => {
        const subCount = submissionsData.filter(s => s.materialId === mat.id).length;
        grid.innerHTML += `
            <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                    <div class="h-44 bg-slate-100 relative">
                        <img src="${mat.imageUrl}" class="w-full h-full object-cover" alt="Banner Kuis">
                        <span class="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full bg-white/95 text-purple-800 uppercase shadow">${mat.mapel}</span>
                        <span class="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/75 text-white">${mat.questions.length} Soal</span>
                    </div>
                    <div class="p-5 space-y-1.5">
                        <h3 class="kids-title text-lg font-bold text-slate-800">${mat.title}</h3>
                        <p class="text-xs text-slate-500 line-clamp-2">${mat.desc}</p>
                    </div>
                </div>
                <div class="p-5 pt-0 space-y-2.5">
                    <button onclick="openQuizModal('${mat.id}')" class="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl shadow flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-play"></i>
                        <span>Mulai Kuis (${subCount} Selesai)</span>
                    </button>
                    <div class="flex justify-between items-center border-t border-slate-100 pt-2 text-xs">
                        <button onclick="openMaterialModal('${mat.id}')" class="text-amber-600 font-bold hover:underline flex items-center space-x-1">
                            <i class="fa-solid fa-pen-to-square"></i><span>Ubah Soal</span>
                        </button>
                        <button onclick="deleteMaterial('${mat.id}')" class="text-red-500 font-bold hover:underline flex items-center space-x-1">
                            <i class="fa-solid fa-trash"></i><span>Hapus</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterMaterialsGrid() { renderMaterialsGrid(); }

// =========================================================================
// 3. RUNTIME KUIS BERGAMBAR & BERSUARA
// =========================================================================
let currentQuizMat = null;
let currentStudent = null;
let currentQIndex = 0;
let userAnswers = [];

function openQuizModal(id) {
    currentQuizMat = materialsData.find(m => m.id === id);
    const select = document.getElementById('quizStudentSelect');
    select.innerHTML = '';
    studentsData.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name} (${s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'})</option>`;
    });

    document.getElementById('quizModalMaterialTitle').textContent = currentQuizMat.title;
    document.getElementById('quizStepSelectStudent').classList.remove('hidden');
    document.getElementById('quizStepQuestions').classList.add('hidden');
    document.getElementById('quizStepResult').classList.add('hidden');

    openModal('quizModal');
}

function startQuizQuestions() {
    const sId = parseInt(document.getElementById('quizStudentSelect').value);
    currentStudent = studentsData.find(s => s.id === sId) || { name: "Murid Tamu" };
    currentQIndex = 0;
    userAnswers = [];

    document.getElementById('quizStepSelectStudent').classList.add('hidden');
    document.getElementById('quizStepQuestions').classList.remove('hidden');
    document.getElementById('activeQuizStudentName').textContent = `Murid: ${currentStudent.name}`;

    const storyBox = document.getElementById('activeStoryContainer');
    if (currentQuizMat.storyText) {
        document.getElementById('activeStoryText').textContent = currentQuizMat.storyText;
        storyBox.classList.remove('hidden');
    } else {
        storyBox.classList.add('hidden');
    }

    renderActiveQuestion();
}

function renderActiveQuestion() {
    const q = currentQuizMat.questions[currentQIndex];
    document.getElementById('activeQuizProgress').textContent = `Soal ${currentQIndex + 1} / ${currentQuizMat.questions.length}`;
    document.getElementById('activeQuestionText').textContent = q.text;

    const imgContainer = document.getElementById('activeSingleQImageContainer');
    const imgEl = document.getElementById('activeSingleQImage');
    if (q.imageUrl) {
        imgEl.src = q.imageUrl;
        imgContainer.classList.remove('hidden');
    } else {
        imgContainer.classList.add('hidden');
    }

    const grid = document.getElementById('activeQuestionOptionsGrid');
    grid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        grid.innerHTML += `
            <div class="option-card bg-amber-50 hover:bg-amber-100 rounded-2xl border-2 border-amber-200 flex items-center justify-between overflow-hidden">
                <button onclick="submitAnswer(${idx})" class="flex-grow p-4 text-left font-bold text-sm sm:text-base text-slate-800 flex items-center space-x-3">
                    <span class="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs flex-shrink-0">${letters[idx]}</span>
                    <span>${opt}</span>
                </button>
                <button onclick="speakText('${opt.replace(/'/g, "\\'")}', 'id-ID')" class="p-4 text-amber-700 hover:text-amber-950 border-l border-amber-200" title="Dengarkan Pilihan">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        `;
    });

    speakActiveQuestion();
}

function submitAnswer(idx) {
    playPopSound();
    userAnswers.push(idx);
    if (currentQIndex + 1 < currentQuizMat.questions.length) {
        currentQIndex++;
        renderActiveQuestion();
    } else {
        calculateResult();
    }
}

function calculateResult() {
    let correct = 0;
    currentQuizMat.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.answerIndex) correct++;
    });

    const score = Math.round((correct / currentQuizMat.questions.length) * 100);
    const statusText = score >= 80 ? 'Sangat Baik 🌟' : score >= 60 ? 'Baik 👍' : 'Semangat Belajar 💪';

    submissionsData.unshift({
        id: Date.now(),
        materialId: currentQuizMat.id,
        studentName: currentStudent.name,
        materialTitle: currentQuizMat.title,
        level: currentQuizMat.level,
        score: score,
        status: statusText,
        timestamp: new Date().toLocaleString('id-ID')
    });

    saveData(`Nilai ${currentStudent.name} (${score}) tersimpan!`);

    document.getElementById('quizStepQuestions').classList.add('hidden');
    document.getElementById('quizStepResult').classList.remove('hidden');
    document.getElementById('resultStudentNameDisplay').textContent = currentStudent.name;
    document.getElementById('resultScoreValue').textContent = score;
    document.getElementById('resultStatusBadge').textContent = statusText;

    const reviewContainer = document.getElementById('pdfReviewQuestions');
    reviewContainer.innerHTML = '';
    currentQuizMat.questions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.answerIndex;
        reviewContainer.innerHTML += `
            <div class="p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                <p class="font-bold text-slate-800">${i + 1}. ${q.text}</p>
                <p class="mt-1">Jawaban: <span class="font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}">${q.options[userAnswers[i]]} ${isCorrect ? '✔' : '✖'}</span></p>
                ${!isCorrect ? `<p class="text-slate-600">Jawaban Benar: <span class="font-bold text-green-700">${q.options[q.answerIndex]}</span></p>` : ''}
            </div>
        `;
    });

    document.getElementById('victoryAudio').play().catch(() => {});
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    speakText(`Hebat ${currentStudent.name}! Kamu mendapatkan nilai ${score}!`, 'id-ID');
}

function downloadAsPDF() {
    html2pdf().set({
        margin: 0.5,
        filename: `Hasil_Kuis_${currentStudent.name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(document.getElementById('printableArea')).save();
}

function closeQuizModal() { closeModal('quizModal'); }

// =========================================================================
// 4. 5 MINI GAMES EDUKASI TK INTERAKTIF BERSUARA
// =========================================================================
function initAllGames() {
    initMemoryGame();
    initCountingGame();
    initColorGame();
    initShapeGame();
    initLetterGame();
}

// GAME 1: MEMORY CARD HEWAN
let flippedCards = [];
let matchedCount = 0;

function initMemoryGame() {
    const items = [
        { icon: '🐶', name: 'Anjing' },
        { icon: '🐱', name: 'Kucing' },
        { icon: '🐰', name: 'Kelinci' },
        { icon: '🦁', name: 'Singa' }
    ];
    const deck = [...items, ...items].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedCount = 0;

    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    deck.forEach((item) => {
        const card = document.createElement('div');
        card.className = "memory-card bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl text-white font-bold cursor-pointer shadow";
        card.dataset.icon = item.icon;
        card.dataset.name = item.name;
        card.textContent = "?";
        card.onclick = function() {
            if (card.classList.contains('matched') || flippedCards.includes(card) || flippedCards.length === 2) return;
            card.textContent = item.icon;
            card.classList.remove('bg-indigo-500');
            card.classList.add('bg-indigo-100', 'border-2', 'border-indigo-400');
            speakText(item.name, 'id-ID');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                const [c1, c2] = flippedCards;
                if (c1.dataset.icon === c2.dataset.icon) {
                    c1.classList.add('matched', 'bg-emerald-200', 'border-emerald-500');
                    c2.classList.add('matched', 'bg-emerald-200', 'border-emerald-500');
                    flippedCards = [];
                    matchedCount += 2;
                    if (matchedCount === deck.length) {
                        confetti({ particleCount: 80, spread: 60 });
                        speakText("Hore! Semua hewan berhasil dicocokkan!", 'id-ID');
                    }
                } else {
                    setTimeout(() => {
                        c1.textContent = "?";
                        c2.textContent = "?";
                        c1.className = "memory-card bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl text-white font-bold cursor-pointer shadow";
                        c2.className = "memory-card bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl text-white font-bold cursor-pointer shadow";
                        flippedCards = [];
                    }, 800);
                }
            }
        };
        board.appendChild(card);
    });
}

// GAME 2: HITUNG JUMLAH BENDA
let currentCountAnswer = 0;
function initCountingGame() {
    const emojis = ['🍎', '⭐', '🍓', '🚗', '🎈', '🐟', '🍩'];
    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    currentCountAnswer = Math.floor(Math.random() * 8) + 1;

    const area = document.getElementById('starCountingArea');
    area.innerHTML = '';
    for (let i = 0; i < currentCountAnswer; i++) {
        area.innerHTML += `<span class="animate-bounce">${chosenEmoji}</span>`;
    }

    const opts = new Set([currentCountAnswer]);
    while (opts.size < 3) {
        opts.add(Math.floor(Math.random() * 9) + 1);
    }
    const shuffledOpts = Array.from(opts).sort(() => Math.random() - 0.5);

    const optionsGrid = document.getElementById('countingOptions');
    optionsGrid.innerHTML = '';
    shuffledOpts.forEach(num => {
        optionsGrid.innerHTML += `
            <button onclick="checkCountingAnswer(${num})" class="bg-amber-100 hover:bg-amber-300 border-2 border-amber-400 font-black p-3 rounded-xl text-lg text-amber-950 shadow active:scale-95 transition">
                ${num}
            </button>
        `;
    });
}

function checkCountingAnswer(num) {
    if (num === currentCountAnswer) {
        confetti({ particleCount: 60, spread: 50 });
        speakText(`Benar! Jumlahnya ada ${num}!`, 'id-ID');
        initCountingGame();
    } else {
        speakText(`Belum tepat, ayo hitung lagi!`, 'id-ID');
    }
}

// GAME 3: TEBAK WARNA PELANGI
const COLORS_DATA = [
    { name: 'MERAH', hex: 'bg-red-500' },
    { name: 'BIRU', hex: 'bg-blue-500' },
    { name: 'KUNING', hex: 'bg-yellow-400' },
    { name: 'HIJAU', hex: 'bg-emerald-500' },
    { name: 'UNGU', hex: 'bg-purple-500' },
    { name: 'ORANYE', hex: 'bg-orange-500' }
];
let currentTargetColor = null;

function initColorGame() {
    const shuffled = [...COLORS_DATA].sort(() => Math.random() - 0.5).slice(0, 4);
    currentTargetColor = shuffled[Math.floor(Math.random() * shuffled.length)];
    document.getElementById('targetColorName').textContent = currentTargetColor.name;

    const grid = document.getElementById('colorGameOptions');
    grid.innerHTML = '';
    shuffled.forEach(c => {
        grid.innerHTML += `
            <button onclick="checkColorAnswer('${c.name}')" class="${c.hex} h-14 rounded-2xl shadow-md border-2 border-white hover:scale-105 active:scale-95 transition"></button>
        `;
    });
}

function speakTargetColor() {
    if (currentTargetColor) speakText(`Klik warna ${currentTargetColor.name}`, 'id-ID');
}

function checkColorAnswer(selectedName) {
    if (selectedName === currentTargetColor.name) {
        confetti({ particleCount: 60, spread: 50 });
        speakText(`Hebat! Itu warna ${selectedName}!`, 'id-ID');
        initColorGame();
    } else {
        speakText(`Itu warna ${selectedName}. Coba cari warna ${currentTargetColor.name}!`, 'id-ID');
    }
}

// GAME 4: TEBAK BENTUK GEOMETRI
const SHAPES_DATA = [
    { name: 'Lingkaran', html: '<div class="w-20 h-20 rounded-full bg-teal-500 shadow-md"></div>' },
    { name: 'Persegi', html: '<div class="w-20 h-20 rounded-xl bg-blue-500 shadow-md"></div>' },
    { name: 'Segitiga', html: '<div class="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-amber-500"></div>' },
    { name: 'Bintang', html: '<div class="text-6xl text-yellow-400">⭐</div>' }
];
let currentTargetShape = null;

function initShapeGame() {
    currentTargetShape = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    document.getElementById('shapeDisplayArea').innerHTML = currentTargetShape.html;

    const grid = document.getElementById('shapeOptions');
    grid.innerHTML = '';
    SHAPES_DATA.forEach(s => {
        grid.innerHTML += `
            <button onclick="checkShapeAnswer('${s.name}')" class="bg-teal-50 hover:bg-teal-200 border border-teal-300 font-bold py-2.5 px-2 rounded-xl text-xs text-teal-900">
                ${s.name}
            </button>
        `;
    });
}

function checkShapeAnswer(name) {
    if (name === currentTargetShape.name) {
        confetti({ particleCount: 60, spread: 50 });
        speakText(`Betul sekali! Ini adalah bentuk ${name}!`, 'id-ID');
        initShapeGame();
    } else {
        speakText(`Bukan ${name}, coba tebak lagi!`, 'id-ID');
    }
}

// GAME 5: TEBAK HURUF AWAL KATA
const LETTER_WORDS = [
    { emoji: '🐘', word: 'GAJAH', first: 'G', rest: '_ A J A H' },
    { emoji: '🍎', word: 'APEL', first: 'A', rest: '_ P E L' },
    { emoji: '🐱', word: 'KUCING', first: 'K', rest: '_ U C I N G' },
    { emoji: '🐟', word: 'IKAN', first: 'I', rest: '_ K A N' },
    { emoji: '🍌', word: 'PISANG', first: 'P', rest: '_ I S A N G' },
    { emoji: '🦆', word: 'BEBEK', first: 'B', rest: '_ E B E K' }
];
let currentLetterItem = null;

function initLetterGame() {
    currentLetterItem = LETTER_WORDS[Math.floor(Math.random() * LETTER_WORDS.length)];
    document.getElementById('letterGameEmoji').textContent = currentLetterItem.emoji;
    document.getElementById('letterGameWordHint').textContent = currentLetterItem.rest;

    const alphabet = ['A', 'B', 'G', 'I', 'K', 'P', 'M', 'S'];
    const opts = new Set([currentLetterItem.first]);
    while (opts.size < 4) {
        opts.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    const shuffled = Array.from(opts).sort(() => Math.random() - 0.5);

    const grid = document.getElementById('letterGameOptions');
    grid.innerHTML = '';
    shuffled.forEach(letter => {
        grid.innerHTML += `
            <button onclick="checkLetterAnswer('${letter}')" class="bg-white hover:bg-emerald-200 border-2 border-emerald-400 font-black text-xl py-3 rounded-2xl text-emerald-900 shadow-sm active:scale-95 transition">
                ${letter}
            </button>
        `;
    });
}

function speakPhonicsWordPrompt() {
    if (currentLetterItem) {
        speakText(`Huruf depan dari kata ${currentLetterItem.word} adalah huruf apa?`, 'id-ID');
    }
}

function checkLetterAnswer(letter) {
    if (letter === currentLetterItem.first) {
        confetti({ particleCount: 70, spread: 60 });
        speakText(`Pintar! ${currentLetterItem.first} untuk ${currentLetterItem.word}!`, 'id-ID');
        initLetterGame();
    } else {
        speakText(`Belum tepat, ayo dengarkan kata ${currentLetterItem.word}!`, 'id-ID');
    }
}

// =========================================================================
// 5. CRUD PHONICS (TAMBAH, UBAH, HAPUS)
// =========================================================================
function openPhonicsModal(editId = null) {
    document.getElementById('phonicsEditId').value = "";
    document.getElementById('phonicsTitle').value = "";
    document.getElementById('phonicsWords').value = "";
    document.getElementById('phonicsModalTitle').textContent = "Tambah Modul Phonics Baru";

    if (editId) {
        const item = readingData.find(r => r.id === editId);
        if (item) {
            document.getElementById('phonicsModalTitle').textContent = "Ubah Modul Phonics";
            document.getElementById('phonicsEditId').value = item.id;
            document.getElementById('phonicsTitle').value = item.title;
            document.getElementById('phonicsLang').value = item.lang;
            document.getElementById('phonicsWords').value = (item.words || []).join(', ');
        }
    }
    openModal('addPhonicsModal');
}

function handleSavePhonics(e) {
    e.preventDefault();
    const editId = document.getElementById('phonicsEditId').value;
    const payload = {
        id: editId || `R-${Date.now()}`,
        title: document.getElementById('phonicsTitle').value,
        lang: document.getElementById('phonicsLang').value,
        words: document.getElementById('phonicsWords').value.split(',').map(w => w.trim().toUpperCase()).filter(Boolean)
    };

    if (editId) {
        const idx = readingData.findIndex(r => r.id === editId);
        if (idx !== -1) readingData[idx] = payload;
        saveData("Modul Phonics diubah!");
    } else {
        readingData.unshift(payload);
        saveData("Modul Phonics baru ditambahkan!");
    }
    closeModal('addPhonicsModal');
}

function deletePhonics(id) {
    if (confirm("Hapus modul Phonics ini?")) {
        readingData = readingData.filter(r => r.id !== id);
        saveData("Modul Phonics dihapus!");
    }
}

function renderReadingCards() {
    const container = document.getElementById('readingCardsContainer');
    container.innerHTML = '';

    readingData.forEach(r => {
        let wordButtons = '';
        (r.words || []).forEach(w => {
            wordButtons += `
                <button onclick="speakText('${w}', '${r.lang}')" class="bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 active:scale-95 transition">
                    <span>${w}</span>
                    <i class="fa-solid fa-volume-high text-pink-600"></i>
                </button>
            `;
        });

        container.innerHTML += `
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="kids-title text-lg font-bold text-slate-800">${r.title}</h3>
                    <div class="space-x-2">
                        <button onclick="openPhonicsModal('${r.id}')" class="text-amber-600 hover:text-amber-800 text-xs font-bold"><i class="fa-solid fa-pen-to-square"></i> Ubah</button>
                        <button onclick="deletePhonics('${r.id}')" class="text-red-500 hover:text-red-700 text-xs font-bold"><i class="fa-solid fa-trash"></i> Hapus</button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 pt-1">${wordButtons}</div>
            </div>
        `;
    });
}

// =========================================================================
// 6. CRUD SISWA, LEADERBOARD & REKAP NILAI
// =========================================================================
function renderStudentsTable(data) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';
    data.forEach((s, idx) => {
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50">
                <td class="py-3 px-4 text-center font-bold text-slate-400">${idx + 1}</td>
                <td class="py-3 px-4 font-bold text-slate-800">${s.name}</td>
                <td class="py-3 px-4 text-center font-bold text-xs">${s.gender}</td>
                <td class="py-3 px-4 text-xs font-mono">${s.nipd || '-'}</td>
                <td class="py-3 px-4 text-center space-x-3">
                    <button onclick="openStudentModal(${s.id})" class="text-amber-600 hover:text-amber-800 text-xs font-bold"><i class="fa-solid fa-pen-to-square"></i> Ubah</button>
                    <button onclick="deleteStudent(${s.id})" class="text-red-500 hover:text-red-700 text-xs font-bold"><i class="fa-solid fa-trash"></i> Hapus</button>
                </td>
            </tr>
        `;
    });
}

function filterStudents() {
    const q = document.getElementById('studentSearchInput').value.toLowerCase();
    const filtered = studentsData.filter(s => s.name.toLowerCase().includes(q));
    renderStudentsTable(filtered);
}

function openStudentModal(editId = null) {
    document.getElementById('studentEditId').value = "";
    document.getElementById('inputStudentName').value = "";
    document.getElementById('inputStudentGender').value = "L";
    document.getElementById('inputStudentNipd').value = "";
    document.getElementById('studentModalTitle').textContent = "Tambah Data Murid Baru";

    if (editId) {
        const s = studentsData.find(st => st.id === editId);
        if (s) {
            document.getElementById('studentModalTitle').textContent = "Ubah Data Murid";
            document.getElementById('studentEditId').value = s.id;
            document.getElementById('inputStudentName').value = s.name;
            document.getElementById('inputStudentGender').value = s.gender;
            document.getElementById('inputStudentNipd').value = s.nipd || "";
        }
    }
    openModal('addStudentModal');
}

function handleSaveStudent(e) {
    e.preventDefault();
    const editId = document.getElementById('studentEditId').value;
    const payload = {
        id: editId ? parseInt(editId) : Date.now(),
        name: document.getElementById('inputStudentName').value.toUpperCase(),
        gender: document.getElementById('inputStudentGender').value,
        nipd: document.getElementById('inputStudentNipd').value
    };

    if (editId) {
        const idx = studentsData.findIndex(s => s.id === parseInt(editId));
        if (idx !== -1) studentsData[idx] = payload;
        saveData("Data murid diperbarui!");
    } else {
        studentsData.push(payload);
        saveData("Data murid baru ditambahkan!");
    }
    closeModal('addStudentModal');
}

function deleteStudent(id) {
    if (confirm("Hapus data siswa ini?")) {
        studentsData = studentsData.filter(s => s.id !== id);
        saveData("Data siswa dihapus!");
    }
}

function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const dashboardTop3 = document.getElementById('dashboardTop3Container');
    const countBadge = document.getElementById('leaderboardCountBadge');
    if (countBadge) countBadge.textContent = `${studentsData.length} Murid Terdaftar`;

    const studentScores = {};
    studentsData.forEach(s => { studentScores[s.name] = { totalScore: 0, count: 0 }; });

    submissionsData.forEach(sub => {
        if (studentScores[sub.studentName]) {
            studentScores[sub.studentName].totalScore += sub.score;
            studentScores[sub.studentName].count += 1;
        }
    });

    const sorted = Object.keys(studentScores).map(name => ({
        name,
        totalScore: studentScores[name].totalScore,
        count: studentScores[name].count
    })).sort((a, b) => b.totalScore - a.totalScore);

    if (leaderboardList) {
        leaderboardList.innerHTML = '';
        sorted.forEach((item, idx) => {
            leaderboardList.innerHTML += `
                <div class="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div class="flex items-center space-x-3">
                        <span class="font-bold text-xs px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800">#${idx + 1}</span>
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm">${item.name}</h4>
                            <span class="text-[11px] text-slate-400">${item.count} Kuis Selesai</span>
                        </div>
                    </div>
                    <span class="text-lg font-black text-teal-600">${item.totalScore} Poin</span>
                </div>
            `;
        });
    }

    if (dashboardTop3) {
        dashboardTop3.innerHTML = '';
        sorted.slice(0, 3).forEach((item, idx) => {
            const medals = ['🥇', '🥈', '🥉'];
            dashboardTop3.innerHTML += `
                <div class="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50">
                    <div class="flex items-center space-x-2">
                        <span class="text-xl">${medals[idx]}</span>
                        <h5 class="font-bold text-xs text-slate-800">${item.name}</h5>
                    </div>
                    <span class="text-sm font-extrabold text-teal-600">${item.totalScore} Poin</span>
                </div>
            `;
        });
    }
}

function renderExcelTable() {
    const tbody = document.getElementById('excelTableBody');
    const query = (document.getElementById('rekapSearchInput')?.value || '').toLowerCase();
    
    const filtered = submissionsData.filter(s => s.studentName.toLowerCase().includes(query));
    document.getElementById('rekap-submisi-count').textContent = `Total: ${filtered.length} Submisi Tersimpan`;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Belum ada data nilai kuis tersimpan.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50">
                <td class="py-3 px-4 text-xs font-mono">${item.timestamp}</td>
                <td class="py-3 px-4 font-bold text-slate-800">${item.studentName}</td>
                <td class="py-3 px-4">${item.materialTitle}</td>
                <td class="py-3 px-4 font-bold text-xs">${item.level}</td>
                <td class="py-3 px-4 text-center font-black text-base text-teal-600">${item.score}</td>
                <td class="py-3 px-4 text-center font-semibold text-xs">${item.status}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="deleteSubmission(${item.id})" class="text-red-500 hover:text-red-700 text-xs font-bold"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function deleteSubmission(id) {
    if (confirm("Hapus rekap nilai ini?")) {
        submissionsData = submissionsData.filter(s => s.id !== id);
        saveData("Record nilai dihapus!");
    }
}

function exportToCSV() {
    let csv = "Waktu,Nama Siswa,Kuis/Game,Level,Skor,Predikat\n";
    submissionsData.forEach(s => {
        csv += `"${s.timestamp}","${s.studentName}","${s.materialTitle}","${s.level}",${s.score},"${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Rekap_Nilai_TK_Mutiara_Harapan.csv`;
    a.click();
}

function adminResetAssessmentCycle() {
    if (confirm('Reset seluruh nilai pengerjaan kuis?')) {
        submissionsData = [];
        saveData("Seluruh rekap nilai di-reset!");
    }
}

window.onload = function() {
    updateUI();
};
