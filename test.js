const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const sanitizeHtml = require("sanitize-html")

async function crawler() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1366, height: 768 })
  await page.goto(
    "https://www.wanted.co.kr/wdlist/518/669?country=kr&job_sort=company.response_rate_order&years=0&locations=all"
  )

  let content = await page.content()
  await page.waitFor(3000)
  const $ = cheerio.load(content, { decodeEntities: true })
  const $bodyList = $(`[data-cy="job-list"]`).children("li")
  const positions = []
  $bodyList.each(function (i, _) {
    positions[i] = {
      id: $(this).find("a").attr("href"),
      position: $(this).find(".job-card-position").text(),
      companyName: $(this).find(".job-card-company-name").text(),
      location: $(this).find(".job-card-company-location").text(),
    }
  })
  page.close()
  if (!positions[0].position) {
    console.error("undefined")
    return
  }
  for (let i = 0; i < positions.length; i++) {
    const id = positions[i].id.split("/")[2]
    const url = `https://www.wanted.co.kr/wd/${id}`

    const detailPage = await browser.newPage()
    await detailPage.setViewport({ width: 1366, height: 768 })

    await detailPage.goto(url)
    detailPage.waitFor(3000)
    let detail = await detailPage.content()
    const $Job = cheerio.load(detail, { decodeEntities: true })
    const $JobBody = $Job(".JobDescription_JobDescription__VWfcb").children("p")
    const res = sanitizeHtml($JobBody, {
      parser: {
        decodeEntities: true,
      },
    })
    const descriptions = res
      .split("</p>")
      .map((el) => el.replace("<p><span>", ""))

    const location = positions[i].location.split(".")[0]
    const task = descriptions[1].split("<br />").join("\r\n").replace("</span>")
    const required = descriptions[2]
      .split("<br />")
      .join("\r\n")
      .replace("</span>")
    const preferred = descriptions[3]
      .split("<br />")
      .join("\r\n")
      .replace("</span>")
    detailPage.close()
    console.log({
      ...positions[i],
      id,
      url,
      task,
      required,
      preferred,
      location,
    })
    positions[i] = {
      ...positions[i],
      id,
      url,
      task,
      required,
      preferred,
      location,
    }
  }

  return positions
}

crawler()
