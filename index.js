const { firefox } = require("playwright-firefox");
const { send_log, send_notif } = require('./telegram.js');


async function main() {
    (async() => {
        const browser = await firefox.launch({
            headless: true
        });
        const context = await browser.newContext();

        const page = await context.newPage();

        try {
            var countdown = 20 * 60 * 1000;
            var timerId = setInterval(function() {
                countdown -= 1000;
                var min = Math.floor(countdown / (60 * 1000));
                var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);
                if (countdown < 0) {
                    clearInterval(timerId)
                    //send_notif(`Checker has reached it's time limit, app will automatically restart __Passport`)
                    throw Error(`Checker has reached it's time limit, app will automatically restart`)
                }
            }, 1000);

            await page.goto('https://www.passport.gov.ph/appointment');
            //send_log("Running System checks.");
            await page.waitForTimeout(2000);

            await page.check('input[type="checkbox"]');
            //send_log("1/5....Passed");
            console.log("1/5....Passed");

            await page.click('text=Start Individual Appointment');

            //send_log("2/5....Passed");
            console.log("2/5....Passed");
            await page.waitForTimeout(2000);

            await page.selectOption('#SiteID', { 'index': 1 });
            //send_log("3/5....Passed");
            console.log("3/5....Passed");

            while (true) {
                await page.waitForTimeout(1000)
                if (await page.isVisible('#pubpow-notif')) {
                    console.log('Element found!');
                    break
                } else {
                    await page.selectOption('#SiteID', { 'index': 1 });
                    console.log('Retrying');
                }
            }

            await page.check('#pubpow-notif-checkbox');
            //send_log("4/5....Passed");
            console.log("4/5....Passed");

            await page.click('text=Next');
            //send_log("5/5....Passed");
            console.log("5/5....Passed");

            await page.isHidden('.oas-loading')

            await page.waitForTimeout(2000)

            //send_log("You will be notified when there is available appointment at @DFAPassport_bot");
            //var branch_index = [3, 4, 7, 24, 27, 31, 32, 51]
            var branch_index = [3, 4, 7, 24, 27, 31]
            while (true) {
                for (const element of branch_index) {
                    await Promise.all([
                        page.isHidden('.oas-loading'),
                        page.waitForSelector('#next-available-date', { state: 'visible' })
                    ]);
                    await page.selectOption('select#SiteID', { 'index': element });
                    var date = new Date().toLocaleString().toUpperCase();
                    
                    var available_date = await page.$eval("#next-available-date", date_status => date_status.textContent)
                    var branch_name = await page.$eval('#SiteID', sel => sel.options[sel.options.selectedIndex].textContent)
                    if (available_date.includes("No available date")) {
                        // send_log(`NO APPOINTMENT AVAILABLE\n\n${branch_name}\n\n\nStatus: ${available_date}\n\n${date}`)
                        console.log(`Status: ${available_date} in ${branch_name}`)
                    } else {
                        send_notif(`APPOINTMENT AVAILABLE!!\n\n${branch_name}\n\n\nAvailable date: ${available_date}\n\n${date}`)
                        console.log(`APPOINTMENT AVAILABLE IN ${branch_name} DATE: ${available_date}}`)
                        //await page.waitForTimeout(1000)
                    }
                    await page.waitForTimeout(500)
                }
            }
        } catch (e) {
            send_log(e.message)
            console.log(e)
        } finally {
            console.log('Exit Status: Finally')
            await context.close();
            await browser.close();
            process.exit(0)
        }
    })();
}

if (require.main === module) {
    main();
}
