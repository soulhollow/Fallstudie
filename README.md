# Fallstudie

Frontend:
Dieses Projekt ist ein auf React basierendes Web-Projekt mit mehreren Bibliotheken wie Axios, Chart.js und React Router. Im Folgenden sind die Anweisungen zur Installation.

## Voraussetzungen

Bevor Sie das Projekt starten, stellen Sie sicher, dass folgende Software installiert ist:

- Node.js (mindestens Version 14)
- npm (Node Package Manager) oder yarn

nach dem clonen gehen Sie bitte in den Projektordner.
Führen Sie folgenden Befehl aus, um alle benötigten Abhängigkeiten zu installieren:

npm install

Projekt starten
Nach der Installation der Abhängigkeiten können Sie das Projekt lokal starten:

npm start

Falls es probleme mit den Bibilotheken gibt oder Sie das Build direkt starten wollen können sie das mit: npx serve -s build machen. 

## Voraussetzungen

Stellen Sie sicher, dass folgende Software installiert ist:

- Java Development Kit (JDK) 17 oder höher
- Maven
- MySQL-Datenbank
- Optional: `Postman` oder ein ähnliches Tool zum Testen von APIs

## Installation

Wechseln Sie in die Anwendung und führen Sie folgenden Befhl aus:
mvn clean install

Die wichtigsten Konfigurationseinstellungen befinden sich in der Datei application.properties. Hier sind einige wesentliche Parameter:

Datenbankverbindung: Die Anwendung verwendet eine MySQL-Datenbank. Stellen Sie sicher, dass die Datenbank läuft und die Verbindungsinformationen korrekt sind.


- spring.datasource.url=jdbc:mysql://localhost:3306/budget_management
- spring.datasource.username=root
- spring.datasource.password=
- JPA-Einstellungen: Die Hibernate-Einstellungen definieren, wie das Datenbank-Schema behandelt wird.

Falls Sie Testdaten wünschen, können Sie diese mit dem SQL script importieren. 
Anmeldedaten: 
Admin: admin@admin.de Passwort: admin
Owner: Owner@admin.de Passwort: admin
Manager: Manager@admin.de Passwort: admin
Finance: Finance@admin.de Passowrt: admin


HTTPS-Konfiguration: Die Anwendung läuft über HTTPS auf Port 8443. Da dies kein offizielles Zertifikat ist, müssen sie auf https://localhost:8443/api und dieser Vertrauen.

server.port=8443
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=admin1

MySQL-Datenbank erstellen: Stellen Sie sicher, dass eine MySQL-Datenbank budget_management vorhanden ist.
Führen sie dafür den Befehl:
CREATE DATABASE budget_management;

Datenbank-Benutzer konfigurieren: Passen Sie den Benutzernamen und das Passwort in der application.properties-Datei entsprechend an.

 
