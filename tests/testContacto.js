const { Builder, By, until } = require("selenium-webdriver");

(async function testFormularioContacto() {
  let driver = await new Builder().forBrowser("chrome").build();

  // Función para resaltar elementos
  async function highlightElement(driver, element) {
    await driver.executeScript(
      "arguments[0].style.border='3px solid red'",
      element
    );
  }

  // Pausa
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simula tecleo humano
  async function typeSlowly(element, text) {
    for (let char of text) {
      await element.sendKeys(char);
      await sleep(80);
    }
  }

  // Forzar vaciado de inputs React-friendly
  async function clearReactInput(element) {
    await element.clear();
    await driver.executeScript(`
      const element = arguments[0];
      element.value = '';
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
    `, element);
    await sleep(1000);
  }

  try {
    // Abrir la página de contacto
    await driver.get("http://localhost:3000/contacto");
    console.log("✅ Página 'contacto' abierta correctamente");
    await sleep(3000);

    // Ubicar elementos del formulario
    const inputNombre = await driver.findElement(By.css("input[type='text']"));
    const inputCorreo = await driver.findElement(By.css("input[type='email']"));
    const inputMensaje = await driver.findElement(By.css("textarea"));
    const botonEnviar = await driver.findElement(By.css("button[type='submit']"));

    // Función para enviar formulario y manejar alert
    async function enviarFormulario(nombre, correo, mensaje) {
      // Limpiar cada input individualmente
      await clearReactInput(inputNombre);
      await sleep(500);
      await clearReactInput(inputCorreo);
      await sleep(500);
      await clearReactInput(inputMensaje);
      await sleep(500);

      // Escribir valores lentamente
      await typeSlowly(inputNombre, nombre);
      await sleep(500);
      await typeSlowly(inputCorreo, correo);
      await sleep(500);
      await typeSlowly(inputMensaje, mensaje);
      await sleep(500);

      // Resaltar botón y click
      await highlightElement(driver, botonEnviar);
      await sleep(1000);
      await botonEnviar.click();
      await sleep(1500);

      // Manejar alert si aparece
      try {
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        console.log("🔔 Alert capturado:", await alert.getText());
        await alert.accept();
        await sleep(1500);
      } catch {}
    }

    // Caso exitoso: todos los campos válidos
    await enviarFormulario(
      "Felix Gonzalez",
      "felix@gmail.com",
      "Este es un mensaje de prueba para el formulario"
    );
    console.log("✅ Formulario enviado correctamente (campos válidos)");
    await sleep(3000);

    // Caso inválido: fallo en nombre
    await enviarFormulario(
      "", // nombre vacío
      "felix@gmail.com",
      "Mensaje de prueba"
    );
    console.log("⚠️ Validación fallo en nombre completada");
    await sleep(3000);

    // Caso inválido: fallo en correo
    await enviarFormulario(
      "Felix Gonzalez",
      "correo_invalido@domain.com",
      "Mensaje de prueba"
    );
    console.log("⚠️ Validación fallo en correo completada");
    await sleep(3000);

    // Caso inválido: fallo en mensaje
    await enviarFormulario(
      "Felix Gonzalez",
      "felix@gmail.com",
      "" // mensaje vacío
    );
    console.log("⚠️ Validación fallo en mensaje completada");
    await sleep(3000);

    console.log("✅ Test de formulario de contacto completado");
  } catch (error) {
    console.error("❌ Error durante la prueba:", error);
  } finally {
    await driver.quit();
  }
})();