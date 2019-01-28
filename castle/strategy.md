---
author:
- Nathan IMMACOLATO
title:
- Strategy
---

# Naive scraping

https://scotch.io/tutorials/scraping-the-web-with-node-js

index.js

Didn't give any way near expected results.

# Query construction

https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data

https://www.npmjs.com/package/fetch

curl 'https://www.relaischateaux.com/us/destinations/europe' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.116' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Referer: https://www.relaischateaux.com/us/search/results' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' -H 'Cookie: PHPSESSID=b9035593460933f25e6c9d22c8eacca6; favoriteLanguage=en_US; rc_first_time_on_site=1; device_view=full; _ga=GA1.2.110206429.1548074672; __utmc=179322407; __utmz=179322407.1548074673.1.1.utmcsr=duckduckgo.com|utmccn=(referral)|utmcmd=referral|utmcct=/; rc_cnil=%7B%22googleAnalytics%22%3Atrue%2C%22rtbMakazi%22%3Atrue%2C%22twitterAds%22%3Atrue%2C%22adwords%22%3Atrue%2C%22cloudfront%22%3Atrue%2C%22yahoo%22%3Atrue%2C%22makazi%22%3Atrue%2C%22doubleClick%22%3Atrue%2C%22twitter%22%3Atrue%2C%22facebook%22%3Atrue%2C%22linkedin%22%3Atrue%2C%22pinterest%22%3Atrue%2C%22gplus%22%3Atrue%2C%22piksel%22%3Atrue%2C%22googleMaps%22%3Atrue%2C%22bookatable%22%3Atrue%2C%22abTasty%22%3Atrue%7D; _gid=GA1.2.281478032.1548677523; __utma=179322407.110206429.1548074672.1548074673.1548677523.2; __utmt_UA-49756601-1=1; _sp_ses.1d1b=*; _fbp=fb.1.1548677523480.1566169055; __utmb=179322407.2.10.1548677523; _sp_id.1d1b=4b0d67d9-faaa-4aa6-965a-aeb7ca47c92b.1548074695.2.1548677565.1548074881.b7dd7664-4a41-4ed8-a60c-29f46fe07d12; ABTasty=uid%3D19012113443277819%26fst%3D1548074672121%26pst%3D1548074672121%26cst%3D1548677525906%26ns%3D2%26pvt%3D12%26pvis%3D2%26th%3D118878.166572.12.2.2.1.1548074672141.1548677565553.1_179024.247045.12.2.2.1.1548074672151.1548677565556.1_201390.276412.12.2.2.1.1548074672162.1548677565559.1; ABTastySession=sen%3D25__referrer%3D__landingPage%3Dhttps%3A//www.relaischateaux.com/us/__referrerSent%3Dtrue' --compressed

This gives interesting results, the information is there.
Now I can't use this, as the teacher wants only javascript to be used, so to find a way to translate curl in acceptable js.


fetch("https://www.relaischateaux.com/us/destinations/europe", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","upgrade-insecure-requests":"1"},"referrer":"https://www.relaischateaux.com/us/search/results","referrerPolicy":"origin-when-cross-origin","body":null,"method":"GET","mode":"cors"});

There's probably this that I can use, if I can understand how it works.

So we have in /fetch all hotel/restaurants of france.
We want only the hotels of it, and the name of the restaurant associated to it, which is not necessarily the same.
Then we will compare that name to the michelin scraping to be done, where the names aren't necessarily quite the same either.
From that, we will only keep only the ones having a macaron in the michelin database
