@echo off

REM *************** COMANDI DI CONFIGURAZIONE DI CORDOVA ***********************

REM percorso JAVA JDK 
REM E' richiesta espressamente la versione jdk1.8.*
SET JAVA_HOME="C:\Program Files\Android\Android Studio2\jre"

REM percorso ANDROID SDK (copiare dai settings di Android Studio)
SET ANDROID_SDK_ROOT=C:\Users\paolo\AppData\Local\Android\Sdk


SET PATH=%PATH%;"C:\Program Files\Android\Android Studio2\jre";
SET PATH=%PATH%;C:\Users\paolo\AppData\Local\Android\Sdk\tools;
SET PATH=%PATH%;C:\Users\paolo\AppData\Local\Android\Sdk\platform-tools;

REM percorso GRADLE (copiare dai settings di Android Studio)
SET PATH=%PATH%;C:\Users\paolo\.gradle\wrapper\dists\gradle-7.2-all\260hg96vuh6ex27h9vo47iv4d\gradle-7.2\bin;

echo done


