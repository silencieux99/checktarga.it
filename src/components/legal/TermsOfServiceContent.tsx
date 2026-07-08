import Link from "next/link";
import { SITE, SUBSCRIPTION_TRIAL_HOURS } from "@/lib/pricing";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mt-10 mb-4 text-xl font-bold text-slate-900 first:mt-0">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-base font-semibold text-slate-800">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function TermsOfServiceContent() {
  return (
    <article className="legal-prose">
      <p className="text-sm font-medium text-slate-500">
        Ultimo aggiornamento: 7 giugno 2026
      </p>

      <p className="text-lg font-semibold text-slate-900 mt-6">
        CONDIZIONI DI UTILIZZO DEL SITO {SITE.domain}
      </p>

      <Section id="generali" title="1. Disposizioni generali">
        <Sub title="1.1. Il contratto">
          <p>
            Le presenti condizioni generali (le &quot;Condizioni&quot;) definiscono le regole di
            utilizzo del sito web {SITE.domain} e dei servizi ivi forniti (collettivamente, &quot;
            {SITE.name}&quot; o il &quot;Servizio&quot;). Le Condizioni costituiscono un accordo
            giuridicamente vincolante tra l&apos;utente e il gestore del Servizio.
          </p>
        </Sub>
        <Sub title="1.2. Finalità">
          <p>
            Il nostro obiettivo è fornire report basati sui dati disponibili sullo storico dei veicoli (i
            &quot;Report&quot;) per aiutarti a prendere decisioni informate nell&apos;acquisto o
            nella valutazione di un veicolo immatricolato in Italia o ricercato tramite targa o VIN.
          </p>
        </Sub>
        <Sub title="1.3. Accettazione">
          <p>
            Accedendo a {SITE.domain} e utilizzandolo, accetti di rispettare le presenti Condizioni.
            Se non accetti una qualsiasi parte di esse, non devi utilizzare il Servizio. Continuando
            a utilizzare il sito, accetti le Condizioni e ogni futuro aggiornamento o modifica.
          </p>
        </Sub>
        <Sub title="1.4. Modifiche">
          <p>
            Ci riserviamo il diritto di modificare le presenti Condizioni in qualsiasi momento. Ogni
            modifica sarà pubblicata su questa pagina e la data di &quot;ultimo aggiornamento&quot;
            in cima sarà aggiornata. Per modifiche rilevanti, potremo informarti via email o
            tramite un avviso ben visibile sul sito. L&apos;uso continuato del Servizio dopo le
            modifiche implica l&apos;accettazione delle Condizioni aggiornate.
          </p>
        </Sub>
        <Sub title="1.5. Documenti correlati">
          <p>
            Le presenti Condizioni integrano anche la nostra{" "}
            <Link href="/privacy" className="text-brand-accent underline underline-offset-2">
              Informativa privacy
            </Link>
            , le{" "}
            <Link href="/note-legali" className="text-brand-accent underline underline-offset-2">
              Note legali
            </Link>{" "}
            e ogni altra policy pubblicata sul sito, che descrivono come trattiamo i dati personali,
            utilizziamo i cookie e ci conformiamo alla normativa italiana ed europea applicabile,
            incluso il Regolamento (UE) 2016/679 (GDPR) e il Codice del consumo (D.Lgs. 206/2005).
          </p>
        </Sub>
      </Section>

      <Section id="definizioni" title="2. Definizioni">
        <Sub title="2.1. Termini definiti">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Report</strong>: documento informativo sullo storico del veicolo (es.
              chilometraggio, revisioni, sinistri segnalati, dati tecnici, intestatari, vincoli
              amministrativi), generato sulla base della targa o del VIN fornito.
            </li>
            <li>
              <strong>Utente professionale</strong>: persona fisica o giuridica che utilizza il
              Servizio per scopi commerciali, industriali, artigianali o professionali.
            </li>
            <li>
              <strong>Abbonamento</strong>: piano a pagamento con rinnovo automatico che consente
              l&apos;accesso periodico a crediti per la generazione di Report.
            </li>
            <li>
              <strong>Utente</strong>: qualsiasi persona che utilizza {SITE.domain}, a titolo
              personale o professionale.
            </li>
            <li>
              <strong>Account</strong>: area personale dell&apos;Utente su {SITE.domain}.
            </li>
            <li>
              <strong>Servizi</strong>: tutti i servizi forniti da {SITE.name}, inclusa la
              generazione e consultazione dei Report.
            </li>
            <li>
              <strong>Credito</strong>: unità virtuale associata all&apos;Account che consente di
              generare un Report per un veicolo.
            </li>
            <li>
              <strong>VIN (Vehicle Identification Number)</strong>: codice alfanumerico univoco di
              17 caratteri assegnato al veicolo dal costruttore.
            </li>
            <li>
              <strong>Targa</strong>: numero di immatricolazione del veicolo in Italia.
            </li>
            <li>
              <strong>Siti di terzi</strong>: siti web non controllati da {SITE.name} ma eventualmente
              collegati al nostro sito.
            </li>
          </ul>
        </Sub>
      </Section>

      <Section id="account" title="3. Account utente">
        <Sub title="3.1. Creazione dell'account">
          <p>
            Per accedere a determinati Servizi, è necessario creare un Account fornendo un
            indirizzo email valido e una password (o utilizzando le credenziali comunicate dopo
            l&apos;acquisto). L&apos;Account consente di gestire l&apos;abbonamento, consultare i
            Report generati e visualizzare i crediti disponibili.
          </p>
        </Sub>
        <Sub title="3.2. Sicurezza dell'account">
          <p>
            Sei responsabile della riservatezza delle credenziali di accesso e di ogni attività
            svolta tramite il tuo Account. Devi informarci immediatamente di qualsiasi uso non
            autorizzato o violazione della sicurezza scrivendo a{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
              {SITE.supportEmail}
            </a>
            .
          </p>
        </Sub>
        <Sub title="3.3. Eliminazione dell'account">
          <p>
            Puoi richiedere la cancellazione del tuo Account contattando il supporto o utilizzando
            le funzioni disponibili nell&apos;area personale. La cancellazione può comportare la
            perdita dell&apos;accesso ai Report già generati e alla gestione dell&apos;abbonamento
            attivo, fatti salvi gli obblighi di legge e le disposizioni sul recesso o sui
            pagamenti già effettuati.
          </p>
        </Sub>
        <Sub title="3.4. Sospensione o risoluzione">
          <p>
            Ci riserviamo il diritto di sospendere o chiudere il tuo Account in caso di violazione
            delle presenti Condizioni o di attività che possano arrecare danno a {SITE.name} o ad
            altri utenti.
          </p>
        </Sub>
      </Section>

      <Section id="abbonamenti" title="4. Abbonamenti, prezzi e vantaggi">
        <p>
          {SITE.name} ti aiuta a prendere decisioni consapevoli sui veicoli che ti interessano. I
          nostri piani di abbonamento offrono accesso ai Report sullo storico automobilistico,
          permettendoti di verificare rapidamente il passato di un veicolo, potenziali criticità e
          lo stato generale prima di investire tempo o denaro.
        </p>

        <Sub title="4.1. Cosa ti offre CheckTarga.it?">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Copertura dati</strong>: informazioni da fonti certificate e partner, per un
              report chiaro sul passato del veicolo.
            </li>
            <li>
              <strong>Tranquillità</strong>: verifiche su chilometraggio, sinistri, revisioni e
              altri elementi utili per evitare acquisti rischiosi.
            </li>
            <li>
              <strong>Risparmio di tempo</strong>: area personale centralizzata per i tuoi Report,
              senza dover consultare più fonti disperse.
            </li>
            <li>
              <strong>Dati aggiornati</strong>: i database vengono aggiornati regolarmente per
              riflettere le informazioni disponibili al momento della richiesta.
            </li>
          </ul>
        </Sub>

        <Sub title="4.2. Opzioni di abbonamento">
          <p>
            <strong>Piano 1 Report — Offerta introduttiva</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Oggi paghi: 4,99 €</li>
            <li>Crediti immediati: 1 Report</li>
            <li>
              Include: 1 report immediato
            </li>
            <li>
              Dopo 3 giorni: abbonamento mensile a 29,99 €/mese
            </li>
            <li>Rinnovo automatico fino alla disdetta</li>
            <li>
              Puoi annullare in qualsiasi momento dal tuo account (vedi{" "}
              <Link href="/disdetta" className="text-brand-accent underline underline-offset-2">
                Disdetta
              </Link>
              ).
            </li>
          </ul>

          <p className="mt-4">
            <strong>Piano 5 Report — Offerta introduttiva</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Oggi paghi: 6,99 €</li>
            <li>Crediti immediati: 5 Report</li>
            <li>
              Dopo 3 giorni: abbonamento mensile a 39,99 €/mese
            </li>
            <li>Rinnovo automatico fino alla disdetta</li>
            <li>
              Puoi annullare in qualsiasi momento dal tuo account (vedi{" "}
              <Link href="/disdetta" className="text-brand-accent underline underline-offset-2">
                Disdetta
              </Link>
              ).
            </li>
          </ul>

          <p className="mt-4">
            <strong>Cosa succede dopo il pagamento iniziale?</strong>
          </p>
          <p>
            L&apos;abbonamento inizia con il pagamento dell&apos;offerta introduttiva. Al momento del
            checkout, la carta di pagamento viene salvata in modo sicuro tramite Stripe per
            consentire i rinnovi automatici. Trascorsi 3 giorni dal primo pagamento, l&apos;abbonamento
            si rinnova automaticamente al prezzo ricorrente indicato sopra, con rinnovo mensile fino a
            disdetta. Puoi annullare in qualsiasi momento dall&apos;area personale o contattando il
            supporto prima del prossimo addebito. Per dettagli, consulta{" "}
            <Link href="/abbonamento" className="text-brand-accent underline underline-offset-2">
              Abbonamento
            </Link>{" "}
            e{" "}
            <Link href="/disdetta" className="text-brand-accent underline underline-offset-2">
              Disdetta
            </Link>
            .
          </p>
        </Sub>

        <Sub title="4.3. Utilizzo dei Report">
          <p>
            <strong>4.3.1. Numero di Report</strong> — Ogni piano prevede un numero determinato di
            crediti per periodo di fatturazione. I crediti non utilizzati entro il ciclo non sono
            generalmente trasferibili al periodo successivo, salvo diversa comunicazione scritta da
            parte nostra.
          </p>
          <p>
            <strong>4.3.2. Accesso al Report</strong> — Ogni Report è generato in base alla targa o
            al VIN fornito e resta consultabile e scaricabile dall&apos;area personale dopo la
            generazione, nei limiti tecnici del Servizio.
          </p>
          <p>
            <strong>4.3.3. Accuratezza dei dati</strong> — {SITE.name} si impegna a fornire
            informazioni attendibili, ma non garantisce la completezza o l&apos;assenza di errori
            delle fonti terze. I Report hanno natura informativa.
          </p>
          <p>
            <strong>4.3.4. Uso non commerciale (utenti privati)</strong> — Per gli utenti
            consumatori, i Report sono destinati a valutazioni personali. Gli utenti professionali
            devono assicurarsi di avere le autorizzazioni necessarie per l&apos;uso commerciale dei
            dati.
          </p>
          <p>
            <strong>4.3.5. Responsabilità dell'utente</strong> — L&apos;utente assume la piena
            responsabilità delle decisioni prese sulla base delle informazioni contenute nel Report.
          </p>
        </Sub>

        <Sub title="4.4. Pagamenti">
          <p>
            I pagamenti sono elaborati da Stripe. {SITE.name} non memorizza i dati completi della
            carta. L&apos;utente autorizza l&apos;addebito del pagamento iniziale e dei rinnovi
            successivi secondo il piano scelto, fino a disdetta dell&apos;abbonamento.
          </p>
        </Sub>
      </Section>

      <Section id="disdetta" title="5. Condizioni di disdetta">
        <Sub title="5.1. Come disdire">
          <p>
            Puoi disdire l&apos;abbonamento in qualsiasi momento dall&apos;area personale (sezione
            abbonamento) o scrivendo a{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
              {SITE.supportEmail}
            </a>
            .
          </p>
          <p>
            Per le istruzioni passo-passo, visita{" "}
            <Link href="/disdetta" className="text-brand-accent underline underline-offset-2">
              Disdetta
            </Link>
            .
          </p>
        </Sub>
        <Sub title="5.2. Decorrenza della disdetta">
          <p>
            Dopo la disdetta, manterrai l&apos;accesso ai crediti e ai Servizi già pagati fino alla
            fine del ciclo di fatturazione in corso. Non verranno effettuati ulteriori addebiti
            automatici, salvo riattivazione volontaria dell&apos;abbonamento.
          </p>
        </Sub>
        <Sub title="5.3. Nessun rimborso proporzionale">
          <p>
            Salvo quanto previsto dalla legge applicabile o dal diritto di recesso (sezione 7),{" "}
            {SITE.name} non effettua rimborsi parziali o proporzionali per disdette effettuate a
            ciclo già iniziato.
          </p>
        </Sub>
      </Section>

      <Section id="rimborsi" title="6. Politica di rimborso">
        <Sub title="6.1. Regola generale">
          <p>
            Fatto salvo quanto indicato nella sezione 7 (Diritto di recesso) per i consumatori UE/Italia
            o quanto imposto dalla legge, {SITE.name} non offre rimborsi per i canoni di abbonamento
            una volta iniziato il relativo ciclo di fatturazione, qualora i Servizi siano stati resi
            disponibili.
          </p>
        </Sub>
        <Sub title="6.2. Circostanze eccezionali">
          <p>
            In casi rari, come interruzioni prolungate del Servizio imputabili a {SITE.name}, potremo
            — a nostra discrezione — concedere un rimborso o un credito. Per questioni di
            fatturazione, contatta{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
              {SITE.supportEmail}
            </a>
            .
          </p>
        </Sub>
        <Sub title="6.3. Garanzia soddisfatti o rimborsati">
          <p>
            Se un Report non contiene dati utili rispetto a quanto ragionevolmente atteso per il
            veicolo cercato, puoi contattarci entro 30 giorni per una verifica. Ove applicabile,
            potremo offrire un nuovo credito o un rimborso secondo la nostra valutazione e la
            normativa vigente.
          </p>
        </Sub>
      </Section>

      <Section id="recesso" title="7. Diritto di recesso (consumatori)">
        <Sub title="7.1. Periodo di recesso di 14 giorni">
          <p>
            I consumatori residenti nell&apos;Unione europea, in conformità agli artt. 52 e seguenti
            del Codice del consumo italiano e alla normativa sui contratti a distanza, hanno diritto
            di recedere dal contratto entro 14 giorni dall&apos;acquisto iniziale, senza obbligo di
            motivazione, a condizione che non abbiano ancora utilizzato i crediti per generare Report.
          </p>
        </Sub>
        <Sub title="7.2. Rinuncia per contenuto digitale immediato">
          <p>
            Acquistando e generando un Report, oppure utilizzando i crediti associati
            all&apos;abbonamento, il consumatore richiede l&apos;esecuzione immediata del servizio
            digitale e riconosce che, una volta iniziato l&apos;utilizzo, può perdere il diritto di
            recesso per quel periodo, nei limiti consentiti dalla legge.
          </p>
        </Sub>
        <Sub title="7.3. Come esercitare il recesso">
          <p>
            Le richieste di recesso vanno inviate a{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
              {SITE.supportEmail}
            </a>{" "}
            indicando email dell&apos;Account, data dell&apos;acquisto e piano sottoscritto.
          </p>
        </Sub>
      </Section>

      <Section id="responsabilita-utente" title="8. Responsabilità dell'utente">
        <Sub title="8.1. Attività vietate">
          <p>
            È vietato utilizzare sistemi automatizzati (bot, spider, scraper) per accedere al
            Servizio o svolgere attività che ne compromettano il funzionamento.
          </p>
        </Sub>
        <Sub title="8.2. Conformità legale">
          <p>
            Devi assicurarti che l&apos;uso di {SITE.domain} sia conforme a tutte le leggi
            applicabili. Uso illegale o non autorizzato può comportare la chiusura immediata
            dell&apos;Account.
          </p>
        </Sub>
        <Sub title="8.3. Divieto di rivendita">
          <p>
            È vietata la rivendita o ridistribuzione dei Report senza autorizzazione esplicita,
            al fine di preservare l&apos;integrità del Servizio.
          </p>
        </Sub>
        <Sub title="8.4. Accuratezza delle informazioni">
          <p>
            Sei responsabile dell&apos;esattezza delle informazioni fornite (targa, VIN, email,
            dati di pagamento). Informazioni false o fuorvianti possono comportare la chiusura
            dell&apos;Account.
          </p>
        </Sub>
        <Sub title="8.5. Finalità lecite">
          <p>
            Accetti di utilizzare {SITE.domain} e i suoi contenuti solo per finalità lecite. Ogni
            uso illecito o dannoso comporterà la risoluzione immediata e possibili azioni legali.
          </p>
        </Sub>
      </Section>

      <Section id="limitazione" title="9. Responsabilità e limitazioni">
        <Sub title="9.1. Esclusione di garanzia">
          <p>
            Tutte le informazioni e i Report su {SITE.domain} sono forniti &quot;così come sono&quot;.
            Pur impegnandoci per l&apos;accuratezza, {SITE.name} non garantisce la completezza,
            l&apos;accuratezza o l&apos;affidabilità assoluta dei dati provenienti da terzi.
          </p>
        </Sub>
        <Sub title="9.2. Decisioni dell'utente">
          <p>
            Sei l&apos;unico responsabile della verifica dell&apos;accuratezza e pertinenza delle
            informazioni prima di qualsiasi decisione (acquisto, vendita, permuta, leasing). I Report
            non sostituiscono una perizia meccanica, una consulenza legale o le verifiche presso
            autorità competenti.
          </p>
        </Sub>
        <Sub title="9.3. Limitazione di responsabilità">
          <p>
            Utilizzando {SITE.domain}, riconosci di fare affidamento sulle informazioni fornite a tuo
            rischio. Nei limiti massimi consentiti dalla legge italiana, {SITE.name}, i suoi
            collaboratori e partner non saranno responsabili per danni diretti, indiretti,
            incidentali, consequenziali o punitivi — inclusi mancati guadagni, perdita di opportunità
            o perdite finanziarie — derivanti da azioni o transazioni basate sui contenuti del
            Servizio, anche se fossimo stati informati della possibilità di tali danni.
          </p>
        </Sub>
        <Sub title="9.4. Forza maggiore">
          <p>
            Non siamo responsabili per ritardi o inadempimenti dovuti a eventi fuori dal nostro
            ragionevole controllo (guasti di rete, indisponibilità di fonti dati, eventi naturali,
            provvedimenti dell&apos;autorità, ecc.).
          </p>
        </Sub>
      </Section>

      <Section id="proprieta" title="10. Proprietà intellettuale">
        <p>
          Il sito, il marchio, i testi, il layout, il software e ogni materiale associato sono di
          proprietà di {SITE.name} o dei rispettivi titolari e sono protetti dalle leggi sulla
          proprietà intellettuale. È vietata la riproduzione non autorizzata.
        </p>
      </Section>

      <Section id="legge" title="11. Legge applicabile e foro competente">
        <p>
          Le presenti Condizioni sono regolate dalla legge italiana. Per i consumatori, resta fermo
          il foro inderogabile del luogo di residenza o domicilio del consumatore, ove applicabile.
          Per i professionisti, foro competente esclusivo: Italia, salvo diversa disposizione
          inderogabile di legge.
        </p>
      </Section>

      <Section id="aggiornamenti" title="12. Ultimo aggiornamento">
        <p>
          Le presenti Condizioni sono state aggiornate il 7 giugno 2026. Ci riserviamo il diritto di
          aggiornare questo documento in qualsiasi momento. Modifiche rilevanti saranno comunicate via
          email o avviso sul sito.
        </p>
      </Section>

      <Section id="trasferimento" title="13. Trasferimento di proprietà">
        <p>
          In caso di vendita, fusione o trasferimento di {SITE.name} a un&apos;altra società
          (&quot;Nuovo proprietario&quot;), gli abbonamenti attivi potranno continuare sotto la
          gestione del Nuovo proprietario. Gli abbonati manterranno le condizioni in corso — prezzi,
          calendario di rinnovo e funzionalità — salvo comunicazione contraria esplicita. Per
          domande o disdetta in seguito a un cambio di proprietà, contatta{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </Section>

      <Section id="contatti" title="14. Contatti">
        <p>
          Per domande sulle presenti Condizioni, per disdire o modificare l&apos;abbonamento:
        </p>
        <ul className="list-none space-y-1 pl-0">
          <li>
            Email:{" "}
            <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline">
              {SITE.supportEmail}
            </a>
          </li>
          <li>
            Sito web:{" "}
            <a href="https://checktarga.it" className="text-brand-accent underline">
              https://checktarga.it
            </a>
          </li>
        </ul>
        <p className="mt-4 text-slate-700">
          Le informazioni disponibili possono variare in base al veicolo e alle fonti consultabili.
        </p>
        <p className="mt-6 text-slate-700">
          Utilizzando {SITE.domain}, accetti le presenti Condizioni e le policy correlate. Grazie per
          aver scelto {SITE.name} — siamo felici di aiutarti a prendere decisioni più consapevoli
          sul tuo prossimo veicolo!
        </p>
      </Section>
    </article>
  );
}
