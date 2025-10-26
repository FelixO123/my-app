const { Builder, By, until } = require("selenium-webdriver");

(async function testRegistroUsuario() {
  let driver = await new Builder().forBrowser("chrome").build();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeSlowly(element, text) {
    for (let char of text) {
      await element.sendKeys(char);
      await sleep(80);
    }
  }

  // Limpieza robusta para inputs controlados por React
  async function clearReactInput(element) {
    await driver.executeScript("arguments[0].scrollIntoView(true);", element);
    await element.click();
    await element.sendKeys(
      require('selenium-webdriver').Key.chord(
        require('selenium-webdriver').Key.CONTROL, 'a'
      ),
      require('selenium-webdriver').Key.BACK_SPACE
    );
    await driver.executeScript(`
      const el = arguments[0];
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    `, element);
    await sleep(300);
  }

  async function enviarFormulario({nombre, email, contrasena, confirmacion, telefono, region, comuna}) {
    // Selección robusta de inputs por clase y orden
    const inputsText = await driver.findElements(By.css("input.form-control[type='text']"));
    const inputNombre = inputsText[0];
    const inputEmail = await driver.findElement(By.css("input.form-control[type='email']"));
    const inputsPassword = await driver.findElements(By.css("input.form-control[type='password']"));
    const inputContrasena = inputsPassword[0];
    const inputConfirmacion = inputsPassword[1];
    const inputTelefono = await driver.findElement(By.css("input.form-control[type='number']"));
    const selects = await driver.findElements(By.css("select.form-control"));
    const selectRegion = selects[0];
    const selectComuna = selects[1];
    const botonRegistrar = await driver.findElement(By.css("button[type='submit']"));

    // Limpiar y rellenar
    await clearReactInput(inputNombre);
    await typeSlowly(inputNombre, nombre);
    await clearReactInput(inputEmail);
    await typeSlowly(inputEmail, email);
    await clearReactInput(inputContrasena);
    await typeSlowly(inputContrasena, contrasena);
    await clearReactInput(inputConfirmacion);
    await typeSlowly(inputConfirmacion, confirmacion);
    await clearReactInput(inputTelefono);
    await typeSlowly(inputTelefono, telefono);

    // Región y comuna
    await selectRegion.click();
    await selectRegion.sendKeys(region);
    await sleep(400);
    await selectComuna.click();
    await selectComuna.sendKeys(comuna);
    await sleep(400);

    // Enviar
    await botonRegistrar.click();
    await sleep(1200);
  }

  try {
    await driver.get("http://localhost:3000/registroUsuario");
    console.log("✅ Página 'registroUsuario' abierta correctamente");
    await sleep(1500);

    // Caso exitoso
    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix_registro@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    try {
      await driver.wait(until.alertIsPresent(), 5000);
      let alert = await driver.switchTo().alert();
      console.log("🔔 Alert capturado (éxito):", await alert.getText());
      await alert.accept();
    } catch {}
    await sleep(1000);

    // Validaciones de error por campo
    await enviarFormulario({
      nombre: "",
      email: "felix2@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "correo_invalido@domain.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix3@gmail.com",
      contrasena: "abc",
      confirmacion: "abc",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix4@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc2!",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix5@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "12345678",
      region: "Región Metropolitana",
      comuna: "Santiago"
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix6@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "",
      comuna: ""
    });
    await sleep(500);

    await enviarFormulario({
      nombre: "Felix Gonzalez",
      email: "felix7@gmail.com",
      contrasena: "Aabc1!",
      confirmacion: "Aabc1!",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: ""
    });
    await sleep(500);

    // Validar redirección a inicio de sesión
    const linkInicioSesion = await driver.findElement(By.linkText("Inicia Sesión"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", linkInicioSesion);
    await linkInicioSesion.click();
    await sleep(1000);
    const url = await driver.getCurrentUrl();
    if (url.includes("/inicioSesion")) {
      console.log("✅ Redirección a inicio de sesión exitosa");
    } else {
      console.error("❌ Redirección a inicio de sesión fallida");
    }

    console.log("✅ Test de registro de usuario completado");
  } catch (error) {
    console.error("❌ Error durante la prueba de registro:", error);
  } finally {
    await driver.quit();
  }
})();