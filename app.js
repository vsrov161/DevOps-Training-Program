// Глобальное состояние приложения
const AppState = {
    topics: {},          // Все загруженные темы
    currentTopic: null,  // Текущая выбранная тема
    currentSubtopic: null, // Текущая выбранная подтема
    filteredQuestions: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    isFinished: false,
    cardRevealed: false,
    history: [],
    shuffle: false
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

// DOM элементы
const elements = {};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы
    elements.homeScreen = document.getElementById('homeScreen');
    elements.subtopicsScreen = document.getElementById('subtopicsScreen');
    elements.testScreen = document.getElementById('testScreen');
    elements.resultScreen = document.getElementById('resultScreen');
    elements.statsScreen = document.getElementById('statsScreen');
    
    elements.topicCards = document.getElementById('topicCards');
    elements.subtopicGrid = document.getElementById('subtopicGrid');
    elements.currentTopicTitle = document.getElementById('currentTopicTitle');
    elements.totalQcount = document.getElementById('totalQcount');
    elements.shuffleCheck = document.getElementById('shuffleCheck');
    elements.btnStartQuiz = document.getElementById('btnStartQuiz');
    elements.btnImport = document.getElementById('btnImport');
    elements.btnStats = document.getElementById('btnStats');
    elements.btnBackToHome = document.getElementById('btnBackToHome');
    elements.btnBackToSubtopics = document.getElementById('btnBackToSubtopics');
    elements.btnBackHomeFromStats = document.getElementById('btnBackHomeFromStats');
    elements.btnResultToHome = document.getElementById('btnResultToHome');
    elements.fileInput = document.getElementById('fileInput');
    elements.cardQuestion = document.getElementById('cardQuestion');
    elements.progressBadge = document.getElementById('progressBadge');
    elements.flashContainer = document.getElementById('flashContainer');
    elements.btnKnow = document.getElementById('btnKnow');
    elements.btnNext = document.getElementById('btnNext');
    elements.btnRetry = document.getElementById('btnRetry');
    elements.scoreCorrect = document.getElementById('scoreCorrect');
    elements.scoreWrong = document.getElementById('scoreWrong');
    elements.statsList = document.getElementById('statsList');

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
        this.value = ''; // Сброс
    });

    // Статистика
    elements.btnStats.addEventListener('click', showStats);
    elements.btnBackHomeFromStats.addEventListener('click', goHome);

    // Навигация
    elements.btnBackToHome.addEventListener('click', goHome);
    elements.btnBackToSubtopics.addEventListener('click', goToSubtopics);
    elements.btnResultToHome.addEventListener('click', goHome);

    // Тест
    elements.btnStartQuiz.addEventListener('click', startTest);
    elements.btnKnow.addEventListener('click', handleKnow);
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
    // Загружаем встроенную тему Linux
    if (window.LINUX_ANKI_DB && window.LINUX_ANKI_DB.sections) {
        const linuxTopic = {
            title: window.LINUX_ANKI_DB.title || "Linux Anki",
            icon: window.LINUX_ANKI_DB.icon || "🐧",
            sections: window.LINUX_ANKI_DB.sections,
            isDefault: true
        };
        
        // Сохраняем только если еще нет такой темы
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
        // Сохраняем только импортированные темы (не дефолтные)
        const topicsToSave = {};
        for (const [id, topic] of Object.entries(AppState.topics)) {
            if (!topic.isDefault) {
                topicsToSave[id] = topic;
            }
        }
        localStorage.setItem('anki_topics', JSON.stringify(topicsToSave));
        console.log('Topics saved:', Object.keys(topicsToSave).length);
    } catch (error) {
        console.error('Error saving topics:', error);
    }
}

function loadTopics() {
    try {
        // Загружаем дефолтную тему
        loadDefaultTopic();
        
        // Загружаем сохраненные темы
        const saved = localStorage.getItem('anki_topics');
        if (saved) {
            const topics = JSON.parse(saved);
            for (const [id, topic] of Object.entries(topics)) {
                // Проверяем, что тема имеет правильную структуру
                if (topic.title && topic.sections) {
                    AppState.topics[id] = topic;
                }
            }
            console.log('Topics loaded from localStorage:', Object.keys(topics).length);
        }
        
        renderTopicCards();
    } catch (error) {
        console.error('Error loading topics:', error);
        renderTopicCards();
    }
}

function importTopic(data) {
    // Проверяем формат
    if (!data.title || !data.sections || typeof data.sections !== 'object') {
        alert('Неверный формат файла. Требуется: { "title": "...", "sections": {...} }');
        return;
    }
    
    // Генерируем уникальный ID
    const id = 'topic_' + Date.now();
    AppState.topics[id] = {
        title: data.title,
        icon: data.icon || '📚',
        sections: data.sections,
        isDefault: false
    };
    
    // Сохраняем в localStorage
    saveTopics();
    renderTopicCards();
    alert(`✅ Тема "${data.title}" успешно импортирована и сохранена!`);
}

