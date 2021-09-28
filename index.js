const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

// import webdriver from 'selenium-webdriver';
// import chrome from 'selenium-webdriver/chrome';
// import chromedriver from 'chromedriver';
var o = new chrome.Options();
o.addArguments("user-data-dir=/Users/macbook/agung/selenium/Data/");

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let driver = new webdriver.Builder()
  .forBrowser('chrome')
  .withCapabilities(webdriver.Capabilities.chrome())
  .setChromeOptions(o)
  .usingServer('http://localhost:4444/wd/hub')
  .build();
let open = false;
let queue = false;

function sendMessageQueue(s, phone) {
  return new Promise(async (resolve, reject) => {
    let success = false;
    let i = 0;
    while (true) {
      i++;
      if (i > 30) break;
      if (queue == false) {
        success = true
        break;
      }
      await timeout(1000);
    }
    if (success) {
      result = await sendMessage(s, phone)
      resolve(result)
    } else {
      reject("timeout")
    }

  });
}

async function sendMessage(text, phone) {
  // let driver = await new Builder().forBrowser('chrome').build();
  // let driver = await chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

  if (!open) {
    await driver.get('https://web.whatsapp.com');
    open = true;
  }
  queue = true;

  // let elem = await driver.wait(until.elementsLocated(By.xpath("//div[@class='_13NKt copyable-text selectable-text']")), 30000);
  // await elem[0].sendKeys();
  // await elem[0].sendKeys(phone);
  // await timeout(2000);
  let inChat = true;

  // await driver.wait(until.elementsLocated(By.className("YGe90")), 1000)
  //   .then(async (listChat) => {
  //     if (listChat.length > 1) {
  //       try {
  //         await listChat[0].click();
  //         await timeout(100);
  //         await listChat[1].click();
  //         await timeout(100);
  //       } catch (err) {
  //         console.log("not clickable")
  //       }
  //       await timeout(1000);
  //     } else {
  //       console.log("satu saja")
  //       await listChat[0].click();
  //       await timeout(100);
  //     }
  //   }).catch(async (err) => {
  //     console.log("tidak ditemukan")
  //     await driver.navigate().to('https://web.whatsapp.com/send?phone=' + phone);
  //     inChat = false;
  //   })

  await driver.navigate().to('https://web.whatsapp.com/send?phone=' + phone);
  inChat = false;


  try {
    let valid = true,
      i = 0
    while (true) {
      i++
      if (i > 90) break;

      try {
        elem = await driver.wait(until.elementsLocated(By.className("_13NKt")), 1000);
        if (elem.length > 1) {
          console.log(`no telepon valid`, { phone, text })
          text = text.replace("\n", Key.SHIFT + Key.ENTER + Key.SHIFT)

          await elem[1].sendKeys(text, Key.ENTER)
          await timeout(1000);
          break;
        } else {
          console.log(`cari lagi`)
          continue
        }
      } catch (err) {
        console.log(`cari lagi`)
      }

      // if (!inChat) {
      //   let validNo = await driver.wait(until.elementLocated(By.className("_2Nr6U")), 1000).catch(err => {
      //     return false;
      //   });
      //   console.log(`debug`, validNo)
      //   if (validNo !== false) {
      //     console.log(`no telepon tidak valid`)
      //     valid = false;
      //     break;
      //   }
      // }

    }

    if (!valid) {
      console.log(`no telepon tidak valid`)
      queue = false;
      return { success: false }
    }


    console.log("sukses")
    queue = false;
    return { success: true }

  } catch (err) {
    return { success: true, error_message: "Terjadi Kesalahan" }
  }
}


const express = require('express');
const { text } = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  let input = req.query
  sendMessageQueue(input.text || "-", input.phone)
    .then(res => {
      console.log("Berhasil mengirim pesan")
    })
  res.send("oke");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})