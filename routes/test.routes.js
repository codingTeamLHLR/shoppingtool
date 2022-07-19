const router = require("express").Router();
const mongoose = require("mongoose");

const metascraper = require('metascraper')([
    require('@samirrayani/metascraper-shopping')(),
    require('metascraper-title')(),
    require('metascraper-image')(),
    require('metascraper-url')()
]);
const got = require('got');



router.get("/", (req, res, next) => {

    'use strict'
    
    const goShopping = async () => {
      const targetUrl = 'https://www.ebay-kleinanzeigen.de/s-anzeige/petego-comfort-wagon-l-fahrradanhaenger-fuer-hunde-matte-neu/2138853151-313-9488';
      const { body: html, url } = await got(targetUrl);
      const metadata = await metascraper({ html, url });
      console.log(metadata);
      res.render("test", metadata);
    };
    
    goShopping();

})

 module.exports = router;