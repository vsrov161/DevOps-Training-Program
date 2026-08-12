// Основная логика приложения
class AnkiApp {
    constructor() {
        // Используем глобальные переменные из questions.js и phrases.js
        this.db = window.questionsDB;
        this.wellDone = window.wellDone;
        this.failPhrases = window.failPhrases;
        
        this.allQuestions = this.flattenQuestions();
        this.filtered = [];
        this.currentIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isFinished = false;
        this.cardRevealed = false;
        this.history = this.loadHistory();
        
        this.initElements();
        this.initEvents();
        this.renderTopics();
        this.updateTotalCount();
    }

    flattenQuestions() {
        const result = [];
        if (!this.db || !this.db.sections) return result;
        
        for (const [sectionId, section] of Object.entries(this.db.sections)) {
            if (section && section.questions) {
                section.questions.forEach(q => {
                    result.push({
                        ...q,
                        sectionId: sectionId,
                        sectionName: section.name
                    });
                });
            }
        }
        return result;
    }

    initElements() {
        this.screens = {
            home: document.getElementById('homeScreen'),
            test: document.getElementById('testScreen'),
            result: document.getElementById('resultScreen'),
            stats: document.getElementById('statsScreen')
        };
        
        this.topicGrid = document.getElementById('topicGrid');
        this.shuffleCheck = document.getElementById('shuffleCheck');
        this.btnStart = document.getElementById('btnStart');
        this.btnStats = document.getElementById('btnStats');
        this.btnStartQuiz = document.getElementById('btnStartQuiz');
        this.btnKnow = document.getElementById('btnKnow');
        this.btnNext = document.getElementById('btnNext');
        this.btnRetry = document.getElementById('btnRetry');
        this.btnHomeFromTest = document.getElementById('btnHomeFromTest');
        this.btnHomeFromResult = document.getElementById('btnHomeFromResult');
        this.btnBackHome = document.getElementById('btnBackHome');
        this.cardQuestion = document.getElementById('cardQuestion');
        this.progressBadge = document.getElementById('progressBadge');
        this.flashContainer = document.getElementById('flashContainer');
        this.scoreCorrect = document.getElementById('scoreCorrect');
        this.scoreWrong = document.getElementById('scoreWrong');
        this.totalQcount = document.getElementById('totalQcount');
        this.statsList = document.getElementById('statsList');
    }

