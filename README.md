# Installazione


Installare `npm`, `nodejs`, `bower`,`grunt` e `compass`

## Configurazione

Modificare l'host per il backend in `app/scripts/factories/dataFactory.js` nella variabile `dataFactory.host`

## Sviluppo

Disabilitare le funzionalità relative a `socket.io` in `index.html` e `app/scripts/controllers/navbarController.js`

Eseguire i comandi  `grunt build` e  `grunt serve` per lanciare l'applicazione in modalità sviluppo


## Produzione

Abilitare le funzionalità relative a `socket.io` in `index.html` e `app/scripts/controllers/navbarController.js`

Generare la versione "dist" tramite il comando `grunt build` e copiare il contenuto della cartella "dist" nella cartella

"public" del server dashboard-backend (https://github.com/calmar3/dashboard-backend) e lanciare il servers NodeJS



