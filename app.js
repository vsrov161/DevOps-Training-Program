// Глобальное состояние приложения
const AppState = {
    topics: {},
    currentTopic: null,
    currentSubtopic: null,
    filteredQuestions: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    repeatCount: 0,
    isFinished: false,
    cardRevealed: false,
    history: [],
    shuffle: false,
    isFlipping: false,
    pendingNext: false,
    // Таймер
    timerMode: null, // 'forward' | 'countdown' | null
    timerSeconds: 0,
    timerTotalSeconds: 0,
    timerRunning: false,
    timerPaused: false,
    timerInterval: null,
    countdownMinutes: 30,
    timerStarted: false,
    timerFinished: false,
    timeoutTriggered: false,
    actualTimeSpent: 0,
    timeLimit: 0,
    weakQuestions: []
};

// Фразы
const WELL_DONE = [
    "Красавчик-капитальный бля!", "Жги дальше!", "Кто ты, воин?",
    "нормально сделал - нормально вышло!", "Мощь!", "В яблочко!",
    "Хардкорно верно!", "Ты порвал эту тему!", "Как по нотам!",
    "Бомбически!", "Молодца! Так держать!", "Блестяще!",
    "Изумительно!", "Великолепно!", "Ты на коне!",
    "Идеальный залет!", "Точняк!", "Сенсационно!",
    "Заебись — идем дальше!"
];

const FAIL_PHRASES = [
    "Мимо кассы!", "Ну ты даешь! Подумай еще раз.",
    "Такой умный, а ошибся!", "Минус балл, но плюс опыт.",
    "Пролетел как фанера над Парижем!", "Бывает! Встряхнись!",
    "Ничего страшного, это просто тренировка.",
    "Ошибка — двигатель прогресса!", "Осечка."
];

const REPEAT_PHRASES = [
    "🔄 Частично засчитано!", "Почти!", "Близко, но не точно!",
    "Ещё немного!", "На грани!", "Почти правильно!"
];

// DOM элементы
const elements = {};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы
    elements.homeScreen = document.getElementById('homeScreen');
    elements.subtopicsScreen = document.getElementById('subtopicsScreen');
    elements.timerSettingsScreen = document.getElementById('timerSettingsScreen');
    elements.testScreen = document.getElementById('testScreen');
    elements.resultScreen = document.getElementById('resultScreen');
    elements.statsScreen = document.getElementById('statsScreen');
    
    elements.topicCards = document.getElementById('topicCards');
    elements.subtopicGrid = document.getElementById('subtopicGrid');
    elements.currentTopicTitle = document.getElementById('currentTopicTitle');
    elements.totalQcount = document.getElementById('totalQcount');
    elements.shuffleCheck = document.getElementById('shuffleCheck');
    elements.btnStartQuiz = document.getElementById('btnStartQuiz');
    elements.btnTimerSettings = document.getElementById('btnTimerSettings');
    elements.btnImport = document.getElementById('btnImport');
    elements.btnStats = document.getElementById('btnStats');
    elements.btnBackToHome = document.getElementById('btnBackToHome');
    elements.btnBackToSubtopics = document.getElementById('btnBackToSubtopics');
    elements.btnBackToSubtopicsFromTimer = document.getElementById('btnBackToSubtopicsFromTimer');
    elements.btnBackHomeFromStats = document.getElementById('btnBackHomeFromStats');
    elements.btnResultToHome = document.getElementById('btnResultToHome');
    elements.btnSaveTimerSettings = document.getElementById('btnSaveTimerSettings');
    elements.fileInput = document.getElementById('fileInput');
    elements.cardQuestion = document.getElementById('cardQuestion');
    elements.cardFront = document.getElementById('cardFront');
    elements.cardBack = document.getElementById('cardBack');
    elements.progressBadge = document.getElementById('progressBadge');
    elements.flashContainer = document.getElementById('flashContainer');
    elements.btnKnow = document.getElementById('btnKnow');
    elements.btnRepeat = document.getElementById('btnRepeat');
    elements.btnNext = document.getElementById('btnNext');
    elements.btnRetry = document.getElementById('btnRetry');
    elements.btnFinishAttempt = document.getElementById('btnFinishAttempt');
    elements.scoreCorrect = document.getElementById('scoreCorrect');
    elements.scoreRepeat = document.getElementById('scoreRepeat');
    elements.scoreWrong = document.getElementById('scoreWrong');
    elements.timerResult = document.getElementById('timerResult');
    elements.statsList = document.getElementById('statsList');
    elements.questionHint = document.getElementById('questionHint');
    elements.timerDisplay = document.getElementById('timerDisplay');
    elements.timerText = document.getElementById('timerText');
    elements.timeoutContainer = document.getElementById('timeoutContainer');
    elements.statsDetailModal = document.getElementById('statsDetailModal');
    elements.modalBody = document.getElementById('modalBody');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.btnCloseModal = document.getElementById('btnCloseModal');

    // Настройки таймера
    elements.timerEnable = document.getElementById('timerEnable');
    elements.countdownEnable = document.getElementById('countdownEnable');
    elements.countdownMinutes = document.getElementById('countdownMinutes');
    elements.countdownInputGroup = document.getElementById('countdownInputGroup');

    // Загружаем историю
    loadHistory();

    // Загружаем сохраненные темы
    loadTopics();

    // Настраиваем обработчики событий
    setupEventListeners();
});

