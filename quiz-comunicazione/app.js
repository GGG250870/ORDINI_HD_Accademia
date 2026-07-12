(function () {
  "use strict";

  const els = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
    startForm: document.getElementById("start-form"),
    studentName: document.getElementById("student-name"),
    questionCount: document.getElementById("question-count"),
    passThreshold: document.getElementById("pass-threshold"),
    progressBar: document.getElementById("progress-bar"),
    progressLabel: document.getElementById("progress-label"),
    sectionTag: document.getElementById("section-tag"),
    questionText: document.getElementById("question-text"),
    optionsBox: document.getElementById("options-box"),
    feedbackBox: document.getElementById("feedback-box"),
    nextBtn: document.getElementById("next-btn"),
    quitBtn: document.getElementById("quit-btn"),
    resultsBody: document.getElementById("results-body"),
    restartBtn: document.getElementById("restart-btn"),
    printBtn: document.getElementById("print-btn"),
    certificate: document.getElementById("certificate"),
    certName: document.getElementById("cert-name"),
    certScore: document.getElementById("cert-score"),
    certDate: document.getElementById("cert-date"),
  };

  let state = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showScreen(name) {
    els.start.classList.toggle("hidden", name !== "start");
    els.quiz.classList.toggle("hidden", name !== "quiz");
    els.results.classList.toggle("hidden", name !== "results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  els.questionCount.textContent = QUESTIONS.length;
  els.passThreshold.textContent = Math.round(PASS_THRESHOLD * 100);

  els.startForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = els.studentName.value.trim() || "Candidato";
    state = {
      name: name,
      order: shuffle(QUESTIONS.map((_, i) => i)),
      current: 0,
      answers: [], // { qIndex, chosen, correct }
      answered: false,
    };
    showScreen("quiz");
    renderQuestion();
  });

  els.quitBtn.addEventListener("click", function () {
    if (confirm("Vuoi davvero interrompere l'esame? I progressi andranno persi.")) {
      showScreen("start");
    }
  });

  function renderQuestion() {
    const qIndex = state.order[state.current];
    const q = QUESTIONS[qIndex];
    state.answered = false;

    const total = state.order.length;
    const pct = Math.round((state.current / total) * 100);
    els.progressBar.style.width = pct + "%";
    els.progressLabel.textContent = "Domanda " + (state.current + 1) + " di " + total;

    els.sectionTag.textContent = SECTIONS[q.section];
    els.questionText.textContent = q.question;
    els.feedbackBox.innerHTML = "";
    els.feedbackBox.className = "feedback-box hidden";
    els.nextBtn.disabled = true;
    els.nextBtn.textContent = state.current === total - 1 ? "Vedi risultati" : "Domanda successiva";

    els.optionsBox.innerHTML = "";
    q.options.forEach(function (optText, i) {
      const row = document.createElement("label");
      row.className = "option";
      row.innerHTML =
        '<input type="radio" name="opt" value="' + i + '"> <span>' + escapeHtml(optText) + "</span>";
      row.addEventListener("click", function () {
        if (state.answered) return;
        selectAnswer(qIndex, q, i, row);
      });
      els.optionsBox.appendChild(row);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function selectAnswer(qIndex, q, chosenIndex, rowEl) {
    state.answered = true;
    const isCorrect = chosenIndex === q.correct;

    state.answers.push({ qIndex: qIndex, chosen: chosenIndex, correct: isCorrect });

    const optionRows = els.optionsBox.querySelectorAll(".option");
    optionRows.forEach(function (row, i) {
      row.classList.add("disabled");
      const input = row.querySelector("input");
      if (input) input.disabled = true;
      if (i === q.correct) row.classList.add("correct");
      if (i === chosenIndex && i !== q.correct) row.classList.add("incorrect");
      if (i === chosenIndex) row.classList.add("selected");
    });

    els.feedbackBox.classList.remove("hidden");
    els.feedbackBox.classList.add(isCorrect ? "ok" : "bad");
    els.feedbackBox.innerHTML =
      (isCorrect ? "✔ Corretto. " : "✘ Non corretto. ") +
      '<span class="quote">' + escapeHtml(q.explanation) + "</span>";

    els.nextBtn.disabled = false;
  }

  els.nextBtn.addEventListener("click", function () {
    if (!state.answered) return;
    state.current++;
    if (state.current >= state.order.length) {
      showResults();
    } else {
      renderQuestion();
    }
  });

  function showResults() {
    const total = state.answers.length;
    const correctCount = state.answers.filter(function (a) { return a.correct; }).length;
    const pct = total ? correctCount / total : 0;
    const passed = pct >= PASS_THRESHOLD;

    // Per-section breakdown
    const bySection = SECTIONS.map(function (name, idx) {
      const qsInSection = state.answers.filter(function (a) { return QUESTIONS[a.qIndex].section === idx; });
      const correctInSection = qsInSection.filter(function (a) { return a.correct; }).length;
      return { name: name, total: qsInSection.length, correct: correctInSection };
    }).filter(function (s) { return s.total > 0; });

    const wrongAnswers = state.answers.filter(function (a) { return !a.correct; });

    let html = "";
    html += '<div class="score-hero">';
    html += '<div class="score-circle ' + (passed ? "pass" : "fail") + '">';
    html += '<div class="pct">' + Math.round(pct * 100) + "%</div>";
    html += '<div class="frac">' + correctCount + " / " + total + "</div>";
    html += "</div>";
    html += '<div class="result-title ' + (passed ? "pass" : "fail") + '">' +
      (passed ? "Esame Superato" : "Esame Non Superato") + "</div>";
    html += '<div class="result-sub">' + escapeHtml(state.name) + " — soglia richiesta " +
      Math.round(PASS_THRESHOLD * 100) + "%</div>";
    html += "</div>";

    html += '<div class="stats-grid">';
    html += '<div class="stat"><div class="num">' + total + '</div><div class="lab">Domande</div></div>';
    html += '<div class="stat"><div class="num">' + correctCount + '</div><div class="lab">Corrette</div></div>';
    html += '<div class="stat"><div class="num">' + (total - correctCount) + '</div><div class="lab">Errate</div></div>';
    html += "</div>";

    html += "<h3>Risultato per area tematica</h3>";
    html += '<div class="section-breakdown">';
    bySection.forEach(function (s) {
      const p = s.total ? Math.round((s.correct / s.total) * 100) : 0;
      html += '<div class="sb-row">';
      html += '<div class="name">' + escapeHtml(s.name) + "</div>";
      html += '<div class="sb-bar"><div style="width:' + p + '%"></div></div>';
      html += '<div class="val">' + s.correct + "/" + s.total + "</div>";
      html += "</div>";
    });
    html += "</div>";

    if (wrongAnswers.length) {
      html += '<h3 style="margin-top:22px;">Domande da ripassare</h3>';
      wrongAnswers.forEach(function (a) {
        const q = QUESTIONS[a.qIndex];
        html += '<div class="review-item">';
        html += '<div class="rq">' + escapeHtml(q.question) + "</div>";
        html += '<div class="ra wrong-answer">Risposta data: ' + escapeHtml(q.options[a.chosen]) + "</div>";
        html += '<div class="ra correct-answer">Risposta corretta: ' + escapeHtml(q.options[q.correct]) + "</div>";
        html += '<div class="rexp">' + escapeHtml(q.explanation) + "</div>";
        html += "</div>";
      });
    } else {
      html += '<p class="lead" style="margin-top:20px;">Nessun errore: punteggio pieno su tutte le domande. Ottimo lavoro!</p>';
    }

    els.resultsBody.innerHTML = html;

    // Certificate (used only when printing, if passed)
    els.certName.textContent = state.name;
    els.certScore.textContent = Math.round(pct * 100) + "%";
    els.certDate.textContent = new Date().toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" });
    els.certificate.classList.toggle("hidden", !passed);
    els.printBtn.classList.toggle("hidden", !passed);

    showScreen("results");
  }

  els.restartBtn.addEventListener("click", function () {
    showScreen("start");
  });

  els.printBtn.addEventListener("click", function () {
    window.print();
  });
})();
