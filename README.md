# Hello World PhoneGap Application

> A Hello World application built with PhoneGap

## Usage

### Run Application

    /www/index.html

### Run Tests

    /www/spec.html

### PhoneGap CLI

This repository is automatically downloaded by [phonegap-cli][phonegap-cli-url].

### PhoneGap/Build

Create a new app with the following repository:

    https://github.com/phonegap/phonegap-app-hello-world.git

## Updating the Application

The application is based on the [Apache Cordova Hello World][cordova-app] app.

### 1. Update the Source

    cp cordova-app-hello-world/www www/

__Do not replace `www/config.xml`.__

__Do not replace `www/img/logo.png`.__

### 2. Update index.html

Replace `<h1>Apache Cordova</h1>` with `<h1>PhoneGap</h1>`.

### 3. Update PhoneGap Version

    <preference name="phonegap-version" value="x.x.x" />

### 4. Commit

    $ git commit -am "Version x.x.x"

### 5. Tag

    $ git tag x.x.x

[phonegap-cli-url]: http://github.com/mwbrooks/phonegap-cli
[cordova-app]: http://github.com/apache/cordova-app-hello-world