function setupEventListeners() {
    // Импорт
    elements.btnImport.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    elements.fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    importTopic(data);
                } catch (error) {
                    alert('Ошибка загрузки файла: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
        this.value = '';
    });

    // Статистика
    elements.btnStats.addEventListener('click', showStats);
    elements.btnBackHomeFromStats.addEventListener('click', goHome);
    elements.btnCloseModal.addEventListener('click', closeModal);
    elements.statsDetailModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Навигация
    elements.btnBackToHome.addEventListener('click', goHome);
    elements.btnBackToSubtopics.addEventListener('click', goToSubtopics);
    elements.btnBackToSubtopicsFromTimer.addEventListener('click', goToSubtopics);
    elements.btnResultToHome.addEventListener('click', goHome);

    // Таймер
    elements.btnTimerSettings.addEventListener('click', openTimerSettings);
    elements.btnSaveTimerSettings.addEventListener('click', saveTimerSettings);
    elements.timerEnable.addEventListener('change', updateTimerUI);
    elements.countdownEnable.addEventListener('change', updateTimerUI);
    elements.timerDisplay.addEventListener('click', toggleTimerPause);
    elements.btnFinishAttempt.addEventListener('click', finishAttempt);
    
    // Быстрые кнопки таймера
    document.querySelectorAll('.timer-quick-buttons .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const minutes = parseInt(this.dataset.minutes);
            const current = parseInt(elements.countdownMinutes.value) || 0;
            elements.countdownMinutes.value = current + minutes;
        });
    });

    // Тест
    elements.btnStartQuiz.addEventListener('click', startTest);
    elements.btnKnow.addEventListener('click', handleKnow);
    elements.btnRepeat.addEventListener('click', handleRepeat);
    elements.btnNext.addEventListener('click', handleNext);
    elements.btnRetry.addEventListener('click', startTest);
    elements.cardQuestion.addEventListener('click', handleCardClick);
    
    // Shuffle
    elements.shuffleCheck.addEventListener('change', function() {
        AppState.shuffle = this.checked;
    });

    // Обновление кнопки "Приступить" при выборе подтем
    elements.subtopicGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('subtopic-cb')) {
            updateStartButton();
        }
    });
}

// ===== УПРАВЛЕНИЕ ТЕМАМИ =====