function deleteTopic(topicId) {
    // Проверяем, можно ли удалить
    const topic = AppState.topics[topicId];
    if (!topic) return;
    
    // Не даем удалить дефолтную тему Linux
    if (topic.isDefault) {
        alert('❌ Нельзя удалить встроенную тему Linux Anki!');
        return;
    }
    
    // Подтверждение удаления
    if (!confirm(`Удалить тему "${topic.title}"?`)) {
        return;
    }
    
    // Удаляем тему
    delete AppState.topics[topicId];
    
    // Сохраняем изменения
    saveTopics();
    
    // Если удалили текущую тему, сбрасываем
    if (AppState.currentTopic && !AppState.topics[Object.keys(AppState.topics).find(id => AppState.topics[id] === AppState.currentTopic)]) {
        AppState.currentTopic = null;
    }
    
    renderTopicCards();
    
    // Если нет тем, показываем сообщение
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
        
        // Клик по карточке (кроме кнопки удаления)
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-topic-btn')) return;
            selectTopic(id);
        });
        
        // Обработчик для кнопки удаления
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
    
    // Кнопка "Выбрать все"
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
    elements.btnStartQuiz.disabled = checked.length === 0;
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

function startTest() {
    const pool = buildQuestionPool();
    if (pool.length === 0) return;
    
    AppState.filteredQuestions = pool;
    AppState.currentIndex = 0;
    AppState.correctCount = 0;
    AppState.wrongCount = 0;
    AppState.isFinished = false;
    AppState.cardRevealed = false;
    
    showScreen('test');
    elements.btnKnow.disabled = false;
    elements.btnNext.style.display = 'none';
    elements.cardQuestion.className = 'anki-card';
    elements.flashContainer.innerHTML = '';
    
    renderCard();
}

function renderCard() {
    if (AppState.currentIndex >= AppState.filteredQuestions.length) {
        finishTest();
        return;
    }
    
    const item = AppState.filteredQuestions[AppState.currentIndex];
    const cardContent = elements.cardQuestion.querySelector('.card-content');
    cardContent.textContent = item.q || item.question;
    elements.cardQuestion.className = 'anki-card';
    AppState.cardRevealed = false;
    elements.progressBadge.textContent = `${AppState.currentIndex + 1} / ${AppState.filteredQuestions.length}`;
    elements.btnKnow.disabled = false;
    elements.btnNext.style.display = 'none';
    elements.flashContainer.innerHTML = '';
}

function handleKnow() {
    if (AppState.isFinished || AppState.cardRevealed) return;
    
    AppState.correctCount++;
    elements.cardQuestion.className = 'anki-card green';
    showFlash(WELL_DONE);
    elements.btnKnow.disabled = true;
    AppState.cardRevealed = true;
    elements.btnNext.style.display = 'inline-flex';
}

function handleCardClick() {
    if (AppState.isFinished || AppState.cardRevealed) return;
    
    AppState.wrongCount++;
    AppState.cardRevealed = true;
    elements.cardQuestion.className = 'anki-card orange';
    
    const item = AppState.filteredQuestions[AppState.currentIndex];
    const cardContent = elements.cardQuestion.querySelector('.card-content');
    cardContent.textContent = item.a || item.answer;
    
    showFlash(FAIL_PHRASES);
    elements.btnKnow.disabled = true;
    elements.btnNext.style.display = 'inline-flex';
}

function handleNext() {
    if (AppState.isFinished) return;
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

function finishTest() {
    AppState.isFinished = true;
    showScreen('result');
    elements.scoreCorrect.textContent = AppState.correctCount;
    elements.scoreWrong.textContent = AppState.wrongCount;
    
    const entry = {
        date: new Date().toLocaleString(),
        correct: AppState.correctCount,
        wrong: AppState.wrongCount,
        total: AppState.correctCount + AppState.wrongCount,
        topic: AppState.currentTopic ? AppState.currentTopic.title : 'Unknown'
    };
    AppState.history.push(entry);
    saveHistory();
}

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
    reversed.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'stat-card';
        div.innerHTML = `
            <div class="stat-date">${entry.date}</div>
            <div class="stat-score">${entry.correct} / ${entry.total}</div>
            <div class="stat-detail">✅ ${entry.correct} · ❌ ${entry.wrong} · ${entry.topic || ''}</div>
        `;
        container.appendChild(div);
    });
}

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