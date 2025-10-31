// tests/testInicioSesion.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { Select } = require("selenium-webdriver/lib/select");

// 🕒 Función auxiliar para escribir más lento (simula tecleo humano)
async function slowType(element, text, delay = 150) {
  for (const char of text) {
    await element.sendKeys(char);
    await new Promise((r) => setTimeout(r, delay));
  }
}

(async function testInicioSesion() {
  let options = new chrome.Options();
  options.addArguments("--start-maximized");

  let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  const timestamp = Date.now();
  const email = `usuariotest${timestamp}@gmail.com`;
  const password = "Aabc@123";
  const nombre = "UsuarioPrueba";

  try {
    console.log("🚀 Iniciando prueba automática (modo visual lento)...");

    // 1️⃣ Página de registro
    await driver.get("http://localhost:3000/registroUsuario");
    await driver.wait(until.elementLocated(By.css("form.form_registro_usuario")), 10000);
    await driver.sleep(1000);

    // 2️⃣ Llenar formulario con pausas visibles
    const nombreInput = await driver.findElement(By.css(".nombre input"));
    await slowType(nombreInput, nombre);
    await driver.sleep(500);

    const emailInput = await driver.findElement(By.css(".email input"));
    await slowType(emailInput, email);
    await driver.sleep(500);

    const contrasenaInput = await driver.findElement(By.css(".contraseña input.form-control"));
    await slowType(contrasenaInput, password);
    await driver.sleep(500);

    const confirmInput = await driver.findElement(By.css(".confirmacion_contraseña input.form-control"));
    await slowType(confirmInput, password);
    await driver.sleep(500);

    const telefonoInput = await driver.findElement(By.css(".telefono input"));
    await slowType(telefonoInput, "912345678");
    await driver.sleep(500);

    // Región y comuna
    const regionSelectEl = await driver.findElement(By.css(".region select"));
    await driver.wait(until.elementIsEnabled(regionSelectEl), 5000);
    const regionSelect = new Select(regionSelectEl);
    await regionSelect.selectByValue("metropolitana");
    await driver.sleep(1000);

    await driver.wait(until.elementLocated(By.css(".comuna select option[value='Santiago']")), 5000);
    const comunaSelectEl = await driver.findElement(By.css(".comuna select"));
    const comunaSelect = new Select(comunaSelectEl);
    await comunaSelect.selectByValue("Santiago");
    await driver.sleep(1000);

    // 3️⃣ Enviar registro
    const registrarBtn = await driver.findElement(By.css("button.btn.btn-primary"));
    await registrarBtn.click();
    await driver.sleep(800);

    // 4️⃣ Capturar alerta de registro
    await driver.wait(until.alertIsPresent(), 7000);
    const alertRegistro = await driver.switchTo().alert();
    const textoRegistro = await alertRegistro.getText();
    console.log("📢 Alerta registro:", textoRegistro);
    await driver.sleep(1000);
    await alertRegistro.accept();
    await driver.sleep(1000);

    if (!textoRegistro.toLowerCase().includes("exito") && !textoRegistro.toLowerCase().includes("validado")) {
      throw new Error("Registro inválido: " + textoRegistro);
    }

    // 5️⃣ Ir a inicio de sesión
    await driver.get("http://localhost:3000/inicioSesion");
    await driver.wait(until.elementLocated(By.css("form.form_inicio_sesion")), 10000);
    await driver.sleep(1000);

    // 6️⃣ Ingresar credenciales lentamente
    const loginEmail = await driver.findElement(By.css(".correo input.form-control"));
    const loginPass = await driver.findElement(By.css(".contraseña input.form-control"));

    await slowType(loginEmail, email);
    await driver.sleep(500);
    await slowType(loginPass, password);
    await driver.sleep(500);

    // 7️⃣ Iniciar sesión
    const loginBtn = await driver.findElement(By.css("button.btn.btn-primary"));
    await loginBtn.click();
    await driver.sleep(800);

    // 8️⃣ Alerta de login
    await driver.wait(until.alertIsPresent(), 7000);
    const alertLogin = await driver.switchTo().alert();
    const textoLogin = await alertLogin.getText();
    console.log("📢 Alerta login:", textoLogin);
    await driver.sleep(1000);
    await alertLogin.accept();

    if (textoLogin.toLowerCase().includes("exitoso")) {
      console.log("✅ TEST PASADO: Inicio de sesión exitoso con usuario recién registrado");
    } else {
      throw new Error("Inicio de sesión falló: " + textoLogin);
    }

    await driver.sleep(2000); // tiempo extra para ver la pantalla final
  } catch (err) {
    console.error("💥 Error en el test:", err);
    await driver.sleep(3000);
  } finally {
    await driver.quit();
  }
})();
