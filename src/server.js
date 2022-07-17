const { json } = require("express");
const express = require("express");
const puppeteer = require('puppeteer');
const app = express();

app.use(json());

app.get("/:id", (req,res)=>{
    const id = parseInt(req.params.id);
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.portaljob-madagascar.com/emploi/liste/page/'+id);
    const emploie = await page.evaluate(()=>{
        let emploie = [];
        let elements = document.querySelectorAll("body > section.col2_max_min > div > div.max > article");
        for (let element of elements) {
            emploie.push({
                //img : element.querySelector('img')?.src || "none",
                title: element.querySelector('body > section.col2_max_min > div > div.max > article> aside.contenu_annonce > h3 > a > strong')?.textContent.trim(),
                name_entrepries: element.querySelector('body > section.col2_max_min > div > div.max > article > aside.contenu_annonce > h4')?.textContent,
                description: element.querySelector('body > section.col2_max_min > div > div.max > article > aside.contenu_annonce > a')?.text.trim(),
                contrat: element.querySelector('body > section.col2_max_min > div > div.max > article > aside.contenu_annonce > h5')?.textContent,
                urgence: element.querySelector('body > section.col2_max_min > div > div.max > article > aside.date_annonce > div.urgent_flag')?.textContent
            })
        }
        return emploie;  
    });
    await browser.close();
    res.send(JSON.stringify(emploie))
})();

})

const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
app.listen(PORT, LOCAL_ADDRESS, () => {
  const address = server.address();
  console.log('server listening at', address);
});