    initEvents() {
        this.btnStart.addEventListener('click', () => this.showScreen('home'));
        this.btnStats.addEventListener('click', () => {
            this.renderStats();
            this.showScreen('stats');
        });
        this.btnStartQuiz.addEventListener('click', () => this.startTest());
        this.btnKnow.addEventListener('click', () => this.handleKnow());
        this.btnNext.addEventListener('click', () => this.handleNext());
        this.btnRetry.addEventListener('click', () => this.startTest());
        this.btnHomeFromTest.addEventListener('click', () => this.goHome());
        this.btnHomeFromResult.addEventListener('click', () => this.goHome());
        this.btnBackHome.addEventListener('click', () => this.goHome());
        
        this.cardQuestion.addEventListener('click', () => this.handleCardClick());
        
        // Используем делегирование для чекбоксов
        this.topicGrid.addEventListener('change', (e) => {
            if (e.target.classList.contains('topic-cb')) {
                this.updateStartButton();
            }
        });
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    renderTopics() {
        this.topicGrid.innerHTML = '';
        if (!this.db || !this.db.sections) return;
        
        for (const [id, section] of Object.entries(this.db.sections)) {
            if (!section || !section.questions) continue;
            
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = id;
            cb.className = 'topic-cb';
            label.appendChild(cb);
            label.appendChild(document.createTextNode(`${section.name} (${section.questions.length})`));
            this.topicGrid.appendChild(label);
        }
    }

    updateTotalCount() {
        this.totalQcount.textContent = this.allQuestions.length;
    }

    updateStartButton() {
        const checked = document.querySelectorAll('.topic-cb:checked');
        this.btnStartQuiz.disabled = checked.length === 0;
    }

    getSelectedTopics() {
        const checked = document.querySelectorAll('.topic-cb:checked');
        return Array.from(checked).map(cb => cb.value);
    }

    buildQuestionPool() {
        const selected = this.getSelectedTopics();
        if (selected.length === 0) return [];
        
        let pool = this.allQuestions.filter(q => selected.includes(q.sectionId));
        
        if (this.shuffleCheck.checked) {
            pool = this.shuffleArray(pool);
        }
        
        return pool;
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    startTest() {
        const pool = this.buildQuestionPool();
        if (pool.length === 0) return;
        
        this.filtered = pool;
        this.currentIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isFinished = false;
        this.cardRevealed = false;
        
        this.showScreen('test');
        this.btnKnow.disabled = false;
        this.btnNext.style.display = 'none';
        this.cardQuestion.className = 'anki-card';
        this.flashContainer.innerHTML = '';
        
        this.renderCard();
    }

    renderCard() {
        if (this.currentIndex >= this.filtered.length) {
            this.finishTest();
            return;
        }
        
        const item = this.filtered[this.currentIndex];
        const cardContent = this.cardQuestion.querySelector('.card-content');
        cardContent.textContent = item.question;
        this.cardQuestion.className = 'anki-card';
        this.cardRevealed = false;
        this.progressBadge.textContent = `${this.currentIndex + 1} / ${this.filtered.length}`;
        this.btnKnow.disabled = false;
        this.btnNext.style.display = 'none';
        this.flashContainer.innerHTML = '';
    }

    handleKnow() {
        if (this.isFinished || this.cardRevealed) return;
        
        this.correctCount++;
        this.cardQuestion.className = 'anki-card green';
        this.showFlash(this.wellDone);
        this.btnKnow.disabled = true;
        this.cardRevealed = true;
        this.btnNext.style.display = 'inline-flex';
    }

    handleCardClick() {
        if (this.isFinished || this.cardRevealed) return;
        
        this.wrongCount++;
        this.cardRevealed = true;
        this.cardQuestion.className = 'anki-card orange';
        
        const item = this.filtered[this.currentIndex];
        const cardContent = this.cardQuestion.querySelector('.card-content');
        cardContent.textContent = item.answer;
        
        this.showFlash(this.failPhrases);
        this.btnKnow.disabled = true;
        this.btnNext.style.display = 'inline-flex';
    }

    handleNext() {
        if (this.isFinished) return;
        this.currentIndex++;
        this.renderCard();
    }

    showFlash(phrases) {
        if (!phrases || phrases.length === 0) return;
        const msg = phrases[Math.floor(Math.random() * phrases.length)];
        this.flashContainer.innerHTML = `<div class="flash-message">${msg}</div>`;
        setTimeout(() => {
            this.flashContainer.innerHTML = '';
        }, 700);
    }

    finishTest() {
        this.isFinished = true;
        this.showScreen('result');
        this.scoreCorrect.textContent = this.correctCount;
        this.scoreWrong.textContent = this.wrongCount;
        
        const entry = {
            date: new Date().toLocaleString(),
            correct: this.correctCount,
            wrong: this.wrongCount,
            total: this.correctCount + this.wrongCount
        };
        this.history.push(entry);
        this.saveHistory();
    }

    goHome() {
        this.showScreen('home');
        this.updateStartButton();
    }

    renderStats() {
        this.statsList.innerHTML = '';
        if (this.history.length === 0) {
            this.statsList.innerHTML = '<div class="stat-card empty">Нет попыток</div>';
            return;
        }
        
        const reversed = [...this.history].reverse();
        reversed.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'stat-card';
            div.innerHTML = `
                <div class="stat-date">${entry.date}</div>
                <div class="stat-score">${entry.correct} / ${entry.total}</div>
                <div class="stat-detail">✅ ${entry.correct} · ❌ ${entry.wrong}</div>
            `;
            this.statsList.appendChild(div);
        });
    }

    loadHistory() {
        try {
            const raw = localStorage.getItem('anki_history');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('anki_history', JSON.stringify(this.history));
        } catch {}
    }
}

// Инициализация приложения после загрузки всех скриптов
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что данные загружены
    if (window.questionsDB && window.questionsDB.sections) {
        const app = new AnkiApp();
        window.app = app; // для отладки
    } else {
        console.error('База данных вопросов не загружена!');
        document.getElementById('totalQcount').textContent = 'Ошибка загрузки';
    }
});