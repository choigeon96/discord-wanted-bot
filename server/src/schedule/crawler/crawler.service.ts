import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobIdService } from 'src/job-id/job-id.service';
import axios from 'axios';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

interface IJobInfo {
  id: string;
  url: string;
  position: string;
  companyName: string;
  location: string;
}
@Injectable()
export class CrawlerService {
  constructor(private readonly jobIdService: JobIdService) {}
  private readonly logger = new Logger(CrawlerService.name);

  @Cron('0 0/5 * * * *', { name: 'crawler' })
  async handleCron() {
    this.logger.log('Crawler is work');

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(process.env.LIST_PAGE_URL);
    await page.waitForSelector('ul.clearfix > li:nth-child(5)');
    await page.click(
      '[type="button"][data-attribute-id="explore__sort__click"]',
    );
    await page.click(
      '[name="job.latest_order"][type="button"][data-sort-kind="latest"]',
    );
    await page.waitForSelector('ul.clearfix > li:nth-child(5)');

    const content = await page.content();
    const $ = cheerio.load(content, { decodeEntities: true });
    const $bodyList = $(`[data-cy="job-list"]`).children('li');

    const jobs: IJobInfo[] = [];
    $bodyList.each(function (i, _) {
      console.log('aaa');
      const id = $(this).find('a').attr('href').split('/')[2];
      jobs[i] = {
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

    if (!jobs[0].position) {
      console.error('undefined');
      return;
    }
    for (let i = 0; i < jobs.length; i++) {
      const isDup = await this.jobIdService.checkDup(jobs[i].id);
      if (isDup) continue;
      this.logger.log('New Job!!!');
      await this.sendMessage(jobs[i]);
    }

    this.logger.log('Crawler is Finish');
  }
  async sendMessage(job: IJobInfo) {
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
            url: `${job.url}`,
            thumbnail: {
              url: process.env.THUMBNAIL_URL,
            },
            fields: [
              {
                name: '회사명',
                value: `${job.companyName}`,
              },
              {
                name: '포지션',
                value: `${job.position}`,
              },
              {
                name: '위치',
                value: `${job.location}`,
              },
            ],
          },
        ],
      };
      await axios.post(baseURL, data);

      this.jobIdService.insertJobId(job.id);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