function loadDefaultTopic() {
    if (window.LINUX_ANKI_DB && window.LINUX_ANKI_DB.sections) {
        const linuxTopic = {
            title: window.LINUX_ANKI_DB.title || "Linux Anki",
            icon: window.LINUX_ANKI_DB.icon || "🐧",
            sections: window.LINUX_ANKI_DB.sections,
            isDefault: true
        };
        
        if (!AppState.topics['linux']) {
            AppState.topics['linux'] = linuxTopic;
        }
        console.log('Linux Anki loaded! Sections:', Object.keys(linuxTopic.sections).length);
    } else {
        console.error('Linux Anki DB not found!');
    }
}

function saveTopics() {
    try {
        const topicsToSave = {};
        for (const [id, topic] of Object.entries(AppState.topics)) {
            if (!topic.isDefault) {
                topicsToSave[id] = topic;
            }
        }
        localStorage.setItem('anki_topics', JSON.stringify(topicsToSave));
    } catch (error) {
        console.error('Error saving topics:', error);
    }
}

function loadTopics() {
    try {
        loadDefaultTopic();
        
        const saved = localStorage.getItem('anki_topics');
        if (saved) {
            const topics = JSON.parse(saved);
            for (const [id, topic] of Object.entries(topics)) {
                if (topic.title && topic.sections) {
                    AppState.topics[id] = topic;
                }
            }
        }
        
        renderTopicCards();
    } catch (error) {
        console.error('Error loading topics:', error);
        renderTopicCards();
    }
}

function importTopic(data) {
    if (!data.title || !data.sections || typeof data.sections !== 'object') {
        alert('Неверный формат файла. Требуется: { "title": "...", "sections": {...} }');
        return;
    }
    
    const id = 'topic_' + Date.now();
    AppState.topics[id] = {
        title: data.title,
        icon: data.icon || '📚',
        sections: data.sections,
        isDefault: false
    };
    
    saveTopics();
    renderTopicCards();
    alert(`✅ Тема "${data.title}" успешно импортирована и сохранена!`);
}

