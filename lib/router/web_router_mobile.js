'use strict'

const express = require('express');
const dec_strategy = require('lib/controllers/dec_strategy');
const share = require('lib/controllers/mobile/share');
const response_util = require('lib/middlewares/response_util');
const diary_book = require('lib/controllers/mobile/diary_book');

const router = express.Router();

// home page
// router.get('/', site.index);
router.get('/tpl/article/strategy/:_id', response_util, dec_strategy.dec_strategy_homepage);
router.get('/view/share/process.html', response_util, share.share_process_homepage);
router.get('/tpl/diary/book/:diarySetid', response_util, diary_book.diary_book_page);

module.exports = router;