const { firefox } = require("playwright-firefox");
const { send_log, send_notif } = require('./telegram.js');

var OK = '\x1b[33m%s\x1b[0m';
var BAD = '\x1b[31m%s\x1b[0m';
var on_task = true
var choice = null
var client_count = ""
class checker {
    static async run() {
        (async() => {
            const browser = await firefox.launch({
                headless: true
            });
            const context = await browser.newContext();
            // Open new page
            const page = await context.newPage();
            if (!on_task) throw send_log("Restart the process using /start")
            try {
                await page.goto('https://www.passport.gov.ph/appointment');
                send_log("Running System checks.");
                await page.waitForTimeout(2000);
                // Check input[type="checkbox"]
                await page.check('input[type="checkbox"]');
                send_log("1/5....Passed");
                console.log(OK, "1/5....Passed");
                if (choice == 1) {
                    // Click text=Start Individual Appointment
                    await page.click('text=Start Individual Appointment');
                } else {
                    // Click text=Start Group Appointment
                    await page.click('text=Start Group Appointment');
                    await page.waitForTimeout(2000);
                    // console.log(client_count)
                    await page.selectOption('#numberOfApplicants', { 'value': String(client_count) });
                    await page.click('text=Next');
                }
                send_log("2/5....Passed");
                console.log(OK, "2/5....Passed");
                await page.waitForTimeout(2000);
                //await page.click('#SiteID')
                await page.selectOption('#SiteID', { 'index': 1 });
                send_log("3/5....Passed");
                console.log(OK, "3/5....Passed");
                //assert.equal(page.url(), 'https://www.passport.gov.ph/appointment/individual/site');
                await page.waitForTimeout(2000);
                // Click #pubpow-notif >> text=Please check if you agree
                //await page.check('input[name="pubpow-notif-checkbox"]');
                await page.click('label[for="pubpow-notif-checkbox"]');
                send_log("4/5....Passed");
                console.log(OK, "4/5....Passed");

                // Click text=Next
                await page.click('text=Next');
                send_log("5/5....Passed");
                console.log(OK, "5/5....Passed");


                send_log("You will be notified when there is available appointment at @DFAPassport_bot");
                await page.isHidden('.oas-loading')

                await page.waitForTimeout(2000)
                var branch_index = [3, 4, 7, 24, 27, 31];

                while (true) {
                    if (on_task === false) {
                        on_task = true
                        break
                    }
                    for (const element of branch_index) {
                        var date = new Date().toLocaleString().toUpperCase();
                        await page.waitForTimeout(500);
                        //await page.waitForSelector("#next-available-date")
                        var available_date = await page.$eval("#next-available-date", date_status => date_status.textContent)
                        var branch_name = await page.$eval('#SiteID', sel => sel.options[sel.options.selectedIndex].textContent)
                        if (available_date.includes("No available date")) {
                            // send_log(`NO APPOINTMENT AVAILABLE\n\n${branch_name}\n\n\nStatus: ${available_date}\n\n${date}`)
                            console.log(BAD, `NO APPOINTMENT AVAILABLE IN ${branch_name}`)
                        } else {
                            send_notif(`APPOINTMENT AVAILABLE!!\n\n${branch_name}\n\n\nAvailable date: ${available_date}\n\n${date}`)
                            console.log(OK, `APPOINTMENT AVAILABLE IN ${branch_name} DATE: ${available_date}}`)
                        }
                        await page.selectOption('select#SiteID', { 'index': element });
                    }
                }
            } catch (err) {
                console.log(BAD, err)
            } finally {
                await context.close();
                await browser.close();
                console.log(BAD, `Task ended.`)
                send_log('Task ended.')
            }
        })();
    }

    static stop() {
        on_task = false
    }
    static individual() {
        choice = 1
    }
    static group(count) {
        choice = 2
        client_count = count
    }
}

module.exports = { checker }
