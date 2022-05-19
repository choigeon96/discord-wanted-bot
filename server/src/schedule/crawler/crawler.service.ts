import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobIdService } from 'src/job-id/job-id.service';
import axios from 'axios';
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');

@Injectable()
export class CrawlerService {
  constructor(private readonly jobIdService: JobIdService) {}
  private readonly logger = new Logger(CrawlerService.name);

  @Cron('0 0/5 * * * *', { name: 'crawler' })
  async handleCron() {
    this.logger.log('Crawler is work');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(process.env.LIST_PAGE_URL);

    await page.waitFor(10000);
    await page.click(
      '[type="button"][data-attribute-id="explore__sort__click"]',
    );
    await page.waitFor(3000);
    await page.click(
      '[name="job.latest_order"][type="button"][data-sort-kind="latest"]',
    );
    await page.waitFor(3000);
    const content = await page.content();
    await page.waitFor(3000);
    const $ = cheerio.load(content, { decodeEntities: true });
    const $bodyList = $(`[data-cy="job-list"]`).children('li');
    const positions = [];
    $bodyList.each(function (i, _) {
      const id = $(this).find('a').attr('href').split('/')[2];
      positions[i] = {
        id,
        url: `${process.env.DETAIL_PAGE_URL}${id}`,
        position: $(this).find('.job-card-position').text(),
        companyName: $(this).find('.job-card-company-name').text(),
        location: $(this)
          .find('.job-card-company-location')
          .text()
          .split('.')[0],
      };
    });

    await page.close();
    await browser.close();
    if (!positions[0].position) {
      console.error('undefined');
      return;
    }
    for (let i = 0; i < positions.length; i++) {
      const isNew = await this.jobIdService.checkDupAndInsert(positions[i].id);
      if (isNew) {
        await this.sendMessage({
          url: positions[i].url,
          position: positions[i].position,
          companyName: positions[i].companyName,
          location: positions[i].location,
        });
      }
    }
    //#region
    // for (let i = 0; i < positions.length; i++) {
    //   const id = positions[i].id.split('/')[2];
    //   const url = `https://www.wanted.co.kr/wd/${id}`;

    //   const detailPage = await browser.newPage();
    //   await detailPage.setViewport({ width: 1366, height: 768 });

    //   await detailPage.goto(url);
    //   detailPage.waitFor(3000);
    //   const detail = await detailPage.content();
    //   const $Job = cheerio.load(detail, { decodeEntities: true });
    //   const $JobBody = $Job('.JobDescription_JobDescription__VWfcb').children(
    //     'p',
    //   );
    //   const res = sanitizeHtml($JobBody, {
    //     parser: {
    //       decodeEntities: true,
    //     },
    //   });
    //   const descriptions = res
    //     .split('</p>')
    //     .map((el) => el.replace('<p><span>', ''));

    //   const location = positions[i].location.split('.')[0];
    //   const task = descriptions[1]
    //     .split('<br />')
    //     .join('\r\n')
    //     .replace('</span>');
    //   const required = descriptions[2]
    //     .split('<br />')
    //     .join('\r\n')
    //     .replace('</span>');
    //   const preferred = descriptions[3]
    //     .split('<br />')
    //     .join('\r\n')
    //     .replace('</span>');
    //   detailPage.close();
    //   console.log({
    //     ...positions[i],
    //     id,
    //     url,
    //     task,
    //     required,
    //     preferred,
    //     location,
    //   });
    //   positions[i] = {
    //     ...positions[i],
    //     id,
    //     url,
    //     task,
    //     required,
    //     preferred,
    //     location,
    //   };
    // }
    //#endregion
  }
  async sendMessage({ url, position, companyName, location }) {
    try {
      const baseURL = process.env.WEB_HOOK_URL;
      const data = {
        userName: process.env.WEB_HOOK_USER_NAME,
        avatar_url: process.env.RECO_URL,
        content: 'wanted에 신입 프론트엔드 개발자 채용 공고가 등록되었습니다!',
        embeds: [
          {
            color: 11730954,
            title: '공고 바로가기',
            url: `${url}`,
            thumbnail: {
              url: process.env.THUMBNAIL_URL,
            },
            fields: [
              {
                name: '회사명',
                value: `${companyName}`,
              },
              {
                name: '포지션',
                value: `${position}`,
              },
              {
                name: '위치',
                value: `${location}`,
              },
            ],
            footer: {
              text: 'choigeon96',
            },
          },
        ],
      };
      axios.post(baseURL, data);
    } catch (err) {
      console.error('discordErr');
    }
  }
}
