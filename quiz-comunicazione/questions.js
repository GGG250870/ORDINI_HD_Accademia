// Banca dati del quiz — Esame di Valutazione Finale
// Fonte: "Manuale Operativo del Supervisore di Sala Pratica" (agg. 28/03/25)
// e "Manuale Operativo del Supervisore di Sala Pratica 0.1 - Principi del Comando" (agg. 16/04/26)
// Ogni domanda riporta una spiegazione basata testualmente sul materiale fornito.

const QUIZ_TITLE = "Esame di Valutazione Finale — Corso di Comunicazione";
const PASS_THRESHOLD = 0.8; // 80% per superare l'esame

const SECTIONS = [
  "Ruoli e Definizioni",
  "Il Codice del Supervisore",
  "Glossario della Comunicazione",
  "Procedura di Gestione della Sala Pratica",
  "Come Allenare e Guidare lo Studente",
  "Percorso “Comunicare da Leader”",
  "Scala delle Emozioni",
  "Che Cosa Fai / Far Desiderare",
  "Ostacoli al Confronto",
  "Principi del Comando: Controllo e Intenzione"
];

const QUESTIONS = [
  // ---------------- SEZIONE 1: Ruoli e Definizioni ----------------
  {
    section: 0,
    question: "Chi è il Supervisore di Sala Pratica secondo il manuale?",
    options: [
      "Un Manager esperto, garante del corretto funzionamento della Sala Pratica",
      "Un consulente esperto nell'esecuzione degli esercizi che allena",
      "Il Responsabile MBS (DT)",
      "Uno studente che ha superato tutti gli esercizi"
    ],
    correct: 0,
    explanation: "«È un Manager esperto, il garante del corretto funzionamento della Sala Pratica (e non solo)»."
  },
  {
    section: 0,
    question: "Chi è l'Allenatore?",
    options: [
      "Il garante del corretto funzionamento della sala pratica",
      "Un consulente esperto nell'esecuzione degli esercizi che si appresta ad allenare",
      "Il responsabile organizzativo della MBS",
      "Colui che sostituisce sempre il Supervisore"
    ],
    correct: 1,
    explanation: "«È un consulente esperto nell'esecuzione degli esercizi che si appresta ad allenare. È una persona che sta vincendo nella sua attività»."
  },
  {
    section: 0,
    question: "Il Supervisore allena direttamente gli studenti in sala pratica.",
    options: ["Vero", "Falso"],
    correct: 1,
    explanation: "«Il Supervisore non allena, ottiene risultati tramite gli allenatori e fa tutte le opportune correzioni al fine di ottenere il risultato; anche sostituire un allenatore»."
  },
  {
    section: 0,
    question: "A chi fa capo il ruolo del Supervisore secondo l'organigramma?",
    options: [
      "Al Responsabile MBS/Academy (DT)",
      "Al Direttore Generale dell'azienda cliente",
      "All'Allenatore più anziano",
      "Al cliente stesso"
    ],
    correct: 0,
    explanation: "«ORGANIGRAMMA: questo ruolo fa capo al Responsabile MBS/Academy (DT) che cura la gestione dei clienti iscritti alla classe»."
  },
  {
    section: 0,
    question: "Quali sono i tre attributi del dirigente richiamati nel manuale?",
    options: [
      "Saper fare il lavoro dei collaboratori meglio di loro, avere eccellenti relazioni aiutandoli a comprendere i doveri, ottenere qualcosa tramite un'altra persona",
      "Essere autoritario, imporre le regole, controllare gli orari",
      "Saper vendere, saper comunicare, saper motivare",
      "Pianificare, organizzare, delegare"
    ],
    correct: 0,
    explanation: "Il manuale cita i «tre punti del dirigente»: eseguire il lavoro dei collaboratori meglio di loro, avere eccellenti relazioni aiutandoli a comprendere doveri e ruoli, e la capacità (la più importante) di ottenere qualcosa fatto tramite un'altra persona."
  },
  {
    section: 0,
    question: "Qual è lo SCOPO dichiarato nella Premessa del manuale?",
    options: [
      "Insegnare tecniche di vendita avanzate",
      "Portare la persona che si allena a diventare migliore nella comunicazione in uscita e più efficace nelle comunicazioni in genere, senza esserne influenzata eccessivamente",
      "Formare nuovi supervisori aziendali per altre aree",
      "Ridurre il turnover del personale"
    ],
    correct: 1,
    explanation: "«SCOPO: portare la persona che viene ad allenarsi in questa classe a diventare migliore nella comunicazione in uscita e più efficace nelle comunicazioni in genere senza che queste lo influenzino eccessivamente»."
  },

  // ---------------- SEZIONE 2: Il Codice del Supervisore ----------------
  {
    section: 1,
    question: "Quante regole compongono il Codice del Supervisore?",
    options: ["15", "18", "23", "30"],
    correct: 2,
    explanation: "Il Codice del Supervisore elenca 23 regole, seguite dalla firma di condivisione e impegno."
  },
  {
    section: 1,
    question: "Secondo la regola n.2, come va stigmatizzato l'errore di uno studente?",
    options: [
      "Mai, per non scoraggiarlo",
      "In maniera brutale (chiara, diretta), mantenendo comunque una buona sintonia",
      "Solo in privato, mai davanti ad altri",
      "Tramite un rapporto scritto al DT"
    ],
    correct: 1,
    explanation: "«Il Supervisore e l'Allenatore deve stigmatizzare l'errore di uno studente in maniera brutale (chiaro, diretto) e nel farlo mantenere una buona sintonia (Punti di contatto/Accordo, Feeling, Comunicazione)»."
  },
  {
    section: 1,
    question: "Secondo la regola n.5, l'Allenatore...",
    options: [
      "Deve diventare amico intimo dello studente",
      "Può discutere liberamente di problemi personali con lo studente",
      "Non istruisce un “caso” nella sua relazione con lo studente, né discute o parla di problemi personali",
      "Deve condividere le proprie difficoltà personali con lo studente"
    ],
    correct: 2,
    explanation: "«L'Allenatore non istruisce un “caso” nella sua relazione con il suo studente, né discute o parla con lui di problemi personali»."
  },
  {
    section: 1,
    question: "Cosa devono fare Supervisore e Allenatore se non sanno rispondere a una domanda dello studente (regola n.8)?",
    options: [
      "Inventare una risposta plausibile per non perdere autorevolezza",
      "Ignorare la domanda e proseguire",
      "Ammetterlo sempre e trovare la risposta nel materiale, indicando allo studente dove trovarla",
      "Rimandare sempre la domanda al DT"
    ],
    correct: 2,
    explanation: "«Se il Supervisore o un Allenatore non sapessero rispondere ad una determinata domanda, dovrebbero sempre ammetterlo e trovare la risposta nel materiale, così da poter dire allo studente dove trovarla»."
  },
  {
    section: 1,
    question: "La regola n.13 del Codice riguarda:",
    options: [
      "Il divieto di coinvolgimento emozionale con gli studenti, soprattutto a livello affettivo/sessuale",
      "L'obbligo di indossare la divisa aziendale",
      "Il divieto di usare il telefono in sala pratica",
      "L'obbligo di dare un regalo finale allo studente"
    ],
    correct: 0,
    explanation: "«Il Supervisore e l'Allenatore non devono coinvolgersi emozionalmente con gli studenti, soprattutto a livello affettivo/sessuale (mentre sono in formazione con lui)»."
  },
  {
    section: 1,
    question: "Cosa deve fare il Supervisore/Allenatore quando commette un errore (regola n.14)?",
    options: [
      "Continuare come se nulla fosse, per non perdere autorevolezza",
      "Farsi sostituire immediatamente",
      "Informare lo studente dell'errore e correggersi subito, senza mai nasconderlo",
      "Rimandare la correzione a fine giornata"
    ],
    correct: 2,
    explanation: "«Quando il Supervisore o l'Allenatore commette un errore, egli deve informare lo studente che lo ha fatto, e correggersi immediatamente […]. Non devono mai nascondere il fatto che hanno commesso un errore»."
  },
  {
    section: 1,
    question: "Cosa significa la regola n.23, “Causatività genera causatività”?",
    options: [
      "Ogni causa produce sempre un effetto negativo",
      "Solo il DT può essere causativo",
      "Se il Supervisore e l'Allenatore sono causativi, anche il cliente lo diventa",
      "Il cliente è sempre causa dei propri problemi"
    ],
    correct: 2,
    explanation: "«Il Supervisore e l'Allenatore sono causativi! Se lo sono, anche il cliente lo è. Causatività genera causatività»."
  },
  {
    section: 1,
    question: "Secondo la regola n.17, dopo aver lasciato il controllo allo studente per un'esercitazione, cosa devono fare Supervisore e Allenatore?",
    options: [
      "Lasciare che lo studente mantenga il controllo per il resto della sessione",
      "Riprendere sempre il controllo dello studente",
      "Chiamare subito il DT",
      "Interrompere definitivamente l'esercizio"
    ],
    correct: 1,
    explanation: "«Dopo aver lasciato allo studente il controllo, […] devono sempre riprendere il controllo dello studente»."
  },

  // ---------------- SEZIONE 3: Glossario ----------------
  {
    section: 2,
    question: "Che cos'è un “Bottone” secondo il glossario?",
    options: [
      "Un errore ripetuto durante l'esercizio",
      "Un qualcosa (parola, frase, soggetto o area) che suscita una reazione nell'individuo",
      "Il comando per iniziare l'esercizio",
      "Un premio dato allo studente"
    ],
    correct: 1,
    explanation: "«BOTTONE: un qualcosa, una parola, una frase, un soggetto oppure un'area che suscita una reazione nell'individuo»."
  },
  {
    section: 2,
    question: "Come viene definita la “Comunicazione” nel glossario?",
    options: [
      "Un discorso tenuto da una sola persona",
      "Uno scambio di idee (e oggetti) fra due o più persone attraverso lo spazio",
      "Il trasferimento di documenti tra uffici",
      "L'atto di dare ordini"
    ],
    correct: 1,
    explanation: "«COMUNICAZIONE: uno scambio di idee e oggetti fra due persone o più persone attraverso lo spazio»."
  },
  {
    section: 2,
    question: "Il “Riconoscimento” è definito come:",
    options: [
      "Un premio economico per lo studente",
      "Una critica costruttiva",
      "Il segnale di inizio esercizio",
      "Qualcosa detto o fatto per informare che si è notato, compreso e ricevuto ciò che è stato detto o fatto"
    ],
    correct: 3,
    explanation: "«RICONOSCIMENTO: qualcosa detto o fatto al fine d'informare qualcun altro che si è notato, compreso e ricevuto ciò che costui ha detto oppure ha fatto»."
  },
  {
    section: 2,
    question: "Cosa si intende per “Sintonia”?",
    options: [
      "La velocità con cui si comunica",
      "Il volume della voce durante la comunicazione",
      "Il grado relativo di accordo, intesa e concordia presente tra due o più persone",
      "La distanza fisica tra le persone"
    ],
    correct: 2,
    explanation: "«SINTONIA: è il grado relativo di accordo presente tra due o più persone […] Sintonia significa il grado di accordo, intesa e concordia che esiste con l'altra persona»."
  },
  {
    section: 2,
    question: "“Stare di Fronte” significa:",
    options: [
      "Guardare fisso senza mai sbattere le palpebre",
      "Mantenere il silenzio durante la conversazione",
      "Fronteggiare senza scansare o ritrarsi, essendo a proprio agio e percependo",
      "Stare fisicamente a un metro esatto di distanza"
    ],
    correct: 2,
    explanation: "«STARE DI FRONTE: fronteggiare senza scansare o ritrarsi. L'abilità di stare di fronte consiste nella capacità di essere lì a proprio agio e di percepire»."
  },
  {
    section: 2,
    question: "Cos'è il “Ritardo di Comunicazione”?",
    options: [
      "Il tempo che l'allenatore impiega per dare il “Via”",
      "La pausa tra un esercizio e l'altro",
      "Il tempo necessario per completare il corso",
      "Il lasso di tempo che intercorre fra il porre la domanda e la risposta a quella esatta domanda"
    ],
    correct: 3,
    explanation: "«RITARDO DI COMUNICAZIONE: il lasso di tempo che intercorre fra il porre la domanda e la risposta a quell'esatta domanda, data alla persona da cui era stata posta»."
  },
  {
    section: 2,
    question: "Cosa significa “Provocato”?",
    options: [
      "Un esercizio riservato solo al Supervisore",
      "Una tecnica di rilassamento",
      "La ricerca di azioni, parole o frasi che durante l'esercizio inducono lo studente a distrarsi o reagire",
      "Un tipo particolare di riconoscimento"
    ],
    correct: 2,
    explanation: "«PROVOCATO: […] la ricerca di quelle azioni, parole, frasi, manierismi o argomenti che durante l'esercizio inducono lo studente a distrarsi, reagendo nei confronti dell'allenatore»."
  },
  {
    section: 2,
    question: "Quando l'abilità appresa in un esercizio rimane stabile, come viene definita la vittoria ottenuta?",
    options: ["Pass definitivo", "Certificazione MBS", "Grande vittoria stabile", "Chiusura del ciclo"],
    correct: 2,
    explanation: "«Quando lo studente ha raggiunto il punto in cui può eseguire l'esercizio e la sua abilità nel farlo rimane stabile, si ha quella che viene definita grande vittoria stabile: vittoria significativa e durevole»."
  },
  {
    section: 2,
    question: "Cosa si intende per “Unità di Tempo” riferita a una comunicazione?",
    options: [
      "Una comunicazione nuova, fresca, come se fosse la prima volta che viene detta",
      "Il tempo minimo che deve durare un esercizio",
      "Una comunicazione ripetuta identica più volte",
      "L'unità di misura degli errori"
    ],
    correct: 0,
    explanation: "«UNITA' DI TEMPO: è una comunicazione che non viene ripetuta in base all'ultima volta che è stata ripetuta. Deve essere nuova, fresca, comunicata nel presente. Come se fosse la prima volta che viene detta»."
  },

  // ---------------- SEZIONE 4: Procedura di Gestione della Sala Pratica ----------------
  {
    section: 3,
    question: "Chi deve arrivare per primo in sala pratica?",
    options: ["Il primo studente iscritto", "Il DT della MBS", "Il Supervisore", "L'allenatore più anziano"],
    correct: 2,
    explanation: "«Il supervisore DEVE essere il primo ad arrivare in sala pratica»."
  },
  {
    section: 3,
    question: "Chi decide quale allenatore utilizzare per un esercizio in Sala Pratica?",
    options: [
      "Lo studente stesso",
      "Solo il Supervisore, chiedendo la disponibilità esclusivamente al DT",
      "L'allenatore della sala studio in autonomia",
      "Il cliente tramite il proprio consulente"
    ],
    correct: 1,
    explanation: "«Sarà solo il supervisore a decidere di quale allenatore si deve avvalere […] chiedendo la disponibilità di quell'allenatore esclusivamente al DT»."
  },
  {
    section: 3,
    question: "Cosa NON deve mai dire un allenatore quando ritiene che uno studente abbia terminato un esercizio, in assenza del Supervisore?",
    options: [
      "“Chiamo il Supervisore per la verifica”",
      "“Secondo me va bene”, “l'allenamento è concluso” oppure “vediamo cosa dice il Supervisore”",
      "“Ripetiamo ancora una volta”",
      "“Bravo, continua così”"
    ],
    correct: 1,
    explanation: "«L'allenatore non dirà MAI allo studente “secondo me va bene”, “l'allenamento è concluso” oppure “Per me è ok, vediamo cosa dice il Supervisore della Sala Pratica”»."
  },
  {
    section: 3,
    question: "Quali comandi si usano per dirigere lo studente durante gli esercizi?",
    options: ["START, STOP, PAUSA", "VIA, ERRORE, FINE", "INIZIO, CORREGGI, TERMINA", "OK, NO, BASTA"],
    correct: 1,
    explanation: "«Per dirigere lo studente durante gli esercizi utilizza i comandi VIA, ERRORE, FINE»."
  },
  {
    section: 3,
    question: "Cosa deve fare il Supervisore per ogni percorso di Comunicazione terminato?",
    options: [
      "Compilare un report annuale per l'azienda",
      "Pubblicare i risultati in bacheca",
      "Inviare alla Responsabile dell'organizzazione MBS una comunicazione WhatsApp e poi firmare l'attestato dopo la stampa",
      "Inviare una email al cliente con i voti ottenuti"
    ],
    correct: 2,
    explanation: "«È il Supervisore ad inviare alla Responsabile dell'organizzazione della MBS una comunicazione whatsapp indicando il completamento del corso […]. Dopo la stampa, sarà il supervisore a firmare l'attestato»."
  },
  {
    section: 3,
    question: "Gli argomenti personali trattati con il cliente durante la pratica (specialmente nel “Comunicare da Leader provocato”):",
    options: [
      "Vanno condivisi ogni sera con il DT",
      "Possono essere condivisi con gli altri studenti per aiutarli",
      "Non devono uscire dalla sala pratica",
      "Vanno scritti in un report per l'azienda del cliente"
    ],
    correct: 2,
    explanation: "«Gli argomenti PERSONALI trattati con il cliente durante la pratica NON DEVONO uscire dalla sala pratica (soprattutto Comunicare da leader “provocato”)»."
  },
  {
    section: 3,
    question: "Quale tra questi elementi NON è richiesto tra le dotazioni obbligatorie della sala pratica?",
    options: [
      "Almeno un dizionario",
      "Una connessione WiFi ad alta velocità",
      "Sedie senza braccioli, distanti almeno 50 cm dal muro",
      "Illuminazione e climatizzazione funzionanti"
    ],
    correct: 1,
    explanation: "Il manuale richiede dizionario, copia del Manuale di Comunicazione, copie di Pinocchio, illuminazione e climatizzazione funzionanti, sedie senza braccioli distanti almeno 50 cm dal muro. Il WiFi non è menzionato tra i requisiti."
  },
  {
    section: 3,
    question: "Se manca uno studente o un allenatore dopo la pausa, cosa fa il Supervisore?",
    options: [
      "Abbandona la sala per andarlo a cercare personalmente",
      "Manda qualcuno a chiamarlo, senza lasciare la sala pratica",
      "Annulla la sessione",
      "Aspetta senza intervenire"
    ],
    correct: 1,
    explanation: "«Se manca qualcuno il Supervisore della Sala lo manda a chiamare immediatamente […] non puoi lasciare la sala pratica ma mandi qualcuno a chiamarlo»."
  },

  // ---------------- SEZIONE 5: Come Allenare e Guidare lo Studente ----------------
  {
    section: 4,
    question: "Cosa si intende per “allenare con realtà”?",
    options: [
      "Usare sempre frasi preconfezionate identiche per tutti",
      "Simulare situazioni il più possibile attinenti alla realtà normalmente vissuta dallo studente",
      "Allenare solo in situazioni immaginarie",
      "Far leggere un copione fisso"
    ],
    correct: 1,
    explanation: "«Siate realisti nel vostro allenamento […] assicuratevi di utilizzare delle condizioni che siano adatte alla realtà normalmente vissuta dallo studente che state allenando»."
  },
  {
    section: 4,
    question: "È corretto lasciare che uno studente si “auto-corregga” durante un esercizio?",
    options: [
      "Sì, è incoraggiato per sviluppare autonomia",
      "No, va bocciato in modo deciso perché porta la persona a introvertirsi",
      "Sì, ma solo dopo il terzo errore",
      "Dipende dall'umore dello studente"
    ],
    correct: 1,
    explanation: "«Bocciate in modo deciso qualsiasi forma di auto allenamento / auto correzione […] la persona tenderà a introvertirsi»."
  },
  {
    section: 4,
    question: "Quando ci sono correzioni che richiedono una spiegazione, cosa deve fare l'allenatore?",
    options: [
      "Spiegare sempre a parole proprie, senza consultare il manuale",
      "Prendere il testo dell'esercizio e far leggere allo studente direttamente la parte che spiega il dato corretto",
      "Rimandare la spiegazione alla fine del corso",
      "Chiedere allo studente di cercare la risposta da solo su internet"
    ],
    correct: 1,
    explanation: "«Dovete SEMPRE prendere il testo dell'esercizio […] e FATE LEGGERE DIRETTAMENTE LA PARTE DEL TESTO CHE SPIEGA IL CORRETTO DATO. Non fate i professori»."
  },
  {
    section: 4,
    question: "Indicativamente, quanto tempo può metterci uno studente per passare un esercizio prima che si valuti un cambio di approccio (dato non ferreo)?",
    options: ["Circa 10 minuti", "Circa 2-3 ore", "Un'intera giornata", "Circa 45 secondi"],
    correct: 1,
    explanation: "«Se la persona dovesse metterci troppo tempo per passare un esercizio (mediamente potrebbe essere circa 2-3 ore ma non è un dato ferreo)»."
  },
  {
    section: 4,
    question: "Se una persona ha un malore durante gli esercizi, cosa NON si deve fare, salvo che stia davvero male?",
    options: [
      "Comprendere il turbamento e darle riconoscimento",
      "Riportarla sul suo ciclo di comunicazione",
      "Farle prendere medicinali",
      "Continuare l'allenamento con calma"
    ],
    correct: 2,
    explanation: "«In nessun caso fai prendere alla persona medicinali […] Chiaro che se la persona dovesse proprio star male, falle prendere quello che deve e chiudi l'incontro d'allenamento»."
  },
  {
    section: 4,
    question: "Come si gestiscono i “casi da autodisciplina bassa” secondo il manuale?",
    options: [
      "Vengono esonerati dagli esercizi di comunicazione",
      "Vengono allenati in modo duro, ripetendo più volte i primi 2 esercizi",
      "Vengono affidati solo ad allenatrici donne",
      "Il tempo di allenamento si riduce a 5 minuti totali"
    ],
    correct: 1,
    explanation: "«Qui la persona deve essere allenata in modo duro […] e farle fare ripetutamente i primi 2 esercizi che sono quelli che le riusciranno più difficili. Stalle addosso»."
  },
  {
    section: 4,
    question: "Se un allenatore chiede di continuare un esercizio fuori dalla sala pratica perché il cliente è distratto, cosa fa il Supervisore?",
    options: [
      "Accorda sempre il permesso richiesto",
      "Sospende l'esercizio fino al giorno dopo",
      "Si assicura che l'esercizio continui in sala pratica, spiegando che il mondo è pieno di distrazioni",
      "Sostituisce subito l'allenatore"
    ],
    correct: 2,
    explanation: "«Ti assicuri che l'esercizio continui in sala pratica. Spieghi allo studente che il mondo è pieno di distrazioni […] Le distrazioni non possono tangere la nostra attenzione»."
  },

  // ---------------- SEZIONE 6: Percorso "Comunicare da Leader" ----------------
  {
    section: 5,
    question: "Qual è lo scopo dell'Esercizio 1 - FOCUS?",
    options: [
      "Imparare tecniche di respirazione e meditazione",
      "Imparare a controllare la propria attenzione, allenando il Qui ed Ora",
      "Migliorare la memoria a lungo termine",
      "Allenare la proiezione della voce"
    ],
    correct: 1,
    explanation: "«Lo scopo di questo esercizio: è imparare a controllare la propria attenzione […] Stiamo allenando il QUI ED ORA»."
  },
  {
    section: 5,
    question: "Nell'esercizio FOCUS, è fatto divieto di stoppare il cliente con quale parola?",
    options: ["“Via”", "“Fine”", "“Errore”", "“Ripeti”"],
    correct: 2,
    explanation: "«In questo esercizio è fatto divieto di stoppare il cliente con la parola “Errore”»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 2 - GUARDARE, quando si considera superato (“Pass”) l'esercizio?",
    options: [
      "Dopo esattamente 10 minuti di sguardo fisso",
      "Quando lo studente non sbatte mai le palpebre",
      "Solo quando la persona non manifesta più rigidità o forza ed è a proprio agio",
      "Quando lo studente inizia a ridere"
    ],
    correct: 2,
    explanation: "«È Pass solo quando la persona non manifesta più rigidità o forza; quindi, solo quando è lì a proprio agio»."
  },
  {
    section: 5,
    question: "Nell'esercizio “Guardare Provocato”, quali sono le uniche due cose che l'allenatore non può fare?",
    options: [
      "Fare battute comiche o parlare di cose che lo preoccupano",
      "Toccare lo studente o alzarsi dalla sedia per andarsene",
      "Passare attraverso diversi toni emotivi",
      "Ripetere la stessa frase più volte"
    ],
    correct: 1,
    explanation: "«L'allenatore può dire o fare qualunque cosa tranne toccare l'allenatore o alzarsi dalla sedia per andarsene»."
  },
  {
    section: 5,
    question: "Quale frase va ripetuta spesso quando lo studente fatica a superare un “bottone” nell'esercizio Guardare Provocato?",
    options: ["“Non ti preoccupare”", "“Concentrati di più”", "“Sono solo parole”", "“Andrà tutto bene”"],
    correct: 2,
    explanation: "«Ripeti spesso la frase “Sono solo parole” quando lo studente fatica a superare un bottone»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 4 - Comunicare con un'emozione positiva, arrivati a quale livello emotivo si chiama il Supervisore per la verifica?",
    options: ["Noia", "Forte Interesse", "Allegria", "Entusiasmo"],
    correct: 3,
    explanation: "«Arrivati all'emozione di Entusiasmo l'allenatore chiama il supervisore che verifica lo studente»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 5 - Comunicare a distanza, a quanti metri si posizionano studente e allenatore?",
    options: ["1 metro", "5 metri", "15 metri", "30 metri"],
    correct: 2,
    explanation: "«In questo esercizio studente e allenatore sono in piedi a circa 15 metri di distanza l'uno dall'altro»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 6 - Comunicare in modo efficace, qual è il tono emotivo minimo richiesto?",
    options: ["Ansia - Tristezza", "Noia - Logicità", "Forte Interesse - Allegria", "Collera - Ostilità"],
    correct: 2,
    explanation: "«in un tono emotivo alto (minimo Forte Interesse – Allegria)»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 7, quale delle seguenti è un esempio CORRETTO di Riconoscimento secondo il manuale?",
    options: ["“In che senso?”", "“Perfetto!”", "“Perché dici questo?”", "“Continua pure”"],
    correct: 1,
    explanation: "Esempio corretto dal manuale: Allenatore «Questo libro è davvero interessante», Studente «Perfetto!» (buon Riconoscimento, ferma la comunicazione)."
  },
  {
    section: 5,
    question: "Nell'Esercizio 7, l'allenatore può porre domande allo studente?",
    options: ["Sì, sempre", "No, solo frasi affermative", "Solo domande retoriche", "Solo alla fine dell'esercizio"],
    correct: 1,
    explanation: "«L'allenatore non può fare domande. Solo frasi affermative»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 8, quante volte di fila su spartiti diversi lo studente deve riuscire per ottenere il pass?",
    options: ["Una", "Tre", "Cinque", "Dieci"],
    correct: 1,
    explanation: "«Quando lo studente lo ha fatto per tre volte di fila su tre spartiti diversi riceve il pass»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 9 (Parte 2), quante monetine riceve lo studente e in quante ore deve spostarle tutte?",
    options: ["3 monetine in 1 ora", "5 monetine in 6 ore", "10 monetine in 24 ore", "5 monetine in 1 giornata intera"],
    correct: 1,
    explanation: "«il Supervisore fornisce allo studente cinque monetine […] Deve riuscire a muovere le cinque monetine entro sei ore»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 10, se l'allenatore si alza e tenta di andarsene, cosa deve fare lo studente?",
    options: [
      "Lasciarlo andare e attendere il suo ritorno",
      "Chiamare subito il Supervisore",
      "Fermarlo fisicamente con dolcezza, farlo sedere e ripetere la domanda",
      "Alzare il tono di voce per farlo tornare"
    ],
    correct: 2,
    explanation: "«In quel caso lo studente deve fermarlo fisicamente (con dolcezza), tornare a farlo sedere e porgli di nuovo la domanda»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 11, quali sono i quattro modi in cui l'interlocutore può reagire a una domanda?",
    options: [
      "Ridere, piangere, arrabbiarsi, tacere",
      "Rispondere, non rispondere, cercare di sviare, esprimere un disagio/condizione personale",
      "Accettare, rifiutare, rimandare, ignorare",
      "Ripetere, correggere, confermare, negare"
    ],
    correct: 1,
    explanation: "Il manuale elenca quattro reazioni possibili: rispondere alla domanda; non rispondere; fare affermazioni che sviano; esprimere un disagio o una condizione personale."
  },
  {
    section: 5,
    question: "Qual è la sequenza corretta di gestione di una condizione personale nell'Esercizio 11?",
    options: [
      "Ignorare, minimizzare, cambiare argomento",
      "Correggere, spiegare, ripetere, concludere",
      "Comprendere, dare riconoscimento, gestire, riportare sulla domanda",
      "Ascoltare, giudicare, consigliare, chiudere"
    ],
    correct: 2,
    explanation: "«Di fronte a un turbamento […] lo studente deve: Comprendere, Dare riconoscimento, Gestire, Riportare sulla domanda»."
  },
  {
    section: 5,
    question: "Nell'Esercizio 12 (“fare il sandwich”), quali sono le quattro parti della procedura?",
    options: [
      "Critica, minaccia, punizione, perdono",
      "Saluto, problema, soluzione, congedo",
      "Elogio, elogio, elogio, correzione finale",
      "Un lato positivo, il lato da migliorare, l'accordo, un altro lato positivo finale"
    ],
    correct: 3,
    explanation: "«Nel sandwich abbiamo: un lato positivo; il lato che vorremmo che la persona migliorasse; accordo; un altro lato positivo per concludere»."
  },
  {
    section: 5,
    question: "Nel “Sandwich”, quali due parole non si devono mai usare?",
    options: ["“Bravo” e “Grazie”", "“Ma” o “Però”", "“Ora” e “Adesso”", "“Sempre” e “Mai”"],
    correct: 1,
    explanation: "«Approccia la persona in modo positivo […] Non dire «Ma» o «Però»»."
  },
  {
    section: 5,
    question: "Qual è la durata prevista per il percorso “Comunicare da Leader” in MBS dall'inizio degli esercizi?",
    options: ["1 sessione", "4 sessioni", "10 sessioni", "2 settimane"],
    correct: 1,
    explanation: "«Il percorso di COMUNICARE DA LEADER in MBS ha la durata di 4 sessioni dall'inizio degli esercizi»."
  },

  // ---------------- SEZIONE 7: Scala delle Emozioni ----------------
  {
    section: 6,
    question: "Nella Scala delle Emozioni, quale livello si trova subito sopra “Collera”?",
    options: ["Risentimento", "Ostilità", "Noia", "Logicità"],
    correct: 1,
    explanation: "L'ordine della scala è: […] Risentimento, Collera, Ostilità, Noia, Logicità […]. Subito sopra Collera si trova Ostilità."
  },
  {
    section: 6,
    question: "Qual è il livello più basso della Scala delle Emozioni citato nel manuale?",
    options: ["Tristezza", "Apatia-Fallimento", "Ansia", "Noia"],
    correct: 1,
    explanation: "«APATIA-FALLIMENTO = un completo ritirarsi dalla gente […] Vicino alla morte, imita la morte»: è il livello più basso elencato."
  },
  {
    section: 6,
    question: "Come viene definita “Ostilità nascosta-Dissimulare”?",
    options: [
      "Un'ira improvvisa che si manifesta con atti e parole",
      "L'odio censurato socialmente: la persona cova disaccordi ma preferisce non esprimerli, spesso elogiando in modo finto",
      "Uno stato di completo distacco dalla realtà",
      "Un forte entusiasmo represso"
    ],
    correct: 1,
    explanation: "«OSTILITA' NASCOSTA-DISSIMULARE = l'odio dell'individuo è censurato socialmente […] Cova disaccordi e dissapori […] ma spesso preferisce non esprimerli. Falso. Spesso elogia in modo finto»."
  },
  {
    section: 6,
    question: "Qual è il livello più alto della Scala delle Emozioni elencato nel manuale?",
    options: ["Allegria", "Forte Interesse", "Entusiasmo", "Logicità"],
    correct: 2,
    explanation: "L'ultimo livello elencato è «ENTUSIASMO = incontenibile spinta ad agire e operare dando tutto sé stesso»."
  },

  // ---------------- SEZIONE 8: Che Cosa Fai / Far Desiderare ----------------
  {
    section: 7,
    question: "Nell'esercizio “Che cosa fai”, se la risposta dello studente non è esaustiva, cosa fa l'allenatore?",
    options: [
      "Passa comunque alla domanda successiva",
      "Fa un lungo coaching esplicativo",
      "Fa leggere la risposta corretta al cliente e ripete la domanda",
      "Interrompe definitivamente l'esercizio"
    ],
    correct: 2,
    explanation: "«Se la risposta non è esaustiva, l'allenatore fa leggere la risposta al cliente. L'allenatore a quel punto ripete la domanda per ottenere la risposta corretta»."
  },
  {
    section: 7,
    question: "Nell'esercizio “Far Desiderare”, dopo aver compreso il desiderio del collaboratore tramite domande (indagine), cosa fa il cliente?",
    options: [
      "Ignora il desiderio e assegna un compito diverso",
      "Promette una ricompensa economica",
      "Riprende il desiderio (stimolazione) ed elenca le azioni operative per ottenere il risultato, cercando l'accordo",
      "Chiede al collaboratore di scrivere da solo un piano"
    ],
    correct: 2,
    explanation: "«Il cliente riprende il desiderio del suo collaboratore (stimolazione) e gli elenca le azioni operative che deve compiere per ottenere il risultato. Ottiene l'accordo e si passa all'azione»."
  },
  {
    section: 7,
    question: "Nella gestione dell'esercizio “Che cosa fai”, cosa NON si deve fare?",
    options: [
      "Riportare lo studente ai dati dell'esercizio",
      "Fare coaching durante l'esercizio o tirare su un caso per spiegarlo",
      "Dare un riconoscimento quando la risposta è corretta",
      "Passare alla domanda successiva dopo una risposta corretta"
    ],
    correct: 1,
    explanation: "«Non si fanno coaching durante l'esercizio. Non si tira su un caso per spiegare l'esercizio»."
  },

  // ---------------- SEZIONE 9: Ostacoli al Confronto ----------------
  {
    section: 8,
    question: "Quali sono i due modi di reagire di un individuo di fronte a un problema che non è disposto ad affrontare?",
    options: [
      "Arrabbiarsi o piangere",
      "Preoccuparsi e introvertirsi, oppure decidere che “la cosa non è poi così importante” e ritirarsi",
      "Parlarne subito con tutti o tacere per sempre",
      "Cambiare lavoro o cambiare città"
    ],
    correct: 1,
    explanation: "«Di fronte a una tale situazione l'individuo ha due modi di reagire: a) Preoccuparsi ed introvertirsi […] b) Decidere che “la cosa […] non è poi così importante” e quindi ritirarsi da essa»."
  },
  {
    section: 8,
    question: "Quali sono gli ostacoli al confronto elencati nel manuale?",
    options: [
      "Paura, Rabbia, Tristezza, Ansia",
      "Segreti, Motivatori, Scarsa autodisciplina, Timidezza personale",
      "Pigrizia, Distrazione, Stanchezza, Fame",
      "Orgoglio, Invidia, Gelosia, Rancore"
    ],
    correct: 1,
    explanation: "Il manuale elenca quattro ostacoli: 1) Segreti; 2) Motivatori; 3) Scarsa autodisciplina; 4) Timidezza a livello personale."
  },
  {
    section: 8,
    question: "Cosa sono i “Motivatori” come ostacolo al confronto?",
    options: [
      "Incentivi economici per lo studente",
      "Frasi motivazionali da ripetere ogni mattina",
      "Obiettivi di vendita mensili",
      "Azioni compensative che l'individuo si aspetta dall'altra persona per compensare qualcosa di male fatto nei suoi confronti"
    ],
    correct: 3,
    explanation: "«Motivatori: cioè azioni “compensative” che l'individuo si aspetta di ricevere dall'altra persona per compensare qualcosa di male che lui ha fatto nei confronti della stessa»."
  },
  {
    section: 8,
    question: "Nella “Relazione ed analisi delle proprie azioni non efficienti”, perché è importante scrivere episodi SPECIFICI e non generici?",
    options: [
      "Perché è più veloce da scrivere",
      "Perché il consulente lo richiede per procedura",
      "Perché scrivere episodi generici equivale a emettere giudizi generali su se stessi, il che non aiuta",
      "Perché altrimenti l'esercizio dura di più"
    ],
    correct: 2,
    explanation: "«Se scrivi degli episodi generici è come se tu stessi emettendo dei giudizi generali su te stesso, cosa che non ti aiuterà»."
  },
  {
    section: 8,
    question: "Cosa suggerisce il manuale una volta individuate le cause della riluttanza ad affrontare?",
    options: [
      "Evitare del tutto le situazioni difficili",
      "Affrontare gradualmente cominciando da cose piccole, con un effetto valanga verso situazioni più grandi",
      "Affrontare subito la situazione più grande possibile",
      "Aspettare che il problema si risolva da solo"
    ],
    correct: 1,
    explanation: "«A volta basta anche solo far sì che l'individuo un po' alla volta, cominciando da cose piccole, cominci di nuovo a sbloccarsi ed affrontare le cose […] Una sorta di effetto valanga»."
  },

  // ---------------- SEZIONE 10: Principi del Comando ----------------
  {
    section: 9,
    question: "Secondo il manuale “Principi del Comando”, cos'è il Controllo?",
    options: [
      "La capacità di imporsi con la forza",
      "Il rispetto rigido degli orari",
      "L'abilità di avviare, cambiare e fermare persone o attività",
      "La gestione amministrativa dell'azienda"
    ],
    correct: 2,
    explanation: "«Per controllo si intende l'abilità di avviare, cambiare e fermare persone o attività, ossia la capacità di far accadere le cose secondo la propria intenzione»."
  },
  {
    section: 9,
    question: "Cosa si intende per “Intenzione Pura”?",
    options: [
      "Un ordine impartito ad alta voce",
      "Un desiderio totale, privo di alternative e dubbi: solo un “piano A”, senza “piano B”",
      "Una regola scritta nel contratto di lavoro",
      "Un'emozione di rabbia tenuta sotto controllo"
    ],
    correct: 1,
    explanation: "«Quando il desiderio è totale, privo di alternative e di dubbi, si manifesta una forma di intenzione pura. Se nella mente non esiste un “piano B”, ma solo un “piano A” […]»."
  },
  {
    section: 9,
    question: "Il percorso “Principi del Comando” può essere affrontato efficacemente senza aver completato prima “Comunicare da Leader”?",
    options: [
      "Sì, sono due percorsi indipendenti",
      "Sì, ma solo per i manager senior",
      "No, non può essere affrontato efficacemente senza aver prima completato con successo Comunicare da Leader",
      "Dipende esclusivamente dal DT"
    ],
    correct: 2,
    explanation: "«Il presente manuale non può essere affrontato efficacemente senza aver prima completato con successo il percorso pratico in aula di Comunicare da Leader»."
  },
  {
    section: 9,
    question: "Nell'Esercizio 6 (Controllo fisico), nella prima metà della seduta come deve dirigere l'allenatore lo studente?",
    options: [
      "Solo con comandi verbali a voce alta",
      "In silenzio, senza comandi verbali, tramite contatto fisico",
      "Tramite messaggi scritti",
      "Lasciandolo libero di muoversi senza alcuna direzione"
    ],
    correct: 1,
    explanation: "«Nella prima metà della seduta di addestramento non ci sono comandi verbali […] lo studente, in silenzio, dirige il corpo dell'allenatore in giro per la stanza»."
  },
  {
    section: 9,
    question: "Nell'Esercizio 7 - Controllo fisico eccellente, quali sono le uniche tre cose dette dall'allenatore a cui lo studente deve dare ascolto?",
    options: ["“Bravo”, “Continua”, “Basta”", "“Attenzione”, “Pronti”, “Via”", "“Via”, “Errore”, “Fine”", "“Sì”, “No”, “Forse”"],
    correct: 2,
    explanation: "«Tra ciò che dice l'allenatore ci sono solo tre cose a cui lo studente deve dare ascolto: “Via” […], “Errore” […] e “Fine”»."
  },
  {
    section: 9,
    question: "Nell'Esercizio 8 - Intenzione pura su un oggetto, quale oggetto viene tipicamente usato?",
    options: ["Un libro di Pinocchio", "Una sedia vuota", "Un portacenere, preferibilmente pesante e di vetro colorato", "Un dizionario"],
    correct: 2,
    explanation: "«Gli oggetti da usare sono portacenere, preferibilmente pesanti, di vetro colorato»."
  },
  {
    section: 9,
    question: "Nell'Esercizio 9 - Intenzione pura su una persona, cosa costituisce sempre un “Errore”?",
    options: [
      "Solo l'uso della voce troppo alta",
      "Solo il fatto di sorridere",
      "Qualsiasi cosa che non sia pura intenzione: sia un lieve sorriso, sia troppa forza, sia troppo poca forza",
      "Solo la lentezza nei movimenti"
    ],
    correct: 2,
    explanation: "«Persino un lieve sorriso da parte dello studente può essere un “Errore”. Troppa forza può essere un “Errore”. Troppo poca forza è decisamente un “Errore”. Qualsiasi cosa che non sia pura intenzione è un “Errore”»."
  },
  {
    section: 9,
    question: "Secondo la “Nota Importante” del manuale Principi del Comando, qual è il gradiente di allenamento previsto?",
    options: [
      "Basso, per non scoraggiare i principianti",
      "Flessibile e adattabile caso per caso, senza rigidità",
      "Solo teorico, senza esercitazioni pratiche",
      "Al massimo livello: ogni minima esitazione o dubbio va segnalata come errore"
    ],
    correct: 3,
    explanation: "«Il gradiente di allenamento previsto in questo manuale è al massimo livello […] non deve essere accettata alcuna sfumatura di errore»."
  }
];
