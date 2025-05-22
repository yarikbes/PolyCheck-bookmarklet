/* Version 1.2.7 | Author: @yarikbes (https://www.linkedin.com/in/yaroslav-rudyi/) with Gemini */
/* Attempts to fix Trusted Types issue in Google Docs by refactoring showPopup */
(function () {
    alert('Букмарклет PolyCheck запущен');

    const igamingWords = ["casino bonus", "jackpot", "cashback", "no deposit bonus", "withdrawal", "balance", "live", "vip", "account", "bet", "spin", "mobile", "bonus code", "promo code", "free spins", "rakeback", "reload bonus", "welcome package", "wagering requirements", "minimum deposit", "bonus funds", "bonus percentage", "bonus terms", "bonus validity", "matched deposit", "matched reward", "tailored offer", "activate bonus", "claim bonus", "exclusive promotion", "valid promo code", "private event", "highroller", "cash out", "registration bonus", "promotions", "wagering requirements", "rtp", "return to player", "payout"];
    const igamingWordsLower = igamingWords.map(w => w.toLowerCase());
    const orthoMarkers = { "en-US": ["favorite", "color", "center", "organize", "analyze", "license", "program", "catalog"], "en-GB": ["favourite", "colour", "centre", "organise", "analyse", "licence", "programme", "catalogue"], "pt-PT": ["prémio", "levantamento", "apoio ao cliente", "reembolso"], "pt-BR": ["prêmio", "saque", "atendimento ao cliente"], "es-ES": ["máquina tragamonedas", "dinero", "trabajo", "hola"], "es-AR": ["tragamonedas", "guita", "laburo", "che", "boludo"], "de-DE": ["spielautomat", "lizenz", "glücksspielstaatsvertrag"], "de-AT/CH": ["glücksspielautomat", "konzession", "glücksspielgesetz", "geldspielgesetz"], "fr-FR": ["mise", "retrait", "joueur"], "fr-CA": ["pari", "encaissement", "joueuse"], "sv-SE": ["spel", "insättning", "uttag", "vinst"], "nl-NL": ["gokken", "inzet", "uitbetaling"] };
    const wordMarkers = { "en-US": ["wager", "cashout", "reels", "multiplier", "wagering requirement", "rtp"], "en-GB": ["stake", "payline", "punt", "punter", "return to player"], "pt-PT": ["slot machine", "caça-níquel", "jogos de sorte", "giros grátis", "saldo", "levantamento mínimo"], "pt-BR": ["cassino", "jogos de azar", "aposta mínima", "giros grátis", "saldo"], "es-ES": ["bote", "tiradas gratis", "retiro", "servicio de atención al cliente", "apuesta mínima", "juego de mesa", "crupier", "tragaperras"], "es-AR": ["pozo", "giros gratis", "extracción", "cobro", "saque", "retirar", "apuestas deportivas"], "de-DE": ["einsatz", "auszahlung", "freispiele", "wettquote", "mindesteinsatz", "spielregeln", "bonusspiel"], "de-AT/CH": ["einsatzgrenze", "auszahlungen", "wette", "wettanbieter", "spielregeln", "bonusspiel"], "sv-SE": ["spelautomater", "insättning", "uttag", "vinster", "jackpott", "kampanjer", "betalningsmetoder"], "nl-NL": ["gokkasten", "welkomstbonus", "gratis spins", "uitbetaling", "storting", "klantenservice", "mobiel casino", "betalningsmethoden"], "fr-FR": ["mise", "retrait", "joueur", "pari"], "fr-CA": ["pari", "encaissement", "joueuse", "mise", "gain"] };
    const hyphenatedWords = ["free-spins", "high-rollers", "non-sticky", "live-dealer", "e-sports", "real-time", "in-play", "pre-match", "live-streaming", "multi-bets", "single-bets", "match-winner", "first-tower", "dragon-slay", "bonus-crab", "event-based", "user-friendly", "real-money", "mobile-optimized", "top-tier", "high-volatility", "live-betting", "fast-paced", "must-try", "high-end", "must-play", "time-limited", "high-stakes", "stand-alone", "non-stop", "blockbuster"].map(w => w.toLowerCase());
    const currencyMarkers = { "en-GB": "GBP", "en-US": "USD", "pt-PT": "EUR", "pt-BR": "BRL", "es-ES": "EUR", "es-AR": "ARS", "de-DE": "EUR", "de-AT/CH": "EUR", "fr-FR": "EUR", "fr-CA": "CAD", "sv-SE": "SEK", "nl-NL": "EUR" };

    function escapeRegExp(str) { return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") }
    
    async function getText() {
        try {
            // Попытка получить выделенный текст напрямую из Google Docs (может не сработать из-за iframe/CSP)
            let gDocsText = '';
            try {
                const iframe = document.querySelector('.docs-texteventtarget-iframe');
                if (iframe) {
                    const editorDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (editorDoc) {
                        const selection = editorDoc.getSelection();
                        if (selection) {
                            gDocsText = selection.toString().trim();
                        }
                    }
                }
                if (gDocsText) return gDocsText;
            } catch (gdError) {
                console.warn("PolyCheck: Не удалось получить текст напрямую из Google Docs редактора, используется буфер обмена.", gdError);
            }

            const text = await navigator.clipboard.readText();
            if (text && text.trim()) { return text }
            alert("Буфер обмена пуст. Выделите текст, скопируйте его (Ctrl+C или Cmd+C) и запустите букмарклет снова.");
            return ""
        } catch (e) {
            console.warn("PolyCheck: Не удалось прочитать буфер обмена:", e);
            const text = prompt("Не удалось прочитать буфер обмена. Пожалуйста, вставьте текст сюда (Ctrl+V или Cmd+V):", "");
            if (text && text.trim()) { return text }
            alert("Текст не был введён. Попробуйте снова.");
            return ""
        }
    }

    function analyzeText(text) {
        const analysisResults = { wordMarkerStats: { counts: {}, words: {} }, orthoMarkerStats: { counts: {}, words: {} }, isIGamingText: false, duplicateWords: [], duplicateSentences: new Set, potentialTypos: new Set, hasEnDash: false, foundCurrencies: {}, currencyReportStrings: [] };
        const textWords = text.split(/\s+/);

        // 1. Проверка на наличие общих iGaming-терминов
        analysisResults.isIGamingText = igamingWords.some(term => { const regex = new RegExp("\\b" + escapeRegExp(term) + "\\b", "gi"); return regex.test(text) });
        
        // 2. Анализ специфической iGaming-лексики по языкам (wordMarkers)
        for (const lang in wordMarkers) {
            analysisResults.wordMarkerStats.counts[lang] = 0; analysisResults.wordMarkerStats.words[lang] = [];
            wordMarkers[lang].forEach(marker => {
                const regex = new RegExp("\\b" + escapeRegExp(marker) + "\\b", "gi"); const matches = text.match(regex);
                if (matches) { if (!analysisResults.isIGamingText || !igamingWordsLower.includes(marker.toLowerCase())) { analysisResults.wordMarkerStats.counts[lang] += matches.length; analysisResults.wordMarkerStats.words[lang].push(`${marker} (${matches.length})`) } }
            })
        }

        // 3. Анализ орфографических маркеров по языкам
        for (const lang in orthoMarkers) {
            analysisResults.orthoMarkerStats.counts[lang] = 0; analysisResults.orthoMarkerStats.words[lang] = [];
            orthoMarkers[lang].forEach(marker => {
                const regex = new RegExp("\\b" + escapeRegExp(marker) + "\\b", "gi"); const matches = text.match(regex);
                if (matches) { analysisResults.orthoMarkerStats.counts[lang] += matches.length; analysisResults.orthoMarkerStats.words[lang].push(`${marker} (${matches.length})`) }
            })
        }

        // 4. Обнаружение дублирующихся слов, стоящих рядом
        for (let i = 0; i < textWords.length - 1; i++) {
            const currentWord = textWords[i].toLowerCase().replace(/[.,;:!?]$/, ""); const nextWord = textWords[i + 1].toLowerCase().replace(/[.,;:!?]$/, "");
            if (currentWord && currentWord === nextWord && currentWord.length > 2) { const duplicatePair = `${textWords[i]} ${textWords[i + 1]}`; if (!analysisResults.duplicateWords.includes(duplicatePair)) { analysisResults.duplicateWords.push(duplicatePair) } }
        }

        // 5. Обнаружение дублирующихся предложений
        const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 10); const sentenceCounts = {};
        sentences.forEach(sentence => { sentenceCounts[sentence] = (sentenceCounts[sentence] || 0) + 1 });
        for (const sentence in sentenceCounts) { if (sentenceCounts[sentence] > 1) { const originalSentenceRegex = new RegExp(escapeRegExp(sentence), "i"); const originalSentenceMatch = text.match(originalSentenceRegex); analysisResults.duplicateSentences.add(originalSentenceMatch ? originalSentenceMatch[0] : sentence) } }
        
        // 6. Обнаружение потенциальных опечаток
        textWords.forEach((word) => {
            const cleanedWord = word.replace(/[.,;:!?]$/, "");
            if (/[#@$]/.test(cleanedWord)) { if (!cleanedWord.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && !cleanedWord.startsWith("#")) { analysisResults.potentialTypos.add(word) } }
            if (/-/.test(word)) {
                const lowerWord = word.toLowerCase();
                if (!hyphenatedWords.includes(lowerWord)) { if (word.match(/^-\S|\S-$/) || word.includes(" -") || word.includes("- ")) { if (!hyphenatedWords.includes(lowerWord.replace(/\s*-\s*/, "-"))) { analysisResults.potentialTypos.add(word) } } }
            }
            const typoPattern = /(\w+)([^-\s\w,.!?;:'"]+)(\w+)?|(\w+)([^-\s\w,.!?;:'"]+)\s|[^-\s\w,.!?;:'"]+(\w+)/;
            if (typoPattern.test(word) && !hyphenatedWords.includes(word.toLowerCase())) { if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(word) && !word.startsWith("http")) { analysisResults.potentialTypos.add(word) } }
        });

        // 7. Проверка на наличие короткого тире (en dash)
        analysisResults.hasEnDash = /–/g.test(text);

        // 8. Анализ валют в тексте
        const uniqueExpectedCurrencyCodes = [...new Set(Object.values(currencyMarkers))];
        uniqueExpectedCurrencyCodes.forEach(currencyCode => {
            const regex = new RegExp(`(\\b${currencyCode}\\b(?:\\s*\\d+(?:[.,]\\d+)?)?|\\d+(?:[.,]\\d+)?\\s*\\b${currencyCode}\\b|\\p{Sc}\\s*\\d+(?:[.,]\\d+)?|\\d+(?:[.,]\\d+)?\\s*\\p{Sc})`, "gu");
            const matches = text.match(regex) || []; let countForThisCode = 0; const matchedStringsForReport = [];
            matches.forEach(match => {
                let belongsToCurrentCode = false; const matchLower = match.toLowerCase(); const codeLower = currencyCode.toLowerCase();
                if (matchLower.includes(codeLower)) { belongsToCurrentCode = true } else {
                    if (currencyCode === "GBP" && match.includes("£")) belongsToCurrentCode = true;
                    else if (currencyCode === "USD" && match.includes("$")) belongsToCurrentCode = true;
                    else if (currencyCode === "EUR" && match.includes("€")) belongsToCurrentCode = true;
                    else if (currencyCode === "BRL" && match.toLowerCase().includes("r$")) belongsToCurrentCode = true;
                }
                if (belongsToCurrentCode) { countForThisCode++; if (matchedStringsForReport.length < 5) { matchedStringsForReport.push(match) } }
            });
            if (countForThisCode > 0) {
                analysisResults.foundCurrencies[currencyCode] = (analysisResults.foundCurrencies[currencyCode] || 0) + countForThisCode;
                let reportStr = `${currencyCode}: ${countForThisCode}`;
                if (matchedStringsForReport.length > 0) { reportStr += ` (примеры: ${matchedStringsForReport.join(", ")}${countForThisCode > matchedStringsForReport.length ? ", ..." : ""})` }
                analysisResults.currencyReportStrings.push(reportStr)
            }
        });
        analysisResults.duplicateSentences = Array.from(analysisResults.duplicateSentences);
        analysisResults.potentialTypos = Array.from(analysisResults.potentialTypos);
        return analysisResults
    }

    function guessLanguage(orthoStats) {
        let maxCount = 0; let guessedLanguage = "Не определён"; let multipleMatches = false;
        for (const lang in orthoStats.counts) {
            if (orthoStats.counts[lang] > maxCount) { maxCount = orthoStats.counts[lang]; guessedLanguage = lang; multipleMatches = false }
            else if (orthoStats.counts[lang] === maxCount && maxCount > 0) { multipleMatches = true }
        }
        if (multipleMatches) { return { language: "Смешанный" } }
        return { language: guessedLanguage }
    }

    function escapeHTML(str) { const p = document.createElement("p"); p.appendChild(document.createTextNode(str)); return p.innerHTML }
    
    function showPopup(guessedLangData, analysisData) {
        let existingPopup = document.getElementById("polycheck-popup");
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement("div");
        popup.id = "polycheck-popup";
        popup.style.cssText = "all: initial; position: fixed; top: 10%; right: 20px; width: 420px; max-width: 90%; background: #fff; color: #333; border: 1px solid #ccc; border-radius: 8px; padding: 20px; z-index: 2147483647; box-shadow: 0 8px 16px rgba(0,0,0,0.2); font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; display: flex; flex-direction: column;";
        
        const header = document.createElement("div");
        header.style.cssText = "font-size: 18px; font-weight: bold; color: #005a9e; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; text-align: center;";
        const titleText = document.createTextNode("PolyCheck ");
        const versionSpan = document.createElement("span");
        versionSpan.style.cssText = "font-size: 12px; font-weight: normal; color: #777;";
        versionSpan.textContent = "v1.2.7";
        header.appendChild(titleText);
        header.appendChild(versionSpan);
        popup.appendChild(header);

        const content = document.createElement("div");
        content.style.cssText = "max-height: 60vh; overflow-y: auto; padding-right: 10px; margin-bottom:15px;";

        const resultLinesConfig = [];

        function addLine(htmlContent, isBold = false, isItalic = false, customStyle = "") {
            resultLinesConfig.push({html: htmlContent, bold: isBold, italic: isItalic, style: customStyle});
        }
        function addKeyValueLine(key, value, valueBgColor = null) {
            resultLinesConfig.push({ key: key, value: value, valueBgColor: valueBgColor });
        }
        function addListLine(text, indent = true) {
            resultLinesConfig.push({listText: text, indent: indent});
        }
        function addBreak() {
            resultLinesConfig.push({isBreak: true});
        }

        addKeyValueLine("Результат анализа:", "");
        addKeyValueLine("Определенный вариант языка: ", guessedLangData.language, "#e6f3fa");
        if (guessedLangData.language === "Не определён" || guessedLangData.language === "Смешанный") {
            addLine("(Определение по орфографическим маркерам. Если результат неточен, проверьте наличие специфических слов ниже.)", false, true);
        }

        const orthoHits = Object.keys(analysisData.orthoMarkerStats.counts).filter(lang => analysisData.orthoMarkerStats.counts[lang] > 0);
        if (orthoHits.length > 0) {
            addBreak();
            addLine("Орфография (по языкам):", true);
            orthoHits.forEach(lang => {
                addListLine(`<strong>${lang}:</strong> ${analysisData.orthoMarkerStats.counts[lang]} слов(а) (${analysisData.orthoMarkerStats.words[lang].join(", ")})`);
            });
        }
        
        addBreak();
        addLine("Анализ iGaming-лексики (возможные несоответствия ГЕО):", true);
        let geoMismatchFound = false;
        const targetLangWordMarkers = wordMarkers[guessedLangData.language] ? wordMarkers[guessedLangData.language].map(w => w.toLowerCase()) : [];
        for (const lang in analysisData.wordMarkerStats.counts) {
            if (analysisData.wordMarkerStats.counts[lang] > 0 && lang !== guessedLangData.language) {
                const problematicWords = analysisData.wordMarkerStats.words[lang].filter(wordWithCount => {
                    const baseWord = wordWithCount.match(/^(.*?)(?= \(\d+\)$)/)[0].toLowerCase();
                    return !targetLangWordMarkers.includes(baseWord)
                });
                if (problematicWords.length > 0) {
                    addListLine(`Обнаружены слова, характерные для <strong>${lang}</strong> (но не для ${guessedLangData.language}): ${problematicWords.length} (${problematicWords.join(", ")})`);
                    geoMismatchFound = true
                }
            }
        }
        if (!geoMismatchFound && guessedLangData.language !== "Не определён" && guessedLangData.language !== "Смешанный") {
            addListLine("<em>Специфическая iGaming-лексика других ГЕО не обнаружена или совпадает с общей/целевой.</em>", false, true);
        } else if (guessedLangData.language === "Не определён" || guessedLangData.language === "Смешанный") {
            addListLine("<em>Язык не определен однозначно, проверьте все найденные маркеры.</em>", false, true);
        }

        if (analysisData.duplicateWords.length > 0) {
            addBreak(); addLine("Повторяющиеся слова (рядом):", true);
            analysisData.duplicateWords.forEach(dup => addListLine(dup));
        }
        if (analysisData.duplicateSentences.length > 0) {
            addBreak(); addLine("Повторяющиеся предложения:", true);
            analysisData.duplicateSentences.forEach(dup => addListLine(`<em>"${escapeHTML(dup)}"</em>`));
        }
        if (analysisData.potentialTypos.length > 0) {
            addBreak(); addLine("Потенциальные опечатки:", true);
            analysisData.potentialTypos.forEach(typo => addListLine(escapeHTML(typo)));
        }
        if (analysisData.hasEnDash) {
            addBreak(); addLine("<strong>Обнаружено короткое тире (–):</strong> Рекомендуется заменить на длинное тире (—) или дефис с пробелами в зависимости от контекста.");
        }
        if (analysisData.currencyReportStrings.length > 0) {
            addBreak(); addLine("Валюты в тексте:", true);
            analysisData.currencyReportStrings.forEach(currencyStr => addListLine(currencyStr));
            const expectedCurrency = currencyMarkers[guessedLangData.language];
            if (expectedCurrency) {
                const foundCurrencyCodes = Object.keys(analysisData.foundCurrencies);
                if (!foundCurrencyCodes.includes(expectedCurrency) && foundCurrencyCodes.length > 0) {
                    addListLine(`<strong style="color:orange;">Внимание:</strong> Ожидаемая валюта для ${guessedLangData.language} (${expectedCurrency}) не найдена, но есть другие: ${foundCurrencyCodes.join(", ")}.`);
                } else {
                    const otherCurrencies = foundCurrencyCodes.filter(c => c !== expectedCurrency && analysisData.foundCurrencies[c] > 0);
                    if (otherCurrencies.length > 0) {
                        addListLine(`<strong style="color:orange;">Несоответствие валют:</strong> Для ${guessedLangData.language} ожидается ${expectedCurrency}, но также найдены: ${otherCurrencies.join(", ")}.`);
                    }
                }
            } else if (guessedLangData.language !== "Не определён" && guessedLangData.language !== "Смешанный") {
                addListLine(`<em>Для языка ${guessedLangData.language} не задана ожидаемая валюта в настройках букмарклета.</em>`, false, true);
            }
        }

        resultLinesConfig.forEach(lineConf => {
            const div = document.createElement('div');
            div.style.padding = "3px 0";
            if (lineConf.isBreak) {
                 div.style.marginTop = "5px"; // Добавляем немного места перед секцией
            } else if (lineConf.key) { // Key-value line
                const strong = document.createElement('strong');
                strong.textContent = lineConf.key;
                div.appendChild(strong);
                if (lineConf.value) {
                    const valueSpan = document.createElement('span');
                    valueSpan.textContent = lineConf.value;
                    if (lineConf.valueBgColor) {
                        valueSpan.style.backgroundColor = lineConf.valueBgColor;
                        valueSpan.style.padding = "2px 5px";
                        valueSpan.style.borderRadius = "3px";
                    }
                    div.appendChild(valueSpan);
                }
            } else if (lineConf.listText) { // List line
                if(lineConf.indent !== false) div.style.marginLeft = "20px"; // Отступ для элементов списка по умолчанию
                // Безопасная вставка HTML для элементов списка, если они содержат теги
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = lineConf.listText; // Доверяем этому HTML, т.к. он формируется внутри кода
                Array.from(tempContainer.childNodes).forEach(child => div.appendChild(child.cloneNode(true)));

            } else { // Regular line
                 // Обработка кликабельных слов и HTML
                const clickableWordRegex = /([a-zA-Zа-яА-ЯёЁ0-9@$._'-]+(?: [a-zA-Zа-яА-ЯёЁ0-9@$._'-]+)* \(\d+\))/g;
                const parts = lineConf.html.split(clickableWordRegex);
                
                parts.forEach(part => {
                    if (clickableWordRegex.test(part) && part.match(/^(.*?)(?= \(\d+\)$)/)) {
                        const wordOnlyMatch = part.match(/^(.*?)(?= \(\d+\)$)/);
                        if (wordOnlyMatch && wordOnlyMatch[1]) {
                            const wordToCopy = wordOnlyMatch[1];
                            const span = document.createElement('span');
                            span.className = "clickable-word";
                            span.title = `Копировать '${wordToCopy}'`;
                            span.dataset.copy = wordToCopy; // Используем dataset для хранения данных
                            span.textContent = part;
                            div.appendChild(span);
                        } else {
                             div.appendChild(document.createTextNode(part)); // Если не удалось извлечь слово
                        }
                    } else {
                        // Для строк с HTML тегами (strong, em)
                        const temp = document.createElement('div');
                        temp.innerHTML = part; // Доверяем этому HTML, т.к. он формируется внутри кода
                        if (temp.childNodes.length > 0) {
                            Array.from(temp.childNodes).forEach(child => div.appendChild(child.cloneNode(true)));
                        } else {
                            div.appendChild(document.createTextNode(part));
                        }
                    }
                });
            }
            if (lineConf.bold) div.style.fontWeight = "bold";
            if (lineConf.italic) div.style.fontStyle = "italic";
            if (lineConf.style) div.style.cssText += lineConf.style;

            content.appendChild(div);
        });

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        // Используем textContent для добавления стилей - более совместимо
        styleSheet.textContent = ".clickable-word { color: #005a9e; cursor: pointer; text-decoration: underline; } .clickable-word:hover { color: #003366; } .copied-feedback { color: green !important; font-weight: bold; }";
        document.head.appendChild(styleSheet);

        content.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains("clickable-word")) {
                const wordToCopy = target.dataset.copy; // Получаем слово из dataset
                navigator.clipboard.writeText(wordToCopy).then(() => {
                    const originalText = target.textContent;
                    target.textContent = "Скопировано!";
                    target.classList.add("copied-feedback");
                    setTimeout(() => {
                        target.textContent = originalText;
                        target.classList.remove("copied-feedback")
                    }, 1500)
                }).catch(err => { console.warn("PolyCheck: Не удалось скопировать слово:", err) })
            }
        });
        popup.appendChild(content);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display: flex; justify-content: flex-end; padding-top: 15px; border-top: 1px solid #eee;";
        const copyAllButton = document.createElement("button");
        copyAllButton.textContent = "Копировать отчёт";
        copyAllButton.style.cssText = "padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size:13px;";
        copyAllButton.onmouseover = () => copyAllButton.style.backgroundColor = "#45a049";
        copyAllButton.onmouseout = () => copyAllButton.style.backgroundColor = "#4CAF50";
        copyAllButton.onclick = () => {
            const reportText = Array.from(content.childNodes)
                .map(div => div.textContent || div.innerText) // Получаем текстовое содержимое каждого div
                .join('\n')
                .replace(/\sСкопировано!\s/g, ' ') // Убираем временное сообщение "Скопировано!"
                .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
                .trim();
            navigator.clipboard.writeText(reportText).then(() => {
                copyAllButton.textContent = "Отчёт скопирован!";
                setTimeout(() => { copyAllButton.textContent = "Копировать отчёт" }, 2e3)
            })
        };
        const closeButton = document.createElement("button");
        closeButton.textContent = "Закрыть";
        closeButton.style.cssText = "padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size:13px;";
        closeButton.onmouseover = () => closeButton.style.backgroundColor = "#e53935";
        closeButton.onmouseout = () => closeButton.style.backgroundColor = "#f44336";
        closeButton.onclick = () => { popup.remove(); if (styleSheet) styleSheet.remove() };
        buttonContainer.appendChild(copyAllButton);
        buttonContainer.appendChild(closeButton);
        popup.appendChild(buttonContainer);

        const footer = document.createElement("div");
        footer.style.cssText = "text-align: right; font-size: 11px; color: #999; margin-top: 10px;";
        const poweredByText = document.createTextNode("Powered by ");
        const authorLink = document.createElement("a");
        authorLink.href = "https://www.linkedin.com/in/yaroslav-rudyi/";
        authorLink.target = "_blank";
        authorLink.style.color = "#005a9e";
        authorLink.style.textDecoration = "none";
        authorLink.textContent = "@yarikbes";
        const andGeminiText = document.createTextNode(" & Gemini");
        footer.appendChild(poweredByText);
        footer.appendChild(authorLink);
        footer.appendChild(andGeminiText);
        popup.appendChild(footer);

        document.body.appendChild(popup);
    }

    (async () => {
        try {
            const textToAnalyze = await getText();
            if (textToAnalyze) {
                const analysisResults = analyzeText(textToAnalyze);
                const guessedLanguage = guessLanguage(analysisResults.orthoMarkerStats);
                showPopup(guessedLanguage, analysisResults);
            }
        } catch (e) {
            alert("Произошла ошибка в работе букмарклета PolyCheck: " + e.message);
            console.error("PolyCheck Error:", e);
        }
    })();
})();
