const puppeteer = require('puppeteer');
const cron = require('node-cron');
require("dotenv").config();

// Checkin at 10:00 AM
cron.schedule('00 10 * * 1-5', () => {
  console.log("Mark Checkin at 10:00AM WORKING DAYS (MON-FRI)");

  const credentials = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  }

  checkAction(credentials, checkType = "markCheckin()")
}, {
  scheduled: true,
  timezone: "Asia/Karachi"
});

// Checkout at 08:00 PM
cron.schedule('00 20 * * 1-5', () => {
  console.log("Mark Checkout Out at 08:00PM WORKING DAYS (MON-FRI)");

  const credentials = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  }

  checkAction(credentials, checkType = "markCheckout()")
}, {
  scheduled: true,
  timezone: "Asia/Karachi"
});

const checkAction = async (credentials = {
  username: "",
  password: ""
}, checkType = "markCheckout()" || "markCheckin()") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("Opening Page...");
  await page.goto('https://phaedra.resourceinn.com/#/core/login', {
    waitUntil: 'load'
  });

  await delay(20000);

  // for entering email
  console.log("Entering Email and Passowrd");

  await page.waitForSelector('input[ng-model="userObj.email"]');
  await page.type('input[ng-model="userObj.email"]', credentials.username, {
    delay: 100
  });

  // for entering password
  await page.waitForSelector('input[ng-model="userObj.password"]');
  await page.type('input[ng-model="userObj.password"]', credentials.password, {
    delay: 100
  });

  // Press Login Button
  await page.click('button[type="submit"]');

  // Wait for loading content after login
  await delay(20000);

  // Mark Action (Checkin / Checkout)
  console.log("Performing Action...");

  await page.waitForSelector(`span[ng-click="${checkType}"]`);
  await page.click(`span[ng-click="${checkType}"]`);

  await delay(10000);

  // Confirm action on MODAL
  if (checkType === "markCheckout()") {
    await page.waitForSelector('button[class="confirm"]');
    await page.click('button[class="confirm"]');
  }

  console.log("Task Successfully Completed!!");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}