/* Version 1.2.6 | Author: @yarikbes (https://www.linkedin.com/in/yaroslav-rudyi/) with Gemini */
(function () {
    // Отображаем начальное сообщение для подтверждения запуска букмарклета
    alert('Букмарклет PolyCheck запущен');

    // Глоссарий iGaming для обнаружения терминов, связанных с iGaming
    const igamingWords = [
        'casino bonus', 'jackpot', 'cashback', 'no deposit bonus', 'withdrawal', 'balance', 'live',
        'vip', 'account', 'bet', 'spin', 'mobile', 'bonus code', 'promo code', 'free spins', 'rakeback',
        'reload bonus', 'welcome package', 'wagering requirements', 'minimum deposit', 'bonus funds',
        'bonus percentage', 'bonus terms', 'bonus validity', 'matched deposit', 'matched reward',
        'tailored offer', 'activate bonus', 'claim bonus', 'exclusive promotion', 'valid promo code',
        'private event', 'highroller', 'cash out', 'registration bonus', 'promotions', 'wagering requirements',
        'rtp', 'return to player', 'payout'
    ];
    const igamingWordsLower = igamingWords.map(w => w.toLowerCase()); // Для регистронезависимого сравнения

    // Орфографические маркеры для вариантов языка
    const orthoMarkers = {
        'en-US': ['favorite', 'color', 'center', 'organize', 'analyze', 'license', 'program', 'catalog'],
        'en-GB': ['favourite', 'colour', 'centre', 'organise', 'analyse', 'licence', 'programme', 'catalogue'],
        'pt-PT': ['prémio', 'levantamento', 'apoio ao cliente', 'reembolso'],
        'pt-BR': ['prêmio', 'saque', 'atendimento ao cliente'],
        'es-ES': ['máquina tragamonedas', 'dinero', 'trabajo', 'hola'],
        'es-AR': ['tragamonedas', 'guita', 'laburo', 'che', 'boludo'],
        'de-DE': ['spielautomat', 'lizenz', 'glücksspielstaatsvertrag'],
        'de-AT/CH': ['glücksspielautomat', 'konzession', 'glücksspielgesetz', 'geldspielgesetz'],
        'fr-FR': ['mise', 'retrait', 'joueur'],
        'fr-CA': ['pari', 'encaissement', 'joueuse'],
        'sv-SE': ['spel', 'insättning', 'uttag', 'vinst'],
        'nl-NL': ['gokken', 'inzet', 'uitbetaling']
    };

    // Словарные маркеры для специфической лексики iGaming по языкам
    const wordMarkers = {
        'en-US': ['wager', 'cashout', 'reels', 'multiplier', 'wagering requirement', 'rtp'],
        'en-GB': ['stake', 'payline', 'punt', 'punter', 'return to player'],
        'pt-PT': ['slot machine', 'caça-níquel', 'jogos de sorte', 'giros grátis', 'saldo', 'levantamento mínimo'],
        'pt-BR': ['cassino', 'jogos de azar', 'aposta mínima', 'giros grátis', 'saldo'],
        'es-ES': ['bote', 'tiradas gratis', 'retiro', 'servicio de atención al cliente', 'apuesta mínima', 'juego de mesa', 'crupier', 'tragaperras'],
        'es-AR': ['pozo', 'giros gratis', 'extracción', 'cobro', 'saque', 'retirar', 'apuestas deportivas'],
        'de-DE': ['einsatz', 'auszahlung', 'freispiele', 'wettquote', 'mindesteinsatz', 'spielregeln', 'bonusspiel'],
        'de-AT/CH': ['einsatzgrenze', 'auszahlungen', 'wette', 'wettanbieter', 'spielregeln', 'bonusspiel'],
        'sv-SE': ['spelautomater', 'insättning', 'uttag', 'vinster', 'jackpott', 'kampanjer', 'betalningsmetoder'],
        'nl-NL': ['gokkasten', 'welkomstbonus', 'gratis spins', 'uitbetaling', 'storting', 'klantenservice', 'mobiel casino', 'betalningsmethoden'],
        'fr-FR': ['mise', 'retrait', 'joueur', 'pari'],
        'fr-CA': ['pari', 'encaissement', 'joueuse', 'mise', 'gain']
    };

    // Разрешенные слова с дефисом (не считаются опечатками)
    const hyphenatedWords = [
        'free-spins', 'high-rollers', 'non-sticky', 'live-dealer', 'e-sports', 'real-time', 'in-play',
        'pre-match', 'live-streaming', 'multi-bets', 'single-bets', 'match-winner', 'first-tower',
        'dragon-slay', 'bonus-crab', 'event-based', 'user-friendly', 'real-money', 'mobile-optimized',
        'top-tier', 'high-volatility', 'live-betting', 'fast-paced', 'must-try', 'high-end', 'must-play',
        'time-limited', 'high-stakes', 'stand-alone', 'non-stop', 'blockbuster'
    ].map(w => w.toLowerCase()); // Для регистронезависимого сравнения

    // Маркеры валют для языковых вариантов (ожидаемая валюта для каждого языка)
    const currencyMarkers = {
        'en-GB': 'GBP', 'en-US': 'USD', 'pt-PT': 'EUR', 'pt-BR': 'BRL',
        'es-ES': 'EUR', 'es-AR': 'ARS', 'de-DE': 'EUR', 'de-AT/CH': 'EUR',
        'fr-FR': 'EUR', 'fr-CA': 'CAD', 'sv-SE': 'SEK', 'nl-NL': 'EUR'
    };

    /**
     * Экранирует специальные символы в строке для использования в RegExp.
     * @param {string} str - Исходная строка.
     * @returns {string} Экранированная строка.
     */
    function escapeRegExp(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    /**
     * Получает текст из буфера обмена или через prompt.
     * @returns {Promise<string>} Текст для анализа.
     */
    async function getText() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                return text;
            }
            alert('Буфер обмена пуст. Выделите текст, скопируйте его (Ctrl+C или Cmd+C) и запустите букмарклет снова.');
            return '';
        } catch (e) {
            console.warn('Не удалось прочитать буфер обмена:', e);
            const text = prompt('Не удалось прочитать буфер обмена. Пожалуйста, вставьте текст сюда (Ctrl+V или Cmd+V):', '');
            if (text && text.trim()) {
                return text;
            }
            alert('Текст не был введён. Попробуйте снова.');
            return '';
        }
    }

    /**
     * Анализирует текст на различные SEO и редакционные параметры.
     * @param {string} text - Текст для анализа.
     * @returns {object} Объект с результатами анализа.
     */
    function analyzeText(text) {
        const analysisResults = {
            wordMarkerStats: { counts: {}, words: {} }, // Для wordMarkers
            orthoMarkerStats: { counts: {}, words: {} }, // Для orthoMarkers
            isIGamingText: false,
            duplicateWords: [],
            duplicateSentences: new Set(), // Используем Set для автоматической уникальности предложений
            potentialTypos: new Set(),    // Используем Set для автоматической уникальности опечаток
            hasEnDash: false,
            foundCurrencies: {},       // Объект для подсчета каждой валюты { "USD": 2, "EUR": 1 }
            currencyReportStrings: []  // Массив строк для отчета по валютам
        };

        const textWords = text.split(/\s+/); // Разбиваем текст на слова один раз

        // 1. Проверка на наличие общих iGaming-терминов
        analysisResults.isIGamingText = igamingWords.some(term => {
            const regex = new RegExp('\\b' + escapeRegExp(term) + '\\b', 'gi');
            return regex.test(text);
        });

        // 2. Анализ специфической iGaming-лексики по языкам (wordMarkers)
        for (const lang in wordMarkers) {
            analysisResults.wordMarkerStats.counts[lang] = 0;
            analysisResults.wordMarkerStats.words[lang] = [];
            wordMarkers[lang].forEach(marker => {
                const regex = new RegExp('\\b' + escapeRegExp(marker) + '\\b', 'gi');
                const matches = text.match(regex);
                if (matches) {
                    // Условие: добавляем маркер, если (текст НЕ iGaming) ИЛИ (это iGaming текст, НО маркер НЕ из общего списка igamingWords)
                    // Это помогает выявить использование специфичной лексики другого ГЕО, даже если текст в целом об iGaming.
                    if (!analysisResults.isIGamingText || !igamingWordsLower.includes(marker.toLowerCase())) {
                        analysisResults.wordMarkerStats.counts[lang] += matches.length;
                        analysisResults.wordMarkerStats.words[lang].push(`${marker} (${matches.length})`);
                    }
                }
            });
        }

        // 3. Анализ орфографических маркеров по языкам
        for (const lang in orthoMarkers) {
            analysisResults.orthoMarkerStats.counts[lang] = 0;
            analysisResults.orthoMarkerStats.words[lang] = [];
            orthoMarkers[lang].forEach(marker => {
                const regex = new RegExp('\\b' + escapeRegExp(marker) + '\\b', 'gi');
                const matches = text.match(regex);
                if (matches) {
                    analysisResults.orthoMarkerStats.counts[lang] += matches.length;
                    analysisResults.orthoMarkerStats.words[lang].push(`${marker} (${matches.length})`);
                }
            });
        }

        // 4. Обнаружение дублирующихся слов, стоящих рядом
        for (let i = 0; i < textWords.length - 1; i++) {
            // Приводим к нижнему регистру и удаляем основную пунктуацию в конце для сравнения
            const currentWord = textWords[i].toLowerCase().replace(/[.,;:!?]$/, "");
            const nextWord = textWords[i + 1].toLowerCase().replace(/[.,;:!?]$/, "");
            if (currentWord && currentWord === nextWord && currentWord.length > 2) { // Длина больше 2 для уменьшения ложных срабатываний (например, "а а")
                const duplicatePair = `${textWords[i]} ${textWords[i + 1]}`;
                if (!analysisResults.duplicateWords.includes(duplicatePair)) { // Проверяем, чтобы не добавлять одну и ту же пару много раз
                    analysisResults.duplicateWords.push(duplicatePair);
                }
            }
        }

        // 5. Обнаружение дублирующихся предложений
        const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 10); // Фильтруем короткие предложения
        const sentenceCounts = {};
        sentences.forEach(sentence => {
            sentenceCounts[sentence] = (sentenceCounts[sentence] || 0) + 1;
        });
        for (const sentence in sentenceCounts) {
            if (sentenceCounts[sentence] > 1) {
                // Пытаемся найти первое вхождение предложения в оригинальном тексте для сохранения регистра, если это важно
                const originalSentenceRegex = new RegExp(escapeRegExp(sentence), 'i'); // Поиск без учета регистра
                const originalSentenceMatch = text.match(originalSentenceRegex);
                analysisResults.duplicateSentences.add(originalSentenceMatch ? originalSentenceMatch[0] : sentence);
            }
        }
        
        // 6. Обнаружение потенциальных опечаток
        textWords.forEach((word, index) => {
            const cleanedWord = word.replace(/[.,;:!?]$/, ""); // Убираем пунктуацию на конце для проверок

            // Проверка на спецсимволы (#, @, $), не являющиеся частью email или хештега
            if (/[#@$]/.test(cleanedWord)) {
                if (!cleanedWord.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && !cleanedWord.startsWith('#')) {
                    analysisResults.potentialTypos.add(word);
                }
            }

            // Проверка на проблемы с дефисами
            if (/-/.test(word)) {
                const lowerWord = word.toLowerCase();
                if (!hyphenatedWords.includes(lowerWord)) {
                    // Опечатки типа "слово- слово", "слово -слово", "-слово", "слово-"
                    if (word.match(/^-\S|\S-$/) || word.includes(' -') || word.includes('- ')) {
                         // Дополнительная проверка, чтобы не пометить слова типа "high-end" если они есть в hyphenatedWords
                        if (!hyphenatedWords.includes(lowerWord.replace(/\s*-\s*/, '-'))) {
                           analysisResults.potentialTypos.add(word);
                        }
                    }
                    // Пример: "Бонус№ это" - здесь № не окружен пробелами и не является частью слова
                    // Это более сложный случай, текущая логика может его не поймать.
                    // Можно добавить проверку на неалфавитно-цифровые символы внутри слова, если они не дефис
                }
            }
            // Проверка на "Бонус№ это" - символ № прилип к слову
            // \w соответствует букве, цифре или _, [^-\s\w] - не дефис, не пробел, не \w
            const typoPattern = /(\w+)([^-\s\w,.!?;:'"]+)(\w+)?|(\w+)([^-\s\w,.!?;:'"]+)\s|[^-\s\w,.!?;:'"]+(\w+)/;
            if (typoPattern.test(word) && !hyphenatedWords.includes(word.toLowerCase())) {
                 // Проверяем, не является ли это разрешенным словом с дефисом или email/URL
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(word) && !word.startsWith('http')) {
                    analysisResults.potentialTypos.add(word);
                }
            }
        });

        // 7. Проверка на наличие короткого тире (en dash)
        analysisResults.hasEnDash = /–/g.test(text);

        // 8. Анализ валют в тексте
        const uniqueExpectedCurrencyCodes = [...new Set(Object.values(currencyMarkers))];
        uniqueExpectedCurrencyCodes.forEach(currencyCode => {
            // \p{Sc} - Unicode свойство для символов валют
            // Ищем: "USD 100", "100 USD", "$100", "100$" (и аналоги для других валют)
            // Добавляем поддержку символов валют перед или после числа
            const regex = new RegExp(
                `(\\b${currencyCode}\\b(?:\\s*\\d+(?:[.,]\\d+)?)?|\\d+(?:[.,]\\d+)?\\s*\\b${currencyCode}\\b|` + // Код валюты
                `\\p{Sc}\\s*\\d+(?:[.,]\\d+)?|\\d+(?:[.,]\\d+)?\\s*\\p{Sc})`, // Символ валюты
                'gu'
            );
            const matches = text.match(regex) || [];
            
            let countForThisCode = 0;
            const matchedStringsForReport = [];

            matches.forEach(match => {
                // Уточняем, действительно ли найденный символ/код относится к текущему currencyCode
                let belongsToCurrentCode = false;
                const matchLower = match.toLowerCase();
                const codeLower = currencyCode.toLowerCase();

                if (matchLower.includes(codeLower)) {
                    belongsToCurrentCode = true;
                } else {
                    // Проверка символов
                    if (currencyCode === 'GBP' && match.includes('£')) belongsToCurrentCode = true;
                    else if (currencyCode === 'USD' && match.includes('$')) belongsToCurrentCode = true;
                    else if (currencyCode === 'EUR' && match.includes('€')) belongsToCurrentCode = true;
                    else if (currencyCode === 'BRL' && match.toLowerCase().includes('r$')) belongsToCurrentCode = true;
                    else if (currencyCode === 'CAD' && match.includes('$')) { /* Может конфликтовать с USD, нужна доп. логика или контекст */ }
                    else if (currencyCode === 'ARS' && match.includes('$')) { /* Может конфликтовать с USD, нужна доп. логика или контекст */ }
                    // Для SEK и других валют со специфичными символами, не покрытыми \p{Sc} или требующими уточнения
                }

                if (belongsToCurrentCode) {
                    countForThisCode++;
                    if (matchedStringsForReport.length < 5) { // Ограничиваем количество примеров
                         matchedStringsForReport.push(match);
                    }
                }
            });


            if (countForThisCode > 0) {
                analysisResults.foundCurrencies[currencyCode] = (analysisResults.foundCurrencies[currencyCode] || 0) + countForThisCode;
                let reportStr = `${currencyCode}: ${countForThisCode}`;
                if (matchedStringsForReport.length > 0) {
                    reportStr += ` (примеры: ${matchedStringsForReport.join(', ')}${countForThisCode > matchedStringsForReport.length ? ', ...' : ''})`;
                }
                analysisResults.currencyReportStrings.push(reportStr);
            }
        });


        // Преобразуем Set в массив для возврата
        analysisResults.duplicateSentences = Array.from(analysisResults.duplicateSentences);
        analysisResults.potentialTypos = Array.from(analysisResults.potentialTypos);

        return analysisResults;
    }

    /**
     * Определяет предполагаемый язык текста на основе орфографических маркеров.
     * @param {object} orthoStats - Статистика по орфографическим маркерам из analyzeText.
     * @returns {object} Объект с определенным языком { language: 'en-US' | 'Смешанный' | 'Не определён' }.
     */
    function guessLanguage(orthoStats) {
        let maxCount = 0;
        let guessedLanguage = 'Не определён';
        let multipleMatches = false;

        for (const lang in orthoStats.counts) {
            if (orthoStats.counts[lang] > maxCount) {
                maxCount = orthoStats.counts[lang];
                guessedLanguage = lang;
                multipleMatches = false;
            } else if (orthoStats.counts[lang] === maxCount && maxCount > 0) {
                multipleMatches = true;
            }
        }

        if (multipleMatches) {
            return { language: 'Смешанный' };
        }
        return { language: guessedLanguage };
    }

    /**
     * Отображает результаты анализа во всплывающем окне.
     * @param {object} guessedLangData - Данные об определенном языке.
     * @param {object} analysisData - Полные данные анализа текста.
     */
    function showPopup(guessedLangData, analysisData) {
        let existingPopup = document.getElementById('polycheck-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'polycheck-popup';
        popup.style.cssText = `
            all: initial; position: fixed; top: 10%; right: 20px; width: 420px; max-width: 90%;
            background: #fff; color: #333; border: 1px solid #ccc; border-radius: 8px;
            padding: 20px; z-index: 2147483647; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px; line-height: 1.6; display: flex; flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'font-size: 18px; font-weight: bold; color: #005a9e; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; text-align: center;';
        header.innerHTML = 'PolyCheck <span style="font-size: 12px; font-weight: normal; color: #777;">v1.2.6</span>';
        popup.appendChild(header);

        const content = document.createElement('div');
        content.style.cssText = 'max-height: 60vh; overflow-y: auto; padding-right: 10px; margin-bottom:15px;';

        const resultLines = [];

        resultLines.push(`<strong>Результат анализа:</strong>`);
        resultLines.push(`Определенный вариант языка: <span style="background-color: #e6f3fa; padding: 2px 5px; border-radius: 3px;">${guessedLangData.language}</span>`);
        if (guessedLangData.language === 'Не определён' || guessedLangData.language === 'Смешанный') {
             resultLines.push(`<em>(Определение по орфографическим маркерам. Если результат неточен, проверьте наличие специфических слов ниже.)</em>`);
        }


        // Орфографический анализ
        const orthoHits = Object.keys(analysisData.orthoMarkerStats.counts).filter(lang => analysisData.orthoMarkerStats.counts[lang] > 0);
        if (orthoHits.length > 0) {
            resultLines.push("<br><strong>Орфография (по языкам):</strong>");
            orthoHits.forEach(lang => {
                resultLines.push(`&nbsp;&nbsp;&nbsp;<strong>${lang}:</strong> ${analysisData.orthoMarkerStats.counts[lang]} слов(а) (${analysisData.orthoMarkerStats.words[lang].join(', ')})`);
            });
        }

        // Предложения по iGaming-лексике (показываем слова из ДРУГИХ ГЕО)
        resultLines.push("<br><strong>Анализ iGaming-лексики (возможные несоответствия ГЕО):</strong>");
        let geoMismatchFound = false;
        const targetLangWordMarkers = wordMarkers[guessedLangData.language] ? wordMarkers[guessedLangData.language].map(w => w.toLowerCase()) : [];
        
        for (const lang in analysisData.wordMarkerStats.counts) {
            if (analysisData.wordMarkerStats.counts[lang] > 0 && lang !== guessedLangData.language) {
                // Фильтруем слова, чтобы показать только те, которые не являются стандартными для целевого языка
                const problematicWords = analysisData.wordMarkerStats.words[lang].filter(wordWithCount => {
                    const baseWord = wordWithCount.match(/^(.*?)(?= \(\d+\)$)/)[0].toLowerCase();
                    return !targetLangWordMarkers.includes(baseWord);
                });

                if (problematicWords.length > 0) {
                    resultLines.push(`&nbsp;&nbsp;&nbsp;Обнаружены слова, характерные для <strong>${lang}</strong> (но не для ${guessedLangData.language}): ${problematicWords.length} (${problematicWords.join(', ')})`);
                    geoMismatchFound = true;
                }
            }
        }
        if (!geoMismatchFound && guessedLangData.language !== 'Не определён' && guessedLangData.language !== 'Смешанный') {
            resultLines.push(`&nbsp;&nbsp;&nbsp;<em>Специфическая iGaming-лексика других ГЕО не обнаружена или совпадает с общей/целевой.</em>`);
        } else if (guessedLangData.language === 'Не определён' || guessedLangData.language === 'Смешанный') {
             resultLines.push(`&nbsp;&nbsp;&nbsp;<em>Язык не определен однозначно, проверьте все найденные маркеры.</em>`);
        }


        // Дубликаты слов
        if (analysisData.duplicateWords.length > 0) {
            resultLines.push("<br><strong>Повторяющиеся слова (рядом):</strong>");
            analysisData.duplicateWords.forEach(dup => resultLines.push(`&nbsp;&nbsp;&nbsp;${dup}`));
        }

        // Дубликаты предложений
        if (analysisData.duplicateSentences.length > 0) {
            resultLines.push("<br><strong>Повторяющиеся предложения:</strong>");
            analysisData.duplicateSentences.forEach(dup => resultLines.push(`&nbsp;&nbsp;&nbsp;<em>"${dup}"</em>`));
        }

        // Потенциальные опечатки
        if (analysisData.potentialTypos.length > 0) {
            resultLines.push("<br><strong>Потенциальные опечатки:</strong>");
            analysisData.potentialTypos.forEach(typo => resultLines.push(`&nbsp;&nbsp;&nbsp;${typo}`));
        }

        // Короткое тире
        if (analysisData.hasEnDash) {
            resultLines.push("<br><strong>Обнаружено короткое тире (–):</strong> Рекомендуется заменить на длинное тире (—) или дефис с пробелами в зависимости от контекста.");
        }

        // Анализ валют
        if (analysisData.currencyReportStrings.length > 0) {
            resultLines.push("<br><strong>Валюты в тексте:</strong>");
            analysisData.currencyReportStrings.forEach(currencyStr => resultLines.push(`&nbsp;&nbsp;&nbsp;${currencyStr}`));
            
            const expectedCurrency = currencyMarkers[guessedLangData.language];
            if (expectedCurrency) {
                const foundCurrencyCodes = Object.keys(analysisData.foundCurrencies);
                if (!foundCurrencyCodes.includes(expectedCurrency) && foundCurrencyCodes.length > 0) {
                     resultLines.push(`&nbsp;&nbsp;&nbsp;<strong style="color:orange;">Внимание:</strong> Ожидаемая валюта для ${guessedLangData.language} (${expectedCurrency}) не найдена, но есть другие: ${foundCurrencyCodes.join(', ')}.`);
                } else {
                    const otherCurrencies = foundCurrencyCodes.filter(c => c !== expectedCurrency && analysisData.foundCurrencies[c] > 0);
                    if (otherCurrencies.length > 0) {
                        resultLines.push(`&nbsp;&nbsp;&nbsp;<strong style="color:orange;">Несоответствие валют:</strong> Для ${guessedLangData.language} ожидается ${expectedCurrency}, но также найдены: ${otherCurrencies.join(', ')}.`);
                    }
                }
            } else if (guessedLangData.language !== 'Не определён' && guessedLangData.language !== 'Смешанный') {
                 resultLines.push(`&nbsp;&nbsp;&nbsp;<em>Для языка ${guessedLangData.language} не задана ожидаемая валюта в настройках букмарклета.</em>`);
            }
        }


        resultLines.forEach(line => {
            const div = document.createElement('div');
            div.style.padding = '3px 0';
            // Улучшенная обработка кликабельных слов
            const clickableWordRegex = /([a-zA-Zа-яА-ЯёЁ0-9@$._'-]+(?: [a-zA-Zа-яА-ЯёЁ0-9@$._'-]+)* \(\d+\))/g; // Расширяем символы в слове
            
            let currentHTML = line;
            if (line.includes('(') && line.includes(')')) { // Только если есть скобки, потенциально с числом
                 currentHTML = line.replace(clickableWordRegex, (match) => {
                    const wordOnlyMatch = match.match(/^(.*?)(?= \(\d+\)$)/);
                    if (wordOnlyMatch && wordOnlyMatch[1]) {
                        const wordToCopy = wordOnlyMatch[1];
                        return `<span class="clickable-word" title="Копировать '${wordToCopy}'" data-copy="${escapeHTML(wordToCopy)}">${match}</span>`;
                    }
                    return match; // Если не соответствует шаблону "слово (число)", оставляем как есть
                });
            }
            div.innerHTML = currentHTML;
            content.appendChild(div);
        });
        
        // Добавляем стили для кликабельных слов и обработчик событий
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            .clickable-word { color: #005a9e; cursor: pointer; text-decoration: underline; }
            .clickable-word:hover { color: #003366; }
            .copied-feedback { color: green !important; font-weight: bold; }
        `;
        document.head.appendChild(styleSheet);

        content.addEventListener('click', function(event) {
            if (event.target.classList.contains('clickable-word')) {
                const wordToCopy = event.target.dataset.copy;
                navigator.clipboard.writeText(wordToCopy).then(() => {
                    const originalText = event.target.textContent;
                    event.target.textContent = 'Скопировано!';
                    event.target.classList.add('copied-feedback');
                    setTimeout(() => {
                        event.target.textContent = originalText;
                        event.target.classList.remove('copied-feedback');
                    }, 1500);
                }).catch(err => {
                    console.warn('Не удалось скопировать слово:', err);
                    // Можно добавить уведомление об ошибке копирования, если нужно
                });
            }
        });


        popup.appendChild(content);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; padding-top: 15px; border-top: 1px solid #eee;';

        const copyAllButton = document.createElement('button');
        copyAllButton.textContent = 'Копировать отчёт';
        copyAllButton.style.cssText = 'padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size:13px;';
        copyAllButton.onmouseover = () => copyAllButton.style.backgroundColor = '#45a049';
        copyAllButton.onmouseout = () => copyAllButton.style.backgroundColor = '#4CAF50';
        copyAllButton.onclick = () => {
            const reportText = resultLines.map(line => line.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')).join('\n');
            navigator.clipboard.writeText(reportText).then(() => {
                copyAllButton.textContent = 'Отчёт скопирован!';
                setTimeout(() => { copyAllButton.textContent = 'Копировать отчёт'; }, 2000);
            });
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.cssText = 'padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size:13px;';
        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#e53935';
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#f44336';
        closeButton.onclick = () => {
            popup.remove();
            if (styleSheet) styleSheet.remove(); // Удаляем добавленные стили
        };
        
        buttonContainer.appendChild(copyAllButton);
        buttonContainer.appendChild(closeButton);
        popup.appendChild(buttonContainer);

        const footer = document.createElement('div');
        footer.style.cssText = 'text-align: right; font-size: 11px; color: #999; margin-top: 10px;';
        footer.innerHTML = 'Powered by <a href="https://www.linkedin.com/in/yaroslav-rudyi/" target="_blank" style="color: #005a9e; text-decoration: none;">@yarikbes</a> & Gemini';
        popup.appendChild(footer);

        document.body.appendChild(popup);
    }
    
    /**
     * Вспомогательная функция для экранирования HTML.
     * @param {string} str - Строка для экранирования.
     * @returns {string} Экранированная строка.
     */
    function escapeHTML(str) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }


    // Основное выполнение букмарклета
    (async () => {
        try {
            const textToAnalyze = await getText();
            if (textToAnalyze) {
                const analysisResults = analyzeText(textToAnalyze);
                const guessedLanguage = guessLanguage(analysisResults.orthoMarkerStats);
                showPopup(guessedLanguage, analysisResults);
            }
        } catch (e) {
            alert('Произошла ошибка в работе букмарклета: ' + e.message);
            console.error("Ошибка букмарклета PolyCheck:", e);
        }
    })();

})();