function deleteTopic(topicId) {
    const topic = AppState.topics[topicId];
    if (!topic) return;
    
    if (topic.isDefault) {
        alert('❌ Нельзя удалить встроенную тему Linux Anki!');
        return;
    }
    
    if (!confirm(`Удалить тему "${topic.title}"?`)) {
        return;
    }
    
    delete AppState.topics[topicId];
    saveTopics();
    
    if (AppState.currentTopic && !AppState.topics[Object.keys(AppState.topics).find(id => AppState.topics[id] === AppState.currentTopic)]) {
        AppState.currentTopic = null;
    }
    
    renderTopicCards();
    
    if (Object.keys(AppState.topics).length === 0) {
        document.getElementById('topicCards').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6a8aaa;">
                Нет загруженных тем. Нажмите "Импорт" чтобы добавить.
            </div>
        `;
    }
}

function renderTopicCards() {
    const container = elements.topicCards;
    container.innerHTML = '';
    
    const topicIds = Object.keys(AppState.topics);
    if (topicIds.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6a8aaa;">
                Нет загруженных тем. Нажмите "Импорт" чтобы добавить.
            </div>
        `;
        return;
    }
    
    topicIds.forEach(id => {
        const topic = AppState.topics[id];
        const totalQuestions = Object.values(topic.sections).reduce(
            (sum, section) => sum + (section.questions ? section.questions.length : 0), 0
        );
        
        const card = document.createElement('div');
        card.className = 'topic-card';
        
        const isDefault = topic.isDefault || false;
        const defaultBadge = isDefault ? '<span class="default-badge">⭐ Встроенная</span>' : '';
        const deleteButton = !isDefault ? `
            <button class="delete-topic-btn" data-topic-id="${id}" title="Удалить тему">
                ✕
            </button>
        ` : '';
        
        card.innerHTML = `
            <div class="topic-card-header">
                <span class="icon">${topic.icon || '📚'}</span>
                ${deleteButton}
            </div>
            <div class="title">${topic.title}</div>
            <div class="subtitle">${Object.keys(topic.sections).length} разделов</div>
            <div class="count">${totalQuestions} вопросов</div>
            ${defaultBadge}
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-topic-btn')) return;
            selectTopic(id);
        });
        
        const deleteBtn = card.querySelector('.delete-topic-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTopic(id);
            });
        }
        
        container.appendChild(card);
    });
}

function selectTopic(topicId) {
    AppState.currentTopic = AppState.topics[topicId];
    if (!AppState.currentTopic) return;
    
    showScreen('subtopics');
    renderSubtopics();
}

function renderSubtopics() {
    const topic = AppState.currentTopic;
    if (!topic) return;
    
    elements.currentTopicTitle.textContent = `${topic.icon || '📚'} ${topic.title}`;
    
    const grid = elements.subtopicGrid;
    grid.innerHTML = '';
    
    const sectionIds = Object.keys(topic.sections);
    if (sectionIds.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; color: #6a8aaa;">Нет разделов</div>';
        return;
    }
    
    const selectAllFrame = document.createElement('div');
    selectAllFrame.style.cssText = 'grid-column: 1/-1; padding: 5px 0;';
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.className = 'btn btn-secondary';
    selectAllBtn.textContent = '☑️ Выбрать все';
    selectAllBtn.style.cssText = 'font-size: 0.9rem; padding: 5px 15px;';
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = grid.querySelectorAll('.subtopic-cb');
        checkboxes.forEach(cb => cb.checked = true);
        updateStartButton();
    });
    selectAllFrame.appendChild(selectAllBtn);
    grid.appendChild(selectAllFrame);
    
    sectionIds.forEach(id => {
        const section = topic.sections[id];
        const label = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = id;
        cb.className = 'subtopic-cb';
        label.appendChild(cb);
        label.appendChild(document.createTextNode(`${section.name} (${section.questions ? section.questions.length : 0})`));
        grid.appendChild(label);
    });
    
    updateStartButton();
    updateTotalCount();
}

function updateStartButton() {
    const checked = document.querySelectorAll('.subtopic-cb:checked');
    const hasSelection = checked.length > 0;
    elements.btnStartQuiz.disabled = !hasSelection;
    elements.btnTimerSettings.disabled = !hasSelection;
}

function updateTotalCount() {
    const topic = AppState.currentTopic;
    if (!topic) return;
    
    const total = Object.values(topic.sections).reduce(
        (sum, section) => sum + (section.questions ? section.questions.length : 0), 0
    );
    elements.totalQcount.textContent = total;
}

function getSelectedSubtopics() {
    const checked = document.querySelectorAll('.subtopic-cb:checked');
    return Array.from(checked).map(cb => cb.value);
}

function buildQuestionPool() {
    const topic = AppState.currentTopic;
    if (!topic) return [];
    
    const selected = getSelectedSubtopics();
    if (selected.length === 0) return [];
    
    let pool = [];
    selected.forEach(id => {
        const section = topic.sections[id];
        if (section && section.questions) {
            pool = pool.concat(section.questions);
        }
    });
    
    if (AppState.shuffle) {
        pool = shuffleArray(pool);
    }
    
    return pool;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ===== НАСТРОЙКИ ТАЙМЕРА =====

function openTimerSettings() {
    const checked = document.querySelectorAll('.subtopic-cb:checked');
    if (checked.length === 0) {
        alert('Сначала выберите хотя бы один раздел!');
        return;
    }
    
    elements.timerEnable.checked = AppState.timerMode === 'forward';
    elements.countdownEnable.checked = AppState.timerMode === 'countdown';
    elements.countdownMinutes.value = AppState.countdownMinutes || 30;
    updateTimerUI();
    showScreen('timerSettings');
}

function updateTimerUI() {
    const countdownChecked = elements.countdownEnable.checked;
    elements.countdownInputGroup.style.display = countdownChecked ? 'block' : 'none';
    
    // Если выбран обратный отсчет, снимаем прямой
    if (countdownChecked) {
        elements.timerEnable.checked = false;
    }
    // Если выбран прямой, снимаем обратный
    if (elements.timerEnable.checked) {
        elements.countdownEnable.checked = false;
        elements.countdownInputGroup.style.display = 'none';
    }
}

function saveTimerSettings() {
    const forward = elements.timerEnable.checked;
    const countdown = elements.countdownEnable.checked;
    
    if (forward && countdown) {
        alert('Выберите только один режим таймера!');
        return;
    }
    
    if (forward) {
        AppState.timerMode = 'forward';
        AppState.countdownMinutes = 0;
    } else if (countdown) {
        AppState.timerMode = 'countdown';
        const minutes = parseInt(elements.countdownMinutes.value) || 0;
        if (minutes <= 0) {
            alert('Введите положительное количество минут!');
            return;
        }
        AppState.countdownMinutes = minutes;
        AppState.timeLimit = minutes * 60;
    } else {
        AppState.timerMode = null;
    }
    
    goToSubtopics();
}

// ===== ТЕСТ =====

function startTest() {
    const pool = buildQuestionPool();
    if (pool.length === 0) return;
    
    // Сброс состояния
    AppState.filteredQuestions = pool;
    AppState.currentIndex = 0;
    AppState.correctCount = 0;
    AppState.wrongCount = 0;
    AppState.repeatCount = 0;
    AppState.isFinished = false;
    AppState.cardRevealed = false;
    AppState.isFlipping = false;
    AppState.pendingNext = false;
    AppState.weakQuestions = [];
    AppState.timerStarted = false;
    AppState.timerRunning = false;
    AppState.timerPaused = false;
    AppState.timerFinished = false;
    AppState.timeoutTriggered = false;
    AppState.actualTimeSpent = 0;
    
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
    }
    
    showScreen('test');
    elements.btnKnow.disabled = false;
    elements.btnRepeat.style.display = 'none';
    elements.btnNext.style.display = 'none';
    elements.flashContainer.innerHTML = '';
    elements.timeoutContainer.style.display = 'none';
    elements.timerDisplay.style.display = 'none';
    elements.questionHint.textContent = '';
    elements.questionHint.style.display = 'none';
    
    renderCard();
    
    // Запускаем таймер после рендера первой карточки
    setTimeout(() => startTimer(), 300);
}

function renderCard() {
    if (AppState.currentIndex >= AppState.filteredQuestions.length) {
        finishTest();
        return;
    }
    
    const item = AppState.filteredQuestions[AppState.currentIndex];
    
    elements.cardQuestion.className = 'anki-card';
    elements.cardQuestion.style.transform = '';
    
    elements.cardFront.textContent = item.q || item.question;
    elements.cardBack.textContent = item.a || item.answer;
    
    elements.questionHint.textContent = '';
    elements.questionHint.style.display = 'none';
    
    AppState.cardRevealed = false;
    AppState.isFlipping = false;
    AppState.pendingNext = false;
    
    elements.progressBadge.textContent = `${AppState.currentIndex + 1} / ${AppState.filteredQuestions.length}`;
    elements.btnKnow.disabled = false;
    elements.btnRepeat.style.display = 'none';
    elements.btnNext.style.display = 'none';
    elements.flashContainer.innerHTML = '';
    
    void elements.cardQuestion.offsetHeight;
}

function handleKnow() {
    if (AppState.isFinished || AppState.cardRevealed || AppState.isFlipping) return;
    
    AppState.correctCount++;
    elements.cardQuestion.className = 'anki-card green';
    elements.cardQuestion.classList.remove('flipped');
    showFlash(WELL_DONE);
    elements.btnKnow.disabled = true;
    elements.btnRepeat.style.display = 'none';
    AppState.cardRevealed = true;
    elements.btnNext.style.display = 'inline-flex';
}

function handleRepeat() {
    if (AppState.isFinished || AppState.cardRevealed || AppState.isFlipping) return;
    
    AppState.repeatCount++;
    AppState.weakQuestions.push({
        question: AppState.filteredQuestions[AppState.currentIndex].q || 
                 AppState.filteredQuestions[AppState.currentIndex].question,
        answer: AppState.filteredQuestions[AppState.currentIndex].a || 
                AppState.filteredQuestions[AppState.currentIndex].answer
    });
    
    elements.cardQuestion.className = 'anki-card repeat';
    showFlash(REPEAT_PHRASES);
    elements.btnKnow.disabled = true;
    elements.btnRepeat.style.display = 'none';
    AppState.cardRevealed = true;
    elements.btnNext.style.display = 'inline-flex';
}

function handleCardClick() {
    if (AppState.isFinished || AppState.cardRevealed || AppState.isFlipping) return;
    
    AppState.isFlipping = true;
    
    const currentItem = AppState.filteredQuestions[AppState.currentIndex];
    
    elements.questionHint.textContent = currentItem.q || currentItem.question;
    elements.questionHint.style.display = 'block';
    elements.cardQuestion.classList.add('flipped');
    elements.btnRepeat.style.display = 'inline-flex';
    
    setTimeout(() => {
        AppState.wrongCount++;
        AppState.cardRevealed = true;
        
        elements.cardQuestion.className = 'anki-card orange';
        elements.cardQuestion.classList.add('flipped');
        
        showFlash(FAIL_PHRASES);
        elements.btnKnow.disabled = true;
        elements.btnNext.style.display = 'inline-flex';
        AppState.isFlipping = false;
    }, 600);
}

function handleNext() {
    if (AppState.isFinished) return;
    
    elements.cardQuestion.className = 'anki-card';
    elements.cardQuestion.classList.remove('flipped', 'green', 'orange', 'repeat');
    elements.cardQuestion.style.transform = '';
    
    elements.questionHint.textContent = '';
    elements.questionHint.style.display = 'none';
    elements.flashContainer.innerHTML = '';
    elements.btnRepeat.style.display = 'none';
    
    AppState.currentIndex++;
    renderCard();
}

function showFlash(phrases) {
    const msg = phrases[Math.floor(Math.random() * phrases.length)];
    elements.flashContainer.innerHTML = `<div class="flash-message">${msg}</div>`;
    setTimeout(() => {
        elements.flashContainer.innerHTML = '';
    }, 700);
}

// ===== ТАЙМЕР =====

function startTimer() {
    if (!AppState.timerMode || AppState.timerStarted) return;
    if (AppState.filteredQuestions.length === 0) return;
    
    AppState.timerStarted = true;
    AppState.timerRunning = true;
    AppState.timerPaused = false;
    
    elements.timerDisplay.style.display = 'flex';
    elements.timerDisplay.className = 'timer-circle';
    
    if (AppState.timerMode === 'forward') {
        AppState.timerSeconds = 0;
    } else {
        AppState.timerSeconds = AppState.timeLimit;
        updateTimerColor();
    }
    
    updateTimerDisplay();
    AppState.timerInterval = setInterval(tick, 1000);
}

function tick() {
    if (!AppState.timerRunning || AppState.timerPaused) return;
    
    if (AppState.timerMode === 'forward') {
        AppState.timerSeconds++;
        AppState.actualTimeSpent = AppState.timerSeconds;
    } else {
        AppState.timerSeconds--;
        AppState.actualTimeSpent = AppState.timeLimit - AppState.timerSeconds;
        updateTimerColor();
        
        if (AppState.timerSeconds <= 0) {
            AppState.timerFinished = true;
            AppState.timerRunning = false;
            clearInterval(AppState.timerInterval);
            elements.timerDisplay.className = 'timer-circle finished';
            elements.timeoutContainer.style.display = 'block';
            elements.timerText.textContent = '00:00';
            showFlash(['⏰ Время вышло!']);
            return;
        }
    }
    
    updateTimerDisplay();
}

function updateTimerColor() {
    if (AppState.timerMode !== 'countdown') return;
    
    const percent = (AppState.timerSeconds / AppState.timeLimit) * 100;
    elements.timerDisplay.className = 'timer-circle';
    
    if (percent <= 5) {
        elements.timerDisplay.classList.add('danger');
    } else if (percent <= 50) {
        elements.timerDisplay.classList.add('warning');
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(AppState.timerSeconds / 60);
    const secs = AppState.timerSeconds % 60;
    elements.timerText.textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function toggleTimerPause() {
    if (!AppState.timerStarted || AppState.timerFinished) return;
    
    AppState.timerPaused = !AppState.timerPaused;
    
    if (AppState.timerPaused) {
        elements.timerDisplay.classList.add('paused');
    } else {
        elements.timerDisplay.classList.remove('paused');
    }
}

function finishAttempt() {
    if (!confirm('Завершить попытку? Неотвеченные вопросы будут засчитаны как неправильные.')) return;
    
    const remaining = AppState.filteredQuestions.length - AppState.currentIndex;
    AppState.wrongCount += remaining;
    AppState.timeoutTriggered = true;
    AppState.isFinished = true;
    
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerRunning = false;
    }
    
    finishTest();
}

// ===== ЗАВЕРШЕНИЕ ТЕСТА =====

function finishTest() {
    AppState.isFinished = true;
    
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerRunning = false;
    }
    
    showScreen('result');
    elements.scoreCorrect.textContent = AppState.correctCount;
    elements.scoreRepeat.textContent = AppState.repeatCount;
    elements.scoreWrong.textContent = AppState.wrongCount;
    
    let timerInfo = '';
    if (AppState.timerMode === 'forward') {
        const mins = Math.floor(AppState.actualTimeSpent / 60);
        const secs = AppState.actualTimeSpent % 60;
        timerInfo = `⏱️ Затрачено времени: ${mins}м ${secs}с`;
    } else if (AppState.timerMode === 'countdown') {
        const givenMins = Math.floor(AppState.timeLimit / 60);
        const givenSecs = AppState.timeLimit % 60;
        const spentMins = Math.floor(AppState.actualTimeSpent / 60);
        const spentSecs = AppState.actualTimeSpent % 60;
        timerInfo = `⏳ Дано: ${givenMins}м ${givenSecs}с · Потрачено: ${spentMins}м ${spentSecs}с`;
        if (AppState.timeoutTriggered) {
            timerInfo += ' ⚠️ Время вышло!';
        }
    }
    elements.timerResult.textContent = timerInfo;
    
    const entry = {
        date: new Date().toLocaleString(),
        correct: AppState.correctCount,
        repeat: AppState.repeatCount,
        wrong: AppState.wrongCount,
        total: AppState.correctCount + AppState.repeatCount + AppState.wrongCount,
        topic: AppState.currentTopic ? AppState.currentTopic.title : 'Unknown',
        timerMode: AppState.timerMode,
        timeSpent: AppState.actualTimeSpent || 0,
        timeLimit: AppState.timeLimit || null,
        timeoutTriggered: AppState.timeoutTriggered || false,
        weakQuestions: AppState.weakQuestions || []
    };
    AppState.history.push(entry);
    saveHistory();
}

// ===== СТАТИСТИКА =====

function showStats() {
    renderStats();
    showScreen('stats');
}

function renderStats() {
    const container = elements.statsList;
    container.innerHTML = '';
    
    if (AppState.history.length === 0) {
        container.innerHTML = '<div class="stat-card empty">Нет попыток</div>';
        return;
    }
    
    const reversed = [...AppState.history].reverse();
    reversed.forEach((entry, index) => {
        const div = document.createElement('div');
        div.className = 'stat-card';
        if (entry.timeoutTriggered) {
            div.style.borderColor = '#8a3a3a';
            div.style.background = '#1a2a2a';
        }
        
        const timeStr = entry.timerMode ? 
            `${Math.floor(entry.timeSpent / 60)}м ${entry.timeSpent % 60}с` : 
            '—';
        
        div.innerHTML = `
            <div class="stat-date">${entry.date}</div>
            <div class="stat-score">${entry.correct} / ${entry.total}</div>
            <div class="stat-detail">
                ✅ ${entry.correct} · 🔄 ${entry.repeat || 0} · ❌ ${entry.wrong}
                ${entry.timeoutTriggered ? ' ⚠️' : ''}
            </div>
            <div class="stat-detail" style="font-size:0.75rem; color:#6a8aaa;">
                ⏱️ ${timeStr} · ${entry.topic || ''}
            </div>
            <button class="btn btn-secondary btn-small" style="margin-top:10px;" 
                    data-index="${AppState.history.length - 1 - index}">
                📊 Детали
            </button>
        `;
        
        const detailBtn = div.querySelector('button');
        detailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.index);
            showStatsDetail(idx);
        });
        
        container.appendChild(div);
    });
}

function showStatsDetail(index) {
    const entry = AppState.history[index];
    if (!entry) return;
    
    elements.modalTitle.textContent = `📊 Детали попытки ${entry.date}`;
    
    const timeStr = entry.timerMode ? 
        `${Math.floor(entry.timeSpent / 60)}м ${entry.timeSpent % 60}с` : 
        'Таймер не использовался';
    
    let weakListHtml = '';
    if (entry.weakQuestions && entry.weakQuestions.length > 0) {
        weakListHtml = `
            <div style="margin-top:15px;">
                <strong style="color:#c2a03a;">🔄 Вопросы с частичным ответом (${entry.weakQuestions.length}):</strong>
                <div class="modal-weak-list">
                    ${entry.weakQuestions.map((q, i) => 
                        `<div class="modal-weak-item">${i+1}. ${q.question}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    elements.modalBody.innerHTML = `
        <div class="modal-stat-item">
            <span class="label">✅ Правильных</span>
            <span class="value correct">${entry.correct}</span>
        </div>
        <div class="modal-stat-item">
            <span class="label">🔄 Частичных</span>
            <span class="value repeat">${entry.repeat || 0}</span>
        </div>
        <div class="modal-stat-item">
            <span class="label">❌ Неправильных</span>
            <span class="value wrong">${entry.wrong}</span>
        </div>
        <div class="modal-stat-item">
            <span class="label">📊 Всего вопросов</span>
            <span class="value">${entry.total}</span>
        </div>
        <div class="modal-stat-item">
            <span class="label">⏱️ Время</span>
            <span class="value">${timeStr}</span>
        </div>
        ${entry.timeoutTriggered ? `
        <div class="modal-stat-item" style="border-color:#8a3a3a;">
            <span class="label">⚠️ Статус</span>
            <span class="value" style="color:#ff6b6b;">Время вышло!</span>
        </div>
        ` : ''}
        ${weakListHtml}
    `;
    
    elements.statsDetailModal.style.display = 'flex';
}

function closeModal() {
    elements.statsDetailModal.style.display = 'none';
}

// ===== НАВИГАЦИЯ =====

function goToSubtopics() {
    if (AppState.currentTopic) {
        showScreen('subtopics');
        renderSubtopics();
    } else {
        goHome();
    }
}

function goHome() {
    showScreen('home');
    renderTopicCards();
}

function showScreen(screenName) {
    const screens = {
        home: elements.homeScreen,
        subtopics: elements.subtopicsScreen,
        timerSettings: elements.timerSettingsScreen,
        test: elements.testScreen,
        result: elements.resultScreen,
        stats: elements.statsScreen
    };
    
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem('anki_history');
        AppState.history = raw ? JSON.parse(raw) : [];
    } catch {
        AppState.history = [];
    }
}

function saveHistory() {
    try {
        localStorage.setItem('anki_history', JSON.stringify(AppState.history));
    } catch {}
}