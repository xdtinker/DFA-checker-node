import firefox from 'playwright-firefox';

var OK = '\x1b[33m%s\x1b[0m'
var BAD = '\x1b[31m%s\x1b[0m'
//var assert = require('assert');
async function run(){
  (async () => {
    
    const browser = await firefox.launch({
      headless: true
    });
    const context = await browser.newContext();
  
    // Open new page
    const page = await context.newPage();
  
    // Go to https://www.passport.gov.ph/appointment
    await page.goto('https://www.passport.gov.ph/appointment');
    
    await page.waitForTimeout(2000);
     // Check input[type="checkbox"]
    await page.check('input[type="checkbox"]');
    //x("Step 1....Passed");
    console.log(OK,"Step 1....Passed");
    // Click text=Start Individual Appointment
    await page.click('text=Start Individual Appointment');
    //x("Step 2....Passed");
    console.log(OK,"Step 2....Passed");
    // Select 639
    await page.waitForTimeout(2000);
    //await page.click('#SiteID')
    await page.selectOption('#SiteID' , {'index':1});
    //x("Step 3....Passed");
    console.log(OK,"Step 3....Passed");
    //assert.equal(page.url(), 'https://www.passport.gov.ph/appointment/individual/site');
    await page.waitForTimeout(2000);
    // Click #pubpow-notif >> text=Please check if you agree
    await page.check('input[name="pubpow-notif-checkbox"]');
    //x("Step 4....Passed");
    console.log(OK,"Step 4....Passed");
  
    // Click text=Next
    await page.click('text=Next');
    //x("Step 5....Passed");
    console.log(OK,"Step 5....Passed");
    
    await page.waitForTimeout(5000);
  
    try{
      await page.isVisible('div.tab-content')
      //assert.equal(page.url(), 'https://www.passport.gov.ph/appointment/individual/schedule');
      var on_task = true
      var branch_index = [3,4,7,24,27,31];
      while(on_task){
        for (const element of branch_index) {
            var date = new Date().toLocaleString().toUpperCase();
            await page.waitForTimeout(500);
            await page.waitForSelector("#next-available-date")
            var available_date = await page.$eval("#next-available-date", date_status => date_status.textContent)
            var branch_name = await page.$eval('#SiteID', sel => sel.options[sel.options.selectedIndex].textContent)
            if(available_date.includes("No available date")){
              //x(`NO APPOINTMENT AVAILABLE\n\n${branch_name}\n\n\nStatus: ${available_date}\n\n${date}`)
                console.log(BAD,`NO APPOINTMENT AVAILABLE IN ${branch_name}`)
            }
            else{
              //y(`APPOINTMENT AVAILABLE!!\n\n${branch_name}\n\n\nAvailable date: ${available_date}\n\n${date}`)
              console.log(OK,`APPOINTMENT AVAILABLE IN ${branch_name} DATE: ${available_date}}`)
            }
            await page.selectOption('select#SiteID', {'index' : element});
        }
      }
    }
    catch(err){
        console.log('\x1b[31m%s\x1b[0m' ,err)
        await context.close();
        await browser.close();
    }
    // ---------------------
  })();
}

run()
