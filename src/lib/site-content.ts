import { SITE } from "./pricing";

export const NAV_LINKS = [
  { href: "/#funzionalita", label: "Funzionalità" },
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/#faq", label: "FAQ" },
];

export const VEHICLE_TYPES = [
  "Auto",
  "SUV",
  "Moto",
  "Furgone",
  "Camper",
  "Veicoli commerciali",
];

export const HERO = {
  eyebrow: "La verità sul tuo veicolo",
  title: "Lo storico della tua auto.",
  titleAccent: "Un clic e basta.",
  subtitle:
    "Proteggiti da truffe, chilometri alterati e veicoli con problemi nascosti scoprendo lo storico disponibile prima di acquistare.",
  cta: "Verifica veicolo",
  trust: ["Dati aggiornati ogni giorno", "Pagamento sicuro Stripe", "Garanzia soddisfatti o rimborsati"],
};

export const FEATURES = {
  label: "Come possiamo aiutarti",
  title: "Tutto ciò che devi sapere, prima di firmare.",
  subtitle:
    "Da chilometraggio e manutenzione a furti e sinistri, ti mostriamo lo storico disponibile del veicolo.",
  items: [
    {
      title: "Storico chilometri",
      description:
        "Verifichiamo incongruenze nel contachilometri e ti aiutiamo a capire se l'uso del veicolo è coerente nel tempo.",
      icon: "gauge",
    },
    {
      title: "Sinistri e danni",
      description:
        "Segnalazioni di incidenti e riparazioni importanti per valutare se l'auto ha avuto problemi seri in passato.",
      icon: "alert",
    },
    {
      title: "Controllo furto",
      description:
        "Incrociamo banche dati per rilevare eventuali segnalazioni di furto e darti maggiore tranquillità.",
      icon: "shield",
    },
    {
      title: "Manutenzione e revisioni",
      description:
        "Revisioni, tagliandi e controlli tecnici per capire quanto il veicolo è stato curato nel tempo.",
      icon: "wrench",
    },
  ],
  extra: "+12 sezioni tra immagini, costi riparazione, dati tecnici, sicurezza e molto altro.",
};

export const STEPS = {
  label: "Come funziona",
  title: "Il tuo report in 3 semplici passaggi.",
  subtitle:
    "Dall'inserimento della targa alla consultazione dei dettagli: verificare un'auto non è mai stato così semplice.",
  items: [
    {
      step: "01",
      title: "Inserisci targa o VIN",
      description:
        "Digita la targa italiana o il numero di telaio (VIN) del veicolo che ti interessa per avviare subito la verifica.",
      link: { href: "/#dove-trovo-vin", label: "Dove trovare il VIN" },
    },
    {
      step: "02",
      title: "Analisi del veicolo",
      description:
        "Il nostro sistema interroga fonti affidabili raccogliendo dati precisi su storico, condizioni e precedenti registrazioni.",
    },
    {
      step: "03",
      title: "Ricevi il report",
      description:
        "Ottieni un report dettagliato e leggibile, disponibile subito sulla piattaforma e nella tua area personale.",
    },
  ],
  cta: "Verifica veicolo",
};

export const STATS = {
  label: "Sicuro, intelligente, semplice",
  title: "Noi verifichiamo, tu guidi.",
  titleAccent: "Con fiducia.",
  items: [
    { value: "2.500+", label: "Report generati a settimana" },
    { value: "100%", label: "Targhe italiane supportate" },
    { value: "1.200+", label: "Veicoli con anomalie rilevate" },
    { value: "€25M+", label: "Valore protetto per gli acquirenti" },
  ],
};

export const MISSION = {
  label: "La nostra missione",
  title: "Rendere lo storico veicoli chiaro, accessibile e affidabile per tutti.",
  paragraphs: [
    "Forniamo report trasparenti basati sui dati disponibili da fonti certificate e partner per aiutarti ad acquistare con serenità.",
    "Il nostro obiettivo è eliminare lo stress dell'acquisto di un'usato rendendo le verifiche semplici e comprensibili.",
  ],
  guarantee:
    "Nei rari casi in cui alcuni dati non possano essere recuperati, ti rimborsiamo integralmente.",
  cta: "Verifica veicolo",
};

export const TESTIMONIALS = {
  label: "Cosa dicono i nostri clienti",
  title: "Esperienze reali di chi ha verificato prima di comprare.",
  items: [
    {
      initials: "MR",
      name: "Marco R.",
      date: "Maggio 2026",
      text: "Report chiarissimo e supporto velocissimo. Ho scoperto un'irregolarità sul chilometraggio e ho evitato un acquisto rischioso.",
    },
    {
      initials: "LS",
      name: "Laura S.",
      date: "Maggio 2026",
      text: "Facilissimo da usare. Ho inserito la targa, pagato e in pochi minuti avevo tutto lo storico nella mia area personale.",
    },
    {
      initials: "GP",
      name: "Giuseppe P.",
      date: "Aprile 2026",
      text: "Ottimo rapporto qualità-prezzo. Il report mi ha permesso di negoziare il prezzo sapendo esattamente lo stato dell'auto.",
    },
    {
      initials: "AF",
      name: "Anna F.",
      date: "Aprile 2026",
      text: "Assistenza in italiano impeccabile. Hanno risposto in meno di 24 ore e risolto ogni mio dubbio sull'acquisto.",
    },
  ],
};

