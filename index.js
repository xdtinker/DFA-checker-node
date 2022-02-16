const { firefox, devices } = require('playwright-firefox');
const { send_log, send_notif } = require('./telegram.js');
const device = devices['iPad Pro 11'];

(async() => {
    const browser = await firefox.launch({
        headless: true
    })
    const context = await browser.newContext({
        locale: 'en-PH',
        timezoneId: 'Asia/Manila',
        viewport: device.viewport,
        userAgent: device.userAgent,
    })

    const page = await context.newPage()
    try {
        isTrue = true
        arr = [0, 1, 4]
        while (isTrue) {
            for await (const i of arr) {
                await page.goto('https://co.dfaapostille.ph/dfa/')

                await page.waitForTimeout(1000)

                await page.click('text=SCHEDULE AN APPOINTMENT')

                await page.click('[data-dismiss="modal"] >> nth=1')

                await page.locator('#Email').fill('aziz.saricula@gmail.com')
                await page.locator('#Password').fill('Anon123s.')

                await page.click('text=LOGIN')
                await page.click('#declaration-agree')
                await page.click('#terms-and-conditions-agree')

                //Home page
                // await page.waitForTimeout(1000)
                await page.click('#show-document-owner')

                // await page.waitForTimeout(1000);
                //0, 1, 4
                await page.selectOption('#site', { 'index': i })
                await page.click('#stepSelectProcessingSiteNextBtn')


                //Document owner   
                await page.locator('#Record_FirstName').fill('Datu Abdulaziz')
                await page.locator('#Record_MiddleName').fill('Matabalao')
                await page.locator('#Record_LastName').fill('Saricula')
                await page.locator('#Record_DateOfBirth').fill('2000-02-25') // birthdate format (yyyy-mm-dd)
                await page.locator('#Record_ContactNumber').fill('9954200802')
                await page.locator('#Record_CountryDestination').selectOption({ 'value': 'Kuwait (KWT)' })

                await page.locator('#documentsSelectionBtn').click()
                await page.locator('#nbiClearance').click()
                await page.locator('#qtyNbiClearanceRegular').fill('1')
                await page.locator('#selectDocumentsBtn').click()

                await page.locator('#stepOneNextBtn').click()


                const available_date = await page.$$('div[class="fc-content"]');
                var branch_name = await page.$eval("#siteAndNameAddress", bname => bname.textContent)
                for await (const dates of available_date) {
                    if (await dates.innerText() == 'Not Available') {
                        // console.log(await dates.innerText());
                        console.log(`NO APPOINTMENT FOUND IN ${branch_name}`)
                    } else {
                        send_notif(`APPOINTMENT FOUND IN ${branch_name}`)
                        isTrue = false
                        break
                    }
                }
                await page.click('.float-right')
            }
        }
    } catch (e) {
        console.log(e);
        send_notif(e)
    } finally {
        await context.close()
        await browser.close()
        send_notif('task ended')
    }
})()
