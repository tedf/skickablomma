# Deployment till Websupport.se

Denna guide visar hur du publicerar skickablomma.se på Websupport webbhotell.

## Förutsättningar

- Node.js 18+ installerat lokalt
- FTP-klient (FileZilla, Cyberduck, eller liknande)
- Websupport-konto med aktivt webbhotell
- Domänen skickablomma.se kopplad till ditt webbhotell

## Steg 1: Förbered projektet

### 1.1 Installera dependencies

```bash
cd skickablomma.se
npm install
```

### 1.2 Använd static export-konfiguration

```bash
# Kopiera static export config
cp next.config.static.ts next.config.ts
```

### 1.3 Skapa miljövariabler

```bash
cp .env.example .env.local
# Redigera .env.local med dina värden
```

## Steg 2: Bygg siten

```bash
npm run build
```

Detta skapar en `/out` mapp med alla statiska filer:

```
out/
├── index.html          # Startsidan
├── buketter/
│   ├── index.html
│   ├── rosor/
│   │   └── index.html
│   └── ...
├── begravning/
│   └── index.html
├── _next/
│   ├── static/         # CSS, JS
│   └── ...
├── images/
└── .htaccess           # Apache-konfiguration
```

## Steg 3: Ladda upp till Websupport

### 3.1 Hämta FTP-uppgifter

1. Logga in på [Websupport kontrollpanel](https://www.websupport.se/login)
2. Gå till **Webbhotell** → **FTP-konton**
3. Notera:
   - Server: ftp.dittdomän.se (eller angivet)
   - Användarnamn: ditt-ftp-användarnamn
   - Lösenord: ditt-ftp-lösenord

### 3.2 Anslut med FTP

**FileZilla-inställningar:**
- Värd: ftp.skickablomma.se
- Användarnamn: [ditt användarnamn]
- Lösenord: [ditt lösenord]
- Port: 21 (eller 22 för SFTP)

### 3.3 Ladda upp filer

1. Navigera till `/public_html/` på servern
2. **Ta bort** eventuellt befintligt innehåll (var försiktig!)
3. Ladda upp **hela innehållet** i `/out` mappen
4. Vänta tills uppladdningen är klar

### Mappstruktur på servern

```
public_html/
├── index.html
├── .htaccess           # VIKTIGT! Måste laddas upp
├── buketter/
├── begravning/
├── _next/
└── images/
```

## Steg 4: Verifiera

1. Besök https://skickablomma.se
2. Testa navigation mellan sidor
3. Kontrollera att bilder laddas
4. Testa sökning och filter

## Automatisera med script

### FTP Deploy Script

Skapa `deploy.sh`:

```bash
#!/bin/bash

# Bygg siten
npm run build

# Ladda upp med lftp (installera: brew install lftp / apt install lftp)
lftp -u $FTP_USER,$FTP_PASS ftp://ftp.skickablomma.se <<EOF
set ssl:verify-certificate no
mirror -R --delete --verbose out/ public_html/
bye
EOF

echo "Deploy klar!"
```

### Alternativ: rsync över SSH (om tillgängligt)

```bash
rsync -avz --delete out/ user@skickablomma.se:~/public_html/
```

## Uppdateringar

När du gör ändringar:

1. Gör dina ändringar i koden
2. Kör `npm run build`
3. Ladda upp den nya `/out` mappen
4. Rensa webbläsarens cache vid behov

### Inkrementell uppdatering

För snabbare uppdateringar, ladda bara upp ändrade filer:

```bash
# Med lftp
lftp -u $FTP_USER,$FTP_PASS ftp://ftp.skickablomma.se -e "mirror -R --only-newer out/ public_html/; bye"
```

## SSL/HTTPS

### Aktivera SSL på Websupport

1. Gå till kontrollpanelen
2. **SSL/TLS** → **Installera certifikat**
3. Välj **Let's Encrypt** (gratis)
4. Aktivera för skickablomma.se

### Uppdatera .htaccess

Avkommentera HTTPS-redirect i `.htaccess`:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Felsökning

### Sidan visas inte
- Kontrollera att `index.html` finns i `public_html/`
- Verifiera att domänen pekar till rätt server

### CSS/JS laddas inte
- Kontrollera att `_next/` mappen laddades upp
- Verifiera sökvägar i webbläsarens Developer Tools

### .htaccess fungerar inte
- Kontrollera att mod_rewrite är aktiverat
- Kontakta Websupport support

### 404-fel på undersidor
- Verifiera att mappstrukturen är korrekt
- Kontrollera `trailingSlash: true` i next.config.ts

## Prestanda-tips

1. **Aktivera Gzip** - Redan konfigurerat i .htaccess
2. **Använd CDN** - Cloudflare fungerar bra med Websupport
3. **Optimera bilder** - Använd WebP-format
4. **Minimera requests** - Next.js gör detta automatiskt

## Alternativ hosting

Om du vill ha Node.js-stöd, överväg:

| Tjänst | Node.js | Pris | Kommentar |
|--------|---------|------|-----------|
| **Vercel** | ✅ | Gratis-$20/mån | Bäst för Next.js |
| **Netlify** | ✅ | Gratis-$19/mån | Enkelt att använda |
| **Railway** | ✅ | $5+/mån | Flexibelt |
| **DigitalOcean** | ✅ | $4+/mån | Mer kontroll |

Med Node.js får du:
- Server-side rendering (SSR)
- API-routes
- Bildoptimering
- Inkrementell regenerering

## Kontakt

Vid problem med Websupport:
- Support: https://www.websupport.se/support
- Telefon: Se kontrollpanelen