export const PRICING_TEASER = {
  label: "Prezzi trasparenti",
  title: "Il tuo report è a pochi clic di distanza.",
  subtitle:
    "Pacchetti da 15,99 €: pagamento unico, crediti subito disponibili e garanzia 14 giorni.",
  benefits: ["Report basato sui dati disponibili", "Crediti subito sul tuo account", "Garanzia 14 giorni"],
  cta: "Scegli il pacchetto",
};

export const FAQ_ITEMS = [
  {
    question: "Quali informazioni include il report?",
    answer:
      "Il report offre una visione dettagliata del passato del veicolo: storico chilometri, revisioni, sinistri segnalati, dati tecnici, intestatari e altre informazioni utili per una decisione informata.",
  },
  {
    question: "Da dove provengono i dati?",
    answer:
      "I dati provengono da banche dati commerciali, partner certificati e fonti pubbliche o semi-pubbliche accessibili legalmente. CheckTarga.it non è un ente ufficiale e non rilascia visure governative.",
  },
  {
    question: "Perché alcuni dati possono non essere disponibili?",
    answer:
      "La disponibilità dipende dal veicolo, dalla sua storia, dalla regione e dalle fonti consultabili al momento della richiesta. Alcune informazioni potrebbero non essere mai registrate o non essere accessibili.",
  },
  {
    question: "Come ottengo un report su CheckTarga.it?",
    answer:
      "Inserisci la targa italiana o il VIN nella home page, consulta l'anteprima gratuita e completa il pagamento. Dopo la conferma, i crediti sono subito disponibili nella tua area personale.",
  },
  {
    question: "Quanto costano i pacchetti?",
    answer:
      "1 report a 15,99 €, 6 report (3+3 in regalo) a 23,99 €, 10 report (5+5) a 34,99 € e 20 report (10+10) a 49,99 €. Pagamento unico, senza rinnovo automatico.",
  },
  {
    question: "Come funziona il rimborso?",
    answer:
      "Se il report non contiene dati utili rispetto a quanto ragionevolmente atteso, puoi contattarci entro 30 giorni per una verifica. Consulta anche la pagina Rimborso per maggiori dettagli.",
  },
  {
    question: "Quanto tempo viene conservato il report?",
    answer:
      "I report restano consultabili nella tua area personale per il tempo necessario a fornire il servizio e secondo i termini indicati nelle Condizioni generali e nella Privacy Policy.",
  },
  {
    question: "Quali metodi di pagamento accettate?",
    answer:
      "Accettiamo le principali carte di credito e debito tramite Stripe. I dati della carta non transitano sui nostri server.",
  },
  {
    question: "Come posso contattare l'assistenza?",
    answer: `Scrivici a ${SITE.supportEmail} o usa la pagina Contatti. Rispondiamo in genere entro 24 ore, 7 giorni su 7.`,
  },
];

export const SUPPORT = {
  label: "Assistenza dedicata",
  title: "Hai ancora domande? Scrivici.",
  subtitle: "Ti rispondiamo in meno di 24 ore.",
  stats: [
    { value: "100.000+", label: "Clienti soddisfatti" },
    { value: "4 ore", label: "Tempo medio di risposta" },
    { value: "100%", label: "Domande con risposta" },
  ],
  cta: SITE.supportEmail,
};

export const VIN_GUIDE = {
  label: "Cos'è il VIN?",
  title: "Il numero di telaio (VIN) spiegato in modo semplice.",
  description:
    "Il VIN è un codice univoco di 17 caratteri che identifica ogni veicolo. Rivela marca, modello, anno e caratteristiche — nessuna auto ne condivida uno uguale.",
  locations: [
    { title: "Motore", description: "Sul blocco motore, visibile aprendo il cofano." },
    { title: "Telaio portiera", description: "Sul montante della portiera lato guida." },
    { title: "Parabrezza", description: "In basso sul cruscotto, visibile dall'esterno." },
    { title: "Documenti", description: "Sempre presente su libretto, carta circolazione e assicurazione." },
  ],
  cta: "Verifica veicolo",
};

export const FOOTER_COLUMNS = [
  {
    title: "Servizio",
    links: [
      { label: "Verifica targa", href: "/#hero" },
      { label: "Prezzi", href: "/prezzi" },
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Contatti", href: "/contatti" },
      { label: "Esempio report", href: "/esempio-report" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Accedi", href: "/login" },
      { label: "Il mio account", href: "/account" },
      { label: "Assistenza", href: "/contatti" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Condizioni generali", href: "/termini" },
      { label: "Privacy", href: "/privacy" },
      { label: "Note legali", href: "/note-legali" },
      { label: "Cookie", href: "/cookie" },
      { label: "Rimborso", href: "/rimborso" },
    ],
  },
];
