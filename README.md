# Modern-New-Tab-Page-NoAd
The Ad removed version of Modern New Tab Page extension for chrome browser.

An short introduction for the original version goes [here](http://thenextweb.com/apps/2014/11/16/8-chrome-extensions-transform-new-tab-page/4/).
![screenshot](http://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2014/11/Screen-Shot-2014-11-16-at-11.02.10-am.png)

I like the Modern New Tab Page extension but it is removed from Chrome Web Store because it has Ads.
Chrome will automatically disable it even if one manages to install it from somewhere else.

Therefore, I removed the Ads and repacked it with my private key. Chrome cannot identify it hence Chrome wouldn't disable it anymore.

## Install (chrome seems to block this way)
1. Download from [here](http://eaufavor.info/Modern-New-Tab-Page-NoAd.crx) .
2. Drag the crx file to chrome://extensions/ page.

## Install (this works so far)
1. Clone this repo.
2. (optional)Verify the code is safe to use by yourself.
3. Enable developer mode at chrome://extensions/ page.
2. Choose "load unpacked extension...", and then select the directory of the repo you just cloned.

### Redistribution
If someone wants to publish this version on Chrome Web Store, be my guest. 

### Change-log
2016.1.1
Repack the crx file to fix the "This extension may have been corrupted." problem.

2015.2.26 Retrieve permissions to fix RSS. 
(I lost/changed the packing key also. So it ends up as a new extension if the crx file is is used. Rememberer to export and import the settings from the old extension.)
