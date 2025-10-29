const { Builder, By, Key, until } = require("selenium-webdriver");

(async function testInicioSesion() {
    const driver = await new Builder().forBrowser("chrome").build();

    const PAUSA_GENERAL = 1200;
    const PAUSA_ESCRITURA = 100;
    const PAUSA_ALERTA = 2500;

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function escribirLento(element, texto) {
        for (const char of texto) {
            await element.sendKeys(char);
            await sleep(PAUSA_ESCRITURA);
        }
    }

    async function limpiarInput(element) {
        await element.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
        await driver.executeScript(`
            arguments[0].value = "";
            arguments[0].dispatchEvent(new Event("input", { bubbles: true }));
            arguments[0].dispatchEvent(new Event("change", { bubbles: true }));
        `, element);
        await sleep(300);
    }

    async function capturarAlert(mensajeEsperado = "") {
        try {
            await driver.wait(until.alertIsPresent(), 4000);
            const alert = await driver.switchTo().alert();
            const texto = await alert.getText();
            console.log("🔔 Alert capturado:", texto);
            await sleep(PAUSA_ALERTA);
            if (mensajeEsperado && !texto.includes(mensajeEsperado)) {
                console.warn("⚠️ El mensaje no coincide con lo esperado.");
            }
            await alert.accept();
            console.log("✅ Alerta cerrada.");
        } catch {
            console.warn("⚠️ No se mostró alerta en este caso.");
        }
    }

    async function limpiarLocalStorage() {
        await driver.get("http://localhost:3000");
        await driver.executeScript("localStorage.clear();");
        console.log("🗑️ LocalStorage limpiado.");
    }

    // ======== Función corregida ========
    async function registrarUsuario(usuario) {
        await driver.get("http://localhost:3000/registroUsuario");
        await sleep(PAUSA_GENERAL);

        const inputNombre = await driver.findElement(By.css(".nombre input"));
        const inputEmail = await driver.findElement(By.css(".email input"));
        const inputContrasena = await driver.findElement(By.css(".contraseña input.form-control"));
        const inputConfirmacion = await driver.findElement(By.css(".confirmacion_contraseña input.form-control"));
        const inputTelefono = await driver.findElement(By.css(".telefono input"));
        const selectRegion = await driver.findElement(By.css(".region select"));
        const selectComuna = await driver.findElement(By.css(".comuna select"));
        const botonRegistrar = await driver.findElement(By.css("button[type='submit']"));

        // Llenar inputs
        await limpiarInput(inputNombre); await escribirLento(inputNombre, usuario.nombre);
        await limpiarInput(inputEmail); await escribirLento(inputEmail, usuario.email);
        await limpiarInput(inputContrasena); await escribirLento(inputContrasena, usuario.contrasena);
        await limpiarInput(inputConfirmacion); await escribirLento(inputConfirmacion, usuario.contrasena);
        await limpiarInput(inputTelefono); await escribirLento(inputTelefono, usuario.telefono);

        // Seleccionar región
        await selectRegion.click();
        await driver.wait(async () => {
            const options = await selectRegion.findElements(By.tagName("option"));
            return options.length > 1;
        }, 5000);
        await selectRegion.sendKeys(usuario.region);
        await sleep(500);

        // Esperar a que React genere las opciones de comuna
        await driver.wait(async () => {
            const options = await selectComuna.findElements(By.tagName("option"));
            return options.some(async opt => {
                const text = await opt.getText();
                return text.toLowerCase() === usuario.comuna.toLowerCase();
            });
        }, 5000);
        await selectComuna.sendKeys(usuario.comuna);
        await sleep(500);

        // Enviar formulario
        await driver.executeScript("arguments[0].scrollIntoView(true);", botonRegistrar);
        await driver.executeScript("arguments[0].click();", botonRegistrar);
        await capturarAlert("Formulario validado con éxito");
        await sleep(PAUSA_GENERAL);
    }

    async function iniciarSesion(email, contrasena) {
        await driver.get("http://localhost:3000/inicioSesion");
        await sleep(PAUSA_GENERAL);

        const inputEmail = await driver.findElement(By.css(".correo input"));
        const inputContrasena = await driver.findElement(By.css(".contraseña input.form-control"));
        const botonLogin = await driver.findElement(By.css("button[type='submit']"));

        await limpiarInput(inputEmail);
        await escribirLento(inputEmail, email);

        await limpiarInput(inputContrasena);
        await escribirLento(inputContrasena, contrasena);

        await driver.executeScript("arguments[0].scrollIntoView(true);", botonLogin);
        await driver.executeScript("arguments[0].click();", botonLogin);

        await capturarAlert();
        await sleep(PAUSA_GENERAL);
    }

    try {
        console.log("🧪 Iniciando prueba automática de Inicio de Sesión...");

        await limpiarLocalStorage();

        const usuarioValido = {
            nombre: "Felix Gonzalez",
            email: "felix_prueba@gmail.com",
            contrasena: "Aabc1!",
            telefono: "912345678",
            region: "metropolitana",
            comuna: "Santiago"
        };

        // Registrar usuario automáticamente
        await registrarUsuario(usuarioValido);

        // Casos de prueba
        console.log("\n⚙️ Caso: campos vacíos");
        await iniciarSesion("", "");

        console.log("\n⚙️ Caso: correo correcto, contraseña incorrecta");
        await iniciarSesion(usuarioValido.email, "ContraseñaIncorrecta");

        console.log("\n⚙️ Caso: correo incorrecto, contraseña correcta");
        await iniciarSesion("correo@incorrecto.com", usuarioValido.contrasena);

        console.log("\n⚙️ Caso: ambos campos incorrectos");
        await iniciarSesion("correo@incorrecto.com", "ContraseñaIncorrecta");

        console.log("\n⚙️ Caso: inicio de sesión exitoso");
        await iniciarSesion(usuarioValido.email, usuarioValido.contrasena);

        // Validar redirección
        const linkRegistro = await driver.findElement(By.linkText("Regístrate"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", linkRegistro);
        await driver.executeScript("arguments[0].click();", linkRegistro);
        await sleep(1500);

        const urlActual = await driver.getCurrentUrl();
        if (urlActual.includes("/registroUsuario")) {
            console.log("✅ Redirección a /registroUsuario correcta");
        } else {
            console.error("❌ Error en redirección. URL actual:", urlActual);
        }

        console.log("\n🎉 Prueba completa.");

    } catch (err) {
        console.error("❌ Error en la ejecución del test:", err);
    } finally {
        await sleep(2000);
        await driver.quit();
    }
})();
